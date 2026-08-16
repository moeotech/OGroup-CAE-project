import { useState, useEffect } from 'react';
import { Users, Phone, Target, CheckCircle2, Search, Filter, Clock, MapPin, Eye, MessageCircle, ArrowLeft, UserCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import { mockLeads } from '../../data';
import { useAuth } from '../../contexts/AuthContext';

export default function SalesDashboard() {
  const { user } = useAuth();
  const [selectedLeadId, setSelectedLeadId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [salesReps] = useState<any[]>(() => {
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

  const [leads] = useState(() => {
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

  const repLeads = leads.filter((l: any) => {
    if (selectedRepFilter === 'all') return true;
    return l.assignedTo === selectedRepFilter;
  });

  const filteredTableLeads = repLeads.filter((l: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.name?.toLowerCase().includes(q) ||
      l.phone?.includes(q) ||
      l.source?.toLowerCase().includes(q)
    );
  });

  const selectedLead = leads.find((l: any) => l.id === selectedLeadId);

  // Compute metrics for rep
  const totalAssignedLeads = repLeads.length;
  const callTasks = repLeads.filter((l: any) => l.status === 'new' || l.status === 'contacted').length;
  const closedWon = repLeads.filter((l: any) => l.status === 'won').length;
  const conversionRate = totalAssignedLeads > 0 ? Math.round((closedWon / totalAssignedLeads) * 100) : 0;

  const renderTimeline = () => (
    <div className="mt-6 border-t border-slate-100 pt-6">
      <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-500" />
        رحلة العميل المعيّن (Customer Journey)
      </h3>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        
        {/* Phase 3: Action */}
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-100 text-emerald-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            <Phone className="w-4 h-4" />
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between space-x-2 mb-1">
              <div className="font-bold text-slate-900 text-sm">مكالمة هاتفية (Lead Assigned)</div>
              <time className="text-xs font-medium text-emerald-500">الآن</time>
            </div>
            <div className="text-slate-500 text-xs">تم تعيين العميل إلى المندوب ({selectedLead?.assignedTo || selectedRepFilter}) تلقائياً عبر التوزيع المتوازن.</div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">
              Auto-Assigned & Verified
            </div>
          </div>
        </div>

        {/* Phase 2: Intent */}
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between space-x-2 mb-1">
              <div className="font-bold text-slate-900 text-sm">نقر على إعلان المصدر ({selectedLead?.source || 'WhatsApp'})</div>
              <time className="text-xs font-medium text-slate-400">منذ 5 دقائق</time>
            </div>
            <div className="text-slate-500 text-xs">تواصل عبر القناة وتم احتساب التكلفة وتوجيه الطلب فورا.</div>
          </div>
        </div>

        {/* Phase 1: Anonymous */}
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            <Eye className="w-4 h-4" />
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50 shadow-sm opacity-75">
            <div className="flex items-center justify-between space-x-2 mb-1">
              <div className="font-bold text-slate-700 text-sm">مشاهدة محتوى تسويقي</div>
              <time className="text-xs font-medium text-slate-400">منذ 15 دقيقة</time>
            </div>
            <div className="text-slate-500 text-xs">تصفح العرض عبر منصة OGroup وتوثيق الاهتمام</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">لوحة المبيعات (OFlow CRM)</h1>
        <p className="text-slate-500 mt-1">تتبع مهامك اليومية والعملاء المحتملين المعينين لك من التوزيع التلقائي</p>
      </div>

      {/* Rep Scope Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">
                {user.role === 'sales' ? 'صلاحيات مندوب المبيعات الخصوصية' : 'تصفية عملاء مندوب المبيعات'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {user.role === 'sales' ? 'عملاؤك المعينون فقط 🔒' : 'إدارة الفريق 📊'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {user.role === 'sales'
                ? `تعرض هذه اللوحة حصراً العملاء المعينين لمندوب المبيعات [${selectedRepFilter}] عبر التوزيع التلقائي.`
                : 'يمكنك اختيار مندوب مبيعات محدد لمعاينة قائمته ومؤشرات أدائه الفردية.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/90 p-2 rounded-xl border border-slate-700 w-full md:w-auto shrink-0 justify-between">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-slate-300 whitespace-nowrap">المندوب الحالي:</span>
          </div>
          <select 
            value={selectedRepFilter}
            onChange={(e) => setSelectedRepFilter(e.target.value)}
            className="bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {user.role !== 'sales' && <option value="all">🌐 جميع المندوبين</option>}
            {salesReps.map((rep: any) => (
              <option key={rep.id || rep.name} value={rep.name}>
                👤 {rep.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">عملاء معينون لك</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalAssignedLeads}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">مهام الاتصال المتبقية</p>
            <h3 className="text-2xl font-bold text-slate-900">{callTasks}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">مبيعاتك المحققة (Won)</p>
            <h3 className="text-2xl font-bold text-slate-900">{closedWon}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">نسبة التحويل الخاصة بك</p>
            <h3 className="text-2xl font-bold text-slate-900">{conversionRate}%</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {selectedLead ? (
          <div className="p-6">
            <button 
              onClick={() => setSelectedLeadId(null)}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> عودة للقائمة
            </button>
            
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <UserCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedLead.name}</h2>
                  <p className="text-slate-500 font-medium" dir="ltr">{selectedLead.phone}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600">
                      الحالة: {selectedLead.status === 'new' ? 'جديد' : selectedLead.status === 'won' ? 'مغلق (نجاح)' : selectedLead.status}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">المصدر: {selectedLead.source}</span>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-800">
                      المندوب المسؤول: {selectedLead.assignedTo}
                    </span>
                  </div>
                </div>
              </div>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2">
                <Phone className="w-4 h-4" />
                بدء مكالمة
              </button>
            </div>

            {renderTimeline()}
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-lg">قائمة عملاء المندوب (Lead Queue)</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-2.5 py-1 rounded-full">
                  {filteredTableLeads.length} عميل
                </span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="بحث باسم العميل، الهاتف، المصدر..." 
                    className="w-full pl-3 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" 
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                    <th className="py-3.5 px-6 font-medium">اسم العميل</th>
                    <th className="py-3.5 px-6 font-medium">رقم الهاتف</th>
                    <th className="py-3.5 px-6 font-medium">المصدر</th>
                    <th className="py-3.5 px-6 font-medium">المندوب المسؤول</th>
                    <th className="py-3.5 px-6 font-medium">الحالة</th>
                    <th className="py-3.5 px-6 font-medium text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTableLeads.map((lead: any) => (
                    <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedLeadId(lead.id)}>
                      <td className="py-4 px-6 font-bold text-slate-900">{lead.name}</td>
                      <td className="py-4 px-6 text-slate-600 font-medium" dir="ltr">{lead.phone}</td>
                      <td className="py-4 px-6 text-slate-500 text-sm">{lead.source}</td>
                      <td className="py-4 px-6 text-slate-800 font-bold text-xs">
                        <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                          👤 {lead.assignedTo || selectedRepFilter}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          lead.status === 'new' ? 'bg-blue-50 text-blue-600' :
                          lead.status === 'won' ? 'bg-emerald-50 text-emerald-600' :
                          lead.status === 'appointment' ? 'bg-purple-50 text-purple-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {lead.status === 'new' ? 'جديد' : lead.status === 'won' ? 'مغلق (نجاح)' : lead.status === 'appointment' ? 'حجز موعد' : lead.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          className="px-4 py-1.5 bg-blue-50 text-blue-600 font-bold rounded-xl text-xs hover:bg-blue-100 transition-colors"
                          onClick={(e) => { e.stopPropagation(); setSelectedLeadId(lead.id); }}
                        >
                          عرض الرحلة
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredTableLeads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                        لا يوجد عملاء معينين لـ ({selectedRepFilter}) مطبقين مع معايير البحث
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
