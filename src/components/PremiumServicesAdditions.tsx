import React from 'react';
import { 
  Milestone, Compass, Package, Award, HelpCircle, 
  Map, CheckCircle, Boxes, ShieldAlert, ArrowRight,
  Flame, Settings, Zap, ShieldCheck, PenTool, CheckCircle2,
  Lock, Truck, Sparkles
} from 'lucide-react';

export default function PremiumServicesAdditions() {

  // 1. SERVICES OVERVIEW
  const servicesList = [
    {
      title: 'Bearing Supply',
      desc: 'Authorized supply of ball bearings, roller bearings, guide systems, split blocks and housings.',
      img: 'https://images.unsplash.com/photo-1618979287755-d914e7a099a6?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Product Sourcing',
      desc: 'Rapidly tracing specific dimensions, global stocks, obsolete codes or custom assemblies.',
      img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Technical Consultation',
      desc: 'Clearance tolerances review, bearing life configuration formulas and design CAD checking.',
      img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'OEM Supply Sourcing',
      desc: 'Direct original equipment manufacturer procurement plans mapped to batch volume contracts.',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Industrial Procurement',
      desc: 'Discount structure spreadsheets integrated into multi-branch corporate procurement operations.',
      img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Maintenance Support',
      desc: 'Professional assistance for greasing configuration advice, misalignment detection and thermal audits.',
      img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
    }
  ];

  // 2. INDUSTRIAL SOLUTIONS
  const solutionsList = [
    {
      title: 'Manufacturing Plants',
      desc: 'Linear guides, angular balls, and standard blocks optimized for manufacturing machinery line automation.',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Power Plants',
      desc: 'Turbine-standard spherical cylinders, custom thrust rollers and heavy split housings built to withstand loads.',
      img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Mining Operations',
      desc: 'Vibration-grade conveyor bearings equipped with dust-resistant shields and high-performance seals.',
      img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Automotive Factories',
      desc: 'Transmission-level miniature bearings, hub rollers, and custom cage brackets supporting vehicle assemblies.',
      img: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Food Processing Units',
      desc: 'Corrosion-free stainless housings filled with high-purity sanitary grease compliant with clean directives.',
      img: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=400&q=80'
    }
  ];

  // 3. TECHNICAL SUPPORT FEATURES
  const supportSpecs = [
    {
      label: 'Product Selection Assistance',
      desc: 'We map load parameters, rotation speeds, and humidity environments to select optimal bearing cages and clearances.'
    },
    {
      label: 'Cross Reference Support',
      desc: 'Swap difficult-to-locate European codes with fully identical Japanese or American brand substitutes instantly.'
    },
    {
      label: 'Bearing Replacement Support',
      desc: 'Identify early-wear root causes, advising thermal or layout adjustment procedures during replacement phases.'
    },
    {
      label: 'Maintenance Recommendations',
      desc: 'Step-by-step lubricating interval curves, structural shield inspections, and thermal scan tolerances.'
    }
  ];

  return (
    <div className="space-y-16 pt-4 border-t border-slate-100">

      {/* ====================================================
          1. SERVICES OVERVIEW
          ==================================================== */}
      <section className="space-y-6">
        <div className="text-left border-b pb-3">
          <span className="text-[9px] bg-[#003366] text-white font-black px-2 py-0.5 uppercase tracking-widest font-mono rounded-sm">
            SERVICE DEPLOYMENT MATRIX
          </span>
          <h3 className="text-2xl font-black uppercase text-[#003366] tracking-tight mt-1">
            Premium Engineering Services Overview
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            Providing extensive corporate support for industrial bearing assemblies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((serv, idx) => (
            <div 
              key={idx}
              className="bg-white border rounded-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300"
            >
              <div className="h-44 w-full overflow-hidden bg-slate-100">
                <img 
                  src={serv.img} 
                  alt={serv.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                    {serv.title}
                  </h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-1 font-normal">
                    {serv.desc}
                  </p>
                </div>
                <div className="pt-2 text-right">
                  <span className="text-[9px] bg-[#003366]/5 text-[#003366] font-bold uppercase px-2 py-0.5 rounded-sm">
                    Verified Desk
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          2. INDUSTRIAL SOLUTIONS
          ==================================================== */}
      <section className="space-y-6">
        <div className="text-left border-b pb-3">
          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 uppercase tracking-widest font-mono rounded-sm">
            SYSTEM CRITICAL APPLICATIONS
          </span>
          <h3 className="text-2xl font-black uppercase text-[#003366] tracking-tight mt-1">
            Enterprise Industrial Solutions
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            Custom engineered bearing arrays built for tough operational limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {solutionsList.map((sol, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col hover:border-slate-400 transition"
            >
              <div className="h-28 w-full overflow-hidden bg-slate-100">
                <img 
                  src={sol.img} 
                  alt={sol.title}
                  className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 duration-300 transition-all shadow-inner"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight block">
                    {sol.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal mt-1 font-medium">
                    {sol.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          3. TECHNICAL SUPPORT SECTION
          ==================================================== */}
      <section className="bg-slate-50 border rounded-sm p-6 sm:p-8 space-y-6">
        <div className="text-left border-b border-slate-200 pb-3">
          <span className="text-[9px] bg-[#003366] text-white font-black px-2 py-0.5 uppercase tracking-widest font-mono rounded-sm">
            ENGINEERING RESOLUTION CORE
          </span>
          <h3 className="text-xl font-black uppercase text-[#003366] mt-1">
            Technical Support Desk Specs
          </h3>
          <p className="text-slate-500 text-xs">
            Direct coordination metrics with verified application engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {supportSpecs.map((item, idx) => (
            <div key={idx} className="bg-white p-5 border rounded-sm shadow-xs flex gap-3.5 items-start">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide leading-tight">
                  {item.label}
                </h4>
                <p className="text-slate-500 text-[11px] leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          4. EMERGENCY PROCUREMENT
          ==================================================== */}
      <section className="bg-rose-900/5 border-2 border-dashed border-rose-900/20 text-slate-900 rounded-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 flex-1">
            <span className="inline-flex items-center gap-1 text-[9px] bg-rose-600 text-white font-black px-2.5 py-1 rounded-sm uppercase tracking-widest font-mono">
              <Zap className="w-3.5 h-3.5 text-white animate-pulse" /> 24/7 DOWNTIME HAZARD CORE
            </span>
            <h3 className="text-2xl font-black text-rose-950 uppercase tracking-tight">
              Emergency Industrial Procurement
            </h3>
            <p className="text-rose-900 text-xs sm:text-sm font-semibold max-w-2xl leading-relaxed">
              Fast sourcing of hard-to-find industrial bearings and components. Our logistics desks bypass standard transit queues, coordinating direct factory air dispatches to secure operations under 24 hours.
            </p>
          </div>
          <div>
            <a 
              href="tel:+914466867700" 
              className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase px-5 py-3 rounded-sm shadow transition tracking-wider text-center"
            >
              ☎️ Emergency Hotline
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
