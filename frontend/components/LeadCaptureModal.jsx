"use client";

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';

export default function LeadCaptureModal() {
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceInterest: 'Ball Bearings'
  });

  useEffect(() => {
    const dismissed = sessionStorage.getItem('ue_promo_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('ue_promo_dismissed', 'true');
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createLead({
        name: formData.name,
        mobile: formData.phone,
        email: formData.email,
        company: 'Website Portal Visitor',
        productInterest: formData.serviceInterest,
        source: 'Homepage Modal',
        status: 'New',
        leadScore: 65,
        notes: 'Lead captured via Homepage Exit/CAD Modal'
      });

      setSubmitted(true);
      sessionStorage.setItem('ue_promo_dismissed', 'true');
      setTimeout(() => {
        setShowModal(false);
      }, 2500);
    } catch (err) {
      sessionStorage.setItem('ue_promo_dismissed', 'true');
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 select-none font-sans text-slate-800 animate-in fade-in duration-200">
      <div className="bg-white border-4 border-[#003366] rounded-sm p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase p-1"
          title="Dismiss"
        >
          ✕ Dismiss
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-xl font-black text-[#003366] uppercase">Access Granted</h3>
            <p className="text-xs text-slate-600">
              Our engineering team has received your details. CAD models and interchange sheets will be delivered to <strong>{formData.email}</strong>.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-1.5 border-b pb-4">
              <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded-sm uppercase tracking-widest font-mono">
                Corporate Gate Access
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#003366] uppercase tracking-tight leading-6 pt-2">
                Unlock OEM CAD Models & Dynamic Specification Desk
              </h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                Connect with Universal Enterprise&apos;s qualified technical engineers. Receive custom specifications and interchange pricing sheets directly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
              <div className="space-y-1">
                <label className="block text-slate-600 font-bold uppercase text-[10px]">Your Name / Representative *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Mahindra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-[#003366] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-bold uppercase text-[10px]">Mobile Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98400 12000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-[#003366] focus:bg-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-bold uppercase text-[10px]">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. a.mahindra@mahindra.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-[#003366] focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 font-bold uppercase text-[10px]">Core Component Segment Interest *</label>
                <select
                  value={formData.serviceInterest}
                  onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-[#003366] focus:bg-white font-bold"
                >
                  <option value="Ball Bearings">Ball Bearings</option>
                  <option value="Roller Bearings">Roller Bearings</option>
                  <option value="Thrust Bearings">Thrust Bearings</option>
                  <option value="Housings">Housings</option>
                  <option value="Linear Bearings">Linear Bearings</option>
                  <option value="Automotive Parts">Automotive Parts</option>
                  <option value="Other Bearings">Other Bearings</option>
                  <option value="Grease & Lubrication">Grease & Lubrication</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded text-[11px] uppercase transition"
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black py-3 rounded text-[11px] uppercase transition border-b-2 border-amber-600 shadow-md"
                >
                  Apply & Get Access
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
