"use client";

import React from 'react';
import Link from 'next/link';
import { RotateCcw, PackageCheck, AlertCircle, CheckCircle2, ShieldCheck, Mail, Phone, ArrowLeft, Clock } from 'lucide-react';

export default function ReturnExchangePolicyPage() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-12 space-y-10 shadow-xs font-sans text-slate-800 max-w-5xl mx-auto">
      
      {/* Top Breadcrumb & Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003366] hover:text-amber-600 uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#003366] text-[#f2cc4d] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest font-mono">
            RMA & REPLACEMENT PROTOCOL
          </span>
          <span className="text-xs text-slate-400 font-mono">30-Day B2B Assurance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#003366] tracking-tight">
          Return & Exchange Policy
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-3xl leading-relaxed">
          At Universal Enterprise, customer satisfaction and precision engineering conformance are paramount. We maintain a transparent Return Merchandise Authorization (RMA) process for standard stock bearings and components.
        </p>
        <p className="text-slate-400 text-xs font-mono">
          Last Updated: August 2026 | Universal Enterprise Quality Control Desk
        </p>
      </div>

      {/* Return Policy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg text-center space-y-2">
          <div className="w-10 h-10 bg-[#003366] text-[#f2cc4d] rounded-full mx-auto flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <span className="font-black text-slate-900 text-sm uppercase block">30-Day Window</span>
          <p className="text-xs text-slate-600 leading-normal">Eligible standard catalog products may be returned or exchanged within 30 days of invoice receipt.</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg text-center space-y-2">
          <div className="w-10 h-10 bg-[#003366] text-[#f2cc4d] rounded-full mx-auto flex items-center justify-center font-bold">
            <PackageCheck className="w-5 h-5" />
          </div>
          <span className="font-black text-slate-900 text-sm uppercase block">Original Factory Box</span>
          <p className="text-xs text-slate-600 leading-normal">Bearings must remain unopened in original OEM anti-rust grease packaging with undamaged barcode labels.</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg text-center space-y-2">
          <div className="w-10 h-10 bg-[#003366] text-[#f2cc4d] rounded-full mx-auto flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-black text-slate-900 text-sm uppercase block">100% Replacement Guarantee</span>
          <p className="text-xs text-slate-600 leading-normal">Immediate direct replacement provided in the event of dimensional mismatch or verified transit damage.</p>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#003366]">
            <PackageCheck className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">1. Eligibility Criteria for Returns & Exchanges</h2>
          </div>
          <p>
            To qualify for a standard return, exchange, or credit note, returned consignments must satisfy the following conditions:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li><strong>Unused & Unmounted Condition:</strong> The bearing has not been installed, mounted on a shaft, lubricated with external grease, or subjected to trial running.</li>
            <li><strong>Intact OEM Packaging:</strong> The original factory individual box, protective VCI anti-corrosion plastic wrap, holographic authentication seals, and serial barcodes must be intact and free from writing or tears.</li>
            <li><strong>Document Verification:</strong> Must be accompanied by a copy of the original Universal Enterprise Tax Invoice and RMA authorization docket.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#003366]">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">2. Non-Returnable Products</h2>
          </div>
          <p>The following items are strictly non-cancellable and non-returnable (NCNR):</p>
          <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li>Custom-machined linear guide rails cut to custom millimeter lengths per client drawing.</li>
            <li>Specialty indent import bearings air-freighted specifically for a customer from overseas factories.</li>
            <li>Opened grease cartridges, paste tubes, and chemical lubricants where security seals have been broken.</li>
            <li>Bearings showing signs of contamination, moisture exposure, corrosion, or mechanical hammering.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#003366]">
            <RotateCcw className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">3. Step-by-Step Return Process (RMA)</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-[#003366] text-[#f2cc4d] font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-xs uppercase text-[#003366] block">Submit RMA Request</strong>
                <p className="text-xs text-slate-600">Email support@ntnbearing.in or contact your dedicated account manager with the Invoice Number, Part Number, and reason for return.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-[#003366] text-[#f2cc4d] font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-xs uppercase text-[#003366] block">Receive RMA Number & Dispatch Instructions</strong>
                <p className="text-xs text-slate-600">Our logistics team will issue an RMA Docket Number and provide insured reverse pickup or designated warehouse return address details.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-[#003366] text-[#f2cc4d] font-bold text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-xs uppercase text-[#003366] block">Quality Inspection & Resolution</strong>
                <p className="text-xs text-slate-600">Upon receipt at our central warehouse, goods undergo dimensional & metallurgical QC inspection. Approved exchanges are dispatched within 2 business days; refunds / GST credit notes are processed within 5 working days.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-slate-200 pt-6">
          <div className="flex items-center gap-2 text-[#003366]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">4. RMA Support & Warehouse Hub</h2>
          </div>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
            <div>
              <span className="font-bold text-slate-900 block font-sans text-sm">UNIVERSAL ENTERPRISE — CENTRAL RETURNS HUB</span>
              <span className="text-slate-600 block">No. 7, 4th Cross, Kalasipalya New Extension, Bangalore – 560002, India</span>
              <span className="text-amber-800 font-bold block mt-1">GST: 29AAGFU1019D1ZF</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:ue14.email@gmail.com" className="flex items-center gap-1.5 text-[#003366] font-bold hover:underline">
                <Mail className="w-4 h-4 text-amber-500" /> ue14.email@gmail.com
              </a>
              <a href="tel:+919900726939" className="flex items-center gap-1.5 text-[#003366] font-bold hover:underline">
                <Phone className="w-4 h-4 text-amber-500" /> +91 9900726939 / 8123836939
              </a>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
