"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Layers, Truck, Cpu, Coins, Globe, 
  Settings, ChevronLeft, ChevronRight, CheckCircle2, UserCheck, 
  ArrowRight, Landmark, HardHat, Factory, Soup, Car, Scissors, Archive
} from 'lucide-react';

export default function PremiumHomeAdditions() {
  const brands = [
    'FAG', 'INA', 'SKF', 'NSK', 'NTN', 'TIMKEN', 
    'KOYO', 'IKO', 'NACHI', 'THK', 'HIWIN', 'SCHAEFFLER'
  ];

  const marqueeBrands = [...brands, ...brands, ...brands];

  const industries = [
    {
      name: 'Manufacturing Plants',
      icon: <Factory className="w-5 h-5 text-[#f2cc4d]" />,
      desc: 'Optimized high-speed spindles and guide systems for continuous conveyor operations.'
    },
    {
      name: 'Steel Industry',
      icon: <Landmark className="w-5 h-5 text-[#f2cc4d]" />,
      desc: 'Heavy-duty spherical and cylindrical rollers engineering extreme temperature limits.'
    },
    {
      name: 'Mining Industry',
      icon: <HardHat className="w-5 h-5 text-[#f2cc4d]" />,
      desc: 'Sturdy bearing shields protecting core mechanics from high-vibrating dust grids.'
    },
    {
      name: 'Cement Industry',
      icon: <Settings className="w-5 h-5 text-[#f2cc4d]" />,
      desc: 'High-torque split pillow blocks for large rotatory kilns and separator systems.'
    },
    {
      name: 'Food Processing',
      icon: <Soup className="w-5 h-5 text-[#f2cc4d]" />,
      desc: 'Sanitary stainless-steel housed units loaded with chemical-resistant food-grade grease.'
    },
    {
      name: 'Automotive Assemblies',
      icon: <Car className="w-5 h-5 text-[#f2cc4d]" />,
      desc: 'Generation II integrated wheel hub bearings with magnetic sensor encoders.'
    }
  ];

  return (
    <div className="space-y-12 py-6 font-sans text-slate-800">
      
      {/* 1. Infinite Brands Marquee */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-2xs overflow-hidden">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="text-xs font-black uppercase text-[#003366] tracking-widest flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#f2cc4d]" />
            Authorized Global Motion Brands
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">100% Genuine Guaranteed</span>
        </div>

        <div className="relative w-full overflow-hidden flex whitespace-nowrap py-2">
          <div className="flex gap-4 animate-marquee">
            {marqueeBrands.map((bName, bIdx) => (
              <Link
                key={bIdx}
                href={`/products?brand=${bName}`}
                className="bg-slate-50 border border-slate-200 hover:border-[#003366] text-slate-800 hover:text-[#003366] px-5 py-2.5 rounded font-black text-xs uppercase tracking-wider transition shadow-2xs"
              >
                {bName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Industries Grid */}
      <section className="bg-[#001f3f] text-white rounded-lg p-6 sm:p-10 space-y-6">
        <div className="border-b border-slate-700 pb-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] bg-[#f2cc4d] text-slate-950 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              HEAVY INDUSTRIAL SECTORS
            </span>
            <h3 className="text-2xl font-black uppercase tracking-tight mt-1 text-white">
              Sectors Powered by Universal Enterprise
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((ind, i) => (
            <div key={i} className="bg-[#003366]/60 p-5 rounded border border-slate-700/80 space-y-2 hover:border-[#f2cc4d] transition">
              <div className="flex items-center gap-2">
                {ind.icon}
                <h4 className="text-sm font-extrabold text-white">{ind.name}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{ind.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
