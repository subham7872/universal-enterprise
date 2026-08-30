import { Customer } from '../models/Customer.js';

let inMemoryCustomers = [];

export const getCustomers = async (req, res, next) => {
  try {
    try {
      const customers = await Customer.find().sort({ createdAt: -1 }).lean();
      if (customers && customers.length > 0) {
        return res.json({ success: true, data: customers });
      }
    } catch (e) {
      // Fallback
    }
    res.json({ success: true, data: inMemoryCustomers });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    const { company, contactName, email, phone, city, tier, notes } = req.body;
    const customerId = `CUST-${Date.now().toString().slice(-4)}`;
    const newCust = {
      customerId,
      company,
      contactName,
      email,
      phone,
      city: city || 'Chennai',
      tier: tier || 'Standard',
      notes: notes || ''
    };

    let saved = null;
    try {
      saved = await Customer.create(newCust);
    } catch (e) {
      inMemoryCustomers.unshift(newCust);
      saved = newCust;
    }

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};
