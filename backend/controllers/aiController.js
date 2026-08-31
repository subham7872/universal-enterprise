import { Product } from '../models/Product.js';
import { INITIAL_PRODUCTS } from '../data/bearingsData.js';
import { generateSourcingResponse } from '../services/groqService.js';

export const handleChat = async (req, res, next) => {
  try {
    const { messages = [] } = req.body;
    if (!messages || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide a message thread.' });
    }

    const lastUserMessage = messages[messages.length - 1]?.text || '';
    const searchTokens = lastUserMessage
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length >= 3);

    let matchedProducts = [];
    let catalogSample = [];

    try {
      if (searchTokens.length > 0) {
        const tokenRegexes = searchTokens.map((t) => new RegExp(t, 'i'));
        matchedProducts = await Product.find({
          $or: [
            { partNumber: { $in: tokenRegexes } },
            { name: { $in: tokenRegexes } },
            { brand: { $in: tokenRegexes } }
          ]
        }).limit(6).lean();
      }

      catalogSample = await Product.find({})
        .limit(15)
        .select('partNumber brand category price stockStatus innerDiameter outerDiameter width equivalentProducts')
        .lean();
    } catch (e) {
      // Fallback in-memory
      matchedProducts = INITIAL_PRODUCTS.filter((p) => {
        const lower = lastUserMessage.toLowerCase();
        return lower.includes(p.partNumber.toLowerCase()) || lower.includes(p.brand.toLowerCase());
      }).slice(0, 6);

      catalogSample = INITIAL_PRODUCTS.slice(0, 15);
    }

    const response = await generateSourcingResponse(messages, matchedProducts, catalogSample);

    res.json({
      success: true,
      text: response.text,
      preMatchedProducts: response.preMatchedProducts || matchedProducts,
      isSimulated: response.isSimulated || false
    });
  } catch (error) {
    next(error);
  }
};
