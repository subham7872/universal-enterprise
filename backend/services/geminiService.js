import { GoogleGenAI } from '@google/genai';

let aiClient = null;

export const getGeminiClient = () => {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'universal-enterprise-backend',
        },
      },
    });
  }
  return aiClient;
};

export const generateSourcingResponse = async (messages, matchedProducts, databaseSample) => {
  const lastUserMessage = messages[messages.length - 1]?.text || '';
  const client = getGeminiClient();

  if (!client) {
    // Fallback heuristic simulation if GEMINI_API_KEY is not configured
    let replyText = 'Thank you for reaching out to Universal Enterprise Technical Sourcing Desk. ';
    const upper = lastUserMessage.toUpperCase();

    if (upper.includes('16001') || upper.includes('16002') || upper.includes('16003')) {
      replyText += `We have NTN deep groove ball bearings in stock (e.g. NTN 16001JRX @ ₹224, NTN 16002JRX @ ₹242). Premium Japanese and European equivalents from NSK and SKF are also readily dispatchable. Would you like us to generate a formal quote?`;
    } else if (upper.includes('THK') || upper.includes('HSR') || upper.includes('LINEAR')) {
      replyText += `We are authorized distributors of THK precision motion products, including HSR20A linear guide blocks (₹6,400) and BNK ball screw assemblies. All units include factory pre-lubrication.`;
    } else if (upper.includes('NSK') || upper.includes('SPINDLE') || upper.includes('7008')) {
      replyText += `We carry NSK Super Precision Angular Contact Spindle bearings (e.g., 7008CTRDULP3 @ ₹8,900) rated up to 32,000 RPM for high-speed CNC machinery.`;
    } else if (upper.includes('PRICE') || upper.includes('QUOTE') || upper.includes('RFQ')) {
      replyText += `You can add any product to our on-screen Request Quote basket and submit for direct dispatch via WhatsApp (+91 44 6686 7700) or our centralized CRM desk.`;
    } else {
      replyText += `I am the Universal Enterprise AI Technical Assistant. I can check dimensions, verify dynamic/static load limits, find cross-brand equivalents (NSK, THK, NTN, SKF, FAG), and calculate quote estimates. How can I assist your engineering team today?`;
    }

    return {
      text: replyText,
      preMatchedProducts: matchedProducts,
      isSimulated: true
    };
  }

  const systemInstruction = `
You are the elite Technical AI Sourcing Engineer for "UNIVERSAL ENTERPRISE" (https://www.ue-asia.com), a premier authorized distributor of high-precision industrial bearings and linear motion systems.

--- AUTHORIZED BRANDS & CORE PROFILE ---
- Authorized Supplier for: NTN, NSK, THK, SKF, FAG, INA, TIMKEN, KOYO, IKO, NACHI, HIWIN, SCHAEFFLER.
- Contact: sales@ntnbearing.in | Phone: +91 44 6686 7700
- Head Office: Polyhose Tower, Mount Road, Guindy, Chennai 600032
- Hubs: Mumbai, Delhi, Kolkata, Chennai.

--- REAL-TIME DATABASE INVENTORY SAMPLES ---
${JSON.stringify(databaseSample, null, 2)}

--- PRE-MATCHED RELEVANT PRODUCTS FROM USER INQUIRY ---
${JSON.stringify(matchedProducts, null, 2)}

--- GUIDELINES ---
1. ALWAYS quote exact prices in Indian Rupees (₹) and real dimensions (Inside Bore ID, OD, Width mm) when available in the catalog.
2. RECOMMEND EQUIVALENTS: When a user asks about a bearing, highlight equivalent options (e.g., matching NTN to NSK, SKF, or FAG alternatives).
3. TECHNICAL TONE: Keep answers objective, highly technical, structured, and helpful with concise bullet points for dimensions and load limits.
4. ACTIONABLE: Remind users they can add parts to their "Request Quote" drawer or contact the engineering desk.
`;

  const contents = messages.map((m) => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents,
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  return {
    text: response.text,
    preMatchedProducts: matchedProducts,
    isSimulated: false
  };
};

export default {
  getGeminiClient,
  generateSourcingResponse
};
