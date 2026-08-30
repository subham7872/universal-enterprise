"use client";

import React from 'react';
import Link from 'next/link';
import { Trash2, ShoppingCart, ArrowLeft, Activity, Scale, Compass, CheckCircle2 } from 'lucide-react';

export default function CompareSpecsPage({
  compareItems = [],
  onRemoveItem,
  onClearAll,
  onAddToQuote,
  onViewDetails
}) {
  if (!compareItems || compareItems.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center max-w-2xl mx-auto space-y-6 my-8 shadow-xs font-sans text-slate-800">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Trash2 className="w-8 h-8 text-slate-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase">
            No Bearings Selected for Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Please browse our precision catalog and click <strong>&quot;➕ Compare&quot;</strong> on up to 3 different products to view dimensional tolerances, mass, and speed limits side-by-side.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs uppercase px-6 py-3 rounded-sm tracking-wider transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          Go to Product Catalog
        </Link>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 space-y-6 text-slate-800 shadow-sm font-sans">
      
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-black uppercase text-[#003366] tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-amber-500 animate-pulse" />
            Interchangeable Bearing Specs Comparison Desk
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-semibold">
            Evaluate Net Mass, Dynamic/Static Load capacities, and Speed limits of up to 3 cross-brand substitutes.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase rounded transition"
          >
            Clear Comparison
          </button>
          <Link
            href="/products"
            className="px-3 py-1.5 bg-[#003366] text-white font-bold text-xs uppercase rounded hover:bg-[#002244] transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#f2cc4d]" />
            Back to Catalog
          </Link>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="p-3 w-1/4 uppercase font-bold text-[10px] text-slate-400">Parameter</th>
              {compareItems.map((item) => (
                <th key={item.id} className="p-3 w-1/4 font-black text-sm text-[#003366]">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-[#003366] text-[#f2cc4d] text-[9px] px-1.5 py-0.5 rounded uppercase mr-1">
                        {item.brand}
                      </span>
                      <div className="text-base font-black text-slate-900 mt-1">{item.partNumber}</div>
                    </div>
                    {onRemoveItem && (
                      <button
                        onClick={() => onRemoveItem(item)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 font-mono">
            <tr>
              <td className="p-3 font-sans font-bold text-slate-600">Category</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-3 text-slate-800">{item.category}</td>
              ))}
            </tr>
            <tr className="bg-slate-50/50">
              <td className="p-3 font-sans font-bold text-slate-600">Inside Bore (ID)</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-3 font-bold text-slate-900">{item.innerDiameter} mm</td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-sans font-bold text-slate-600">Outside Diameter (OD)</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-3 font-bold text-slate-900">{item.outerDiameter} mm</td>
              ))}
            </tr>
            <tr className="bg-slate-50/50">
              <td className="p-3 font-sans font-bold text-slate-600">Width (B)</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-3 font-bold text-slate-900">{item.width} mm</td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-sans font-bold text-slate-600">Material</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-3 text-slate-800">{item.material || 'Chrome Steel'}</td>
              ))}
            </tr>
            <tr className="bg-slate-50/50">
              <td className="p-3 font-sans font-bold text-slate-600">Seal / Shield</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-3 text-slate-800">{item.sealType || 'Open'}</td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-sans font-bold text-slate-600">Cage Type</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-3 text-slate-800">{item.cageType || 'Steel'}</td>
              ))}
            </tr>
            <tr className="bg-slate-50/50">
              <td className="p-3 font-sans font-bold text-slate-600">Net Mass</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-3 text-slate-800">{item.weight || '0.15kg'}</td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-sans font-bold text-slate-600">Load Ratings</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-3 text-slate-800">{item.loadRating || 'High Dynamic'}</td>
              ))}
            </tr>
            <tr className="bg-slate-50/50">
              <td className="p-3 font-sans font-bold text-slate-600">Estimated Price</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-3 text-base font-black text-[#003366]">₹{item.price}</td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-sans font-bold text-slate-600">Stock Availability</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-3 font-sans font-bold text-emerald-600">
                  ● {item.stockStatus || 'Available'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-sans font-bold text-slate-600">Procurement</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-3">
                  <button
                    onClick={() => onAddToQuote && onAddToQuote(item)}
                    className="w-full bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black py-2 rounded text-xs uppercase transition"
                  >
                    Add to Quote
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

    </section>
  );
}
