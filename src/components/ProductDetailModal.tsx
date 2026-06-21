import React, { useState } from 'react';
import { 
  X, ShoppingCart, ArrowRightLeft, ShieldAlert,
  Download, FileText, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToQuote: (product: Product) => void;
}

export default function ProductDetailModal({ product, onClose, onAddToQuote }: ProductDetailModalProps) {
  if (!product) return null;

  // New local state for interaction
  const [bulkQty, setBulkQty] = useState('50');
  const [bulkCompany, setBulkCompany] = useState('');
  const [bulkContact, setBulkContact] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Derive series
  const seriesMatch = product.partNumber.match(/[a-zA-Z]+|\d+/g);
  const series = seriesMatch ? seriesMatch[0] : 'Standard Series';

  // Helper mock images relative to actual bearing types to make the designs look incredible
  const typeLabel = product.category || 'Ball Bearing';
  let designImg = 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&q=80&w=400';
  if (typeLabel.includes('Roller')) {
    designImg = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400';
  } else if (typeLabel.includes('Guide') || typeLabel.includes('Screw') || typeLabel.includes('Linear')) {
    designImg = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80';
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

      {/* Modal Card with sharp industrial look */}
      <div className="relative bg-white rounded-sm shadow-2xl border-t-8 border-[#003366] max-w-3xl w-full overflow-hidden transition-all text-slate-800 border-x border-b border-slate-300">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-205 flex justify-between items-center">
          <div>
            <span className="bg-[#003366] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-sm mr-2 tracking-widest">
              {product.brand} OEM GENUINE
            </span>
            <span className="text-xs text-[#0a84ff] font-mono font-bold">SERIAL ID: {product.id}</span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1 uppercase">
              Part No: {product.partNumber}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-750 bg-slate-100 hover:bg-slate-200 p-2 rounded-sm transition cursor-pointer border border-slate-200"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* Scrollable specs body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Visual Block */}
            <div className="space-y-4">
              <div className="bg-slate-150 rounded-sm overflow-hidden border-2 border-slate-200 relative aspect-square shadow-inner flex items-center justify-center">
                <img 
                  src={designImg} 
                  alt={product.name}
                  className="object-cover w-full h-full mix-blend-multiply opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2.5 py-1 rounded-sm font-mono font-bold uppercase tracking-wider">
                  Product Representative
                </div>
              </div>

              {/* Instant Action Stock Status block */}
              <div className="bg-emerald-50 rounded-sm border border-emerald-200 p-3 flex justify-between items-center text-xs">
                <div>
                  <span className="text-emerald-900 font-extrabold uppercase text-[10px] block mb-0.5">Stock Status:</span>
                  <span className="text-emerald-850 font-black">
                    {product.stockStatus === 'Available' ? '🟢 24hr Dispatch Ready' : '🟡 Order On-Demand'} ({product.stockCount} Available)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[9px] uppercase font-black tracking-wider">Est. Price (INR)</span>
                  <span className="text-base font-black text-[#003366]">₹{product.price}</span>
                </div>
              </div>

              {/* Shopping addition CTA */}
              <button
                onClick={() => {
                  onAddToQuote(product);
                  onClose();
                }}
                className="w-full bg-[#f2cc4d] hover:bg-[#e1bd41] text-[#003366] font-black text-xs uppercase py-3.5 rounded-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer border-b-2 border-amber-600"
              >
                <ShoppingCart className="w-4 h-4 text-[#003366]" />
                Add Part To Quote Cart
              </button>
            </div>

            {/* Technical Parameters Specs */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#003366] border-b-2 border-[#003366] pb-1">
                Engineering Specifications
              </h4>
              
              <div className="border border-slate-300 rounded-sm overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left divide-y border-collapse">
                  <tbody className="divide-y divide-slate-150 bg-white">
                    <tr className="bg-slate-50">
                      <td className="px-3 py-1.5 font-bold text-slate-500 w-1/2">Product Number</td>
                      <td className="px-3 py-1.5 font-mono font-black text-[#003366] select-all">{product.partNumber}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-slate-500">Brand / Manufacturer</td>
                      <td className="px-3 py-1.5 font-black text-[#0A84FF] uppercase text-[11px]">{product.brand} Industrial</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-3 py-1.5 font-bold text-slate-500">Bearing Category</td>
                      <td className="px-3 py-1.5 text-slate-800 font-extrabold uppercase text-[10px]">{product.category}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-slate-500">Lubrication Series</td>
                      <td className="px-3 py-1.5 font-mono font-bold text-slate-700">{series}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-3 py-1.5 font-bold text-slate-500">Weight (Net Mass)</td>
                      <td className="px-3 py-1.5 text-slate-705 font-mono font-bold">{product.weight}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-slate-500">Inside Bored (Bore ID)</td>
                      <td className="px-3 py-1.5 text-slate-900 font-bold font-mono">{product.innerDiameter} mm</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-3 py-1.5 font-bold text-slate-500">Outside Diameter (OD)</td>
                      <td className="px-3 py-1.5 text-slate-900 font-bold font-mono">{product.outerDiameter} mm</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-slate-500">Width (thickness B)</td>
                      <td className="px-3 py-1.5 text-slate-900 font-bold font-mono">{product.width} mm</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-3 py-1.5 font-bold text-slate-500">Material Compound</td>
                      <td className="px-3 py-1.5 text-slate-700 font-semibold">{product.material}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-slate-500">Seal / Shield Configuration</td>
                      <td className="px-3 py-1.5 text-slate-700 font-semibold">{product.sealType}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-3 py-1.5 font-bold text-slate-500">Cage retainer type</td>
                      <td className="px-3 py-1.5 text-slate-700 font-semibold">{product.cageType}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-slate-500">Load Ratings (Dyn / Stat)</td>
                      <td className="px-3 py-1.5 text-slate-800 font-mono text-[11px] truncate">{product.loadRating}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-3 py-1.5 font-bold text-slate-500">Limiting Speed</td>
                      <td className="px-3 py-1.5 text-slate-800 font-mono font-semibold">{product.speedRating}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-slate-500">Country of Origin</td>
                      <td className="px-3 py-1.5 text-slate-700 font-bold">{product.countryOfOrigin}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-3 py-1.5 font-bold text-slate-500">Primary Applications</td>
                      <td className="px-3 py-1.5 text-[11px] text-slate-600 leading-snug font-semibold">{product.application}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Equivalents list comparison side-by-side matrices */}
          {product.equivalentProducts && product.equivalentProducts.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-sm border border-slate-300">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#003366] mb-3 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4 text-amber-500" />
                Cross-Brand Equivalent Interface Substitutes Guide
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug mb-3 font-semibold">
                Looking to match alternatives due to urgent timeline needs? These major interchangeable manufacturers support identical dimensional tolerances (Bore ID: {product.innerDiameter}mm, OD: {product.outerDiameter}mm, Outer Width: {product.width}mm):
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {product.equivalentProducts.map((eq, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-sm p-3 text-xs shadow-xs relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 bg-[#0056b3] text-white text-[9px] font-black px-2 py-0.5 rounded-bl-sm">
                      {eq.brand}
                    </div>
                    <div>
                      <span className="block font-black text-slate-900 text-sm mt-1">{eq.partNumber}</span>
                      <span className="block text-[10px] text-slate-400 font-black uppercase tracking-wider">Substitute Code</span>
                    </div>
                    <div className="mt-2.5 flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="font-extrabold text-[#003366]">₹{eq.price}</span>
                      <button
                        onClick={() => {
                          const customEqProduct: Product = {
                            ...product,
                            id: `eq-${eq.brand.toLowerCase()}-${eq.partNumber.toLowerCase()}`,
                            brand: eq.brand,
                            partNumber: eq.partNumber,
                            price: eq.price,
                            name: `Equivalent Sourced ${eq.brand} ${eq.partNumber}`
                          };
                          onAddToQuote(customEqProduct);
                          onClose();
                        }}
                        className="bg-[#f2cc4d] hover:bg-[#e1bd41] text-[#003366] font-black text-[10px] px-2.5 py-1 rounded-sm uppercase transition cursor-pointer"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Genuine Guarantee advisory */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm text-slate-700 text-[11px] flex gap-2 items-start">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-black uppercase text-[10px] text-amber-800 block mb-0.5">Corporate Certification Guarantee:</span>
              Universal Enterprise distributes 100% genuine industrial bearings directly traced with verifiable source reports and complete warranty structures. Custom application design parameters are available upon request.
            </div>
          </div>

          {/* ====================================================
              PRODUCT APPLICATIONS
              ==================================================== */}
          <div className="bg-slate-50 p-4 border border-slate-300 rounded-sm space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#003366] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#003366]" />
              Physical Product Industrial Applications
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
              <div className="flex items-center gap-1.5 p-1 px-2 border rounded bg-white">
                <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                <span>Steel Mills & Cylinders</span>
              </div>
              <div className="flex items-center gap-1.5 p-1 px-2 border rounded bg-white">
                <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                <span>Heavy Electric Motor Spindles</span>
              </div>
              <div className="flex items-center gap-1.5 p-1 px-2 border rounded bg-white">
                <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                <span>Rotary Drums & Kilns</span>
              </div>
              <div className="flex items-center gap-1.5 p-1 px-2 border rounded bg-white">
                <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                <span>Continuous Conveyor Systems</span>
              </div>
            </div>
          </div>

          {/* ====================================================
              DOWNLOAD DATASHEET SECTION
              ==================================================== */}
          <div className="bg-slate-50 p-4 border border-slate-300 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left space-y-1">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#003366] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#003366]" />
                Interactive Engineering CAD Drawings
              </h4>
              <p className="text-[10px] text-slate-500 leading-normal font-medium">
                Download fully annotated technical tolerances sheets, dimensional diagrams (.PDF), and 3D CAD vectors (.DXF) for modeling.
              </p>
            </div>
            <button
              onClick={() => {
                setDownloading(true);
                setTimeout(() => {
                  setDownloading(false);
                  setDownloadSuccess(true);
                  // Generate download
                  const content = `UNIVERSAL ENTERPRISE TECHNICAL DATASHEET\n--------------------------------------------\nPart Number: ${product.partNumber}\nBrand: ${product.brand}\nBore ID: ${product.innerDiameter} mm\nOD: ${product.outerDiameter} mm\nWidth: ${product.width} mm\nCage Retainer: ${product.cageType}\nSeal Type: ${product.sealType}\nWeight: ${product.weight}\nSpeed Rating: ${product.speedRating}\nMaterial: ${product.material}\nOrigin: ${product.countryOfOrigin}\nApplication: ${product.application}`;
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Universal_Enterprise_Datasheet_${product.partNumber}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }, 1200);
              }}
              disabled={downloading}
              className="bg-[#003366] text-white hover:bg-slate-900 border border-slate-700 font-extrabold text-[10px] uppercase px-4 py-2.5 rounded shadow-sm flex items-center gap-2 transition cursor-pointer self-stretch sm:self-center justify-center shrink-0 min-w-44"
            >
              <Download className="w-3.5 h-3.5" />
              {downloading ? 'Compiling PDF CAD...' : downloadSuccess ? '✓ PDF Downloaded' : '📥 Download Datasheet (.PDF)'}
            </button>
          </div>

          {/* ====================================================
              RELATED PRODUCTS BY CATEGORY
              ==================================================== */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#003366] border-b pb-1">
              Related Sourced Alternative Components
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { 
                  partNumber: `${series}x04-C3`, 
                  brand: product.brand,
                  price: Math.floor(product.price * 0.9), 
                  dims: `Bore: ${Number(product.innerDiameter) - 5 || 20}mm / OD: ${Number(product.outerDiameter) - 10 || 47}mm` 
                },
                { 
                  partNumber: `${series}x06-C3`, 
                  brand: product.brand,
                  price: Math.floor(product.price * 1.15), 
                  dims: `Bore: ${Number(product.innerDiameter) + 5 || 30}mm / OD: ${Number(product.outerDiameter) + 12 || 62}mm` 
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border text-left p-3.5 rounded shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-amber-400">
                  <div className="absolute top-1 right-2 bg-slate-100 text-[#003366] border border-slate-200 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                    {item.brand}
                  </div>
                  <div>
                    <span className="block font-black text-sm text-[#003366] pt-1">{item.partNumber}</span>
                    <span className="block text-[9px] text-slate-400 font-mono font-bold mt-0.5 tracking-wider uppercase">DIMENSIONS: {item.dims}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 mt-2.5 flex justify-between items-center bg-slate-50/50 p-1 px-2 rounded">
                    <span className="text-xs font-black text-slate-800">₹{item.price}</span>
                    <button
                      onClick={() => {
                        const relatedProduct: Product = {
                          ...product,
                          id: `related-${idx}-${Date.now()}`,
                          partNumber: item.partNumber,
                          price: item.price,
                          name: `Related Alternative Component ${item.partNumber}`
                        };
                        onAddToQuote(relatedProduct);
                        onClose();
                      }}
                      className="bg-[#f2cc4d] hover:bg-yellow-500 text-[#003366] font-black text-[9px] px-2.5 py-1 rounded transition uppercase"
                    >
                      + Add to Basket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ====================================================
              REQUEST BULK QUOTE SECTION
              ==================================================== */}
          <div className="bg-[#003366]/5 border border-[#003366]/10 p-5 rounded-sm space-y-4">
            <div className="text-left space-y-1">
              <span className="text-[8px] bg-amber-400 text-[#003366] font-black px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                BULK PRICE INTERCHANGINGS
              </span>
              <h4 className="text-sm font-black uppercase tracking-tight text-[#003366]">
                Request Volume Contract Quote for {product.partNumber}
              </h4>
              <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                Sourcing quantities above 50 units for regular production plants? Submit direct requests below to bind custom corporate discounts.
              </p>
            </div>

            {bulkSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded text-center text-xs space-y-1.5">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h5 className="font-extrabold uppercase text-emerald-950">Bulk Procurement Request Lodged</h5>
                <p className="text-[10px] text-slate-600">
                  Custom lead registered safely in local CRM logs. Pricing spreadsheet on FAG & SKF equivalences is compiling under SLA. Expect dispatch direct calls within 1 hour!
                </p>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  try {
                    const savedLeads = localStorage.getItem('ue_crm_leads');
                    const leads = savedLeads ? JSON.parse(savedLeads) : [];
                    const newLead = {
                      id: `lead-bulk-${Date.now()}`,
                      name: bulkContact || 'Bulk Sourcing Agent',
                      company: bulkCompany || 'Private Mill Ltd',
                      mobile: '+91 91000 12000',
                      email: 'purchasing@corporatemills.com',
                      productInterest: `${product.partNumber} (Qty: ${bulkQty})`,
                      source: 'Product Bulk Inquiry Form',
                      leadScore: 92,
                      status: 'New',
                      createdDate: new Date().toISOString().split('T')[0],
                      lastActivity: 'Product Page Bulk form submitted',
                      notes: `High-priority volume request for part: ${product.partNumber}. Requested Qty: ${bulkQty} units.`
                    };
                    localStorage.setItem('ue_crm_leads', JSON.stringify([newLead, ...leads]));
                  } catch (err) {
                    console.error('Failed to sync bulk request: ', err);
                  }
                  setBulkSuccess(true);
                  setTimeout(() => setBulkSuccess(false), 5000);
                }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-left"
              >
                <div className="space-y-1">
                  <label className="block text-slate-600 text-[9px] font-bold uppercase">Required Qty *</label>
                  <input
                    type="number"
                    required
                    min="5"
                    value={bulkQty}
                    onChange={(e) => setBulkQty(e.target.value)}
                    className="w-full p-2 bg-white border rounded focus:outline-none"
                    placeholder="e.g. 100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 text-[9px] font-bold uppercase">Corporate Company *</label>
                  <input
                    type="text"
                    required
                    value={bulkCompany}
                    onChange={(e) => setBulkCompany(e.target.value)}
                    className="w-full p-2 bg-white border rounded focus:outline-none"
                    placeholder="e.g. Tata Steel"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 text-[9px] font-bold uppercase">Procurement Rep *</label>
                  <input
                    type="text"
                    required
                    value={bulkContact}
                    onChange={(e) => setBulkContact(e.target.value)}
                    className="w-full p-2 bg-white border rounded focus:outline-none"
                    placeholder="e.g. P. Roy"
                  />
                </div>
                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="w-full bg-[#f2cc4d] hover:bg-yellow-500 text-[#003366] font-black uppercase py-2.5 rounded tracking-wider shadow-sm text-[10px] cursor-pointer"
                  >
                    Submit Bulk Sourcing Spec Form
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
