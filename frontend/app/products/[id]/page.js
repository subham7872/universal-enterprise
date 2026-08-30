"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, ShieldCheck, Activity, Layers, RefreshCw } from 'lucide-react';
import { useApp } from '../../../components/AppClientWrapper';
import api from '../../../lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const { addToQuote, toggleCompare, compareItems } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.getProductById(id);
        setProduct(res.data || res);
      } catch (err) {
        setError(err.message || 'Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3 font-sans">
        <RefreshCw className="w-8 h-8 animate-spin text-[#003366] mx-auto" />
        <p className="text-xs text-slate-500 font-bold uppercase">Loading bearing specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white p-12 rounded border text-center space-y-4 max-w-lg mx-auto font-sans">
        <h2 className="text-lg font-bold text-slate-800">Product Reference Not Found</h2>
        <p className="text-xs text-slate-500">{error || `No product matches ID '${id}'`}</p>
        <Link href="/products" className="inline-block bg-[#003366] text-white font-bold text-xs uppercase px-4 py-2 rounded">
          &larr; Back to Products Catalog
        </Link>
      </div>
    );
  }

  const isCompared = compareItems.some((c) => c.id === product.id || c.partNumber === product.partNumber);

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-slate-800">
      
      <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003366] hover:underline uppercase">
        <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
      </Link>

      <div className="bg-white border-2 border-[#003366] rounded-lg overflow-hidden shadow-md">
        
        {/* Header */}
        <div className="bg-[#003366] text-white p-6 border-b-2 border-[#f2cc4d] flex flex-wrap justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="text-[10px] bg-[#f2cc4d] text-slate-950 font-black px-2 py-0.5 rounded uppercase font-mono">
              {product.brand} OEM GENUINE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              {product.partNumber}
            </h1>
            <p className="text-xs text-slate-300">{product.name}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Sourcing Estimate</span>
            <span className="text-2xl font-black text-[#f2cc4d] font-mono">₹{product.price}</span>
          </div>
        </div>

        {/* Specifications */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* Key Dimensions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="bg-slate-50 border p-3 rounded">
              <span className="block text-[10px] font-sans font-bold uppercase text-slate-400">Inside Bore (ID)</span>
              <strong className="text-base text-slate-900">{product.innerDiameter} mm</strong>
            </div>
            <div className="bg-slate-50 border p-3 rounded">
              <span className="block text-[10px] font-sans font-bold uppercase text-slate-400">Outside Dia (OD)</span>
              <strong className="text-base text-slate-900">{product.outerDiameter} mm</strong>
            </div>
            <div className="bg-slate-50 border p-3 rounded">
              <span className="block text-[10px] font-sans font-bold uppercase text-slate-400">Width (B)</span>
              <strong className="text-base text-slate-900">{product.width} mm</strong>
            </div>
            <div className="bg-slate-50 border p-3 rounded">
              <span className="block text-[10px] font-sans font-bold uppercase text-slate-400">Net Weight</span>
              <strong className="text-base text-slate-900">{product.weight || '0.15kg'}</strong>
            </div>
          </div>

          {/* Tolerance Matrix */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase text-[#003366] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-500" />
              Technical Parameters & Operational Limits
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 p-4 rounded border font-mono">
              <div><strong>Category:</strong> {product.category}</div>
              <div><strong>Series Group:</strong> {product.seriesGroup || 'Standard Series'}</div>
              <div><strong>Constituent Material:</strong> {product.material || 'Chrome Steel'}</div>
              <div><strong>Seal / Shield:</strong> {product.sealType || 'Open'}</div>
              <div><strong>Cage / Retainer:</strong> {product.cageType || 'Steel'}</div>
              <div><strong>Load Capacity:</strong> {product.loadRating || 'High Dynamic'}</div>
              <div><strong>Speed Limit:</strong> {product.speedRating || 'Standard RPM'}</div>
              <div><strong>Origin:</strong> {product.countryOfOrigin || 'Japan'}</div>
              <div><strong>Stock:</strong> <span className="text-emerald-700 font-bold">{product.stockStatus} ({product.stockCount || 50} units)</span></div>
              <div><strong>Application:</strong> {product.application || 'Heavy Industrial Equipment'}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t flex flex-wrap gap-3">
            <button
              onClick={() => addToQuote(product)}
              className="bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black text-xs uppercase px-6 py-3 rounded flex items-center gap-2 border-b-2 border-amber-600 shadow-md"
            >
              <ShoppingCart className="w-4 h-4" /> Add Part to RFQ Cart
            </button>

            <button
              onClick={() => toggleCompare(product)}
              className={`px-4 py-3 rounded text-xs font-bold uppercase border transition ${isCompared ? 'bg-amber-400 border-amber-500 text-slate-950 font-black' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              {isCompared ? '✔ Comparing Side-by-Side' : '➕ Compare with Alternatives'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
