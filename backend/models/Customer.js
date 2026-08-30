import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customerId: { type: String, unique: true, index: true },
  company: { type: String, required: true, trim: true, index: true },
  contactName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, index: true },
  phone: { type: String, required: true, trim: true },
  city: { type: String, default: 'Chennai' },
  country: { type: String, default: 'India' },
  tier: { type: String, enum: ['Standard', 'Corporate OEM', 'Wholesale Partner'], default: 'Standard' },
  totalSpend: { type: Number, default: 0 },
  orderingHistory: [{
    orderId: String,
    date: Date,
    amount: Number,
    itemsCount: Number,
    status: String
  }],
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

export const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
export default Customer;
