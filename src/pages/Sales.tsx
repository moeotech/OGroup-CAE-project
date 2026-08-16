import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Receipt, CreditCard, AlertCircle, Plus, Search, Filter, 
  MoreVertical, CheckCircle, Clock, Send, Eye, Check, Users, UserPlus, Bot, Shuffle, 
  Settings2, Zap, Sparkles, PhoneCall, Award, Trash2, Edit3, UserCheck, RefreshCw, Sliders,
  TrendingUp, BarChart3, Target, ArrowUpRight, CheckCircle2, MessageSquare, ShoppingBag, Calendar, Share2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, PieChart, Pie, AreaChart, Area
} from 'recharts';
import CreateQuote from '../components/CreateQuote';
import QuoteLifecycle from '../components/QuoteLifecycle';
import { showToast } from '../utils/toast';

export const CHANNEL_OPTIONS = [
  { id: 'all', label: 'جميع المبيعات والقنوات', icon: '🌐', badgeColor: 'bg-slate-100 text-slate-800 border-slate-200' },
  { id: 'whatsapp', label: 'الواتساب المباشر', icon: '💬', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { id: 'booking', label: 'نماذج الحجز والموقع', icon: '📅', badgeColor: 'bg-purple-50 text-purple-800 border-purple-200' },
  { id: 'store', label: 'المتجر الإلكتروني', icon: '🛒', badgeColor: 'bg-blue-50 text-blue-800 border-blue-200' },
];

export default function Sales() {
  const [activeTab, setActiveTab] = useState<'quotes' | 'invoices' | 'team' | 'sources' | 'targets'>('targets');
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [newInvoiceData, setNewInvoiceData] = useState({
    customer: '',
    amount: 150,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'unpaid',
    type: 'طلب متجر إلكتروني'
  });
  const [sourceTimeRange, setSourceTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  const [editingTargetRep, setEditingTargetRep] = useState<any | null>(null);
  const [targetInputVal, setTargetInputVal] = useState<number>(0);
  const [commissionRate, setCommissionRate] = useState<number>(0);

  const [productsList, setProductsList] = useState<any[]>(() => {
    const stored = localStorage.getItem('crm_products');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return [
      { id: 1, name: 'باقة تبييض الأسنان المنزلي', price: 45, stock: 120, category: 'منتجات طبية', status: 'active', sales: 34, commissionRate: 5 },
      { id: 2, name: 'فرشاة كهربائية متطورة', price: 85, stock: 45, category: 'أدوات', status: 'active', sales: 128, commissionRate: 3 },
      { id: 3, name: 'غسول فم طبيعي', price: 15, stock: 0, category: 'عناية يومية', status: 'out_of_stock', sales: 412, commissionRate: 4 },
    ];
  });

  // Calculate weighted average or effective product commission rate
  const avgProductCommission = productsList.length > 0
    ? Math.round((productsList.reduce((sum, p) => sum + (p.commissionRate ?? 5), 0) / productsList.length) * 10) / 10
    : 4;

  const effectiveCommissionRate = commissionRate === 0 ? avgProductCommission : commissionRate;

  // Sales Reps & Auto-Assign state
  const defaultSalesReps = [
    { id: 'rep-1', name: 'سامر قاسم', phone: '0791112233', email: 'samer@company.com', role: 'كبير مسؤولي مبيعات', specialtyChannel: 'all', activeLeads: 18, totalLeads: 45, convertedLeads: 18, monthlyTarget: 15000, currentSales: 12400, isOnline: true, dailyLimit: 10, assignedCountToday: 4, avatar: '👨‍💼' },
    { id: 'rep-2', name: 'رانيا العبدالله', phone: '0792223344', email: 'rania@company.com', role: 'مسؤولة مبيعات المتجر', specialtyChannel: 'store', activeLeads: 22, totalLeads: 50, convertedLeads: 23, monthlyTarget: 12000, currentSales: 10800, isOnline: true, dailyLimit: 10, assignedCountToday: 5, avatar: '👩‍💼' },
    { id: 'rep-3', name: 'حمزة الشريف', phone: '0793334455', email: 'hamzah@company.com', role: 'مستشار مبيعات الحجوزات', specialtyChannel: 'booking', activeLeads: 14, totalLeads: 35, convertedLeads: 11, monthlyTarget: 10000, currentSales: 7500, isOnline: true, dailyLimit: 8, assignedCountToday: 3, avatar: '👨‍💻' },
    { id: 'rep-4', name: 'فرح الزعبي', phone: '0794445566', email: 'farah@company.com', role: 'مسؤولة مبيعات الواتساب', specialtyChannel: 'whatsapp', activeLeads: 9, totalLeads: 25, convertedLeads: 7, monthlyTarget: 8000, currentSales: 4200, isOnline: true, dailyLimit: 10, assignedCountToday: 0, avatar: '👩‍💻' },
  ];

  const defaultDistConfig = {
    enabled: true,
    strategy: 'source_based', // 'source_based' | 'round_robin' | 'load_balanced' | 'weighted'
    notifyRepOnWhatsApp: true,
    maxLeadsPerRepPerDay: 10,
    skipOfflineReps: true
  };

  const [salesReps, setSalesReps] = useState<any[]>(() => {
    const stored = localStorage.getItem('crm_sales_reps');
    if (!stored) return defaultSalesReps;
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((r: any) => ({
        ...r,
        specialtyChannel: r.specialtyChannel === 'paid_ads' ? 'store' : (r.specialtyChannel || 'all')
      }));
    } catch (e) {
      return defaultSalesReps;
    }
  });

  const [distConfig, setDistConfig] = useState(() => {
    const stored = localStorage.getItem('crm_dist_config');
    return stored ? JSON.parse(stored) : defaultDistConfig;
  });

  const [showAddRepModal, setShowAddRepModal] = useState(false);
  const [simulationAlert, setSimulationAlert] = useState<{ repName: string; leadName: string; strategy: string; channelName: string } | null>(null);
  const [testChannel, setTestChannel] = useState<'whatsapp' | 'booking' | 'store'>('whatsapp');

  const [newRep, setNewRep] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'مسؤول مبيعات',
    specialtyChannel: 'all',
    monthlyTarget: 10000,
    dailyLimit: 10
  });

  useEffect(() => {
    localStorage.setItem('crm_sales_reps', JSON.stringify(salesReps));
  }, [salesReps]);

  const teamMetrics = salesReps.map(rep => {
    const totalLeads = rep.totalLeads ?? (rep.activeLeads ? rep.activeLeads + 15 : 25);
    const convertedLeads = rep.convertedLeads ?? Math.round(totalLeads * (rep.currentSales && rep.monthlyTarget ? (rep.currentSales / rep.monthlyTarget) * 0.5 : 0.35));
    const conversionRate = totalLeads > 0 ? Number(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0;
    const targetAchievement = rep.monthlyTarget > 0 ? Number(((rep.currentSales / rep.monthlyTarget) * 100).toFixed(1)) : 0;

    return {
      ...rep,
      totalLeads,
      convertedLeads,
      conversionRate,
      targetAchievement
    };
  });

  const totalLeadsSum = teamMetrics.reduce((sum, r) => sum + r.totalLeads, 0);
  const totalConvertedSum = teamMetrics.reduce((sum, r) => sum + r.convertedLeads, 0);
  const avgConversionRate = totalLeadsSum > 0 ? Number(((totalConvertedSum / totalLeadsSum) * 100).toFixed(1)) : 0;
  const topRep = [...teamMetrics].sort((a, b) => b.conversionRate - a.conversionRate)[0];

  useEffect(() => {
    localStorage.setItem('crm_dist_config', JSON.stringify(distConfig));
  }, [distConfig]);

  const toggleRepOnline = (repId: string) => {
    setSalesReps(prev => prev.map(r => r.id === repId ? { ...r, isOnline: !r.isOnline } : r));
  };

  const handleUpdateRepChannel = (repId: string, channel: string) => {
    setSalesReps(prev => prev.map(r => r.id === repId ? { ...r, specialtyChannel: channel } : r));
  };

  const handleDeleteRep = (repId: string) => {
    if (confirm('هل أنت تأكد من إزالة هذا الموظف من فريق المبيعات؟')) {
      setSalesReps(prev => prev.filter(r => r.id !== repId));
    }
  };

  const handleAddRep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRep.name || !newRep.phone) return;

    const rep = {
      id: `rep-${Date.now()}`,
      name: newRep.name,
      phone: newRep.phone,
      email: newRep.email || `${newRep.name.replace(/\s+/g, '')}@company.com`,
      role: newRep.role,
      specialtyChannel: newRep.specialtyChannel || 'all',
      activeLeads: 0,
      monthlyTarget: Number(newRep.monthlyTarget) || 10000,
      currentSales: 0,
      isOnline: true,
      dailyLimit: Number(newRep.dailyLimit) || 10,
      assignedCountToday: 0,
      avatar: '👤'
    };

    setSalesReps([...salesReps, rep]);
    setShowAddRepModal(false);
    setNewRep({ name: '', phone: '', email: '', role: 'مسؤول مبيعات', specialtyChannel: 'all', monthlyTarget: 10000, dailyLimit: 10 });
  };

  // Simulate Lead Auto Distribution based on Channel Specialty
  const handleSimulateLeadAssign = (targetChan = testChannel) => {
    if (!distConfig.enabled) {
      showToast('نظام التوزيع التلقائي معطل حالياً. يرجى تفعيله أولاً.', 'warning', 'توزيع معطل');
      return;
    }

    const availableReps = distConfig.skipOfflineReps 
      ? salesReps.filter(r => r.isOnline && r.assignedCountToday < r.dailyLimit)
      : salesReps.filter(r => r.assignedCountToday < r.dailyLimit);

    if (availableReps.length === 0) {
      showToast('لا يوجد موظفو مبيعات متفرغون أو متواجدون أونلاين حالياً للتوزيع.', 'warning', 'لا يوجد موظفون');
      return;
    }

    let winningRep = availableReps[0];

    // Priority 1: Match Specialty Channel
    const specializedReps = availableReps.filter(r => r.specialtyChannel === targetChan);
    const generalReps = availableReps.filter(r => r.specialtyChannel === 'all' || !r.specialtyChannel);
    const candidateReps = specializedReps.length > 0 ? specializedReps : (generalReps.length > 0 ? generalReps : availableReps);

    if (distConfig.strategy === 'source_based' || specializedReps.length > 0) {
      winningRep = [...candidateReps].sort((a, b) => a.assignedCountToday - b.assignedCountToday)[0];
    } else if (distConfig.strategy === 'round_robin') {
      winningRep = [...availableReps].sort((a, b) => a.assignedCountToday - b.assignedCountToday)[0];
    } else if (distConfig.strategy === 'load_balanced') {
      winningRep = [...availableReps].sort((a, b) => a.activeLeads - b.activeLeads)[0];
    } else if (distConfig.strategy === 'weighted') {
      winningRep = [...availableReps].sort((a, b) => (b.currentSales / b.monthlyTarget) - (a.currentSales / a.monthlyTarget))[0];
    }

    // Update Rep stats
    setSalesReps(prev => prev.map(r => r.id === winningRep.id ? {
      ...r,
      assignedCountToday: r.assignedCountToday + 1,
      activeLeads: r.activeLeads + 1
    } : r));

    // Channel label mapping
    const channelNames: Record<string, string> = {
      whatsapp: 'الواتساب المباشر 💬',
      booking: 'نموذج حجز من الموقع 📅',
      store: 'المتجر الإلكتروني 🛒'
    };

    const sampleNames = ['عبدالله الخالد', 'نورة العتيبي', 'عمر حسان', 'منى السعيد', 'خالد النجّار', 'سارة الجابري'];
    const randomLeadName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    
    const existingLeads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
    const newLeadObj = {
      id: `lead-auto-${Date.now()}`,
      name: randomLeadName,
      phone: `079${Math.floor(1000000 + Math.random() * 9000000)}`,
      source: channelNames[targetChan] || 'الواتساب المباشر',
      status: 'new',
      assignedTo: winningRep.name,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('crm_leads', JSON.stringify([newLeadObj, ...existingLeads]));

    const strategyNames: Record<string, string> = {
      source_based: 'توجيه القناة التلقائي (Channel Routing)',
      round_robin: 'التوزيع بالتناوب (Round-Robin)',
      load_balanced: 'موازنة عبء العمل اليومي',
      weighted: 'التوزيع الموزون حسب الأداء'
    };

    setSimulationAlert({
      repName: winningRep.name,
      leadName: randomLeadName,
      strategy: strategyNames[distConfig.strategy] || 'محرك التوزيع الذكي',
      channelName: channelNames[targetChan] || targetChan
    });
  };

  // Dynamic Lead Source Performance Analytics Data
  const sourceAnalyticsData = React.useMemo(() => {
    const leads: any[] = JSON.parse(localStorage.getItem('crm_leads') || '[]');
    
    const baseSources = [
      {
        id: 'whatsapp',
        name: 'الواتساب المباشر',
        shortName: 'الواتساب',
        icon: '💬',
        color: '#10b981',
        baseTotal: 142,
        baseWon: 64,
        revenue: 18500,
        primaryRep: 'فرح الزعبي (مسؤولة الواتساب)',
        avgDeal: 289,
        trend: '+12.4%',
        statusText: 'أداء ممتاز 🔥'
      },
      {
        id: 'booking',
        name: 'نماذج الحجز والموقع',
        shortName: 'نماذج الحجز',
        icon: '📅',
        color: '#8b5cf6',
        baseTotal: 98,
        baseWon: 39,
        revenue: 12800,
        primaryRep: 'حمزة الشريف (مستشار الحجوزات)',
        avgDeal: 328,
        trend: '+8.1%',
        statusText: 'أداء مرتفع 📈'
      },
      {
        id: 'store',
        name: 'المتجر الإلكتروني',
        shortName: 'المتجر الإلكتروني',
        icon: '🛒',
        color: '#3b82f6',
        baseTotal: 184,
        baseWon: 84,
        revenue: 28200,
        primaryRep: 'رانيا العبدالله (مسؤولة المتجر)',
        avgDeal: 322,
        trend: '+14.3%',
        statusText: 'أعلى معدل تحويل 🎯'
      }
    ];

    return baseSources.map(src => {
      const extraLeads = leads.filter(l => {
        const s = (l.source || '').toLowerCase();
        if (src.id === 'whatsapp') return s.includes('whatsapp') || s.includes('واتساب');
        if (src.id === 'booking') return s.includes('booking') || s.includes('حجز') || s.includes('نموذج');
        if (src.id === 'store') return s.includes('store') || s.includes('متجر');
        return false;
      });

      const totalLeads = src.baseTotal + extraLeads.length;
      const convertedWon = src.baseWon + Math.floor(extraLeads.length * 0.5);
      const conversionRate = Number(((convertedWon / totalLeads) * 100).toFixed(1));
      const totalRevenue = Math.round(src.revenue + (extraLeads.length * src.avgDeal * 0.5));

      return {
        ...src,
        totalLeads,
        convertedWon,
        conversionRate,
        totalRevenue
      };
    });
  }, [salesReps]);

  const initialQuotes = [
    { id: 'Q-2026-001', customer: 'شركة الأفق المحدودة', amount: 4500, date: '2026-08-01', status: 'accepted', remindersSent: 0 },
    { id: 'Q-2026-002', customer: 'مؤسسة الرواد', amount: 1200, date: '2026-08-05', status: 'pending', remindersSent: 0 },
    { id: 'Q-2026-003', customer: 'أحمد محمود', amount: 350, date: '2026-08-06', status: 'draft', remindersSent: 0 },
  ];

  const [quotes, setQuotes] = useState<any[]>([]);

  const initialInvoices = [
    { id: 'INV-2026-089', customer: 'شركة الأفق المحدودة', amount: 1500, dueDate: '2026-08-15', status: 'unpaid', type: 'دفعة أولى', remindersSent: 0 },
    { id: 'INV-2026-088', customer: 'مجموعة النور', amount: 1000, dueDate: '2026-08-01', status: 'paid', type: 'قسط شهري', remindersSent: 0 },
    { id: 'INV-2026-085', customer: 'شركة التقنية الحديثة', amount: 2500, dueDate: '2026-07-30', status: 'overdue', type: 'دفعة نهائية', remindersSent: 1 },
  ];

  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    const storedQuotes = JSON.parse(localStorage.getItem('crm_quotes') || '[]');
    if (storedQuotes.length === 0) {
      setQuotes(initialQuotes);
      localStorage.setItem('crm_quotes', JSON.stringify(initialQuotes));
    } else {
      setQuotes(storedQuotes);
    }

    const storedInvoices = JSON.parse(localStorage.getItem('crm_invoices') || '[]');
    if (storedInvoices.length === 0) {
      setInvoices(initialInvoices);
      localStorage.setItem('crm_invoices', JSON.stringify(initialInvoices));
    } else {
      setInvoices(storedInvoices);
    }
  }, []);

  const handleSaveQuote = (quote: any) => {
    const updatedQuotes = [quote, ...quotes];
    setQuotes(updatedQuotes);
    setIsCreatingQuote(false);
    localStorage.setItem('crm_quotes', JSON.stringify(updatedQuotes));
  };

  const handleUpdateQuoteStatus = (quoteId: string, newStatus: string) => {
    const updatedQuotes = quotes.map(q => q.id === quoteId ? { ...q, status: newStatus } : q);
    setQuotes(updatedQuotes);
    localStorage.setItem('crm_quotes', JSON.stringify(updatedQuotes));
  };

  const handleUpdateInvoiceStatus = (invoiceId: string, newStatus: string) => {
    const updatedInvoices = invoices.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv);
    setInvoices(updatedInvoices);
    localStorage.setItem('crm_invoices', JSON.stringify(updatedInvoices));
  };

  const handleSaveNewInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceData.customer) return;
    const createdInv = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      customer: newInvoiceData.customer,
      amount: Number(newInvoiceData.amount),
      dueDate: newInvoiceData.dueDate,
      status: newInvoiceData.status,
      type: newInvoiceData.type || 'طلب متجر إلكتروني',
      remindersSent: 0
    };
    const updated = [createdInv, ...invoices];
    setInvoices(updated);
    localStorage.setItem('crm_invoices', JSON.stringify(updated));
    setIsCreatingInvoice(false);
    setNewInvoiceData({
      customer: '',
      amount: 150,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'unpaid',
      type: 'طلب متجر إلكتروني'
    });
  };


  const handleSendQuoteUpdate = (quote: any) => {
    const text = `مرحباً ${quote.customer}،\n\nنرفق لكم عرض السعر رقم ${quote.id} بقيمة ${quote.amount.toLocaleString()} د.أ للاطلاع.\n\nنتطلع لردكم، شكراً لكم.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');

    const updatedQuotes = quotes.map(q => 
      q.id === quote.id 
        ? { ...q, remindersSent: (q.remindersSent || 0) + 1, status: q.status === 'draft' ? 'pending' : q.status }
        : q
    );
    setQuotes(updatedQuotes);
    localStorage.setItem('crm_quotes', JSON.stringify(updatedQuotes));
  };

  const handleSendReminder = (invoice: any) => {
    const text = `مرحباً ${invoice.customer}،\n\nنود تذكيركم بفاتورة مستحقة رقم ${invoice.id} بقيمة ${invoice.amount.toLocaleString()} د.أ.\nتاريخ الاستحقاق: ${invoice.dueDate}\n\nيرجى تسوية المبلغ في أقرب وقت. شكراً لكم.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');

    const updatedInvoices = invoices.map(inv => 
      inv.id === invoice.id 
        ? { ...inv, remindersSent: (inv.remindersSent || 0) + 1, lastReminderDate: new Date().toISOString() }
        : inv
    );
    setInvoices(updatedInvoices);
    localStorage.setItem('crm_invoices', JSON.stringify(updatedInvoices));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">المبيعات وفريق العمل (Sales & Lead Engine)</h1>
          <p className="text-slate-500 mt-1 text-sm">إدارة عروض الأسعار، الفواتير، فريق المبيعات وتوزيع العملاء التلقائي</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'team' ? (
            <button 
              onClick={() => setShowAddRepModal(true)}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md shadow-blue-200 text-sm"
            >
              <UserPlus className="w-5 h-5" />
              إضافة موظف مبيعات
            </button>
          ) : (
            <>
              <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm">
                تصدير تقرير
              </button>
              <button 
                onClick={() => setIsCreatingQuote(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm text-sm"
              >
                <Plus className="w-5 h-5" />
                إنشاء عرض سعر
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">فريق المبيعات</p>
            <h3 className="text-lg font-bold text-slate-900">{salesReps.length} موظفين</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">متواجدون أونلاين</p>
            <h3 className="text-lg font-bold text-slate-900">{salesReps.filter(r => r.isOnline).length} موظفاً</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">التوزيع التلقائي</p>
            <h3 className="text-sm font-bold text-slate-900">
              {distConfig.enabled ? 'مفعّل (Round-Robin)' : 'معطل'}
            </h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">مبيعات الشهر</p>
            <h3 className="text-lg font-bold text-slate-900">34,900 د.أ</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[600px]">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 p-2 overflow-x-auto hide-scrollbar bg-slate-50/50">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
              activeTab === 'team' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            فريق المبيعات والتوزيع التلقائي (Auto-Assign)
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
              activeTab === 'sources' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-300" />
            تقارير مصادر العملاء والإنجاز (Source Analytics)
          </button>
          <button
            onClick={() => setActiveTab('targets')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
              activeTab === 'targets' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-400" />
            تقرير مبيعات الهدف للموظفين (Target Report)
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
              activeTab === 'quotes' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            عروض الأسعار والواتساب
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
              activeTab === 'invoices' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            فواتير مبيعات المتجر
          </button>
        </div>

        {/* Tab 1: Sales Team & Auto Assign Engine */}
        {activeTab === 'team' && (
          <div className="p-6 space-y-8">
            {/* Auto Assignment Config Header */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-500/30 text-blue-300 text-xs px-3 py-1 rounded-full font-bold border border-blue-400/20 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> محرك التوزيع الآلي الذكي (Round-Robin Engine)
                    </span>
                  </div>
                  <h2 className="text-xl font-bold">كيف يتم توزيع العملاء التلقائي على الموظفين؟</h2>
                  <p className="text-slate-300 text-xs mt-1.5 leading-relaxed max-w-2xl">
                    بمجرد دخول عميل جديد عبر الواتساب المباشر، المتجر الإلكتروني، أو نماذج الحجز، يتم تعيين العميل فوراً لأحد موظفي المبيعات وفقاً لخوارزمية التوزيع المختارة، مع إرسال إشعار فوري عبر الواتساب.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 w-full sm:w-auto">
                    <select
                      value={testChannel}
                      onChange={(e: any) => setTestChannel(e.target.value)}
                      className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer px-2 py-1.5"
                    >
                      <option value="whatsapp" className="text-slate-900 font-bold">💬 عميل الواتساب المباشر</option>
                      <option value="booking" className="text-slate-900 font-bold">📅 عميل نماذج الحجز</option>
                      <option value="store" className="text-slate-900 font-bold">🛒 عميل المتجر الإلكتروني</option>
                    </select>

                    <button
                      onClick={() => handleSimulateLeadAssign(testChannel)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 active:scale-95 whitespace-nowrap"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      اختبار التوزيع
                    </button>
                  </div>

                  <label className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 cursor-pointer">
                    <span className="text-xs font-bold">تفعيل التوزيع التلقائي</span>
                    <input 
                      type="checkbox" 
                      checked={distConfig.enabled}
                      onChange={(e) => setDistConfig({ ...distConfig, enabled: e.target.checked })}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-0 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Distribution Strategies Choice Cards */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-white/10 pt-6">
                {[
                  {
                    id: 'round_robin',
                    title: 'التوزيع بالتناوب (Round-Robin)',
                    badge: 'الأكثر شيوعاً',
                    desc: 'توزيع العملاء بالتساوي واحداً تلو الآخر بالتتابع بين الموظفين النشطين.'
                  },
                  {
                    id: 'load_balanced',
                    title: 'موازنة عبء العمل اليومي',
                    badge: 'توازن الضغط',
                    desc: 'تحويل العميل للموظف الذي يمتلك أقل عدد عملاء مفتوحين حالياً.'
                  },
                  {
                    id: 'weighted',
                    title: 'التوزيع حسب الأداء (Weighted)',
                    badge: 'تحفيز الأداء',
                    desc: 'توجيه نسبة أسرع للموظفين الأكثر تحقيقاً لمستهدفات المبيعات.'
                  },
                  {
                    id: 'source_based',
                    title: 'توجيه حسب مصدر الحملة',
                    badge: 'حسب القناة',
                    desc: 'توجيه عملاء الواتساب لموظف أ، وعملاء نماذج الحجز لموظف ب.'
                  }
                ].map(strat => (
                  <div 
                    key={strat.id}
                    onClick={() => setDistConfig({ ...distConfig, strategy: strat.id })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      distConfig.strategy === strat.id 
                        ? 'bg-white text-slate-900 border-white shadow-xl scale-[1.02]' 
                        : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        distConfig.strategy === strat.id ? 'bg-blue-100 text-blue-800' : 'bg-white/20 text-white'
                      }`}>
                        {strat.badge}
                      </span>
                      {distConfig.strategy === strat.id && <CheckCircle className="w-4 h-4 text-blue-600" />}
                    </div>
                    <h4 className="font-bold text-sm mb-1">{strat.title}</h4>
                    <p className={`text-[11px] leading-relaxed ${distConfig.strategy === strat.id ? 'text-slate-600' : 'text-slate-300'}`}>
                      {strat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Conversion & Performance Analytics (Recharts Charts) */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                      <BarChart3 className="w-5 h-5" />
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">معدلات تحويل العملاء وأداء الفريق (Conversion Analytics)</h3>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">مقارنة أداء مسؤول المبيعات في تحويل المحادثات والعملاء المحتملين إلى صفقات ومبيعات فعالة</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>الأعلى تحويلاً: <strong className="text-blue-700">{topRep?.name} ({topRep?.conversionRate}%)</strong></span>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Conversion Rate per Rep BarChart */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      نسبة تحويل العملاء إلى صفقات مغلقة (%)
                    </h4>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold border border-emerald-100">
                      متوسط الفريق: {avgConversionRate}%
                    </span>
                  </div>
                  <div className="h-[280px] w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teamMetrics} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', textAlign: 'right', direction: 'rtl' }}
                          formatter={(value: any, _name: any, item: any) => [`${value}% (صفقة مغلقة ${item.payload.convertedLeads} من أصل ${item.payload.totalLeads})`, 'معدل التحويل']}
                        />
                        <Bar dataKey="conversionRate" radius={[8, 8, 0, 0]} barSize={38}>
                          {teamMetrics.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.conversionRate >= 40 ? '#10b981' : entry.conversionRate >= 30 ? '#3b82f6' : '#f59e0b'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Total Leads vs Converted Deals */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      إجمالي العملاء المستلمين مقابل الصفقات المكتملة
                    </h4>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold border border-blue-100">
                      إجمالي الصفقات: {totalConvertedSum}
                    </span>
                  </div>
                  <div className="h-[280px] w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teamMetrics} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', textAlign: 'right', direction: 'rtl' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                        <Bar dataKey="totalLeads" name="إجمالي العملاء (Leads)" fill="#94a3b8" radius={[6, 6, 0, 0]} barSize={24} />
                        <Bar dataKey="convertedLeads" name="المبيعات المحولة (Sales)" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Rep Conversion Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamMetrics.map((rep) => (
                  <div key={rep.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{rep.avatar || '👤'}</span>
                        <div>
                          <h5 className="font-bold text-xs text-slate-900">{rep.name}</h5>
                          <p className="text-[10px] text-slate-500">{rep.role}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                        rep.conversionRate >= 40 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {rep.conversionRate}%
                      </span>
                    </div>
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px]">
                      <div className="flex justify-between text-slate-600">
                        <span>إجمالي العملاء:</span>
                        <strong className="text-slate-900">{rep.totalLeads}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>الصفقات المحولة:</span>
                        <strong className="text-emerald-600">{rep.convertedLeads} عميل</strong>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className="bg-emerald-500 h-full rounded-full" 
                          style={{ width: `${Math.min(rep.conversionRate, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Team Members Table */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">قائمة موظفي المبيعات والمهام</h3>
                  <p className="text-xs text-slate-500">إضافة وتحديد المستهدفات وسعة الاستقبال اليومية لكل موظف</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-medium">حالة التواجد:</span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {salesReps.filter(r => r.isOnline).length} متواجدون للعمل
                  </span>
                  <Link
                    to="/employees"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    صفحة إدارة الموظفين المستقلة
                  </Link>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-xs border-b border-slate-200">
                      <th className="py-3.5 px-6 font-bold">الموظف</th>
                      <th className="py-3.5 px-6 font-bold">المسمى الوظيفي</th>
                      <th className="py-3.5 px-6 font-bold">تخصص القناة الموجهة</th>
                      <th className="py-3.5 px-6 font-bold">التواجد والتوزيع</th>
                      <th className="py-3.5 px-6 font-bold">العملاء اليوم</th>
                      <th className="py-3.5 px-6 font-bold">تحقيق هدف المبيعات</th>
                      <th className="py-3.5 px-6 font-bold text-left">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReps.map(rep => {
                      const achievementPct = Math.min(100, Math.round((rep.currentSales / rep.monthlyTarget) * 100));
                      const currentChanObj = CHANNEL_OPTIONS.find(c => c.id === (rep.specialtyChannel || 'all')) || CHANNEL_OPTIONS[0];

                      return (
                        <tr key={rep.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{rep.avatar || '👤'}</span>
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm">{rep.name}</h4>
                                <div className="text-xs text-slate-500 font-mono" dir="ltr">{rep.phone}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                              {rep.role}
                            </span>
                          </td>

                          <td className="py-4 px-6">
                            <div className="relative inline-block">
                              <select
                                value={rep.specialtyChannel || 'all'}
                                onChange={(e) => handleUpdateRepChannel(rep.id, e.target.value)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-xl border appearance-none pr-8 cursor-pointer outline-none transition-all ${currentChanObj.badgeColor}`}
                              >
                                {CHANNEL_OPTIONS.map(opt => (
                                  <option key={opt.id} value={opt.id} className="bg-white text-slate-900 font-bold">
                                    {opt.icon} {opt.label}
                                  </option>
                                ))}
                              </select>
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] opacity-60">▼</span>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <button
                              onClick={() => toggleRepOnline(rep.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                                rep.isOnline 
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${rep.isOnline ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
                              {rep.isOnline ? 'متواجد (مفعّل للتحويل)' : 'غير متواجد (إيقاف)'}
                            </button>
                          </td>

                          <td className="py-4 px-6">
                            <div>
                              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                                <span>{rep.assignedCountToday} عميل</span>
                                <span className="text-xs text-slate-400 font-normal">من أصل {rep.dailyLimit} حد يومي</span>
                              </div>
                              <div className="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                                <div 
                                  className="bg-blue-600 h-full rounded-full transition-all"
                                  style={{ width: `${Math.min(100, (rep.assignedCountToday / rep.dailyLimit) * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div>
                              <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1 w-36">
                                <span>{rep.currentSales.toLocaleString()} د.أ</span>
                                <span className="text-blue-600">{achievementPct}%</span>
                              </div>
                              <div className="w-36 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all ${achievementPct >= 80 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                                  style={{ width: `${achievementPct}%` }}
                                ></div>
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-0.5">من الهدف: {rep.monthlyTarget.toLocaleString()} د.أ</span>
                            </div>
                          </td>

                          <td className="py-4 px-6 text-left">
                            <button 
                              onClick={() => handleDeleteRep(rep.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="إزالة الموظف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Lead Sources Performance Analytics Sub-Dashboard */}
        {activeTab === 'sources' && (
          <div className="p-6 space-y-8 bg-slate-50/30">
            {/* Top Sub-Dashboard Banner & Filters */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold border border-emerald-400/30 flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> لوحة تحليلات مصادر العملاء والإنجاز
                    </span>
                    <span className="bg-white/10 text-slate-300 text-xs px-2.5 py-1 rounded-full font-bold">
                      Recharts Interactive Engine
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">تقارير أداء القنوات ومعدلات التحويل (Lead Source Analytics)</h2>
                  <p className="text-slate-300 text-xs mt-2 leading-relaxed max-w-2xl">
                    متابعة مباشرة ودقيقة لأداء العملاء القادمين عبر الواتساب المباشر، نماذج الحجز والموقع، والمتجر الإلكتروني، لمعرفة أكثر القنوات ربحية ومعدلات إنجاز الفريق.
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="flex items-center bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/15">
                    <button
                      onClick={() => setSourceTimeRange('today')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        sourceTimeRange === 'today' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      اليوم
                    </button>
                    <button
                      onClick={() => setSourceTimeRange('week')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        sourceTimeRange === 'week' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      هذا الأسبوع
                    </button>
                    <button
                      onClick={() => setSourceTimeRange('month')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        sourceTimeRange === 'month' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      هذا الشهر
                    </button>
                    <button
                      onClick={() => setSourceTimeRange('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        sourceTimeRange === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      جميع الأوقات
                    </button>
                  </div>

                  <select
                    value={selectedSourceFilter}
                    onChange={(e) => setSelectedSourceFilter(e.target.value)}
                    className="bg-white/10 text-white border border-white/15 rounded-2xl px-4 py-2 text-xs font-bold outline-none cursor-pointer backdrop-blur-md"
                  >
                    <option value="all" className="bg-slate-900 text-white">جميع القنوات ومصادر الدخول</option>
                    <option value="whatsapp" className="bg-slate-900 text-white">💬 الواتساب المباشر</option>
                    <option value="booking" className="bg-slate-900 text-white">📅 نماذج الحجز والموقع</option>
                    <option value="store" className="bg-slate-900 text-white">🛒 المتجر الإلكتروني</option>
                  </select>
                </div>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-1">إجمالي العملاء من القنوات</p>
                  <h3 className="text-2xl font-black text-slate-900">
                    {sourceAnalyticsData.reduce((acc, curr) => acc + curr.totalLeads, 0).toLocaleString()} عميل
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-2">
                    ▲ +18.4% نمو شهري
                  </span>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-1">المبيعات المغلقة (Won Deals)</p>
                  <h3 className="text-2xl font-black text-slate-900">
                    {sourceAnalyticsData.reduce((acc, curr) => acc + curr.convertedWon, 0).toLocaleString()} صفقة
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-2">
                    ▲ +22.1% إنجاز
                  </span>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-1">متوسط نسبة التحويل الإجمالية</p>
                  <h3 className="text-2xl font-black text-slate-900">
                    {(sourceAnalyticsData.reduce((acc, curr) => acc + curr.conversionRate, 0) / sourceAnalyticsData.length).toFixed(1)}%
                  </h3>
                  <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full inline-block mt-2">
                    🎯 معدل استجابة مرتفع
                  </span>
                </div>
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-1">إجمالي العائد المالي المحقق</p>
                  <h3 className="text-2xl font-black text-slate-900">
                    {sourceAnalyticsData.reduce((acc, curr) => acc + curr.totalRevenue, 0).toLocaleString()} د.أ
                  </h3>
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-2">
                    💰 عوائد القنوات
                  </span>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Recharts Analytics Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart 1: Conversion Rate (%) per Source BarChart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      معدل التحويل والإنجاز حسب القناة (%)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">نسبة العملاء الذين تم تحويلهم لصفقات ناجهة لكل مصدر</p>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
                    مؤشر الإنجاز %
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sourceAnalyticsData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="shortName" tick={{ fontSize: 12, fontWeight: 700, fill: '#475569' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5" dir="rtl">
                                <p className="font-bold text-sm border-b border-slate-700 pb-1 flex items-center gap-2">
                                  <span>{data.icon}</span> {data.name}
                                </p>
                                <p><span className="text-slate-400">معدل التحويل:</span> <strong className="text-emerald-400 font-bold">{data.conversionRate}%</strong></p>
                                <p><span className="text-slate-400">العملاء المحولون:</span> <strong>{data.convertedWon} من أصل {data.totalLeads}</strong></p>
                                <p><span className="text-slate-400">إجمالي الإيراد:</span> <strong className="text-amber-300">{data.totalRevenue.toLocaleString()} د.أ</strong></p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="conversionRate" radius={[12, 12, 0, 0]} barSize={45}>
                        {sourceAnalyticsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Revenue Distribution PieChart */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    توزيع الإيرادات حسب مصدر الدخول
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">حصة كل قناة من إجمالي المبيعات المحققة</p>
                </div>

                <div className="h-56 w-full relative my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceAnalyticsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="totalRevenue"
                      >
                        {sourceAnalyticsData.map((entry, index) => (
                          <Cell key={`pie-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${Number(value).toLocaleString()} د.أ`, 'الإيراد']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  {sourceAnalyticsData.map(src => (
                    <div key={src.id} className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: src.color }}></span>
                      <span className="text-slate-600 truncate font-medium">{src.shortName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart Section 3: Grouped BarChart for Total Leads vs Converted Sales */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    مقارنة إجمالي العملاء الواردين مقابل المبيعات المحققة (Inquiries vs Deals)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">توضيح التفاعل الفعلي وحجم الفرص المكتملة لكل قناة</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-3 h-3 bg-slate-300 rounded-sm"></span>
                    إجمالي العملاء
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
                    المبيعات المنجزة
                  </div>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceAnalyticsData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#334155' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(value: any, name: any) => [
                        value, 
                        name === 'totalLeads' ? 'إجمالي العملاء' : 'المبيعات المنجزة'
                      ]}
                    />
                    <Bar dataKey="totalLeads" name="totalLeads" fill="#cbd5e1" radius={[8, 8, 0, 0]} barSize={28} />
                    <Bar dataKey="convertedWon" name="convertedWon" fill="#10b981" radius={[8, 8, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Source Channel Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sourceAnalyticsData.map(src => (
                <div key={src.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{src.icon}</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        {src.trend}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base">{src.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <span>المسؤول:</span> <strong className="text-slate-800 font-bold">{src.primaryRep}</strong>
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">نسبة الإنجاز:</span>
                        <span className="text-slate-900">{src.conversionRate}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ width: `${src.conversionRate}%`, backgroundColor: src.color }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block">إجمالي العملاء:</span>
                        <strong className="text-slate-800 font-bold">{src.totalLeads}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">الإيراد:</span>
                        <strong className="text-emerald-700 font-bold">{src.totalRevenue.toLocaleString()} د.أ</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSimulateLeadAssign(src.id as any)}
                    className="mt-5 w-full bg-slate-50 hover:bg-blue-50 text-blue-600 hover:text-blue-700 border border-slate-200 hover:border-blue-200 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    اختبار عميل جديد للقناة
                  </button>
                </div>
              ))}
            </div>

            {/* Detailed Source Breakdown Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">مصفوفة أداء القنوات التفصيلية (Source Matrix)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">تفاصيل الإنجاز للعملاء الموزعين تلقائياً لكل مصدر</p>
                </div>

                <button 
                  onClick={() => showToast('تم تصدير تقرير أداء مصادر المبيعات بنجاح (PDF/Excel)', 'success', 'تصدير التقرير')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  تصدير تقرير القنوات (PDF / Excel)
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-4 px-6">القناة / مصدر العميل</th>
                      <th className="py-4 px-6">الموظف المخصص للقناة</th>
                      <th className="py-4 px-6">إجمالي الاستفسارات</th>
                      <th className="py-4 px-6">المبيعات المنجزة</th>
                      <th className="py-4 px-6">نسبة الإنجاز (%)</th>
                      <th className="py-4 px-6">العائد المالي (د.أ)</th>
                      <th className="py-4 px-6">متوسط قيمة الصفقة</th>
                      <th className="py-4 px-6">تقييم القناة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sourceAnalyticsData.map(src => (
                      <tr key={src.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
                            <span className="text-xl">{src.icon}</span>
                            {src.name}
                          </div>
                        </td>

                        <td className="py-4 px-6 font-bold text-slate-700">
                          {src.primaryRep}
                        </td>

                        <td className="py-4 px-6 font-bold text-slate-800">
                          {src.totalLeads} عميل
                        </td>

                        <td className="py-4 px-6 font-bold text-emerald-600">
                          {src.convertedWon} صفقة
                        </td>

                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <span>{src.conversionRate}%</span>
                            </div>
                            <div className="w-28 bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full"
                                style={{ width: `${src.conversionRate}%`, backgroundColor: src.color }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 font-black text-slate-900 text-sm">
                          {src.totalRevenue.toLocaleString()} د.أ
                        </td>

                        <td className="py-4 px-6 font-bold text-slate-600">
                          {src.avgDeal.toLocaleString()} د.أ
                        </td>

                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap inline-flex items-center justify-center gap-1.5 ${
                            src.conversionRate >= 45 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : src.conversionRate >= 35 
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {src.statusText}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Sales Target & Commission Report (تقرير أهداف المبيعات للموظفين) */}
        {activeTab === 'targets' && (
          <div className="p-6 space-y-8 bg-slate-50/30">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold border border-emerald-400/30 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-emerald-400" /> تقرير متابعة أهداف المبيعات الشهرية
                    </span>
                    <span className="bg-white/10 text-slate-300 text-xs px-2.5 py-1 rounded-full font-bold">
                      حساب العمولات والمكافآت تلقائياً
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">تقرير أداء المبيعات والهدف الشهري للموظفين (Sales Target Report)</h2>
                  <p className="text-slate-300 text-xs mt-2 leading-relaxed max-w-2xl">
                    لوحة قيادة مخصصة لمتابعة تحقيق مستهدفات المبيعات لكل موظف، حساب العمولات المتوقعة، ومكافآت التميز بناءً على نسب الإنجاز الفعلية من الصفقات المغلقة.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/15">
                    <span className="text-xs font-bold text-slate-200">نسبة العمولة:</span>
                    <select
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      className="bg-slate-900 text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-xl border border-white/20 outline-none cursor-pointer"
                    >
                      <option value={0}>تلقائي: مخصصة على كل منتج عند إنشائه ⭐</option>
                      <option value={2}>2% عمولة موحدة أساسية</option>
                      <option value={3}>3% عمولة موحدة معيارية</option>
                      <option value={5}>5% عمولة موحدة ممتازة</option>
                      <option value={7.5}>7.5% عمولة موحدة تحفيزية</option>
                    </select>
                  </div>

                  <button
                    onClick={() => showToast('تم تصدير تقرير أهداف المبيعات والعمولات بنجاح (PDF)', 'success', 'تصدير التقرير')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    تصدير تقرير الأهداف (PDF)
                  </button>
                </div>
              </div>
            </div>

            {/* Target Metrics KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Card 1: Total Target */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-500">إجمالي الهدف المطلوب</p>
                  <div className="w-9 h-9 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  {salesReps.reduce((sum, r) => sum + (r.monthlyTarget || 0), 0).toLocaleString()} د.أ
                </h3>
                <span className="text-[10px] text-slate-400 mt-2 block">المستهدف الكلي لفريق المبيعات</span>
              </div>

              {/* Card 2: Total Achieved */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-500">المبيعات المحققة فعلياً</p>
                  <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-emerald-700">
                  {salesReps.reduce((sum, r) => sum + (r.currentSales || 0), 0).toLocaleString()} د.أ
                </h3>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1 w-fit">
                  تحديث مباشر للصفقات المغلقة
                </span>
              </div>

              {/* Card 3: Completion % */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-500">نسبة تحقيق الهدف العام</p>
                  <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                {(() => {
                  const totalT = salesReps.reduce((s, r) => s + (r.monthlyTarget || 0), 0);
                  const totalA = salesReps.reduce((s, r) => s + (r.currentSales || 0), 0);
                  const pct = totalT > 0 ? Math.round((totalA / totalT) * 100) : 0;
                  return (
                    <>
                      <h3 className="text-2xl font-black text-slate-900">{pct}%</h3>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%` }}></div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Card 4: Commissions Pool */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-500">إجمالي العمولات المستحقة</p>
                  <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                {(() => {
                  const totalA = salesReps.reduce((s, r) => s + (r.currentSales || 0), 0);
                  const comm = Math.round(totalA * (effectiveCommissionRate / 100));
                  return (
                    <>
                      <h3 className="text-2xl font-black text-purple-700">{comm.toLocaleString()} د.أ</h3>
                      <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full inline-block mt-1 w-fit">
                        {commissionRate === 0 ? `محددة لكل منتج عند إعداده (متوسط ${effectiveCommissionRate}%)` : `بناءً على ${effectiveCommissionRate}% عمولة`}
                      </span>
                    </>
                  );
                })()}
              </div>

              {/* Card 5: Top Representative */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-amber-800">🏆 الموظف الأعلى إنجازاً</p>
                  <span className="text-xl">🥇</span>
                </div>
                {(() => {
                  const top = [...salesReps].sort((a, b) => (b.currentSales / (b.monthlyTarget || 1)) - (a.currentSales / (a.monthlyTarget || 1)))[0];
                  if (!top) return null;
                  const topPct = Math.round((top.currentSales / top.monthlyTarget) * 100);
                  return (
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{top.name}</h4>
                      <p className="text-xs text-amber-900 font-black mt-0.5">{top.currentSales.toLocaleString()} د.أ ({topPct}%)</p>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full inline-block mt-1">
                        متصدر قائمة المبيعات
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Recharts Visual Comparisons */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Target vs Actual Sales BarChart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                      مقارنة هدف المبيعات مقابل المحقق فعلياً لكل موظف (Target vs Actual)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">شريط المقارنة الشهري بالدينار الأردني</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-3 h-3 bg-slate-300 rounded-xs"></span>
                      الهدف المحدد (Target)
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <span className="w-3 h-3 bg-emerald-500 rounded-xs"></span>
                      المبيعات المحققة (Actual)
                    </div>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesReps} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#334155' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        formatter={(value: any, name: any) => [
                          `${Number(value).toLocaleString()} د.أ`,
                          name === 'monthlyTarget' ? 'الهدف الشهري' : 'المبيعات المحققة'
                        ]}
                      />
                      <Bar dataKey="monthlyTarget" name="monthlyTarget" fill="#cbd5e1" radius={[8, 8, 0, 0]} barSize={26} />
                      <Bar dataKey="currentSales" name="currentSales" fill="#10b981" radius={[8, 8, 0, 0]} barSize={26} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Share of Total Achieved Sales PieChart */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    حصة كل موظف من إجمالي المبيعات
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">توزيع حجم المبيعات الإجمالي بين أفراد الفريق</p>
                </div>

                <div className="h-56 w-full relative my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesReps}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="currentSales"
                        nameKey="name"
                      >
                        {salesReps.map((_, index) => {
                          const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
                          return <Cell key={`pie-rep-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${Number(value).toLocaleString()} د.أ`, 'المبيعات']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {salesReps.map((rep, idx) => {
                    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
                    return (
                      <div key={rep.id} className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></span>
                          <span className="text-slate-700">{rep.name}</span>
                        </div>
                        <span className="text-slate-900 font-bold">{rep.currentSales.toLocaleString()} د.أ</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Employee Target Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">بطاقات إنجاز الموظفين الفردية (Rep Goal Cards)</h3>
                  <p className="text-xs text-slate-500">حالة المستهدف المتبقي والعمولة المستحقة لكل مسئول مبيعات</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {salesReps.map(rep => {
                  const pct = rep.monthlyTarget > 0 ? Math.round((rep.currentSales / rep.monthlyTarget) * 100) : 0;
                  const remaining = Math.max(0, rep.monthlyTarget - rep.currentSales);
                  const repComm = Math.round(rep.currentSales * (effectiveCommissionRate / 100));

                  let tierBadge = { label: 'برونزي 🥉', color: 'bg-amber-50 text-amber-800 border-amber-200' };
                  if (pct >= 100) tierBadge = { label: 'تجاوز الهدف! 💎', color: 'bg-purple-50 text-purple-800 border-purple-200' };
                  else if (pct >= 85) tierBadge = { label: 'ذهبي ممتاز 🥇', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
                  else if (pct >= 70) tierBadge = { label: 'فضي جيد جداً 🥈', color: 'bg-blue-50 text-blue-800 border-blue-200' };

                  return (
                    <div key={rep.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{rep.avatar || '👤'}</span>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{rep.name}</h4>
                              <span className="text-[10px] text-slate-500">{rep.role}</span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${tierBadge.color}`}>
                            {tierBadge.label}
                          </span>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-slate-500">معدل الإنجاز:</span>
                            <span className="text-slate-900 text-sm font-black">{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                pct >= 100 ? 'bg-purple-600' : pct >= 80 ? 'bg-emerald-500' : 'bg-blue-600'
                              }`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px]">الهدف الشهري:</span>
                            <strong className="text-slate-900 font-bold">{rep.monthlyTarget.toLocaleString()} د.أ</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">المبيعات المحققة:</span>
                            <strong className="text-emerald-700 font-bold">{rep.currentSales.toLocaleString()} د.أ</strong>
                          </div>
                          <div className="mt-1">
                            <span className="text-slate-400 block text-[10px]">المتبقي للهدف:</span>
                            <strong className="text-amber-700 font-bold">{remaining.toLocaleString()} د.أ</strong>
                          </div>
                          <div className="mt-1">
                            <span className="text-slate-400 block text-[10px]">العمولة ({commissionRate === 0 ? 'نسبة المنتج' : `${effectiveCommissionRate}%`}):</span>
                            <strong className="text-purple-700 font-bold">{repComm.toLocaleString()} د.أ</strong>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingTargetRep(rep);
                            setTargetInputVal(rep.monthlyTarget);
                          }}
                          className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          تعديل الهدف
                        </button>
                        <button
                          onClick={() => showToast(`تم إرسال رسالة تحفيزية وتحديث التقرير للموظف (${rep.name}) عبر الواتساب!`, 'info', '💬 تحفيز الموظف')}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 p-2 rounded-xl transition-colors"
                          title="إرسال تحفيز عبر الواتساب"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Target Report Matrix Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">جدول أداء أهداف المبيعات الشامل والعمولات (Detailed Target Matrix)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">تفاصيل شاملة للمستهدفات والإنجاز المالي والعمولة المستحقة لكل عضو في الفريق</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold">إجمالي عمولات الفريق:</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 font-black text-xs rounded-full border border-purple-200">
                    {Math.round(salesReps.reduce((s, r) => s + r.currentSales, 0) * (effectiveCommissionRate / 100)).toLocaleString()} د.أ
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-4 px-6">مسؤول المبيعات</th>
                      <th className="py-4 px-6">المسمى الوظيفي</th>
                      <th className="py-4 px-6">الهدف الشهري (Target)</th>
                      <th className="py-4 px-6">المبيعات المحققة (Actual)</th>
                      <th className="py-4 px-6">المتبقي للهدف</th>
                      <th className="py-4 px-6">نسبة الإنجاز (%)</th>
                      <th className="py-4 px-6">العمولة المكتسبة ({commissionRate === 0 ? 'محددة بالمنتج' : `${effectiveCommissionRate}%`})</th>
                      <th className="py-4 px-6">تصنيف الأداء</th>
                      <th className="py-4 px-6 text-left">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReps.map(rep => {
                      const pct = rep.monthlyTarget > 0 ? Math.round((rep.currentSales / rep.monthlyTarget) * 100) : 0;
                      const remaining = Math.max(0, rep.monthlyTarget - rep.currentSales);
                      const repComm = Math.round(rep.currentSales * (effectiveCommissionRate / 100));

                      return (
                        <tr key={rep.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{rep.avatar || '👤'}</span>
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm">{rep.name}</h4>
                                <span className="text-[10px] text-slate-400" dir="ltr">{rep.phone}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 font-medium text-slate-600">
                            {rep.role}
                          </td>

                          <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                            {rep.monthlyTarget.toLocaleString()} د.أ
                          </td>

                          <td className="py-4 px-6 font-black text-emerald-700 text-sm">
                            {rep.currentSales.toLocaleString()} د.أ
                          </td>

                          <td className="py-4 px-6 font-bold text-amber-700">
                            {remaining > 0 ? `${remaining.toLocaleString()} د.أ` : 'تم الوصول للهدف 🎯'}
                          </td>

                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <span className="font-bold text-slate-900">{pct}%</span>
                              <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${pct >= 100 ? 'bg-purple-600' : 'bg-emerald-500'}`}
                                  style={{ width: `${Math.min(pct, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 font-black text-purple-700 text-sm">
                            {repComm.toLocaleString()} د.أ
                          </td>

                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap inline-flex items-center justify-center gap-1.5 ${
                              pct >= 100
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : pct >= 80
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : pct >= 60
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {pct >= 100 ? 'تجاوز Target 🔥' : pct >= 80 ? 'إنجاز ممتاز 🟢' : pct >= 60 ? 'قيد التقدم 🟡' : 'يحتاج تحسين 🔴'}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-left">
                            <button
                              onClick={() => {
                                setEditingTargetRep(rep);
                                setTargetInputVal(rep.monthlyTarget);
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              تعديل
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Edit Rep Target */}
            {editingTargetRep && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-600" />
                      تحديث هدف المبيعات الشهري
                    </h3>
                    <button 
                      onClick={() => setEditingTargetRep(null)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                      <span className="text-3xl">{editingTargetRep.avatar || '👤'}</span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{editingTargetRep.name}</h4>
                        <p className="text-xs text-slate-500">{editingTargetRep.role}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">الهدف الشهري الجديد (بالدينار الأردني د.أ) *</label>
                      <input 
                        type="number"
                        value={targetInputVal}
                        onChange={(e) => setTargetInputVal(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="أدخل الهدف بالأرقام..."
                      />
                      <p className="text-[11px] text-slate-500 mt-1">المبيعات المحققة حالياً لهذا الموظف: {editingTargetRep.currentSales.toLocaleString()} د.أ</p>
                    </div>

                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-800 font-medium">
                      عند حفظ الهدف الجديد، سيتم تحديث نسب الإنجاز وحساب العمولات تلقائياً في كافة اللوحات المرتطبة.
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setEditingTargetRep(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => {
                        setSalesReps(prev => prev.map(r => r.id === editingTargetRep.id ? { ...r, monthlyTarget: targetInputVal } : r));
                        setEditingTargetRep(null);
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/30"
                    >
                      حفظ الهدف الجديد
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Existing Tab: Quotes */}
        {activeTab === 'quotes' && (
          <div>
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="ابحث برقم المستند أو اسم العميل..." 
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                <Filter className="w-4 h-4" />
                تصفية النتائج
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
                    <th className="py-3 px-6 font-medium">رقم العرض</th>
                    <th className="py-3 px-6 font-medium">العميل</th>
                    <th className="py-3 px-6 font-medium">التاريخ</th>
                    <th className="py-3 px-6 font-medium">المبلغ الإجمالي</th>
                    <th className="py-3 px-6 font-medium w-48">مسار العرض (Lifecycle)</th>
                    <th className="py-3 px-6 font-medium w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map(quote => (
                    <tr key={quote.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6 font-mono font-medium text-slate-900 text-sm">{quote.id}</td>
                      <td className="py-4 px-6 font-bold text-slate-900">{quote.customer}</td>
                      <td className="py-4 px-6 text-sm text-slate-500">{quote.date}</td>
                      <td className="py-4 px-6 font-bold text-slate-900">{quote.amount} د.أ</td>
                      <td className="py-4 px-6">
                        <QuoteLifecycle status={quote.status as any} />
                      </td>
                      <td className="py-4 px-6 text-left relative">
                        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleSendQuoteUpdate(quote)}
                            className="px-2 py-1 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            إرسال
                            {quote.remindersSent > 0 && <span className="mr-1 opacity-70">({quote.remindersSent})</span>}
                          </button>
                          <select 
                            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-blue-500 text-slate-600"
                            value={quote.status}
                            onChange={(e) => handleUpdateQuoteStatus(quote.id, e.target.value)}
                          >
                            <option value="draft">مسودة</option>
                            <option value="pending">مُرسل</option>
                            <option value="viewed">شوهد</option>
                            <option value="accepted">مقبول</option>
                            <option value="paid">مدفوع</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}



        {/* Invoices Tab (فواتير مبيعات المتجر) */}
        {activeTab === 'invoices' && (
          <div>
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={invoiceSearchQuery}
                  onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                  placeholder="ابحث برقم الفاتورة، اسم العميل، أو نوع السداد..." 
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                />
              </div>
              <button 
                onClick={() => setIsCreatingInvoice(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                إصدار فاتورة متجر جديدة
              </button>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3.5 px-6 whitespace-nowrap">رقم الفاتورة</th>
                    <th className="py-3.5 px-6 whitespace-nowrap">العميل</th>
                    <th className="py-3.5 px-6 whitespace-nowrap">النوع / المصدر</th>
                    <th className="py-3.5 px-6 whitespace-nowrap">المبلغ الإجمالي</th>
                    <th className="py-3.5 px-6 whitespace-nowrap">تاريخ الاستحقاق</th>
                    <th className="py-3.5 px-6 whitespace-nowrap">تحديث حالة الفاتورة</th>
                    <th className="py-3.5 px-6 whitespace-nowrap text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices
                    .filter(inv => 
                      !invoiceSearchQuery || 
                      inv.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
                      inv.customer.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
                      inv.type?.toLowerCase().includes(invoiceSearchQuery.toLowerCase())
                    )
                    .map(invoice => (
                      <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors group">
                        <td className="py-4 px-6 font-mono font-bold text-slate-900 text-sm whitespace-nowrap">{invoice.id}</td>
                        <td className="py-4 px-6 font-bold text-slate-900 text-sm whitespace-nowrap">{invoice.customer}</td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            {invoice.type || 'مبيعات المتجر'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-black text-slate-900 text-sm whitespace-nowrap">{invoice.amount.toLocaleString()} د.أ</td>
                        <td className="py-4 px-6 text-xs text-slate-500 font-medium whitespace-nowrap">{invoice.dueDate}</td>
                        
                        {/* Interactive Status Selector */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <select 
                            value={invoice.status}
                            onChange={(e) => handleUpdateInvoiceStatus(invoice.id, e.target.value)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl border outline-none cursor-pointer transition-all shadow-sm ${
                              invoice.status === 'paid' 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
                                : invoice.status === 'unpaid' 
                                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100' 
                                : 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100'
                            }`}
                          >
                            <option value="paid" className="bg-white text-emerald-800 font-bold">🟢 مدفوعة بالكامل</option>
                            <option value="unpaid" className="bg-white text-amber-800 font-bold">🟡 غير مدفوعة (في انتظار السداد)</option>
                            <option value="overdue" className="bg-white text-red-800 font-bold">🔴 متأخرة السداد</option>
                          </select>
                        </td>

                        <td className="py-4 px-6 text-left whitespace-nowrap">
                          <div className="flex items-center gap-2 justify-end">
                            {invoice.status !== 'paid' && (
                              <button 
                                onClick={() => handleSendReminder(invoice)}
                                className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1 border border-blue-200"
                                title="إرسال تذكير سداد عبر الواتساب"
                              >
                                <Send className="w-3.5 h-3.5" />
                                تذكير واتساب
                                {invoice.remindersSent > 0 && <span className="mr-0.5 opacity-80">({invoice.remindersSent})</span>}
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                const updated = invoices.filter(i => i.id !== invoice.id);
                                setInvoices(updated);
                                localStorage.setItem('crm_invoices', JSON.stringify(updated));
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                              title="حذف الفاتورة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create New Invoice */}
      {isCreatingInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                إصدار فاتورة متجر جديدة
              </h3>
              <button onClick={() => setIsCreatingInvoice(false)} className="text-slate-400 hover:text-slate-600 rounded-lg">✕</button>
            </div>

            <form onSubmit={handleSaveNewInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم العميل *</label>
                <input 
                  type="text"
                  required
                  value={newInvoiceData.customer}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, customer: e.target.value })}
                  placeholder="أدخل اسم العميل أو المشتري..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ (د.أ) *</label>
                  <input 
                    type="number"
                    required
                    value={newInvoiceData.amount}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, amount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تاريخ الاستحقاق *</label>
                  <input 
                    type="date"
                    required
                    value={newInvoiceData.dueDate}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">حالة الفاتورة المبدئية *</label>
                <select 
                  value={newInvoiceData.status}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="unpaid">🟡 غير مدفوعة (في انتظار السداد)</option>
                  <option value="paid">🟢 مدفوعة بالكامل</option>
                  <option value="overdue">🔴 متأخرة السداد</option>
                </select>
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsCreatingInvoice(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 shadow-md shadow-emerald-200"
                >
                  حفظ وإصدار الفاتورة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Sales Rep */}
      {showAddRepModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowAddRepModal(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                إضافة موظف مبيعات جديد
              </h3>
              <button onClick={() => setShowAddRepModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRep} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم الموظف الثلاثي *</label>
                <input 
                  type="text" 
                  required
                  value={newRep.name}
                  onChange={(e) => setNewRep({ ...newRep, name: e.target.value })}
                  placeholder="مثال: طارق محمود العلي"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف / الواتساب *</label>
                <input 
                  type="tel" 
                  required
                  value={newRep.phone}
                  onChange={(e) => setNewRep({ ...newRep, phone: e.target.value })}
                  placeholder="0791234567"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المسمى الوظيفي</label>
                <input 
                  type="text" 
                  value={newRep.role}
                  onChange={(e) => setNewRep({ ...newRep, role: e.target.value })}
                  placeholder="مثال: مسؤول مبيعات أول"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">تخصص القناة الموجهة لها الموظف *</label>
                <select
                  value={newRep.specialtyChannel}
                  onChange={(e) => setNewRep({ ...newRep, specialtyChannel: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 cursor-pointer"
                >
                  {CHANNEL_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.icon} {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">يُحدد أين يتم توجيه العملاء الجدد الجدد لهذا الموظف تلقائياً.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الهدف الشهري (د.أ)</label>
                  <input 
                    type="number" 
                    value={newRep.monthlyTarget}
                    onChange={(e) => setNewRep({ ...newRep, monthlyTarget: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">السعة اليومية للعملاء</label>
                  <input 
                    type="number" 
                    value={newRep.dailyLimit}
                    onChange={(e) => setNewRep({ ...newRep, dailyLimit: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddRepModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 shadow-md shadow-blue-200"
                >
                  حفظ الموظف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulation Result Alert Modal */}
      {simulationAlert && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSimulationAlert(null)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-slate-100 p-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Bot className="w-8 h-8" />
            </div>

            <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200">
              تم التوزيع بنجاح بواسطة {simulationAlert.strategy}
            </span>

            <h3 className="text-xl font-bold text-slate-900 mt-3">
              تم تحويل العميل "{simulationAlert.leadName}"
            </h3>

            <div className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-full border border-blue-100">
              قناة الدخول: {simulationAlert.channelName}
            </div>

            <p className="text-sm text-slate-600 mt-2">
              تمت إحالة العميل فوراً إلى مسؤول المبيعات المخصص لهذه القناة:
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-4 flex items-center justify-center gap-3">
              <span className="text-3xl">👨‍💼</span>
              <div className="text-right">
                <h4 className="font-bold text-slate-900 text-base">{simulationAlert.repName}</h4>
                <p className="text-xs text-emerald-600 font-bold mt-0.5">🟢 تم إرسال إشعار فورياً عبر الواتساب للموظف</p>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              يمكنك الآن مشاهدة هذا العميل متواجداً في لوحة CRM ومسنداً لمسؤول المبيعات هذا.
            </p>

            <button 
              onClick={() => setSimulationAlert(null)}
              className="mt-5 w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-slate-800 transition-colors"
            >
              موافق
            </button>
          </div>
        </div>
      )}

      {isCreatingQuote && (
        <CreateQuote 
          onClose={() => setIsCreatingQuote(false)} 
          onSave={handleSaveQuote} 
        />
      )}
    </div>
  );
}
