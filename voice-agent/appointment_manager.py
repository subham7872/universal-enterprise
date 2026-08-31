import os
import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

mongo_client = None
db = None

# In-memory lead cache for active call sessions
lead_cache = {}

def get_db():
    global mongo_client, db
    if db is None:
        mongo_uri = os.getenv("MONGODB_URI")
        if mongo_uri:
            try:
                mongo_client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
                db = mongo_client.get_database("universal_enterprise")
                print("[MongoDB Voice Agent] Connected to MongoDB Atlas.")
            except Exception as e:
                print(f"[MongoDB Voice Agent Connection Error]: {e}")
    return db

def cache_lead_data(lead_id: str, lead_data: dict):
    """Cache lead data in memory for immediate call access"""
    if lead_id and lead_data:
        lead_cache[str(lead_id)] = lead_data
        if lead_data.get("phone"):
            lead_cache[str(lead_data["phone"])] = lead_data

def get_lead_details(lead_id: str) -> dict:
    """Fetch complete lead profile from MongoDB Atlas or memory cache"""
    if not lead_id:
        return {}

    # Check memory cache first
    if str(lead_id) in lead_cache:
        return lead_cache[str(lead_id)]

    database = get_db()
    if database is not None:
        try:
            leads_col = database["leads"]
            from bson import ObjectId
            lead = None
            try:
                lead = leads_col.find_one({"_id": ObjectId(lead_id)})
            except Exception:
                lead = leads_col.find_one({"id": lead_id})

            if lead:
                data = {
                    "leadId": str(lead.get("_id") or lead.get("id")),
                    "name": lead.get("name", "Customer"),
                    "phone": lead.get("phone") or lead.get("mobile", ""),
                    "email": lead.get("email", ""),
                    "company": lead.get("company", "Website Visitor"),
                    "productInterest": lead.get("productInterest") or lead.get("message", "Industrial Bearings"),
                    "message": lead.get("message", "General Bearing Sourcing Inquiry"),
                    "source": lead.get("source", "contact")
                }
                lead_cache[str(lead_id)] = data
                return data
        except Exception as e:
            print(f"[Fetch Lead Error]: {e}")

    return lead_cache.get(str(lead_id), {})

def book_appointment(lead_id: str, customer_name: str, phone: str, email: str, date_str: str, time_str: str, notes: str = ""):
    """
    Create a new appointment in MongoDB and update the corresponding Lead status.
    """
    database = get_db()
    apt_doc = {
        "title": f"Technical Consultation — {customer_name}",
        "customerName": customer_name,
        "phone": phone,
        "email": email or "ue14.email@gmail.com",
        "date": date_str or (datetime.date.today() + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
        "time": time_str or "11:00 AM",
        "type": "Technical Consultation",
        "status": "Scheduled",
        "bookedBy": "Lily AI Voice Agent",
        "notes": notes or "Appointment scheduled during outbound voice consultation",
        "createdAt": datetime.datetime.utcnow()
    }

    if database is None:
        print("[Appointment Manager] Database not connected. Simulating appointment booking.")
        return {"id": "APT-MOCK", "status": "booked"}

    try:
        appointments_col = database["appointments"]
        leads_col = database["leads"]

        result = appointments_col.insert_one(apt_doc)
        apt_id = result.inserted_id

        # Update lead callStatus to 'booked' and status to 'Qualified'
        if lead_id:
            try:
                from bson import ObjectId
                leads_col.update_one(
                    {"_id": ObjectId(lead_id)},
                    {"$set": {"callStatus": "booked", "appointmentId": apt_id, "status": "Qualified"}}
                )
            except Exception:
                leads_col.update_one(
                    {"id": lead_id},
                    {"$set": {"callStatus": "booked", "appointmentId": apt_id, "status": "Qualified"}}
                )

        print(f"[Appointment Manager] Successfully booked appointment {apt_id} for {customer_name}")
        return {"id": str(apt_id), "status": "booked"}
    except Exception as e:
        print(f"[Appointment Manager Error]: {e}")
        return {"error": str(e)}

def save_call_log(call_sid: str, lead_id: str, lead_data: dict, transcript_history: list, outcome: str = "Qualified"):
    """
    Save complete call log, transcript, and qualification summary into MongoDB for CRM display.
    """
    database = get_db()
    customer_name = lead_data.get("name", "Prospective Buyer")
    phone = lead_data.get("phone") or lead_data.get("mobile", "")

    # Format transcript items
    formatted_transcript = []
    for msg in transcript_history:
        formatted_transcript.append({
            "speaker": "Buyer" if msg.get("role") == "user" else "Lily AI",
            "text": msg.get("content", ""),
            "time": datetime.datetime.now().strftime("%I:%M %p")
        })

    call_doc = {
        "callId": call_sid or f"CALL-{int(datetime.datetime.utcnow().timestamp())}",
        "leadName": customer_name,
        "phone": phone,
        "duration": "1m 30s",
        "transcript": formatted_transcript,
        "qualificationSummary": f"Spoke regarding {lead_data.get('productInterest', 'Bearing inquiry')}. Customer confirmed requirement parameters.",
        "outcome": outcome,
        "agentType": "Lily AI Voice Sourcing Agent",
        "callDate": datetime.date.today().strftime("%Y-%m-%d"),
        "createdAt": datetime.datetime.utcnow()
    }

    if database is None:
        print(f"[Call Log Simulation] Saved log for {customer_name} ({call_sid})")
        return

    try:
        call_logs_col = database["call_logs"]
        leads_col = database["leads"]

        call_logs_col.insert_one(call_doc)

        # Append chat snippets to Lead in CRM
        if lead_id:
            chat_snippets = [
                {"sender": "assistant" if t["speaker"] == "Lily AI" else "user", "text": t["text"], "time": t["time"]}
                for t in formatted_transcript
            ]
            try:
                from bson import ObjectId
                leads_col.update_one(
                    {"_id": ObjectId(lead_id)},
                    {
                        "$set": {"lastActivity": "Completed call with Lily AI"},
                        "$push": {"chatHistory": {"$each": chat_snippets}}
                    }
                )
            except Exception:
                leads_col.update_one(
                    {"id": lead_id},
                    {
                        "$set": {"lastActivity": "Completed call with Lily AI"},
                        "$push": {"chatHistory": {"$each": chat_snippets}}
                    }
                )

        print(f"[Call Log Manager] Call log saved to MongoDB for {customer_name} (ID: {call_sid})")
    except Exception as e:
        print(f"[Call Log Save Error]: {e}")

def update_lead_call_status(lead_id: str, status: str):
    """Update lead call status ('pending', 'called', 'booked', 'failed')"""
    database = get_db()
    if database is None or not lead_id:
        return

    try:
        leads_col = database["leads"]
        try:
            from bson import ObjectId
            leads_col.update_one({"_id": ObjectId(lead_id)}, {"$set": {"callStatus": status}})
        except Exception:
            leads_col.update_one({"id": lead_id}, {"$set": {"callStatus": status}})
    except Exception as e:
        print(f"[Update Lead Call Status Error]: {e}")
