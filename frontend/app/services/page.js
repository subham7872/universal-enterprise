"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Wrench, ShieldCheck, Truck, Cpu, Layers, Activity } from 'lucide-react';
import PremiumServicesAdditions from '../../components/PremiumServicesAdditions';
import CompareSpecsPage from '../../components/CompareSpecsPage';
import { useApp } from '../../components/AppClientWrapper';

export default function ServicesPage() {
  const { compareItems, setCompareItems, toggleCompare, addToQuote, setSelectedProduct } = useApp();

  const services = [
    {
      title: 'Precision Bearing Sourcing',
      desc: 'Sourcing standard deep groove, angular contact, and cylindrical bearings directly from authorized vaults.'
    },
    {
      title: 'Obsolete & Vintage Parts Desk',
      desc: 'Specializing in sourcing rare, legacy, or discontinued metric sizes globally across Sweden, Germany, and Japan.'
    },
    {
      title: 'Engineering Consultations',
      desc: 'Access to Senior Engineers for load rating calculators, clearance class choices (C3, C2), and vibration testing.'
    },
    {
      title: 'OEM Bulk Procurement Plans',
      desc: 'Custom wholesale pricing mapped for rolling mills, heavy steel plants, and conveyor manufacturers.'
    },
    {
      title: 'Rapid Air Express Dispatch',
      desc: 'Fast 24-hour cargo dispatch corridors serving Chennai, Mumbai, Delhi, Kolkata, and industrial clusters.'
    },
    {
      title: 'On-Site Diagnostics & Grease Analysis',
      desc: 'Expert recommendations for high-temperature grease schedules and laser assembly guidelines.'
    }
  ];

  return (
    <div className="space-y-8 font-sans text-slate-800">
      {/* 1. Header Banner */}
      <div className="bg-[#003366] text-white p-8 rounded-lg border-b-4 border-[#f2cc4d] space-y-2">
        <span className="text-[10px] bg-[#f2cc4d] text-slate-950 font-bold px-2 py-0.5 rounded uppercase font-mono">
          ENGINEERING & LOGISTICS CAPABILITIES
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
          Premium Sourcing & Engineering Services
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-normal">
          Universal Enterprise streamlines industrial procurement pipelines certified by origin specialists.
        </p>
      </div>

      {/* 2. Primary Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((serv, idx) => (
          <div key={idx} className="bg-white border rounded-lg p-5 flex flex-col justify-between hover:border-[#003366] transition shadow-2xs">
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-base">{serv.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{serv.desc}</p>
            </div>
            <Link
              href="/contact"
              className="mt-4 text-xs font-bold text-[#003366] hover:underline flex items-center gap-1"
            >
              Open Inquiry <ArrowRight className="w-3.5 h-3.5 text-[#f2cc4d]" />
            </Link>
          </div>
        ))}
      </div>

      {/* 3. Specialized Capabilities Addition */}
      <PremiumServicesAdditions />

      {/* 4. Interactive Bearing Specs Comparison Desk Section */}
      <section id="compare-desk" className="space-y-4">
        <CompareSpecsPage
          compareItems={compareItems}
          onRemoveItem={(item) => toggleCompare(item)}
          onClearAll={() => setCompareItems([])}
          onAddToQuote={(item) => addToQuote(item)}
          onViewDetails={(item) => setSelectedProduct(item)}
        />
      </section>
    </div>
  );
}
