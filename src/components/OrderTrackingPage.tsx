import React, { useState } from 'react';
import { Search, MapPin, Truck, CheckCircle2, ShieldAlert, FileText, Loader2, RefreshCw } from 'lucide-react';

export default function OrderTrackingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderData, setOrderData] = useState<any | null>(null);

  // Email lookup states
  const [emailLookup, setEmailLookup] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [emailMatches, setEmailMatches] = useState<any[]>([]);

  const fetchTracking = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setOrderData(null);
    try {
      const res = await fetch(`/api/quote/${id.trim()}`);
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Failed to fetch status information.');
      }
      const data = await res.json();
      setOrderData(data);
      setTrackingId(id.trim().toUpperCase());
    } catch (err: any) {
      setErrorMsg(err.message || 'Reference not located in our logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailLookup.trim()) return;
    setLookupLoading(true);
    setEmailMatches([]);
    try {
      const res = await fetch(`/api/quotes/by-email?email=${encodeURIComponent(emailLookup.trim())}`);
      const data = await res.json();
      if (res.ok) {
        setEmailMatches(data);
        if (data.length === 0) {
          setErrorMsg('No sourcing requests registered under this email.');
        }
      } else {
        setErrorMsg(data.error || 'Failed to verify email logs.');
      }
    } catch (err) {
      setErrorMsg('Error querying email log.');
    } finally {
      setLookupLoading(false);
    }
  };

  // Demo tracker shortcuts
  const demoOrders = [
    { id: 'UE-885402', company: 'Reliance Industries', desc: 'In Transit 🚚' },
    { id: 'UE-115049', company: 'Mahindra Plant III', desc: 'Custom Crating 📦' }
  ];

  const totalItemEstimate = orderData?.items?.reduce((acc: number, item: any) => {
    return acc + (item.product.price * item.quantity);
  }, 0) || 0;

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Banner introduction */}
      <div className="bg-slate-900 text-white p-6 rounded-lg border-b-4 border-[#f2cc4d] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-[#f2cc4d] text-slate-900 font-black text-[9px] px-2.5 py-0.5 rounded-sm tracking-widest uppercase block w-max mb-1.5">
            LOGISTICS CONTROL PORTAL
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
            Universal Enterprise Real-time Order Tracker
          </h2>
          <p className="text-slate-400 text-xs mt-1 font-semibold max-w-xl leading-relaxed">
            Trace the precise technical validation, custom moisture-proof packing packaging phases, and transit telemetry for your customized industrial sourcing sheets.
          </p>
        </div>
        <div className="flex gap-1.5 bg-slate-950 p-2.5 rounded-sm border border-slate-800 text-center text-xs">
          <Truck className="w-5 h-5 text-[#f2cc4d] shrink-0" />
          <div className="text-left font-mono">
            <div className="text-white font-extrabold text-[10px]">BLUE DART PREFERRED PARTNER</div>
            <div className="text-slate-500 text-[9px]">ACTIVE DEPOT TIMELINE SYNC 🟢</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Lookup panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Tracking ID input form */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#003366] border-b pb-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-500" />
              Sourcing Reference Lookup
            </h3>
            
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase text-slate-505 tracking-wider">
                Enter CRM Sourcing ID / Reference Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="e.g. UE-885402"
                  className="bg-white border border-slate-300 rounded-sm p-2.5 text-xs font-mono font-bold uppercase focus:ring-1 focus:ring-[#003366] focus:border-[#003366] flex-1"
                />
                <button
                  onClick={() => fetchTracking(trackingId)}
                  disabled={loading}
                  className="bg-[#003366] hover:bg-[#002244] text-white font-black text-xs uppercase px-4 rounded-sm flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : 'Track'}
                </button>
              </div>
            </div>

            {/* Simulated shortcuts helper */}
            <div className="space-y-2 pt-2 border-t text-[11px]">
              <span className="block text-slate-400 uppercase font-bold text-[9px] tracking-wider">
                💡 Sample preloaded tracking sheets:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {demoOrders.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setTrackingId(d.id);
                      fetchTracking(d.id);
                    }}
                    className="p-2 py-1.5 bg-slate-50 hover:bg-amber-100 border border-slate-200 hover:border-amber-300 text-left rounded-sm font-mono transition text-slate-700 flex justify-between items-center"
                  >
                    <span><strong>{d.id}</strong> ({d.company})</span>
                    <span className="text-[10px] font-bold text-[#003366] font-sans">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alternative email lookup card */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#003366] border-b pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              Corporate Email Lookup Portal
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Forgot your reference code? Look up the active log using the corporate email address submitted during checkout.
            </p>
            <form onSubmit={handleEmailSearch} className="space-y-3">
              <input
                type="email"
                required
                value={emailLookup}
                onChange={(e) => setEmailLookup(e.target.value)}
                placeholder="procurement@company.com"
                className="w-full bg-white border border-slate-300 rounded-sm p-2.5 text-xs font-semibold focus:ring-1 focus:ring-[#003366] focus:border-[#003366]"
              />
              <button
                type="button"
                onClick={handleEmailSearch}
                disabled={lookupLoading}
                className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-black text-xs uppercase py-2.5 rounded-sm transition flex justify-center items-center gap-1.5"
              >
                {lookupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search Email Sourcing Logs'}
              </button>
            </form>

            {emailMatches.length > 0 && (
              <div className="border-t pt-3 space-y-2">
                <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Matched inquiries found ({emailMatches.length}):
                </span>
                <div className="space-y-1.5">
                  {emailMatches.map((m: any) => (
                    <button
                      key={m.quoteId}
                      onClick={() => fetchTracking(m.quoteId)}
                      className="w-full text-left p-2 rounded-sm bg-emerald-50 border border-emerald-200 hover:border-[#003366] text-xs font-mono font-bold flex justify-between items-center transition"
                    >
                      <span className="text-[#003366]">{m.quoteId}</span>
                      <span className="text-slate-600 bg-white border px-1.5 py-0.5 text-[9px] rounded-sm font-sans font-black uppercase">
                        {m.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Track Result Details */}
        <div className="lg:col-span-8">
          
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-5 text-red-800 text-xs flex gap-2.5 items-start">
              <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <span className="font-bold block mb-1 uppercase tracking-wider">Verification Failure:</span>
                {errorMsg}
              </div>
            </div>
          )}

          {orderData ? (
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
              
              {/* Order summary bar */}
              <div className="flex flex-wrap justify-between items-center bg-slate-50 p-4 border border-slate-200 rounded-sm gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black font-mono">Reference Invoice ID</span>
                  <div className="text-lg font-black text-[#003366] font-mono leading-none flex items-center gap-1.5 select-all">
                    {orderData.quoteId}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Submitted: <strong>{orderData.statusTimeline[0]?.date}</strong>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black font-mono block text-right">Current Phase</span>
                  <span className="bg-[#003366] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-sm tracking-wider block">
                     ⚙️ {orderData.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-black font-mono block">Estimated Valuation</span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    ₹{totalItemEstimate.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Company & Officer profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50/50 p-4 rounded-sm border border-slate-200/80">
                <div>
                  <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">Company Registered Node</span>
                  <span className="text-slate-900 font-black text-sm uppercase">{orderData.companyName}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">Authorizing Officer</span>
                  <span className="text-slate-800 font-bold block">{orderData.name}</span>
                  <span className="text-slate-500 font-mono text-[10px]">{orderData.email} • {orderData.phone}</span>
                </div>
              </div>

              {/* Dynamic status stepper representation */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#003366] border-b pb-1">
                  Chronological Dispatch Steppers
                </h4>
                
                {/* Steppers visualization */}
                <div className="relative pl-6 space-y-6 border-l-2 border-slate-200">
                  {orderData.statusTimeline.map((step: any, idx: number) => {
                    const isDone = step.done;
                    const isActive = isDone && (!orderData.statusTimeline[idx + 1] || !orderData.statusTimeline[idx + 1].done);
                    
                    return (
                      <div key={idx} className="relative">
                        
                        {/* Bullet point node marker */}
                        <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                          isActive 
                            ? 'scale-125 border-amber-500 ring-4 ring-amber-100' 
                            : isDone
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-slate-300 bg-white'
                        }`}>
                          {isDone && !isActive && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {isActive && (
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></div>
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <span className={`text-xs uppercase font-black tracking-wider ${
                              isActive ? 'text-amber-600 font-black' : isDone ? 'text-slate-900 font-bold' : 'text-slate-400'
                            }`}>
                              {step.label}
                            </span>
                            {step.date && (
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                                {step.date}
                              </span>
                            )}
                          </div>
                          {step.desc && (
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-semibold">
                              {step.desc}
                            </p>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items in quote details */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#003366] border-b pb-1">
                  Sourced Part Sizing Assemblies
                </h4>
                <div className="border border-slate-200 rounded-sm overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b font-mono">
                        <th className="p-2.5 px-4 w-2/3">Bearing Code</th>
                        <th className="p-2.5 text-center">Qty Sourced</th>
                        <th className="p-2.5 text-right px-4">Est. Price each</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {orderData.items && orderData.items.length > 0 ? (
                        orderData.items.map((item: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="p-2.5 px-4">
                              <span className="font-black text-[#003366] font-mono block text-sm">
                                {item.product?.partNumber}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-semibold">
                                {item.product?.brand} • {item.product?.category}
                              </span>
                            </td>
                            <td className="p-2.5 text-center font-bold font-mono text-slate-800">
                              {item.quantity}
                            </td>
                            <td className="p-2.5 text-right font-black font-mono text-[#003366] px-4">
                              ₹{item.product?.price}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-4 text-center text-slate-400">
                            Custom dimensions spec sheet upload - processing raw estimate.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Custom specs message */}
              {orderData.message && (
                <div className="border-t pt-4 space-y-1.5 text-xs text-slate-700 font-semibold bg-amber-50/30 p-3 rounded-sm border border-amber-200/50">
                  <span className="block text-[9px] uppercase font-black text-amber-800 tracking-wider">
                     Recipient Instructions:
                  </span>
                  <p className="leading-snug italic font-medium">"{orderData.message}"</p>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-[#003366]/5 rounded-lg border-2 border-dashed border-slate-300/80 p-12 text-center text-slate-400 space-y-4 select-none">
              <RefreshCw className="w-12 h-12 text-slate-300 mx-auto animate-spin" style={{ animationDuration: '6s' }} />
              <div>
                <p className="font-extrabold uppercase font-sans text-sm text-slate-800 tracking-wider">
                  No Sourcing Order Currently Loaded
                </p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto leading-normal">
                  Enter a tracking reference ID in the left panel or click one of the preloaded demo accounts to inspect the logistics pipeline visually.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
