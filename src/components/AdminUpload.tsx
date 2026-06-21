import React, { useState } from 'react';
import { Database, FileUp, Clipboard, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

interface AdminUploadProps {
  onUploadSuccess: () => void;
}

export default function AdminUpload({ onUploadSuccess }: AdminUploadProps) {
  const [csvText, setCsvText] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; addedCount: number; totalCount?: number; errors?: string[] } | null>(null);

  const sampleCsvData = `16001JRX - ₹224
16002 - ₹234
16003 - ₹331
16004 - ₹371
16005 - ₹454
16006 - ₹559
16007 - ₹775
16008 - ₹699
16009 - ₹786
16010 - ₹889
16011 - ₹1848
16012 - ₹1917
16013 - ₹2110
16014 - ₹2140
16015 - ₹3174
16016 - ₹3667
16017 - ₹4323
16018 - ₹4444
16019 - ₹5174
16020 - ₹5960
16021 - ₹6506
16022 - ₹7758
16024 - ₹7970
16024C2 - ₹7970
16024C3 - ₹7970
16026 - ₹10046
16026C3 - ₹10046
16028 - ₹11207
16030 - ₹13718
16032 - ₹16108`;

  const handleLoadSample = () => {
    setCsvText(sampleCsvData);
  };

  const handleUpload = async () => {
    if (!csvText.trim()) {
      alert('Please enter or paste catalog text to upload.');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/products/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csvText }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({
          success: true,
          addedCount: data.addedCount,
          totalCount: data.totalCount,
          errors: data.errors,
        });
        onUploadSuccess(); // Trigger catalog refresh
      } else {
        setStatus({
          success: false,
          addedCount: 0,
          errors: [data.error || 'Check input format.'],
        });
      }
    } catch (err: any) {
      console.error('Upload Error:', err);
      setStatus({
        success: false,
        addedCount: 0,
        errors: [err.message || 'Connection lost to back-end.'],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden text-slate-800">
      {/* Drawer Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-amber-400">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-extrabold uppercase tracking-widest font-mono">
            Industrial Sourcing Data Loader (Express DB Sync)
          </h2>
        </div>
        <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase font-mono">
          Catalog Indexer
        </span>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-xs text-slate-500 leading-relaxed">
          Universal Sourcing managers can upload catalog matrices in <strong>Plain Text Pricing (e.g. Part - ₹Price)</strong> or as <strong>standard CSV schemas</strong> to immediately expand search indexing. The system parses entries, registers physical sizes, and updates active customer quotations.
        </p>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={8}
            className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-[#003366] focus:border-[#003366] placeholder-slate-400 leading-relaxed"
            placeholder={`Paste CSV schema here or paste bearing list.
Example format:
16001JRX - ₹224
16002 - ₹234`}
          ></textarea>
          
          <div className="absolute right-2 bottom-3 flex gap-2">
            <button
              onClick={handleLoadSample}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] px-2.5 py-1.5 rounded font-bold uppercase transition flex items-center gap-1 cursor-pointer shadow-xs"
              title="Load master list of 30 NTN Bearings"
            >
              <Clipboard className="w-3.5 h-3.5" />
              Pre-fill 30 NTN Bearings List
            </button>
          </div>
        </div>

        {/* Trigger and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="text-[10px] font-semibold text-slate-400 uppercase font-mono">
            Direct sync live in memory. Re-routes automatically.
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-[#003366] hover:bg-[#0056b3] text-white text-xs font-black uppercase px-5 py-2.5 rounded transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
            {loading ? 'Synthesizing database...' : 'Compile List & Sync'}
          </button>
        </div>

        {/* Upload status logs */}
        {status && (
          <div className={`p-4 rounded-md border ${status.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'} text-xs space-y-1 transition-all`}>
            {status.success ? (
              <>
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Database Synchronized Perfectly!
                </div>
                <p>
                  Passed and loaded <strong>{status.addedCount}</strong> bearings. Operational memory contains <strong>{status.totalCount}</strong> indexed objects.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Compilation Suspended
                </div>
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  {status.errors?.map((err, idx) => (
                    <li key={idx} className="font-mono text-[10px]">{err}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
