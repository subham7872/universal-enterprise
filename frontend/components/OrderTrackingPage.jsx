"use client";

import React, { useState } from 'react';
import { Search, MapPin, Truck, CheckCircle2, ShieldAlert, FileText, Loader2, RefreshCw } from 'lucide-react';
import api from '../lib/api';

export default function OrderTrackingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderData, setOrderData] = useState(null);

  // Email lookup states
  const [emailLookup, setEmailLookup] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [emailMatches, setEmailMatches] = useState([]);

  const fetchTracking = async (id) => {
    if (!id || !id.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setOrderData(null);

    try {
      const res = await api.getQuoteById(id.trim());
      setOrderData(res.data || res);
      setTrackingId(id.trim().toUpperCase());
    } catch (err) {
      setErrorMsg(err.message || 'Reference reference ID not located in logistics logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSearch = async (e) => {
    e.preventDefault();
    if (!emailLookup.trim()) return;
    setLookupLoading(true);
    setEmailMatches([]);
    setErrorMsg('');

    try {
      const res = await api.getQuotesByEmail(emailLookup.trim());
      const data = res.data || res || [];
      setEmailMatches(data);
      if (data.length === 0) {
        setErrorMsg('No active sourcing quotes found registered under this corporate email.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error querying email records.');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 space-y-8 font-sans text-slate-800 shadow-xs">
      
      {/* Header */}
      <div className="border-b pb-4">
        <span className="text-[10px] bg-[#003366] text-[#f2cc4d] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest font-mono">
          LOGISTICS MILESTONES DESK
        </span>
        <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#003366] tracking-tight mt-2">
          Real-Time Sourcing & Quote Tracker
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Verify technical inspection status, crating, airway bills, and regional dispatch timelines.
        </p>
      </div>

      {/* Dual Search Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Lookup by Reference ID */}
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-3">
          <h4 className="font-bold text-xs uppercase text-[#003366] tracking-wider">
            Track by Quote Reference ID
          </h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchTracking(trackingId);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="e.g. UE-885402 or UE-115049"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 text-xs p-2.5 bg-white border border-slate-300 rounded font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#003366]"
            />
            <button
              type="submit"
              disabled={loading || !trackingId.trim()}
              className="bg-[#003366] hover:bg-[#002244] text-white px-4 py-2.5 rounded font-bold text-xs uppercase transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Track
            </button>
          </form>

          {/* Shortcuts demo */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <span>Pre-seeded Demos:</span>
            <button onClick={() => fetchTracking('UE-885402')} className="text-[#003366] underline font-bold">UE-885402</button>
            <span>•</span>
            <button onClick={() => fetchTracking('UE-115049')} className="text-[#003366] underline font-bold">UE-115049</button>
          </div>
        </div>

        {/* Lookup by Corporate Email */}
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-3">
          <h4 className="font-bold text-xs uppercase text-[#003366] tracking-wider">
            Lookup Quotes by Corporate Email
          </h4>
          <form onSubmit={handleEmailSearch} className="flex gap-2">
            <input
              type="email"
              placeholder="e.g. v.shah@ril.com"
              value={emailLookup}
              onChange={(e) => setEmailLookup(e.target.value)}
              className="flex-1 text-xs p-2.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#003366]"
            />
            <button
              type="submit"
              disabled={lookupLoading || !emailLookup.trim()}
              className="bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 px-4 py-2.5 rounded font-bold text-xs uppercase transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {lookupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Find
            </button>
          </form>
          <div className="text-[11px] text-slate-400 font-mono">
            Demo: <button onClick={() => { setEmailLookup('v.shah@ril.com'); }} className="text-[#003366] underline font-bold">v.shah@ril.com</button>
          </div>
        </div>

      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          {errorMsg}
        </div>
      )}

      {/* Email matches list if returned */}
      {emailMatches.length > 0 && !orderData && (
        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase text-slate-700">Found {emailMatches.length} Quote(s):</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emailMatches.map((q) => (
              <div
                key={q.quoteId}
                onClick={() => fetchTracking(q.quoteId)}
                className="bg-slate-50 border p-3.5 rounded cursor-pointer hover:border-[#003366] transition space-y-1 text-xs"
              >
                <div className="flex justify-between items-center font-mono">
                  <strong className="text-[#003366]">{q.quoteId}</strong>
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">{q.status}</span>
                </div>
                <div className="text-slate-600">{q.companyName} ({q.items?.length || 0} items)</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order / Milestone Timeline Card */}
      {orderData && (
        <div className="bg-slate-50 border-2 border-[#003366] rounded-lg p-6 space-y-6 animate-in fade-in duration-200">
          
          {/* Top summary row */}
          <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded uppercase">
                Active Logistics Corridor
              </span>
              <h3 className="text-xl font-black text-[#003366] mt-1 font-mono">
                {orderData.quoteId || orderData.referenceId}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {orderData.companyName} • {orderData.name || orderData.customerName}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Milestone Status</span>
              <span className="text-sm font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded inline-block mt-1">
                ● {orderData.status || orderData.currentStatus}
              </span>
            </div>
          </div>

          {/* 6-Stage Milestone Progress Bar */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase text-[#003366] tracking-wider">
              Verification & Dispatch Milestones
            </h4>

            <div className="space-y-3">
              {(orderData.statusTimeline || orderData.milestones || []).map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded border text-xs ${
                    step.done
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-white border-slate-200 text-slate-500 opacity-60'
                  }`}
                >
                  <div className={`mt-0.5 rounded-full p-1 ${step.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-xs uppercase">{step.label}</span>
                      {step.date && <span className="font-mono text-[11px] text-slate-500">{step.date}</span>}
                    </div>
                    {step.desc && <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{step.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sourced Items in this Shipment */}
          {orderData.items && orderData.items.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
              <h4 className="font-bold uppercase text-slate-700 text-xs">Inspected Shipment Items</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                {orderData.items.map((item, iIdx) => (
                  <div key={iIdx} className="bg-white p-2.5 rounded border flex justify-between items-center">
                    <div>
                      <strong className="text-[#003366]">{item.product?.partNumber || item.partNumber}</strong>
                      <span className="text-slate-500 ml-2">({item.product?.brand || item.brand})</span>
                    </div>
                    <span className="font-bold text-slate-900">Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
