"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Download, Users, DollarSign, ArrowUpRight, TrendingUp, Zap, Calendar as CalendarIcon, 
  Bot, Settings as SettingsIcon, Layers, FileText, CheckCircle, Clock, 
  X, AlertTriangle, Play, Pause, RefreshCw, Send, Check, Phone, Mail, 
  Building, Search, MapPin, Code, Plus, ArrowRight, Video, Shield, UserCheck, LogOut
} from 'lucide-react';
import api from '../lib/api';
import { exportLeadsToCSV } from '../utils/csvExport';

const PIE_COLORS = ['#003366', '#f2cc4d', '#0A84FF', '#10B981', '#6366F1', '#EC4899'];

export default function CrmDashboard() {
  const router = useRouter();
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

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

  // Product CRM States
  const [productSearch, setProductSearch] = useState('');
  const [productBrandFilter, setProductBrandFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    partNumber: '',
    brand: 'FAG',
    category: 'Deep Groove Ball Bearings Single Row',
    innerDiameter: 25,
    outerDiameter: 52,
    width: 15,
    price: 450,
    stockStatus: 'Available',
    stockCount: 50,
    material: 'High-Carbon Chrome Steel',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'
  });

  // New Lead Form Modal State
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    mobile: '',
    email: '',
    company: '',
    productInterest: 'Deep Groove Ball Bearings Single Row',
    source: 'Direct Traffic',
    status: 'New',
    leadScore: 70,
    notes: ''
  });

  // Auth verification on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('crm_token') : null;
    if (!token) {
      router.push('/crm/login');
    } else {
      setAuthenticated(true);
      loadCrmData();
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_admin_user');
    }
    router.push('/crm/login');
  };

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
        api.getProducts({ limit: 30000 })
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

  // Product CRUD Handlers
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await api.updateProduct(editingProduct.id || editingProduct._id || editingProduct.partNumber, editingProduct);
      const updated = res.data || editingProduct;
      setProductsList(prev => prev.map(p => (p.id === updated.id || p.partNumber === updated.partNumber) ? updated : p));
      setEditingProduct(null);
      alert(`Product ${updated.partNumber} updated successfully!`);
    } catch (err) {
      alert(`Failed to update product: ${err.message}`);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createProduct(newProductForm);
      const created = res.data || newProductForm;
      setProductsList(prev => [created, ...prev]);
      setShowNewProductModal(false);
      alert(`Bearing ${created.partNumber} added to catalog!`);
    } catch (err) {
      alert(`Failed to add product: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id, partNumber) => {
    if (!confirm(`Are you sure you want to delete bearing ${partNumber}?`)) return;
    try {
      await api.deleteProduct(id || partNumber);
      setProductsList(prev => prev.filter(p => p.id !== id && p.partNumber !== partNumber));
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
    }
  };

  const handleUploadImageFile = async (e, isNew = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result;
          const res = await api.uploadProductImage(
            base64,
            file.name,
            isNew ? null : (editingProduct?.id || editingProduct?.partNumber)
          );
          if (res.imageUrl) {
            if (isNew) {
              setNewProductForm(prev => ({ ...prev, image: res.imageUrl }));
            } else {
              setEditingProduct(prev => ({ ...prev, image: res.imageUrl }));
              // Update in list preview directly
              setProductsList(prev => prev.map(p => 
                (p.id === editingProduct.id || p.partNumber === editingProduct.partNumber)
                  ? { ...p, image: res.imageUrl }
                  : p
              ));
            }
          }
        } catch (uploadErr) {
          alert(`Image upload error: ${uploadErr.message}`);
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert(`Failed reading image file: ${err.message}`);
      setUploadingImage(false);
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
          <button
            onClick={handleLogout}
            className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold uppercase px-3 py-2 rounded flex items-center gap-1.5 transition shadow-sm"
            title="Log Out of CRM"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
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
                  const columnLeads = filteredLeads.filter((l) => (l.status || 'new').toLowerCase() === colStatus.toLowerCase());

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
                        {columnLeads.map((l) => {
                          const callStatus = (l.callStatus || 'pending').toLowerCase();
                          const callBadgeColor = 
                            callStatus === 'booked' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                            callStatus === 'called' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            callStatus === 'failed' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                            'bg-amber-100 text-amber-800 border-amber-300';

                          return (
                            <div
                              key={l.id || l._id}
                              className="bg-white p-3 rounded border border-slate-200 shadow-2xs space-y-2 text-xs"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <strong className="text-slate-900 font-extrabold">{l.name}</strong>
                                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                    {l.phone || l.mobile || l.email}
                                  </div>
                                </div>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${callBadgeColor}`}>
                                  🤖 {callStatus}
                                </span>
                              </div>

                              <p className="text-slate-500 text-[11px] font-medium">{l.company || 'Website Lead'}</p>
                              <div className="text-[11px] text-[#003366] font-semibold">
                                🎯 {l.productInterest || l.message}
                              </div>

                              <div className="pt-2 border-t flex justify-between items-center text-[10px] text-slate-500">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded uppercase font-bold text-[9px]">
                                  {l.source || 'contact'}
                                </span>
                                <select
                                  value={l.status || 'New'}
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
                          );
                        })}
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
                      <th className="p-3">Buyer & Contact</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Product Interest / Message</th>
                      <th className="p-3">Channel Source</th>
                      <th className="p-3">Lily AI Call</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredLeads.map((l) => {
                      const callStatus = (l.callStatus || 'pending').toLowerCase();
                      const callBadgeColor = 
                        callStatus === 'booked' ? 'bg-emerald-100 text-emerald-800' :
                        callStatus === 'called' ? 'bg-blue-100 text-blue-800' :
                        callStatus === 'failed' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800';

                      return (
                        <tr key={l.id || l._id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-[#003366]">{l.id || 'L-NEW'}</td>
                          <td className="p-3">
                            <strong className="text-slate-900 block">{l.name}</strong>
                            <span className="text-[10px] text-slate-500 block font-mono">{l.phone || l.mobile}</span>
                            <span className="text-[10px] text-slate-400 block">{l.email}</span>
                          </td>
                          <td className="p-3 text-slate-600">{l.company || 'Website Portal'}</td>
                          <td className="p-3 text-[#003366] max-w-xs truncate">{l.productInterest || l.message}</td>
                          <td className="p-3">
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                              {l.source || 'contact'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${callBadgeColor}`}>
                              {callStatus}
                            </span>
                          </td>
                          <td className="p-3 font-bold font-mono">{l.leadScore || 60}</td>
                          <td className="p-3">
                            <select
                              value={l.status || 'New'}
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
                      );
                    })}
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
            
            {/* Products Toolbar */}
            <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search catalog by part number, brand, category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs bg-transparent border-none focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={productBrandFilter}
                  onChange={(e) => setProductBrandFilter(e.target.value)}
                  className="text-xs p-1.5 bg-slate-50 border rounded font-semibold text-slate-700"
                >
                  <option value="All">All Brands</option>
                  <option value="FAG">FAG</option>
                  <option value="INA">INA</option>
                  <option value="Elges">Elges</option>
                  <option value="NTN">NTN</option>
                  <option value="NSK">NSK</option>
                  <option value="THK">THK</option>
                  <option value="SKF">SKF</option>
                </select>

                <button
                  onClick={() => setShowNewProductModal(true)}
                  className="bg-[#003366] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 hover:bg-[#002244]"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Bearing
                </button>
              </div>
            </div>

            {/* Total count badge */}
            <div className="text-xs text-slate-500 font-medium">
              Showing <strong>{
                productsList.filter(p => {
                  const matchQuery = !productSearch || p.partNumber?.toLowerCase().includes(productSearch.toLowerCase()) || p.brand?.toLowerCase().includes(productSearch.toLowerCase()) || p.category?.toLowerCase().includes(productSearch.toLowerCase());
                  const matchBrand = productBrandFilter === 'All' || p.brand?.toUpperCase() === productBrandFilter.toUpperCase();
                  return matchQuery && matchBrand;
                }).length
              }</strong> bearings in database
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#003366] text-white text-[10px] uppercase font-mono sticky top-0 z-10">
                    <tr>
                      <th className="p-3">Image</th>
                      <th className="p-3">Part Number</th>
                      <th className="p-3">Brand</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Dimensions (IDxODxW)</th>
                      <th className="p-3">Stock Units</th>
                      <th className="p-3">Unit Price (INR)</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium font-mono">
                    {productsList
                      .filter(p => {
                        const matchQuery = !productSearch || p.partNumber?.toLowerCase().includes(productSearch.toLowerCase()) || p.brand?.toLowerCase().includes(productSearch.toLowerCase()) || p.category?.toLowerCase().includes(productSearch.toLowerCase());
                        const matchBrand = productBrandFilter === 'All' || p.brand?.toUpperCase() === productBrandFilter.toUpperCase();
                        return matchQuery && matchBrand;
                      })
                      .map((p) => (
                        <tr key={p.id || p._id || p.partNumber} className="hover:bg-slate-50">
                          <td className="p-2.5">
                            <div className="w-10 h-10 bg-slate-100 rounded border flex items-center justify-center overflow-hidden">
                              <img
                                src={p.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'}
                                alt={p.partNumber}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/favicon.svg';
                                }}
                              />
                            </div>
                          </td>
                          <td className="p-3 font-bold text-[#003366]">{p.partNumber}</td>
                          <td className="p-3 font-sans">
                            <span className="bg-slate-100 border px-1.5 py-0.5 rounded font-black text-slate-700 text-[10px]">
                              {p.brand}
                            </span>
                          </td>
                          <td className="p-3 font-sans text-slate-600 truncate max-w-[140px]">{p.category}</td>
                          <td className="p-3 text-slate-500">{p.innerDiameter} x {p.outerDiameter} x {p.width} mm</td>
                          <td className="p-3 font-sans">
                            <span className="text-emerald-700 font-bold">● {p.stockStatus || 'Available'}</span>
                            <span className="text-slate-400 text-[10px] ml-1">({p.stockCount || 50})</span>
                          </td>
                          <td className="p-3 font-black text-slate-900">₹{p.price}</td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5 font-sans">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="bg-slate-100 hover:bg-slate-200 text-[#003366] text-[10px] font-bold px-2.5 py-1 rounded border transition"
                              >
                                Edit / Image
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.partNumber)}
                                className="text-red-500 hover:text-red-700 text-[10px] font-bold p-1"
                                title="Delete"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit Bearing & Image Modal */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-lg w-full border-2 border-[#003366] space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <h3 className="font-bold text-sm text-[#003366] uppercase">
                        Edit Bearing: {editingProduct.partNumber} ({editingProduct.brand})
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">Update specifications and bearing image</span>
                    </div>
                    <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-900">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateProduct} className="space-y-3">
                    {/* Image URL & File Upload & Live Preview */}
                    <div className="space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-center">
                        <label className="block text-slate-700 font-black uppercase text-[10px] tracking-wider">
                          Bearing Image (File Upload or URL) *
                        </label>
                        {uploadingImage && (
                          <span className="text-[10px] text-amber-600 font-bold animate-pulse">
                            Uploading image...
                          </span>
                        )}
                      </div>

                      <div className="flex gap-3 items-center">
                        <div className="w-16 h-16 bg-white border-2 border-slate-300 rounded-md overflow-hidden shrink-0 flex items-center justify-center shadow-inner relative group">
                          <img
                            src={editingProduct.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/favicon.svg';
                            }}
                          />
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Paste image URL (or upload below)"
                              value={editingProduct.image || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                              className="flex-1 p-2 bg-white border rounded text-xs font-mono"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <label
                              htmlFor="edit-bearing-file-picker"
                              className="bg-[#003366] hover:bg-[#002244] text-white text-[10px] font-bold px-3 py-1.5 rounded cursor-pointer transition shadow-2xs flex items-center gap-1"
                            >
                              📁 Upload Image from PC
                            </label>
                            <input
                              id="edit-bearing-file-picker"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUploadImageFile(e, false)}
                              className="hidden"
                            />
                            <span className="text-[10px] text-slate-400">JPG, PNG, WebP supported</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px]">Unit Price (INR) *</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.price || 0}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                          className="w-full p-2 bg-slate-50 border rounded font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px]">Stock Status</label>
                        <select
                          value={editingProduct.stockStatus || 'Available'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stockStatus: e.target.value })}
                          className="w-full p-2 bg-slate-50 border rounded font-semibold"
                        >
                          <option value="Available">Available</option>
                          <option value="Low Stock">Low Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 font-mono">
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px] font-sans">Inside Bore (ID)</label>
                        <input
                          type="number"
                          value={editingProduct.innerDiameter || 0}
                          onChange={(e) => setEditingProduct({ ...editingProduct, innerDiameter: parseFloat(e.target.value) || 0 })}
                          className="w-full p-2 bg-slate-50 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px] font-sans">Outside Dia (OD)</label>
                        <input
                          type="number"
                          value={editingProduct.outerDiameter || 0}
                          onChange={(e) => setEditingProduct({ ...editingProduct, outerDiameter: parseFloat(e.target.value) || 0 })}
                          className="w-full p-2 bg-slate-50 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px] font-sans">Width (B)</label>
                        <input
                          type="number"
                          value={editingProduct.width || 0}
                          onChange={(e) => setEditingProduct({ ...editingProduct, width: parseFloat(e.target.value) || 0 })}
                          className="w-full p-2 bg-slate-50 border rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px]">Category</label>
                        <input
                          type="text"
                          value={editingProduct.category || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          className="w-full p-2 bg-slate-50 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px]">Material</label>
                        <input
                          type="text"
                          value={editingProduct.material || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                          className="w-full p-2 bg-slate-50 border rounded"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 border rounded font-bold text-xs uppercase hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black text-xs uppercase rounded border-b-2 border-amber-600"
                      >
                        Save Product & Image
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Add New Bearing Modal */}
            {showNewProductModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-lg w-full border-2 border-[#003366] space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-sm text-[#003366] uppercase">Add New Bearing to Catalog</h3>
                    <button onClick={() => setShowNewProductModal(false)} className="text-slate-400 hover:text-slate-900">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px]">Part Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 6205-2Z"
                          value={newProductForm.partNumber}
                          onChange={(e) => setNewProductForm({ ...newProductForm, partNumber: e.target.value })}
                          className="w-full p-2 bg-slate-50 border rounded font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px]">Brand *</label>
                        <select
                          value={newProductForm.brand}
                          onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                          className="w-full p-2 bg-slate-50 border rounded font-bold"
                        >
                          <option value="FAG">FAG</option>
                          <option value="INA">INA</option>
                          <option value="Elges">Elges</option>
                          <option value="NTN">NTN</option>
                          <option value="NSK">NSK</option>
                          <option value="THK">THK</option>
                          <option value="SKF">SKF</option>
                        </select>
                      </div>
                    </div>

                    {/* Image Upload for New Product */}
                    <div className="space-y-2 bg-slate-50 p-3 rounded border">
                      <label className="block text-slate-600 font-bold uppercase text-[10px]">Bearing Image</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/... or upload below"
                          value={newProductForm.image}
                          onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                          className="flex-1 p-2 bg-white border rounded font-mono text-xs"
                        />
                        <label
                          htmlFor="new-bearing-file-picker"
                          className="bg-[#003366] hover:bg-[#002244] text-white text-[10px] font-bold px-3 py-2 rounded cursor-pointer transition shrink-0"
                        >
                          📁 Upload File
                        </label>
                        <input
                          id="new-bearing-file-picker"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadImageFile(e, true)}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px]">Price (INR) *</label>
                        <input
                          type="number"
                          required
                          value={newProductForm.price}
                          onChange={(e) => setNewProductForm({ ...newProductForm, price: parseFloat(e.target.value) || 0 })}
                          className="w-full p-2 bg-slate-50 border rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px]">Category</label>
                        <input
                          type="text"
                          value={newProductForm.category}
                          onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                          className="w-full p-2 bg-slate-50 border rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 font-mono">
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px] font-sans">ID (mm)</label>
                        <input
                          type="number"
                          value={newProductForm.innerDiameter}
                          onChange={(e) => setNewProductForm({ ...newProductForm, innerDiameter: parseFloat(e.target.value) || 0 })}
                          className="w-full p-2 bg-slate-50 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px] font-sans">OD (mm)</label>
                        <input
                          type="number"
                          value={newProductForm.outerDiameter}
                          onChange={(e) => setNewProductForm({ ...newProductForm, outerDiameter: parseFloat(e.target.value) || 0 })}
                          className="w-full p-2 bg-slate-50 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px] font-sans">Width (mm)</label>
                        <input
                          type="number"
                          value={newProductForm.width}
                          onChange={(e) => setNewProductForm({ ...newProductForm, width: parseFloat(e.target.value) || 0 })}
                          className="w-full p-2 bg-slate-50 border rounded"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black py-2.5 rounded uppercase text-xs border-b-2 border-amber-600 mt-2"
                    >
                      Save Bearing to Database
                    </button>
                  </form>
                </div>
              </div>
            )}

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
