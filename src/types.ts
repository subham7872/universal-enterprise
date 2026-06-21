export interface Product {
  id: string;
  partNumber: string;
  name: string;
  brand: string;
  category: string;
  price: number; // in INR (₹)
  stockStatus: 'Available' | 'Low Stock' | 'Out of Stock';
  stockCount: number;
  weight: string; // e.g. "0.12kg"
  innerDiameter: number; // in mm
  outerDiameter: number; // in mm
  width: number; // in mm
  material: string;
  sealType: string;
  cageType: string;
  loadRating: string; // e.g. "Dynamic: 5.1 kN, Static: 2.38 kN"
  speedRating: string; // e.g. "18,000 RPM"
  countryOfOrigin: string;
  application: string;
  description?: string;
  equivalentProducts?: { brand: string; partNumber: string; price: number }[];
}

export interface CategoryTree {
  name: string;
  id: string;
  subcategories?: CategoryTree[];
}

export interface FilterState {
  searchQuery: string;
  searchField: 'partNumber' | 'name' | 'brand' | 'series' | 'any';
  matchType: 'contains' | 'startsWith' | 'exact';
  selectedCategory: string;
  selectedBrand: string;
  innerDiameterMin: string;
  innerDiameterMax: string;
  outerDiameterMin: string;
  outerDiameterMax: string;
  widthMin: string;
  widthMax: string;
  material: string;
  sealType: string;
  cageType: string;
  stockStatus: string;
  priceMin: string;
  priceMax: string;
  origin: string;
}

export interface QuoteItem {
  product: Product;
  quantity: number;
}

export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  suggestedProducts?: Product[];
}

export interface QuoteRequest {
  name: string;
  companyName: string;
  phone: string;
  email: string;
  productRequirements: string;
  message: string;
  items: QuoteItem[];
}
