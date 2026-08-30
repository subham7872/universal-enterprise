"use client";

import React from 'react';
import Link from 'next/link';
import { Wrench, Compass, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PremiumServicesAdditions() {
  return (
    <div className="space-y-8 font-sans text-slate-800">
      
      {/* Sourcing Desk Services */}
      <section className="bg-slate-900 text-white rounded-lg p-6 sm:p-10 space-y-6">
        <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
          <div>
            <span className="text-[10px] bg-[#f2cc4d] text-slate-950 font-bold px-2 py-0.5 rounded uppercase font-mono">
              SPECIALIZED CAPABILITIES
            </span>
            <h3 className="text-xl font-black uppercase text-white mt-1">
              Custom Engineering & Hard-to-Find Bearing Sourcing
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-slate-800/80 p-5 rounded border border-slate-700 space-y-3">
            <h4 className="text-sm font-bold text-[#f2cc4d]">Obsolete & Non-Standard Metric Sourcing</h4>
            <p className="text-slate-300 leading-relaxed">
              When vintage or foreign-imported production machinery halts due to obsolete part numbers, our global network cross-references dimensional profiles with certified replacements across Japan and Europe.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-1 text-[#f2cc4d] font-bold hover:underline">
              Submit Obsolete Part Code &rarr;
            </Link>
          </div>

          <div className="bg-slate-800/80 p-5 rounded border border-slate-700 space-y-3">
            <h4 className="text-sm font-bold text-[#f2cc4d]">CAD Spec Verification & Load Calculating</h4>
            <p className="text-slate-300 leading-relaxed">
              Our Senior Sourcing Engineers verify dynamic load limits ($C$), static ratings ($C_0$), and radial internal clearance classes ($C_2$, $C_3$, $C_4$) to prevent premature fatigue failure.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-1 text-[#f2cc4d] font-bold hover:underline">
              Request Technical Consultation &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
