import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'NTN Bearings Distributor — Universal Enterprise',
  description: 'Authorized supplier of NTN deep groove ball bearings (16001 - 16032), spherical rollers, and pillow blocks.',
};

export default function NtnBrandPage() {
  return (
    <div className="space-y-6 font-sans text-slate-800">
      <Link href="/brands" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003366] hover:underline uppercase">
        <ArrowLeft className="w-4 h-4" /> Back to Brands Directory
      </Link>

      <div className="bg-white border-2 border-[#003366] rounded-lg p-8 space-y-6 shadow-xs">
        <div className="border-b pb-4 flex flex-wrap justify-between items-start gap-4">
          <div>
            <span className="text-[10px] bg-[#003366] text-[#f2cc4d] font-bold px-2 py-0.5 rounded uppercase font-mono">
              AUTHORIZED DISTRIBUTOR
            </span>
            <h1 className="text-3xl font-black text-[#003366] uppercase mt-1">NTN Bearings Corp</h1>
            <p className="text-slate-500 text-xs mt-0.5">Japan • Precision Engineered Bearings for Extreme Load Capacities</p>
          </div>
          <Link
            href="/products?brand=NTN"
            className="bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black text-xs uppercase px-5 py-2.5 rounded shadow-sm"
          >
            Filter All NTN Parts &rarr;
          </Link>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
          <p>
            NTN Corporation is a world leader in high-performance bearings, velocity joints, and precision machinery equipment. Universal Enterprise maintains ready stocks of the popular 16001JRX through 16032 thin radial series and heavy spherical roller units.
          </p>
          <p>
            With authorized direct routing corridors, NTN inventory dispatched by our team provides maximum thermal reliability and long-life seals.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded border space-y-3">
          <h3 className="font-bold text-xs uppercase text-[#003366]">Core NTN Range In Stock</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Deep Groove Ball Bearings (16001JRX to 16032)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Spherical Roller Bearings for Steel Mills</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cast Iron Flanged Pillow Block Units</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tapered Roller Bearings for Automotive Axles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
