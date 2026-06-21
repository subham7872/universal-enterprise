import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Download, Users, DollarSign, ArrowUpRight, TrendingUp, Zap, Calendar as CalendarIcon, 
  Bot, Settings as SettingsIcon, Layers, FileText, CheckCircle, Clock, 
  X, AlertTriangle, Play, Pause, RefreshCw, Send, Check, Phone, Mail, 
  Building, Search, MapPin, Code, Plus, ArrowRight, Video, Wifi, Shield
} from 'lucide-react';
import { Product } from '../types';
import { exportLeadsToCSV } from '../utils/csvExport';

interface CrmDashboardProps {
  productsList: Product[];
  onBackToCatalog: () => void;
}

// Initial robust CRM State structures
interface CrmLead {
  id: string;
  name: string;
  mobile: string;
  email: string;
  company: string;
  productInterest: string;
  source: 'Homepage Modal' | 'Product Page Form' | 'Contact Form' | 'Chatbot' | 'AI Voice Agent' | 'WhatsApp' | 'Direct Traffic' | 'Google Search' | 'Facebook Ads' | 'LinkedIn' | 'Referral';
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  createdDate: string;
  lastActivity: string;
  leadScore: number;
  utmSource?: string;
  chatHistory?: { sender: 'user' | 'assistant'; text: string; time: string }[];
  callTranscript?: { speaker: string; text: string; time: string }[];
  appointmentDate?: string;
  notes?: string;
}

interface CrmAppointment {
  id: string;
  leadId: string;
  leadName: string;
  company: string;
  dateTime: string;
  type: 'Technical Consultation' | 'Quote Negotiation' | 'Procurement Review' | 'Direct Sales';
  status: 'Scheduled' | 'Completed' | 'Canceled';
}

interface AutomationRule {
  id: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

export default function CrmDashboard({ productsList, onBackToCatalog }: CrmDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'leads' | 'customers' | 'products' | 'quotes' | 'appointments' | 'calendar' | 'automation' | 'ai-agent' | 'analytics' | 'settings'>('dashboard');

  // Load state from localStorage or seed
  const [leads, setLeads] = useState<CrmLead[]>(() => {
    const saved = localStorage.getItem('ue_crm_leads');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'L-101',
        name: 'Arvind Swamy',
        mobile: '+91 98450 12053',
        email: 'arvind.swamy@reliance.com',
        company: 'Reliance Industries Ltd (Jamnagar)',
        productInterest: 'CSCD040-HLE',
        source: 'Google Search',
        status: 'Qualified',
        createdDate: '2026-06-18',
        lastActivity: 'Sourced catalog specifications directly',
        leadScore: 85,
        utmSource: 'google-organic',
        leadStatus: 'Qualified',
        chatHistory: [
          { sender: 'user', text: 'Need quote for 15 units of INA thin section bearings CSCD040', time: '10:15 AM' },
          { sender: 'assistant', text: 'Connecting with Sales Hub. Price estimated roughly at ₹5,200/unit.', time: '10:16 AM' }
        ],
        notes: 'Requested urgent dispatch availability. Technical team verified replacement matches NSK alternative.'
      },
      {
        id: 'L-102',
        name: 'Meera Chawla',
        mobile: '+91 97110 58402',
        email: 'm.chawla@tatamotors.com',
        company: 'Tata Motors Plant Pune',
        productInterest: 'KIT233',
        source: 'Homepage Modal',
        status: 'Contacted',
        createdDate: '2026-06-20',
        lastActivity: 'AI calling agent completed qualification session',
        leadScore: 90,
        utmSource: 'direct',
        notes: 'Intersted in Generation II integrated front wheel hub bearings.'
      },
      {
        id: 'L-103',
        name: 'Rajesh Koothra',
        mobile: '+91 91102 99401',
        email: 'rku@isro.gov.in',
        company: 'ISRO Satellite assembly',
        productInterest: 'VU140325',
        source: 'Chatbot',
        status: 'Qualified',
        createdDate: '2026-06-15',
        lastActivity: 'Tech documents validated by admin',
        leadScore: 95,
        notes: 'Slewing drive ring bearing for antenna rotation stack.'
      },
      {
        id: 'L-104',
        name: 'Donald Stark',
        mobile: '+91 88201 02931',
        email: 'dstark@bhel.co.in',
        company: 'Bharat Heavy Electricals Plant I',
        productInterest: 'SL185048-A-BR-C3',
        source: 'AI Voice Agent',
        status: 'New',
        createdDate: '2026-06-21',
        lastActivity: 'Lead logged via Voice trigger',
        leadScore: 75,
        utmSource: 'facebook-ads'
      },
      {
        id: 'L-105',
        name: 'Vikram Seth',
        mobile: '+91 94255 10244',
        email: 'vseth@larsen-toubro.com',
        company: 'L&T Heavy Engineering',
        productInterest: '51326-MP',
        source: 'WhatsApp',
        status: 'Contacted',
        createdDate: '2026-06-19',
        lastActivity: 'WhatsApp message sent introducing FAG alternatives',
        leadScore: 70,
        notes: 'Inquired about solid brass cage assemblies for high load vertical pressure setups.'
      }
    ];
  });

  const [appointments, setAppointments] = useState<CrmAppointment[]>(() => {
    const saved = localStorage.getItem('ue_crm_appointments');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'A-201',
        leadId: 'L-101',
        leadName: 'Arvind Swamy',
        company: 'Reliance Industries Ltd',
        dateTime: '2026-06-24T14:30',
        type: 'Procurement Review',
        status: 'Scheduled'
      },
      {
        id: 'A-202',
        leadId: 'L-103',
        leadName: 'Rajesh Koothra',
        company: 'ISRO Satellite Assembly',
        dateTime: '2026-06-25T11:00',
        type: 'Technical Consultation',
        status: 'Scheduled'
      }
    ];
  });

  const [crmSettings, setCrmSettings] = useState(() => {
    const saved = localStorage.getItem('ue_crm_settings');
    if (saved) return JSON.parse(saved);
    return {
      fullName: 'Vikash Rathore',
      email: 'v.rathore@ue-asia.com',
      mobile: '+91 95400 88210',
      companyName: 'Universal Enterprise',
      position: 'Director of Sourcing Operations',
      website: 'https://www.ue-asia.com',
      profilePic: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
      googleSyncEnabled: true,
      lastSyncTime: 'Jun 21, 2026 12:45 PM'
    };
  });

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    { id: 'R-1', trigger: 'Homepage popup form submitted', action: 'Create CRM Lead, update Lead Score to 50, send dynamic Email to Customer && notify Operations Admin', enabled: true },
    { id: 'R-2', trigger: 'Product Page Inquiry Received', action: 'Update Product Interest, Assign Sourcing Manager, Trigger WhatsApp introduction', enabled: true },
    { id: 'R-3', trigger: 'Lead score crosses 80', action: 'Trigger AI voice agent outbound call sequence for qualification', enabled: true },
    { id: 'R-4', trigger: 'New Chatbot Conversion logged', action: 'Save conversation transcripts, compute UTM tracking source parameters', enabled: true }
  ]);

  const [logs, setLogs] = useState<string[]>([
    'System init: Universal Enterprise integrated CRM system operational.',
    'Synced with main in-memory quoting engine: 2 pending quotes found.',
    'Automation trigger mapped: Outbound WhatsApp webhook active.',
    'AI Vocal Agent Engine: Standby mode successfully calibrated.'
  ]);

  // Save states
  useEffect(() => {
    localStorage.setItem('ue_crm_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('ue_crm_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('ue_crm_settings', JSON.stringify(crmSettings));
  }, [crmSettings]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  // State calculations for metric boxes
  const totalLeads = leads.length;
  const newLeadsToday = leads.filter(l => l.createdDate === '2026-06-21').length;
  const qualifiedLeads = leads.filter(l => l.status === 'Qualified').length;
  const lostLeads = leads.filter(l => l.status === 'Lost').length;
  const conversionRate = totalLeads ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;
  
  // Dynamic Revenue calculation (Qualified lead product interest pricing * safe multiplier)
  const totalRevenue = leads
    .filter(l => l.status === 'Qualified')
    .reduce((sum, led) => {
      const matchProd = productsList.find(p => p.partNumber === led.productInterest);
      const prc = matchProd ? matchProd.price : 2500;
      return sum + (prc * 20); // assume typical industrial order is 20 units
    }, 0);

  const productInquiriesCount = leads.length;
  const quoteRequestsCount = 18; // safe historic counter + pending quote requests

  // Form states for creating a custom lead inside table
  const [newLeadModal, setNewLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '',
    mobile: '',
    email: '',
    company: '',
    productInterest: 'CSCD040-HLE',
    source: 'Direct Traffic' as any,
    status: 'New' as any,
    notes: ''
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const isProdExist = productsList.some(p => p.partNumber === leadForm.productInterest);
    const score = isProdExist ? 75 : 40;
    
    const newLead: CrmLead = {
      id: `L-${Date.now().toString().slice(-4)}`,
      name: leadForm.name,
      mobile: leadForm.mobile,
      email: leadForm.email,
      company: leadForm.company,
      productInterest: leadForm.productInterest,
      source: leadForm.source,
      status: leadForm.status,
      createdDate: '2026-06-21',
      lastActivity: 'Lead created manually in CRM Dashboard',
      leadScore: score,
      notes: leadForm.notes
    };

    setLeads([newLead, ...leads]);
    addLog(`Manual Lead logged: ${newLead.name} (${newLead.company}) - Interested in ${newLead.productInterest}`);
    
    // Auto actions simulation
    addLog(`Automation Trigger [Immediate]: Save lead source as '${newLead.source}'`);
    addLog(`Automation Log: Simulated email dispatched to operational admin.`);
    addLog(`Automation Log: Sending introductory WhatsApp via CRM Node to ${newLead.mobile}.`);
    
    setNewLeadModal(false);
    setLeadForm({
      name: '',
      mobile: '',
      email: '',
      company: '',
      productInterest: 'CSCD040-HLE',
      source: 'Direct Traffic',
      status: 'New',
      notes: ''
    });
  };

  // Appointment scheduling
  const [newApptModal, setNewApptModal] = useState(false);
  const [apptForm, setApptForm] = useState({
    leadId: '',
    dateTime: '2026-06-22T10:00',
    type: 'Technical Consultation' as any
  });

  const handleCreateAppt = (e: React.FormEvent) => {
    e.preventDefault();
    const associatedLead = leads.find(l => l.id === apptForm.leadId);
    if (!associatedLead) return;

    const newAppt: CrmAppointment = {
      id: `A-${Date.now().toString().slice(-4)}`,
      leadId: apptForm.leadId,
      leadName: associatedLead.name,
      company: associatedLead.company,
      dateTime: apptForm.dateTime,
      type: apptForm.type,
      status: 'Scheduled'
    };

    setAppointments([...appointments, newAppt]);
    addLog(`Meeting Scheduled with ${associatedLead.name} - ${newAppt.type} at ${apptForm.dateTime.replace('T', ' ')}`);
    setNewApptModal(false);
  };

  // Lead status toggles
  const updateLeadStatus = (leadId: string, newStatus: CrmLead['status']) => {
    setLeads(leads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          status: newStatus,
          lastActivity: `Lead status updated to ${newStatus}`
        };
      }
      return l;
    }));
    addLog(`Lead ${leadId} status changed to ${newStatus}`);
  };

  const handleCallSimulation = (lead: CrmLead) => {
    setActiveSubTab('ai-agent');
    setAiActiveLead(lead);
    handleTriggerAiCal(lead);
  };

  const handleDownloadCSV = () => {
    exportLeadsToCSV();
    addLog(`Exported leads, customers & product inquiries to CSV successfully.`);
  };

  // AI calling agent simulator states
  const [aiActiveLead, setAiActiveLead] = useState<CrmLead | null>(leads[0]);
  const [callingState, setCallingState] = useState<'idle' | 'dialing' | 'connected' | 'transcript_completed' | 'disconnected'>('idle');
  const [aiTranscripts, setAiTranscripts] = useState<{ speaker: string; text: string; time: string }[]>([]);
  const [dialProgress, setDialProgress] = useState(0);

  const qualificationScripts = [
    { speaker: 'AI Agent', text: 'Hello, am I speaking with the procurement representative at this company?' },
    { speaker: 'Customer', text: 'Yes, this is. We are looking for high-quality single row deep groove ball bearings.' },
    { speaker: 'AI Agent', text: 'Excellent! I see you logged an interest in part number CSCD040-HLE thin section bearing. What is your required monthly volume?' },
    { speaker: 'Customer', text: 'We need about 35 to 50 units dispatched as soon as possible to Pune. Do you have FAG or INA brand stock ready?' },
    { speaker: 'AI Agent', text: 'Yes, both FAG & INA are our premium authorized lines. We have immediate dispatch ready. I am booking a Technical Consultation with our sourcing Director Vikash on June 24 at 2:30 PM. Does that work?' },
    { speaker: 'Customer', text: 'That schedule is perfect. Send me the calendar invite and direct quotation sheet.' },
    { speaker: 'AI Agent', text: 'Fantastic. Our integrated CRM system has logged this, and your meeting link has been pushed to Google Calendar.' }
  ];

  const handleTriggerAiCal = (targetLead: CrmLead) => {
    setAiActiveLead(targetLead);
    setCallingState('dialing');
    setDialProgress(0);
    setAiTranscripts([]);

    const interval = setInterval(() => {
      setDialProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setCallingState('connected');
          // Start playing transcript line by line with timeouts
          playTranscriptSequentially();
          return 100;
        }
        return p + 25;
      });
    }, 400);
  };

  const playTranscriptSequentially = () => {
    let index = 0;
    const addTranscriptLine = () => {
      if (index < qualificationScripts.length) {
        const line = qualificationScripts[index];
        setAiTranscripts((prev) => [...prev, {
          speaker: line.speaker,
          text: line.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        index++;
        setTimeout(addTranscriptLine, 2000); // 2 second delay between speakers
      } else {
        setCallingState('transcript_completed');
        addLog(`AI Voice Call qualification completed for lead: ${aiActiveLead?.name}. Collected requirements logged!`);
        // Upgrade Lead Score & Auto-schedule appointment
        if (aiActiveLead) {
          setLeads(prevLeads => prevLeads.map(l => {
            if (l.id === aiActiveLead.id) {
              return {
                ...l,
                leadScore: 98,
                status: 'Qualified',
                lastActivity: 'Qualified via AI Voice Agent conversation'
              };
            }
            return l;
          }));
        }
      }
    };
    setTimeout(addTranscriptLine, 1000);
  };

  // Recharts mock datasets
  const funnelData = [
    { name: 'Total Leads Sourced', value: totalLeads },
    { name: 'Contacted Base', value: leads.filter(l => l.status !== 'New').length },
    { name: 'Qualified Opportunities', value: qualifiedLeads },
    { name: 'Won Orders Handover', value: Math.max(1, qualifiedLeads - 1) },
  ];

  const leadSourcesData = [
    { name: 'Homepage Modal', value: leads.filter(l => l.source === 'Homepage Modal').length },
    { name: 'Chatbot Engine', value: leads.filter(l => l.source === 'Chatbot').length },
    { name: 'WhatsApp Webhook', value: leads.filter(l => l.source === 'WhatsApp').length },
    { name: 'Organic Search', value: leads.filter(l => l.source === 'Google Search' || l.source === 'Direct Traffic').length },
    { name: 'Paid Ads / Socials', value: leads.filter(l => l.source === 'Facebook Ads' || l.source === 'LinkedIn').length },
  ];

  const COLORS = ['#003366', '#0A84FF', '#FFB400', '#10B981', '#EC4899'];

  const monthlyGrowthData = [
    { month: 'Jan', Leads: 12, Revenue: 180000 },
    { month: 'Feb', Leads: 19, Revenue: 340000 },
    { month: 'Mar', Leads: 25, Revenue: 490000 },
    { month: 'Apr', Leads: 38, Revenue: 680000 },
    { month: 'May', Leads: 50, Revenue: 950000 },
    { month: 'Jun', Leads: totalLeads + 48, Revenue: totalRevenue + 1200000 },
  ];

  const productInquiryDistribution = [
    { name: 'CSCD040-HLE', value: leads.filter(l => l.productInterest === 'CSCD040-HLE').length + 5 },
    { name: '6205-C-2Z', value: leads.filter(l => l.productInterest === '6205-C-2Z').length + 8 },
    { name: 'RAE35-XL', value: leads.filter(l => l.productInterest === 'RAE35-XL' || l.productInterest === 'RAE35-XL-NPP-B-FA106').length + 4 },
    { name: 'UCP218-J7', value: leads.filter(l => l.productInterest === 'UCP218-J7').length + 3 },
    { name: 'Slewing Drives', value: leads.filter(l => l.productInterest === 'VU140325').length + 2 },
  ];

  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const filteredCrmLeads = leads.filter(l => {
    return l.name.toLowerCase().includes(leadSearchQuery.toLowerCase()) || 
           l.company.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
           l.productInterest.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
           l.status.toLowerCase().includes(leadSearchQuery.toLowerCase());
  });

  return (
    <div className="bg-[#F8F9FA] text-[#333333] min-h-[820px] rounded-lg border border-[#E5E7EB] flex flex-col md:flex-row overflow-hidden shadow-md font-sans" id="crm-main bg">
      
      {/* LEFT COMPACT RAIL COLUMN: CRM SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#222222] text-slate-300 border-r border-slate-800 flex flex-col justify-between p-4 gap-4">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-800/50 border-l-4 border-[#F4C542] rounded-sm">
            <Layers className="w-5 h-5 text-[#F4C542]" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">UE Industrial Sourcing</h3>
              <p className="text-[9px] text-[#F4C542] font-mono leading-none">HubSpot + Salesforce v1.6</p>
            </div>
          </div>

          <nav className="space-y-1">
            <span className="block text-[9px] font-black tracking-widest text-slate-500 uppercase px-2 py-1">Lead Management</span>
            {[
              { id: 'dashboard', label: 'CRM Dashboard', icon: TrendingUp },
              { id: 'leads', label: 'Lead Funnel Table', icon: Users },
              { id: 'customers', label: 'Client Accounts', icon: CheckCircle },
              { id: 'products', label: 'Bearing Inventory', icon: Layers },
              { id: 'quotes', label: 'Lead Quotations', icon: FileText },
            ].map((subTab) => {
              const Icon = subTab.icon;
              return (
                <button
                  key={subTab.id}
                  onClick={() => setActiveSubTab(subTab.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-sm uppercase tracking-wider transition ${
                    activeSubTab === subTab.id 
                    ? 'bg-[#F4C542] text-[#222222] border-r-4 border-[#222222]' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {subTab.label}
                </button>
              );
            })}

            <span className="block text-[9px] font-black tracking-widest text-slate-500 uppercase px-2 py-1 mt-4">Automations & AI</span>
            {[
              { id: 'appointments', label: 'CRM Meetings', icon: CalendarIcon },
              { id: 'calendar', label: 'Calendar Planner', icon: CalendarIcon },
              { id: 'automation', label: 'Workflow Rules', icon: Zap },
              { id: 'ai-agent', label: 'AI Voice Agent', icon: Bot },
              { id: 'analytics', label: 'Growth Reports', icon: Code },
              { id: 'settings', label: 'Operator Settings', icon: SettingsIcon }
            ].map((subTab) => {
              const Icon = subTab.icon;
              return (
                <button
                  key={subTab.id}
                  onClick={() => setActiveSubTab(subTab.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-sm uppercase tracking-wider transition ${
                    activeSubTab === subTab.id 
                    ? 'bg-[#F4C542] text-[#222222] border-r-4 border-[#222222]' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {subTab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 border-t border-slate-800 pt-4">
          <button
            onClick={onBackToCatalog}
            className="w-full bg-[#003366] hover:bg-[#002244] text-[#F4C542] font-black tracking-wider text-[10px] py-2 rounded-sm border border-slate-800 uppercase text-center cursor-pointer block"
          >
            ← Sourcing Catalog
          </button>
          <div className="bg-slate-900 rounded p-2 text-center text-[10px] font-mono text-slate-400">
            Operator ID: {crmSettings.fullName.split(' ')[0]}
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CRM FIELD CONTAINER */}
      <main className="flex-1 bg-[#F8F9FA] p-4 sm:p-6 overflow-y-auto space-y-6 flex flex-col justify-between text-[#333333]">
        
        {/* --- HEADER ZONE WITH QUICK TELEMETRY METRIC LOGS --- */}
        <div>
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase text-[#222222] tracking-tight flex items-center gap-2">
                <Layers className="w-6 h-6 text-[#F4C542]" />
                Universal Enterprise Integrated CRM Desk
              </h2>
              <p className="text-slate-500 text-xs font-semibold">
                Industrial client management pipeline with automated tele-qualification, SMS alerts, and lead source analytics.
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleDownloadCSV}
                className="bg-white hover:bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] px-4 py-2.5 rounded flex items-center gap-1.5 border border-[#E5E7EB] transition shadow-xs cursor-pointer"
                title="Download entire CRM list (leads, customers, and product inquiries) as CSV"
                id="btn-download-csv-global"
              >
                <Download className="w-3.5 h-3.5 text-[#003366]" /> Download CSV
              </button>
              <button 
                onClick={() => addLog('Synchronized database refresh completed successfully.')}
                className="bg-white hover:bg-slate-50 text-slate-700 p-2.5 rounded border border-[#E5E7EB] shadow-xs cursor-pointer transition"
                title="Refresh CRM Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setNewLeadModal(true)}
                className="bg-[#F4C542] hover:bg-[#e0b434] text-[#222222] font-semibold uppercase text-[11px] px-4 py-2.5 rounded flex items-center gap-1 border-b-2 border-amber-600 transition shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Log Custom Sourcing Lead
              </button>
            </div>
          </header>

          {/* --- SUB TAB 1: DASHBOARD METRICS & CHARTS --- */}
          {activeSubTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Dynamic Metric Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white p-5 rounded-lg border border-[#E5E7EB] shadow-xs flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Leads Database</span>
                    <span className="text-2xl sm:text-3xl font-bold text-[#222222]">{totalLeads}</span>
                    <span className="text-xs text-[#16A34A] font-semibold block mt-1">↑ 18.2% Sourcing MoM</span>
                  </div>
                  <div className="bg-[#003366]/10 text-[#003366] p-3 rounded-full">
                    <Users className="w-5 h-5 text-[#003366]" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-[#E5E7EB] shadow-xs flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Qualified Leads</span>
                    <span className="text-2xl sm:text-3xl font-bold text-[#222222]">{qualifiedLeads}</span>
                    <span className="text-xs text-[#16A34A] font-semibold block mt-1">Conversion: {conversionRate}%</span>
                  </div>
                  <div className="bg-[#16A34A]/10 text-[#16A34A] p-3 rounded-full">
                    <CheckCircle className="w-5 h-5 text-[#16A34A]" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-[#E5E7EB] shadow-xs flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estimated Value</span>
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900">₹{(totalRevenue / 100000).toFixed(1)}L</span>
                    <span className="text-xs text-[#16A34A] font-bold block mt-1">Active Pipeline Value</span>
                  </div>
                  <div className="bg-[#F59E0B]/10 text-[#F59E0B] p-3 rounded-full">
                    <DollarSign className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-[#E5E7EB] shadow-xs flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Automation Triggers</span>
                    <span className="text-2xl sm:text-3xl font-bold text-[#222222]">{quoteRequestsCount}</span>
                    <span className="text-xs text-blue-600 font-semibold block mt-1">Logs: 4 Active Hooks</span>
                  </div>
                  <div className="bg-blue-100/60 text-blue-600 p-3 rounded-full">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

              </div>

              {/* Graphical analytical block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1. Lead Funnel Stage Distribution */}
                <div className="lg:col-span-12 xl:col-span-5 bg-white p-5 rounded-lg border border-[#E5E7EB] shadow-xs space-y-4 hover:shadow-md transition">
                  <div>
                    <h3 className="text-sm font-bold uppercase text-[#222222] tracking-tight flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#F4C542]" /> Real-time Lead Funnel Conversion
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Visualization of current customer milestones from initial landing to final contract win.</p>
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={funnelData} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" stroke="#64748b" />
                        <YAxis dataKey="name" type="category" stroke="#64748b" width={110} tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', color: '#333333' }} />
                        <Bar dataKey="value" fill="#0A84FF" radius={[0, 4, 4, 0]}>
                          {funnelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Sourcing Channel Distribution PIE CHART */}
                <div className="lg:col-span-12 xl:col-span-7 bg-white p-5 rounded-lg border border-[#E5E7EB] shadow-xs space-y-4 hover:shadow-md transition">
                  <div>
                    <h3 className="text-sm font-bold uppercase text-[#222222] tracking-tight flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-[#003366]" /> Sourcing Lead Acquisition Channel Distribution
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Breakdown of inquiry pathways mapping Facebook, Direct Traffic, WhatsApp, and Home Modal sources.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-7 h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={leadSourcesData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={75}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {leadSourcesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', color: '#222222' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="md:col-span-5 space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Acquisition Channels</h4>
                      {leadSourcesData.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-mono">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                            {entry.name}
                          </span>
                          <span className="text-[#222222] font-semibold">{entry.value} lead{entry.value !== 1 ? 's' : ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* --- SUB TAB 2: LEAD TABLE CONSOLE --- */}
          {activeSubTab === 'leads' && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5 space-y-4 shadow-xs hover:shadow-md transition">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold uppercase text-[#222222]">Active Procurement Leads Funnel</h3>
                  <p className="text-[11px] text-slate-500">Total of {filteredCrmLeads.length} leads logged from multiple channels. Click to trigger AI Voice simulations or change pipeline statuses.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button 
                    onClick={handleDownloadCSV}
                    className="bg-white hover:bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] px-3.5 py-1.5 rounded flex items-center gap-1.5 border border-[#E5E7EB] transition shadow-xs cursor-pointer"
                    title="Export all records (leads, customers, and product inquiries) as CSV"
                    id="btn-download-csv-leads-tab"
                  >
                    <Download className="w-3.5 h-3.5 text-[#003366]" /> Download CSV
                  </button>
                  <div className="relative w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search leads (e.g. Reliance, Swamy)"
                      value={leadSearchQuery}
                      onChange={(e) => setLeadSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Lead Table */}
              <div className="overflow-x-auto border border-[#E5E7EB] rounded">
                <table className="w-full text-left text-xs divide-y divide-[#E5E7EB] min-w-[900px]">
                  <thead className="bg-[#F8F9FA] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Lead / ID</th>
                      <th className="px-4 py-3">Contact Details</th>
                      <th className="px-4 py-3">Company / Org</th>
                      <th className="px-4 py-3 text-center">Interest / Part</th>
                      <th className="px-4 py-3 text-center">Channel Source</th>
                      <th className="px-4 py-3 text-center">Score</th>
                      <th className="px-4 py-3 text-center">Lead Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] bg-white font-medium text-slate-700">
                    {filteredCrmLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3.5">
                          <span className="text-[9px] font-mono font-bold text-[#222222] bg-[#F4C542]/45 px-1.5 py-0.5 rounded mr-2">{lead.id}</span>
                          <span className="font-bold text-slate-900 text-xs">{lead.name}</span>
                          <span className="block text-[9px] text-slate-400 font-mono mt-0.5">Sourced: {lead.createdDate}</span>
                        </td>
                        <td className="px-4 py-3.5 space-y-0.5">
                          <span className="block text-slate-800 font-mono font-semibold">{lead.mobile}</span>
                          <span className="block text-slate-400 text-[10px]">{lead.email}</span>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-800">
                          {lead.company}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="bg-[#003366]/10 text-[#003366] border border-[#003366]/20 text-[10px] px-2 py-0.5 font-mono rounded select-all font-bold">
                            {lead.productInterest}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-block bg-[#F8F9FA] text-slate-600 border border-[#E5E7EB] text-[10px] px-2 py-1 rounded">
                            {lead.source}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`font-mono font-bold text-xs ${lead.leadScore >= 80 ? 'text-[#16A34A]' : 'text-[#F59E0B]'}`}>
                            {lead.leadScore} / 100
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                            className={`text-[10px] px-2 py-1 font-bold rounded uppercase border tracking-wider transition cursor-pointer ${
                              lead.status === 'Qualified' ? 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]' :
                              lead.status === 'Contacted' ? 'bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF]' :
                              lead.status === 'Lost' ? 'bg-red-500/10 text-red-500 border-red-500' :
                              'bg-amber-100 text-amber-700 border-[#F4C542]'
                            }`}
                          >
                            <option value="New" className="bg-white text-slate-800">New</option>
                            <option value="Contacted" className="bg-white text-slate-800">Contacted</option>
                            <option value="Qualified" className="bg-white text-slate-800">Qualified</option>
                            <option value="Lost" className="bg-white text-slate-800">Lost</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-1.5 space-y-1">
                          <button
                            onClick={() => handleCallSimulation(lead)}
                            className="bg-[#0A84FF] hover:bg-[#0070df] text-white p-1.5 rounded transition inline-flex items-center justify-center cursor-pointer"
                            title="Trigger Outbound AI Qualify Call"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              addLog(`Scheduled immediate follow-up task triggered for ${lead.name}`);
                              addLog(`Simulated calendar action sent: Created custom meeting slot.`);
                            }}
                            className="bg-[#F4C542] hover:bg-[#e0b434] text-[#222222] p-1.5 rounded transition inline-flex items-center justify-center font-bold shadow-xs cursor-pointer"
                            title="Create follow up task"
                          >
                            <Zap className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* --- SUB TAB 3: CLIENT ACCOUNTS (CLOSED OWN) --- */}
          {activeSubTab === 'customers' && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5 space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm font-bold uppercase text-[#222222]">Authorized Client Accounts</h3>
                <p className="text-[11px] text-slate-500">These are verified industrial accounts who have completed procurement compliance or have ongoing credit lines with Universal Enterprise.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.filter(l => l.status === 'Qualified').map(customer => (
                  <div key={customer.id} className="bg-slate-50 p-4 border border-[#E5E7EB] rounded space-y-3 shadow-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{customer.company}</h4>
                        <span className="text-[10px] text-slate-500 block font-mono">Account Key: UE-ACC-{customer.id}</span>
                      </div>
                      <span className="bg-[#16A34A]/10 text-[#16A34A] font-bold border border-[#16A34A] rounded-full px-2.5 py-0.5 text-[9px] uppercase tracking-wider">
                        ACTIVE PROCUREMENT
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-600 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sourcing Manager: {customer.name} ({customer.mobile})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>Core component interest: <strong className="text-slate-800 font-extrabold">{customer.productInterest}</strong></span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-[#E5E7EB] text-[10px] font-bold uppercase">
                      <button className="flex-1 bg-[#222222] text-white py-1.5 rounded hover:bg-[#333333] transition cursor-pointer">
                        View Order Logs
                      </button>
                      <button className="flex-1 bg-[#F4C542] text-[#222222] py-1.5 rounded hover:bg-[#e0b434] transition border-b border-amber-600 cursor-pointer">
                        Dispatch New Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SUB TAB 4: MOCK INVENTORY CONTROL --- */}
          {activeSubTab === 'products' && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5 space-y-4 shadow-xs">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold uppercase text-[#222222]">Authorized FAG & INA Database Inventory</h3>
                  <p className="text-[11px] text-slate-500">Direct control over active listing parameters, stock status thresholds, and prices.</p>
                </div>
                <div className="text-xs bg-slate-50 font-mono text-slate-600 p-2.5 rounded border border-[#E5E7EB]">
                  Total bearing lines in local database: <strong className="text-[#003366] font-extrabold">{productsList.length}</strong>
                </div>
              </div>

              <div className="overflow-x-auto border border-[#E5E7EB] rounded">
                <table className="w-full text-left text-xs divide-y divide-[#E5E7EB] min-w-[700px]">
                  <thead className="bg-[#F8F9FA] text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Part Number</th>
                      <th className="px-4 py-3">Manufacturer Brand</th>
                      <th className="px-4 py-3">Category Classification</th>
                      <th className="px-4 py-3 text-center">Unit Price (INR)</th>
                      <th className="px-4 py-3 text-center">Real-time Stock</th>
                      <th className="px-4 py-3 text-right">Sourcing Origin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] font-medium text-slate-700 bg-white">
                    {productsList.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono font-bold text-[#222222] text-xs select-all">
                          {product.partNumber}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase border tracking-widest ${
                            product.brand === 'FAG' ? 'text-[#F59E0B] bg-amber-500/10 border-[#F59E0B]/20' : 'text-[#0A84FF] bg-blue-500/10 border-blue-500/20'
                          }`}>
                            {product.brand}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{product.category}</td>
                        <td className="px-4 py-3 text-center font-mono text-[#222222] font-semibold">₹{product.price.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block text-[11px] font-bold ${
                            product.stockCount > 20 ? 'text-[#16A34A]' : 'text-[#F59E0B]'
                          }`}>
                            {product.stockCount} Units
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-300">{product.countryOfOrigin || 'Germany'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- SUB TAB 5: LEAD QUOTATIONS --- */}
          {activeSubTab === 'quotes' && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5 space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm font-bold uppercase text-[#222222]">Quoting & Logistics Tracking System</h3>
                <p className="text-[11px] text-slate-500">Verifying customer status, double-layer packing logs, and BlueDart carrier schedules.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded border border-[#E5E7EB] space-y-3 shadow-xs">
                  <div className="flex flex-wrap justify-between items-center border-b border-[#E5E7EB] pb-2">
                    <div>
                      <span className="bg-[#F4C542] text-[#222222] font-semibold text-[10px] px-2 py-0.5 rounded mr-2 font-mono">UE-885402</span>
                      <strong className="text-slate-800 text-xs uppercase">Reliance Industries Ltd</strong>
                    </div>
                    <span className="text-[#16A34A] text-[11px] font-bold">In Transit via Air Cargo</span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p>Sourced items: <strong className="text-slate-800 font-mono">16001JRX FAG bearings (QTY: 15)</strong></p>
                    <p>Carrier tracker: <strong className="text-slate-800 select-all font-mono">AWB #BD-884021 [BlueDart Express]</strong></p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded border border-[#E5E7EB] space-y-3 shadow-xs">
                  <div className="flex flex-wrap justify-between items-center border-b border-[#E5E7EB] pb-2">
                    <div>
                      <span className="bg-[#F4C542] text-[#222222] font-semibold text-[10px] px-2 py-0.5 rounded mr-2 font-mono">UE-115049</span>
                      <strong className="text-slate-800 text-xs uppercase">Mahindra & Mahindra Plant III</strong>
                    </div>
                    <span className="text-[#F59E0B] text-[11px] font-bold">Custom Packaging Prep</span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p>Sourced items: <strong className="text-slate-800 font-mono">UCP218-J7 FAG Pillow block (QTY: 4)</strong></p>
                    <p>Milestone status: <strong className="text-slate-600">Vacuum moisture palletizing applied for Pune transit corridor.</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- SUB TAB 6: CRM APPOINTMENTS & MEETINGS --- */}
          {activeSubTab === 'appointments' && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5 space-y-4 shadow-xs">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold uppercase text-[#222222]">Enterprise Procurement Meetings Calendar</h3>
                  <p className="text-[11px] text-slate-500">All scheduled consultations and contract reviews synchronized from the lead pipeline.</p>
                </div>
                <button
                  onClick={() => setNewApptModal(true)}
                  className="bg-[#0A84FF] hover:bg-[#0070df] text-white font-bold uppercase text-[11px] px-3.5 py-2 rounded shadow-xs cursor-pointer"
                >
                  Schedule meeting
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.map((appt) => (
                  <div key={appt.id} className="bg-slate-50 p-4 rounded border border-[#E5E7EB] space-y-3 shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="bg-[#F4C542]/30 text-amber-900 rounded px-2 py-0.5 font-bold text-[9px] uppercase tracking-wider">{appt.type}</span>
                      <span className="text-[10px] text-slate-500">{appt.dateTime.replace('T', ' ')}</span>
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-extrabold text-sm">{appt.leadName}</h4>
                      <p className="text-xs text-slate-500">{appt.company}</p>
                    </div>
                    <div className="flex items-center gap-2 border-t border-[#E5E7EB] pt-2 text-[10px] font-bold text-slate-500">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                      <span>Scheduled — Google Calendar Track ID: {appt.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SUB TAB 7: CALENDAR PLANNER & GOOGLE SYNC --- */}
          {activeSubTab === 'calendar' && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5 space-y-4 shadow-xs">
              <div className="flex justify-between items-center flex-wrap gap-4 border-b border-[#E5E7EB] pb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase text-[#222222]">Interactive Sourcing Calendar</h3>
                  <p className="text-[11px] text-slate-500">View upcoming client appointments, contract closings, and followups interactively.</p>
                </div>
                
                {/* Google Calendar Sync Selector */}
                <div className="bg-slate-50 p-2.5 rounded border border-[#E5E7EB] flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${crmSettings.googleSyncEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-xs text-slate-600 font-mono">Google Calendar Sync</span>
                  </div>
                  <button
                    onClick={() => {
                      const updated = !crmSettings.googleSyncEnabled;
                      setCrmSettings({
                        ...crmSettings,
                        googleSyncEnabled: updated,
                        lastSyncTime: updated ? new Date().toLocaleString() : crmSettings.lastSyncTime
                      });
                      addLog(`Google Calendar Sync status toggled to: ${updated ? 'ENABLED' : 'DISABLED'}`);
                    }}
                    className={`text-[9px] font-bold uppercase px-2.5 py-1.5 rounded transition cursor-pointer ${
                      crmSettings.googleSyncEnabled ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#16A34A] hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {crmSettings.googleSyncEnabled ? 'Disable Sync' : 'Enable Sync'}
                  </button>
                </div>
              </div>

              {/* Simple Mock Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="bg-slate-100 p-2 font-bold uppercase text-[10px] text-slate-600 tracking-wider border border-[#E5E7EB]">
                    {day}
                  </div>
                ))}
                
                {/* Seed a clean grid of 28 blocks represent June */}
                {Array.from({ length: 28 }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayString = `2026-06-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                  const dailyAppts = appointments.filter(a => a.dateTime.startsWith(dayString));
                  return (
                    <div key={i} className="bg-slate-50/50 p-2.5 rounded border border-[#E5E7EB] min-h-20 text-left flex flex-col justify-between">
                      <span className="text-slate-400 font-bold text-[10px]">{dayNum}</span>
                      <div className="space-y-1">
                        {dailyAppts.map((appt) => (
                          <div 
                            key={appt.id} 
                            className="bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/20 p-1 rounded-[2px] text-[9px] leading-tight font-bold truncate"
                            title={`${appt.leadName} (${appt.type})`}
                          >
                            ☎️ {appt.leadName.split(' ')[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- SUB TAB 8: WORKFLOW ACTION RULES --- */}
          {activeSubTab === 'automation' && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5 space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm font-bold uppercase text-[#222222]">CRM Sourcing Automation Rules Engine</h3>
                <p className="text-[11px] text-slate-500">Trigger actions instantly when leads arrive from your digital assets. Zero-delay outbound communication channels.</p>
              </div>

              <div className="space-y-3">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="bg-slate-50 p-4 rounded border border-[#E5E7EB] flex justify-between items-center gap-4 flex-wrap shadow-xs">
                    <div className="space-y-1 max-w-xl">
                      <span className="bg-[#F4C542] text-[#222222] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono">
                        Rule {rule.id}
                      </span>
                      <p className="text-xs text-slate-800">
                        <strong className="text-[#0A84FF]">TRIGGER: </strong> {rule.trigger}
                      </p>
                      <p className="text-xs text-slate-600">
                        <strong className="text-[#16A34A]">IMMEDIATE ACTION: </strong> {rule.action}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono leading-none ${rule.enabled ? 'text-[#16A34A] font-bold' : 'text-red-500'}`}>
                        {rule.enabled ? '● Rules Active' : '○ Standby'}
                      </span>
                      <button
                        onClick={() => {
                          setAutomationRules(automationRules.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r));
                          addLog(`Automation Rule ${rule.id} status updated.`);
                        }}
                        className={`text-[9px] font-bold uppercase px-2.5 py-1.5 rounded cursor-pointer transition ${
                          rule.enabled ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : 'bg-[#F4C542] text-[#222222] hover:bg-[#e0b434]'
                        }`}
                      >
                        {rule.enabled ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SUB TAB 9: AI CALLING AGENT SIMULATOR --- */}
          {activeSubTab === 'ai-agent' && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5 space-y-4 shadow-xs">
              <div className="border-b border-[#E5E7EB] pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold uppercase text-[#222222]">AI Outbound Vocal Calling & Qualification Simulator</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Trigger simulated voice calls trained on high performance FAG & INA engineering directories.</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <select
                    value={aiActiveLead?.id || ''}
                    onChange={(e) => {
                      const match = leads.find(l => l.id === e.target.value);
                      if (match) setAiActiveLead(match);
                    }}
                    className="text-xs p-2 bg-slate-50 border border-[#E5E7EB] rounded text-slate-800 font-bold bg-white"
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id} className="text-slate-800">{l.name} ({l.company})</option>
                    ))}
                  </select>

                  <button
                    onClick={() => aiActiveLead && handleTriggerAiCal(aiActiveLead)}
                    disabled={callingState === 'dialing' || callingState === 'connected'}
                    className={`font-bold uppercase text-[10px] px-4 py-2 border transition flex items-center gap-1.5 shadow-xs transition rounded ${
                      callingState === 'dialing' || callingState === 'connected'
                      ? 'bg-slate-100 text-slate-400 border-slate-200'
                      : 'bg-[#16A34A] text-white border-[#16A34A] hover:bg-emerald-600 cursor-pointer'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" /> Outbound Call Simulation
                  </button>
                </div>
              </div>

              {/* Call stage container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Operational console */}
                <div className="lg:col-span-4 bg-slate-50 p-4 rounded border border-[#E5E7EB] flex flex-col justify-between space-y-4 shadow-xs">
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-white rounded border border-[#E5E7EB] space-y-3 shadow-xs">
                      <div className="relative inline-block">
                        <div className={`w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center border-2 mx-auto ${
                          callingState === 'connected' ? 'border-[#16A34A] animate-pulse' : 'border-[#E5E7EB]'
                        }`}>
                          <Bot className="w-8 h-8 text-[#003366]" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Agent Line Active</h4>
                        <p className="text-xs text-slate-800 font-mono font-bold">UE_AI_VOICE_CALL_V2</p>
                      </div>

                      {/* State badge */}
                      <div>
                        {callingState === 'idle' && (
                          <span className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">Standby</span>
                        )}
                        {callingState === 'dialing' && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded animate-bounce">Dialing ({dialProgress}%)</span>
                        )}
                        {callingState === 'connected' && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">Live Call Inbound</span>
                        )}
                        {callingState === 'transcript_completed' && (
                          <span className="bg-blue-100 text-blue-800 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">Completed Session</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700">
                      <p>Selected Calibrator: <strong className="text-slate-900">{aiActiveLead?.name}</strong></p>
                      <p>Target Phone: <strong className="text-slate-900 font-mono">{aiActiveLead?.mobile}</strong></p>
                      <p className="font-semibold text-slate-600 mt-2">Collects requirements, grades score value, records appointment slots on calendar.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setCallingState('idle')}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[10px] uppercase font-bold py-2 rounded transition cursor-pointer"
                  >
                    Force Hangup Active
                  </button>
                </div>

                {/* Simulated transcript text */}
                <div className="lg:col-span-8 bg-slate-50 p-4 rounded border border-[#E5E7EB] flex flex-col justify-between min-h-[320px] shadow-xs">
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Simulated Qualification Log</span>
                    
                    {aiTranscripts.length === 0 && (
                      <div className="text-center py-12 text-slate-400">
                        <Phone className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-bounce" />
                        <p className="text-xs">Select a lead above and click the outbound button to launch simulated AI voice call qualification sequence.</p>
                      </div>
                    )}

                    {aiTranscripts.map((t, idx) => (
                      <div key={idx} className={`p-2.5 rounded text-xs leading-relaxed max-w-[85%] shadow-xs border ${
                        t.speaker === 'AI Agent' 
                        ? 'bg-blue-50/70 border-l-2 border-[#F4C542] border-[#E5E7EB] pl-3 self-start' 
                        : 'bg-white border-l-2 border-slate-300 border-[#E5E7EB] pl-3 ml-auto text-right'
                      }`}>
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <span className={`font-bold text-[9px] uppercase tracking-wider ${
                            t.speaker === 'AI Agent' ? 'text-blue-700' : 'text-slate-600'
                          }`}>
                            {t.speaker}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">{t.time}</span>
                        </div>
                        <p className="text-slate-800">{t.text}</p>
                      </div>
                    ))}
                  </div>

                  {callingState === 'transcript_completed' && (
                    <div className="bg-emerald-500/10 p-3 rounded border border-emerald-500/20 text-xs text-emerald-400 font-semibold mt-4">
                      ✓ AI qualification call session successfully completed. Lead score updated to 98. Sourcing appointment recorded on calendar stack.
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* --- SUB TAB 10: GROWTH ANALYTICS REPORTS --- */}
          {activeSubTab === 'analytics' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Monthly growth timeseries line graph */}
                <div className="bg-white p-5 rounded-lg border border-[#E5E7EB] space-y-3 shadow-xs hover:shadow-md transition">
                  <div>
                    <h3 className="text-sm font-bold uppercase text-[#222222] tracking-tight">Monthly Sourcing Volume Growth Time-series</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Active trend tracking cumulative inbound lead captures.</p>
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyGrowthData} margin={{ left: 5, right: 10, top: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: '#333333', border: '1px solid #E5E7EB' }} />
                        <Legend />
                        <Line type="monotone" dataKey="Leads" stroke="#F4C542" strokeWidth={3} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Product component interest distribution */}
                <div className="bg-white p-5 rounded-lg border border-[#E5E7EB] space-y-3 shadow-xs hover:shadow-md transition">
                  <div>
                    <h3 className="text-sm font-bold uppercase text-[#222222] tracking-tight">Active Component Sourcing Interest Distribution</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Active inquiries grouped by exact bearing model families.</p>
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productInquiryDistribution} margin={{ left: 5, right: 10, top: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} />
                        <YAxis stroke="#64748b" />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: '#333333', border: '1px solid #E5E7EB' }} />
                        <Bar dataKey="value" fill="#0A84FF" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* --- SUB TAB 11: OPERATOR SETTINGS --- */}
          {activeSubTab === 'settings' && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 space-y-6 shadow-xs">
              <div>
                <h3 className="text-sm font-bold uppercase text-[#222222]">Admin Profile & System Settings</h3>
                <p className="text-[11px] text-slate-500">Configure outbound caller integrations, name mapping, and sync schedules.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Profile Avatar Card */}
                <div className="md:col-span-4 bg-slate-50 p-5 rounded border border-[#E5E7EB] flex flex-col items-center justify-center text-center space-y-4 shadow-xs">
                  <img
                    src={crmSettings.profilePic}
                    alt="Admin Avatar"
                    className="w-24 h-24 rounded-full border-4 border-[#F4C542] object-cover"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{crmSettings.fullName}</h4>
                    <p className="text-xs text-[#0A84FF] font-mono leading-none">{crmSettings.position}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{crmSettings.companyName}</p>
                  </div>
                  <button className="bg-white hover:bg-slate-100 text-slate-700 text-[10px] uppercase font-bold px-4 py-2 rounded border border-[#E5E7EB] shadow-xs cursor-pointer">
                    Upload Photo
                  </button>
                </div>

                {/* Form fields */}
                <div className="md:col-span-8 bg-slate-50 p-5 rounded border border-[#E5E7EB] space-y-4 shadow-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Full Operator Name</label>
                      <input
                        type="text"
                        value={crmSettings.fullName}
                        onChange={(e) => setCrmSettings({ ...crmSettings, fullName: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-[#E5E7EB] rounded font-bold text-slate-800 focus:ring-1 focus:ring-[#F4C542] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Corporate Email</label>
                      <input
                        type="email"
                        value={crmSettings.email}
                        onChange={(e) => setCrmSettings({ ...crmSettings, email: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-[#E5E7EB] rounded font-bold text-slate-800 focus:ring-1 focus:ring-[#F4C542] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Phone</label>
                      <input
                        type="text"
                        value={crmSettings.mobile}
                        onChange={(e) => setCrmSettings({ ...crmSettings, mobile: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-[#E5E7EB] rounded font-bold text-slate-800 focus:ring-1 focus:ring-[#F4C542] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Position / Title</label>
                      <input
                        type="text"
                        value={crmSettings.position}
                        onChange={(e) => setCrmSettings({ ...crmSettings, position: e.target.value })}
                        className="w-full text-xs p-2.5 bg-white border border-[#E5E7EB] rounded font-bold text-slate-800 focus:ring-1 focus:ring-[#F4C542] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-[#E5E7EB]">
                    <button
                      onClick={() => {
                        addLog('Operator system profile settings updated successfully in local storage.');
                      }}
                      className="bg-[#F4C542] hover:bg-[#e0b434] text-[#222222] font-extrabold uppercase text-xs px-6 py-3 rounded shadow-xs leading-none transition cursor-pointer"
                    >
                      Save Profile Specs
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* --- DYNAMIC COLLAPSIBLE TELEMETRY LOGS SCREEN (BOTTOM STATUS BAR) --- */}
        <div className="bg-white rounded border border-[#E5E7EB] p-3 space-y-2 mt-4 select-none shadow-xs">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            <span>● Dynamic CRM Webhook Activity Logs</span>
            <span className="font-mono text-[#16A34A] lowercase">live synchronization active</span>
          </div>
          <div className="h-20 overflow-y-auto text-[9px] font-mono text-slate-600 space-y-1 scrollbar-thin scrollbar-thumb-[#E5E7EB]">
            {logs.map((logStr, idx) => (
              <div key={idx} className="truncate pl-2 border-l-2 border-[#E5E7EB] hover:border-[#F4C542] transition-colors">
                {logStr}
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* --- MOCK MODAL: LOG NEW LEAD --- */}
      {newLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 max-w-md w-full text-slate-800 space-y-4 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            <button 
              onClick={() => setNewLeadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-sm font-bold uppercase text-[#222222] tracking-wider flex items-center gap-1.5">
                <Users className="w-5 h-5 text-[#F4C542]" /> Log Custom Sourcing Lead
              </h3>
              <p className="text-[11px] text-slate-500">Pushed to CRM database for multi-channel automation routing.</p>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs text-left">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-slate-500">Contact Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-[#E5E7EB] rounded font-bold text-slate-800 focus:ring-1 focus:ring-[#F4C542] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 99999 55555"
                    value={leadForm.mobile}
                    onChange={(e) => setLeadForm({ ...leadForm, mobile: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-[#E5E7EB] rounded font-bold text-slate-800 focus:ring-1 focus:ring-[#F4C542] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Customer Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-[#E5E7EB] rounded font-bold text-slate-800 focus:ring-1 focus:ring-[#F4C542] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-slate-500">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reliance Industries, Pune Plant"
                  value={leadForm.company}
                  onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-[#E5E7EB] rounded font-bold text-slate-800 focus:ring-1 focus:ring-[#F4C542] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Lead Sourcing Channel</label>
                  <select
                    value={leadForm.source}
                    onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value as any })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-[#E5E7EB] rounded font-bold text-slate-800 focus:ring-1 focus:ring-[#F4C542] focus:outline-none"
                  >
                    <option value="Direct Traffic">Direct Traffic</option>
                    <option value="Google Search">Google Organic</option>
                    <option value="Homepage Modal">Homepage Modal</option>
                    <option value="Chatbot">Chatbot Conversion</option>
                    <option value="AI Voice Agent">AI Vocal Outbound</option>
                    <option value="WhatsApp">WhatsApp Webhook</option>
                    <option value="LinkedIn">LinkedIn B2B</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Initially Interested Part</label>
                  <select
                    value={leadForm.productInterest}
                    onChange={(e) => setLeadForm({ ...leadForm, productInterest: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-[#E5E7EB] rounded font-bold text-slate-800 focus:ring-1 focus:ring-[#F4C542] focus:outline-none font-mono"
                  >
                    {productsList.map(p => (
                      <option key={p.id} value={p.partNumber}>{p.partNumber} ({p.brand})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-slate-500">Additional Sourcing Notes</label>
                <textarea
                  placeholder="e.g. Needs pricing for 50 pieces dispatch."
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-[#E5E7EB] rounded font-semibold text-slate-800 focus:ring-1 focus:ring-[#F4C542] focus:outline-none min-h-12"
                />
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setNewLeadModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase py-3 rounded shadow-xs leading-none transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#F4C542] hover:bg-[#e0b434] text-[#222222] font-extrabold uppercase py-3 rounded shadow-xs leading-none border-b-2 border-amber-600 transition cursor-pointer"
                >
                  Save Sourcing Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MOCK MODAL: BOOK APPOINTMENT --- */}
      {newApptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 max-w-sm w-full text-slate-800 space-y-4 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            <button 
              onClick={() => setNewApptModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-sm font-bold uppercase text-[#222222] tracking-wider flex items-center gap-1.5">
                <CalendarIcon className="w-5 h-5 text-[#0A84FF]" /> Book Sourcing Consultation
              </h3>
              <p className="text-[11px] text-slate-500">Pushes scheduled invite directly to synced channels.</p>
            </div>

            <form onSubmit={handleCreateAppt} className="space-y-4 text-xs text-left">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-slate-500">Select Customer Lead *</label>
                <select
                  value={apptForm.leadId}
                  onChange={(e) => setApptForm({ ...apptForm, leadId: e.target.value })}
                  required
                  className="w-full text-xs p-2.5 bg-slate-50 border border-[#E5E7EB] rounded font-bold text-slate-800 focus:ring-1 focus:ring-[#0A84FF] focus:outline-none"
                >
                  <option value="">-- Choose Lead --</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.company})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-slate-500">Consultation Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={apptForm.dateTime}
                  onChange={(e) => setApptForm({ ...apptForm, dateTime: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-[#E5E7EB] rounded font-bold text-slate-800 focus:ring-1 focus:ring-[#0A84FF] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-slate-500">Consultation Profile Type</label>
                <select
                  value={apptForm.type}
                  onChange={(e) => setApptForm({ ...apptForm, type: e.target.value as any })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-[#E5E7EB] rounded font-bold text-slate-800 focus:ring-1 focus:ring-[#0A84FF] focus:outline-none"
                >
                  <option value="Technical Consultation">Technical Consultation</option>
                  <option value="Quote Negotiation">Quote Negotiation</option>
                  <option value="Procurement Review">Procurement Review</option>
                  <option value="Direct Sales">Direct Sales Hub</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewApptModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase py-3 rounded shadow-xs leading-none transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0A84FF] hover:bg-[#0070df] text-white font-extrabold uppercase py-3 rounded shadow-xs leading-none transition cursor-pointer"
                >
                  Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
