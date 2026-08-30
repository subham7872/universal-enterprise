import React from 'react';
import { CheckCircle2, ShieldCheck, Award, Building, Globe } from 'lucide-react';
import PremiumAboutAdditions from '../../components/PremiumAboutAdditions';

export const metadata = {
  title: 'About Universal Enterprise — ISO 9001:2015 Certified Distributor',
  description: 'Learn about Universal Enterprise, trusted distributor of precision motion solutions and bearings across Asia.',
};

export default function AboutPage() {
  return (
    <div className="space-y-8 font-sans text-slate-800">
      
      <div className="bg-[#003366] text-white p-8 rounded-lg border-b-4 border-[#f2cc4d] space-y-2">
        <span className="text-[10px] bg-[#f2cc4d] text-slate-950 font-bold px-2 py-0.5 rounded uppercase font-mono">
          CORPORATE BENCHMARK
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
          About Universal Enterprise
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-normal">
          Establishing precision bearing benchmarks through decades of certified distribution across Asia.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-xl font-black text-[#003366] uppercase">
              Distributing confidence with absolute genuine credentials
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              UNIVERSAL ENTERPRISE (https://www.ue-asia.com) is a certified distributor specializing in high-performance bearings, linear motion guides, ball screws, and companion motion components from trusted international manufacturers. We operate across vital manufacturing corridors, acting as sole authorized sourcing nodes for steel mills, automotive assembly plants, automation grids, and textile sectors.
            </p>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#003366]/5 p-3 rounded border border-[#003366]/10">
                <span className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider">Mission Statement</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block leading-normal">
                  Safeguard machine uptime with 100% genuine guaranteed bearings.
                </span>
              </div>
              <div className="bg-amber-400/10 p-3 rounded border border-amber-400/20">
                <span className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider">Core Vision</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block leading-normal">
                  To represent the most reliable, frictionless industrial motion distribution network in Asia.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-lg border space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#003366]">
              Why Choose Universal Enterprise?
            </h3>
            <ul className="text-xs space-y-3 font-medium text-slate-700">
              {[
                { title: 'Genuine Certified Origin', d: 'Direct factory documentation ensuring zero counterfeit risk.' },
                { title: 'Wholesale OEM Price Schedules', d: 'Custom quote discounts mapped for batch size volumes.' },
                { title: 'Senior Sourcing Engineers', d: 'We verify bore diameters, clearance classes, and CAD templates.' },
                { title: 'Secure 24hr Pipeline', d: 'Air cargo corridors serving Chennai, Mumbai, Delhi, and Kolkata hubs.' }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">{item.title}</strong>
                    <span className="text-slate-500 font-normal leading-relaxed text-[11px]">{item.d}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <PremiumAboutAdditions />
    </div>
  );
}
