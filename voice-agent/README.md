# Universal Enterprise | Lily AI Voice Agent

Lily is an autonomous AI voice calling assistant for **Universal Enterprise** that follows up on incoming industrial bearing sourcing inquiries, confirms quotation parameters, and books appointments with technical sales engineers.

---

## 🚀 Setup & Run Instructions

### 1. Prerequisites
- Python 3.10+
- Twilio account (Account SID, Auth Token, Phone Number)
- Groq API Key (for low-latency conversation logic)
- OpenAI API Key (for Whisper STT & TTS audio synthesis)

### 2. Installation
```bash
cd voice-agent
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Environment Configuration
Create or edit `voice-agent/.env`:
```env
PORT=8001
HOST=0.0.0.0
BACKEND_URL=http://localhost:6060
MONGODB_URI=mongodb+srv://...

TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
TWILIO_WEBHOOK_URL=https://your-ngrok-subdomain.ngrok.app

GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 4. Running Locally in Development
1. Start the FastAPI Voice Agent service:
```bash
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

2. Expose the port for Twilio webhooks using ngrok:
```bash
ngrok http 8001
```
3. Copy your ngrok HTTPS forwarding URL (e.g. `https://abcd-123.ngrok.app`) and set it as `TWILIO_WEBHOOK_URL` in `voice-agent/.env`.

---

## 📞 Call Flow Overview

```
User Submits Web Inquiry / Chat Lead
         ↓
Node.js Backend (POST /api/leads/submit)
         ↓
Async Trigger (POST http://localhost:8001/trigger-call)
         ↓
Lily Queues Outbound Call (45-second user buffer)
         ↓
Twilio Calls Customer Phone (+91...)
         ↓
Customer Answers → Lily Speaks Bilingual Greeting (EN / HI)
         ↓
Groq LLaMA 3.3 Processes Conversation & Answers Technical Queries
         ↓
Customer Agrees on Time Slot → MongoDB Appointment Created
         ↓
Lead Status Updated to 'Booked' in CRM Portal
```
