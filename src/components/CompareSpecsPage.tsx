import React from 'react';
import { Trash2, ShoppingCart, ArrowLeft, Eye, Activity, Scale, Compass } from 'lucide-react';
import { Product } from '../types';

interface CompareSpecsPageProps {
  compareItems: Product[];
  onRemoveItem: (product: Product) => void;
  onClearAll: () => void;
  onAddToQuote: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onBackToCatalog: () => void;
}

export default function CompareSpecsPage({
  compareItems,
  onRemoveItem,
  onClearAll,
  onAddToQuote,
  onViewDetails,
  onBackToCatalog
}: CompareSpecsPageProps) {
  
  if (compareItems.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center max-w-2xl mx-auto space-y-6 my-8 shadow-xs">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Trash2 className="w-8 h-8 text-slate-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase">No Bearings Selected for Comparison</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Please browse our precision catalog and click the **➕ Compare** button on up to 3 different products to view their dimensional tolerances and speed ratings side-by-side.
          </p>
        </div>
        <button
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 bg-[#003366] hover:bg-[#002244] text-white font-black text-xs uppercase px-6 py-3 rounded-sm tracking-wider transition-all shadow-md active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          Go to Product Catalog
        </button>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 space-y-6 text-slate-800 shadow-sm">
      
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
            onClick={onBackToCatalog}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[11px] uppercase px-4 py-2 border border-slate-300 rounded-sm transition flex items-center gap-1.5"
          >
            ← Add More
          </button>
          <button
            onClick={onClearAll}
            className="bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-[11px] uppercase px-4 py-2 border border-red-200 rounded-sm transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Comparison ({compareItems.length})
          </button>
        </div>
      </div>

      {/* Specification Comparative Matrix */}
      <div className="overflow-x-auto rounded-sm border border-slate-200 shadow-xs">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-mono uppercase text-[10px] tracking-wider divide-x divide-slate-300">
              <th className="px-4 py-4 w-1/4 font-extrabold bg-slate-50">Technical Attributes</th>
              {compareItems.map((item) => (
                <th key={item.id} className="px-4 py-4 w-1/4 relative">
                  <div className="flex justify-between items-center">
                    <span className="bg-[#003366] text-white font-black text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                      {item.brand}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item)}
                      className="text-slate-400 hover:text-red-500 transition p-1"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mt-2 font-mono select-all">
                    {item.partNumber}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    {item.category}
                  </span>
                </th>
              ))}
              {/* Fill remaining empty columns if total compared < 3 */}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <th key={i} className="px-4 py-4 w-1/4 bg-slate-50/50 text-center font-normal text-slate-400 select-none">
                  <div className="border-2 border-dashed border-slate-200 rounded-lg py-6 flex flex-col items-center justify-center">
                    <span className="text-slate-300 uppercase font-black text-[10px] tracking-widest block">Slot Available</span>
                    <button
                      onClick={onBackToCatalog}
                      className="mt-2 text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 font-black px-2.5 py-1 rounded-sm uppercase tracking-wider transition"
                    >
                      ➕ Check Part
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-200 bg-white">
            
            {/* 1. Price row highlighted */}
            <tr className="divide-x divide-slate-200 font-extrabold bg-amber-50/50">
              <td className="px-4 py-3 font-semibold text-slate-700">Estimated Sourcing Price</td>
              {compareItems.map((item) => (
                <td key={item.id} className="px-4 py-3 text-[#003366] text-base font-black font-mono">
                  ₹{item.price.toLocaleString()}
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="bg-slate-50/30"></td>
              ))}
            </tr>

            {/* 2. Stock status */}
            <tr className="divide-x divide-slate-200 font-semibold">
              <td className="px-4 py-3 text-slate-500 font-medium">Immediate Availability</td>
              {compareItems.map((item) => (
                <td key={item.id} className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 font-bold ${item.stockStatus === 'Available' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {item.stockStatus === 'Available' ? '🟢 Dispatch Ready' : '🟡 Low Stock'} ({item.stockCount} Units)
                  </span>
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="bg-slate-50/30"></td>
              ))}
            </tr>

            {/* 3. Dimensions Group */}
            <tr className="divide-x divide-slate-200 bg-slate-50/30 font-medium">
              <td className="px-4 py-3 text-slate-500">Inside Bored (Bore ID)</td>
              {compareItems.map((item) => (
                <td key={item.id} className="px-4 py-3 font-mono font-bold text-slate-900 text-sm">
                  {item.innerDiameter} mm
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="bg-slate-50/30"></td>
              ))}
            </tr>

            <tr className="divide-x divide-slate-200 font-medium">
              <td className="px-4 py-3 text-slate-500">Outside Diameter (OD)</td>
              {compareItems.map((item) => (
                <td key={item.id} className="px-4 py-3 font-mono font-bold text-slate-900 text-sm">
                  {item.outerDiameter} mm
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="bg-slate-50/30"></td>
              ))}
            </tr>

            <tr className="divide-x divide-slate-200 bg-slate-50/30 font-medium">
              <td className="px-4 py-3 text-slate-500">Width / Thickness (B)</td>
              {compareItems.map((item) => (
                <td key={item.id} className="px-4 py-3 font-mono font-bold text-slate-900 text-sm">
                  {item.width} mm
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="bg-slate-50/30"></td>
              ))}
            </tr>

            {/* 4. Masses & Weights */}
            <tr className="divide-x divide-slate-200 font-medium">
              <td className="px-4 py-3 text-slate-500">Net Mass (Weight)</td>
              {compareItems.map((item) => (
                <td key={item.id} className="px-4 py-3 font-mono">
                  {item.weight}
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="bg-slate-50/30"></td>
              ))}
            </tr>

            {/* 5. Material Compounds */}
            <tr className="divide-x divide-slate-200 bg-slate-50/30 font-medium">
              <td className="px-4 py-3 text-slate-500">Material Compound</td>
              {compareItems.map((item) => (
                <td key={item.id} className="px-4 py-3 text-slate-800 font-semibold">
                  {item.material}
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="bg-slate-50/30"></td>
              ))}
            </tr>

            {/* 6. Seals & Retainers */}
            <tr className="divide-x divide-slate-200 font-medium">
              <td className="px-4 py-3 text-slate-500">Seal/Shield Configuration</td>
              {compareItems.map((item) => (
                <td key={item.id} className="px-4 py-3 text-slate-700">
                  {item.sealType}
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="bg-slate-50/30"></td>
              ))}
            </tr>

            <tr className="divide-x divide-slate-200 bg-slate-50/30 font-medium">
              <td className="px-4 py-3 text-slate-500">Cage retainer type</td>
              {compareItems.map((item) => (
                <td key={item.id} className="px-4 py-3 text-slate-700">
                  {item.cageType}
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="bg-slate-50/30"></td>
              ))}
            </tr>

            {/* 7. Ratings */}
            <tr className="divide-x divide-slate-200 font-medium">
              <td className="px-4 py-3 text-slate-500 text-left">Load Ratings (Dyn / Stat)</td>
              {compareItems.map((item) => (
                <td key={item.id} className="px-4 py-3 font-mono text-[11px] text-slate-800">
                  {item.loadRating}
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="bg-slate-50/30"></td>
              ))}
            </tr>

            <tr className="divide-x divide-slate-200 bg-slate-50/30 font-medium">
              <td className="px-4 py-3 text-slate-500">Limiting Speed</td>
              {compareItems.map((item) => (
                <td key={item.id} className="px-4 py-3 font-mono font-bold text-slate-800">
                  {item.speedRating}
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="bg-slate-50/30"></td>
              ))}
            </tr>

            {/* 8. Logistics */}
            <tr className="divide-x divide-slate-200 font-medium">
              <td className="px-4 py-3 text-slate-500">Country of Origin</td>
              {compareItems.map((item) => (
                <td key={item.id} className="px-4 py-3 text-slate-700">
                  {item.countryOfOrigin}
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="bg-slate-50/30"></td>
              ))}
            </tr>

            <tr className="divide-x divide-slate-200 bg-slate-50/30 font-medium">
              <td className="px-4 py-3 text-slate-500">Core Industry Sourcing</td>
              {compareItems.map((item) => (
                <td key={item.id} className="px-4 py-3 text-slate-600 text-[11px] leading-relaxed">
                  {item.application}
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="bg-slate-50/30"></td>
              ))}
            </tr>

            {/* 9. Interactive Direct Sourcing Actions */}
            <tr className="divide-x divide-slate-200 bg-slate-100/40">
              <td className="px-4 py-4 font-black uppercase text-[#003366] text-[10px] tracking-wider bg-slate-50">Sourcing Actions</td>
              {compareItems.map((item) => (
                <td key={item.id} className="px-4 py-4 space-y-2">
                  <button
                    onClick={() => onAddToQuote(item)}
                    className="w-full bg-[#f2cc4d] hover:bg-[#e1bd41] text-[#003366] font-black py-2.5 rounded-sm text-[11px] uppercase border-b-2 border-amber-600 transition transform active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add To Sourcing Quote
                  </button>
                  <button
                    onClick={() => onViewDetails(item)}
                    className="w-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-black py-2 rounded-sm text-[11px] uppercase transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Detailed Specs sheet
                  </button>
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="bg-slate-50/30"></td>
              ))}
            </tr>

          </tbody>
        </table>
      </div>

    </section>
  );
}
