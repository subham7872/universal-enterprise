import Lead from '../models/Lead.js';
import { sendOwnerAlert, sendCustomerConfirmation } from './emailController.js';

// In-memory fallback for leads if DB is temporarily offline
export let INITIAL_LEADS = [
  {
    id: 'LD-1001',
    name: 'Vikram Mehta',
    phone: '+91 98401 23456',
    mobile: '+91 98401 23456',
    email: 'vikram@hindustanmotors.com',
    company: 'Hindustan Motors Ltd',
    productInterest: 'Angular Contact Machine Tool Spindle Bearings B7016',
    message: 'Need 12 units of FAG B7016-E-T-P4S with ISO Class 4 certification.',
    source: 'modal',
    status: 'new',
    callStatus: 'pending',
    leadScore: 85,
    createdAt: new Date().toISOString()
  },
  {
    id: 'LD-1002',
    name: 'Ananya Sharma',
    phone: '+91 97110 87654',
    mobile: '+91 97110 87654',
    email: 'ananya.s@tatasteel.com',
    company: 'Tata Steel Tubes Division',
    productInterest: 'Double Row Deep Groove 4208B',
    message: 'Requesting bulk annual quotation for Neuweg/NKE 4208B TNG.',
    source: 'contact',
    status: 'new',
    callStatus: 'called',
    leadScore: 90,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

/**
 * Submit a new lead from Modal, Contact Page, Chatbot, or RFQ
 */
export async function submitLead(req, res) {
  try {
    const { name, email, phone, mobile, message, productInterest, company, source } = req.body;

    const contactPhone = phone || mobile || '';
    const contactEmail = (email || '').trim().toLowerCase();
    const contactName = (name || '').trim();

    if (!contactName) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!contactEmail && !contactPhone) {
      return res.status(400).json({ error: 'Either email or phone number is required' });
    }

    const leadPayload = {
      id: `LD-${Date.now().toString().slice(-6)}`,
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      mobile: contactPhone,
      company: company || 'Website Portal Visitor',
      message: message || productInterest || 'General Industrial Inquiry',
      productInterest: productInterest || message || 'General Bearing Inquiry',
      source: source || 'contact',
      status: 'new',
      callStatus: 'pending',
      leadScore: 70,
      lastActivity: 'Lead submitted via website',
      createdAt: new Date()
    };

    let savedLead = null;

    // 1. Save to MongoDB
    try {
      savedLead = await Lead.create(leadPayload);
      console.log('[Lead Controller] Lead saved to MongoDB:', savedLead._id);
    } catch (dbErr) {
      console.warn('[Lead Controller] MongoDB save fallback to in-memory:', dbErr.message);
      savedLead = { ...leadPayload, _id: leadPayload.id };
      INITIAL_LEADS.unshift(savedLead);
    }

    // 2. Concurrently dispatch Brevo Emails
    Promise.allSettled([
      sendOwnerAlert(savedLead),
      sendCustomerConfirmation(savedLead)
    ]).then(results => {
      console.log('[Lead Email Results]', results.map(r => r.status));
    }).catch(err => {
      console.error('[Lead Email Error]', err.message);
    });

    // 3. Fire-and-forget trigger to Python Voice Agent (Lily) at http://localhost:8001/trigger-call
    const voiceAgentUrl = process.env.VOICE_AGENT_URL || 'http://localhost:8001';
    if (contactPhone) {
      fetch(`${voiceAgentUrl}/trigger-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: savedLead._id || savedLead.id,
          name: contactName,
          phone: contactPhone,
          email: contactEmail,
          interest: savedLead.productInterest,
          message: savedLead.message,
          source: savedLead.source
        })
      }).then(async r => {
        console.log(`[Voice Agent Trigger] Status: ${r.status}`);
      }).catch(err => {
        // Voice agent might not be running in dev mode; non-blocking
        console.log(`[Voice Agent Trigger Info] Service at ${voiceAgentUrl} not reachable or queued.`);
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry received successfully! Our team will contact you shortly.',
      leadId: savedLead._id || savedLead.id,
      lead: savedLead
    });

  } catch (err) {
    console.error('[Lead Controller Error]', err);
    return res.status(500).json({ error: 'Internal server error while processing lead' });
  }
}

/**
 * Get all leads for CRM
 */
export async function getLeads(req, res) {
  try {
    let leads = [];
    try {
      leads = await Lead.find().sort({ createdAt: -1 }).limit(500);
    } catch (dbErr) {
      leads = INITIAL_LEADS;
    }
    return res.json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Update lead status / callStatus
 */
export async function updateLead(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let updated = null;
    try {
      updated = await Lead.findByIdAndUpdate(id, updateData, { new: true });
    } catch (dbErr) {
      const idx = INITIAL_LEADS.findIndex(l => l.id === id || l._id === id);
      if (idx !== -1) {
        INITIAL_LEADS[idx] = { ...INITIAL_LEADS[idx], ...updateData };
        updated = INITIAL_LEADS[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export default {
  submitLead,
  getLeads,
  updateLead
};
