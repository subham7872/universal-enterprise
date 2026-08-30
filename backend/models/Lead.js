import mongoose from 'mongoose';

const chatSnippetSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String, required: true },
  time: { type: String, default: () => new Date().toLocaleTimeString() }
}, { _id: false });

const leadSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true, index: true },
  email: { type: String, required: true, trim: true, lowercase: true, index: true },
  company: { type: String, default: 'Website Portal Visitor', trim: true },
  productInterest: { type: String, default: 'General Bearing Inquiry' },
  source: { 
    type: String, 
    enum: [
      'Homepage Modal', 'Product Page Form', 'Contact Form', 'Chatbot', 
      'AI Voice Agent', 'WhatsApp', 'Direct Traffic', 'Google Search', 
      'Facebook Ads', 'LinkedIn', 'Referral'
    ],
    default: 'Homepage Modal'
  },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Qualified', 'Lost'], 
    default: 'New',
    index: true
  },
  leadScore: { type: Number, default: 50, min: 0, max: 100 },
  utmSource: { type: String, default: '' },
  chatHistory: [chatSnippetSchema],
  appointmentDate: { type: String, default: '' },
  lastActivity: { type: String, default: 'Lead created' },
  notes: { type: String, default: '' },
  assignedTo: { type: String, default: 'Sourcing Sales Desk' }
}, {
  timestamps: true
});

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
export default Lead;
