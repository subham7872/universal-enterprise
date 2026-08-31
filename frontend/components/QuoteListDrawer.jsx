"use client";

import React, { useState } from 'react';
import { X, Trash2, Send, CheckCircle2, FileText, ShoppingCart, RefreshCw } from 'lucide-react';
import api from '../lib/api';

export default function QuoteListDrawer({
  isOpen,
  onClose,
  quoteItems = [],
  updateQuantity,
  removeFromQuote,
  clearQuote
}) {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    message: '',
    routing: 'WhatsApp' // 'WhatsApp' | 'CRM'
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);

  if (!isOpen) return null;

  const totalEstimate = quoteItems.reduce(
    (acc, item) => acc + ((item.product?.price || 0) * (item.quantity || 1)),
    0
  );

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quoteItems.length === 0) {
      alert('Your quote list is empty. Please select products first.');
      return;
    }

    setLoading(true);
    try {
      const quoteDetails = quoteItems
        .map(
          (item) =>
            `${item.product?.brand || 'NTN'} - ${item.product?.partNumber} x ${item.quantity} (₹${item.product?.price || 0}/ea)`
        )
        .join('\n');

      const fullMessage = `QUOTATION REQUEST:\nCompany: ${formData.companyName}\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n\nItems Requested:\n${quoteDetails}\n\nTotal Estimate: ₹${totalEstimate}\nSpecial Instruction: ${formData.message}`;

      // Persist quote to backend MongoDB
      const res = await api.submitQuote({
        name: formData.name,
        companyName: formData.companyName,
        phone: formData.phone,
        email: formData.email,
        routing: formData.routing,
        items: quoteItems,
        message: formData.message
      });

      setSuccessResponse(res);

      if (formData.routing === 'WhatsApp') {
        const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919900726939';
        const cleanNumber = whatsappNumber.replace(/[^0-9+]/g, '');
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(
          `${fullMessage}\n\nGenerated Reference: ${res.quoteId}`
        )}`;
        window.open(whatsappUrl, '_blank');
      }

      clearQuote();
    } catch (err) {
      alert(`Quote submission notification: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between text-slate-800 border-l-4 border-[#f2cc4d]">
        
        {/* Header */}
        <div className="bg-[#003366] text-white p-4 flex justify-between items-center border-b-2 border-[#f2cc4d]">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#f2cc4d]" />
            <h3 className="text-sm font-black uppercase tracking-wider">
              Request For Quotation (RFQ) Cart
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1" title="Close Drawer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {successResponse ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-6 text-center space-y-4 text-emerald-950">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="text-xl font-black uppercase tracking-tight text-emerald-900">
                RFQ Submitted Successfully!
              </h4>
              <div className="bg-white p-4 rounded border border-emerald-200 text-xs font-mono text-left space-y-1.5 shadow-2xs">
                <div><strong>Reference ID:</strong> <span className="text-[#003366] font-bold">{successResponse.quoteId}</span></div>
                <div><strong>Submission Date:</strong> {successResponse.submissionDate}</div>
                <div><strong>Assigned Desk:</strong> {successResponse.salesOfficer}</div>
                <div><strong>Estimated Response:</strong> {successResponse.estimatedResponseTime}</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                A formal quotation has been scheduled for technical review. Track progress using your reference code under the <strong>Tracker</strong> page.
              </p>
              <button
                onClick={() => {
                  setSuccessResponse(null);
                  onClose();
                }}
                className="w-full bg-[#003366] text-white py-2.5 rounded font-bold text-xs uppercase hover:bg-[#002244] transition"
              >
                Close Quotation Desk
              </button>
            </div>
          ) : (
            <>
              {/* Product items list */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Selected Items ({quoteItems.length})
                  </span>
                  {quoteItems.length > 0 && (
                    <button
                      onClick={clearQuote}
                      className="text-[11px] text-red-600 hover:underline font-bold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {quoteItems.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 space-y-2">
                    <FileText className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">Your quote cart is currently empty.</p>
                    <p className="text-[11px]">Click &quot;Add to Quote&quot; on any bearing in the catalog.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {quoteItems.map((item) => (
                      <div
                        key={item.product.id || item.product.partNumber}
                        className="bg-slate-50 border border-slate-200 rounded p-3 flex justify-between items-center text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-extrabold text-[#003366] text-sm">
                            {item.product.partNumber}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {item.product.brand} • ₹{item.product.price}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded bg-white overflow-hidden shadow-2xs">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  Math.max(1, (item.quantity || 1) - 1)
                                )
                              }
                              className="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 font-bold font-mono">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, (item.quantity || 1) + 1)
                              }
                              className="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromQuote(item.product.id)}
                            className="text-slate-400 hover:text-red-600 p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {quoteItems.length > 0 && (
                  <div className="bg-[#003366]/5 p-3 rounded flex justify-between items-center text-xs font-bold">
                    <span className="uppercase text-slate-600">Estimated Total (INR):</span>
                    <span className="text-base text-[#003366] font-black">₹{totalEstimate}</span>
                  </div>
                )}
              </div>

              {/* Inquiry details form */}
              {quoteItems.length > 0 && (
                <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t text-xs">
                  <h4 className="font-black text-[#003366] uppercase text-xs tracking-wider">
                    Procurement Officer Information
                  </h4>

                  <div className="space-y-1">
                    <label className="block text-slate-600 font-bold uppercase text-[10px]">Contact Person *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-slate-50 border rounded focus:ring-1 focus:ring-[#003366] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-600 font-bold uppercase text-[10px]">Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      placeholder="e.g. Tata Steel Plant"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-slate-50 border rounded focus:ring-1 focus:ring-[#003366] focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-slate-600 font-bold uppercase text-[10px]">Mobile / WhatsApp *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98400 12000"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-2.5 bg-slate-50 border rounded focus:ring-1 focus:ring-[#003366] focus:bg-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-slate-600 font-bold uppercase text-[10px]">Corporate Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="sourcing@tatasteel.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2.5 bg-slate-50 border rounded focus:ring-1 focus:ring-[#003366] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-600 font-bold uppercase text-[10px]">Sourcing Routing Method</label>
                    <select
                      name="routing"
                      value={formData.routing}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-slate-50 border rounded font-semibold text-slate-800"
                    >
                      <option value="WhatsApp">Direct WhatsApp Dispatch (+91 9900726939)</option>
                      <option value="CRM">Universal Enterprise CRM / Email Desk</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-600 font-bold uppercase text-[10px]">Technical Note / Special Requirements</label>
                    <textarea
                      name="message"
                      rows={2}
                      placeholder="Specify clearance requirements (C3, C2), high temp grease, or target dispatch dates..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-slate-50 border rounded focus:ring-1 focus:ring-[#003366] focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#f2cc4d] hover:bg-[#ebd047] text-slate-950 font-black py-3 rounded uppercase tracking-wider text-xs border-b-2 border-amber-600 transition transform active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Submit Sourcing Quotation
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
