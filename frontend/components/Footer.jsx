import React from 'react';
import Link from 'next/link';
import { 
  Cpu, ShieldCheck, Phone, Mail, MapPin, 
  Facebook, Instagram, Linkedin, Twitter, Youtube, 
  FileText, Shield, RotateCcw, ArrowRight
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t-8 border-[#003366] mt-16 pt-14 pb-8 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
        
        {/* Column 1: Brand Info & Socials */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white rounded flex items-center justify-center border border-[#f2cc4d]">
              <Cpu className="w-6 h-6 text-[#003366] animate-pulse" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white block">UNIVERSAL ENTERPRISE</span>
              <span className="text-[10px] text-[#f2cc4d] font-mono tracking-widest uppercase">Authorized Bearing Distributor</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed font-normal max-w-md">
            Premier Indian stocking distributor of 100% genuine industrial bearings, super precision machine tool spindles, linear motion guides, and heavy spherical units serving automotive, steel, defense, and automation grids.
          </p>

          <div className="flex flex-col gap-1 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#f2cc4d] shrink-0" />
              <span>GST: 29AAGFU1019D1ZF</span>
            </div>
            <div className="flex items-start gap-2 pt-1">
              <MapPin className="w-4 h-4 text-[#f2cc4d] shrink-0 mt-0.5" />
              <span>No. 7, 4th Cross, Kalasipalya New Extension, Bangalore – 560002, India</span>
            </div>
          </div>

          {/* Social Media Channels */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Connect With Us</span>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded bg-slate-800 hover:bg-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition shadow-xs"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded bg-slate-800 hover:bg-[#E4405F] text-slate-300 hover:text-white flex items-center justify-center transition shadow-xs"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/universalenterprise/posts/?feedView=all"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded bg-slate-800 hover:bg-[#0A66C2] text-slate-300 hover:text-white flex items-center justify-center transition shadow-xs"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/universal2332"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="w-8 h-8 rounded bg-slate-800 hover:bg-black text-slate-300 hover:text-white flex items-center justify-center transition shadow-xs border border-slate-700/50"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded bg-slate-800 hover:bg-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition shadow-xs"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Complete Site Navigation (All Pages) */}
        <div className="space-y-3.5 text-xs">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px] font-mono border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#f2cc4d] rounded-full"></span> All Pages & Sections
          </h4>
          <ul className="space-y-2 text-slate-400 font-medium">
            <li>
              <Link href="/" className="hover:text-white hover:underline transition flex items-center gap-1">
                Home Page
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white hover:underline transition flex items-center gap-1">
                Bearing Catalog
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-white hover:underline transition flex items-center gap-1">
                Categories Directory
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white hover:underline transition flex items-center gap-1">
                Services & Specs Compare
              </Link>
            </li>
            <li>
              <Link href="/brands" className="hover:text-white hover:underline transition flex items-center gap-1">
                Authorized OEM Brands
              </Link>
            </li>
            <li>
              <Link href="/tracking" className="hover:text-white hover:underline transition flex items-center gap-1">
                Order & Sourcing Tracker
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white hover:underline transition flex items-center gap-1">
                About Universal Enterprise
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white hover:underline transition flex items-center gap-1">
                Contact & Warehouse Hubs
              </Link>
            </li>
            <li>
              <Link href="/crm" className="hover:text-[#f2cc4d] hover:underline transition flex items-center gap-1 font-bold text-slate-300">
                B2B CRM Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Corporate Policies & Terms */}
        <div className="space-y-3.5 text-xs">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px] font-mono border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#f2cc4d] rounded-full"></span> Legal & Policies
          </h4>
          <ul className="space-y-2.5 text-slate-400 font-medium">
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition flex items-start gap-1.5 group">
                <Shield className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0 group-hover:scale-110 transition" />
                <span>Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="hover:text-white transition flex items-start gap-1.5 group">
                <FileText className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0 group-hover:scale-110 transition" />
                <span>Terms & Conditions</span>
              </Link>
            </li>
            <li>
              <Link href="/return-exchange-policy" className="hover:text-white transition flex items-start gap-1.5 group">
                <RotateCcw className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0 group-hover:scale-110 transition" />
                <span>Return & Exchange Policy</span>
              </Link>
            </li>
          </ul>

          <div className="pt-3 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
            <span className="font-bold text-slate-300 block font-mono text-[10px] uppercase">Corporate Sourcing Desk</span>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#f2cc4d]" />
              <a href="tel:+919900726939" className="hover:text-white transition">+91 9900726939 / 8123836939</a>
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#f2cc4d]" />
              <a href="mailto:ue14.email@gmail.com" className="hover:text-white transition">ue14.email@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Column 4: Warehouse Dispatch Feed */}
        <div className="space-y-3.5 text-xs">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px] font-mono border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#f2cc4d] rounded-full"></span> Warehouse Feed
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Subscribe for daily dispatch logs, surplus warehouse allotments, and rare spindle part notifications.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Universal Enterprise Dispatch Feed.'); }} className="space-y-2 pt-1">
            <input
              type="email"
              required
              className="p-2.5 w-full text-xs bg-slate-900 border border-slate-700 text-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#f2cc4d]"
              placeholder="procurement@company.com"
            />
            <button
              type="submit"
              className="w-full bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black text-xs uppercase py-2 rounded transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              Subscribe To Feed <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Bar: Copyright & Compliance */}
      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-6 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono select-none">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-center sm:text-left">
          <span>© 2026 UNIVERSAL ENTERPRISE. All Rights Reserved.</span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <Link href="/privacy-policy" className="hover:text-slate-300 underline">Privacy</Link>
          <Link href="/terms-conditions" className="hover:text-slate-300 underline">Terms</Link>
          <Link href="/return-exchange-policy" className="hover:text-slate-300 underline">Returns</Link>
        </div>
        <span className="text-[#f2cc4d] font-bold">100% Genuine Certified Industrial Bearings</span>
      </div>
    </footer>
  );
}
