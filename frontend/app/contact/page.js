"use client";

import React, { useState } from 'react';
import { MapPin, Phone, Mail, CheckCircle2, Send, RefreshCw } from 'lucide-react';
import api from '../../lib/api';
import PremiumContactAdditions from '../../components/PremiumContactAdditions';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    productRequirements: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitLead({
        name: form.name,
        company: form.companyName || 'Corporate Client',
        phone: form.phone,
        mobile: form.phone,
        email: form.email,
        productInterest: form.productRequirements || 'General Sourcing Inquiry',
        message: form.message ? `${form.productRequirements ? form.productRequirements + ' — ' : ''}${form.message}` : (form.productRequirements || 'General Sourcing Inquiry'),
        source: 'contact'
      });

      setSuccess(true);
      setForm({
        name: '',
        companyName: '',
        phone: '',
        email: '',
        productRequirements: '',
        message: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      alert(`Inquiry status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans text-slate-800">
      <div className="bg-[#003366] text-white p-8 rounded-lg border-b-4 border-[#f2cc4d] space-y-2">
        <span className="text-[10px] bg-[#f2cc4d] text-slate-950 font-bold px-2 py-0.5 rounded uppercase font-mono">
          DIRECT ENGINEERING DESK
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
          Contact Universal Enterprise
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-normal">
          Get immediate pricing, technical specification sheets, and regional logistics support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs">
        
        {/* Hubs */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#003366] uppercase border-b pb-2">
            Geographic Sourcing Hubs
          </h3>
          
          <div className="space-y-3">
            {[
              { 
                city: 'Bangalore (Head Office & Warehouse)', 
                addr: 'No. 7, 4th Cross, Kalasipalya New Extension, Bangalore – 560002, India', 
                tel: '+91 9900726939 / 8123836939', 
                email: 'ue14.email@gmail.com',
                tax: 'GST: 29AAGFU1019D1ZF'
              },
              { city: 'Mumbai Industrial Desk', addr: 'Unit No 1104, DLH Park, S V Road, Goregaon West, Mumbai 400062', tel: '+91 9900726939', email: 'ue14.email@gmail.com' },
              { city: 'Delhi Sourcing Desk', addr: '904, 9th Floor, International Trade Tower, Nehru Place, New Delhi 110019', tel: '+91 9900726939', email: 'ue14.email@gmail.com' },
              { city: 'Chennai Logistics Desk', addr: 'Mount Road, Guindy Industrial Estate, Chennai 600032', tel: '+91 9900726939', email: 'ue14.email@gmail.com' }
            ].map((loc, idx) => (
              <div key={idx} className="bg-slate-50 border p-3.5 rounded space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  {loc.city}
                </div>
                <p className="text-slate-500 text-[11px]">{loc.addr}</p>
                {loc.tax && (
                  <div className="text-[10px] text-amber-700 font-mono font-bold">
                    {loc.tax}
                  </div>
                )}
                <div className="font-mono text-[#003366] font-bold text-[11px] pt-1">
                  {loc.tel} • {loc.email}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7 bg-slate-50 p-6 rounded-lg border border-slate-200 text-xs">
          <h3 className="font-bold text-sm text-[#003366] uppercase mb-4">
            Submit Technical Sourcing Requirements
          </h3>

          {success ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded p-6 text-center space-y-2 text-emerald-900">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="font-black text-base uppercase">Application Logged</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our Senior Technical Sourcing Specialist has received your requirements. Expect an engineering verification call in under 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold uppercase text-[10px]">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ramesh Kumar"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 bg-white border rounded focus:ring-1 focus:ring-[#003366]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold uppercase text-[10px]">Enterprise Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="Tata Structural Plant"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="w-full p-2.5 bg-white border rounded focus:ring-1 focus:ring-[#003366]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold uppercase text-[10px]">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 94444 88888"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-2.5 bg-white border rounded font-mono focus:ring-1 focus:ring-[#003366]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold uppercase text-[10px]">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sourcing@tatasteel.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-2.5 bg-white border rounded focus:ring-1 focus:ring-[#003366]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold uppercase text-[10px]">Part Numbers & Brand Requirements</label>
                <input
                  type="text"
                  placeholder="e.g. NTN 16010 x 50, THK HSR25 x 4, FAG 6204-2Z"
                  value={form.productRequirements}
                  onChange={(e) => setForm({ ...form, productRequirements: e.target.value })}
                  className="w-full p-2.5 bg-white border rounded focus:ring-1 focus:ring-[#003366]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold uppercase text-[10px]">Special Instructions & Delivery Window</label>
                <textarea
                  rows={3}
                  placeholder="Elaborate on temperature limits, clearance classes (C3, C2), or urgent plant turnaround dates..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-2 bg-white border rounded focus:ring-1 focus:ring-[#003366]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black py-3 rounded uppercase text-xs border-b-2 border-amber-600 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Corporate Application
              </button>
            </form>
          )}
        </div>

      </div>

      <PremiumContactAdditions />
    </div>
  );
}
