import mongoose from 'mongoose';

const quoteItemSchema = new mongoose.Schema({
  product: {
    id: String,
    partNumber: { type: String, required: true },
    brand: { type: String, default: 'NTN' },
    name: String,
    category: String,
    price: { type: Number, required: true },
    weight: String
  },
  quantity: { type: Number, required: true, min: 1, default: 1 }
}, { _id: false });

const milestoneSchema = new mongoose.Schema({
  label: { type: String, required: true },
  date: { type: String, default: '' },
  done: { type: Boolean, default: false },
  desc: { type: String, default: '' }
}, { _id: false });

const quoteSchema = new mongoose.Schema({
  quoteId: { type: String, required: true, unique: true, index: true }, // e.g. "UE-885402"
  name: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  routing: { type: String, enum: ['WhatsApp', 'CRM', 'CRM/Email'], default: 'CRM' },
  items: [quoteItemSchema],
  subtotal: { type: Number, default: 0 },
  message: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Request Sourced', 'Technical Validation', 'Custom Crating', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Technical Validation',
    index: true
  },
  statusTimeline: [milestoneSchema],
  salesOfficer: { type: String, default: 'Universal Enterprise Sourcing Desk' }
}, {
  timestamps: true
});

export const Quote = mongoose.models.Quote || mongoose.model('Quote', quoteSchema);
export default Quote;
