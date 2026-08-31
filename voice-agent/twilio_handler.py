import os
import re
import urllib.parse
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Gather, Redirect
from dotenv import load_dotenv
from appointment_manager import update_lead_call_status, get_lead_details
from lily_agent import generate_greeting, detect_hindi

load_dotenv()

def format_e164(phone: str) -> str:
    """Format phone number to international E.164 standard"""
    cleaned = re.sub(r'[^0-9+]', '', str(phone or ''))
    if cleaned.startswith('+'):
        return cleaned
    if len(cleaned) == 10:
        return f'+91{cleaned}'
    if len(cleaned) == 11 and cleaned.startswith('0'):
        return f'+91{cleaned[1:]}'
    if len(cleaned) == 12 and cleaned.startswith('91'):
        return f'+{cleaned}'
    return cleaned

def get_twilio_client():
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    api_key = os.getenv("TWILIO_API_KEY_SID")
    api_secret = os.getenv("TWILIO_API_KEY_SECRET")

    # Use primary root Account SID + Auth Token for full voice call authorization
    if account_sid and auth_token and not auth_token.startswith("your_"):
        return Client(account_sid, auth_token)
    elif api_key and api_secret and account_sid:
        return Client(api_key, api_secret, account_sid=account_sid)
    return None

def get_base_webhook_url() -> str:
    raw_webhook = os.getenv("TWILIO_WEBHOOK_URL") or "http://localhost:8001"
    webhook_base = raw_webhook.split("->")[0].strip().rstrip("/")
    if not webhook_base.startswith("http"):
        webhook_base = f"https://{webhook_base}"
    return webhook_base

async def initiate_outbound_call(lead_data: dict) -> dict:
    """
    Trigger an outbound phone call via Twilio REST API to the prospective lead.
    """
    raw_phone = lead_data.get("phone") or lead_data.get("mobile")
    if not raw_phone:
        print("[Twilio Handler] No phone number provided in lead data.")
        return {"status": "skipped", "reason": "NO_PHONE"}

    phone = format_e164(raw_phone)
    client = get_twilio_client()
    from_number = os.getenv("TWILIO_PHONE_NUMBER")
    
    webhook_base = get_base_webhook_url()
    lead_name = lead_data.get("name") or "Customer"
    lead_id = lead_data.get("leadId") or lead_data.get("id") or ""
    encoded_name = urllib.parse.quote(str(lead_name))
    encoded_lead_id = urllib.parse.quote(str(lead_id))

    call_url = f"{webhook_base}/voice-webhook?lead_id={encoded_lead_id}&name={encoded_name}"

    if not client or not from_number:
        print(f"[Twilio Handler Simulation] Outbound call simulated to {phone} for {lead_name}.")
        update_lead_call_status(lead_id, "called")
        return {"status": "simulated", "phone": phone}

    try:
        call = client.calls.create(
            to=phone,
            from_=from_number,
            url=call_url,
            method="POST",
            timeout=60,         # Ring for 60 seconds (no premature drop)
            time_limit=1200     # Allow up to 20 minutes call length
        )
        print(f"[Twilio Handler] Call initiated: SID {call.sid} to {phone} (URL: {call_url})")
        update_lead_call_status(lead_id, "called")
        return {"status": "initiated", "call_sid": call.sid}
    except Exception as e:
        print(f"[Twilio Handler Error]: {e}")
        update_lead_call_status(lead_id, "failed")
        return {"status": "error", "error": str(e)}

def build_welcome_twiml(lead_data: dict) -> str:
    """
    Build TwiML XML with persistent Gather + Redirect loop (never drops the call).
    """
    vr = VoiceResponse()
    greeting = generate_greeting(lead_data, "hi")
    webhook_base = get_base_webhook_url()
    lead_id = lead_data.get("leadId") or lead_data.get("id") or ""
    encoded_lead_id = urllib.parse.quote(str(lead_id))
    action_url = f"{webhook_base}/gather-response?lead_id={encoded_lead_id}"

    gather = Gather(
        input="speech",
        action=action_url,
        method="POST",
        timeout=8,               # 8 seconds of listening window
        speechTimeout="auto",    # Automatic phrase detection
        language="hi-IN",
        profanityFilter=False,
        hints="bearing, NTN, SKF, NSK, THK, quotation, price, appointment, Bangalore, tomorrow, kal, subah, haan, theek, bilkul"
    )
    gather.say(greeting, voice="Polly.Aditi", language="hi-IN")
    vr.append(gather)

    # If no speech detected in first 8s, redirect to retry loop instead of hanging up
    vr.redirect(f"{webhook_base}/gather-response?lead_id={encoded_lead_id}&silence=1", method="POST")
    return str(vr)

def build_response_twiml(reply_text: str, lead_data: dict = None, is_hindi: bool = True, is_final: bool = False) -> str:
    """
    Build TwiML XML with Gather + Redirect loop for ongoing, uninterrupted conversation.
    """
    vr = VoiceResponse()
    voice_name = "Polly.Aditi" if is_hindi else "Polly.Kajal"
    lang_code = "hi-IN" if is_hindi else "en-IN"
    webhook_base = get_base_webhook_url()
    lead_id = (lead_data.get("leadId") or lead_data.get("id") or "") if lead_data else ""
    encoded_lead_id = urllib.parse.quote(str(lead_id))
    action_url = f"{webhook_base}/gather-response?lead_id={encoded_lead_id}"

    if is_final:
        # Final appointment confirmation or polite goodbye
        vr.say(reply_text, voice=voice_name, language=lang_code)
        vr.hangup()
    else:
        # Ongoing conversation: Gather user speech, then loop with Redirect if quiet
        gather = Gather(
            input="speech",
            action=action_url,
            method="POST",
            timeout=8,
            speechTimeout="auto",
            language=lang_code,
            profanityFilter=False,
            hints="bearing, NTN, SKF, NSK, THK, quote, rate, appointment, morning, afternoon, kal, haan, theek, Bangalore, haanji, bilkul"
        )
        gather.say(reply_text, voice=voice_name, language=lang_code)
        vr.append(gather)

        # Loop back on silence (Call NEVER hangs up)
        vr.redirect(f"{webhook_base}/gather-response?lead_id={encoded_lead_id}&silence=1", method="POST")

    return str(vr)
