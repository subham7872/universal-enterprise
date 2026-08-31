"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, SlidersHorizontal, Grid, List, RefreshCw, 
  ChevronLeft, ChevronRight, HelpCircle, Building2, CheckCircle2, 
  MapPin, Send, ArrowRight, ShieldCheck, Mail, Phone, Cpu, Database
} from 'lucide-react';
import { useApp } from '../components/AppClientWrapper';
import api from '../lib/api';
import AdminUpload from '../components/AdminUpload';
import PremiumHomeAdditions from '../components/PremiumHomeAdditions';
import OrderTrackingPage from '../components/OrderTrackingPage';
import CategoriesPage from '../components/CategoriesPage';
import { CATEGORY_TREE, INITIAL_BRANDS } from '../data/categoriesData';

export default function HomePage() {
  const { 
    addToQuote, 
    setSelectedProduct, 
    compareItems, 
    toggleCompare, 
    setCompareItems, 
    setQuoteOpen 
  } = useApp();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [viewType, setViewType] = useState('table'); // 'table' | 'grid'

  // Search Engine states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('any');
  const [matchType, setMatchType] = useState('contains');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filters
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
  const [stockStatus, setStockStatus] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [origin, setOrigin] = useState('');

  // Pagination & Sorting
  const [sortOption, setSortOption] = useState('partNumber-asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [quantities, setQuantities] = useState({});

  // Fetch products from backend API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({
        query: searchQuery,
        field: searchField,
        matchType,
        category: selectedCategory,
        brand: selectedBrand,
        idMin: innerDiameterMin,
        idMax: innerDiameterMax,
        odMin: outerDiameterMin,
        odMax: outerDiameterMax,
        wMin: widthMin,
        wMax: widthMax,
        material,
        sealType,
        stockStatus,
        priceMin,
        priceMax,
        origin,
        sort: sortOption,
        page,
        limit: 10
      });

      setProducts(res.items || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);

      const qtyMap = {};
      (res.items || []).forEach((p) => {
        qtyMap[p.id || p.partNumber] = quantities[p.id || p.partNumber] || 1;
      });
      setQuantities((prev) => ({ ...prev, ...qtyMap }));
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
    widthMin, widthMax, material, sealType, stockStatus, priceMin, priceMax, origin
  ]);

  // Autocomplete fetcher
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await api.getSuggestions(searchQuery.trim());
        setSuggestions(res.data || []);
      } catch (err) {
        setSuggestions([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
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
    setStockStatus('');
    setPriceMin('');
    setPriceMax('');
    setOrigin('');
    setPage(1);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative w-full bg-[#001f3f] text-white rounded-lg overflow-hidden py-14 px-6 md:px-10 border-b-4 border-[#f2cc4d] shadow-md">
        <div className="relative max-w-4xl space-y-5 z-20">
          <span className="inline-flex items-center gap-1.5 bg-[#f2cc4d] text-[#003366] text-[10px] font-black uppercase px-3 py-1 rounded-sm tracking-widest font-mono">
            <ShieldCheck className="w-4 h-4" /> AUTHORIZED GLOBAL INDUSTRIAL SUPPLIER
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight uppercase tracking-tight">
            Precision Bearings. <br />
            <span className="text-[#f2cc4d]">Industrial Grade Motion.</span>
          </h1>

          <p className="text-[#0A84FF] font-bold text-base sm:text-lg">
            Authorized Distributor of NSK, THK, NTN, SKF & Global Brands
          </p>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
            Universal Enterprise supplies certified high-performance bearings, linear motion guides, ball screws, and housings directly to steel mills, automotive lines, automation grids, and machine tooling centers.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => {
                document.getElementById('catalog-search-anchor')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#f2cc4d] hover:bg-[#e1bd41] text-[#003366] font-black px-6 py-3 rounded-sm text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
            >
              Explore Bearing Catalog
            </button>
            <button
              onClick={() => setQuoteOpen(true)}
              className="bg-slate-900/80 hover:bg-slate-900 text-white font-bold px-6 py-3 rounded-sm text-xs uppercase tracking-wider border border-slate-700 hover:border-[#f2cc4d] transition cursor-pointer"
            >
              Request Fast Quotation
            </button>
          </div>

          {/* Stats Bar */}
          <div className="pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
            {[
              { value: '5000+', label: 'Products Sourced' },
              { value: '1000+', label: 'Enterprise Clients' },
              { value: '15+ Years', label: 'Authorized Sourcing' },
              { value: '24/7 Desk', label: 'AI Technical Support' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#003366]/50 p-2.5 rounded border border-white/10">
                <div className="text-white text-lg sm:text-xl font-black">{stat.value}</div>
                <div className="text-[#f2cc4d] text-[9px] uppercase font-bold tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Sourcing Search Engine */}
      <div id="catalog-search-anchor" className="bg-[#003366] text-white p-5 rounded-md shadow-xl border-b-4 border-[#f2cc4d] space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-[#f2cc4d]">
          <Search className="w-4 h-4 text-[#f2cc4d]" />
          Universal Enterprise Precision Sourcing Engine
        </h3>

        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-3 relative text-xs">
          
          {/* Query input */}
          <div className="lg:col-span-5 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Enter bearing code / name (e.g. 16001JRX, HSR20A, 6204)..."
              className="w-full bg-slate-950 text-white px-4 py-3 border border-slate-700 rounded-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#f2cc4d] font-medium"
            />

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white text-slate-800 rounded-sm shadow-2xl border border-slate-300 z-50 max-h-60 overflow-y-auto">
                <div className="bg-slate-100 text-[10px] font-bold text-slate-500 px-3 py-1.5 uppercase tracking-wider border-b">
                  Catalog Inventory Matches
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
                    }}
                    className="px-3.5 py-2 hover:bg-slate-100 cursor-pointer flex justify-between items-center transition border-b border-slate-100"
                  >
                    <div>
                      <strong className="text-[#003366]">{s.partNumber}</strong>
                      <span className="text-slate-500 text-[11px] ml-2">({s.name})</span>
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded uppercase">
                      {s.brand}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search field */}
          <div className="lg:col-span-3">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-3 rounded-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#f2cc4d]"
            >
              <option value="any">Search All Fields</option>
              <option value="partNumber">Product Part Number</option>
              <option value="name">Product Name Description</option>
              <option value="brand">Manufacturer / Brand</option>
              <option value="series">Bearing Series Group</option>
            </select>
          </div>

          {/* Match mode */}
          <div className="lg:col-span-2">
            <select
              value={matchType}
              onChange={(e) => setMatchType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-3 rounded-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#f2cc4d]"
            >
              <option value="contains">Contains Input</option>
              <option value="startsWith">Starts With</option>
              <option value="exact">Exact Code Match</option>
            </select>
          </div>

          {/* Sourcing button */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#f2cc4d] hover:bg-[#e1bd41] text-[#003366] font-black p-3 rounded-sm uppercase transition cursor-pointer border-b-2 border-amber-600 shadow-md text-center"
            >
              Search Catalog
            </button>
          </div>
        </form>
      </div>

      {/* 3. Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SIDEBAR FILTERS */}
        <aside className="lg:col-span-3 bg-white border rounded-md shadow-2xs overflow-hidden text-xs">
          <div className="bg-[#003366] text-white p-3.5 flex items-center justify-between border-b-2 border-[#f2cc4d]">
            <h4 className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-xs">
              <SlidersHorizontal className="w-4 h-4 text-[#f2cc4d]" />
              Sourcing Filters
            </h4>
            <button onClick={clearAllFilters} className="text-[10px] text-amber-300 hover:text-white font-bold uppercase">
              Clear All
            </button>
          </div>

          <div className="p-4 space-y-5">
            
            {/* Category Tree */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                Category Group
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => { setSelectedCategory(''); setPage(1); }}
                  className={`w-full text-left p-1.5 rounded transition font-bold truncate ${selectedCategory === '' ? 'bg-slate-100 text-[#003366]' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  All Categories
                </button>
                {CATEGORY_TREE.map((cat, idx) => (
                  <div key={idx} className="space-y-0.5 pl-1">
                    <span className="block text-[10px] font-black text-[#003366] pt-1">{cat.name}</span>
                    {cat.subcategories?.map((sub, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => { setSelectedCategory(sub.name); setPage(1); }}
                        className={`w-full text-left text-[11px] py-1 px-1.5 rounded truncate transition ${selectedCategory === sub.name ? 'bg-[#0056b3]/10 text-[#0056b3] font-bold border-l-2 border-[#0056b3]' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        📁 {sub.name}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                Authorized Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => { setSelectedBrand(e.target.value); setPage(1); }}
                className="w-full p-2 bg-slate-50 border rounded font-semibold text-slate-800"
              >
                <option value="">All Power Brands</option>
                {INITIAL_BRANDS.map((bName) => (
                  <option key={bName} value={bName.replace(/\s*\(\d+\)\s*$/, '').trim()}>
                    {bName}
                  </option>
                ))}
              </select>
            </div>

            {/* Inside Bore (ID mm) */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                Inside Bore (ID mm)
              </label>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <input
                  type="number"
                  placeholder="Min (e.g. 10)"
                  value={innerDiameterMin}
                  onChange={(e) => setInnerDiameterMin(e.target.value)}
                  className="p-1.5 border rounded bg-white"
                />
                <input
                  type="number"
                  placeholder="Max (e.g. 160)"
                  value={innerDiameterMax}
                  onChange={(e) => setInnerDiameterMax(e.target.value)}
                  className="p-1.5 border rounded bg-white"
                />
              </div>
            </div>

            {/* Outside Diameter (OD mm) */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                Outside Diameter (OD mm)
              </label>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <input
                  type="number"
                  placeholder="Min (e.g. 20)"
                  value={outerDiameterMin}
                  onChange={(e) => setOuterDiameterMin(e.target.value)}
                  className="p-1.5 border rounded bg-white"
                />
                <input
                  type="number"
                  placeholder="Max (e.g. 240)"
                  value={outerDiameterMax}
                  onChange={(e) => setOuterDiameterMax(e.target.value)}
                  className="p-1.5 border rounded bg-white"
                />
              </div>
            </div>

            {/* Material */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                Material
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded font-semibold"
              >
                <option value="">All Materials</option>
                <option value="Chrome Steel">High-Carbon Chrome Steel</option>
                <option value="Stainless Steel">Stainless Steel</option>
                <option value="Ceramic">Ceramic</option>
              </select>
            </div>

            {/* Price Range (INR) */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                Estimated Price (₹ INR)
              </label>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="p-1.5 border rounded bg-white"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="p-1.5 border rounded bg-white"
                />
              </div>
            </div>

          </div>
        </aside>

        {/* RIGHT CATALOG CONTENT */}
        <section className="lg:col-span-9 space-y-4">
          
          {/* Toolbar */}
          <div className="bg-white border rounded p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 shadow-2xs">
            <div className="text-slate-500 font-medium">
              {loading ? (
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#003366]" /> Querying direct warehouse indexes...
                </span>
              ) : (
                <span>Found <strong>{totalCount}</strong> precision items matching criteria</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => { setSortOption(e.target.value); setPage(1); }}
                  className="bg-slate-50 border rounded p-1.5 text-[11px]"
                >
                  <option value="partNumber-asc">Part Code A-Z</option>
                  <option value="partNumber-desc">Part Code Z-A</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex border rounded overflow-hidden">
                <button
                  onClick={() => setViewType('table')}
                  className={`p-1.5 ${viewType === 'table' ? 'bg-[#003366] text-white' : 'bg-slate-50 text-slate-600'}`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewType('grid')}
                  className={`p-1.5 ${viewType === 'grid' ? 'bg-[#003366] text-white' : 'bg-slate-50 text-slate-600'}`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>

              {/* Admin CSV Toggle */}
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                className="bg-slate-100 border hover:bg-slate-200 text-slate-900 font-black text-[10px] px-2.5 py-1.5 rounded uppercase tracking-wider"
              >
                CSV Sync
              </button>
            </div>
          </div>

          {/* Admin CSV Upload Drawer in-screen */}
          {adminOpen && (
            <AdminUpload onUploadSuccess={() => { fetchProducts(); setAdminOpen(false); }} />
          )}

          {/* Results Render */}
          {products.length === 0 ? (
            <div className="bg-white border rounded-lg p-14 text-center space-y-3">
              <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-base">No interchangeable bearings found.</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try wiping filter boundaries or search terms. Alternatively, consult our AI assistant for hard-to-find replacements.
              </p>
              <button onClick={clearAllFilters} className="bg-[#003366] text-white text-xs font-bold px-4 py-2 rounded">
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {viewType === 'table' ? (
                /* Tabular Matrix View */
                <div className="bg-white border rounded shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#003366] text-white font-bold border-b text-[10px] uppercase font-mono">
                          <th className="p-3 text-center">Image</th>
                          <th className="p-3">Part Number</th>
                          <th className="p-3">Brand</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Sizes (IDxODxW)</th>
                          <th className="p-3">Mass</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3">Est. Price</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {products.map((p) => {
                          const isCompared = compareItems.some((c) => c.id === p.id || c.partNumber === p.partNumber);
                          const qty = quantities[p.id || p.partNumber] || 1;

                          return (
                            <tr key={p.id || p.partNumber} className="hover:bg-slate-50 transition">
                              {/* Image Thumbnail */}
                              <td className="p-2.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => setSelectedProduct(p)}
                                  className="w-12 h-12 bg-white rounded-md border border-slate-200 p-0.5 inline-flex items-center justify-center overflow-hidden hover:border-[#f2cc4d] hover:shadow-md transition cursor-pointer group"
                                  title="Click to view full specifications"
                                >
                                  <img
                                    src={p.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'}
                                    alt={p.partNumber}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-150"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/favicon.svg';
                                    }}
                                  />
                                </button>
                              </td>

                              {/* Part Number & Name (Clickable) */}
                              <td className="p-3 font-mono">
                                <button
                                  onClick={() => setSelectedProduct(p)}
                                  className="text-left group cursor-pointer block"
                                >
                                  <span className="font-extrabold text-[#003366] group-hover:text-amber-600 group-hover:underline text-xs block">
                                    {p.partNumber}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-sans truncate block max-w-[150px]">
                                    {p.name || `${p.brand} Precision Bearing`}
                                  </span>
                                </button>
                              </td>

                              <td className="p-3">
                                <span className="bg-slate-100 border px-2 py-0.5 rounded font-black text-slate-700 text-[10px]">
                                  {p.brand}
                                </span>
                              </td>
                              <td className="p-3 text-slate-500 truncate max-w-[140px]">{p.category}</td>
                              <td className="p-3 font-mono text-slate-800">{p.innerDiameter} x {p.outerDiameter} x {p.width} mm</td>
                              <td className="p-3 font-mono text-slate-400">{p.weight}</td>
                              <td className="p-3">
                                <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-emerald-500"></span>
                                <span className="text-[10px] font-bold text-slate-600">{p.stockStatus}</span>
                              </td>
                              <td className="p-3 font-black text-slate-900 font-mono">₹{p.price}</td>
                              <td className="p-3">
                                <div className="flex items-center justify-center gap-2">
                                  {/* Quantity */}
                                  <div className="flex items-center border rounded bg-white overflow-hidden shadow-2xs">
                                    <button
                                      onClick={() => setQuantities({ ...quantities, [p.id || p.partNumber]: Math.max(1, qty - 1) })}
                                      className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                                    >
                                      -
                                    </button>
                                    <span className="px-2 font-mono font-bold text-[11px]">{qty}</span>
                                    <button
                                      onClick={() => setQuantities({ ...quantities, [p.id || p.partNumber]: qty + 1 })}
                                      className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                                    >
                                      +
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => addToQuote(p, qty)}
                                    className="bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 px-2.5 py-1 rounded font-black text-[10px] uppercase shadow-2xs transition cursor-pointer"
                                  >
                                    Add Quote
                                  </button>

                                  <button
                                    onClick={() => toggleCompare(p)}
                                    className={`px-2 py-1 rounded text-[10px] font-bold border transition ${isCompared ? 'bg-amber-400 border-amber-500 text-slate-950 font-black' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
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
                /* Bento Grid Cards View */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map((p) => {
                    const isCompared = compareItems.some((c) => c.id === p.id || c.partNumber === p.partNumber);

                    return (
                      <div key={p.id || p.partNumber} className="bg-white border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition text-slate-800 space-y-3">
                        <div>
                          {/* Image Thumbnail in Grid */}
                          <div
                            onClick={() => setSelectedProduct(p)}
                            className="w-full h-36 bg-slate-50 rounded border border-slate-200 mb-3 flex items-center justify-center overflow-hidden cursor-pointer group relative shadow-inner"
                          >
                            <img
                              src={p.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'}
                              alt={p.partNumber}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/favicon.svg';
                              }}
                            />
                            <div className="absolute inset-0 bg-[#003366]/0 group-hover:bg-[#003366]/20 transition flex items-center justify-center">
                              <span className="opacity-0 group-hover:opacity-100 bg-[#003366] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider transition">
                                View Specs
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-start">
                            <span className="bg-slate-100 text-slate-700 font-black text-[9px] px-2 py-0.5 rounded uppercase">
                              {p.brand} GENUINE
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600">● {p.stockStatus}</span>
                          </div>

                          <h4
                            onClick={() => setSelectedProduct(p)}
                            className="font-extrabold text-[#003366] hover:text-amber-600 text-base mt-2 cursor-pointer hover:underline"
                          >
                            {p.partNumber}
                          </h4>
                          <p className="text-xs text-slate-500 truncate">{p.name}</p>

                          <div className="bg-slate-50 rounded p-2.5 mt-2 space-y-1 font-mono text-[11px] text-slate-700">
                            <div className="flex justify-between">
                              <span className="text-slate-400 uppercase text-[9px]">Inside Bore ID:</span>
                              <strong>{p.innerDiameter} mm</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 uppercase text-[9px]">Outside OD:</span>
                              <strong>{p.outerDiameter} mm</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 uppercase text-[9px]">Width (B):</span>
                              <strong>{p.width} mm</strong>
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Estimate Price</span>
                            <span className="font-black text-[#003366] text-base">₹{p.price}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setSelectedProduct(p)}
                              className="bg-slate-100 hover:bg-slate-200 border rounded py-1.5 text-[11px] font-bold uppercase text-slate-700 cursor-pointer"
                            >
                              Specs
                            </button>
                            <button
                              onClick={() => toggleCompare(p)}
                              className={`border rounded py-1.5 text-[11px] font-bold uppercase cursor-pointer ${isCompared ? 'bg-amber-400 border-amber-500 text-slate-950 font-black' : 'bg-white text-slate-500'}`}
                            >
                              {isCompared ? 'Comparing' : 'Compare'}
                            </button>
                          </div>

                          <button
                            onClick={() => addToQuote(p)}
                            className="w-full bg-[#f2cc4d] hover:bg-[#e0b434] text-[#003366] font-black py-2 rounded text-[11px] uppercase border-b-2 border-amber-600 transition"
                          >
                            Add To Quote
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Side-by-side comparison quick bar */}
              {compareItems.length > 0 && (
                <div className="bg-slate-900 text-white rounded-lg p-4 border-t-4 border-[#f2cc4d] space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold uppercase text-amber-400">
                      Comparison Matrix ({compareItems.length}/3 products checked)
                    </span>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/services#compare-desk"
                        className="bg-[#f2cc4d] text-slate-950 font-black text-[11px] px-3 py-1 rounded uppercase tracking-wider hover:bg-yellow-500"
                      >
                        Open Comparison Desk in Services &rarr;
                      </Link>
                      <button onClick={() => setCompareItems([])} className="text-[10px] text-slate-400 hover:text-red-400 font-bold uppercase">
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                    {compareItems.map((c) => (
                      <div key={c.id || c.partNumber} className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                        <div className="flex justify-between">
                          <strong className="text-amber-400">{c.partNumber}</strong>
                          <span className="text-slate-400">{c.brand}</span>
                        </div>
                        <div className="text-slate-300 text-[11px]">
                          {c.innerDiameter} x {c.outerDiameter} x {c.width} mm • ₹{c.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4 text-xs font-bold text-slate-500">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border rounded bg-white hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <span className="font-mono">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border rounded bg-white hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

        </section>

      </div>

      {/* 4. Industries & Global Brand Additions */}
      <PremiumHomeAdditions />

      {/* 5. Complete Engineering Categories Directory */}
      <section id="categories-directory" className="space-y-4">
        <CategoriesPage
          onSelectCategory={(catName) => {
            setSelectedCategory(catName);
            setPage(1);
            window.scrollTo({ top: 350, behavior: 'smooth' });
          }}
        />
      </section>

      {/* 6. Authorized Global Bearing Brands Showcase */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-slate-200 pb-4 flex flex-wrap justify-between items-end gap-3">
          <div>
            <span className="text-[10px] bg-[#f2cc4d] text-slate-950 font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider">
              OEM AUTHORIZED PARTNERSHIPS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#003366] tracking-tight mt-1.5">
              Authorized Global Power Brands
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Direct sourcing channels ensuring 100% genuine factory certification, manufacturer warranties, and serial validation.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-[#003366] hover:text-amber-600 uppercase flex items-center gap-1"
          >
            Explore Complete Bearing Inventory &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              slug: 'fag',
              name: 'FAG / INA',
              country: 'Germany',
              tagline: 'Schaeffler High Load Engineering',
              desc: 'German precision engineered generation C bearings, needle rollers, and hydraulic dismounting pullers.',
              series: ['Generation C Deep Groove', 'Needle Rollers', 'Arcanol Greases']
            },
            {
              slug: 'skf',
              name: 'SKF',
              country: 'Sweden',
              tagline: 'Global Benchmark in Bearing Tech',
              desc: 'Pioneers in explorer series bearings, solid oil food line, and condition monitoring systems.',
              series: ['Explorer Deep Groove', 'W-Series Stainless', 'Solid Oil Bearings']
            },
            {
              slug: 'nsk',
              name: 'NSK',
              country: 'Japan',
              tagline: 'World Leader in Motion & Control',
              desc: 'High-precision deep groove ball bearings, super precision machine tool spindles, and linear guides.',
              series: ['7000 Series Spindles', 'Deep Groove 6200/6300', 'LH Linear Guides']
            },
            {
              slug: 'ntn',
              name: 'NTN',
              country: 'Japan',
              tagline: 'High Thermal Limits & Long Life',
              desc: 'Extensive thin section deep groove ball bearings (16001 - 16032) and spherical roller units.',
              series: ['16001 - 16032 Series', 'Pillow Block Units', 'Tapered Rollers']
            },
            {
              slug: 'thk',
              name: 'THK',
              country: 'Japan',
              tagline: 'Pioneers of Linear Motion Systems',
              desc: 'Advanced LM guides, ground ball screws, cam followers, and caged ball technologies.',
              series: ['HSR Series LM Guides', 'BNK Ground Ball Screws', 'Cam Followers']
            },
            {
              slug: 'timken',
              name: 'TIMKEN',
              country: 'USA',
              tagline: 'Leader in Tapered Roller Bearings',
              desc: 'Engineered tapered roller bearings, heavy industrial housings, and aerospace grade components.',
              series: ['Tapered Roller Series', 'Food Grade Stainless', 'Spherical Units']
            },
            {
              slug: 'nachi',
              name: 'NACHI',
              country: 'Japan',
              tagline: 'Precision Robotics & Automotive',
              desc: 'Specialized automotive air conditioning bearings, robotic arm actuators, and high-speed bearings.',
              series: ['30BG/35BG Series', '38BVV Automotive', 'High Speed Radial']
            },
            {
              slug: 'koyo',
              name: 'KOYO / JTEKT',
              country: 'Japan',
              tagline: 'Extreme Environment Solutions',
              desc: 'Ceramic ball bearings, high-temperature series, and heavy machinery transmission bearings.',
              series: ['DG Automotive Series', 'Ceramic Hybrids', 'Agricultural Units']
            }
          ].map((b) => (
            <div
              key={b.slug}
              className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3 hover:border-[#003366] hover:bg-white transition"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xl font-black text-[#003366]">{b.name}</span>
                    <span className="block text-[11px] font-bold text-amber-600 mt-0.5">{b.tagline}</span>
                  </div>
                  <span className="bg-white font-mono text-[9px] font-bold px-2 py-0.5 rounded border text-slate-700">
                    {b.country}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 mt-2.5 leading-relaxed">{b.desc}</p>

                <div className="mt-2.5 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Featured Series:</span>
                  <div className="flex flex-wrap gap-1">
                    {b.series.map((s, idx) => (
                      <span key={idx} className="bg-white border text-slate-700 text-[10px] font-mono px-1.5 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBrand(b.name.split('/')[0].trim());
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="flex-1 bg-[#003366] hover:bg-[#002244] text-white text-center py-1.5 rounded text-[10px] font-bold uppercase transition cursor-pointer"
                >
                  Filter {b.name.split('/')[0].trim()}
                </button>
                <Link
                  href={`/products?brand=${encodeURIComponent(b.name.split('/')[0].trim())}`}
                  className="flex-1 bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 text-center py-1.5 rounded text-[10px] font-black uppercase transition flex items-center justify-center"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Real-Time Sourcing & Quote Tracker Section */}
      <section id="tracker-section" className="space-y-4">
        <OrderTrackingPage />
      </section>

    </div>
  );
}
