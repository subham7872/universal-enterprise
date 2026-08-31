import os
import re
from groq import Groq
from dotenv import load_dotenv
from appointment_manager import book_appointment

load_dotenv()

groq_client = None

def get_groq_client():
    global groq_client
    if groq_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if api_key:
            groq_client = Groq(api_key=api_key)
    return groq_client

LILY_SYSTEM_PROMPT = """You are Lily, the highly respectful, polite, and warm Senior AI Sourcing Specialist for UNIVERSAL ENTERPRISE (Bangalore, India) — India's premier authorized industrial bearings and motion engineering distributor.

--- CUSTOMER PROFILE IN THIS CALL ---
- Customer Name: {name}
- Phone: {phone}
- Email: {email}
- Company: {company}
- Sourcing Inquiry / Part Requested: {product_interest}
- Message Submitted: {message}

--- COMPANY & PRODUCT MASTERY ---
- Company: UNIVERSAL ENTERPRISE | GST: 29AAGFU1019D1ZF
- Head Office & Central Stocking Warehouse: No. 7, 4th Cross, Kalasipalya New Extension, Bangalore – 560002, India.
- Regional Support Hubs: Bangalore Central, Mumbai, Delhi, Chennai, Kolkata.
- Official Contact: +91 9900726939 / 8123836939 | Email: ue14.email@gmail.com
- Authorized Stockist for: NTN, NSK, THK, SKF, FAG, INA, TIMKEN, KOYO, IKO, NACHI, HIWIN, SCHAEFFLER.
- Catalog Knowledge: Deep Groove Ball Bearings (6000, 6200, 6300, 6400, C3 clearance, 2RS/ZZ seals), Angular Contact Bearings & Machine Spindles (7000, 7200, 7300, B7000 P4S Class 4 up to 32,000 RPM), Self-Aligning Bearings (1200, 1300, 2200, 2300), Four-Point Contact (QJ200, QJ300), Bearing Housing units (UC200, UK200, INA GRA/GYE), and THK/Hiwin Linear Motion Guides & Ball Screws.

--- POLITE, SWEET & RESPECTFUL COMMUNICATION RULES ---
1. RESPECTFUL & WARM TONE:
   - Always address the customer respectfully as "{name} ji" (in Hindi) or "Mr./Ms. {name}" (in English).
   - Use polite, sweet Hindi phrases: "Namaste {name} ji", "Ji bilkul", "Aap bilkul chinta mat kijiye", "Aapse baat karke bahut khushi hui", "Shukriya", "Dhanyawad".
2. NATURAL BILINGUAL CONVERSATION:
   - If the customer speaks Hindi or Hinglish, speak fluent, sweet, conversational Hindi.
   - If the customer speaks English, speak polished, polite English.
3. CONCISE PHONE TURNS:
   - Keep each turn to 1 to 2 sweet, complete, clear sentences. Never speak long monologues.
4. REASSURE & SOLVE INQUIRY:
   - Immediately acknowledge their inquired item: "{product_interest}".
   - Reassure genuine quality: "Hamare paas direct 100% genuine factory test certificates ke saath fresh stock available hai."
   - Reassure best OEM pricing: "Hum aapko wholesale OEM discounted rate provide karenge."
5. APPOINTMENT BOOKING OBJECTIVE:
   - Politely propose a 15-minute consultation with a senior engineer:
     "Kya kal subah 11 baje hamare senior bearing engineer aapse call par connect kar sakte hain aapki exact requirements finalize karne ke liye?"
6. FINAL CONFIRMATION:
   - When customer agrees to a time (e.g. tomorrow / kal / 11 AM / morning / afternoon / theek hai), confirm warmly:
     "Bahut bahut dhanyawad {name} ji! Maine kal subah 11 baje aapka appointment confirm kar diya hai. Hamare senior engineer aapse connect karenge. Aapka din bahut shubh rahe!"
"""

def detect_hindi(text: str) -> bool:
    """Detect if the speech is in Hindi / Hinglish"""
    hindi_keywords = ["namaste", "haan", "nahi", "kya", "bol", "raha", "rahi", "hoon", "kaise", "chahiye", "kal", "batao", "dhanyawad", "aap", "kitna", "rate", "bhejo", "karo", "acha", "theek", "ji", "shukriya"]
    lowered = (text or "").lower()
    return any(k in lowered for k in hindi_keywords) or bool(re.search(r'[\u0900-\u097F]', text or ""))

def generate_greeting(lead_data: dict, preferred_lang: str = "hi") -> str:
    name = lead_data.get("name", "Customer")
    product = lead_data.get("productInterest") or lead_data.get("message") or "industrial bearings"

    if preferred_lang == "hi":
        return f"Namaste {name} ji, main Universal Enterprise Bangalore se Lily baat kar rahi hoon. Aapne hamare portal par {product} ke liye inquiry submit ki thi, kya main aapse do minute baat kar sakti hoon?"
    return f"Hello {name}, this is Lily calling from Universal Enterprise Bangalore regarding your inquiry for {product}. Do you have two minutes to discuss your requirement?"

async def process_customer_turn(lead_data: dict, user_speech: str, conversation_history: list) -> dict:
    """
    Process customer speech via Groq AI with polite tone and appointment booking.
    """
    client = get_groq_client()
    lead_name = lead_data.get("name", "Customer")
    phone = lead_data.get("phone") or lead_data.get("mobile", "")
    email = lead_data.get("email", "")
    company = lead_data.get("company", "Website Buyer")
    product_interest = lead_data.get("productInterest") or lead_data.get("message") or "Industrial Bearings"
    message = lead_data.get("message") or "Bearing sourcing quote inquiry"

    if not client:
        return {
            "reply_text": f"Bahut bahut dhanyawad {lead_name} ji. Hamare senior bearing engineer kal subah 11 baje aapse connect karenge.",
            "is_booked": True,
            "is_hindi": True
        }

    # Inject full customer context into system prompt
    system_prompt = (
        LILY_SYSTEM_PROMPT
        .replace("{name}", str(lead_name))
        .replace("{phone}", str(phone))
        .replace("{email}", str(email))
        .replace("{company}", str(company))
        .replace("{product_interest}", str(product_interest))
        .replace("{message}", str(message))
    )

    messages = [{"role": "system", "content": system_prompt}]
    for msg in conversation_history:
        messages.append(msg)

    messages.append({"role": "user", "content": user_speech})

    try:
        try:
            response = client.chat.completions.create(
                model="qwen/qwen3.8-27b",
                messages=messages,
                temperature=0.5,
                max_tokens=140
            )
        except Exception:
            response = client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=messages,
                temperature=0.5,
                max_tokens=140
            )
        reply = response.choices[0].message.content.strip()
        is_hindi = detect_hindi(reply) or detect_hindi(user_speech)

        # Check if appointment is agreed upon
        is_booked = bool(
            re.search(r'(confirmed|scheduled|booked|pack kar diya|11 baje|11 am|11:00|tomorrow morning|kal subah|appointment confirm|call karenge|shubh rahe)', reply.lower())
            and len(conversation_history) >= 2
        )

        date_str = "Tomorrow"
        time_str = "11:00 AM"

        if is_booked:
            book_appointment(
                lead_id=lead_data.get("leadId") or lead_data.get("id"),
                customer_name=lead_name,
                phone=phone,
                email=email,
                date_str=date_str,
                time_str=time_str,
                notes=f"Booked during phone conversation with Lily AI. Inquired part: {product_interest}"
            )

        return {
            "reply_text": reply,
            "is_booked": is_booked,
            "is_hindi": is_hindi,
            "date": date_str,
            "time": time_str
        }

    except Exception as e:
        print(f"[Lily Agent Groq Error]: {e}")
        return {
            "reply_text": f"Bahut bahut dhanyawad {lead_name} ji. Hamari engineering team aapse jald hi connect karegi.",
            "is_booked": False,
            "is_hindi": True
        }
