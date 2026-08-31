"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Cpu, ShieldCheck, Lock, User, KeyRound, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../../lib/api';

export default function CrmLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('crm_token') : null;
    if (token) {
      router.push('/crm');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.loginAdmin({ username, password });

      if (!data.token) {
        throw new Error(data.error || 'Invalid credentials. Please check username and password.');
      }

      localStorage.setItem('crm_token', data.token);
      if (data.admin) {
        localStorage.setItem('crm_admin_user', JSON.stringify(data.admin));
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/crm');
      }, 600);

    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-[#003366] p-6 text-white text-center border-b-4 border-[#f2cc4d] space-y-2">
          <div className="w-12 h-12 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-[#f2cc4d] shadow-md">
            <Cpu className="w-8 h-8 text-[#003366] animate-pulse" />
          </div>
          <h1 className="text-xl font-black tracking-tight uppercase">UNIVERSAL ENTERPRISE</h1>
          <p className="text-xs font-mono text-[#f2cc4d] uppercase tracking-wider font-bold">
            B2B CRM & Operations Portal
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Admin Authentication</h2>
            <p className="text-xs text-slate-500 font-normal">
              Authorized personnel only. Access restricted under ISO 9001:2015 security protocols.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>Authentication approved. Redirecting to CRM workspace...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent font-medium"
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent font-medium"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-slate-600 space-y-1 font-mono">
              <span className="font-bold text-slate-700 block">Default Setup Credentials:</span>
              <div>Username: <strong className="text-[#003366]">admin</strong></div>
              <div>Password: <strong className="text-[#003366]">Antigravity@2025</strong></div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-[#003366] hover:bg-[#002244] text-white font-black text-xs uppercase py-3 rounded-md transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In To CRM Portal</span>
                  <ArrowRight className="w-4 h-4 text-[#f2cc4d]" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 text-center space-y-2">
            <Link
              href="/"
              className="text-xs font-bold text-slate-500 hover:text-[#003366] transition inline-block"
            >
              &larr; Return to Public Website
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
