import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Award, Layers } from 'lucide-react';

export const metadata = {
  title: 'FAG Bearings (Schaeffler) Distributor — Universal Enterprise',
  description: 'Authorized supplier of genuine FAG Schaeffler spherical roller bearings (22200, 22300, 23000, 23100, 23200, 24000, 24100 series), cylindrical rollers, and X-life technology.',
};

export default function FagBrandPage() {
  return (
    <div className="space-y-6 font-sans text-slate-800">
      <Link href="/brands" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003366] hover:underline uppercase">
        <ArrowLeft className="w-4 h-4" /> Back to Brands Directory
      </Link>

      <div className="bg-white border-2 border-[#003366] rounded-lg p-8 space-y-6 shadow-xs">
        <div className="border-b pb-4 flex flex-wrap justify-between items-start gap-4">
          <div>
            <span className="text-[10px] bg-[#003366] text-[#f2cc4d] font-bold px-2 py-0.5 rounded uppercase font-mono">
              SCHAEFFLER GROUP GERMANY
            </span>
            <h1 className="text-3xl font-black text-[#003366] uppercase mt-1">FAG Bearings (Schaeffler)</h1>
            <p className="text-slate-500 text-xs mt-0.5">Germany • World-Leading Heavy Industrial & Spherical Roller Technology</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/products?brand=FAG"
              className="bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black text-xs uppercase px-5 py-2.5 rounded shadow-sm"
            >
              Browse All FAG Inventory &rarr;
            </Link>
            <Link
              href="/products?category=Spherical%20Roller%20Bearings"
              className="bg-[#003366] hover:bg-[#002244] text-white font-black text-xs uppercase px-5 py-2.5 rounded shadow-sm"
            >
              Spherical Rollers Catalog &rarr;
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border rounded flex items-start gap-3">
            <Award className="w-6 h-6 text-[#f2cc4d] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs uppercase text-slate-900">X-Life Premium Quality</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Up to 70% longer operational life, improved surface finish, and optimized kinematic geometry.</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border rounded flex items-start gap-3">
            <Layers className="w-6 h-6 text-[#003366] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs uppercase text-slate-900">Self-Aligning Robustness</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Handles extreme shaft deflection, shock loads, and harsh industrial environments seamlessly.</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border rounded flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs uppercase text-slate-900">100% Genuine Certified</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Dispatched with Schaeffler Origin Certificates, full batch traceability, and manufacturer warranty.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
          <p>
            <strong>FAG</strong>, a key brand of the Schaeffler Group, is synonymous with pioneering ball and roller bearing innovation. Universal Enterprise maintains ready stocks of high-capacity FAG Spherical Roller Bearings across standard and extreme heavy-duty series including <strong>22200, 22300, 23000, 23100, 23200, 24000, and 24100</strong>.
          </p>
          <p>
            Available in both cylindrical and tapered bores (1:12 K and 1:30 K30), solid machined brass cages (M, MA, MB), polyamide (TVP, TVPB), and vibrating screen configurations (T41A / VA405), our FAG lineup serves crushing plants, rolling mills, cement manufacturing, continuous casters, and paper mills across India.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded border space-y-3">
          <h3 className="font-bold text-xs uppercase text-[#003366]">Core FAG Series In Stock at Universal Enterprise</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> <strong>24100 & 24000 Series:</strong> 24134-BE-XL-K30, 24128-BE-XL-K30-C3, 24060, 24038</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> <strong>23100 & 23200 Series:</strong> 23136-E1, 23132, 23130, 23128, 23124, 23240, 23244, 23224, 23222</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> <strong>23000 Series:</strong> 23056-BE-XL, 23040, 23038, 23032, 23030, 23024, 23072, 23044</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> <strong>22200 & 22300 Heavy Duty:</strong> 22215, 22216, 22220, 22322-E1A-XL-MA-T41A (Vibrating Screen)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> <strong>Sealed Spherical Series:</strong> 24124-BE-XL-2VSR-H40 with integral contact rubber seals</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> <strong>Single Row Barrel Rollers:</strong> 20213-TVP, 20228-MB, 20312-TVP series</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
