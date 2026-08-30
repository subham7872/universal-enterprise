import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'THK Linear Motion Distributor — Universal Enterprise',
  description: 'Authorized supplier of THK LM guides, ground ball screws, and precision linear actuators.',
};

export default function ThkBrandPage() {
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
            <h1 className="text-3xl font-black text-[#003366] uppercase mt-1">THK Linear Motion Guides</h1>
            <p className="text-slate-500 text-xs mt-0.5">Japan • Global Pioneer in Linear Motion (LM) Systems</p>
          </div>
          <Link
            href="/products?brand=THK"
            className="bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black text-xs uppercase px-5 py-2.5 rounded shadow-sm"
          >
            Filter All THK Parts &rarr;
          </Link>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
          <p>
            THK pioneered the world&apos;s first commercial Linear Motion (LM) Guide mechanism, enabling high-precision, high-speed, and energy-saving linear motion in machine tools and automated factory equipment.
          </p>
          <p>
            Universal Enterprise sources HSR, SHS, and SSR series LM guide assemblies and precision ground ball screws directly for high-accuracy robotic cells.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded border space-y-3">
          <h3 className="font-bold text-xs uppercase text-[#003366]">Key THK Products Sourced</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> HSR Heavy Load LM Guides & Carriages</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> BNK Ground Precision Ball Screws</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cross Roller Rings & Cam Followers</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Caged Ball Linear Bushings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
