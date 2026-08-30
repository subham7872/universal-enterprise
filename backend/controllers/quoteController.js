import { Quote } from '../models/Quote.js';
import { Order } from '../models/Order.js';

let inMemoryQuotes = [];

export const getQuotes = async (req, res, next) => {
  try {
    try {
      const quotes = await Quote.find().sort({ createdAt: -1 }).lean();
      if (quotes && quotes.length > 0) {
        return res.json({ success: true, data: quotes });
      }
    } catch (e) {
      // Fallback
    }
    res.json({ success: true, data: inMemoryQuotes });
  } catch (error) {
    next(error);
  }
};

export const createQuote = async (req, res, next) => {
  try {
    const { name, companyName, phone, email, routing = 'CRM', items = [], message = '' } = req.body;

    if (!name || !companyName || !email) {
      return res.status(400).json({ success: false, message: 'Name, company name, and email are required.' });
    }

    const quoteId = `UE-${Math.floor(100000 + Math.random() * 900000)}`;
    const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const subtotal = items.reduce((acc, item) => {
      const price = item.product?.price || 0;
      const qty = item.quantity || 1;
      return acc + (price * qty);
    }, 0);

    const initialTimeline = [
      { label: 'Request Sourced', date: formattedDate, done: true, desc: 'Inquiry registered and engineering desk assigned.' },
      { label: 'Technical Validation', date: formattedDate, done: true, desc: 'Tolerances, bore dimensions and cross-equivalents verified.' },
      { label: 'Custom Crating & Pack', date: '', done: false, desc: 'Anti-shock vacuum packing scheduled.' },
      { label: 'Depot Dispatch', date: '', done: false, desc: 'Awaiting terminal clearance routing.' },
      { label: 'In Transit via Air Cargo', date: '', done: false, desc: 'Scheduled dispatch via regional express freight.' },
      { label: 'Recipient Delivered', date: '', done: false, desc: 'Awaiting yard delivery manager sign-off.' }
    ];

    const newQuoteRecord = {
      quoteId,
      name,
      companyName,
      phone,
      email,
      routing,
      items,
      subtotal,
      message,
      status: 'Technical Validation',
      statusTimeline: initialTimeline,
      salesOfficer: 'Universal Enterprise Sourcing Desk'
    };

    try {
      await Quote.create(newQuoteRecord);
      // Auto-create matching Order for tracking
      await Order.create({
        referenceId: quoteId,
        quoteId,
        customerName: name,
        companyName,
        email,
        phone,
        items: items.map((i) => ({
          partNumber: i.product?.partNumber || '',
          brand: i.product?.brand || 'NTN',
          category: i.product?.category || '',
          quantity: i.quantity || 1,
          price: i.product?.price || 0
        })),
        totalAmount: subtotal,
        currentStatus: 'Technical Validation',
        milestones: initialTimeline
      });
    } catch (e) {
      inMemoryQuotes.unshift(newQuoteRecord);
    }

    res.status(201).json({
      success: true,
      quoteId,
      submissionDate: formattedDate,
      estimatedResponseTime: 'Within 2 hours',
      salesOfficer: 'Universal Enterprise Sourcing Desk',
      subtotal,
      summary: `Your quote inquiry ${quoteId} has been submitted to the engineering desk at ${email}. This request contains ${items.length} items.`
    });
  } catch (error) {
    next(error);
  }
};

export const getQuoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cleanId = id.trim().toUpperCase();

    let quote = null;
    try {
      quote = await Quote.findOne({ quoteId: cleanId }).lean();
    } catch (e) {
      // Fallback
    }

    if (!quote) {
      quote = inMemoryQuotes.find((q) => q.quoteId.toUpperCase() === cleanId);
    }

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: `Quotation/Order reference '${id}' not found. Please verify reference code (e.g. 'UE-885402').`
      });
    }

    res.json({ success: true, data: quote });
  } catch (error) {
    next(error);
  }
};

export const getQuotesByEmail = async (req, res, next) => {
  try {
    const email = String(req.query.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email parameter is required.' });
    }

    let matches = [];
    try {
      matches = await Quote.find({ email }).sort({ createdAt: -1 }).lean();
    } catch (e) {
      // Fallback
    }

    if (!matches || matches.length === 0) {
      matches = inMemoryQuotes.filter((q) => q.email.toLowerCase() === email);
    }

    res.json({ success: true, data: matches });
  } catch (error) {
    next(error);
  }
};
