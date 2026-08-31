import os
import asyncio
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from twilio_handler import initiate_outbound_call, build_welcome_twiml, build_response_twiml
from lily_agent import process_customer_turn, generate_greeting, detect_hindi
from appointment_manager import get_lead_details, cache_lead_data, save_call_log

load_dotenv()

app = FastAPI(
    title="Universal Enterprise | Lily Voice Agent",
    description="Automated AI Voice Assistant for Industrial Bearing Sourcing and Appointment Booking",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory call sessions: { call_sid: { "lead_data": dict, "history": list, "silence_retries": int } }
call_sessions = {}

async def delayed_outbound_call(lead_data: dict, delay_seconds: int = 45):
    """
    Queue outbound call with a 45-second buffer (under 1 minute) to allow customer to finish web browsing.
    """
    target_phone = lead_data.get('phone') or lead_data.get('mobile') or 'N/A'
    target_name = lead_data.get('name') or 'Customer'
    lead_id = lead_data.get('leadId') or lead_data.get('id') or ''
    
    # Pre-cache lead data
    cache_lead_data(lead_id, lead_data)
    
    print(f"[Lily Queue] Call scheduled for '{target_name}' ({target_phone}) in {delay_seconds} seconds...")
    await asyncio.sleep(delay_seconds)
    print(f"[Lily Queue] Delay complete. Triggering Twilio outbound call to {target_phone}...")
    await initiate_outbound_call(lead_data)

@app.get("/")
@app.get("/health")
async def health_check():
    return {
        "service": "Universal Enterprise Lily Voice Agent",
        "status": "operational",
        "port": 8001,
        "engine": "FastAPI + Groq Qwen/Llama + Twilio Neural Voice"
    }

@app.post("/trigger-call")
async def trigger_call(request: Request, background_tasks: BackgroundTasks):
    """
    Endpoint called asynchronously by the Node.js backend when a lead is submitted.
    """
    try:
        data = await request.json()
        target_phone = data.get('phone') or data.get('mobile')
        target_name = data.get('name') or 'Customer'
        lead_id = data.get('leadId') or data.get('id') or ''
        
        # Cache immediately
        cache_lead_data(lead_id, data)
        print(f"[Lily Voice Service] Received lead trigger for: {target_name} ({target_phone}) [Inquiry: {data.get('productInterest') or data.get('message')}]")
        
        # Schedule call in background with 45-second delay
        background_tasks.add_task(delayed_outbound_call, data, delay_seconds=45)
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "status": "queued",
                "message": f"Outbound call scheduled in 45s for {target_name} ({target_phone})"
            }
        )
    except Exception as e:
        print(f"[Trigger Call Error]: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

@app.post("/voice-webhook")
async def voice_webhook(request: Request):
    """
    Twilio Webhook when outbound call connects.
    """
    lead_id = request.query_params.get("lead_id", "")
    name = request.query_params.get("name", "Customer")
    form_data = await request.form()
    call_sid = form_data.get("CallSid") or request.query_params.get("CallSid") or "active_call"

    # Fetch full lead details from MongoDB or Cache
    lead_data = get_lead_details(lead_id)
    if not lead_data or not lead_data.get("name"):
        lead_data = {
            "leadId": lead_id,
            "name": name,
            "productInterest": "Precision Industrial Bearings"
        }

    # Initialize active call session
    initial_greeting = generate_greeting(lead_data, "hi")
    call_sessions[call_sid] = {
        "lead_data": lead_data,
        "lead_id": lead_id,
        "history": [{"role": "assistant", "content": initial_greeting}],
        "silence_retries": 0
    }

    twiml_xml = build_welcome_twiml(lead_data)
    return Response(content=twiml_xml, media_type="application/xml")

@app.post("/gather-response")
async def gather_response(request: Request):
    """
    Twilio Webhook returning speech recognition result with non-dropping conversational loop.
    """
    form_data = await request.form()
    speech_result = form_data.get("SpeechResult", "").strip()
    call_sid = form_data.get("CallSid", "active_call")
    lead_id = request.query_params.get("lead_id", "")
    is_silence = request.query_params.get("silence") == "1"
    
    print(f"[Lily Call {call_sid}] Customer Speech: '{speech_result}' (is_silence: {is_silence})")

    session = call_sessions.get(call_sid)
    if not session:
        lead_data = get_lead_details(lead_id) or {"name": "Customer", "productInterest": "Bearings"}
        session = {"lead_data": lead_data, "lead_id": lead_id, "history": [], "silence_retries": 0}
        call_sessions[call_sid] = session

    lead_data = session.get("lead_data", {})
    history = session.get("history", [])

    # Handle silence without dropping call
    if not speech_result:
        retries = session.get("silence_retries", 0) + 1
        session["silence_retries"] = retries
        call_sessions[call_sid] = session

        if retries >= 5:
            # Polite goodbye only after 5 consecutive silent intervals (approx 45 seconds of silence)
            goodbye_reply = f"Shukriya {lead_data.get('name', 'ji')}! Hamari engineering team aapse WhatsApp aur email par sampark karegi. Aapka din shubh rahe!"
            twiml_xml = build_response_twiml(goodbye_reply, lead_data=lead_data, is_hindi=True, is_final=True)
            save_call_log(call_sid, lead_id, lead_data, history, outcome="Unreachable")
            return Response(content=twiml_xml, media_type="application/xml")
        else:
            # Soft re-prompt to keep conversation alive
            reprompt = f"Namaste {lead_data.get('name', '')} ji, kya aap mujhe sun paa rahe hain? Main Universal Enterprise se aapke bearing requirement ke baare mein baat kar rahi thi."
            twiml_xml = build_response_twiml(reprompt, lead_data=lead_data, is_hindi=True, is_final=False)
            return Response(content=twiml_xml, media_type="application/xml")

    # Speech detected — reset silence counter
    session["silence_retries"] = 0

    # Add customer turn to history
    history.append({"role": "user", "content": speech_result})

    # Process turn with Groq AI using full lead profile
    result = await process_customer_turn(
        lead_data=lead_data,
        user_speech=speech_result,
        conversation_history=history
    )

    reply_text = result["reply_text"]
    is_booked = result.get("is_booked", False)
    is_hindi = result.get("is_hindi", True)

    history.append({"role": "assistant", "content": reply_text})
    session["history"] = history
    call_sessions[call_sid] = session

    # If appointment was booked, save complete log into MongoDB Atlas CRM
    if is_booked:
        save_call_log(call_sid, lead_id, lead_data, history, outcome="Qualified")

    twiml_xml = build_response_twiml(reply_text, lead_data=lead_data, is_hindi=is_hindi, is_final=is_booked)
    return Response(content=twiml_xml, media_type="application/xml")

import uvicorn
uvicorn.run(app, host="0.0.0.0", port=8001)
