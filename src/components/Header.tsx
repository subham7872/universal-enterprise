import React from 'react';
import { ShieldCheck, Phone, Mail, ShoppingCart, Cpu, Menu, GlobeThin } from 'lucide-react';
import { QuoteItem } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  quoteItems: QuoteItem[];
  setQuoteOpen: (open: boolean) => void;
}

export default function Header({ currentTab, setCurrentTab, quoteItems, setQuoteOpen }: HeaderProps) {
  const quoteCount = quoteItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="w-full bg-[#003366] text-white border-b-4 border-[#F4C542]">
      {/* Top Banner Infobar */}
      <div className="bg-[#222222] text-xs py-2 px-4 flex flex-wrap justify-between items-center text-slate-300 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#F4C542]" /> 
            100% Genuine Certified Bearing Sourcing
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline">ISO 9001:2015 Registered Group</span>
        </div>
        <div className="flex items-center gap-4 mt-1 sm:mt-0">
          <a href="tel:+914466867700" className="hover:text-white transition flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#F4C542]" /> +91 44 6686 7700
          </a>
          <a href="mailto:sales@ntnbearing.in" className="hover:text-white transition flex items-center gap-1">
            <Mail className="w-3 h-3 text-[#F4C542]" /> sales@ntnbearing.in
          </a>
        </div>
      </div>

      {/* Primary Sticky Navbar */}
      <div className="sticky top-0 z-40 bg-[#003366]/95 backdrop-blur-md px-4 sm:px-8 py-4 flex justify-between items-center shadow-lg transition">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center border-2 border-[#F4C542] shadow-md cursor-pointer" onClick={() => setCurrentTab('home')}>
            <Cpu className="w-7 h-7 text-[#003366] animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight leading-none cursor-pointer hover:text-slate-200" onClick={() => setCurrentTab('home')}>
              UNIVERSAL ENTERPRISE
            </h1>
            <p className="text-[9px] sm:text-[10px] text-[#F4C542] font-extrabold uppercase tracking-[0.15em] hidden sm:block mt-1">
              Precision Bearings • Trusted Industrial Solutions
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1 text-[16px] font-medium uppercase tracking-wider">
          {[
            { id: 'home', label: 'Home' },
            { id: 'products', label: 'Products' },
            { id: 'categories', label: 'Categories' },
            { id: 'crm', label: 'CRM' },
            { id: 'about', label: 'About Us' },
            { id: 'contact', label: 'Contact' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-3 py-1.5 rounded-sm transition duration-150 relative cursor-pointer ${
                currentTab === tab.id
                  ? 'text-[#F4C542] bg-slate-900/50 border-b-2 border-[#F4C542] font-semibold'
                  : 'text-slate-100 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* CTA Request Quote with Cart */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuoteOpen(true)}
            className="group relative flex items-center gap-2 bg-[#F4C542] hover:bg-[#e0b434] text-[#222222] px-6 py-2.5 rounded-sm font-semibold text-xs uppercase tracking-wider transition transform hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer border-b-2 border-amber-600"
          >
            <ShoppingCart className="w-4 h-4 text-[#222222] group-hover:scale-110 transition" />
            <span className="hidden sm:inline">Request Quote</span>
            {quoteCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold shadow-md animate-bounce">
                {quoteCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
