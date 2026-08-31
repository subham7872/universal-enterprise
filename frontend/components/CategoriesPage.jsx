"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Disc, Layers, Sliders, Settings, Compass, 
  Cpu, Dribbble, Zap, ShieldAlert, Wrench, PlayCircle, ArrowRight 
} from 'lucide-react';
import { CATEGORY_TREE } from '../data/categoriesData';

const CATEGORY_ICONS = {
  'ball-bearings': Disc,
  'roller-bearings': Layers,
  'thrust-bearings': Sliders,
  'housings': Settings,
  'linear-bearings': Compass,
  'automotive-parts': Cpu,
  'other-bearings': Dribbble,
  'parts-for-bearings': Zap,
  'snap-rings-seals': ShieldAlert,
  'tools-for-bearings': Wrench,
  'grease-lubrication': PlayCircle,
};

export default function CategoriesPage({ onSelectCategory }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xs font-sans text-slate-800">
      
      {/* Page Title Hero Banner */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-[#003366] text-[#f2cc4d] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest font-mono">
            ENGINEERING DIRECTORY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#003366] tracking-tight mt-2">
            Industrial Bearing & Motion Categories
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl font-normal">
            Explore standard and high-performance precision bearing classifications distributed by Universal Enterprise.
          </p>
        </div>
      </div>

      {/* 11 Main Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORY_TREE.map((category) => {
          const IconComponent = CATEGORY_ICONS[category.id] || Disc;

          return (
            <div
              key={category.id}
              className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-[#003366] hover:shadow-md transition group"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-md bg-[#003366] text-[#f2cc4d] flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                      {category.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {category.subcategories?.length || 0} Subcategories
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <ul className="text-xs space-y-1 text-slate-600">
                    {category.subcategories?.slice(0, 5).map((sub, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-1.5 hover:text-[#003366]">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        {onSelectCategory ? (
                          <button
                            type="button"
                            onClick={() => onSelectCategory(sub.name)}
                            className="truncate text-left hover:underline text-slate-700 hover:text-[#003366] cursor-pointer"
                          >
                            {sub.name}
                          </button>
                        ) : (
                          <Link href={`/products?category=${encodeURIComponent(sub.name)}`} className="truncate hover:underline">
                            {sub.name}
                          </Link>
                        )}
                      </li>
                    ))}
                    {(category.subcategories?.length || 0) > 5 && (
                      <li className="text-[10px] font-bold text-slate-400 italic pt-1">
                        + {(category.subcategories?.length || 0) - 5} more series
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                {onSelectCategory ? (
                  <button
                    type="button"
                    onClick={() => onSelectCategory(category.name)}
                    className="flex-1 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs uppercase py-2.5 rounded transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    Filter {category.name} <ArrowRight className="w-3.5 h-3.5 text-[#f2cc4d]" />
                  </button>
                ) : (
                  <Link
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                    className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs uppercase py-2.5 rounded transition flex items-center justify-center gap-1.5"
                  >
                    Browse {category.name} <ArrowRight className="w-3.5 h-3.5 text-[#f2cc4d]" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
