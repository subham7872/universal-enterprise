import { Lead } from '../models/Lead.js';

let inMemoryLeads = [];

export const getLeads = async (req, res, next) => {
  try {
    try {
      const leads = await Lead.find().sort({ createdAt: -1 }).lean();
      if (leads && leads.length > 0) {
        return res.json({ success: true, data: leads });
      }
    } catch (e) {
      // Fallback
    }
    res.json({ success: true, data: inMemoryLeads });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req, res, next) => {
  try {
    const { name, mobile, email, company, productInterest, source, notes, status, leadScore } = req.body;

    if (!name || !mobile || !email) {
      return res.status(400).json({ success: false, message: 'Name, mobile, and email are required.' });
    }

    const id = `L-${Date.now().toString().slice(-5)}`;
    const newLeadData = {
      id,
      name,
      mobile,
      email,
      company: company || 'Website Portal Visitor',
      productInterest: productInterest || 'General Inquiry',
      source: source || 'Homepage Modal',
      status: status || 'New',
      leadScore: typeof leadScore === 'number' ? leadScore : 60,
      notes: notes || '',
      lastActivity: 'Lead submitted through web portal'
    };

    let savedLead = null;
    try {
      savedLead = await Lead.create(newLeadData);
    } catch (e) {
      inMemoryLeads.unshift(newLeadData);
      savedLead = newLeadData;
    }

    res.status(201).json({ success: true, data: savedLead });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let updatedLead = null;
    try {
      updatedLead = await Lead.findOneAndUpdate(
        { $or: [{ id }, { _id: id }] },
        { $set: updates },
        { new: true }
      ).lean();
    } catch (e) {
      // Fallback
    }

    if (!updatedLead) {
      const idx = inMemoryLeads.findIndex((l) => l.id === id);
      if (idx >= 0) {
        inMemoryLeads[idx] = { ...inMemoryLeads[idx], ...updates };
        updatedLead = inMemoryLeads[idx];
      }
    }

    if (!updatedLead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    res.json({ success: true, data: updatedLead });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await Lead.findOneAndDelete({ $or: [{ id }, { _id: id }] });
    } catch (e) {
      inMemoryLeads = inMemoryLeads.filter((l) => l.id !== id);
    }
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};
