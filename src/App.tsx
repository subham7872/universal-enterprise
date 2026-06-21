import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, Grid, List, RefreshCw, 
  ChevronLeft, ChevronRight, HelpCircle, Building2, CheckCircle2, 
  MapPin, Send, HelpCircle as HelpIcon, ArrowRight, ShieldCheck, Mail, Phone, Cpu
} from 'lucide-react';

import Header from './components/Header';
import QuoteListDrawer from './components/QuoteListDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import AdminUpload from './components/AdminUpload';
import AiCompanion from './components/AiCompanion';
import CompareSpecsPage from './components/CompareSpecsPage';
import OrderTrackingPage from './components/OrderTrackingPage';
import CrmDashboard from './components/CrmDashboard';
import CategoriesPage from './components/CategoriesPage';
import PremiumHomeAdditions from './components/PremiumHomeAdditions';
import PremiumAboutAdditions from './components/PremiumAboutAdditions';
import PremiumServicesAdditions from './components/PremiumServicesAdditions';
import PremiumContactAdditions from './components/PremiumContactAdditions';

import { CATEGORY_TREE, INITIAL_BRANDS, INITIAL_PRODUCTS } from './data/bearingsData';
import { Product, QuoteItem, FilterState } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home'); // home, brands, services, about, contact
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Homepage promo popup states
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoForm, setPromoForm] = useState({
    name: '',
    phone: '',
    email: '',
    serviceInterest: 'Ball Bearings'
  });

  useEffect(() => {
    // Show promo modal after 1.5 seconds on load unless dismissed
    const dismissed = sessionStorage.getItem('ue_promo_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowPromoModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead = {
      id: `L-${Date.now().toString().slice(-4)}`,
      name: promoForm.name,
      mobile: promoForm.phone,
      email: promoForm.email,
      company: 'Website Portal Visitor',
      productInterest: promoForm.serviceInterest,
      source: 'Homepage Modal' as const,
      status: 'New' as const,
      createdDate: new Date().toISOString().split('T')[0],
      lastActivity: 'Lead captured via Homepage Popup Modal',
      leadScore: 60,
    };
    
    let currentLeads = [];
    try {
      const saved = localStorage.getItem('ue_crm_leads');
      if (saved) currentLeads = JSON.parse(saved);
    } catch (err) {}
    
    localStorage.setItem('ue_crm_leads', JSON.stringify([newLead, ...currentLeads]));
    sessionStorage.setItem('ue_promo_dismissed', 'true');
    setShowPromoModal(false);
    alert(`Thank you ${promoForm.name}! Our automated FAG/INA AI Calling Agent has logged your preference for ${promoForm.serviceInterest}. An executive will review your parameters shortly.`);
  };
  
  // Drawer & Overlay controls
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  // View state (tab vs list grid view)
  const [viewType, setViewType] = useState<'grid' | 'table'>('table');

  // Search Engine states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<'partNumber' | 'name' | 'brand' | 'series' | 'any'>('any');
  const [matchType, setMatchType] = useState<'contains' | 'startsWith' | 'exact'>('contains');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter System states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [innerDiameterMin, setInnerDiameterMin] = useState('');
  const [innerDiameterMax, setInnerDiameterMax] = useState('');
  const [outerDiameterMin, setOuterDiameterMin] = useState('');
  const [outerDiameterMax, setOuterDiameterMax] = useState('');
  const [widthMin, setWidthMin] = useState('');
  const [widthMax, setWidthMax] = useState('');
  const [material, setMaterial] = useState('');
  const [sealType, setSealType] = useState('');
  const [cageType, setCageType] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [origin, setOrigin] = useState('');

  // Pagination & Sorting states
  const [sortOption, setSortOption] = useState('partNumber-asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10);

  // Quantity selection mapping inside catalog lists
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});

  const [loading, setLoading] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    productRequirements: '',
    message: ''
  });

  const [contactSuccess, setContactSuccess] = useState(false);

  // Filter product listings locally from static catalog data
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let filtered = [...allProducts];

      // Filter by text query using advanced matches
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter((p) => {
          let valueToSearch = '';
          if (searchField === 'partNumber') valueToSearch = p.partNumber.toLowerCase();
          else if (searchField === 'name') valueToSearch = p.name.toLowerCase();
          else if (searchField === 'brand') valueToSearch = p.brand.toLowerCase();
          else if (searchField === 'series') {
            const match = p.partNumber.match(/[a-zA-Z]+|\d+/g);
            valueToSearch = match ? match[0].toLowerCase() : p.partNumber.toLowerCase();
          } else {
            valueToSearch = `${p.partNumber} ${p.name} ${p.brand} ${p.category}`.toLowerCase();
          }

          if (matchType === 'exact') return valueToSearch === q;
          if (matchType === 'startsWith') return valueToSearch.startsWith(q);
          return valueToSearch.includes(q);
        });
      }

      if (selectedCategory) {
        const cat = selectedCategory.toLowerCase();
        filtered = filtered.filter((p) => p.category.toLowerCase().includes(cat) || cat.includes(p.category.toLowerCase()));
      }

      if (selectedBrand) {
        const cleanBrand = (b: string) => b.replace(/\s*\(\d+\)\s*$/, '').trim().toLowerCase();
        const bName = cleanBrand(selectedBrand);
        filtered = filtered.filter((p) => cleanBrand(p.brand) === bName);
      }

      if (innerDiameterMin) filtered = filtered.filter((p) => p.innerDiameter >= parseFloat(innerDiameterMin));
      if (innerDiameterMax) filtered = filtered.filter((p) => p.innerDiameter <= parseFloat(innerDiameterMax));
      if (outerDiameterMin) filtered = filtered.filter((p) => p.outerDiameter >= parseFloat(outerDiameterMin));
      if (outerDiameterMax) filtered = filtered.filter((p) => p.outerDiameter <= parseFloat(outerDiameterMax));
      if (widthMin) filtered = filtered.filter((p) => p.width >= parseFloat(widthMin));
      if (widthMax) filtered = filtered.filter((p) => p.width <= parseFloat(widthMax));

      if (material) filtered = filtered.filter((p) => p.material.toLowerCase() === material.toLowerCase());
      if (sealType) filtered = filtered.filter((p) => p.sealType.toLowerCase().includes(sealType.toLowerCase()));
      if (cageType) filtered = filtered.filter((p) => p.cageType.toLowerCase().includes(cageType.toLowerCase()));
      if (stockStatus) filtered = filtered.filter((p) => p.stockStatus.toLowerCase() === stockStatus.toLowerCase());
      if (priceMin) filtered = filtered.filter((p) => p.price >= parseFloat(priceMin));
      if (priceMax) filtered = filtered.filter((p) => p.price <= parseFloat(priceMax));
      if (origin) filtered = filtered.filter((p) => p.countryOfOrigin.toLowerCase() === origin.toLowerCase());

      if (sortOption === 'price-asc') filtered.sort((a, b) => a.price - b.price);
      else if (sortOption === 'price-desc') filtered.sort((a, b) => b.price - a.price);
      else if (sortOption === 'partNumber-asc') filtered.sort((a, b) => a.partNumber.localeCompare(b.partNumber));
      else if (sortOption === 'partNumber-desc') filtered.sort((a, b) => b.partNumber.localeCompare(a.partNumber));

      const total = filtered.length;
      const pages = Math.max(1, Math.ceil(total / limit));
      const currentPage = Math.min(page, pages);
      const startIndex = (currentPage - 1) * limit;
      const paginatedItems = filtered.slice(startIndex, startIndex + limit);

      setProducts(paginatedItems);
      setTotalPages(pages);
      setTotalCount(total);

      const qtyMap: any = {};
      paginatedItems.forEach((p: Product) => {
        qtyMap[p.id] = quantities[p.id] || 1;
      });
      setQuantities(qtyMap);
    } catch (err) {
      console.error('Failed to load bearings catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    selectedCategory, selectedBrand, sortOption, page,
    innerDiameterMin, innerDiameterMax, outerDiameterMin, outerDiameterMax,
    widthMin, widthMax, material, sealType, cageType, stockStatus, priceMin, priceMax, origin
  ]);

  // Autocomplete Suggestions fetcher
  useEffect(() => {
    const fetchSuggestions = () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }
      const q = searchQuery.toLowerCase().trim();
      const suggestionsData = allProducts
        .filter((p) => p.partNumber.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
        .slice(0, 10)
        .map((p) => ({
          partNumber: p.partNumber,
          brand: p.brand,
          name: p.name,
          category: p.category
        }));
      setSuggestions(suggestionsData);
    };

    const debounceTimer = window.setTimeout(fetchSuggestions, 200);
    return () => window.clearTimeout(debounceTimer);
  }, [searchQuery, allProducts]);

  // Command handlers
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
    setShowSuggestions(false);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSearchField('any');
    setMatchType('contains');
    setSelectedCategory('');
    setSelectedBrand('');
    setInnerDiameterMin('');
    setInnerDiameterMax('');
    setOuterDiameterMin('');
    setOuterDiameterMax('');
    setWidthMin('');
    setWidthMax('');
    setMaterial('');
    setSealType('');
    setCageType('');
    setStockStatus('');
    setPriceMin('');
    setPriceMax('');
    setOrigin('');
    setPage(1);
  };

  // Cart operations
  const handleAddToQuote = (product: Product, customQty?: number) => {
    const qty = customQty || quantities[product.id] || 1;
    setQuoteItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      } else {
        return [...prev, { product, quantity: qty }];
      }
    });
    setQuoteOpen(true);
  };

  const updateQuoteQuantity = (productId: string, quantity: number) => {
    setQuoteItems((prev) => 
      prev.map((item) => item.product.id === productId ? { ...item, quantity } : item)
    );
  };

  const removeFromQuote = (productId: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Compare functions
  const handleToggleCompare = (product: Product) => {
    setCompareItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 bearings side-by-side.');
        return prev;
      }
      return [...prev, product];
    });
  };

  // Form handle
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactForm({
        name: '',
        companyName: '',
        phone: '',
        email: '',
        productRequirements: '',
        message: ''
      });
    }, 4000);
  };

  return (
    <div id="root-container" className="min-h-screen bg-[#f8f8f8] font-sans antialiased text-slate-800 flex flex-col selection:bg-[#f2cc4d]">
      
      {/* Sticky header bar */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={(tab) => {
          if (tab === 'products') {
            setCurrentTab('home');
            setTimeout(() => {
              const searchAnchor = document.getElementById('search-engine-anchor');
              if (searchAnchor) {
                searchAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                window.scrollTo({ top: 500, behavior: 'smooth' });
              }
            }, 100);
          } else {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        quoteItems={quoteItems}
        setQuoteOpen={setQuoteOpen}
      />

      {/* Dynamic mobile priority shortcuts bar */}
      <div className="lg:hidden bg-slate-900 border-b border-[#f2cc4d] px-4 py-2.5 flex justify-around text-slate-300 font-mono overflow-x-auto select-none gap-2 shrink-0">
        <button onClick={() => setCurrentTab('home')} className={`pb-1 px-1 tracking-tight font-black uppercase text-[10px] cursor-pointer ${currentTab === 'home' || currentTab === 'products' ? 'text-[#f2cc4d] border-b-2 border-[#f2cc4d]' : 'text-slate-400 font-bold'}`}>Catalog</button>
        <button onClick={() => setCurrentTab('categories')} className={`pb-1 px-1 tracking-tight font-black uppercase text-[10px] cursor-pointer ${currentTab === 'categories' ? 'text-[#f2cc4d] border-b-2 border-[#f2cc4d]' : 'text-slate-400 font-bold'}`}>Categories</button>
        <button onClick={() => setCurrentTab('crm')} className={`pb-1 px-1 tracking-tight font-black uppercase text-[10px] cursor-pointer ${currentTab === 'crm' ? 'text-[#f2cc4d] border-b-2 border-[#f2cc4d]' : 'text-slate-400 font-bold'}`}>CRM Link</button>
        <button onClick={() => setCurrentTab('compare')} className={`pb-1 px-1 tracking-tight font-black uppercase text-[10px] cursor-pointer ${currentTab === 'compare' ? 'text-[#f2cc4d] border-b-2 border-[#f2cc4d]' : 'text-slate-400 font-bold'}`}>Compare ({compareItems.length})</button>
        <button onClick={() => setCurrentTab('tracking')} className={`pb-1 px-1 tracking-tight font-black uppercase text-[10px] cursor-pointer ${currentTab === 'tracking' ? 'text-[#f2cc4d] border-b-2 border-[#f2cc4d]' : 'text-slate-400 font-bold'}`}>Tracker</button>
      </div>

      {/* RENDER DYNAMIC VIEW PAGES SECTION */}
      
      {/* Hero Banner (Always shown above catalog list on 'home' tab) */}
      {currentTab === 'home' && (
        <section className="relative w-full bg-[#001f3f] text-white overflow-hidden py-16 px-4 md:px-8 border-b-4 border-[#f2cc4d]">
          
          {/* Faded Grid Vector Background & repeating linear stripes from Design HTML */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#003366] to-transparent z-10 opacity-80"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #003366 0px, #003366 10px, transparent 10px, transparent 20px)' }}></div>

          <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
            
            {/* Promo text layout cols */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 bg-[#f2cc4d] text-[#003366] text-[10px] font-black uppercase px-3 py-1 rounded-sm tracking-widest select-none">
                <ShieldCheck className="w-4 h-4 text-[#003366]" /> GLOBAL PRECISION SOLUTIONS
              </span>
              <h2 className="text-4xl sm:text-6xl font-black text-white leading-[0.95] tracking-tight uppercase">
                Precision Bearings. <br />
                <span className="text-[#f2cc4d]">Industrial Grade.</span>
              </h2>
              <p className="text-[#0A84FF] font-semibold text-lg sm:text-xl">
                Authorized Distributor of NSK, THK, NTN & Global Brands
              </p>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Universal Enterprise distributes genuine, certified motion control gears and ball guides globally. Specializing in standard and complex replacements from global brand assets including <strong>NSK, THK, NTN, and SKF</strong>.
              </p>
              
              <div className="flex flex-wrap gap-3.5">
                <button
                  onClick={() => {
                    const catalogAnchor = document.getElementById('search-engine-anchor');
                    catalogAnchor?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#f2cc4d] hover:bg-[#e1bd41] text-[#003366] font-black px-6 py-3 rounded-sm text-xs uppercase tracking-wider shadow-inner transform active:scale-95 transition cursor-pointer"
                >
                  Explore Bearing Catalog
                </button>
                <button
                  onClick={() => setQuoteOpen(true)}
                  className="bg-slate-900/60 hover:bg-slate-900 text-white font-black px-6 py-3 rounded-sm text-xs uppercase tracking-wider shadow-lg border border-slate-700 hover:border-[#f2cc4d] transition cursor-pointer"
                >
                  Request Fast Quotation
                </button>
              </div>

              {/* Statistics Panel */}
              <div className="pt-8 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
                {[
                  { value: '5000+', label: 'Products Sourced' },
                  { value: '1000+', label: 'Customers Served' },
                  { value: '15+ Years', label: 'Authorized Sourcing' },
                  { value: '24/7 Desk', label: 'AI Expert Support' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-[#003366]/40 p-3 rounded-sm border border-white/10">
                    <div className="text-white text-xl sm:text-2xl font-black">{stat.value}</div>
                    <div className="text-[#f2cc4d] text-[10px] uppercase font-black tracking-widest mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Main Core Shell Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">

        {/* 1. UNIVERSAL ENTERPRISE SEARCH ENGINE (Home Tab Priority) */}
        {currentTab === 'home' && (
          <div id="search-engine-anchor" className="bg-[#003366] text-white p-5 rounded-sm shadow-xl border-b-4 border-[#f2cc4d] space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-[#f2cc4d]">
              <Search className="w-4 h-4 text-[#f2cc4d]" />
              Universal Enterprise Sourcing Engine
            </h3>

            {/* Direct forms */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-3 relative">
              
              {/* Product input search bar */}
              <div className="lg:col-span-5 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Enter bearing code / name (e.g. 16001JRX, HSR20A...)"
                  className="w-full bg-slate-950 text-white min-w-0 px-4 py-3 border border-slate-700/80 rounded-sm text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#f2cc4d]"
                />

                {/* Autocomplete autocomplete suggestion blocks */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white text-slate-800 rounded-sm shadow-2xl border border-slate-300 z-50 overflow-hidden max-h-60 overflow-y-auto">
                    <div className="bg-slate-100 text-[10px] font-black text-slate-500 px-3 py-2 uppercase tracking-wider border-b">
                      Direct Warehouse Catalog Matches
                    </div>
                    {suggestions.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSearchQuery(s.partNumber);
                          setSearchField('partNumber');
                          setMatchType('exact');
                          setShowSuggestions(false);
                          setPage(1);
                          setTimeout(fetchProducts, 50);
                        }}
                        className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-xs flex justify-between items-center transition"
                      >
                        <div>
                          <strong className="text-[#003366]">{s.partNumber}</strong>
                          <span className="text-slate-400 text-[10px] ml-2">({s.name})</span>
                        </div>
                        <span className="text-[10px] bg-slate-200 text-slate-600 font-extrabold px-1.5 py-0.5 rounded-sm uppercase">
                          {s.brand}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Criteria Field Select */}
              <div className="lg:col-span-3">
                <select
                  value={searchField}
                  onChange={(e: any) => setSearchField(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-3 text-sm rounded-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#f2cc4d]"
                >
                  <option value="any">Search All Fields</option>
                  <option value="partNumber">Product Part Number</option>
                  <option value="name">Product Name Description</option>
                  <option value="brand">Manufacturer / Brand</option>
                  <option value="series">Bearing Series Group</option>
                </select>
              </div>

              {/* Match Criteria Select */}
              <div className="lg:col-span-2">
                <select
                  value={matchType}
                  onChange={(e: any) => setMatchType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-3 text-sm rounded-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#f2cc4d]"
                >
                  <option value="contains">Contains Input</option>
                  <option value="startsWith">Starts With Input</option>
                  <option value="exact">Exact Code Match</option>
                </select>
              </div>

              {/* Big Yellow Sourcing Button */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-[#f2cc4d] hover:bg-[#e1bd41] text-[#003366] font-black px-4 py-3 rounded-sm text-sm uppercase transition cursor-pointer border-b-2 border-amber-600 shadow-md text-center"
                >
                  Search Catalog
                </button>
              </div>

            </form>
          </div>
        )}

        {/* 2. TABBED CONTENT PAGES DISPLAY */}
        
        {/* --- BRAND PAGE RENDER --- */}
        {currentTab === 'brands' && (
          <section className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 space-y-8 text-slate-800">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-black uppercase text-[#003366]">AUTHORIZED GLOBAL POWER BRANDS</h2>
              <p className="text-slate-500 text-sm mt-1">High-performance industrial bearing sourcing pathways globally approved.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 'brands-nsk',
                  title: 'NSK',
                  country: 'Japan',
                  desc: 'World-renowned manufacturer of high-precision bearings and motion control linear systems.',
                  products: [
                    'Deep Groove Ball Bearings', 'Angular Contact Ball Bearings', 
                    'Self Aligning Ball Bearings', 'Thrust Ball Bearings', 
                    'Cylindrical Roller Bearings', 'Spherical Roller Bearings', 
                    'Tapered Roller Bearings', 'Super Precision Machine Spindles'
                  ]
                },
                {
                  id: 'brands-thk',
                  title: 'THK',
                  country: 'Japan',
                  desc: 'Global leader in advanced linear motion engineering technology and guide blocks.',
                  products: [
                    'LM Guide Linear Assemblies', 'Precision Ball Splines', 
                    'Linear Motion Bushings', 'Rolled & Ground Ball Screws', 
                    'Cross Roller Rings', 'Cam Followers & Link Balls'
                  ]
                },
                {
                  id: 'brands-ntn',
                  title: 'NTN',
                  country: 'Japan',
                  desc: 'Premium high-performance industrial bearings featuring long-life lubrication seals.',
                  products: [
                    'Deep Groove 16001 to 16032 Series', 'Flanged Cast-Iron Pillow Housings',
                    'Spherical roller units', 'Thrust needle rollers'
                  ]
                }
              ].map((brandItem) => (
                <div key={brandItem.id} className="bg-slate-50 border rounded-lg p-5 flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-2xl font-black tracking-wider text-[#003366]">{brandItem.title}</h3>
                      <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">
                        {brandItem.country}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-4 font-medium leading-relaxed">{brandItem.desc}</p>
                    <div className="space-y-1.5">
                      <span className="block text-[10px] font-black py-0.5 uppercase tracking-wider text-slate-400">Core Range Supplied</span>
                      <ul className="text-xs space-y-1 text-slate-700">
                        {brandItem.products.map((pName, sIdx) => (
                          <li key={sIdx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            {pName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBrand(brandItem.title);
                      setCurrentTab('home');
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className="w-full mt-6 bg-[#003366] hover:bg-[#0056b3] text-white font-extrabold text-xs uppercase py-2.5 rounded transition tracking-wider cursor-pointer text-center"
                  >
                    Filter {brandItem.title} Bearings
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- SERVICES PAGE RENDER --- */}
        {currentTab === 'services' && (
          <div className="space-y-8">
            <section className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 space-y-8 text-slate-800">
              <div className="border-b pb-4">
                <h2 className="text-2xl font-black uppercase text-[#003366]">Premium Sourcing & Engineering Services</h2>
                <p className="text-slate-500 text-sm mt-1">Universal Enterprise streamlines industrial procurement pipelines certified by origin specialists.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Bearing Supply Sourcing', desc: 'Sourcing standard deep grooves, angular balls or tapered roller housings directly from authorized brand vaults.' },
                  { title: 'Difficult Sourcing Desk', desc: 'Specializing in sourcing rare, obsolete, or non-standard metric sizes globally across Sweden, Japan, & USA.' },
                  { title: 'Technical Consultations', desc: 'Free access to engineering consultations for load rating calculators, seal clearance choices, and vibration tolerances.' },
                  { title: 'OEM Bulk Procurement', desc: 'Procurement discount schedules mapped for heavy manufacturing rolling mills, steel plants and conveyor makers.' },
                  { title: 'Fast Logistics Dispatch', desc: 'Secure air-dispatch channels to Delhi, Mumbai, Kolkata, Chennai and central production centers in under 24 hours.' },
                  { title: 'Corporate Diagnostics Support', desc: 'Offering technical diagnostics for on-site grease failure replacement schedules and laser assembly guidelines.' }
                ].map((serv, idx) => (
                  <div key={idx} className="bg-slate-50 border p-5 rounded-lg flex flex-col justify-between hover:border-blue-300 transition">
                    <div>
                      <h3 className="font-bold text-slate-950 text-base leading-tight mb-2.5">{serv.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">{serv.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        setContactForm({
                          ...contactForm,
                          productRequirements: `Interchange request for: ${serv.title}`
                        });
                        setCurrentTab('contact');
                      }}
                      className="mt-4 text-xs font-extrabold text-[#0056b3] hover:text-[#003366] flex items-center gap-1 transition"
                    >
                      Open Engineering Inquiry <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <PremiumServicesAdditions />
          </div>
        )}

        {/* --- ABOUT PAGE RENDER --- */}
        {currentTab === 'about' && (
          <div className="space-y-8">
            <section className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 space-y-8 text-slate-800">
              <div className="border-b pb-4">
                <h2 className="text-2xl font-black uppercase text-[#003366]">ABOUT UNIVERSAL ENTERPRISE</h2>
                <p className="text-slate-500 text-sm mt-1">Establishing precision bearing benchmarks since decades of manufacturing distribution.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-slate-900 lowercase first-letter:uppercase">Distributing confidence with absolute genuine credentials</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    UNIVERSAL ENTERPRISE is a certified distributor specializing in high-performance bearings, linear guides, ball screws and companion motion items from trusted international brands. We operate across vital manufacturing corridors, acting as sole authorized sourcing nodes for steel converters, automobile lines, automation systems, and textile sectors.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-[#003366]/5 p-3 rounded">
                      <span className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider">Mission Statement</span>
                      <span className="text-xs font-bold text-slate-800 mt-0.5 block leading-normal">Safeguard machine uptime with 100% genuine guaranteed bearings.</span>
                    </div>
                    <div className="bg-amber-400/5 p-3 rounded">
                      <span className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider">Core Vision</span>
                      <span className="text-xs font-bold text-slate-800 mt-0.5 block leading-normal">To represent the most powerful, frictionless distribution desk in Asia.</span>
                    </div>
                  </div>
                </div>

                {/* Achievements checklists */}
                <div className="bg-slate-50 p-5 rounded-lg border space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#003366]">Why Choose Universal Sourcing?</h3>
                  <ul className="text-xs space-y-2.5 font-medium text-slate-700">
                    {[
                      { title: 'Genuine Certified Gaskets', d: 'Securely dispatch tracking certificates of origin directly matching individual factory codes.' },
                      { title: 'Highly Competitive Wholesale Spans', d: 'Custom quote discounts mapped for batch size volumes.' },
                      { title: 'Expert Sourcing Engineers', d: 'We analyze bore diameters and inner clearances using exact CAD templates.' },
                      { title: 'Secure 24hr Pipeline', d: 'Fast logistics corridors serving Mumbai, Delhi, Kolkata, Chennai, and Indore hubs.' }
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 block">{item.title}</span>
                          <span className="text-slate-500 font-normal leading-relaxed">{item.d}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <PremiumAboutAdditions />
          </div>
        )}

        {/* --- CONTACT & OFFICES PAGE RENDER --- */}
        {currentTab === 'contact' && (
          <div className="space-y-8">
            <section className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 space-y-8 text-slate-800">
              <div className="border-b pb-4">
                <h2 className="text-2xl font-black uppercase text-[#003366]">CONTACT OUR ENGINEERING DESK</h2>
                <p className="text-slate-500 text-sm mt-1">Get immediate pricing and technical advice from geographically mapped office cells.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Office maps grid */}
                <div className="lg:col-span-5 space-y-5">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#003366] border-b pb-1">Geographic Sourcing Hubs</h3>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                    {[
                      { city: 'Chennai (Head Office)', addr: 'Polyhose Tower, Mount Road, Guindy, Chennai 600032', tel: '+91 44 6686 7700' },
                      { city: 'Mumbai Sourcing Hub', addr: 'Unit No 1104, DLH Park, S V Road, Goregaon West, Mumbai 400062', tel: '+91 22 4531 8800' },
                      { city: 'Delhi Sourcing Desk', addr: '904, 9th Floor, International Trade Tower, Nehru Place, New Delhi 110019', tel: '+91 11 9980 1122' },
                      { city: 'Kolkata Sourcing Desk', addr: 'Unit No 13, 7th Floor, Acropolis Office Complex, 1858/1 Rajdanga Main Road, Kolkata 700107', tel: '+91 33 2211 4455' }
                    ].map((loc, idx) => (
                      <div key={idx} className="bg-slate-50 border p-3.5 rounded flex gap-3 items-start">
                        <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <h4 className="font-extrabold text-slate-900 uppercase">{loc.city}</h4>
                          <p className="text-slate-500 mt-1">{loc.addr}</p>
                          <span className="block font-mono text-[#003366] mt-1.5 font-bold">Tel: {loc.tel}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirement Submission form */}
                <div className="lg:col-span-7 bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#003366] mb-4">Submit obsolete/custom specification sheets</h3>
                  
                  {contactSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded text-center space-y-2">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                      <h4 className="text-lg font-bold">Inquiry Broadcasted</h4>
                      <p className="text-xs text-slate-600">
                        Our Chennai engineering hub has received your CAD/dimension specifications. We are computing comparative pricing options. Expect a call in under 2 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-600 font-bold">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className="mt-1 w-full p-2.5 bg-white border rounded" 
                            placeholder="Ramesh Kumar"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-bold">Company Name *</label>
                          <input
                            type="text"
                            required
                            value={contactForm.companyName}
                            onChange={(e) => setContactForm({ ...contactForm, companyName: e.target.value })}
                            className="mt-1 w-full p-2.5 bg-white border rounded" 
                            placeholder="Tata Structural Plant"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-600 font-bold">Contact Phone *</label>
                          <input
                            type="tel"
                            required
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            className="mt-1 w-full p-2.5 bg-white border rounded" 
                            placeholder="+91 94444 88888"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-bold">Officer Email *</label>
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="mt-1 w-full p-2.5 bg-white border rounded" 
                            placeholder="sourcing@tatasteel.com"
                          />
                        </div>
                      </div>

                      <div className="text-xs">
                        <label className="block text-slate-600 font-bold">Sourcing Codes & Core Brands (e.g., Bearings 16001, Linear Rails)</label>
                        <input
                          type="text"
                          value={contactForm.productRequirements}
                          onChange={(e) => setContactForm({ ...contactForm, productRequirements: e.target.value })}
                          className="mt-1 w-full p-2.5 bg-white border rounded"
                          placeholder="NTN 16010 x 50 Units, NSK HSR25 x 4 Assemblies"
                        />
                      </div>

                      <div className="text-xs">
                        <label className="block text-slate-600 font-bold">Required Delivery Window & Specifications</label>
                        <textarea
                          rows={3}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="mt-1 w-full p-2.5 bg-white border rounded"
                          placeholder="Please elaborate on environmental tolerances, moisture caps or rapid dispatch interval mandates..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#f2cc4d] hover:bg-[#ebd047] text-slate-900 font-extrabold text-xs uppercase py-3 rounded cursor-pointer transition transform hover:scale-101 border-b-2 border-amber-600"
                      >
                        Submit Corporate Application
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </section>

            <PremiumContactAdditions />
          </div>
        )}

        {/* --- COMPARE DESK PAGE RENDER --- */}
        {currentTab === 'compare' && (
          <CompareSpecsPage
            compareItems={compareItems}
            onRemoveItem={(p) => setCompareItems((prev) => prev.filter((item) => item.id !== p.id))}
            onClearAll={() => setCompareItems([])}
            onAddToQuote={(p) => handleAddToQuote(p)}
            onViewDetails={(p) => setSelectedProduct(p)}
            onBackToCatalog={() => {
              setCurrentTab('home');
              setTimeout(() => {
                const searchAnchor = document.getElementById('search-engine-anchor');
                searchAnchor?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        )}

        {/* --- CATEGORIES MATRIX EXPLORER PAGE --- */}
        {currentTab === 'categories' && (
          <CategoriesPage
            productsList={products}
            onSelectCategory={(catName) => {
              setSelectedCategory(catName);
              if (typeof setPage === 'function') {
                setPage(1);
              }
              setCurrentTab('home');
              setTimeout(() => {
                const searchAnchor = document.getElementById('search-engine-anchor');
                searchAnchor?.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            }}
          />
        )}

        {/* --- INTEGRATED CRM DASHBOARD PAGE --- */}
        {currentTab === 'crm' && (
          <CrmDashboard
            productsList={products}
            onBackToCatalog={() => {
              setCurrentTab('home');
              setTimeout(() => {
                const searchAnchor = document.getElementById('search-engine-anchor');
                searchAnchor?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        )}

        {/* --- ORDER LOGISTICS TRACKING PAGE --- */}
        {currentTab === 'tracking' && (
          <OrderTrackingPage />
        )}

        {/* --- CATALOG HOME PAGE CONTAINER LAYOUT --- */}
        {currentTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT SIDEBAR PRODUCT FILTER SYSTEM */}
            <aside className="lg:col-span-3 bg-white border rounded-sm shadow-xs overflow-hidden">
              <div className="bg-[#003366] text-white p-4 flex items-center justify-between border-b-2 border-[#f2cc4d]">
                <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-[#f2cc4d]" />
                  Advanced Sourcing Filters
                </h4>
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] text-amber-300 hover:text-white font-black uppercase transition"
                >
                  Clear All
                </button>
              </div>

              {/* Collapsed Category Tree Selector */}
              <div className="p-4 space-y-6">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2">
                    Product Category Tree
                  </label>
                  
                  {/* Render Categories */}
                  <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        setPage(1);
                      }}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-sm transition font-black uppercase truncate cursor-pointer ${
                        selectedCategory === '' 
                          ? 'bg-slate-100 text-[#003366]' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      All Categories
                    </button>
                    {CATEGORY_TREE.map((cat, idx) => (
                      <div key={idx} className="space-y-1 pl-1">
                        <span className="block text-[10px] font-black text-[#003366] px-1 text-xs select-none">
                          {cat.name}
                        </span>
                        {cat.subcategories?.map((subcat, subIdx) => (
                          <div key={subIdx} className="pl-1 text-left">
                            <button
                              onClick={() => {
                                setSelectedCategory(subcat.name);
                                setPage(1);
                              }}
                              className={`w-full text-left text-[11px] py-1 px-1.5 rounded truncate transition font-medium cursor-pointer ${
                                selectedCategory === subcat.name 
                                  ? 'bg-[#0056b3]/10 text-[#0056b3] font-bold border-l-2 border-[#0056b3]' 
                                  : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              📁 {subcat.name}
                            </button>
                            {subcat.subcategories?.map((lowercat, lowerIdx) => (
                              <button
                                key={lowerIdx}
                                onClick={() => {
                                  setSelectedCategory(lowercat.name);
                                  setPage(1);
                                }}
                                className={`w-full text-left text-[11px] py-0.5 px-3 truncate transition cursor-pointer ${
                                  selectedCategory === lowercat.name 
                                    ? 'text-[#0A84FF] font-bold border-l-2 border-[#0A84FF] bg-blue-50/50' 
                                    : 'text-slate-500 hover:text-slate-850 hover:bg-slate-50'
                                }`}
                              >
                                — {lowercat.name}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sourced Brands list filters */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2">
                    Sourced Brands
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      setPage(1);
                    }}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-sm focus:ring-1 focus:ring-[#003366] focus:border-[#003366] text-slate-800 font-semibold"
                  >
                    <option value="">All Brands (A-Z)</option>
                    {INITIAL_BRANDS.map((bName) => (
                      <option key={bName} value={bName}>
                        {bName.includes('(') ? bName : `${bName} Bearings`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Inner Diameter Min Max (Bore ID mm) */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    Inside Bore Bored (ID mm)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={innerDiameterMin}
                      onChange={(e) => setInnerDiameterMin(e.target.value)}
                      placeholder="Min (e.g. 10)"
                      className="text-xs p-2 bg-white border border-slate-300 rounded-sm w-full font-mono font-bold"
                    />
                    <input
                      type="number"
                      value={innerDiameterMax}
                      onChange={(e) => setInnerDiameterMax(e.target.value)}
                      placeholder="Max (e.g. 160)"
                      className="text-xs p-2 bg-white border border-slate-300 rounded-sm w-full font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Outer Diameter Range */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    Outside Diameter (OD mm)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={outerDiameterMin}
                      onChange={(e) => setOuterDiameterMin(e.target.value)}
                      placeholder="Min (e.g. 20)"
                      className="text-xs p-2 bg-white border border-slate-300 rounded-sm w-full font-mono font-bold"
                    />
                    <input
                      type="number"
                      value={outerDiameterMax}
                      onChange={(e) => setOuterDiameterMax(e.target.value)}
                      placeholder="Max (e.g. 240)"
                      className="text-xs p-2 bg-white border border-slate-300 rounded-sm w-full font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Width Range */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    Width (overall mm)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={widthMin}
                      onChange={(e) => setWidthMin(e.target.value)}
                      placeholder="Min (e.g. 5)"
                      className="text-xs p-2 bg-white border border-slate-300 rounded-sm w-full font-mono font-bold"
                    />
                    <input
                      type="number"
                      value={widthMax}
                      onChange={(e) => setWidthMax(e.target.value)}
                      placeholder="Max (e.g. 30)"
                      className="text-xs p-2 bg-white border border-slate-[#c1c1c1] rounded-sm w-full font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Compound Material */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    Constituent Material
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-sm font-semibold text-slate-800"
                  >
                    <option value="">All Materials</option>
                    <option value="Chrome Steel">High-Carbon Chrome Steel</option>
                    <option value="Stainless Steel">Premium Stainless Steel</option>
                    <option value="Ceramic">High Temp Ceramic</option>
                  </select>
                </div>

                {/* Country of origin */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    Country of Origin
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-sm font-semibold text-slate-800"
                  >
                    <option value="">All Regions</option>
                    <option value="Japan">Japan (authorized)</option>
                    <option value="Sweden">Sweden (SKF factory)</option>
                    <option value="Germany">Germany (FAG factory)</option>
                  </select>
                </div>

                {/* Seal type */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    Shield / Seal Grade
                  </label>
                  <select
                    value={sealType}
                    onChange={(e) => setSealType(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-sm font-semibold text-slate-800"
                  >
                    <option value="">All Seals</option>
                    <option value="Open">Open Design (No seal)</option>
                    <option value="Metal Shielded">Metal Shields (ZZ)</option>
                    <option value="Rubber Sealed">Rubber Seals (2RS)</option>
                  </select>
                </div>

                {/* Price range */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    Direct Quote Estimate Price (₹ INR)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder="Min ₹"
                      className="text-xs p-2 bg-white border border-slate-300 rounded-sm w-full font-mono font-bold"
                    />
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder="Max ₹"
                      className="text-xs p-2 bg-white border border-slate-300 rounded-sm w-full font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Filter Sourced Stock Status */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    Stock Availability
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-sm font-semibold text-slate-800"
                  >
                    <option value="">All Statuses</option>
                    <option value="available">Available / 24hr Ready</option>
                    <option value="low stock">On-Demand / Low Stock</option>
                  </select>
                </div>

              </div>
            </aside>

            {/* PRODUCT CATALOG RESULTS (RIGHT SECTION) */}
            <section className="lg:col-span-9 space-y-4">
              
              {/* Toolbar */}
              <div className="bg-white border rounded-sm p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs text-slate-700">
                <div className="text-xs text-slate-500 font-medium">
                  {loading ? (
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Querying direct warehouse indexes...
                    </span>
                  ) : (
                    <span>
                      Sourced catalog found <strong>{totalCount}</strong> high-precision items matching criteria
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  
                  {/* Sorting option select */}
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Sort:</span>
                    <select
                      value={sortOption}
                      onChange={(e) => {
                        setSortOption(e.target.value);
                        setPage(1);
                      }}
                      className="bg-slate-50 border rounded text-[11px] p-1.5 focus:outline-none"
                    >
                      <option value="partNumber-asc">Numerical Part Code A-Z</option>
                      <option value="partNumber-desc">Numerical Part Code Z-A</option>
                      <option value="price-asc">Price Index: Low to High</option>
                      <option value="price-desc">Price Index: High to Low</option>
                    </select>
                  </div>

                  {/* Grid / Table layout Toggle */}
                  <div className="flex border rounded overflow-hidden">
                    <button
                      onClick={() => setViewType('table')}
                      className={`p-1.5 cursor-pointer ${viewType === 'table' ? 'bg-[#003366] text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                      title="Bulk Tabular View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewType('grid')}
                      className={`p-1.5 cursor-pointer ${viewType === 'grid' ? 'bg-[#003366] text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                      title="Representative Bento Grid"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Admin toggle database loader quick drawer link */}
                  <button
                    onClick={() => setAdminOpen(!adminOpen)}
                    className="bg-slate-100 border hover:bg-slate-200 text-slate-900 font-black text-[10px] px-2.5 py-1.5 rounded uppercase tracking-wider cursor-pointer"
                  >
                    CSV Sync
                  </button>
                </div>
              </div>

              {/* RENDER ADMIN DRAWER QUICK TOOL IN-SCREEN AT TOP OF MAIN PANEL */}
              {adminOpen && (
                <div className="transition-all duration-300">
                  <AdminUpload onUploadSuccess={() => {
                    fetchProducts();
                    setAdminOpen(false); // Close once sync completed
                  }} />
                </div>
              )}

              {/* COMPREHENSIVE RENDER RESULTS */}
              {products.length === 0 ? (
                <div className="bg-white border rounded-lg p-16 text-center space-y-3">
                  <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700 text-lg">No interchangeable bearings found.</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Try wiping search queries or dimension limitations on the left. Alternatively tell our AI assistant in the lower right what bearing is obsolete so we source it globally for you!
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-[#003366] hover:bg-[#0056b3] text-white text-xs font-bold px-4 py-2 rounded transition"
                  >
                    Reset all specs filters
                  </button>
                </div>
              ) : (
                <>
                  {viewType === 'table' ? (
                    
                    /* --- BULK INDUSTRIAL MATRIX TABULAR VIEW --- */
                    <div className="bg-white border border-gray-300 rounded-sm shadow-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#003366] text-white font-black border-b border-gray-200 select-none">
                              <th className="px-3.5 py-3 text-[10px] uppercase tracking-widest font-mono font-black">Part Number</th>
                              <th className="px-3.5 py-3 text-[10px] uppercase tracking-widest font-mono font-black">Brand</th>
                              <th className="px-3 py-3 text-[10px] uppercase tracking-widest font-mono font-black">Type Category</th>
                              <th className="px-3.5 py-3 text-[10px] uppercase tracking-widest font-mono font-black">Sizes (ID x OD x W)</th>
                              <th className="px-3.5 py-3 text-[10px] uppercase tracking-widest font-mono font-black">Mass</th>
                              <th className="px-3.5 py-3 text-[10px] uppercase tracking-widest font-mono font-black">Sourced Ready</th>
                              <th className="px-3.5 py-3 text-[10px] uppercase tracking-widest font-mono font-black">Est. Price</th>
                              <th className="px-3.5 py-3 text-[10px] uppercase tracking-widest font-mono font-black text-center">Procurement Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {products.map((p) => {
                              const isCompared = compareItems.some((c) => c.id === p.id);
                              
                              return (
                                <tr key={p.id} className="hover:bg-slate-50/70 transition-all">
                                  <td className="px-3.5 py-3 font-bold text-[#003366] font-mono select-all">
                                    <button 
                                      onClick={() => setSelectedProduct(p)}
                                      className="hover:underline text-left font-black"
                                    >
                                      {p.partNumber}
                                    </button>
                                  </td>
                                  <td className="px-3.5 py-3">
                                    <span className="font-extrabold uppercase font-mono text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                                      {p.brand}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3 text-slate-500 truncate max-w-[140px] font-semibold">{p.category}</td>
                                  <td className="px-3.5 py-3 text-slate-800 font-mono">
                                    {p.innerDiameter} x {p.outerDiameter} x {p.width} mm
                                  </td>
                                  <td className="px-3.5 py-3 font-mono text-slate-400">{p.weight}</td>
                                  <td className="px-3.5 py-3 select-none">
                                    <span className={`inline-block w-2.5 h-2.5 rounded-full mr-1.5 ${p.stockStatus === 'Available' ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{p.stockStatus}</span>
                                  </td>
                                  <td className="px-3.5 py-3 font-extrabold text-slate-900 select-all">
                                    ₹{p.price}
                                  </td>
                                  <td className="px-3.5 py-3">
                                    <div className="flex items-center justify-center gap-2">
                                      
                                      {/* Quantity Adjuster */}
                                      <div className="flex items-center border rounded bg-white overflow-hidden shadow-xs shrink-0 select-none">
                                        <button
                                          onClick={() => setQuantities({ ...quantities, [p.id]: Math.max(1, (quantities[p.id] || 1) - 1) })}
                                          className="px-2 py-1 text-slate-500 hover:bg-slate-100 font-bold text-xs"
                                        >
                                          -
                                        </button>
                                        <span className="px-2 text-[11px] font-black">{quantities[p.id] || 1}</span>
                                        <button
                                          onClick={() => setQuantities({ ...quantities, [p.id]: (quantities[p.id] || 1) + 1 })}
                                          className="px-2 py-1 text-slate-500 hover:bg-slate-100 font-bold text-xs"
                                        >
                                          +
                                        </button>
                                      </div>

                                      {/* Add corresponding part to invoice quote cart list */}
                                      <button
                                        onClick={() => handleAddToQuote(p)}
                                        className="bg-[#f2cc4d] hover:bg-[#e4be3c] text-slate-950 px-3 py-1.5 rounded font-black text-[10px] uppercase shadow-xs transition transform hover:scale-102 cursor-pointer"
                                      >
                                        Add to Quote
                                      </button>

                                      <button
                                        onClick={() => handleToggleCompare(p)}
                                        className={`px-2 py-1.5 rounded text-[10px] font-bold border transition ${isCompared ? 'bg-amber-400 border-amber-500 text-slate-950 font-black' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                                      >
                                        {isCompared ? 'Comparing' : 'Compare'}
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    
                    /* --- REPRESENTATIVE BENTO GRID CARD LAYOUT --- */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {products.map((p) => {
                        const isCompared = compareItems.some((c) => c.id === p.id);
                        
                        return (
                          <div key={p.id} className="bg-white border-2 border-slate-250 rounded-sm p-4 flex flex-col justify-between hover:shadow-md transition text-slate-800">
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="bg-slate-100 border border-slate-300 text-slate-705 font-black text-[9px] px-2 py-0.5 rounded-sm tracking-wide uppercase">
                                  {p.brand} GENUINE
                                </span>
                                <span className={`text-[10px] font-black uppercase select-none ${p.stockStatus === 'Available' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                  ● {p.stockStatus}
                                </span>
                              </div>
                              
                              <h4 className="font-extrabold text-[#003366] text-base mt-2 tracking-tight select-all">
                                {p.partNumber}
                              </h4>
                              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{p.name}</p>

                              {/* Specs tags */}
                              <div className="bg-slate-50 rounded-sm border border-slate-200 p-2.5 mt-3 space-y-1 text-[11px] text-slate-700 font-mono">
                                <div className="flex justify-between">
                                  <span className="text-slate-400 font-bold uppercase text-[9px]">Internal Bore ID:</span>
                                  <span className="font-bold text-slate-1000">{p.innerDiameter} mm</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400 font-bold uppercase text-[9px]">Outside OD:</span>
                                  <span className="font-bold text-slate-1000">{p.outerDiameter} mm</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400 font-bold uppercase text-[9px]">Width thickness B:</span>
                                  <span className="font-bold text-slate-1000">{p.width} mm</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400 font-bold uppercase text-[9px]">Net Mass:</span>
                                  <span className="text-slate-500">{p.weight}</span>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-slate-200 pt-3 mt-4 space-y-3.5">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Estim. Value</span>
                                <span className="font-black text-[#003366] text-base select-all">₹{p.price}</span>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => setSelectedProduct(p)}
                                  className="bg-slate-100 hover:bg-slate-205 border border-slate-300 rounded-sm py-2 text-[11px] font-black uppercase text-slate-700 transition"
                                >
                                  Detailed Specs
                                </button>
                                <button
                                  onClick={() => handleToggleCompare(p)}
                                  className={`border rounded-sm py-2 text-[11px] font-black uppercase transition truncate ${isCompared ? 'bg-amber-400 border-amber-500 text-slate-950 font-black' : 'bg-white text-slate-500 border-slate-300'}`}
                                >
                                  {isCompared ? '✔ Comparing' : '➕ Compare'}
                                </button>
                              </div>

                              {/* Direct quote dispatch action */}
                              <button
                                onClick={() => handleAddToQuote(p)}
                                className="w-full bg-[#f2cc4d] hover:bg-[#e1bd41] text-[#003366] font-black py-2.5 rounded-sm text-[11px] uppercase border-b-2 border-amber-600 transition transform active:scale-95 cursor-pointer text-center"
                              >
                                Add Part To Quote
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Dynamic interactive Side-By-Side comparison bar when matching products checked */}
                  {compareItems.length > 0 && (
                    <div className="bg-slate-900 text-white rounded-lg p-5 border-t-4 border-[#f2cc4d] space-y-4">
                      <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-2.5 gap-2">
                        <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                          Interchangeable Bearing Specs Comparison Matrix ({compareItems.length}/3 checked)
                        </span>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => {
                              setCurrentTab('compare');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-[#f2cc4d] hover:bg-[#e1bd41] text-[#003366] font-black text-[11px] px-3.5 py-1.5 rounded-sm uppercase tracking-wider transition shadow-sm cursor-pointer border-b-2 border-amber-600"
                          >
                            Open Dedicated Comparison Page &rarr;
                          </button>
                          <button
                            onClick={() => setCompareItems([])}
                            className="text-[10px] text-slate-400 hover:text-red-400 font-extrabold uppercase transition"
                          >
                            Clear Comparison
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="space-y-1.5 text-xs text-slate-400 pt-8 hidden sm:block font-bold uppercase tracking-wider text-[10px]">
                          <div>Inside Bore Bored:</div>
                          <div className="pt-2">Outside OD:</div>
                          <div className="pt-2">Width (B):</div>
                          <div className="pt-2">CageRetainer:</div>
                          <div className="pt-2">Estim. Price:</div>
                        </div>

                        {compareItems.map((c) => (
                          <div key={c.id} className="bg-slate-950 p-3 rounded text-xs ring-1 ring-slate-800 relative">
                            <span className="absolute top-1 right-2 uppercase text-[9px] text-[#0A84FF] font-black">{c.brand}</span>
                            <h5 className="font-extrabold text-[#f2cc4d] mb-2">{c.partNumber}</h5>
                            
                            <div className="space-y-1.5 text-slate-200">
                              <div className="flex justify-between border-b border-slate-900 pb-1">
                                <span className="sm:hidden text-slate-500">Inside Bored:</span>
                                <strong>{c.innerDiameter} mm</strong>
                              </div>
                              <div className="flex justify-between border-b border-slate-900 pb-1">
                                <span className="sm:hidden text-slate-500">Outside OD:</span>
                                <strong>{c.outerDiameter} mm</strong>
                              </div>
                              <div className="flex justify-between border-b border-slate-900 pb-1">
                                <span className="sm:hidden text-slate-500">Width B:</span>
                                <strong>{c.width} mm</strong>
                              </div>
                              <div className="flex justify-between border-b border-slate-900 pb-1">
                                <span className="sm:hidden text-slate-500">Retainer:</span>
                                <span className="text-slate-300 truncate font-semibold">{c.cageType}</span>
                              </div>
                              <div className="flex justify-between pb-1 pt-1 font-extrabold text-[#f2cc4d] text-sm">
                                <span className="sm:hidden text-slate-500 font-normal">Pricing:</span>
                                <span>₹{c.price}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                handleAddToQuote(c);
                                setCompareItems([]);
                              }}
                              className="w-full mt-3 bg-[#f2cc4d] hover:bg-yellow-500 text-slate-950 font-extrabold py-1.5 rounded text-[10px] uppercase transition cursor-pointer"
                            >
                              Add To Cart Invoice
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pagination control desk linking to api offsets */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t pt-5 select-none font-semibold text-slate-500">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="bg-white border rounded p-2.5 hover:bg-slate-100 disabled:opacity-40 transition flex items-center gap-1.5 text-xs hover:text-slate-900 cursor-pointer text-slate-500"
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous Group
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pIndex) => (
                          <button
                            key={pIndex}
                            onClick={() => setPage(pIndex)}
                            className={`px-3.5 py-2 rounded text-xs border font-extrabold transition cursor-pointer ${page === pIndex ? 'bg-[#003366] text-white border-[#003366] shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600'}`}
                          >
                            {pIndex}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="bg-white border rounded p-2.5 hover:bg-slate-100 disabled:opacity-40 transition flex items-center gap-1.5 text-xs hover:text-slate-900 cursor-pointer text-slate-500"
                      >
                        Next Group <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </>
              )}
            </section>
          </div>
        )}

        {/* INDUSTRIES SERVED SECTION (Shown on homepage and informational segments) */}
        {currentTab === 'home' && (
          <section className="bg-slate-800 text-white rounded-lg p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-700 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold uppercase tracking-tight text-white">Authorized Heavy Industries Served</h3>
                <p className="text-slate-400 text-xs mt-0.5">Custom clearance bearings optimized for operational speeds.</p>
              </div>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase tracking-widest hidden sm:block">
                Interchange Index
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                { name: 'Manufacturing Processes', desc: 'CNC Spindles, Conveyors' },
                { name: 'Heavy Steel Plants', desc: 'Blast rolls, Spherical slots' },
                { name: 'Automotive Assemblies', desc: 'Alternators, Transmissions' },
                { name: 'Packaging Machinery', desc: 'Tapered sleeves, seals' },
                { name: 'High-Speed Automation', desc: 'LM Guides, Ball Screws' },
                { name: 'Food Processing Units', desc: 'Ceramic & Stainless items' },
                { name: 'Heavy Power Plants', desc: 'Turbine rotors, heavy thrust' },
                { name: 'Textile Spinnerets', desc: 'Standard Deep Groove' }
              ].map((ind, i) => (
                <div key={i} className="bg-slate-900/60 p-3.5 rounded border border-slate-800 flex flex-col justify-between">
                  <span className="text-amber-400 font-bold text-xs block truncate" title={ind.name}>{ind.name}</span>
                  <span className="text-slate-400 text-[10px] block mt-1">{ind.desc}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {currentTab === 'home' && (
          <PremiumHomeAdditions
            onCategorySelect={(cat) => {
              setSelectedCategory(cat);
              setPage(1);
              const searchAnchor = document.getElementById('search-engine-anchor');
              searchAnchor?.scrollIntoView({ behavior: 'smooth' });
            }}
            onBrandSelect={(brand) => {
              setSelectedBrand(brand);
              setPage(1);
              const searchAnchor = document.getElementById('search-engine-anchor');
              searchAnchor?.scrollIntoView({ behavior: 'smooth' });
            }}
            onAddLog={(log) => {
              console.log(log);
            }}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-slate-900 text-slate-300 border-t-8 border-[#003366] mt-16 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-6 h-6 text-[#f2cc4d] animate-pulse" />
              <span className="text-xl font-black tracking-tight text-white">UNIVERSAL ENTERPRISE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Trusted corporate distributor of genuine high-performance bearings, rollers and linear motion assemblies serving heavy industrial mills, auto structures, and automation grids.
            </p>
            <div className="flex gap-3 text-white">
              {/* Social icons */}
              <a href="#" className="p-1 px-2 text-xs bg-slate-800 rounded hover:bg-[#f2cc4d] hover:text-slate-900 transition">LinkedIn</a>
              <a href="#" className="p-1 px-2 text-xs bg-slate-800 rounded hover:bg-[#f2cc4d] hover:text-slate-900 transition">Facebook</a>
              <a href="https://api.whatsapp.com/send?phone=+914466867700" className="p-1 px-2 text-xs bg-slate-800 rounded hover:bg-green-600 transition">WhatsApp</a>
            </div>
          </div>

          {/* Catalog index lists */}
          <div className="space-y-3.5 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Primary Catalog range</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Deep Groove Ball Bearings (16001 - 16032)</li>
              <li>Angular Contact Ball Guides</li>
              <li>THK Linear Rails & LM Systems</li>
              <li>Pillow Block Cast Housings</li>
              <li>Ball Screw ground assemblies</li>
            </ul>
          </div>

          {/* Quick tabs */}
          <div className="space-y-3.5 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Sourcing Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => setCurrentTab('home')} className="hover:text-white transition">In-stock Bearings List</button></li>
              <li><button onClick={() => setCurrentTab('brands')} className="hover:text-white transition">Authorized Brands</button></li>
              <li><button onClick={() => setCurrentTab('services')} className="hover:text-white transition">Engineering Services</button></li>
              <li><button onClick={() => setCurrentTab('about')} className="hover:text-white transition">About Corporate</button></li>
              <li><button onClick={() => setCurrentTab('contact')} className="hover:text-white transition">Contact & Locations</button></li>
            </ul>
          </div>

          {/* Email Newsletter */}
          <div className="space-y-3.5 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Warehouse Dispatch Notification</h4>
            <p className="text-slate-400 leading-normal">
              Subscribe to obselete parts dispatch list alert notifications.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Obsolete Bearings Feed.'); }} className="flex gap-1 pt-1.5">
              <input
                type="email"
                required
                className="p-2 w-full text-xs bg-slate-950 border border-slate-700 text-slate-300 rounded focus:outline-none"
                placeholder="procurement@company.com"
              />
              <button
                type="submit"
                className="bg-[#f2cc4d] text-slate-900 font-extrabold px-3 py-1.5 rounded hover:bg-[#e9c540] transition cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500 flex flex-wrap justify-between gap-4 font-mono select-none">
          <span>© 2026 UNIVERSAL ENTERPRISE. All Rights Reserved. Authorized Distributor.</span>
          <span className="text-[#f2cc4d]">Precision Bearings. Trusted Industrial Solutions.</span>
        </div>
      </footer>

      {/* --- FLOATING MODALS & UTILITIES DRAWER SLIDES --- */}
      
      {/* Quote Basket Drawer overlap */}
      <QuoteListDrawer
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        quoteItems={quoteItems}
        updateQuantity={updateQuoteQuantity}
        removeFromQuote={removeFromQuote}
        clearQuote={() => setQuoteItems([])}
      />

      {/* Specifications Overlays Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToQuote={(product) => handleAddToQuote(product)}
      />

      {/* --- HOMEPAGE PROMO / LEAD ACQUISITION POPUP MODAL --- */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 select-none">
          <div className="bg-white border-4 border-[#003366] rounded-sm p-6 sm:p-8 max-w-lg w-full text-slate-800 space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => {
                sessionStorage.setItem('ue_promo_dismissed', 'true');
                setShowPromoModal(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition font-black text-sm uppercase p-1 shrink-0"
              title="Close modal"
            >
              ✕ Dismiss
            </button>

            <div className="space-y-1.5 border-b pb-4">
              <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded-sm uppercase tracking-widest font-mono">
                Corporate Gate Access
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#003366] uppercase tracking-tight leading-6 pt-2">
                Unlock OEM CAD Models & Dynamic Specification Desk
              </h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                Connect with Universal Enterprise s qualified FAG&INA technical engineers. Receive custom specifications and interchange pricing sheets directly.
              </p>
            </div>

            <form onSubmit={handlePromoSubmit} className="space-y-4 text-left text-xs">
              <div className="space-y-1">
                <label className="block text-slate-600 font-extrabold uppercase text-[10px]">Your Name / Representative *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Mahindra"
                  value={promoForm.name}
                  onChange={(e) => setPromoForm({ ...promoForm, name: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-[#003366] focus:outline-none focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-extrabold uppercase text-[10px]">Mobile Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98400 12000"
                    value={promoForm.phone}
                    onChange={(e) => setPromoForm({ ...promoForm, phone: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-[#003366] focus:outline-none focus:bg-white font-mono font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-extrabold uppercase text-[10px]">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. a.mahindra@mahindra.com"
                    value={promoForm.email}
                    onChange={(e) => setPromoForm({ ...promoForm, email: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-[#003366] focus:outline-none focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 font-extrabold uppercase text-[10px]">Core Component Segment Interest *</label>
                <select
                  value={promoForm.serviceInterest}
                  onChange={(e) => setPromoForm({ ...promoForm, serviceInterest: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-[#003366] focus:outline-none focus:bg-white font-bold"
                >
                  <option value="Ball Bearings">Ball Bearings</option>
                  <option value="Roller Bearings">Roller Bearings</option>
                  <option value="Thrust Bearings">Thrust Bearings</option>
                  <option value="Housings">Housings</option>
                  <option value="Linear Bearings">Linear Bearings</option>
                  <option value="Automotive Parts">Automotive Parts</option>
                  <option value="Other Bearings">Other Bearings</option>
                  <option value="Parts For Bearings">Parts For Bearings</option>
                  <option value="Snap Rings & Seals">Snap Rings & Seals</option>
                  <option value="Tools For Bearings">Tools For Bearings</option>
                  <option value="Grease & Lubrication">Grease & Lubrication</option>
                </select>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem('ue_promo_dismissed', 'true');
                    setShowPromoModal(false);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-3.5 rounded text-[11px] uppercase transition tracking-wider"
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#f2cc4d] hover:bg-yellow-500 text-slate-900 font-black py-3.5 rounded text-[11px] uppercase transition tracking-wider border-b-2 border-amber-600 shadow-md transform hover:scale-[1.01]"
                >
                  Apply & Synchronize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GROUNDED AI CHAT COMPANION & FLOATING ACTION BALL ACTIONS */}
      <AiCompanion 
        onSuggestSelect={(part) => {
          // find equivalent product or set queries automatically to trigger highlight view
          setSearchQuery(part);
          setSearchField('partNumber');
          setMatchType('exact');
          setPage(1);
          setTimeout(fetchProducts, 80);
          
          // Locate first matching option inoperation
          const found = products.find((p) => p.partNumber.toLowerCase() === part.toLowerCase());
          if (found) {
            setSelectedProduct(found);
          } else {
            // Check if exist in operates context
            const fullDBMock = productsDatabaseSample.find((p) => p.partNumber.toLowerCase() === part.toLowerCase());
            if (fullDBMock) setSelectedProduct(fullDBMock);
          }
        }}
        productsDatabaseSample={products}
      />

    </div>
  );
}
