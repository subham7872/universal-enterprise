import mongoose from 'mongoose';

const equivalentProductSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  partNumber: { type: String, required: true },
  price: { type: Number, default: 0 },
}, { _id: false });

const productSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  partNumber: { type: String, required: true, index: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, index: true, trim: true },
  category: { type: String, required: true, index: true, trim: true },
  subcategory: { type: String, default: '', trim: true },
  seriesGroup: { type: String, default: '', index: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  stockStatus: { 
    type: String, 
    enum: ['Available', 'Low Stock', 'Out of Stock'], 
    default: 'Available',
    index: true
  },
  stockCount: { type: Number, default: 50 },
  weight: { type: String, default: '0.15kg' },
  innerDiameter: { type: Number, required: true, index: true }, // in mm (Inside Bore)
  outerDiameter: { type: Number, required: true, index: true }, // in mm
  width: { type: Number, required: true, index: true },         // in mm
  material: { type: String, default: 'Chrome Steel', index: true },
  sealType: { type: String, default: 'Open', index: true },
  cageType: { type: String, default: 'Steel' },
  loadRating: { type: String, default: 'Dynamic: 10 kN, Static: 5 kN' },
  dynamicLoadRating: { type: String, default: '' },
  staticLoadRating: { type: String, default: '' },
  speedRating: { type: String, default: '12,000 RPM' },
  countryOfOrigin: { type: String, default: 'Japan', index: true },
  application: { type: String, default: 'General Industrial Sourcing' },
  description: { type: String, default: '' },
  equivalentProducts: [equivalentProductSchema],
  image: { type: String, default: '' },
}, {
  timestamps: true,
});

// Compound search index for fast text matching
productSchema.index({ partNumber: 'text', name: 'text', brand: 'text', category: 'text' });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
