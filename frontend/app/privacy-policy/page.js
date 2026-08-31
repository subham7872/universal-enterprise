"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Mail, Phone, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-12 space-y-10 shadow-xs font-sans text-slate-800 max-w-5xl mx-auto">
      
      {/* Top Breadcrumb & Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003366] hover:text-amber-600 uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#003366] text-[#f2cc4d] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest font-mono">
            COMPLIANCE & DATA SECURITY
          </span>
          <span className="text-xs text-slate-400 font-mono">ISO 9001:2015 Registered</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#003366] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Universal Enterprise is committed to protecting the privacy and confidentiality of our corporate clients, procurement managers, and industrial partners. This policy outlines how your information is collected, processed, and safeguarded.
        </p>
        <p className="text-slate-400 text-xs font-mono">
          Last Updated & Validated: August 2026 | Universal Enterprise Corporate Legal Division
        </p>
      </div>

      {/* Policy Sections */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#003366]">
            <FileText className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">1. Information We Collect</h2>
          </div>
          <p>
            When you request a quotation, register on our CRM Portal, search for obsolete/specialty bearing part numbers, or contact our engineering desk, we collect business and procurement-related information, including:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li><strong>Corporate Identification:</strong> Company name, GSTIN, registered industrial address, and business contact details.</li>
            <li><strong>Procurement Personnel:</strong> Authorized buyer name, department, official email address, and direct phone/WhatsApp numbers.</li>
            <li><strong>Technical Requirements:</strong> Bearing part numbers, CAD specifications, operating parameters, and required quantities.</li>
            <li><strong>Transactional Data:</strong> Purchase orders, delivery consignments, payment histories, and warranty registration logs.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#003366]">
            <Eye className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">2. How We Utilize Your Data</h2>
          </div>
          <p>
            Universal Enterprise utilizes client data solely for industrial supply chain fulfillment and customer support operations:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <span className="font-bold text-[#003366] text-xs uppercase block mb-1">Quote Generation & Order Dispatch</span>
              <p className="text-xs text-slate-600">Calculating real-time OEM pricing, verifying warehouse stock availability, and coordinating insured freight dispatch.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <span className="font-bold text-[#003366] text-xs uppercase block mb-1">Technical Consultation & Interchange</span>
              <p className="text-xs text-slate-600">Providing equivalent bearing interchanges, load calculations, and OEM inspection certificates (MTC 3.1).</p>
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <span className="font-bold text-[#003366] text-xs uppercase block mb-1">Live Shipment Tracking</span>
              <p className="text-xs text-slate-600">Automated tracking status alerts for consignment dispatches, courier docket updates, and delivery confirmations.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <span className="font-bold text-[#003366] text-xs uppercase block mb-1">Statutory Tax & Regulatory Filings</span>
              <p className="text-xs text-slate-600">Generating compliant E-Way bills, E-Invoices, and tax documentation as required under Indian commerce regulations.</p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#003366]">
            <Lock className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">3. Data Security & Storage</h2>
          </div>
          <p>
            We implement enterprise-grade security protocols to protect proprietary engineering drawings, purchase logs, and pricing data:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li><strong>256-Bit SSL Encryption:</strong> All data transmissions across our web portals and API endpoints are encrypted in transit.</li>
            <li><strong>Access Controls:</strong> Client information is restricted strictly to authorized logistics, accounts, and sales representatives under Non-Disclosure Agreements (NDAs).</li>
            <li><strong>No Third-Party Data Sale:</strong> We never sell, rent, or lease client contact lists or purchase histories to marketing agencies or third parties.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#003366]">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">4. Cookie & Analytics Policy</h2>
          </div>
          <p>
            Our web application uses essential cookies to remember session parameters, such as active comparison items, quote basket quantities, and user preferences. Analytical metrics are anonymized to optimize platform performance and speed.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 border-t border-slate-200 pt-6">
          <div className="flex items-center gap-2 text-[#003366]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">5. Contact Our Privacy & Compliance Officer</h2>
          </div>
          <p className="text-xs sm:text-sm">
            For inquiries regarding data protection, updating your corporate registration records, or requesting data removal:
          </p>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
            <div>
              <span className="font-bold text-slate-900 block font-sans text-sm">UNIVERSAL ENTERPRISE — LEGAL & COMPLIANCE</span>
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
