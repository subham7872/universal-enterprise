import React, { useState } from 'react';
import { X, Trash2, Send, CheckCircle2, FileText } from 'lucide-react';
import { QuoteItem } from '../types';

interface QuoteListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  quoteItems: QuoteItem[];
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromQuote: (productId: string) => void;
  clearQuote: () => void;
}

export default function QuoteListDrawer({ 
  isOpen, 
  onClose, 
  quoteItems, 
  updateQuantity, 
  removeFromQuote, 
  clearQuote 
}: QuoteListDrawerProps) {
  
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    message: '',
    routing: 'WhatsApp' // 'WhatsApp' | 'CRM/Email'
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState<any | null>(null);

  if (!isOpen) return null;

  const totalEstimate = quoteItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteItems.length === 0) {
      alert('Your quote list is empty. Please select products first.');
      return;
    }

    setLoading(true);
    try {
      const quoteDetails = quoteItems.map(
        (item) => `${item.product.brand} - ${item.product.partNumber} x ${item.quantity} (Est. ${item.product.price} INR)`
      ).join('\n');

      const fullMessage = `QUOTATION REQUEST:\nCompany: ${formData.companyName}\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n\nItems Requested:\n${quoteDetails}\n\nSpecial Instruction: ${formData.message}`;

      if (formData.routing === 'WhatsApp') {
        const whatsappUrl = `https://api.whatsapp.com/send?phone=+914466867700&text=${encodeURIComponent(fullMessage)}`;
        
        // Log CRM request on local endpoint, then open WhatsApp link
        await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            productRequirements: quoteDetails,
            items: quoteItems
          })
        });

        window.open(whatsappUrl, '_blank');
        setSuccessResponse({
          quoteId: `UE-${Date.now().toString().substr(-6)}`,
          summary: 'Your quotation content has been successfully formatted and forwarded. WhatsApp redirect has been triggered.'
        });
      } else {
        const res = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            productRequirements: quoteDetails,
            items: quoteItems
          })
        });
        const data = await res.json();
        setSuccessResponse(data);
      }
    } catch (err: any) {
      console.error('Quote submission error:', err);
      alert('Error processed. Please check connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md">
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl border-l-4 border-[#003366]">
              {/* Drawer Header */}
              <div className="bg-[#003366] px-4 py-6 sm:px-6 text-white border-b-4 border-[#f2cc4d]">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#f2cc4d]" />
                    Quotation Basket
                  </h2>
                  <button
                    type="button"
                    className="rounded-sm text-slate-200 hover:text-white hover:bg-slate-850 p-1 cursor-pointer border border-slate-700/60"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-300 font-medium">
                  Compile list of high-precision bearings for immediate pricing.
                </p>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 px-4 py-4 sm:px-6">
                {successResponse ? (
                  /* Thank You Page */
                  <div className="text-center py-12 px-4 transition-all">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-lg font-black uppercase text-slate-905 tracking-tight">Inquiry Sent Successfully</h3>
                    <p className="text-xs font-mono text-[#0a84ff] font-bold mt-1">Reference ID: {successResponse.quoteId}</p>
                    <p className="text-xs text-slate-600 mt-4 leading-relaxed font-semibold">
                      {successResponse.summary || `Our engineering desk at sales@ntnbearing.in is already processing your custom sheet. An estimated quota response will arrive within 2 hours.`}
                    </p>
                    <div className="mt-8 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setSuccessResponse(null);
                          clearQuote();
                          onClose();
                        }}
                        className="bg-[#003366] hover:bg-[#002244] text-white px-6 py-2.5 rounded-sm font-black uppercase text-xs tracking-wider transition border-b-2 border-slate-900 shadow-md"
                      >
                        Browse more Bearings
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Item list */}
                    {quoteItems.length === 0 ? (
                      <div className="text-center py-16 text-slate-400">
                        <Trash2 className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                        <p className="font-black uppercase tracking-wider text-sm text-slate-800">Your basket is empty</p>
                        <p className="text-xs mt-1">Browse our bearing index on the left sidebar to add parts.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Items added ({quoteItems.length})</span>
                          <button 
                            onClick={clearQuote}
                            className="text-xs text-red-500 hover:text-red-700 font-extrabold uppercase transition"
                          >
                            Clear All
                          </button>
                        </div>

                        {/* List items */}
                        <div className="max-h-64 overflow-y-auto space-y-3.5 pr-1">
                          {quoteItems.map((item) => (
                            <div key={item.product.id} className="flex gap-3 bg-slate-50 p-2.5 rounded-sm border border-slate-200 flex-wrap sm:flex-nowrap">
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-black text-slate-900 text-sm font-mono">{item.product.partNumber}</h4>
                                  <span className="text-[10px] font-black uppercase bg-[#003366] text-white px-1.5 py-0.5 rounded-sm">{item.product.brand}</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium truncate">{item.product.name}</p>
                                <div className="flex items-center gap-1 mt-1 text-slate-700 text-xs font-semibold">
                                  <span>Estimate:</span>
                                  <span className="font-bold text-[#003366]">₹{item.product.price} each</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center border border-slate-300 rounded-sm bg-white overflow-hidden">
                                  <button
                                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                    className="px-2 py-0.5 text-slate-500 hover:bg-slate-100 font-extrabold"
                                  >
                                    -
                                  </button>
                                  <span className="px-2 text-xs font-bold min-w-[20px] text-center font-mono">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    className="px-2 py-0.5 text-slate-500 hover:bg-slate-100 font-extrabold"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFromQuote(item.product.id)}
                                  className="text-slate-400 hover:text-red-500 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Estimated Price Block */}
                        <div className="bg-amber-55 p-3 rounded-sm border border-amber-200 bg-amber-50">
                          <div className="flex justify-between items-center text-slate-800 text-xs font-black uppercase tracking-wider">
                            <span>Direct Quote Estimate:</span>
                            <span className="text-lg text-amber-700 font-black font-mono">₹{totalEstimate.toLocaleString()}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                            *Estimated pricing subject to batch size discounts and premium delivery options.
                          </p>
                        </div>

                        {/* Custom Requirements Form */}
                        <form onSubmit={handleSubmit} className="mt-6 border-t border-slate-200 pt-5 space-y-3">
                          <h3 className="text-[11px] font-black uppercase tracking-widest text-[#003366] border-b pb-1">Procurement Officer Details</h3>
                          
                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider">Officer Name *</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="mt-1 w-full text-xs p-2.5 bg-white border border-slate-300 rounded-sm focus:ring-1 focus:ring-[#003366] focus:border-[#003366] font-semibold"
                              placeholder="e.g. Ramesh Kumar"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider">Company Name *</label>
                            <input
                              type="text"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleInputChange}
                              required
                              className="mt-1 w-full text-xs p-2.5 bg-white border border-slate-300 rounded-sm focus:ring-1 focus:ring-[#003366] focus:border-[#003366] font-semibold"
                              placeholder="e.g. Tata Steel Plant V"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider">Phone *</label>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="mt-1 w-full text-xs p-2.5 bg-white border border-slate-300 rounded-sm focus:ring-1 focus:ring-[#003366] focus:border-[#003366] font-semibold"
                                placeholder="e.g. +91 98765 43210"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider">Corporate Email *</label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="mt-1 w-full text-xs p-2.5 bg-white border border-slate-300 rounded-sm focus:ring-1 focus:ring-[#003366] focus:border-[#003366] font-semibold"
                                placeholder="procurement@company.com"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider">Special Sourcing Queries (Optional)</label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              rows={2}
                              className="mt-1 w-full text-xs p-2 bg-white border border-slate-300 rounded-sm focus:ring-1 focus:ring-[#003366] focus:border-[#003366] font-semibold"
                              placeholder="Describe custom sizes, lubricant requests or dispatch intervals."
                            ></textarea>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider">Quote Dispatch Routing</label>
                            <select
                              name="routing"
                              value={formData.routing}
                              onChange={handleInputChange}
                              className="mt-1 w-full text-[11px] p-2 bg-slate-50 border border-slate-300 rounded-sm focus:ring-1 focus:ring-[#003366] focus:border-[#003366] font-bold text-slate-800"
                            >
                              <option value="WhatsApp">🟢 Instantly Dispatch via WhatsApp Sourcing Desk</option>
                              <option value="CRM">💻 Log Corporate CRM & Request Email Quote</option>
                            </select>
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full bg-[#f2cc4d] hover:bg-[#e1bd41] text-[#003366] font-black uppercase text-xs py-3.5 rounded-sm flex items-center justify-center gap-2 transition duration-200 border-b-2 border-amber-600 shadow-md cursor-pointer disabled:opacity-50"
                          >
                            {loading ? (
                              'Dispatching Quotation...'
                            ) : (
                              <>
                                <Send className="w-4 h-4 text-[#003366]" />
                                {formData.routing === 'WhatsApp' ? 'Launch WhatsApp Quote Sourcing' : 'Submit Sourcing Sheet'}
                              </>
                            )}
                          </button>
                        </form>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
