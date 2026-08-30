import { Workflow } from '../models/Workflow.js';

let inMemoryWorkflows = [
  {
    id: 'WF-1',
    name: 'High-Score Lead Auto WhatsApp Notification',
    trigger: 'Lead Score > 75',
    conditions: 'Source is Homepage Modal or Contact Form',
    action: 'Send instant WhatsApp RFQ acknowledgment to sales hotline',
    enabled: true
  },
  {
    id: 'WF-2',
    name: 'Urgent RFQ Escalation',
    trigger: 'Quote Subtotal > ₹50,000',
    conditions: 'Status is Request Sourced',
    action: 'Assign Senior Technical Sourcing Specialist within 15 minutes',
    enabled: true
  }
];

export const getWorkflows = async (req, res, next) => {
  try {
    try {
      const workflows = await Workflow.find().lean();
      if (workflows && workflows.length > 0) {
        return res.json({ success: true, data: workflows });
      }
    } catch (e) {
      // Fallback
    }
    res.json({ success: true, data: inMemoryWorkflows });
  } catch (error) {
    next(error);
  }
};

export const createWorkflow = async (req, res, next) => {
  try {
    const { name, trigger, conditions, action, enabled = true } = req.body;
    const id = `WF-${Date.now().toString().slice(-4)}`;
    const newWf = { id, name, trigger, conditions: conditions || '', action, enabled };

    let saved = null;
    try {
      saved = await Workflow.create(newWf);
    } catch (e) {
      inMemoryWorkflows.push(newWf);
      saved = newWf;
    }

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};

export const toggleWorkflow = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updated = null;

    try {
      const current = await Workflow.findOne({ id });
      if (current) {
        current.enabled = !current.enabled;
        await current.save();
        updated = current;
      }
    } catch (e) {
      // Fallback
    }

    if (!updated) {
      const wf = inMemoryWorkflows.find((w) => w.id === id);
      if (wf) {
        wf.enabled = !wf.enabled;
        updated = wf;
      }
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
