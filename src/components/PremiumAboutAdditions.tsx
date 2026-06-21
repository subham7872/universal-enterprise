import React from 'react';
import { 
  Milestone, Compass, Package, Award, HelpCircle, 
  Map, CheckCircle, Boxes, ShieldAlert, ArrowRight,
  Sparkles, History, HardHat, FileText, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function PremiumAboutAdditions() {
  
  // 1. COMPANY JOURNEY TIMELINE
  const journeyTimeline = [
    {
      year: '2010',
      title: 'Company Founded',
      desc: 'Established as an authorized regional deep-groove ball bearing distributor in Chennai with a single inventory locker.'
    },
    {
      year: '2014',
      title: 'Product Expansion',
      desc: 'Formed formal authorized sourcing pacts with NSK & Japan engineers, expanding catalog options to over 1,500 parts.'
    },
    {
      year: '2018',
      title: 'Industry Growth',
      desc: 'Inaugurated dedicated difficult sourcing desk to supply rare metric guides, partnering with steel and cement corridors.'
    },
    {
      year: '2022',
      title: 'Global Partnerships',
      desc: 'Expanded digital cross-referencing capabilities with direct logistics air pathways serving Indore, Mumbai, & New Delhi.'
    },
    {
      year: 'Current Operations',
      title: 'Sourcing Hub Leadership',
      desc: 'Operating continuous automated dispatch cells driven by intelligent AI-procurement workflows and verified database feeds.'
    }
  ];

  // 2. OUR STRENGTHS
  const strengths = [
    {
      title: 'Unparalleled Product Availability',
      desc: 'We store thousands of metric guidelines, pillow-blocks, and grease assemblies directly on-site for immediate readiness.',
      img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: '100% Genuine Certified Brands',
      desc: 'Every single component shipped features an absolute guarantee of origin verifiable with physical factory certs.',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Rigorous Technical Knowledge',
      desc: 'Senior mechanical draftsmen cross-analyze clearance configurations and CAD models to prevent alignment failure errors.',
      img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: '24-Hour Fast Sourcing Support',
      desc: 'Experienced operators keep diagnostic helplines constant, securing fast logistics routing across continuous factory intervals.',
      img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80'
    }
  ];

  // 3. WAREHOUSE & OPERATIONS GALLERY
  const galleries = [
    {
      title: 'Chennai Logistics Warehouse',
      desc: 'State-of-the-art storage containing thousands of bearing series.',
      img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Multi-brand Inventory Vault',
      desc: 'Climatized rooms storing verified products from globally recognized brands.',
      img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Automated Packaging Unit',
      desc: 'Custom wooden packing and moisture-proof wrap protocols.',
      img: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Fast Dispatch Terminal Area',
      desc: 'Priority air-cargo staging docks ready for fast daily pickups.',
      img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80'
    }
  ];

  // 4. OUR PROCESS
  const processSteps = [
    {
      step: '01',
      title: 'Inquiry Formulation',
      desc: 'Submit your specific parameters, dimensions, or manufacturer reference codes.'
    },
    {
      step: '02',
      title: 'Product Identification',
      desc: 'Engineers scan catalog trees and cross-references to identify standard and custom items.'
    },
    {
      step: '03',
      title: 'Pricing & Quotation',
      desc: 'A competitive discount-mapped invoice is calculated and shared in under 2 hours.'
    },
    {
      step: '04',
      title: 'Order Confirmation',
      desc: 'Requirements are finalized, parts reserve locks are triggered, and certifications are logged.'
    },
    {
      step: '05',
      title: 'Secure Dispatch',
      desc: 'Bearings are boxed in anti-vibe moisture protection shields and sent to dispatch.'
    },
    {
      step: '06',
      title: 'On-site Delivery',
      desc: 'Safe delivery confirmed at your factory doors via express air-logistic channels.'
    }
  ];

  return (
    <div className="space-y-16 pt-4 border-t border-slate-100">

      {/* ====================================================
          1. COMPANY JOURNEY TIMELINE
          ==================================================== */}
      <section className="space-y-6">
        <div className="text-left border-b pb-3">
          <span className="text-[9px] bg-[#003366] text-white font-black px-2 py-0.5 uppercase tracking-widest font-mono rounded-sm">
            MILESTONES SUMMARY
          </span>
          <h3 className="text-2xl font-black uppercase text-[#003366] tracking-tight mt-1">
            Company Sourcing Timeline
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            Forging dependable motion pathways through precise industrial distribution.
          </p>
        </div>

        <div className="relative pl-6 border-l border-[#003366]/20 space-y-8 max-w-4xl">
          {journeyTimeline.map((item, idx) => (
            <div key={idx} className="relative space-y-1">
              {/* Timeline bubble */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#f2cc4d] border-2 border-slate-900 z-10"></div>
              
              <div className="bg-slate-50 border p-4 rounded-sm hover:border-[#003366] transition">
                <span className="font-mono text-xs font-black text-[#003366] bg-[#003366]/5 px-2.5 py-1 rounded">
                  {item.year}
                </span>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mt-2.5">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          2. OUR STRENGTHS
          ==================================================== */}
      <section className="space-y-6">
        <div className="text-left border-b pb-3">
          <span className="text-[9px] bg-emerald-600 text-white font-black px-2 py-0.5 uppercase tracking-widest font-mono rounded-sm">
            DISTRIBUTION CAPABILITIES
          </span>
          <h3 className="text-2xl font-black uppercase text-[#003366] tracking-tight mt-1">
            Our Key Organizational Strengths
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            Operational attributes that guarantee machine efficiency for our clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {strengths.map((feat, idx) => (
            <div 
              key={idx}
              className="bg-white border text-slate-800 rounded-sm overflow-hidden flex flex-col sm:flex-row shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="sm:w-1/3 h-40 sm:h-auto overflow-hidden bg-slate-100">
                <img 
                  src={feat.img} 
                  alt={feat.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-5 flex-1 space-y-2 flex flex-col justify-center">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide leading-tight">
                  {feat.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          3. WAREHOUSE & OPERATIONS GALLERY
          ==================================================== */}
      <section className="space-y-6">
        <div className="text-left border-b pb-3">
          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 uppercase tracking-widest font-mono rounded-sm">
            PHYSICAL DISPATCH FACILITY
          </span>
          <h3 className="text-2xl font-black uppercase text-[#003366] tracking-tight mt-1">
            Warehouse & Physical Operations
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            Inspecting and packaging massive component shipments in climate-stable facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleries.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white border rounded-sm overflow-hidden shadow-xs hover:border-[#003366] transition group"
            >
              <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                <img 
                  src={item.img} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 duration-300 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
              </div>
              <div className="p-4 space-y-1 text-left">
                <h4 className="text-slate-900 font-extrabold text-xs uppercase block">
                  {item.title}
                </h4>
                <p className="text-slate-500 text-[10px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          4. OUR PROCESS
          ==================================================== */}
      <section className="space-y-6 bg-slate-900 text-white rounded-sm p-8 border-b-4 border-[#f2cc4d]">
        <div className="text-center max-w-2xl mx-auto space-y-2 pb-2">
          <span className="text-amber-400 font-black tracking-widest text-[9px] uppercase font-mono bg-amber-400/10 px-3 py-1 rounded-sm">
            EFFICIENT OPERATION WORKFLOW
          </span>
          <h3 className="text-2xl font-black uppercase tracking-tight">
            How Sourcing Works with Us
          </h3>
          <p className="text-slate-400 text-xs">
            Step-by-step dispatch pipeline engineered to maximize plant uptime.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {processSteps.map((pStep, idx) => (
            <div key={idx} className="bg-slate-800 border border-slate-800 p-5 rounded hover:border-amber-400 transition">
              <div className="flex justify-between items-start mb-3">
                <span className="text-amber-400 font-mono font-black text-xl leading-none">
                  {pStep.step}
                </span>
                <span className="text-[9px] text-[#003366] bg-amber-400 font-black px-1.5 py-0.5 rounded uppercase">
                  ACTIVE UNIT
                </span>
              </div>
              <h4 className="font-bold uppercase text-white tracking-wide text-xs mb-1.5">
                {pStep.title}
              </h4>
              <p className="text-slate-350 text-[11px] leading-relaxed">
                {pStep.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
