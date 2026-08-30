import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Globe } from 'lucide-react';

export const metadata = {
  title: 'Authorized Global Bearing Brands — Universal Enterprise',
  description: 'Authorized distributor of NSK, THK, NTN, SKF, FAG, and Timken bearings.',
};

export default function BrandsIndexPage() {
  const brands = [
    {
      slug: 'nsk',
      name: 'NSK',
      country: 'Japan',
      tagline: 'World Leader in Motion & Control',
      desc: 'High-precision deep groove ball bearings, super precision machine tool spindles, and linear guides.',
      series: ['7000 Series Spindles', 'Deep Groove 6200/6300', 'LH Linear Guides']
    },
    {
      slug: 'thk',
      name: 'THK',
      country: 'Japan',
      tagline: 'Pioneers of Linear Motion Systems',
      desc: 'Advanced LM guides, ground ball screws, cam followers, and caged ball technologies.',
      series: ['HSR Series LM Guides', 'BNK Ground Ball Screws', 'Cam Followers']
    },
    {
      slug: 'ntn',
      name: 'NTN',
      country: 'Japan',
      tagline: 'Precision Bearings with High Thermal Limits',
      desc: 'Extensive thin section deep groove ball bearings (16001 - 16032) and spherical roller units.',
      series: ['16001 - 16032 Series', 'Pillow Block Units', 'Tapered Rollers']
    },
    {
      slug: 'fag',
      name: 'FAG / INA',
      country: 'Germany',
      tagline: 'Schaeffler High Load Engineering',
      desc: 'German precision engineered generation C bearings, needle rollers, and hydraulic dismounting pullers.',
      series: ['Generation C Deep Groove', 'Needle Rollers', 'Arcanol Greases']
    }
  ];

  return (
    <div className="space-y-8 font-sans text-slate-800">
      <div className="bg-[#003366] text-white p-8 rounded-lg border-b-4 border-[#f2cc4d] space-y-2">
        <span className="text-[10px] bg-[#f2cc4d] text-slate-950 font-bold px-2 py-0.5 rounded uppercase font-mono">
          OEM AUTHORIZED PARTNERSHIPS
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
          Authorized Global Power Brands
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-normal">
          Direct sourcing channels ensuring 100% genuine factory certification, OEM warranties, and verifiable tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {brands.map((b) => (
          <div key={b.slug} className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#003366] transition">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-2xl font-black text-[#003366]">{b.name}</span>
                  <span className="block text-xs font-bold text-amber-600 mt-0.5">{b.tagline}</span>
                </div>
                <span className="bg-slate-100 font-mono text-[10px] font-bold px-2 py-0.5 rounded border text-slate-700">
                  {b.country}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">{b.desc}</p>

              <div className="mt-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Featured Series</span>
                <div className="flex flex-wrap gap-1.5">
                  {b.series.map((s, idx) => (
                    <span key={idx} className="bg-slate-50 border text-slate-700 text-[11px] font-mono px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex gap-2">
              <Link
                href={`/brands/${b.slug}`}
                className="flex-1 bg-[#003366] hover:bg-[#002244] text-white text-center py-2 rounded text-xs font-bold uppercase transition"
              >
                Brand Profile
              </Link>
              <Link
                href={`/products?brand=${b.name}`}
                className="flex-1 bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 text-center py-2 rounded text-xs font-black uppercase transition"
              >
                Browse {b.name} Catalog
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
