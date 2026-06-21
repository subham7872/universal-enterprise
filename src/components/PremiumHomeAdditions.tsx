import React, { useState } from 'react';
import { 
  ShieldCheck, Layers, Truck, Cpu, Coins, Globe, 
  Settings, ChevronLeft, ChevronRight, CheckCircle2, UserCheck, 
  ArrowRight, Landmark, HardHat, Factory, Soup, Car, Scissors, Archive
} from 'lucide-react';

interface PremiumHomeAdditionsProps {
  onCategorySelect: (category: string) => void;
  onBrandSelect: (brand: string) => void;
  onAddLog: (log: string) => void;
}

export default function PremiumHomeAdditions({ 
  onCategorySelect, 
  onBrandSelect, 
  onAddLog 
}: PremiumHomeAdditionsProps) {
  
  // 1. TRUSTED BRANDS
  const brands = [
    'FAG', 'INA', 'SKF', 'NSK', 'NTN', 'TIMKEN', 
    'KOYO', 'IKO', 'NACHI', 'THK', 'HIWIN', 'SCHAEFFLER'
  ];

  // Double the list for infinite marquee scrolling
  const marqueeBrands = [...brands, ...brands, ...brands];

  // 2. INDUSTRIES WE SERVE
  const industries = [
    {
      name: 'Manufacturing Plants',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
      icon: <Factory className="w-5 h-5 text-[#f2cc4d]" />,
      desc: 'Optimized high-speed spindles and guide systems for continuous conveyor operations.'
    },
    {
      name: 'Steel Industry',
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
      icon: <Landmark className="w-5 h-5 text-[#f2cc4d]" />,
      desc: 'Heavy-duty spherical and cylindrical rollers engineering extreme temperature limits.'
    },
    {
      name: 'Mining Industry',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      icon: <HardHat className="w-5 h-5 text-[#f2cc4d]" />,
      desc: 'Sturdy bearing shields protecting core mechanics from high-vibrating dust grids.'
    },
    {
      name: 'Cement Industry',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80',
      icon: <Settings className="w-5 h-5 text-[#f2cc4d]" />,
      desc: 'High-torque split pillow blocks for large rotatory kilns and separator systems.'
    },
    {
      name: 'Food Processing',
      image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=400&q=80',
      icon: <Soup className="w-5 h-5 text-[#f2cc4d]" />,
      desc: 'Sanitary stainless-steel housed units loaded with chemical-resistant food-grade grease.'
    },
    {
      name: 'Automotive Industry',
      image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=400&q=80',
      icon: <Car className="w-5 h-5 text-[#f2cc4d]" />,
      desc: 'Angular ball guides and needle bearings customized for transmission assemblies.'
    },
    {
      name: 'Textile Industry',
      image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?auto=format&fit=crop&w=400&q=80',
      icon: <Scissors className="w-5 h-5 text-[#f2cc4d]" />,
      desc: 'Frictionless deep groove bearings driving high-speed looms and spindle runners.'
    },
    {
      name: 'Packaging Industry',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
      icon: <Archive className="w-5 h-5 text-[#f2cc4d]" />,
      desc: 'Maintenance-free light flange housings and linear slide rails for sorting paths.'
    }
  ];

  // 3. FEATURED PRODUCT CATEGORIES
  const featuredCategories = [
    {
      name: 'Ball Bearings',
      count: '1,240+ In Stock',
      image: 'https://images.unsplash.com/photo-1618979287755-d914e7a099a6?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Roller Bearings',
      count: '980+ In Stock',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Thrust Bearings',
      count: '430+ In Stock',
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Linear Bearings',
      count: '310+ In Stock',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Housings',
      count: '650+ In Stock',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Lubrication Products',
      count: '240+ In Stock',
      image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // 5. CUSTOMER TESTIMONIALS CAROUSEL
  const testimonials = [
    {
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      name: 'Rajesh Varma',
      company: 'Salem Steel Mills Ltd',
      industry: 'Steel Production',
      review: 'Universal Enterprise has been our go-to distributor for FAG split pillow blocks for years. Their 24hr fast air dispatch saved us from high-severity converter downtime twice!'
    },
    {
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      name: 'Meera Chawla',
      company: 'Automotive Precision Ancillaries',
      industry: 'Auto Parts Manufacturing',
      review: 'Cross-branding consultations with Universal Sourcing engineers helped us match THK guide assemblies when other vendors failed. Superior technical support and impeccable loyalty.'
    },
    {
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      name: 'Sivasankar Iyer',
      company: 'Coromandel Cement Corp',
      industry: 'Cement Processing',
      review: 'We purchase bulk roller arrays from Universal Sourcing. Their genuine certificate of origin tracing keeps our mechanical auditing processes flawless. Absolute integrity.'
    }
  ];

  const [tIndex, setTIndex] = useState(0);

  const prevTestimonial = () => {
    setTIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setTIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // 6. QUICK RFQ SECTION
  const [rfqForm, setRfqForm] = useState({
    name: '',
    email: '',
    mobile: '',
    productNumber: ''
  });
  const [rfqSuccess, setRfqSuccess] = useState(false);

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dynamically insert into localStorage CRM 'ue_crm_leads'
    try {
      const savedLeads = localStorage.getItem('ue_crm_leads');
      const leadsList = savedLeads ? JSON.parse(savedLeads) : [];
      
      const newLead = {
        id: `lead-rfq-${Date.now()}`,
        name: rfqForm.name,
        company: 'Online RFQ Sourcing',
        mobile: rfqForm.mobile,
        email: rfqForm.email,
        productInterest: rfqForm.productNumber,
        source: 'Quick RFQ Page',
        leadScore: 85,
        status: 'New',
        createdDate: new Date().toISOString().split('T')[0],
        lastActivity: 'RFQ form submitted online',
        notes: `Customer requested pricing for: ${rfqForm.productNumber}. Immediate dispatch queue.`
      };

      const updatedLeads = [newLead, ...leadsList];
      localStorage.setItem('ue_crm_leads', JSON.stringify(updatedLeads));
      onAddLog(`New CRM Lead logged via home RFQ: Key ${rfqForm.productNumber} for ${rfqForm.name}.`);
    } catch (err) {
      console.error("Failed to sync RFQ to CRM logger: ", err);
    }

    setRfqSuccess(true);
    setTimeout(() => {
      setRfqForm({ name: '', email: '', mobile: '', productNumber: '' });
      setRfqSuccess(false);
    }, 6000);
  };

  return (
    <div className="space-y-16">
      
      {/* ====================================================
          1. TRUSTED BRANDS SECTION
          ==================================================== */}
      <section className="bg-white border border-slate-200 rounded-sm p-8 space-y-6 overflow-hidden">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h3 className="text-2xl font-black uppercase text-[#003366] tracking-tight">
            Trusted Bearing Brands We Supply
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Supplying genuine industrial bearings and power transmission products from globally recognized manufacturers.
          </p>
        </div>

        {/* Brand slider container */}
        <div className="relative w-full overflow-hidden bg-slate-50 py-4 border-y border-dashed border-slate-300">
          <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
            {marqueeBrands.map((b, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  onBrandSelect(b);
                  onAddLog(`Filtered products by brand: ${b}`);
                }}
                className="inline-flex flex-col justify-center items-center px-6 py-3 cursor-pointer select-none bg-white rounded-md border border-slate-200 text-slate-800 font-extrabold text-sm hover:text-white hover:bg-[#003366] tracking-widest transform hover:scale-105 transition-all duration-300 shadow-xs group shrink-0"
              >
                <span className="text-slate-400 group-hover:text-amber-400 font-black text-xs block select-none">AUTHORIZED</span>
                <span className="text-slate-800 group-hover:text-white font-extrabold text-lg transition tracking-wide select-none">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          3. FEATURED PRODUCT CATEGORIES
          ==================================================== */}
      <section className="space-y-6">
        <div className="text-left border-b pb-3">
          <h3 className="text-2xl font-black uppercase text-[#003366] tracking-tight">
            Featured Product Categories
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            Discover in-stock precision mechanics catalogued under rigorous verification guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCategories.map((cat, idx) => (
            <div 
              key={idx}
              className="group bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 hover:border-amber-400"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-70"></div>
                <div className="absolute bottom-3 left-4 z-20">
                  <span className="text-amber-400 text-[10px] uppercase font-black tracking-widest block font-mono">
                    {cat.count}
                  </span>
                  <h4 className="text-white text-lg font-black uppercase tracking-tight">
                    {cat.name}
                  </h4>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Genuine OEM Spec Sheet Included</span>
                <button
                  onClick={() => {
                    onCategorySelect(cat.name);
                    onAddLog(`Navigated page to product category: ${cat.name}`);
                  }}
                  className="bg-[#003366] hover:bg-[#f2cc4d] hover:text-slate-900 text-white font-black text-[10px] uppercase px-4 py-2 rounded-sm tracking-wider transition duration-350 cursor-pointer flex items-center gap-1.5"
                >
                  View Products <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          4. WHY CHOOSE US
          ==================================================== */}
      <section className="bg-slate-900 text-white rounded-sm p-8 sm:p-10 space-y-8 border-b-4 border-[#f2cc4d]">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-amber-400 font-black tracking-widest text-[10px] uppercase font-mono bg-amber-400/15 px-3 py-1 rounded-sm">
            QUALITY TRUST CRITERIA
          </span>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Why Partner with Universal?
          </h3>
          <p className="text-slate-400 text-xs font-medium">
            Strict authentication structures set us as the primary choice for global industrial operators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[
            {
              title: 'Genuine Products',
              icon: <ShieldCheck className="w-6 h-6 text-[#f2cc4d]" />,
              d: '100% genuine industrial bearings, fully certifiable with manufacturer trace codes.'
            },
            {
              title: 'Large Inventory',
              icon: <Layers className="w-6 h-6 text-[#f2cc4d]" />,
              d: 'Thousands of metric deep groove, angular contacts, and LM guidance blocks in stock.'
            },
            {
              title: 'Fast Delivery',
              icon: <Truck className="w-6 h-6 text-[#f2cc4d]" />,
              d: 'Under-24HR emergency dispatch networks routing to vital heavy production centers.'
            },
            {
              title: 'Technical Support',
              icon: <Cpu className="w-6 h-6 text-[#f2cc4d]" />,
              d: 'Direct dialogue with senior mechanical engineers for CAD clearance and cross-checks.'
            },
            {
              title: 'Bulk Supply',
              icon: <Coins className="w-6 h-6 text-[#f2cc4d]" />,
              d: 'Highly customized wholesaling curves mapping pricing matrices to corporate lists.'
            },
            {
              title: 'Global Brands',
              icon: <Globe className="w-6 h-6 text-[#f2cc4d]" />,
              d: 'Authorized sourcing pipelines representing NSK, THK, FAG, INA, and SKF.'
            }
          ].map((feat, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-800 p-5 rounded-sm hover:border-amber-400/50 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-slate-900 rounded-sm border border-slate-700/60">
                  {feat.icon}
                </div>
                <h4 className="font-extrabold text-white uppercase text-sm tracking-wide">
                  {feat.title}
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {feat.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          2. INDUSTRIES WE SERVE
          ==================================================== */}
      <section className="space-y-6">
        <div className="text-left border-b pb-3">
          <h3 className="text-2xl font-black uppercase text-[#003366] tracking-tight">
            Industries We Serve
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            Empowering critical heavy industries with continuous rotation stability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-40 w-full overflow-hidden bg-slate-150">
                <img 
                  src={ind.image} 
                  alt={ind.name}
                  className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 duration-300 transition-all"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 p-1.5 rounded-sm z-10 border border-slate-700">
                  {ind.icon}
                </div>
              </div>
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-slate-900 font-extrabold text-sm uppercase tracking-wider block">
                    {ind.name}
                  </h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-1 font-normal">
                    {ind.desc}
                  </p>
                </div>
                <div className="pt-2 text-right">
                  <span className="text-[9px] text-[#003366] bg-[#003366]/5 font-black uppercase px-2 py-0.5 rounded-sm">
                    Verified Application
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          5. CUSTOMER TESTIMONIALS SECTION
          ==================================================== */}
      <section className="bg-[#003366]/5 border border-[#003366]/10 rounded-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-dashed border-[#003366]/15 pb-4">
          <div>
            <span className="text-[9px] bg-[#003366] text-white font-black px-2 py-0.5 uppercase tracking-widest font-mono rounded-sm">
              ENGINEERING LOG SATISFACTION
            </span>
            <h3 className="text-xl font-black uppercase text-[#003366] mt-1">
              Verified Procurement Reviews
            </h3>
          </div>
          <div className="flex gap-1.5 self-end sm:self-center">
            <button 
              onClick={prevTestimonial}
              className="p-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm hover:border-[#003366] transition cursor-pointer"
              title="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="p-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm hover:border-[#003366] transition cursor-pointer"
              title="Next testimonial"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Testimonial Active Slider view */}
        <div className="min-h-36 flex flex-col md:flex-row gap-6 items-center bg-white p-6 rounded border">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-amber-400 shrink-0">
            <img 
              src={testimonials[tIndex].photo} 
              alt={testimonials[tIndex].name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-2 flex-1">
            <p className="text-slate-700 italic text-[12px] leading-relaxed font-semibold">
              "{testimonials[tIndex].review}"
            </p>
            <div className="text-xs pt-1">
              <span className="font-extrabold text-slate-900 block">{testimonials[tIndex].name}</span>
              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                {testimonials[tIndex].company} — <span className="text-[#0a84ff]">{testimonials[tIndex].industry}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          6. QUICK RFQ SECTION
          ==================================================== */}
      <section className="bg-white border rounded-sm p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Subtle decorative bar */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#003366] via-amber-400 to-[#003366]"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[9px] bg-[#f2cc4d] text-[#003366] font-black px-2.5 py-1 uppercase tracking-widest block font-mono w-max">
              FAST COMPONENT RFQ
            </span>
            <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tight leading-8">
              Need Instant Interchange Quotes?
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
              Submit your specific bearing serial coordinates or manufacturer part numbers. Our automated sourcing desks catalog and match prices across multiple global inventory vaults in under 2 hours.
            </p>
            <div className="flex gap-2.5 items-center font-mono text-[11px] text-[#003366] font-bold">
              <span className="flex items-center gap-1">🟢 SLA: Under 2 Hours</span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1">🛡️ Anti-Downtime Guarantee</span>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50 p-5 rounded-sm border border-slate-200">
            {rfqSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-sm text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-lg font-black uppercase tracking-tight text-emerald-950">Broadcast Confirmed</h4>
                <p className="text-xs text-slate-600">
                  Your custom component reference inquiry was successfully routed to Chennai. Lead ticket registered dynamically on CRM. Expect competitive pricing structures directly via email/phone within minutes!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-slate-600 font-bold uppercase text-[9px]">Representative Name *</label>
                  <input
                    type="text"
                    required
                    value={rfqForm.name}
                    onChange={(e) => setRfqForm({ ...rfqForm, name: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded focus:border-[#003366] focus:outline-none"
                    placeholder="e.g. Ramesh Patel"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-bold uppercase text-[9px]">Procurement Email *</label>
                  <input
                    type="email"
                    required
                    value={rfqForm.email}
                    onChange={(e) => setRfqForm({ ...rfqForm, email: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded focus:border-[#003366] focus:outline-none"
                    placeholder="r.patel@reliancemills.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-bold uppercase text-[9px]">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={rfqForm.mobile}
                    onChange={(e) => setRfqForm({ ...rfqForm, mobile: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded focus:border-[#003366] focus:outline-none font-mono"
                    placeholder="+91 95555 12000"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-600 font-bold uppercase text-[9px]">Part Number Sourced *</label>
                  <input
                    type="text"
                    required
                    value={rfqForm.productNumber}
                    onChange={(e) => setRfqForm({ ...rfqForm, productNumber: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded focus:border-[#003366] focus:outline-none font-mono font-bold"
                    placeholder="THK HSR20, SKF 6205, etc."
                  />
                </div>
                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#f2cc4d] hover:bg-yellow-500 text-slate-900 font-extrabold uppercase py-3.5 rounded-sm transition tracking-wider border-b-2 border-amber-600 shadow-md cursor-pointer text-center text-[10px]"
                  >
                    Submit Quick Quotation Ticket
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
