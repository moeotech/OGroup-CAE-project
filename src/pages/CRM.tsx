import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { mockLeads } from '../data';
import { useAuth } from '../contexts/AuthContext';
import { Phone, MessageCircle, Calendar, Plus, MoreHorizontal, X, MapPin, Eye, ArrowLeft, UserCircle2, Clock, Download, UserCheck, ShieldCheck, Zap, Send, CheckCircle2, Video, GripVertical, Sparkles, Filter } from 'lucide-react';
import ReportModal from '../components/ReportModal';
import { showToast } from '../utils/toast';

const COLUMNS = [
  { id: 'new', title: 'New Leads', color: 'bg-blue-500' },
  { id: 'contacted', title: 'تم الاتصال', color: 'bg-amber-500' },
  { id: 'appointment', title: 'حجز موعد', color: 'bg-purple-500' },
  { id: 'won', title: 'مبيعات محققة (Won)', color: 'bg-emerald-500' }
];

const getCreatorNameForLead = (lead: any) => {
  if (lead?.creator) return lead.creator;
  if (lead?.id === '101') return 'Dr. Smile';
  if (lead?.id === '102') return 'أكاديمية المستقبل';
  if (lead?.id === '103') return 'Sara Dental';
  if (lead?.id === '104') return 'Smile Snapchat';
  if (lead?.id === '105') return 'Ahmed Media';
  return 'Dr. Smile';
};

export default function CRM() {
  const { user } = useAuth();

  const [salesReps, setSalesReps] = useState<any[]>(() => {
    const stored = localStorage.getItem('crm_sales_reps');
    return stored ? JSON.parse(stored) : [
      { id: 'rep-1', name: 'سامر قاسم' },
      { id: 'rep-2', name: 'رانيا العبدالله' },
      { id: 'rep-3', name: 'حمزة الشريف' },
      { id: 'rep-4', name: 'فرح الزعبي' },
      { id: 'rep-5', name: 'محمد علي' }
    ];
  });

  const [selectedRepFilter, setSelectedRepFilter] = useState<string>(() => {
    if (user.role === 'sales') {
      return user.name || 'محمد علي';
    }
    return 'all';
  });

  useEffect(() => {
    if (user.role === 'sales') {
      setSelectedRepFilter(user.name || 'محمد علي');
    }
  }, [user.role, user.name]);

  const [leads, setLeads] = useState(() => {
    const repNames = ['محمد علي', 'سامر قاسم', 'رانيا العبدالله', 'حمزة الشريف', 'فرح الزعبي'];
    const storedLeads = localStorage.getItem('crm_leads');
    let initialList = mockLeads;
    if (storedLeads) {
      const parsed = JSON.parse(storedLeads);
      const merged = [...parsed];
      mockLeads.forEach(ml => {
        if (!parsed.find((p: any) => p.id === ml.id)) {
          merged.push(ml);
        }
      });
      initialList = merged;
    }
    return initialList.map((l: any, idx: number) => ({
      ...l,
      assignedTo: l.assignedTo || repNames[idx % repNames.length]
    }));
  });

  useEffect(() => {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }, [leads]);

  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadData, setNewLeadData] = useState({ name: '', phone: '', source: 'Manual', assignedTo: '' });

  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [moveToast, setMoveToast] = useState<{ leadName: string; stageTitle: string } | null>(null);

  const activeLead = leads.find((l: any) => l.id === selectedLead);

  const handleUpdateStatus = (leadId: string, newStatus: string) => {
    const targetLead = leads.find((l: any) => l.id === leadId);
    setLeads((prev: any[]) => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (targetLead && targetLead.status !== newStatus) {
      const col = COLUMNS.find(c => c.id === newStatus);
      if (col) {
        setMoveToast({
          leadName: targetLead.name,
          stageTitle: col.title
        });
        setTimeout(() => setMoveToast(null), 3500);
      }
    }
  };

  const handleAssignRep = (leadId: string, repName: string) => {
    setLeads((prev: any[]) => prev.map(l => l.id === leadId ? { ...l, assignedTo: repName } : l));
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadData.name || !newLeadData.phone) return;
    
    // Read distribution configuration
    const distConfigStr = localStorage.getItem('crm_dist_config');
    const distConfig = distConfigStr ? JSON.parse(distConfigStr) : { strategy: 'round-robin', autoWhatsAppNotif: true };

    // Get current reps
    const repsList = salesReps.length > 0 ? salesReps : [
      { id: 'rep-1', name: 'سامر قاسم', activeLeads: 18, isOnline: true, dailyLimit: 10, assignedCountToday: 4, phone: '0791112233' },
      { id: 'rep-2', name: 'رانيا العبدالله', activeLeads: 22, isOnline: true, dailyLimit: 10, assignedCountToday: 5, phone: '0792223344' },
      { id: 'rep-3', name: 'حمزة الشريف', activeLeads: 14, isOnline: true, dailyLimit: 8, assignedCountToday: 3, phone: '0793334455' },
      { id: 'rep-4', name: 'فرح الزعبي', activeLeads: 9, isOnline: false, dailyLimit: 10, assignedCountToday: 0, phone: '0794445566' }
    ];

    let assignedRep = repsList.find(r => r.name === newLeadData.assignedTo);

    if (!assignedRep) {
      const onlineReps = repsList.filter(r => r.isOnline !== false);
      const eligibleReps = onlineReps.length > 0 ? onlineReps : repsList;

      // Determine channel category from source
      let leadChannel = 'all';
      const src = (newLeadData.source || '').toLowerCase();
      if (src.includes('whatsapp') || src.includes('واتساب')) {
        leadChannel = 'whatsapp';
      } else if (src.includes('booking') || src.includes('حجز') || src.includes('نموذج')) {
        leadChannel = 'booking';
      } else if (src.includes('store') || src.includes('متجر') || src.includes('facebook') || src.includes('instagram') || src.includes('tiktok') || src.includes('snapchat') || src.includes('google ads') || src.includes('إعلان')) {
        leadChannel = 'store';
      }

      // Filter reps specialized in this channel
      const specialized = eligibleReps.filter(r => r.specialtyChannel === leadChannel);
      const general = eligibleReps.filter(r => r.specialtyChannel === 'all' || !r.specialtyChannel);
      const pool = specialized.length > 0 ? specialized : (general.length > 0 ? general : eligibleReps);

      if (distConfig.strategy === 'load-balanced') {
        assignedRep = [...pool].sort((a, b) => (a.activeLeads || 0) - (b.activeLeads || 0))[0];
      } else {
        // Round Robin default for pool
        assignedRep = [...pool].sort((a, b) => (a.assignedCountToday || 0) - (b.assignedCountToday || 0))[0];
      }
    }

    const assignedName = assignedRep?.name || 'سامر قاسم';

    // Update sales reps counts in localStorage
    const updatedReps = repsList.map(r => {
      if (r.name === assignedName) {
        return {
          ...r,
          activeLeads: (r.activeLeads || 0) + 1,
          assignedCountToday: (r.assignedCountToday || 0) + 1
        };
      }
      return r;
    });
    setSalesReps(updatedReps);
    localStorage.setItem('crm_sales_reps', JSON.stringify(updatedReps));

    const newLead = {
      id: Date.now().toString(),
      name: newLeadData.name,
      phone: newLeadData.phone,
      source: newLeadData.source,
      status: 'new',
      assignedTo: assignedName,
      campaignId: 'manual',
      createdAt: new Date().toISOString()
    };
    
    setLeads((prev: any[]) => [newLead, ...prev]);
    setShowAddLeadModal(false);

    // Show WhatsApp notification alert
    if (distConfig.autoWhatsAppNotif !== false) {
      showToast(`تم تعيين العميل "${newLead.name}" تلقائياً إلى (${assignedName})\nتم إرسال إشعار فوري عبر الواتساب إلى الموظف بالبيانات كاملة!`, 'success', '✅ تعيين عميل جديد');
    }

    setNewLeadData({ name: '', phone: '', source: 'Manual', assignedTo: '' });
  };

  const renderTimeline = () => {
    if (!activeLead) return null;

    const storedApts = JSON.parse(localStorage.getItem('crm_appointments') || '[]');
    const leadApts = storedApts.filter((a: any) => a.customer === activeLead.name || a.phone === activeLead.phone);

    const storedEvents = JSON.parse(localStorage.getItem('crm_timeline') || '[]');
    const leadEvents = storedEvents.filter((e: any) => e.customer === activeLead.name);

    const storedOrders = JSON.parse(localStorage.getItem('crm_orders') || '[]');
    const leadOrders = storedOrders.filter((o: any) => o.customer === activeLead.name);

    const assignedRepName = activeLead.assignedTo || 'سامر قاسم';
    const entrySource = activeLead.source || 'واتساب مباشر';

    return (
      <div className="mt-6 border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            سجل الأحداث والإجراءات التلقائية (Automated Action Timeline)
          </h3>
          <span className="text-[11px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            أتمتة موثقة 100%
          </span>
        </div>

        {/* Structured Automated Steps Cards */}
        <div className="space-y-4 mb-8">
          {/* Step 1: Entry Channel */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3 relative overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  دخول العميل عبر قناة [{entrySource}] (صانع المحتوى: {getCreatorNameForLead(activeLead)})
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  لحظة الوصول
                </span>
              </div>
              <p className="text-slate-600 text-xs mt-1">
                تم استلام بيانات العميل بنجاح من المصدر ({entrySource}) وتوثيق الرقم والموقع.
              </p>
              <div className="mt-2.5 space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold border border-emerald-200/80 w-fit">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Unique Lead Validated - No duplicate charges. 2.00 JOD deducted from OWallet.</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-700 bg-white px-2.5 py-1 rounded-lg w-fit font-mono font-bold border border-slate-200">
                  <span>Trace ID: TRC-{activeLead.id || '9982'}-XYZ</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-blue-600 font-sans">Verified Channel Data</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Auto-Assign Execution */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3 relative overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  التوزيع التلقائي الخوارزمي (Auto-Assign)
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ⚡ 0.2 ثانية استجابة
                </span>
              </div>
              <p className="text-slate-600 text-xs mt-1">
                تم توجيه العميل وتعيينه تلقائياً لمسؤول المبيعات المخصص للقناة: <strong className="text-slate-900 font-bold">{assignedRepName}</strong>.
              </p>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit font-bold border border-emerald-100">
                <span>استراتيجية التوزيع: Channel Specialist Round-Robin</span>
              </div>
            </div>
          </div>

          {/* Step 3: Instant WhatsApp Notification Dispatch */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3 relative overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-purple-600" />
                  إرسال إشعارات الواتساب الفورية (Instant Dispatch)
                </span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  تم التسليم 🟢
                </span>
              </div>
              <p className="text-slate-600 text-xs mt-1">
                تم إرسال تنبيه فوري عبر الواتساب للموظف ({assignedRepName}) برابط الملف المباشر + رسالة ترحيب أولية تلقائية للعميل.
              </p>
            </div>
          </div>

          {/* Step 4: First Rep Message & Engagement */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 relative overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">
              4
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-amber-600" />
                  تواصل الموظف وأول رسالة استجابة (First Rep Interaction)
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  مستمر
                </span>
              </div>
              <p className="text-slate-700 text-xs mt-1">
                قام الموظف <strong className="text-slate-900">{assignedRepName}</strong> بمراجعة طلب العميل والتواصل عبر المحادثة المباشرة لتأكيد الاحتياج وإغلاق الصفقة.
              </p>
            </div>
          </div>
        </div>

        {/* Extended Interactive Events History */}
        <h4 className="font-bold text-slate-800 text-xs mb-4">سجل الحركات والتفاعلات السابقة</h4>
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          
          {/* Dynamic Appointment Events from Booking Forms or Schedule */}
          {leadApts.map((apt: any, idx: number) => (
            <div key={`apt-${apt.id || idx}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-purple-100 text-purple-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-purple-100 bg-purple-50/50 shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-900 text-sm">{apt.service || 'حجز موعد'}</div>
                  <time className="text-xs font-bold text-purple-600">{apt.date} - {apt.time}</time>
                </div>
                <div className="text-slate-600 text-xs">
                  المصدر: <span className="font-bold">{apt.source || 'نموذج الحجز الإلكتروني'}</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold">
                  حالة الموعد: {apt.status === 'confirmed' ? 'مؤكد' : 'قيد الانتظار'}
                </div>
              </div>
            </div>
          ))}

          {/* Dynamic Timeline Events */}
          {leadEvents.map((evt: any, idx: number) => (
            <div key={`evt-${evt.id || idx}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-900 text-sm">{evt.title}</div>
                  <time className="text-xs font-medium text-slate-400">اليوم</time>
                </div>
                <div className="text-slate-500 text-xs">{evt.description}</div>
              </div>
            </div>
          ))}

          {/* Dynamic Storefront Orders */}
          {leadOrders.map((ord: any, idx: number) => (
            <div key={`ord-${ord.id || idx}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-100 text-emerald-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Phone className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-900 text-sm">طلب شراء من المتجر #{ord.id}</div>
                  <time className="text-xs font-bold text-emerald-600">{ord.total} د.أ</time>
                </div>
                <div className="text-slate-600 text-xs">عدد العناصر: {ord.items} - التاريخ: {ord.date}</div>
              </div>
            </div>
          ))}

          {/* Default Phase 1: Registration/Source */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Eye className="w-4 h-4" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50 shadow-sm opacity-90">
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className="font-bold text-slate-700 text-sm">تسجيل العميل (Lead Registration)</div>
                <time className="text-xs font-medium text-slate-400">سجل المصدر</time>
              </div>
              <div className="text-slate-500 text-xs">المصدر: {activeLead.source || 'غير محدد'}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-200 text-slate-600 text-[10px] font-bold">
                  OFlow Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const visibleLeads = leads.filter((lead: any) => {
    if (selectedRepFilter === 'all') return true;
    return lead.assignedTo === selectedRepFilter;
  });

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto relative">
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة العملاء (OFlow CRM)</h1>
          <p className="text-slate-500 mt-1">تتبع رحلة العميل من أول نقرة إلى الإغلاق</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowReportModal(true)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            تصدير تقرير
          </button>
          <button 
            onClick={() => setShowAddLeadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            إضافة عميل
          </button>
        </div>
      </div>

      {/* Permission & Rep Assignment Context Banner */}
      <div className="mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">
                {user.role === 'sales' ? 'صلاحيات مندوب المبيعات (Sales Rep Lead View)' : 'نظام التوزيع التلقائي وعرض صلاحيات الفريق'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {user.role === 'sales' ? 'حماية بيانات المندوب 🔒' : 'إدارة شاملة 📊'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {user.role === 'sales'
                ? `تعرض القائمة حصراً العملاء المعينين للمندوب [${selectedRepFilter}] من خوارزمية التوزيع التلقائي. لا يمكن لمندوب رؤية عملاء زملائه.`
                : 'بصفتك مديراً، يمكنك الاطلاع على كافة العملاء أو فلترة قائمة المندوب الفردية معاينة لوحته.'}
            </p>
          </div>
        </div>

        {/* Rep Selector for Demo / Switch */}
        <div className="flex items-center gap-2 bg-slate-800/90 p-2 rounded-xl border border-slate-700 w-full md:w-auto shrink-0 justify-between">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-slate-300 whitespace-nowrap">معاينة عملاء المندوب:</span>
          </div>
          <select 
            value={selectedRepFilter}
            onChange={(e) => setSelectedRepFilter(e.target.value)}
            className="bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {user.role !== 'sales' && <option value="all">🌐 جميع المندوبين (الكل)</option>}
            {salesReps.map((rep: any) => (
              <option key={rep.id || rep.name} value={rep.name}>
                👤 {rep.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Toast Notification on Drag / Move Stage */}
      <AnimatePresence>
        {moveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-4 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between border border-slate-700 max-w-xl mx-auto"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300">تم تحديث المرحلة بنجاح</p>
                <p className="text-sm font-bold">
                  تم نقل العميل <span className="text-blue-400 font-extrabold">{moveToast.leadName}</span> إلى مرحلة <span className="text-emerald-400 font-extrabold">[{moveToast.stageTitle}]</span>
                </p>
              </div>
            </div>
            <button 
              onClick={() => setMoveToast(null)}
              className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 px-2.5 py-1 rounded-lg"
            >
              إغلاق
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-start min-h-[500px]">
        {COLUMNS.map(column => {
          const columnLeads = visibleLeads.filter(l => l.status === column.id);
          const isOver = dragOverColumnId === column.id;
          
          return (
            <div 
              key={column.id} 
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (dragOverColumnId !== column.id) setDragOverColumnId(column.id);
              }}
              onDragLeave={(e) => {
                if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                setDragOverColumnId(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
                if (leadId) {
                  handleUpdateStatus(leadId, column.id);
                }
                setDraggedLeadId(null);
                setDragOverColumnId(null);
              }}
              className={`w-80 shrink-0 flex flex-col bg-slate-100/70 rounded-2xl p-4 border transition-all duration-200 min-h-[480px] ${
                isOver 
                  ? 'border-blue-500 bg-blue-50/50 shadow-xl ring-4 ring-blue-200/60 scale-[1.01]' 
                  : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full ${column.color} shadow-sm`}></div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{column.title}</h3>
                  <span className="bg-slate-200 text-slate-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                    {columnLeads.length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/50 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Drop Target Placeholder Highlight when dragging */}
              {isOver && draggedLeadId && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-3 p-3 rounded-xl border-2 border-dashed border-blue-400 bg-blue-100/40 text-blue-700 text-xs font-bold text-center flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                  أفلت العميل لنقله إلى [{column.title}]
                </motion.div>
              )}

              <div className="flex-1 overflow-y-auto space-y-3 pr-0.5 min-h-[380px]">
                <AnimatePresence mode="popLayout">
                  {columnLeads.map(lead => {
                    const isDraggingThis = draggedLeadId === lead.id;
                    return (
                      <motion.div 
                        layout
                        key={lead.id}
                        initial={{ opacity: 0, scale: 0.92, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88, y: -12 }}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 420, 
                          damping: 30,
                          mass: 0.8
                        }}
                        draggable="true"
                        onDragStart={(e) => {
                          setDraggedLeadId(lead.id);
                          // @ts-ignore - dataTransfer safely available in browser
                          e.dataTransfer.setData('text/plain', lead.id);
                          // @ts-ignore
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragEnd={() => {
                          setDraggedLeadId(null);
                          setDragOverColumnId(null);
                        }}
                        onClick={() => setSelectedLead(lead.id)}
                        className={`bg-white p-4 rounded-xl shadow-sm border transition-all duration-200 cursor-grab active:cursor-grabbing group hover:shadow-md relative ${
                          isDraggingThis 
                            ? 'opacity-40 ring-2 ring-blue-500 border-blue-400 rotate-1 scale-[0.98]' 
                            : 'border-slate-200/90 hover:border-blue-400'
                        }`}
                      >
                        {/* Drag Handle & Quick Stage Selector Bar */}
                        <div className="flex justify-between items-center mb-2 gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0">
                              <GripVertical className="w-4 h-4" />
                            </span>
                            <h4 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors text-sm truncate">
                              {lead.name}
                            </h4>
                          </div>
                          
                          <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-extrabold border border-purple-200/60 flex items-center gap-1 shrink-0">
                            <Video className="w-3 h-3 text-purple-600" />
                            Via: {getCreatorNameForLead(lead)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                          <span dir="ltr" className="font-mono text-slate-600 text-xs font-semibold">{lead.phone}</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            CPL: 2.00 JOD
                          </span>
                        </div>

                        {/* Sales Rep & Quick Stage Changer */}
                        <div className="mb-3 flex items-center justify-between gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
                          <div className="flex items-center gap-1.5 truncate">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">المسؤول: <strong className="text-blue-700">{lead.assignedTo || salesReps[0]?.name || 'غير محدد'}</strong></span>
                          </div>

                          {/* Quick Stage Move Dropdown */}
                          <select
                            value={lead.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(lead.id, e.target.value);
                            }}
                            className="text-[10px] font-extrabold bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md outline-none cursor-pointer hover:border-blue-400 transition-colors"
                          >
                            {COLUMNS.map(c => (
                              <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button className="w-7 h-7 rounded-full bg-slate-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors" title="واتساب">
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                            <button className="w-7 h-7 rounded-full bg-slate-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors" title="اتصال">
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                            <button className="w-7 h-7 rounded-full bg-slate-50 text-purple-600 flex items-center justify-center hover:bg-purple-100 transition-colors" title="موعد">
                              <Calendar className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            ساعتين
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {columnLeads.length === 0 && !isOver && (
                  <div className="text-center py-12 text-slate-400 text-xs border-2 border-dashed border-slate-200/80 rounded-2xl bg-white/40">
                    لا يوجد عملاء في هذه المرحلة حالياً
                    <p className="text-[10px] text-slate-400 mt-1">سحب العميل وإسقاطه هنا لنقله فوراً</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-over Panel for Customer Journey */}
      {selectedLead && activeLead && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setSelectedLead(null)} />
          
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-2xl transform transition-transform ease-in-out duration-500 bg-white shadow-2xl flex flex-col">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="rounded-full p-2 hover:bg-slate-100 transition-colors text-slate-500"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-bold text-slate-900" id="slide-over-title">تفاصيل العميل</h2>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                      <UserCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{activeLead.name}</h2>
                      <p className="text-slate-500 font-medium mt-1" dir="ltr">{activeLead.phone}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <select value={activeLead.status} onChange={(e) => handleUpdateStatus(activeLead.id, e.target.value)} className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 outline-none cursor-pointer appearance-none text-center"> 
                          {COLUMNS.map(col => (<option key={col.id} value={col.id}>{col.title}</option>))} 
                        </select>
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
                          المصدر: {activeLead.source}
                        </span>
                        
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold">
                          <span>المسؤول:</span>
                          <select 
                            value={activeLead.assignedTo || salesReps[0]?.name} 
                            onChange={(e) => handleAssignRep(activeLead.id, e.target.value)}
                            className="bg-transparent text-amber-900 font-bold outline-none cursor-pointer"
                          >
                            {salesReps.map(rep => (
                              <option key={rep.id} value={rep.name}>{rep.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      بدء مكالمة
                    </button>
                    <Link to="/crm/customer/360" state={{ customerName: activeLead.name }} className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2 justify-center">
                      <Eye className="w-4 h-4" />
                      عرض الملف 360°
                    </Link>
                  </div>
                </div>

                {renderTimeline()}
              </div>

            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <ReportModal onClose={() => setShowReportModal(false)} />
      )}

      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowAddLeadModal(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">إضافة عميل محتمل جديد</h2>
              <button onClick={() => setShowAddLeadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الاسم الكامل</label>
                <input 
                  type="text" 
                  required
                  value={newLeadData.name}
                  onChange={(e) => setNewLeadData({...newLeadData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="محمد خليل"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">رقم الهاتف</label>
                <input 
                  type="tel" 
                  required
                  value={newLeadData.phone}
                  onChange={(e) => setNewLeadData({...newLeadData, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="0791234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">المصدر</label>
                <select
                  value={newLeadData.source}
                  onChange={(e) => setNewLeadData({...newLeadData, source: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="Facebook Ads">إعلان فيسبوك (Facebook)</option>
                  <option value="WhatsApp">واتساب مباشر (WhatsApp)</option>
                  <option value="Instagram">إنستغرام (Instagram)</option>
                  <option value="TikTok">تيك توك (TikTok)</option>
                  <option value="Snapchat">سناب شات (Snapchat)</option>
                  <option value="Google Ads">إعلانات جوجل (Google Ads)</option>
                  <option value="YouTube">يوتيوب (YouTube)</option>
                  <option value="Manual">إضافة يدوية</option>
                  <option value="Phone">اتصال هاتف</option>
                  <option value="Booking Form">نموذج حجز</option>
                  <option value="Storefront">المتجر الإلكتروني</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddLeadModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm">
                  إلغاء
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm">
                  إضافة العميل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

