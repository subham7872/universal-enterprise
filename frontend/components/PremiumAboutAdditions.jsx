"use client";

import React from 'react';
import { ShieldCheck, Award, CheckCircle2, Factory, Globe2, Truck } from 'lucide-react';

export default function PremiumAboutAdditions() {
  return (
    <div className="space-y-8 font-sans text-slate-800">
      
      {/* Certifications & Quality Assurance */}
      <section className="bg-slate-50 border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <span className="text-[10px] bg-[#003366] text-[#f2cc4d] font-bold px-2 py-0.5 rounded uppercase font-mono">
            QUALITY ASSURANCE BENCHMARKS
          </span>
          <h3 className="text-xl font-black uppercase text-[#003366] mt-1">
            Certified Distribution Corridors & Verification
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded border border-slate-200 shadow-2xs space-y-2">
            <Award className="w-8 h-8 text-[#003366]" />
            <h4 className="font-bold text-sm text-slate-900">ISO 9001:2015 Registered</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every bearing lot dispatched complies with verified manufacturing batch origins and temperature-controlled storage standards.
            </p>
          </div>

          <div className="bg-white p-5 rounded border border-slate-200 shadow-2xs space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <h4 className="font-bold text-sm text-slate-900">100% Genuine Origin Guarantee</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authorized direct procurement from Japan, Germany, and Sweden eliminates counterfeit risks for high-vibration plants.
            </p>
          </div>

          <div className="bg-white p-5 rounded border border-slate-200 shadow-2xs space-y-2">
            <Truck className="w-8 h-8 text-amber-600" />
            <h4 className="font-bold text-sm text-slate-900">Rapid Air Express Network</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Express air dispatch to industrial clusters in Chennai, Mumbai, Delhi, Kolkata, Jamshedpur, and Pune.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
