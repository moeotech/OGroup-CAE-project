import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, Target, ShieldCheck, CheckCircle2, AlertCircle, Search, 
  Filter, RefreshCw, Send, ArrowRightLeft, Phone, Mail, FileText, Receipt, 
  TrendingUp, Award, Clock, ChevronDown, Sparkles, MessageSquare, Zap, UserCheck, 
  UserX, BarChart3, Edit3, ArrowUpRight, Radio, Layers
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Employee } from '../types';
import { mockLeads } from '../data';
import { Link } from 'react-router-dom';

export default function SalesManager() {
  const { user } = useAuth();
  const [notification, setNotification] = useState<string | null>(null);

  // Load Sales Reps & Managers from LocalStorage
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const stored = localStorage.getItem('crm_sales_reps');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return [
      {
        id: 'emp-1',
        name: 'سامر قاسم',
        phone: '0791112233',
        email: 'samer@company.com',
        role: 'مدير مبيعات',
        isManager: true,
        managerId: null,
        managerName: null,
        specialtyChannel: 'all',
        monthlyTarget: 30000,
        dailyLimit: 20,
        status: 'active',
        isOnline: true,
        activeLeads: 18,
        totalLeads: 45,
        convertedLeads: 18,
        currentSales: 24500,
        avatar: '👨‍💼'
      },
      {
        id: 'emp-2',
        name: 'رانيا العبدالله',
        phone: '0792223344',
        email: 'rania@company.com',
        role: 'مسؤول مبيعات المتجر',
        isManager: false,
        managerId: null,
        managerName: null,
        specialtyChannel: 'store',
        monthlyTarget: 12000,
        dailyLimit: 10,
        status: 'active',
        isOnline: true,
        activeLeads: 22,
        totalLeads: 50,
        convertedLeads: 23,
        currentSales: 10800,
        avatar: '👩‍💼'
      },
      {
        id: 'emp-3',
        name: 'حمزة الشريف',
        phone: '0793334455',
        email: 'hamzah@company.com',
        role: 'مستشار مبيعات الحجوزات',
        isManager: false,
        managerId: 'emp-1',
        managerName: 'سامر قاسم',
        specialtyChannel: 'booking',
        monthlyTarget: 10000,
        dailyLimit: 8,
        status: 'active',
        isOnline: true,
        activeLeads: 14,
        totalLeads: 35,
        convertedLeads: 11,
        currentSales: 7500,
        avatar: '👨‍💻'
      },
      {
        id: 'emp-4',
        name: 'فرح الزعبي',
        phone: '0794445566',
        email: 'farah@company.com',
        role: 'مسؤولة مبيعات الواتساب',
        isManager: false,
        managerId: 'emp-1',
        managerName: 'سامر قاسم',
        specialtyChannel: 'whatsapp',
        monthlyTarget: 8000,
        dailyLimit: 10,
        status: 'active',
        isOnline: true,
        activeLeads: 9,
        totalLeads: 25,
        convertedLeads: 7,
        currentSales: 4200,
        avatar: '👩‍💻'
      },
      {
        id: 'emp-5',
        name: 'محمد علي',
        phone: '0795556677',
        email: 'mohammed@company.com',
        role: 'مسؤول مبيعات مباشر',
        isManager: false,
        managerId: 'emp-1',
        managerName: 'سامر قاسم',
        specialtyChannel: 'all',
        monthlyTarget: 10000,
        dailyLimit: 12,
        status: 'active',
        isOnline: true,
        activeLeads: 15,
        totalLeads: 30,
        convertedLeads: 10,
        currentSales: 6800,
        avatar: '👨‍💼'
      }
    ];
  });

  // Active Sales Manager Selection
  const managersList = employees.filter(e => e.isManager || e.role?.includes('مدير'));
  const [selectedManagerId, setSelectedManagerId] = useState<string>(() => {
    if (user?.name || user?.email) {
      const matched = managersList.find(m => m.name === user.name || m.email === user.email);
      if (matched) return matched.id;
    }
    return managersList[0]?.id || 'emp-1';
  });

  useEffect(() => {
    if (user?.name || user?.email) {
      const matched = managersList.find(m => m.name === user.name || m.email === user.email);
      if (matched) {
        setSelectedManagerId(matched.id);
      }
    }
  }, [user.name, user.email, employees]);

  const activeManager = managersList.find(m => m.id === selectedManagerId) || managersList[0];

  // Team members reporting to this manager
  const teamMembers = employees.filter(e => e.managerId === activeManager?.id || (e.managerName === activeManager?.name && !e.isManager));

  // Leads Data
  const [leads, setLeads] = useState(() => {
    const stored = localStorage.getItem('crm_leads');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return mockLeads.map((l, idx) => ({
      ...l,
      assignedTo: l.assignedTo || (idx % 2 === 0 ? 'حمزة الشريف' : 'فرح الزعبي'),
      assignedRepId: idx % 2 === 0 ? 'emp-3' : 'emp-4'
    }));
  });

  // Active Tab: 'team' | 'deals' | 'broadcast'
  const [activeTab, setActiveTab] = useState<'team' | 'deals' | 'broadcast'>('team');

  // Search & Filter
  const [searchRep, setSearchRep] = useState('');
  const [searchLead, setSearchLead] = useState('');
  const [leadChannelFilter, setLeadChannelFilter] = useState('all');

  // Broadcast Message State
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [targetRepId, setTargetRepId] = useState('all');

  // Reassignment Modal State
  const [selectedLeadToReassign, setSelectedLeadToReassign] = useState<any | null>(null);
  const [newRepForLead, setNewRepForLead] = useState<string>('');

  // Target Editing Modal
  const [editingRepTarget, setEditingRepTarget] = useState<Employee | null>(null);
  const [newTargetVal, setNewTargetVal] = useState<number>(10000);
  const [newLimitVal, setNewLimitVal] = useState<number>(10);

  useEffect(() => {
    localStorage.setItem('crm_sales_reps', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }, [leads]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Metrics Calculations
  const teamTotalTarget = teamMembers.reduce((acc, m) => acc + (m.monthlyTarget || 0), activeManager?.monthlyTarget || 0);
  const teamTotalSales = teamMembers.reduce((acc, m) => acc + (m.currentSales || 0), activeManager?.currentSales || 0);
  const teamTargetPct = teamTotalTarget > 0 ? Math.round((teamTotalSales / teamTotalTarget) * 100) : 0;
  
  const teamTotalLeads = teamMembers.reduce((acc, m) => acc + (m.totalLeads || 0), 0);
  const teamConvertedLeads = teamMembers.reduce((acc, m) => acc + (m.convertedLeads || 0), 0);
  const teamConversionRate = teamTotalLeads > 0 ? Math.round((teamConvertedLeads / teamTotalLeads) * 100) : 0;

  // Auto round-robin distribution
  const handleAutoDistributeLeads = () => {
    if (teamMembers.length === 0) {
      showToast('لا يوجد أعضاء مبيعات متوفرين في فريقك للتوزيع!');
      return;
    }

    let repIndex = 0;
    const updatedLeads = leads.map(lead => {
      if (lead.status === 'new' || !lead.assignedTo) {
        const assignedRep = teamMembers[repIndex % teamMembers.length];
        repIndex++;
        return {
          ...lead,
          assignedTo: assignedRep.name,
          assignedRepId: assignedRep.id,
          status: 'contacted'
        };
      }
      return lead;
    });

    setLeads(updatedLeads);
    showToast('تم التوزيع التلقائي العادل للعملاء الجدد على أعضاء الفريق بنجاح! 🎯');
  };

  // Single Reassignment
  const handleConfirmReassign = () => {
    if (!selectedLeadToReassign || !newRepForLead) return;

    const repObj = employees.find(e => e.id === newRepForLead || e.name === newRepForLead);
    const updated = leads.map(l => {
      if (l.id === selectedLeadToReassign.id) {
        return {
          ...l,
          assignedTo: repObj?.name || newRepForLead,
          assignedRepId: repObj?.id
        };
      }
      return l;
    });

    setLeads(updated);
    showToast(`تم إعادة تعيين العميل (${selectedLeadToReassign.name}) للمندوب (${repObj?.name || newRepForLead}) بنجاح`);
    setSelectedLeadToReassign(null);
  };

  // Save Target & Limit changes
  const handleSaveRepTarget = () => {
    if (!editingRepTarget) return;

    const updated = employees.map(emp => {
      if (emp.id === editingRepTarget.id) {
        return {
          ...emp,
          monthlyTarget: Number(newTargetVal),
          dailyLimit: Number(newLimitVal)
        };
      }
      return emp;
    });

    setEmployees(updated);
    showToast(`تم تحديث الهدف والسعة اليومية للموظف (${editingRepTarget.name}) بنجاح`);
    setEditingRepTarget(null);
  };

  // Send Broadcast Message
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    const targetText = targetRepId === 'all' 
      ? 'جميع أعضاء فريق المبيعات' 
      : employees.find(e => e.id === targetRepId)?.name || 'المندوب المحدد';

    showToast(`تم إرسال التوجيه الفوري إلى (${targetText}) بنجاح! 📢`);
    setBroadcastMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm">{notification}</span>
        </div>
      )}

      {/* Top Banner & Manager Selection Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-3xl font-extrabold shadow-inner shrink-0">
              {activeManager?.avatar || '👑'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-400 text-slate-900 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  مدير مبيعات مسؤول
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  🟢 متواجد الآن
                </span>
              </div>
              <h1 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
                لوحة توجيه وإشراف مدير المبيعات: <span className="text-amber-300">{activeManager?.name}</span>
              </h1>
              <p className="text-slate-300 text-xs mt-1">
                إدارة أداء فريق المبيعات، توزيع المباشر للعملاء، متابعة إنجاز الأهداف وتصديق الصفقات
              </p>
            </div>
          </div>

          {/* Switch Active Manager Context & Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 backdrop-blur-sm">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block">تبديل حساب مدير المبيعات:</span>
              <select
                value={selectedManagerId}
                onChange={(e) => setSelectedManagerId(e.target.value)}
                className="bg-slate-900 text-amber-300 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-amber-400"
              >
                {managersList.map(m => (
                  <option key={m.id} value={m.id}>
                    👨‍💼 المدير: {m.name} ({employees.filter(e => e.managerId === m.id).length} موظف)
                  </option>
                ))}
              </select>
            </div>

            <Link
              to="/employees"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 mr-auto lg:mr-0"
            >
              <Users className="w-4 h-4" />
              إدارة الهيكلية والموظفين
            </Link>
          </div>
        </div>

        {/* Manager High-Level Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
            <span className="text-[11px] font-bold text-slate-400 block">أعضاء الفريق التابعين</span>
            <span className="text-lg font-black text-white mt-0.5 block">{teamMembers.length} موظف مبيعات</span>
          </div>

          <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
            <span className="text-[11px] font-bold text-slate-400 block">مبيعات الفريق / الهدف</span>
            <span className="text-lg font-black text-amber-300 mt-0.5 block">
              {teamTotalSales.toLocaleString()} / {teamTotalTarget.toLocaleString()} <span className="text-xs text-slate-400 font-normal">د.أ</span>
            </span>
          </div>

          <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
            <span className="text-[11px] font-bold text-slate-400 block">نسبة تحقيق هدف الفريق</span>
            <span className="text-lg font-black text-emerald-400 mt-0.5 block">{teamTargetPct}% مبيعات</span>
          </div>

          <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
            <span className="text-[11px] font-bold text-slate-400 block">معدل تحويل الصفقات</span>
            <span className="text-lg font-black text-blue-400 mt-0.5 block">{teamConversionRate}% اغلاق</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('team')}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'team'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" />
          أداء فريق المبيعات ({teamMembers.length})
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'deals'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4 text-emerald-400" />
          إشراف الصفقات والفواتير
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'broadcast'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Send className="w-4 h-4 text-purple-400" />
          توجيهات وإشعارات الفريق المباشرة
        </button>
      </div>

      {/* TAB 1: TEAM PERFORMANCE & ROSTER */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                سجل متابعة أعضاء فريق المبيعات التابعين لـ ({activeManager?.name})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تحديد المستهدفات الشهرية، السعة اليومية لاستقبال العملاء، ومراقبة التقدم
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchRep}
                onChange={(e) => setSearchRep(e.target.value)}
                placeholder="ابحث باسم المندوب..."
                className="w-full pl-4 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Sales Rep Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teamMembers
              .filter(m => !searchRep || m.name.toLowerCase().includes(searchRep.toLowerCase()))
              .map(rep => {
                const repSales = rep.currentSales || 0;
                const repTarget = rep.monthlyTarget || 10000;
                const pct = repTarget > 0 ? Math.round((repSales / repTarget) * 100) : 0;

                return (
                  <div key={rep.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 hover:shadow-md transition-all relative group">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shadow-xs">
                          {rep.avatar || '👤'}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base">{rep.name}</h4>
                          <span className="text-xs font-bold text-slate-500 block">{rep.role}</span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        rep.status === 'active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
                      }`}>
                        {rep.status === 'active' ? '🟢 نشط' : '🔴 موقوف'}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-bold text-slate-400">تخصص القناة:</span>
                        <span className="font-extrabold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                          {rep.specialtyChannel === 'all' ? '🌐 جميع القنوات' : rep.specialtyChannel === 'whatsapp' ? '💬 الواتساب' : rep.specialtyChannel === 'booking' ? '📅 الحجوزات' : '🛒 المتجر'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-bold text-slate-400">الاستقبال اليومي الأقصى:</span>
                        <span className="font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          {rep.dailyLimit || 10} عملاء / يومياً
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-bold text-slate-400">العملاء النشطين حالياً:</span>
                        <span className="font-extrabold text-slate-900">{rep.activeLeads || 0} عميل</span>
                      </div>

                      {/* Progress bar */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                          <span className="text-slate-500">مبيعات الشهر: {repSales.toLocaleString()} د.أ</span>
                          <span className="text-blue-600">{pct}% من الهدف ({repTarget.toLocaleString()} د.أ)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              pct >= 100 ? 'bg-emerald-500' : pct >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setEditingRepTarget(rep);
                          setNewTargetVal(rep.monthlyTarget || 10000);
                          setNewLimitVal(rep.dailyLimit || 10);
                        }}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        تعديل الهدف والسعة
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {teamMembers.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700">لا يوجد أعضاء مبيعات معينين حالياً تحت إشراف هذا المدير</h4>
              <p className="text-xs text-slate-400 mt-1">يمكنك تعيين الموظفين من صفحة إدارة الموظفين</p>
              <Link
                to="/employees"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
              >
                انتقل لصفحة إدارة الموظفين
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DEALS & QUOTES OVERSIGHT */}
      {activeTab === 'deals' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                سجل صفقات وفواتير أعضاء الفريق المعلقة والحديثة
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">مراجعة الفواتير وعروض الأسعار الصادرة من المناديب قبل الاعتماد النهائي</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'inv-101', client: 'شركة الأفق القابضة', rep: 'حمزة الشريف', amount: '1,450 د.أ', status: 'مكتمل ومحصل', date: '2026-08-11' },
              { id: 'inv-102', client: 'مستشفى الشفاء التخصصي', rep: 'فرح الزعبي', amount: '3,200 د.أ', status: 'بانتظار الاعتماد', date: '2026-08-12' },
              { id: 'inv-103', client: 'عيادات الابتسامة', rep: 'محمد علي', amount: '850 د.أ', status: 'تم إرسال الفاتورة', date: '2026-08-10' },
            ].map(item => (
              <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-mono text-xs font-bold text-slate-400">#{item.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status.includes('مكتمل') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-slate-900 text-base">{item.client}</h4>
                  <p className="text-xs text-slate-500 font-bold mt-1">المندوب المسؤول: <span className="text-blue-600">{item.rep}</span></p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400">القيمة المالية:</span>
                  <span className="text-base font-black text-slate-900">{item.amount}</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button 
                    onClick={() => showToast(`تم اعتماد الصفقة #${item.id} بنجاح`)}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    اعتماد الصرف
                  </button>
                  <button 
                    onClick={() => showToast(`تم إرسال ملاحظات المراجعة للمندوب`)}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    ملاحظة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BROADCAST MESSAGES & ALERTS */}
      {activeTab === 'broadcast' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm max-w-3xl mx-auto space-y-5">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Send className="w-5 h-5 text-purple-600" />
              إرسال توجيه فوري / تعميم لأعضاء فريق المبيعات
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              سيظهر هذا التوجيه بشكل بارز ومباشر في لوحة التحكم الخاصة بالمندوبين المحددات
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">المستهدف بالتوجيه:</label>
              <select
                value={targetRepId}
                onChange={(e) => setTargetRepId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">📢 جميع أعضاء فريق المبيعات (تعميم شامل)</option>
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>👤 {m.name} ({m.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">نص التوجيه المباشر:</label>
              <textarea
                rows={4}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="اكتب التوجيه هنا (مثال: يرجى التركيز اليوم على متابعة عملاء الحملة الإعلانية الأخيرة وإغلاق الصفقات المعلقة)..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-purple-200 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              إرسال التوجيه الآن
            </button>
          </form>
        </div>
      )}

      {/* REASSIGNMENT MODAL */}
      {selectedLeadToReassign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-amber-500" />
              إعادة تعيين العميل: {selectedLeadToReassign.name}
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">اختر المندوب الجديد:</label>
              <select
                value={newRepForLead}
                onChange={(e) => setNewRepForLead(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
              >
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    👤 {m.name} ({m.specialtyChannel === 'all' ? 'جميع المبيعات' : m.specialtyChannel})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedLeadToReassign(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmReassign}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                تأكيد النقل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TARGET & LIMIT MODAL */}
      {editingRepTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              تعديل الهدف والسعة اليومية للموظف: {editingRepTarget.name}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">الهدف الشهري المطلـوب (د.أ):</label>
                <input
                  type="number"
                  value={newTargetVal}
                  onChange={(e) => setNewTargetVal(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">السعة اليومية للعملاء (عميل/يوم):</label>
                <input
                  type="number"
                  value={newLimitVal}
                  onChange={(e) => setNewLimitVal(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingRepTarget(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveRepTarget}
                className="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
