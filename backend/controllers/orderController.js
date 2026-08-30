import { Order } from '../models/Order.js';

let inMemoryOrders = [];

export const getOrders = async (req, res, next) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email) {
      query.email = String(email).trim().toLowerCase();
    }

    try {
      const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
      if (orders && orders.length > 0) {
        return res.json({ success: true, data: orders });
      }
    } catch (e) {
      // Fallback
    }

    let results = inMemoryOrders;
    if (email) {
      results = results.filter((o) => o.email.toLowerCase() === String(email).trim().toLowerCase());
    }

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const getOrderByReference = async (req, res, next) => {
  try {
    const { referenceId } = req.params;
    const ref = referenceId.trim().toUpperCase();

    let order = null;
    try {
      order = await Order.findOne({ referenceId: ref }).lean();
    } catch (e) {
      // Fallback
    }

    if (!order) {
      order = inMemoryOrders.find((o) => o.referenceId.toUpperCase() === ref);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order reference '${referenceId}' not found. Please try 'UE-885402' or submit a quote.`
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
