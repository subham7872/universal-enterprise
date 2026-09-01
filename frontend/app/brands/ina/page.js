import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Award, Layers } from 'lucide-react';

export const metadata = {
  title: 'INA Bearings (Schaeffler) Distributor — Universal Enterprise',
  description: 'Authorized supplier of genuine INA Schaeffler needle roller bearings, radial cage assemblies (K-series), drawn cup bearings (HK/BK), combined units (ZARN/ZARF), and precision inner rings.',
};

export default function InaBrandPage() {
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
            <h1 className="text-3xl font-black text-[#003366] uppercase mt-1">INA Bearings (Schaeffler)</h1>
            <p className="text-slate-500 text-xs mt-0.5">Germany • Global Leader in Needle Roller Bearings & Linear Technologies</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/products?brand=INA"
              className="bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black text-xs uppercase px-5 py-2.5 rounded shadow-sm"
            >
              Browse All INA Inventory &rarr;
            </Link>
            <Link
              href="/products?category=Needle%20Roller%20And%20Cage%20Assemblies"
              className="bg-[#003366] hover:bg-[#002244] text-white font-black text-xs uppercase px-5 py-2.5 rounded shadow-sm"
            >
              Needle & Cage Catalog &rarr;
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border rounded flex items-start gap-3">
            <Award className="w-6 h-6 text-[#f2cc4d] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs uppercase text-slate-900">Needle Technology Pioneer</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">The inventor of the modern caged needle roller bearing with unmatched compact load capacity.</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border rounded flex items-start gap-3">
            <Layers className="w-6 h-6 text-[#003366] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs uppercase text-slate-900">Extensive Series Stock</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">K-series, HK/BK drawn cups, NA/RNA machined rings, ZARN screw drive, and IR precision rings.</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border rounded flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs uppercase text-slate-900">100% Genuine Certified</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Directly sourced with Schaeffler origin verification and full engineering traceability.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
          <p>
            <strong>INA</strong>, part of the Schaeffler Group, developed the caged needle roller bearing in 1949 and remains the premier global standard for extreme load capacity in ultra-compact design envelopes. Universal Enterprise stocks hundreds of genuine INA needle roller and cage assemblies, drawn cup bearings, one-way clutch units, and combined axial-radial bearings.
          </p>
          <p>
            Our INA portfolio serves automotive powertrains, machine tool ball screw drives, planetary gearboxes, textile machinery, and high-frequency robotics across India.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded border space-y-3">
          <h3 className="font-bold text-xs uppercase text-[#003366]">Core INA Ranges In Stock at Universal Enterprise</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> <strong>Radial Needle & Cage Assemblies:</strong> K20X26X12, K38X46X20, K170X180X46, K305X325X55</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> <strong>Drawn Cup Needle Bearings:</strong> HK0408, HK1014-2RS, HK1216, HK2020, HK3516, HK4020, HK5520, BK5020</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> <strong>Machined Needle Roller Units:</strong> NA4900, NA4912-XL, NA4926, NA6910-ZW, RNA4902-2RSR, RNA6907-ZW</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> <strong>Screw Drive Precision Bearings:</strong> ZARN3570, ZARN4090, ZARN50110, ZARN70130, ZARF40115, ZARF45105</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> <strong>One-Way Roller Clutches:</strong> HF3020-L564, HFL1226-L564, HFL1826-L564, HFL0615-KF</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> <strong>Precision Inner Rings:</strong> IR12X15, IR25X30, IR40X45, IR70X80, IR90X100, IR110X125, IR300X330</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
