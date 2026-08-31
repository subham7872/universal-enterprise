"use client";

import React from 'react';
import { X, ShieldCheck, ShoppingCart, Globe, Compass, Activity, PackageCheck, Layers } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToQuote }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in zoom-in duration-150 font-sans">
      <div className="bg-white border-4 border-[#003366] rounded-lg max-w-2xl w-full text-slate-800 shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#003366] text-white p-5 border-b-2 border-[#f2cc4d] flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] bg-[#f2cc4d] text-slate-950 font-black px-2 py-0.5 rounded-sm uppercase tracking-widest font-mono">
              {product.brand} GENUINE OEM
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-none pt-1 text-white">
              {product.partNumber}
            </h3>
            <p className="text-xs text-slate-300 font-medium">{product.name}</p>
          </div>

          <button onClick={onClose} className="text-slate-300 hover:text-white p-1" title="Close">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* Product Image & Main Summary */}
          <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="w-28 h-28 bg-white border-2 border-slate-200 rounded-md flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'}
                alt={product.partNumber}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/favicon.svg';
                }}
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex justify-between items-start">
                <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded font-mono uppercase">
                  {product.brand} • {product.category}
                </span>
                <span className="text-emerald-700 font-bold text-xs">● {product.stockStatus || 'Available'}</span>
              </div>
              <h4 className="text-base font-black text-[#003366]">{product.partNumber}</h4>
              <p className="text-xs text-slate-500">{product.seriesGroup || 'Standard Series'} • {product.countryOfOrigin || 'Germany/Japan'}</p>
              <div className="text-sm font-black text-slate-900 font-mono pt-1">
                Estimated Rate: <span className="text-[#003366]">₹{product.price}</span>
              </div>
            </div>
          </div>
          
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-50 border p-3 rounded">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Inside Bore (ID)</span>
              <span className="text-sm font-black text-slate-900 font-mono">{product.innerDiameter} mm</span>
            </div>
            <div className="bg-slate-50 border p-3 rounded">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Outside Dia (OD)</span>
              <span className="text-sm font-black text-slate-900 font-mono">{product.outerDiameter} mm</span>
            </div>
            <div className="bg-slate-50 border p-3 rounded">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Width (B)</span>
              <span className="text-sm font-black text-slate-900 font-mono">{product.width} mm</span>
            </div>
            <div className="bg-slate-50 border p-3 rounded">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Estimate Price</span>
              <span className="text-sm font-black text-[#003366] font-mono">₹{product.price}</span>
            </div>
          </div>

          {/* Detailed Engineering Spec Matrix */}
          <div className="space-y-2">
            <h4 className="font-black text-[#003366] uppercase text-xs tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-500" />
              Technical Engineering Tolerances
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-4 rounded-md border text-slate-700 font-mono">
              <div><strong>Category:</strong> {product.category}</div>
              <div><strong>Series Group:</strong> {product.seriesGroup || 'Standard'}</div>
              <div><strong>Constituent Material:</strong> {product.material || 'Chrome Steel'}</div>
              <div><strong>Seal / Shield Type:</strong> {product.sealType || 'Open'}</div>
              <div><strong>Cage / Retainer:</strong> {product.cageType || 'Steel'}</div>
              <div><strong>Net Mass:</strong> {product.weight || '0.15kg'}</div>
              <div><strong>Load Capacity:</strong> {product.loadRating || 'High Dynamic'}</div>
              <div><strong>Speed Limit:</strong> {product.speedRating || 'Standard RPM'}</div>
              <div><strong>Country of Origin:</strong> {product.countryOfOrigin || 'Japan'}</div>
              <div><strong>Stock Status:</strong> <span className="text-emerald-700 font-bold">{product.stockStatus || 'Available'} ({product.stockCount || 50} units)</span></div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 uppercase text-[11px]">Product Description</h4>
              <p className="text-slate-600 leading-relaxed font-normal">{product.description}</p>
            </div>
          )}

          {/* Recommended Equivalents */}
          {product.equivalentProducts && product.equivalentProducts.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-black text-[#003366] uppercase text-xs tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-500" />
                Authorized Brand Equivalents
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.equivalentProducts.map((eq, idx) => (
                  <div key={idx} className="bg-slate-100 p-2.5 rounded border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="bg-slate-200 text-slate-700 text-[9px] px-1.5 py-0.5 rounded font-black uppercase mr-1.5">{eq.brand}</span>
                      <strong className="text-[#003366]">{eq.partNumber}</strong>
                    </div>
                    <span className="font-bold text-slate-900 font-mono">₹{eq.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 p-4 border-t flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-1 text-slate-500 text-[11px] font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Genuine Origin Certificate Included
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded font-bold text-xs uppercase hover:bg-slate-50 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onAddToQuote(product);
                onClose();
              }}
              className="px-5 py-2 bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black text-xs uppercase rounded border-b-2 border-amber-600 transition flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Quote Basket
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
