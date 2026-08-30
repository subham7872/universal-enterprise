import { CallLog } from '../models/CallLog.js';

let inMemoryCallLogs = [];

export const getCallLogs = async (req, res, next) => {
  try {
    try {
      const logs = await CallLog.find().sort({ createdAt: -1 }).lean();
      if (logs && logs.length > 0) {
        return res.json({ success: true, data: logs });
      }
    } catch (e) {
      // Fallback
    }
    res.json({ success: true, data: inMemoryCallLogs });
  } catch (error) {
    next(error);
  }
};

export const createCallLog = async (req, res, next) => {
  try {
    const { leadName, phone, duration, transcript, qualificationSummary, outcome } = req.body;
    const callId = `CALL-${Date.now().toString().slice(-4)}`;
    const newLog = {
      callId,
      leadName,
      phone,
      duration: duration || '2m 15s',
      transcript: transcript || [],
      qualificationSummary: qualificationSummary || 'Bearing requirements noted.',
      outcome: outcome || 'Qualified'
    };

    let saved = null;
    try {
      saved = await CallLog.create(newLog);
    } catch (e) {
      inMemoryCallLogs.unshift(newLog);
      saved = newLog;
    }

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};
