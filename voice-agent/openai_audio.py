import os
import io
import httpx
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

openai_client = None

def get_openai_client():
    global openai_client
    if openai_client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            openai_client = OpenAI(api_key=api_key)
    return openai_client

async def transcribe_audio_url(audio_url: str) -> str:
    """
    Download audio recording from Twilio URL and transcribe using OpenAI Whisper API (whisper-1).
    """
    client = get_openai_client()
    if not client:
        print("[Whisper STT] OpenAI API key not configured. Returning fallback.")
        return ""

    try:
        twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
        twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
        auth = (twilio_sid, twilio_token) if twilio_sid and twilio_token else None

        async with httpx.AsyncClient() as http_client:
            res = await http_client.get(audio_url, auth=auth, timeout=15.0)
            if res.status_code != 200:
                print(f"[Whisper STT] Failed to fetch audio: HTTP {res.status_code}")
                return ""
            
            audio_bytes = io.BytesIO(res.content)
            audio_bytes.name = "recording.wav"

            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_bytes,
                language="en"
            )
            return transcript.text.strip()
    except Exception as e:
        print(f"[Whisper STT Error]: {e}")
        return ""

def synthesize_speech(text: str, voice: str = "nova") -> bytes:
    """
    Synthesize text to speech using OpenAI TTS (tts-1 model for budget efficiency).
    """
    client = get_openai_client()
    if not client:
        return b""

    try:
        response = client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=text
        )
        return response.content
    except Exception as e:
        print(f"[OpenAI TTS Error]: {e}")
        return b""
