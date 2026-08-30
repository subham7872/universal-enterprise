import React from 'react';
import Link from 'next/link';
import { Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t-8 border-[#003366] mt-16 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo brand info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-[#f2cc4d] animate-pulse" />
            <span className="text-xl font-black tracking-tight text-white">UNIVERSAL ENTERPRISE</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            Trusted corporate distributor of genuine high-performance bearings, rollers and linear motion assemblies serving heavy industrial mills, auto structures, and automation grids.
          </p>
          <div className="flex gap-3 text-white">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="p-1 px-2 text-xs bg-slate-800 rounded hover:bg-[#f2cc4d] hover:text-slate-900 transition">LinkedIn</a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="p-1 px-2 text-xs bg-slate-800 rounded hover:bg-[#f2cc4d] hover:text-slate-900 transition">Facebook</a>
            <a href="https://api.whatsapp.com/send?phone=+914466867700" target="_blank" rel="noreferrer" className="p-1 px-2 text-xs bg-slate-800 rounded hover:bg-green-600 transition">WhatsApp</a>
          </div>
        </div>

        {/* Catalog index lists */}
        <div className="space-y-3.5 text-xs">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Primary Catalog Range</h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/products?category=Deep+Groove" className="hover:text-white transition">Deep Groove Ball Bearings (16001 - 16032)</Link></li>
            <li><Link href="/products?category=Angular+Contact" className="hover:text-white transition">Angular Contact Ball Guides</Link></li>
            <li><Link href="/products?brand=THK" className="hover:text-white transition">THK Linear Rails & LM Systems</Link></li>
            <li><Link href="/products?category=Pillow+Block" className="hover:text-white transition">Pillow Block Cast Housings</Link></li>
            <li><Link href="/products?brand=NSK" className="hover:text-white transition">NSK Machine Spindle Bearings</Link></li>
          </ul>
        </div>

        {/* Quick tabs */}
        <div className="space-y-3.5 text-xs">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Sourcing Links</h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/products" className="hover:text-white transition">In-stock Bearings List</Link></li>
            <li><Link href="/brands" className="hover:text-white transition">Authorized Power Brands</Link></li>
            <li><Link href="/services" className="hover:text-white transition">Engineering Services</Link></li>
            <li><Link href="/about" className="hover:text-white transition">About Corporate</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact & Hub Locations</Link></li>
            <li><Link href="/crm" className="hover:text-white transition">CRM Portal</Link></li>
          </ul>
        </div>

        {/* Email Newsletter */}
        <div className="space-y-3.5 text-xs">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Warehouse Dispatch Feed</h4>
          <p className="text-slate-400 leading-normal">
            Subscribe to obsolete parts and bulk warehouse allotment alerts.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Universal Enterprise Dispatch Feed.'); }} className="flex gap-1 pt-1.5">
            <input
              type="email"
              required
              className="p-2 w-full text-xs bg-slate-950 border border-slate-700 text-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f2cc4d]"
              placeholder="procurement@company.com"
            />
            <button
              type="submit"
              className="bg-[#f2cc4d] text-slate-900 font-extrabold px-3 py-1.5 rounded hover:bg-[#e9c540] transition cursor-pointer"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500 flex flex-wrap justify-between gap-4 font-mono select-none">
        <span>© 2026 UNIVERSAL ENTERPRISE. All Rights Reserved. Authorized Distributor.</span>
        <span className="text-[#f2cc4d]">Precision Bearings. Trusted Industrial Solutions.</span>
      </div>
    </footer>
  );
}
