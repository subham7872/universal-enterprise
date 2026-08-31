import mongoose from 'mongoose';

const chatSnippetSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String, required: true },
  time: { type: String, default: () => new Date().toLocaleTimeString() }
}, { _id: false });

const leadSchema = new mongoose.Schema({
  id: { type: String, index: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true, index: true },
  mobile: { type: String, trim: true, index: true },
  email: { type: String, required: true, trim: true, lowercase: true, index: true },
  company: { type: String, default: 'Website Portal Visitor', trim: true },
  message: { type: String, default: '' },
  productInterest: { type: String, default: 'General Bearing Inquiry' },
  source: { 
    type: String, 
    default: 'contact'
  },
  status: { 
    type: String, 
    default: 'new',
    index: true
  },
  callStatus: { 
    type: String, 
    enum: ['pending', 'queued', 'called', 'booked', 'failed', 'none'],
    default: 'pending' 
  },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  leadScore: { type: Number, default: 60, min: 0, max: 100 },
  utmSource: { type: String, default: '' },
  chatHistory: [chatSnippetSchema],
  appointmentDate: { type: String, default: '' },
  lastActivity: { type: String, default: 'Lead created' },
  notes: { type: String, default: '' },
  assignedTo: { type: String, default: 'Sourcing Sales Desk' }
}, {
  timestamps: true
});

// Auto-sync mobile/phone fields and generate ID if missing
leadSchema.pre('save', function(next) {
  if (!this.mobile && this.phone) this.mobile = this.phone;
  if (!this.phone && this.mobile) this.phone = this.mobile;
  if (!this.id) this.id = `LD-${Date.now().toString().slice(-6)}`;
  next();
});

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
export default Lead;
