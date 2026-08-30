"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Phone, Mail, ShoppingCart, Cpu, Menu, X } from 'lucide-react';

export default function Header({ quoteCount = 0, onOpenQuote }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/compare', label: 'Compare' },
    { href: '/tracking', label: 'Tracker' },
    { href: '/brands', label: 'Brands' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/crm', label: 'CRM Portal' },
  ];

  return (
    <header className="w-full bg-[#003366] text-white border-b-4 border-[#f2cc4d] sticky top-0 z-40 shadow-lg">
      {/* Top Banner Infobar */}
      <div className="bg-[#222222] text-xs py-2 px-4 flex flex-wrap justify-between items-center text-slate-300 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#f2cc4d]" />
            100% Genuine Certified Bearing Sourcing
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-300">ISO 9001:2015 Registered Group</span>
        </div>
        <div className="flex items-center gap-4 mt-1 sm:mt-0">
          <a href="tel:+914466867700" className="hover:text-white transition flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#f2cc4d]" /> +91 44 6686 7700
          </a>
          <a href="mailto:sales@ntnbearing.in" className="hover:text-white transition flex items-center gap-1">
            <Mail className="w-3 h-3 text-[#f2cc4d]" /> sales@ntnbearing.in
          </a>
        </div>
      </div>

      {/* Primary Sticky Navbar */}
      <div className="px-4 sm:px-8 py-3.5 flex justify-between items-center bg-[#003366]/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center border-2 border-[#f2cc4d] shadow-md group-hover:scale-105 transition">
              <Cpu className="w-7 h-7 text-[#003366] animate-pulse" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-black tracking-tight leading-none text-white block">
                UNIVERSAL ENTERPRISE
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#f2cc4d] font-extrabold uppercase tracking-[0.15em] hidden sm:block mt-1">
                Precision Bearings • Trusted Industrial Solutions
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden xl:flex items-center gap-1 text-[13px] font-semibold uppercase tracking-wider">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-sm transition duration-150 relative cursor-pointer ${
                  isActive
                    ? 'text-[#f2cc4d] bg-slate-900/50 border-b-2 border-[#f2cc4d] font-bold'
                    : 'text-slate-100 hover:text-white hover:bg-slate-800/30'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Request Quote with Cart */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenQuote}
            className="group relative flex items-center gap-2 bg-[#f2cc4d] hover:bg-[#e0b434] text-[#222222] px-5 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider transition transform hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer border-b-2 border-amber-600"
          >
            <ShoppingCart className="w-4 h-4 text-[#222222] group-hover:scale-110 transition" />
            <span className="hidden sm:inline">Request Quote</span>
            {quoteCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold shadow-md animate-bounce">
                {quoteCount}
              </span>
            )}
          </button>

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded bg-slate-800 text-white hover:bg-slate-700"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-t border-slate-700 p-4 space-y-2 text-xs uppercase font-mono">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded ${
                pathname === item.href ? 'bg-[#f2cc4d] text-slate-950 font-bold' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
