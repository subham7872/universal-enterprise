import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const PRIMARY_MODEL = 'qwen/qwen3.8-27b';
const FALLBACK_MODEL = 'openai/gpt-oss-120b';

export const generateSourcingResponse = async (messages, matchedProducts, databaseSample) => {
  const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
  const lastUserMessage = messages[messages.length - 1]?.text || '';

  if (!apiKey || apiKey === 'your_groq_key') {
    return getFallbackResponse(lastUserMessage, matchedProducts);
  }

  const systemInstruction = `You are the elite Technical AI Sourcing Engineer for "UNIVERSAL ENTERPRISE" (https://www.ue-asia.com), India's premier authorized distributor of high-precision industrial bearings, linear motion systems, and machine tool components.

--- AUTHORIZED BRANDS & CORE PROFILE ---
- Company: UNIVERSAL ENTERPRISE (https://www.ue-asia.com)
- Authorized Stockist: NTN, NSK, THK, SKF, FAG, INA, TIMKEN, KOYO, IKO, NACHI, HIWIN, SCHAEFFLER.
- Head Office: No. 7, 4th Cross, Kalasipalya New Extension, Bangalore – 560002, India
- GST No.: 29AAGFU1019D1ZF
- Contact: ue14.email@gmail.com | Phone: +91 9900726939 / 8123836939 | WhatsApp: +91 9900726939
- Hubs: Bangalore (Central Warehouse), Mumbai, Delhi, Chennai, Kolkata.

--- REAL-TIME MATCHED PRODUCTS FROM INVENTORY ---
${JSON.stringify(matchedProducts, null, 2)}

--- INVENTORY SAMPLE REFERENCE ---
${JSON.stringify(databaseSample?.slice(0, 8), null, 2)}

--- GUIDELINES ---
1. ALWAYS quote exact prices in Indian Rupees (₹) and actual dimensions (Bore ID, OD, Width mm) when available in the catalog.
2. RECOMMEND EQUIVALENTS: Cross-reference between Japanese (NTN, NSK, KOYO) and European (SKF, FAG, INA) alternatives.
3. TECHNICAL TONE: Keep answers objective, highly technical, structured, and helpful with concise bullet points for dimensions and load limits.
4. ACTIONABLE: Remind users they can add parts to their "Request Quote" drawer, ask for a callback from Lily, or contact ue14.email@gmail.com.`;

  const groqMessages = [
    { role: 'system', content: systemInstruction },
    ...messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text || ''
    }))
  ];

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: PRIMARY_MODEL,
        messages: groqMessages,
        temperature: 0.6,
        max_tokens: 600
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.warn(`[Groq ${PRIMARY_MODEL} Warning]`, res.status, errData);
      
      // Fallback model retry
      const retryRes = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: FALLBACK_MODEL,
          messages: groqMessages,
          temperature: 0.6,
          max_tokens: 600
        })
      });

      if (retryRes.ok) {
        const retryData = await retryRes.json();
        return {
          text: retryData.choices[0]?.message?.content || '',
          preMatchedProducts: matchedProducts,
          isSimulated: false
        };
      }

      return getFallbackResponse(lastUserMessage, matchedProducts);
    }

    const data = await res.json();
    return {
      text: data.choices[0]?.message?.content || '',
      preMatchedProducts: matchedProducts,
      isSimulated: false
    };

  } catch (err) {
    console.error('[Groq Exception]:', err.message);
    return getFallbackResponse(lastUserMessage, matchedProducts);
  }
};

function getFallbackResponse(lastUserMessage, matchedProducts) {
  let replyText = 'Thank you for reaching out to Universal Enterprise Technical Sourcing Desk. ';
  const upper = (lastUserMessage || '').toUpperCase();

  if (upper.includes('16001') || upper.includes('16002') || upper.includes('16003') || upper.includes('6200') || upper.includes('6300')) {
    replyText += `We have genuine NTN and FAG deep groove ball bearings in stock with C3 clearance and precision seals. Premium Japanese and European equivalents from NSK, SKF, and INA are readily dispatchable. Would you like us to generate a formal quote?`;
  } else if (upper.includes('THK') || upper.includes('HSR') || upper.includes('LINEAR')) {
    replyText += `We are authorized distributors of THK precision linear motion products, including HSR20A guide blocks and BNK ground ball screw assemblies with factory pre-lubrication.`;
  } else if (upper.includes('NSK') || upper.includes('SPINDLE') || upper.includes('7008') || upper.includes('B70')) {
    replyText += `We carry Super Precision Angular Contact Spindle bearings rated up to 32,000 RPM (ISO Class 4 / P4S) for high-speed CNC machinery.`;
  } else {
    replyText += `I am the Universal Enterprise AI Technical Sourcing Assistant. I can check dimensions, verify dynamic/static load limits, find cross-brand equivalents (NTN, NSK, THK, SKF, FAG, INA), and calculate quote estimates. How can I assist your engineering team today?`;
  }

  return {
    text: replyText,
    preMatchedProducts: matchedProducts,
    isSimulated: true
  };
}

export default {
  generateSourcingResponse
};
