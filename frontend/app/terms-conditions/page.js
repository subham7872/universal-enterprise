"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, FileText, CheckCircle2, AlertTriangle, Truck, CreditCard, ArrowLeft } from 'lucide-react';

export default function TermsConditionsPage() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-12 space-y-10 shadow-xs font-sans text-slate-800 max-w-5xl mx-auto">
      
      {/* Top Breadcrumb & Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003366] hover:text-amber-600 uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#003366] text-[#f2cc4d] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest font-mono">
            LEGAL AGREEMENT & B2B TERMS
          </span>
          <span className="text-xs text-slate-400 font-mono">ISO 9001:2015 Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#003366] tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-3xl leading-relaxed">
          These Terms and Conditions govern all commercial quotations, purchase orders, technical verifications, and physical shipments executed by Universal Enterprise.
        </p>
        <p className="text-slate-400 text-xs font-mono">
          Effective Date: August 2026 | Universal Enterprise B2B Commercial Division
        </p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#003366]">
            <Scale className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">1. Commercial Scope & Binding Agreement</h2>
          </div>
          <p>
            By issuing a formal Purchase Order (PO), confirming an online quotation, or accepting delivery of products from Universal Enterprise, the Buyer agrees to be bound by these standard terms. Any modifications requested by the Buyer must be agreed to in writing by an authorized representative of Universal Enterprise.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#003366]">
            <FileText className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">2. Quotation Validity & Pricing</h2>
          </div>
          <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li><strong>Validity Period:</strong> Official price quotations are valid for 15 calendar days from the date of issue, unless otherwise specified in writing due to foreign exchange (Forex) or raw material alloy fluctuations.</li>
            <li><strong>Taxes & Duties:</strong> Unless explicitly noted, all quoted prices are exclusive of applicable Goods & Services Tax (GST 18%), customs clearance fees, and regional transport levies.</li>
            <li><strong>Stock Allotment:</strong> Bearings quoted as "In-Stock" are subject to prior sale until a formal commercial PO or advance deposit is received.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#003366]">
            <CreditCard className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">3. Payment Terms & Billing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <span className="font-bold text-[#003366] text-xs uppercase block mb-1">Standard B2B Terms</span>
              <p className="text-xs text-slate-600">100% advance payment via RTGS / NEFT or approved Letter of Credit (LC) for new clients, non-standard imports, and emergency air shipments.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <span className="font-bold text-[#003366] text-xs uppercase block mb-1">Approved Credit Accounts</span>
              <p className="text-xs text-slate-600">Net 30-day terms are extended solely to verified corporate accounts post credit evaluation, financial review, and formal trade agreement execution.</p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#003366]">
            <Truck className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">4. Dispatch, Freight & Transit Insurance</h2>
          </div>
          <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li><strong>Dispatch Timelines:</strong> Standard catalog inventory is dispatched within 24 to 48 hours of order confirmation. Factory-order and overseas import items are subject to OEM lead times.</li>
            <li><strong>Carrier Liability & Risk:</strong> Title to goods and transit risk transfer to the Buyer upon handover to the designated freight carrier or logistics agent (Ex-Works / FOB Warehouse basis unless otherwise contracted).</li>
            <li><strong>Inspection on Delivery:</strong> The Buyer must inspect all consignments upon receipt and report any outer packaging damage or carton shortage to both the courier and Universal Enterprise within 48 hours.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#003366]">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">5. OEM Genuine Guarantee & Manufacturer Warranty</h2>
          </div>
          <p>
            Universal Enterprise certifies that 100% of bearings supplied are genuine, brand-new products sourced directly through authorized OEM distribution networks (SKF, FAG/INA, NSK, NTN, THK, TIMKEN, NACHI, KOYO).
          </p>
          <div className="bg-amber-50 p-4 rounded border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Warranty Coverage:</strong> Products carry the standard manufacturer warranty against metallurgical and manufacturing defects (typically 12 months from installation or 18 months from supply). Warranty is void in cases of improper mounting, incorrect lubrication, contamination, electrical fluting, or excessive mechanical overload beyond catalog ratings.
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#003366]">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">6. Limitation of Liability</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Under no circumstances shall Universal Enterprise be liable for indirect, incidental, consequential, punitive, or downtime damages arising out of machine stoppage or assembly delays. Our total liability shall not exceed the invoice purchase value of the specific defective bearing item.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 border-t border-slate-200 pt-6">
          <div className="flex items-center gap-2 text-[#003366]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">7. Governing Law & Jurisdiction</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All contracts, purchase agreements, and disputes shall be governed by and construed in accordance with the laws of India, subject to the exclusive jurisdiction of the competent courts in <strong>Bangalore, Karnataka</strong>.
          </p>
          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs font-mono mt-4 space-y-1 text-slate-700">
            <span className="font-bold block text-slate-900 font-sans text-sm">UNIVERSAL ENTERPRISE</span>
            <div>No. 7, 4th Cross, Kalasipalya New Extension, Bangalore – 560002, India</div>
            <div className="text-amber-800 font-bold">GST No.: 29AAGFU1019D1ZF</div>
            <div>Contact: +91 9900726939 / 8123836939 | Email: ue14.email@gmail.com</div>
          </div>
        </section>

      </div>

    </div>
  );
}
