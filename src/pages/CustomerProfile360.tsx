import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  ShoppingCart, 
  Video, 
  ExternalLink,
  CheckCircle,
  Clock,
  ArrowRight,
  FileText,
  Receipt,
  Zap,
  Send,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import QuoteLifecycle from '../components/QuoteLifecycle';

export default function CustomerProfile360() {
  const location = useLocation();
  const customerName = location.state?.customerName || 'عبدالله الخالد';
  
  const [quotes, setQuotes] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'orders' | 'appointments'>('all');
  const [newNoteText, setNewNoteText] = useState('');

  useEffect(() => {
    const storedQuotes = JSON.parse(localStorage.getItem('crm_quotes') || '[]');
    const customerQuotes = storedQuotes.filter((q: any) => q.customer === customerName);
    setQuotes(customerQuotes);

    const storedInvoices = JSON.parse(localStorage.getItem('crm_invoices') || '[]');
    const customerInvoices = storedInvoices.filter((i: any) => i.customer === customerName);
    setInvoices(customerInvoices);

    const storedEvents = JSON.parse(localStorage.getItem('crm_timeline') || '[]');
    const customerEvents = storedEvents.filter((e: any) => e.customer === customerName);
    setTimelineEvents(customerEvents);

    const storedApts = JSON.parse(localStorage.getItem('crm_appointments') || '[]');
    const customerApts = storedApts.filter((a: any) => a.customer === customerName);
    setAppointments(customerApts);

    const storedOrders = JSON.parse(localStorage.getItem('crm_orders') || '[]');
    const customerOrders = storedOrders.filter((o: any) => o.customer === customerName);
    setOrders(customerOrders);
  }, [customerName]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newEvent = {
      id: `note-${Date.now()}`,
      customer: customerName,
      title: 'ملاحظة يدويّة من موظف المبيعات',
      description: newNoteText,
      date: new Date().toISOString(),
      type: 'event'
    };
    const updatedEvents = [newEvent, ...timelineEvents];
    setTimelineEvents(updatedEvents);
    const storedEvents = JSON.parse(localStorage.getItem('crm_timeline') || '[]');
    localStorage.setItem('crm_timeline', JSON.stringify([newEvent, ...storedEvents]));
    setNewNoteText('');
  };

  const totalQuotesValue = quotes.reduce((sum, q) => sum + q.amount, 0);
  const totalOrdersValue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalSales = 1450.00 + totalQuotesValue + totalOrdersValue;
  
  const unpaidInvoices = invoices.filter(inv => inv.status !== 'paid');
  const outstandingAmount = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const defaultStaticEvents = [
    {
      id: 'static-1',
      type: 'order',
      title: 'إغلاق الصفقة وتأكيد الشراء (Won)',
      description: `تم إتمام عملية شراء الاستشارة والخدمة بنجاح بقيمة 1,450.00 د.أ وتسجيل الإيراد للشركة.`,
      date: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: ShoppingCart,
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-600',
      extra: (
        <div className="mt-2 flex gap-2">
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> تم الدفع والتأكيد
          </span>
        </div>
      )
    },
    {
      id: 'static-2',
      type: 'appointment',
      title: 'مكالمة المتابعة والتأكيد المباشرة',
      description: `مكالمة مع العميل ${customerName}. "العميل مهتم جداً بزيادة الفروع وتفعيل الخدمة الشاملة وتم الاتفاق على خطة العمل."`,
      date: new Date(Date.now() - 1000 * 60 * 60 * 5),
      icon: CalendarIcon,
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      extra: (
        <div className="mt-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
          الموظف المسؤول: فرح الزعبي
        </div>
      )
    },
    {
      id: 'static-3',
      type: 'event',
      title: 'الرد التلقائي وتأكيد الواتساب (OAds Bot)',
      description: 'تم إرسال الرسالة الترحيبية التلقائية والعرض الخاطف المخصص وتأكيد استلام الطلب.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 18),
      icon: MessageSquare,
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-600',
      extra: (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
            🟢 أتمتة الواتساب نشطة
          </span>
        </div>
      )
    },
    {
      id: 'static-4',
      type: 'event',
      title: 'تسجيل كـ Unique Lead وتوثيق القناة',
      description: 'التقاط رقم الهاتف والموقع وتوثيق القناة كعميل فريد موثق (CPL: 2.00 JOD) مع خصم القيمة من OWallet.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      icon: User,
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      extra: (
        <div className="mt-2 flex flex-wrap gap-2 items-center">
          <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-bold border border-blue-200">
            CPL Campaign
          </span>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md font-bold border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> TRC-9982-XYZ
          </span>
        </div>
      )
    }
  ];

  const unifiedTimeline = [
    ...timelineEvents.map((e: any) => ({
      id: e.id,
      type: 'event',
      title: e.title,
      description: e.description,
      date: new Date(e.date || Date.now()),
      icon: MessageSquare,
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
      extra: null
    })),
    ...quotes.map((q: any, idx: number) => ({
      id: `quote-${q.id || idx}`,
      type: 'quote',
      title: `عرض سعر (${q.status})`,
      description: `عرض سعر رقم #${q.id} بقيمة ${q.amount.toLocaleString()} د.أ`,
      date: new Date(q.date || Date.now()),
      icon: FileText,
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      extra: <QuoteLifecycle status={q.status} className="mt-2" />
    })),
    ...invoices.map((inv: any, idx: number) => ({
      id: `invoice-${inv.id || idx}`,
      type: 'order',
      title: `فاتورة ${inv.status === 'paid' ? 'مدفوعة' : 'مستحقة'}`,
      description: `فاتورة رقم #${inv.id} بقيمة ${inv.amount.toLocaleString()} د.أ`,
      date: new Date(inv.dueDate || Date.now()),
      icon: Receipt,
      iconBg: inv.status === 'paid' ? 'bg-emerald-100' : 'bg-red-100',
      iconText: inv.status === 'paid' ? 'text-emerald-600' : 'text-red-600',
      extra: inv.status === 'paid' ? (
        <div className="mt-3 flex gap-2">
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> تم الدفع
          </span>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          <span className="text-[10px] bg-red-50 text-red-700 px-2 py-1 rounded font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> مستحقة - بانتظار الدفع
          </span>
        </div>
      )
    })),
    ...appointments.map((apt: any, idx: number) => ({
      id: `apt-${apt.id || idx}`,
      type: 'appointment',
      title: `حجز موعد (${apt.service})`,
      description: `موعد بتاريخ ${apt.date} الساعة ${apt.time} - المصدر: ${apt.source || 'نموذج الحجز الإلكتروني'}`,
      date: new Date(apt.date || Date.now()),
      icon: CalendarIcon,
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      extra: (
        <div className="mt-2 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded inline-block border border-purple-100">
          حالة الموعد: {apt.status === 'confirmed' ? 'مؤكد' : 'قيد الانتظار'}
        </div>
      )
    })),
    ...orders.map((ord: any, idx: number) => ({
      id: `order-${ord.id || idx}`,
      type: 'order',
      title: `طلب شراء من المتجر #${ord.id}`,
      description: `شراء ${ord.items} عناصر بقيمة إجمالية ${ord.total} د.أ`,
      date: new Date(ord.date || Date.now()),
      icon: ShoppingCart,
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-600',
      extra: (
        <div className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block border border-emerald-100">
          حالة الطلب: {ord.status === 'delivered' ? 'تم التوصيل' : 'جاري المعالجة'}
        </div>
      )
    })),
    ...defaultStaticEvents
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const filteredTimeline = unifiedTimeline.filter((item: any) => {
    if (activeFilter === 'orders') return item.type === 'order' || item.type === 'invoice' || item.type === 'quote';
    if (activeFilter === 'appointments') return item.type === 'appointment';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/crm" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {customerName} <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold">عميل حالي</span>
          </h1>
          <p className="text-slate-500 mt-1">ملف العميل الموحد (Customer 360°)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Info & LTV */}
        <div className="space-y-6 lg:col-span-1">
          {/* Main Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
            
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-4 border-white shadow-sm">
              {customerName.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">{customerName}</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <span dir="ltr">+962 79 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>mohammad@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>عمان، الأردن</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">قيمة العميل مدى الحياة (LTV)</p>
                <p className="text-2xl font-bold text-slate-900">{totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm text-slate-500">د.أ</span></p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">الذمم المالية (AR)</p>
                  <p className={`text-lg font-bold ${outstandingAmount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {outstandingAmount > 0 ? outstandingAmount.toLocaleString() : '0.00'} <span className="text-xs">د.أ</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">فواتير مستحقة</p>
                  <p className="text-sm font-bold text-slate-700">{unpaidInvoices.length} فاتورة</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">تاريخ الانضمام</p>
                <p className="text-sm font-bold text-slate-700">15 أيار، 2026</p>
              </div>
            </div>
          </div>

          {/* Acquisition Source (OInsights Link & Financial Breakdown) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>مصدر الاستحواذ (Acquisition Source)</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold border border-blue-100">
                CPL Campaign
              </span>
            </h3>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">الفيديو المحول</p>
                  <p className="text-xs font-bold text-slate-900 leading-snug mt-0.5">لماذا تحتاج إلى استراتيجية تسويق في 2026؟</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">صانع المحتوى</span>
                  <span className="font-bold text-slate-900">أكاديمية المستقبل</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">التكلفة المخصومة (Cost Deducted)</span>
                  <span className="font-extrabold text-emerald-600">2.00 JOD</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[10px]">Traceability ID:</span>
                  <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                    TRC-9982-XYZ
                  </span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2 text-xs text-emerald-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Unique Lead (تم توثيق العميل كجهة اتصال فريدة)</span>
                </div>
              </div>
            </div>
          </div>
          {/* AI Insights & Predictions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mt-6">
            <h3 className="font-bold text-slate-900 mb-4">الذكاء الاصطناعي والتوقعات</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-medium text-slate-600">احتمالية إعادة الشراء</span>
                <span className="text-sm font-bold text-emerald-600">85% (مرتفعة)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-medium text-slate-600">معدل الشراء</span>
                <span className="text-sm font-bold text-slate-900">كل 45 يوم</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-medium text-slate-600">آخر نشاط</span>
                <span className="text-sm font-bold text-slate-900">منذ يومين</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-3">المنتجات / الخدمات المفضلة</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">الاستشارات الاستراتيجية</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg">إدارة الحملات الإعلانية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Interactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Automated Actions Summary Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-lg border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base flex items-center gap-2 text-white">
                <Zap className="w-5 h-5 text-amber-400" />
                سجل الأتمتة والتوجيه المباشر (Automated Traceability Log)
              </h3>
              <span className="text-[11px] font-bold bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30">
                تسلسل أوتوماتيكي مؤكد
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                <span className="text-[10px] font-bold text-slate-300 block mb-1">1. مصدر الدخول</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  💬 الواتساب المباشر
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">تتبع الحملة أوتوماتيكياً</span>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                <span className="text-[10px] font-bold text-slate-300 block mb-1">2. وقت التكليف</span>
                <span className="text-xs font-bold text-blue-300 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> تم فوراً (0.2s)
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">إلى: فرح الزعبي</span>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                <span className="text-[10px] font-bold text-slate-300 block mb-1">3. إشعار الواتساب</span>
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                  <Send className="w-3.5 h-3.5" /> تم الإرسال 🟢
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">تنبيه الموظف والعميل</span>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                <span className="text-[10px] font-bold text-slate-300 block mb-1">4. الاستجابة الأولى</span>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> بعد 3 دقائق
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">محادثة أولية مؤكدة</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-bold text-slate-900 text-lg">القصة الكاملة وسجل الحركات (Timeline)</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  كل الحركات ({unifiedTimeline.length})
                </button>
                <button 
                  onClick={() => setActiveFilter('orders')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeFilter === 'orders' ? 'bg-slate-900 text-white' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}
                >
                  المشتريات والمالية
                </button>
                <button 
                  onClick={() => setActiveFilter('appointments')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeFilter === 'appointments' ? 'bg-slate-900 text-white' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}
                >
                  المواعيد
                </button>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-6 relative border-r-2 border-slate-100 pr-6 mr-3">
                {filteredTimeline.map((item: any) => (
                  <div key={item.id} className="relative group">
                    <div className={`absolute -right-[31px] top-0 flex items-center justify-center w-8 h-8 rounded-full border-2 border-white ${item.iconBg} ${item.iconText} shadow-sm shrink-0 z-10`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 shadow-none text-right hover:border-slate-300 transition-colors">
                      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                        <time className="text-[11px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {item.date.toLocaleDateString('ar-JO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                      {item.extra}
                    </div>
                  </div>
                ))}

                {filteredTimeline.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    لا توجد حركات مسجلة تحت هذا التصنيف حالياً.
                  </div>
                )}
              </div>
            </div>
            
            <form onSubmit={handleAddNote} className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <input 
                type="text" 
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="إضافة ملاحظة جديدة للعميل..." 
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <button 
                type="submit"
                className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-blue-600 transition-colors shrink-0"
              >
                حفظ الملاحظة
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
