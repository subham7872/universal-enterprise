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
          <div className="bg-slate-50 p-4 rounded border-2 border-[#003366] space-y-2">
            <span className="text-[9px] bg-[#f2cc4d] text-slate-950 font-bold px-1.5 py-0.5 rounded font-mono uppercase">Head Office</span>
            <h4 className="font-extrabold text-[#003366] text-sm uppercase">Bangalore HQ</h4>
            <p className="text-slate-600">No. 7, 4th Cross, Kalasipalya New Extension, Bangalore – 560002, India</p>
            <div className="text-[10px] text-amber-800 font-mono font-bold">GST: 29AAGFU1019D1ZF</div>
            <div className="font-mono text-[11px] text-slate-900 font-bold pt-1">Tel: +91 9900726939 / 8123836939</div>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
            <h4 className="font-extrabold text-[#003366] text-sm uppercase">Mumbai Hub</h4>
            <p className="text-slate-600">Unit No 1104, DLH Park, S V Road, Goregaon West, Mumbai 400062</p>
            <div className="font-mono text-[11px] text-slate-800">Tel: +91 9900726939</div>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
            <h4 className="font-extrabold text-[#003366] text-sm uppercase">Delhi Sourcing</h4>
            <p className="text-slate-600">904, 9th Floor, International Trade Tower, Nehru Place, New Delhi 110019</p>
            <div className="font-mono text-[11px] text-slate-800">Tel: +91 9900726939</div>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
            <h4 className="font-extrabold text-[#003366] text-sm uppercase">Chennai Desk</h4>
            <p className="text-slate-600">Mount Road, Guindy Industrial Estate, Chennai 600032</p>
            <div className="font-mono text-[11px] text-slate-800">Tel: +91 9900726939</div>
          </div>
        </div>
      </section>

    </div>
  );
}
