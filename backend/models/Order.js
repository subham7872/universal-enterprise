import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  label: { type: String, required: true },
  date: { type: String, default: '' },
  done: { type: Boolean, default: false },
  desc: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  referenceId: { type: String, required: true, unique: true, index: true }, // e.g. "UE-885402"
  quoteId: { type: String, index: true },
  customerName: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, index: true },
  phone: { type: String, required: true },
  carrier: { type: String, default: 'BlueDart Express' },
  awbNumber: { type: String, default: '' },
  items: [{
    partNumber: String,
    brand: String,
    category: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, default: 0 },
  currentStatus: { 
    type: String, 
    enum: ['Request Sourced', 'Technical Validation', 'Custom Crating', 'Depot Dispatch', 'In Transit via Air Cargo', 'Recipient Delivered'],
    default: 'Technical Validation'
  },
  milestones: [milestoneSchema],
  deliveryDestination: { type: String, default: 'India Regional Cargo Hub' }
}, {
  timestamps: true
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
