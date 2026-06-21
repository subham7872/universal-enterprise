import React from 'react';
import { 
  Map, MapPin, Clock, Phone, Mail, Award, CheckCircle2,
  Calendar, ShieldAlert, ArrowUpRight, MessageSquare
} from 'lucide-react';

export default function PremiumContactAdditions() {

  // 1. BUSINESS HOURS
  const businessHours = [
    { days: 'Monday - Friday', hours: '09:00 AM - 07:05 PM', status: 'Active' },
    { days: 'Saturday', hours: '09:30 AM - 05:00 PM', status: 'Active' },
    { days: 'Sunday', hours: 'Emergency Desk Only', status: 'On-Call' },
    { days: 'Industrial Holidays', hours: 'Emergency Sourcing Active', status: '24hr Active' }
  ];

  // 2. SALES CONTACT CARDS (Account Engineers)
  const salesEngineers = [
    {
      name: 'Amit Sharma',
      role: 'Heavy Steel & Cement Specialist',
      phone: '+91 44 6686 7701',
      email: 'a.sharma@universalbearing.com',
      experience: '12+ Years Sourcing'
    },
    {
      name: 'K. Srinivasan',
      role: 'THK / Linear Guidance Specialist',
      phone: '+91 44 6686 7702',
      email: 'k.srini@universalbearing.com',
      experience: '8+ Years Draftsman'
    },
    {
      name: 'Sneha Sen',
      role: 'Corporate Account Contracts',
      phone: '+91 44 6686 7703',
      email: 's.sen@universalbearing.com',
      experience: '10+ Years Procurement'
    }
  ];

  return (
    <div className="space-y-16 pt-4 border-t border-slate-100">

      {/* ====================================================
          1. SALES CONTACT CARDS & BUSINESS HOURS SIDE-BY-SIDE
          ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: sales staff contact */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="border-b pb-3">
            <span className="text-[9px] bg-[#003366] text-white font-black px-2 py-0.5 uppercase tracking-widest font-mono rounded-sm">
              STAFF DIRECTORY
            </span>
            <h3 className="text-xl font-black uppercase text-[#003366] mt-1">
              Connect with Qualified Sourcing Engineers
            </h3>
            <p className="text-slate-500 text-xs font-semibold">
              Skip general receptionist menus and dial directly into specialized engineering cells.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {salesEngineers.map((staff, idx) => (
              <div key={idx} className="bg-white border rounded-sm p-4 space-y-3 shadow-xs hover:border-[#003366] transition">
                <div className="space-y-0.5">
                  <span className="text-[#0a84ff] font-bold text-[10px] uppercase font-mono bg-[#0a84ff]/5 px-2 py-0.5 rounded-sm">
                    {staff.experience}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm pt-1">{staff.name}</h4>
                  <p className="text-slate-500 text-[10px] font-semibold uppercase">{staff.role}</p>
                </div>
                <div className="text-xs space-y-1.5 pt-2 border-t border-dashed">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{staff.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#003366] font-bold">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="break-all">{staff.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: business hours table */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="border-b pb-3">
            <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 uppercase tracking-widest font-mono rounded-sm">
              SLA DESK TIMINGS
            </span>
            <h3 className="text-xl font-black uppercase text-[#003366] mt-1">
              Hours of Sourcing Operations
            </h3>
            <p className="text-slate-500 text-xs font-semibold">
              Live technicians respond promptly under precise response curves.
            </p>
          </div>

          <div className="bg-white border rounded-sm overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left divide-y border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px]">
                  <th className="px-4 py-3">Day Range</th>
                  <th className="px-4 py-3">Office Timing</th>
                  <th className="px-4 py-3 text-right">Desk Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {businessHours.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3.5 font-bold text-slate-900">{row.days}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">{row.hours}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`inline-block font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded-sm ${
                        row.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        row.status === 'On-Call' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-[#003366] text-white'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ====================================================
          2. EMERGENCY SUPPORT SECTION & WHATSAPP QUICK CTAs
          ==================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Emergency helpline banner */}
        <div className="bg-rose-950/5 border-2 border-dashed border-rose-900/20 rounded-sm p-6 text-left space-y-4">
          <span className="inline-flex items-center gap-1.5 text-[9px] bg-rose-600 text-white font-black px-2 py-0.5 uppercase tracking-widest font-mono rounded-sm">
            🚨 24/7 DOWNTIME PREVENTION
          </span>
          <h4 className="text-lg font-black text-rose-950 uppercase tracking-tight">
            Emergency Dispatch Logistics Helpline
          </h4>
          <p className="text-slate-700 text-xs leading-relaxed font-semibold">
            Plant facing critical machinery stop? Our emergency dispatch line routes bearings out of storage vaults within hours. Authorized on-call support engineers are stationary even on Sundays.
          </p>
          <div className="pt-2">
            <a 
              href="mailto:emergency@universalbearing.com" 
              className="inline-flex items-center gap-2 text-xs font-black uppercase bg-rose-600 text-white hover:bg-rose-700 px-5 py-3 rounded-sm transition shadow-sm"
            >
              📧 emergency@universalbearing.com
            </a>
          </div>
        </div>

        {/* Whatsapp quick contact */}
        <div className="bg-emerald-950/5 border-2 border-dashed border-emerald-900/20 rounded-sm p-6 text-left space-y-4">
          <span className="inline-flex items-center gap-1.5 text-[9px] bg-emerald-600 text-white font-black px-2 py-0.5 uppercase tracking-widest font-mono rounded-sm">
            💬 INSTANT WHATSAPP DIALOG
          </span>
          <h4 className="text-lg font-black text-emerald-950 uppercase tracking-tight">
            Procurement Group Channel Access
          </h4>
          <p className="text-slate-700 text-xs leading-relaxed font-semibold">
            Want to immediately check in-stock availability, take physical parts snapshots, or request quick interchange quotes? Add our technical WhatsApp desk directly to your supplier chats.
          </p>
          <div className="pt-2">
            <a 
              href="https://api.whatsapp.com/send?phone=+914466867700&text=Universal%20Bearing%20Sourcing%20Desk" 
              className="inline-flex items-center gap-2 text-xs font-black uppercase bg-emerald-600 text-white hover:bg-emerald-700 px-5 py-3 rounded-sm transition shadow-sm"
              target="_blank"
              rel="noreferrer"
            >
              <MessageSquare className="w-4 h-4 text-white" /> Connect with WhatsApp Desk
            </a>
          </div>
        </div>

      </div>

      {/* ====================================================
          3. GOOGLE MAP SECTION
          ==================================================== */}
      <section className="space-y-6">
        <div className="text-left border-b pb-3">
          <span className="text-[9px] bg-[#003366] text-white font-black px-2 py-0.5 uppercase tracking-widest font-mono rounded-sm animate-pulse">
            GEOGRAPHIC NAVIGATION
          </span>
          <h3 className="text-2xl font-black uppercase text-[#003366] tracking-tight mt-1">
            Corporate Sourcing Hub Coordinates
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            Located directly inside the Chennai industrial zone for rapid dispatch logistics access.
          </p>
        </div>

        {/* Map panel layout with real embedded maps iframe + coordinates sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border rounded-sm overflow-hidden p-4">
          
          <div className="lg:col-span-8 h-96 relative bg-slate-100 border border-slate-200">
            {/* Real responsive Google Maps iframe */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.916895315197!2d80.252000!3d13.060000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52662e91000000%3A0x0!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1718974239320!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
              title="Google Map Location of Universal Enterprise"
            ></iframe>
          </div>

          <div className="lg:col-span-4 space-y-4 text-left flex flex-col justify-center">
            <div className="space-y-2 bg-slate-50 p-4 border rounded">
              <div className="flex items-center gap-2 text-[#003366] font-black text-xs uppercase font-mono">
                <MapPin className="w-4 h-4 text-[#003366]" />
                Primary Chennai Warehouse Address
              </div>
              <p className="text-xs text-slate-700 leading-normal font-medium">
                Universal Enterprise Complex,<br />
                No. 78, Thambu Chetty Street,<br />
                Parrys, George Town,<br />
                Chennai - 600001, Tamil Nadu, India
              </p>
            </div>
            <div className="space-y-1.5 text-xs text-slate-500">
              <p className="font-semibold text-slate-700">📍 Geo Coordinates:</p>
              <p className="font-mono text-[11px]">Latitude: 13.0903° N <br /> Longitude: 80.2905° E</p>
              <p className="font-semibold text-slate-700 pt-2">🚀 Proximity Access:</p>
              <p className="leading-snug">Located 25 minutes from Chennai Air Cargo Port and 10 minutes from Central Staging Hub.</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
