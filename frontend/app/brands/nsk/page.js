import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'NSK Bearings Distributor — Universal Enterprise',
  description: 'Authorized NSK supplier for machine tool spindle bearings, linear motion guides, and deep groove ball bearings.',
};

export default function NskBrandPage() {
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
            <h1 className="text-3xl font-black text-[#003366] uppercase mt-1">NSK Precision Bearings</h1>
            <p className="text-slate-500 text-xs mt-0.5">Japan • Global Leader in Motion & Control Technology</p>
          </div>
          <Link
            href="/products?brand=NSK"
            className="bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black text-xs uppercase px-5 py-2.5 rounded shadow-sm"
          >
            Filter All NSK Parts &rarr;
          </Link>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
          <p>
            NSK Ltd. is one of the world&apos;s leading manufacturers of motion and control products, renowned for high-speed machine tool spindle bearings, extra-thin radial bearings, and rugged automotive transmission assemblies.
          </p>
          <p>
            Universal Enterprise delivers 100% genuine NSK inventory with factory inspection certificates, ensuring dimensional accuracies up to P3/P4 super-precision grades.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded border space-y-3">
          <h3 className="font-bold text-xs uppercase text-[#003366]">Core NSK Sourcing Portfolio</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Super Precision Angular Contact Spindle Bearings</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> High-Carbon Chrome Deep Groove Bearings (6000, 6200, 6300)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Self-Aligning Double Row Ball Bearings</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> LH / LS Series Linear Guides & Rails</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
