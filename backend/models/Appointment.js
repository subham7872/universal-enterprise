import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  leadId: { type: String, index: true },
  leadName: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  dateTime: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Technical Consultation', 'Quote Negotiation', 'Procurement Review', 'Direct Sales'],
    default: 'Technical Consultation'
  },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Canceled'],
    default: 'Scheduled',
    index: true
  },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
export default Appointment;
