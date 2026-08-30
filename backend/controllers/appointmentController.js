import { Appointment } from '../models/Appointment.js';

let inMemoryAppointments = [];

export const getAppointments = async (req, res, next) => {
  try {
    try {
      const list = await Appointment.find().sort({ dateTime: 1 }).lean();
      if (list && list.length > 0) {
        return res.json({ success: true, data: list });
      }
    } catch (e) {
      // Fallback
    }
    res.json({ success: true, data: inMemoryAppointments });
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req, res, next) => {
  try {
    const { leadName, company, dateTime, type, notes, phone, email } = req.body;
    const id = `APT-${Date.now().toString().slice(-4)}`;
    const newApt = {
      id,
      leadName,
      company,
      dateTime,
      type: type || 'Technical Consultation',
      status: 'Scheduled',
      notes: notes || '',
      phone: phone || '',
      email: email || ''
    };

    let saved = null;
    try {
      saved = await Appointment.create(newApt);
    } catch (e) {
      inMemoryAppointments.push(newApt);
      saved = newApt;
    }

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let updated = null;
    try {
      updated = await Appointment.findOneAndUpdate(
        { $or: [{ id }, { _id: id }] },
        { $set: updates },
        { new: true }
      ).lean();
    } catch (e) {
      // Fallback
    }

    if (!updated) {
      const idx = inMemoryAppointments.findIndex((a) => a.id === id);
      if (idx >= 0) {
        inMemoryAppointments[idx] = { ...inMemoryAppointments[idx], ...updates };
        updated = inMemoryAppointments[idx];
      }
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
