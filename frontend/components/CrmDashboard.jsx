"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Download, Users, DollarSign, ArrowUpRight, TrendingUp, Zap, Calendar as CalendarIcon, 
  Bot, Settings as SettingsIcon, Layers, FileText, CheckCircle, Clock, 
  X, AlertTriangle, Play, Pause, RefreshCw, Send, Check, Phone, Mail, 
  Building, Search, MapPin, Code, Plus, ArrowRight, Video, Shield, UserCheck
} from 'lucide-react';
import api from '../lib/api';
import { exportLeadsToCSV } from '../utils/csvExport';

const PIE_COLORS = ['#003366', '#f2cc4d', '#0A84FF', '#10B981', '#6366F1', '#EC4899'];

export default function CrmDashboard() {
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // CRM Data States
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [callLogs, setCallLogs] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    summary: {
      totalLeads: 0,
      totalQuotes: 0,
      totalCustomers: 0,
      totalProducts: 0,
      totalAppointments: 0,
      pipelineValue: 0,
      conversionRate: '24.5%'
    },
    leadSources: [],
    monthlyTrends: []
  });

  // Filter & Search states
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('All');
  const [leadViewMode, setLeadViewMode] = useState('kanban'); // 'kanban' | 'list'

  // New Lead Form Modal State
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    mobile: '',
    email: '',
    company: '',
    productInterest: 'Deep Groove Ball Bearings',
    source: 'Direct Traffic',
    status: 'New',
    leadScore: 70,
    notes: ''
  });

  // Fetch all CRM data from backend API
  const loadCrmData = async () => {
    setLoading(true);
    try {
      const [leadsRes, custRes, quotesRes, aptsRes, callsRes, wfRes, analyticsRes, prodsRes] = await Promise.allSettled([
        api.getLeads(),
        api.getCustomers(),
        api.getQuotes(),
        api.getAppointments(),
        api.getCallLogs(),
        api.getWorkflows(),
        api.getAnalytics(),
        api.getProducts({ limit: 100 })
      ]);

      if (leadsRes.status === 'fulfilled' && leadsRes.value.data) setLeads(leadsRes.value.data);
      if (custRes.status === 'fulfilled' && custRes.value.data) setCustomers(custRes.value.data);
      if (quotesRes.status === 'fulfilled' && quotesRes.value.data) setQuotes(quotesRes.value.data);
      if (aptsRes.status === 'fulfilled' && aptsRes.value.data) setAppointments(aptsRes.value.data);
      if (callsRes.status === 'fulfilled' && callsRes.value.data) setCallLogs(callsRes.value.data);
      if (wfRes.status === 'fulfilled' && wfRes.value.data) setWorkflows(wfRes.value.data);
      if (analyticsRes.status === 'fulfilled' && analyticsRes.value.data) setAnalyticsData(analyticsRes.value.data);
      if (prodsRes.status === 'fulfilled' && prodsRes.value.items) setProductsList(prodsRes.value.items);
    } catch (err) {
      console.error('Error loading CRM records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrmData();
  }, []);

  // Handle lead creation
  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createLead(newLeadForm);
      setLeads((prev) => [res.data, ...prev]);
      setShowNewLeadModal(false);
      setNewLeadForm({
        name: '',
        mobile: '',
        email: '',
        company: '',
        productInterest: 'Deep Groove Ball Bearings',
        source: 'Direct Traffic',
        status: 'New',
        leadScore: 70,
        notes: ''
      });
    } catch (err) {
      alert(`Failed to save lead: ${err.message}`);
    }
  };

  // Handle lead status update (drag / select)
  const handleUpdateLeadStatus = async (leadId, newStatus) => {
    try {
      await api.updateLead(leadId, { status: newStatus });
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId || l._id === leadId ? { ...l, status: newStatus } : l))
      );
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  // Handle Workflow toggle
  const handleToggleWorkflow = async (id) => {
    try {
      const res = await api.toggleWorkflow(id);
      setWorkflows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, enabled: res.data.enabled } : w))
      );
    } catch (err) {
      console.error('Failed to toggle workflow:', err);
    }
  };

  // Filtered leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch = 
      (l.name && l.name.toLowerCase().includes(leadSearch.toLowerCase())) ||
      (l.company && l.company.toLowerCase().includes(leadSearch.toLowerCase())) ||
      (l.email && l.email.toLowerCase().includes(leadSearch.toLowerCase())) ||
      (l.productInterest && l.productInterest.toLowerCase().includes(leadSearch.toLowerCase()));

    const matchesStatus = leadStatusFilter === 'All' || l.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const subTabs = [
    { id: 'dashboard', label: '1. Dashboard', icon: TrendingUp },
    { id: 'leads', label: '2. Leads', icon: Users },
    { id: 'customers', label: '3. Customers', icon: Building },
    { id: 'products', label: '4. Products', icon: Layers },
    { id: 'quotes', label: '5. Quotes', icon: FileText },
    { id: 'appointments', label: '6. Appointments', icon: CalendarIcon },
    { id: 'calendar', label: '7. Calendar', icon: Clock },
    { id: 'automation', label: '8. Workflows', icon: Zap },
    { id: 'ai-agent', label: '9. AI Calling Logs', icon: Bot },
    { id: 'analytics', label: '10. Analytics', icon: ArrowUpRight },
    { id: 'settings', label: '11. Settings & CSV', icon: SettingsIcon },
  ];

  return (
    <div className="bg-slate-50 min-h-screen rounded-lg border border-slate-200 overflow-hidden font-sans text-slate-800 shadow-xs">
      
      {/* Top Banner */}
      <div className="bg-[#003366] text-white p-5 border-b-4 border-[#f2cc4d] flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-[10px] bg-[#f2cc4d] text-slate-950 font-bold px-2 py-0.5 rounded uppercase tracking-widest font-mono">
            ENTERPRISE CRM & PIPELINE SUITE
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mt-1 text-white">
            Universal Sourcing B2B Management Hub
          </h2>
          <p className="text-slate-300 text-xs mt-0.5">
            Automated lead capture, quotation tracking, AI call logs & sales pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportLeadsToCSV(leads)}
            className="bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-bold text-xs uppercase px-4 py-2 rounded flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export Leads CSV
          </button>
          <button
            onClick={loadCrmData}
            className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded border border-slate-600 transition"
            title="Refresh Records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-4 flex gap-1 overflow-x-auto select-none">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 border-b-2 transition cursor-pointer ${
                isActive
                  ? 'text-[#003366] border-[#003366] bg-slate-50'
                  : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Subtab View */}
      <div className="p-6 space-y-6">

        {/* ----------------- 1. DASHBOARD TAB ----------------- */}
        {activeSubTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Leads Ingested</span>
                <div className="text-2xl font-black text-[#003366]">{leads.length || analyticsData.summary.totalLeads}</div>
                <div className="text-[11px] text-emerald-600 font-bold">↑ +18% from last month</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Pipeline Value</span>
                <div className="text-2xl font-black text-slate-900">₹{analyticsData.summary.pipelineValue.toLocaleString()}</div>
                <div className="text-[11px] text-amber-600 font-bold">Active Sourcing RFQs</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Active Quotes</span>
                <div className="text-2xl font-black text-[#003366]">{quotes.length || analyticsData.summary.totalQuotes}</div>
                <div className="text-[11px] text-slate-500">In Technical Validation</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Customer Conversion</span>
                <div className="text-2xl font-black text-emerald-600">{analyticsData.summary.conversionRate}</div>
                <div className="text-[11px] text-slate-500">{customers.length || analyticsData.summary.totalCustomers} Accounts Sourced</div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Monthly Revenue Trends */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs uppercase text-[#003366]">
                    Monthly Sourced Revenue Trends (₹ INR)
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Live MongoDB Aggregates</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" textAnchor="end" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#003366" fill="#003366" fillOpacity={0.15} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Lead Acquisition Sources */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs uppercase text-[#003366]">
                    Lead Sourcing Channels Breakdown
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Channel Share %</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.leadSources}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percentage }) => `${name}: ${percentage}`}
                      >
                        {analyticsData.leadSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ----------------- 2. LEADS TAB ----------------- */}
        {activeSubTab === 'leads' && (
          <div className="space-y-4">
            
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search leads by name, company, email..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full text-xs bg-transparent border-none focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="text-xs p-1.5 bg-slate-50 border rounded font-semibold text-slate-700"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Lost">Lost</option>
                </select>

                <div className="flex border rounded overflow-hidden">
                  <button
                    onClick={() => setLeadViewMode('kanban')}
                    className={`px-2.5 py-1 text-xs font-bold ${leadViewMode === 'kanban' ? 'bg-[#003366] text-white' : 'bg-slate-50 text-slate-600'}`}
                  >
                    Kanban
                  </button>
                  <button
                    onClick={() => setLeadViewMode('list')}
                    className={`px-2.5 py-1 text-xs font-bold ${leadViewMode === 'list' ? 'bg-[#003366] text-white' : 'bg-slate-50 text-slate-600'}`}
                  >
                    List
                  </button>
                </div>

                <button
                  onClick={() => setShowNewLeadModal(true)}
                  className="bg-[#003366] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 hover:bg-[#002244]"
                >
                  <Plus className="w-3.5 h-3.5" /> New Lead
                </button>
              </div>
            </div>

            {/* Kanban View */}
            {leadViewMode === 'kanban' ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['New', 'Contacted', 'Qualified', 'Lost'].map((colStatus) => {
                  const columnLeads = filteredLeads.filter((l) => l.status === colStatus);

                  return (
                    <div key={colStatus} className="bg-slate-100/70 p-3 rounded-lg border space-y-3">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-black text-xs uppercase text-[#003366]">
                          {colStatus}
                        </span>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold text-slate-600 shadow-2xs">
                          {columnLeads.length}
                        </span>
                      </div>

                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                        {columnLeads.map((l) => (
                          <div
                            key={l.id || l._id}
                            className="bg-white p-3 rounded border border-slate-200 shadow-2xs space-y-2 text-xs"
                          >
                            <div className="flex justify-between items-start">
                              <strong className="text-slate-900 font-extrabold">{l.name}</strong>
                              <span className="text-[10px] bg-amber-50 text-amber-900 font-bold px-1.5 rounded">
                                Score: {l.leadScore || 60}
                              </span>
                            </div>

                            <p className="text-slate-500 text-[11px] font-medium">{l.company}</p>
                            <div className="text-[11px] text-[#003366] font-semibold truncate">
                              🎯 {l.productInterest}
                            </div>

                            <div className="pt-2 border-t flex justify-between items-center text-[10px] text-slate-400">
                              <span>Source: {l.source}</span>
                              <select
                                value={l.status}
                                onChange={(e) => handleUpdateLeadStatus(l.id || l._id, e.target.value)}
                                className="bg-slate-50 border rounded text-[10px] font-bold text-slate-700 p-0.5"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Lost">Lost</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List Table View */
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#003366] text-white text-[10px] uppercase font-mono">
                    <tr>
                      <th className="p-3">Lead ID</th>
                      <th className="p-3">Representative Name</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Product Interest</th>
                      <th className="p-3">Channel Source</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredLeads.map((l) => (
                      <tr key={l.id || l._id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-[#003366]">{l.id || 'L-NEW'}</td>
                        <td className="p-3 font-bold text-slate-900">{l.name}</td>
                        <td className="p-3 text-slate-600">{l.company}</td>
                        <td className="p-3 text-[#003366]">{l.productInterest}</td>
                        <td className="p-3 text-slate-500">{l.source}</td>
                        <td className="p-3 font-bold font-mono">{l.leadScore || 60}</td>
                        <td className="p-3">
                          <select
                            value={l.status}
                            onChange={(e) => handleUpdateLeadStatus(l.id || l._id, e.target.value)}
                            className="bg-slate-50 border rounded text-[11px] font-bold text-slate-800 p-1"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* ----------------- 3. CUSTOMERS TAB ----------------- */}
        {activeSubTab === 'customers' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#003366] text-white text-[10px] uppercase font-mono">
                  <tr>
                    <th className="p-3">Customer ID</th>
                    <th className="p-3">Enterprise Client</th>
                    <th className="p-3">Contact Officer</th>
                    <th className="p-3">Email & Phone</th>
                    <th className="p-3">Tier</th>
                    <th className="p-3">Total Procurement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {customers.map((c) => (
                    <tr key={c.customerId || c._id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-[#003366]">{c.customerId || 'CUST-001'}</td>
                      <td className="p-3 font-bold text-slate-900">{c.company}</td>
                      <td className="p-3 text-slate-700">{c.contactName}</td>
                      <td className="p-3 text-slate-500">{c.email} • {c.phone}</td>
                      <td className="p-3 font-bold text-amber-700">{c.tier}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">₹{(c.totalSpend || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- 4. PRODUCTS CATALOG CRM ----------------- */}
        {activeSubTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#003366] text-white text-[10px] uppercase font-mono">
                  <tr>
                    <th className="p-3">Part Number</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Dimensions (IDxODxW)</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3">Unit Price (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium font-mono">
                  {productsList.slice(0, 20).map((p) => (
                    <tr key={p.id || p._id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-[#003366]">{p.partNumber}</td>
                      <td className="p-3 font-sans font-bold text-slate-800">{p.brand}</td>
                      <td className="p-3 font-sans text-slate-600">{p.category}</td>
                      <td className="p-3 text-slate-500">{p.innerDiameter} x {p.outerDiameter} x {p.width} mm</td>
                      <td className="p-3 text-emerald-600 font-bold">{p.stockCount || 50} units</td>
                      <td className="p-3 font-black text-slate-900">₹{p.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- 5. QUOTES QUEUE ----------------- */}
        {activeSubTab === 'quotes' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#003366] text-white text-[10px] uppercase font-mono">
                  <tr>
                    <th className="p-3">Quote ID</th>
                    <th className="p-3">Enterprise Buyer</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Routing</th>
                    <th className="p-3">Items Count</th>
                    <th className="p-3">Subtotal</th>
                    <th className="p-3">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {quotes.map((q) => (
                    <tr key={q.quoteId || q._id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-[#003366]">{q.quoteId}</td>
                      <td className="p-3 font-bold text-slate-900">{q.companyName}</td>
                      <td className="p-3 text-slate-600">{q.name} ({q.email})</td>
                      <td className="p-3 font-mono">{q.routing}</td>
                      <td className="p-3">{q.items?.length || 0} bearings</td>
                      <td className="p-3 font-mono font-bold text-slate-900">₹{(q.subtotal || 0).toLocaleString()}</td>
                      <td className="p-3">
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- 6. APPOINTMENTS ----------------- */}
        {activeSubTab === 'appointments' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((apt) => (
                <div key={apt.id || apt._id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-blue-100 text-[#003366] font-bold px-2 py-0.5 rounded uppercase">
                        {apt.type}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{apt.leadName}</h4>
                      <p className="text-slate-500 text-[11px]">{apt.company}</p>
                    </div>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded font-mono text-[10px]">
                      {apt.status}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border text-slate-700 space-y-1 font-mono text-[11px]">
                    <div><strong>Scheduled:</strong> {new Date(apt.dateTime).toLocaleString()}</div>
                    {apt.notes && <div><strong>Agenda:</strong> {apt.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 7. CALENDAR ----------------- */}
        {activeSubTab === 'calendar' && (
          <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-bold text-sm text-[#003366] uppercase">Monthly Consultation Schedule</h4>
              <span className="text-slate-500 font-mono">August - September 2026</span>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center font-bold text-slate-400 uppercase text-[10px]">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={`p-3 rounded border h-20 text-left flex flex-col justify-between ${
                    day === 24 || day === 2
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-700">{day}</span>
                  {(day === 24 || day === 2) && (
                    <span className="text-[9px] bg-[#003366] text-white p-1 rounded font-bold truncate">
                      Technical Sourcing
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 8. WORKFLOWS ----------------- */}
        {activeSubTab === 'automation' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workflows.map((wf) => (
                <div key={wf.id || wf._id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-sm">{wf.name}</h4>
                    <button
                      onClick={() => handleToggleWorkflow(wf.id)}
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition ${
                        wf.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {wf.enabled ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border text-[11px] font-mono space-y-1">
                    <div><strong>Trigger:</strong> {wf.trigger}</div>
                    {wf.conditions && <div><strong>Condition:</strong> {wf.conditions}</div>}
                    <div><strong>Automated Action:</strong> {wf.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 9. AI CALLING LOGS ----------------- */}
        {activeSubTab === 'ai-agent' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {callLogs.map((log) => (
                <div key={log.callId || log._id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded uppercase">
                        AI Inbound Qualification
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{log.leadName} • {log.phone}</h4>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px]">Duration: {log.duration}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded border space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Call Transcript</span>
                    {log.transcript?.map((t, idx) => (
                      <div key={idx} className="text-[11px]">
                        <strong>{t.speaker}:</strong> {t.text}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-600"><strong>Summary:</strong> {log.qualificationSummary}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">● {log.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- 10. ANALYTICS ----------------- */}
        {activeSubTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4">
              <h4 className="font-bold text-xs uppercase text-[#003366]">Quarterly Performance & Sourcing Revenue</h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#003366" name="Revenue (INR)" />
                    <Bar dataKey="quotes" fill="#f2cc4d" name="Quotes Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 11. SETTINGS & CSV ----------------- */}
        {activeSubTab === 'settings' && (
          <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-6 text-xs max-w-2xl">
            <div className="border-b pb-3">
              <h4 className="font-bold text-sm text-[#003366] uppercase">CRM Settings & Data Export</h4>
              <p className="text-slate-500 text-xs">Configure notification corridors and download complete leads logs.</p>
            </div>

            <div className="space-y-3">
              <label className="block font-bold text-slate-700 uppercase text-[11px]">Export CRM Records</label>
              <p className="text-slate-500">Download formatted CSV containing all active, contacted, and qualified procurement leads.</p>
              <button
                onClick={() => exportLeadsToCSV(leads)}
                className="bg-[#003366] hover:bg-[#002244] text-white px-5 py-2.5 rounded font-bold uppercase text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Complete Leads CSV
              </button>
            </div>
          </div>
        )}

      </div>

      {/* New Lead Modal */}
      {showNewLeadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full border-2 border-[#003366] space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-[#003366] uppercase">Register New Sourcing Lead</h3>
              <button onClick={() => setShowNewLeadModal(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-bold uppercase text-[10px]">Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold uppercase text-[10px]">Enterprise Company *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reliance Jamnagar"
                  value={newLeadForm.company}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold uppercase text-[10px]">Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98400..."
                    value={newLeadForm.mobile}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, mobile: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold uppercase text-[10px]">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@co.in"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full p-2 bg-slate-50 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold uppercase text-[10px]">Product / Series Interest</label>
                <input
                  type="text"
                  placeholder="e.g. NTN 16001, THK HSR20"
                  value={newLeadForm.productInterest}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, productInterest: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black py-2.5 rounded uppercase text-xs border-b-2 border-amber-600 mt-2"
              >
                Save Lead to CRM
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
