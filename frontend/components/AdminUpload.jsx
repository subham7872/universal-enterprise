"use client";

import React, { useState } from 'react';
import { Database, FileUp, Clipboard, CheckCircle2, AlertTriangle, Play, RefreshCw } from 'lucide-react';
import api from '../lib/api';

export default function AdminUpload({ onUploadSuccess }) {
  const [csvText, setCsvText] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

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
16026 - ₹10046
16028 - ₹11207
16030 - ₹13718
16032 - ₹16108`;

  const handleLoadSample = () => {
    setCsvText(sampleCsvData);
  };

  const handleUpload = async () => {
    if (!csvText.trim()) {
      alert('Please enter or paste catalog lines/CSV text to upload.');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const data = await api.uploadCsv(csvText);
      setStatus({
        success: true,
        addedCount: data.addedCount || 0,
        updatedCount: data.updatedCount || 0,
        errors: data.errors || []
      });
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setStatus({
        success: false,
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-lg p-5 border-2 border-slate-700 shadow-xl space-y-4 text-xs font-sans">
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[#f2cc4d]" />
          <div>
            <h4 className="font-bold text-sm uppercase text-white tracking-wider">
              Procurement Admin Sourcing Sync
            </h4>
            <p className="text-[11px] text-slate-400">
              Bulk update bearings catalog into MongoDB database
            </p>
          </div>
        </div>

        <button
          onClick={handleLoadSample}
          className="bg-slate-800 hover:bg-slate-700 text-[#f2cc4d] px-3 py-1.5 rounded font-mono text-[11px] border border-slate-600 flex items-center gap-1 cursor-pointer"
        >
          <Clipboard className="w-3.5 h-3.5" />
          Load NTN 16001-16032 Range
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-[11px] font-bold uppercase text-slate-300">
          Paste Raw Sourcing Lines or CSV Data:
        </label>
        <textarea
          rows={6}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder={`Format 1: 16001JRX - ₹224\nFormat 2: PartNumber,Brand,Category,Price,StockStatus,Weight,ID,OD,Width`}
          className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-3 rounded border border-slate-700 focus:outline-none focus:border-[#f2cc4d]"
        />
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleUpload}
          disabled={loading || !csvText.trim()}
          className="bg-[#f2cc4d] hover:bg-[#e6c144] text-slate-950 font-black px-6 py-2.5 rounded uppercase tracking-wider text-xs border-b-2 border-amber-600 transition flex items-center gap-2 disabled:opacity-40 cursor-pointer shadow-md"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Synchronize & Upsert Database
        </button>

        {status && (
          <div className="text-right">
            {status.success ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Successfully synchronized {status.addedCount + status.updatedCount} records to MongoDB.
              </span>
            ) : (
              <span className="text-red-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {status.message}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
