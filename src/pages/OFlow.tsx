import { 
  Users, 
  ShoppingCart, 
  Calendar, 
  ArrowUpRight, 
  Clock, 
  CheckCircle,
  Activity,
  ArrowRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OFlow() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">OFlow Core (CAE OS)</h1>
          <p className="text-slate-500 mt-1">نظام تشغيل نمو الأعمال: نظرة شاملة على العمليات (Customer 360°)</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <Users className="w-48 h-48" />
          </div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-slate-500 font-medium mb-1">العملاء النشطين (Pipeline)</p>
              <h2 className="text-3xl font-bold text-slate-900">1,240</h2>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <Link to="/crm" className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all relative z-10">
            إدارة العملاء (CRM) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <ShoppingCart className="w-48 h-48" />
          </div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-slate-500 font-medium mb-1">المبيعات المؤكدة (الشهر)</p>
              <h2 className="text-3xl font-bold text-slate-900">342</h2>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <Link to="/commerce" className="text-sm font-bold text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all relative z-10">
            إدارة المبيعات (Commerce) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <Calendar className="w-48 h-48" />
          </div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-slate-500 font-medium mb-1">المواعيد القادمة</p>
              <h2 className="text-3xl font-bold text-slate-900">28</h2>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <Link to="/booking" className="text-sm font-bold text-purple-600 flex items-center gap-1 hover:gap-2 transition-all relative z-10">
            إدارة المواعيد (Booking) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CRM Pipeline Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm col-span-1 lg:col-span-2 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">مسار المبيعات (Sales Pipeline)</h2>
            <Link to="/crm" className="text-sm text-blue-600 font-bold hover:underline">عرض الكل</Link>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center gap-6">
            {/* Stages */}
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 rounded-full hidden sm:block"></div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold mb-2">1</div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">عملاء محتملون</h4>
                  <span className="text-2xl font-black text-slate-700">450</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm flex flex-col items-center text-center ring-2 ring-blue-50">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-2">2</div>
                  <h4 className="text-sm font-bold text-blue-900 mb-1">قيد التواصل</h4>
                  <span className="text-2xl font-black text-blue-700">120</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-2">3</div>
                  <h4 className="text-sm font-bold text-amber-900 mb-1">عروض أسعار</h4>
                  <span className="text-2xl font-black text-amber-700">35</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-2">4</div>
                  <h4 className="text-sm font-bold text-emerald-900 mb-1">مبيعات مغلقة</h4>
                  <span className="text-2xl font-black text-emerald-700">85</span>
                </div>
              </div>
            </div>
            
            {/* Recent Leads */}
            <div className="mt-4">
              <h3 className="text-sm font-bold text-slate-900 mb-4">أحدث العملاء المحتملين (Live)</h3>
              <div className="space-y-3">
                {[
                  { name: 'محمد عبدالله', source: 'إعلان واتساب (CPL)', status: 'جديد', time: 'قبل 5 دقائق' },
                  { name: 'سارة أحمد', source: 'فيديو أكاديمية المستقبل', status: 'تواصل أولي', time: 'قبل 15 دقيقة' },
                ].map((lead, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{lead.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{lead.source}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="inline-block px-2 py-1 bg-white border border-slate-200 text-xs font-semibold rounded text-slate-600 mb-1">{lead.status}</span>
                      <p className="text-xs text-slate-400">{lead.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Combined Appointments & Transactions */}
        <div className="space-y-6 col-span-1">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">مواعيد اليوم</h2>
              <Link to="/booking" className="text-xs text-blue-600 font-bold hover:underline">الجدول</Link>
            </div>
            <div className="p-5 space-y-4">
              {[
                { client: 'طارق زياد', service: 'استشارة تسويقية', time: '10:00 ص', status: 'confirmed' },
                { client: 'مؤسسة الأفق', service: 'اجتماع مبيعات', time: '01:30 م', status: 'pending' }
              ].map((apt, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                    <Clock className="w-4 h-4 text-slate-400 mb-1" />
                    <span className="text-[10px] font-bold text-slate-600">{apt.time.split(' ')[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{apt.client}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{apt.service}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">أحدث المبيعات</h2>
              <Link to="/commerce" className="text-xs text-blue-600 font-bold hover:underline">المتجر</Link>
            </div>
            <div className="p-5 space-y-4">
              {[
                { order: '#ORD-991', client: 'ياسر سعد', amount: '150.00', status: 'completed' },
                { order: '#ORD-990', client: 'ريم خالد', amount: '45.00', status: 'processing' }
              ].map((order, i) => (
                <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {order.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{order.client}</p>
                      <p className="text-xs text-slate-500">{order.order}</p>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900">{order.amount} د.أ</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
