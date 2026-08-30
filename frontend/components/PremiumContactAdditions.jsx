"use client";

import React from 'react';
import { Phone, Mail, MapPin, Building, Clock } from 'lucide-react';

export default function PremiumContactAdditions() {
  return (
    <div className="space-y-8 font-sans text-slate-800">
      
      {/* Sourcing Hubs Grid */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <span className="text-[10px] bg-[#003366] text-[#f2cc4d] font-bold px-2 py-0.5 rounded uppercase font-mono">
            REGIONAL DESKS
          </span>
          <h3 className="text-xl font-black uppercase text-[#003366] mt-1">
            Universal Enterprise Sourcing Locations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
            <h4 className="font-extrabold text-[#003366] text-sm uppercase">Chennai (Head Office)</h4>
            <p className="text-slate-600">Polyhose Tower, Mount Road, Guindy, Chennai 600032</p>
            <div className="font-mono text-[11px] text-slate-800">Tel: +91 44 6686 7700</div>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
            <h4 className="font-extrabold text-[#003366] text-sm uppercase">Mumbai Hub</h4>
            <p className="text-slate-600">Unit No 1104, DLH Park, S V Road, Goregaon West, Mumbai 400062</p>
            <div className="font-mono text-[11px] text-slate-800">Tel: +91 22 4531 8800</div>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
            <h4 className="font-extrabold text-[#003366] text-sm uppercase">Delhi Sourcing</h4>
            <p className="text-slate-600">904, 9th Floor, International Trade Tower, Nehru Place, New Delhi 110019</p>
            <div className="font-mono text-[11px] text-slate-800">Tel: +91 11 9980 1122</div>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
            <h4 className="font-extrabold text-[#003366] text-sm uppercase">Kolkata Desk</h4>
            <p className="text-slate-600">Unit No 13, 7th Floor, Acropolis Office Complex, Kolkata 700107</p>
            <div className="font-mono text-[11px] text-slate-800">Tel: +91 33 2211 4455</div>
          </div>
        </div>
      </section>

    </div>
  );
}
