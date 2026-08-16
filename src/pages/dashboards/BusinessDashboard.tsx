import { 
  TrendingUp, 
  Users, 
  Video, 
  CreditCard,
  DollarSign
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { performanceData } from '../../data';

export default function BusinessDashboard() {
  const metrics = [
    { title: 'إجمالي الإنفاق (الميزانية)', value: '500 د.أ', icon: CreditCard, trend: '+12%', trendUp: true },
    { title: 'العملاء المحتملين (Leads)', value: '420', icon: Users, trend: '+8%', trendUp: true },
    { title: 'المبيعات المؤكدة', value: '18', icon: TrendingUp, trend: '+15%', trendUp: true },
    { title: 'العائد الفعلي', value: '3,200 د.أ', icon: DollarSign, trend: '+35%', trendUp: true },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">نظرة عامة على الأداء (للمعلنين)</h1>
        <p className="text-slate-500 mt-1">أنت تدفع مقابل النتائج فقط. تتبع رحلة إنفاقك وفق قانون التتبع (The Traceability Law)</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{metric.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">{metric.value}</h3>
              <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${metric.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                {metric.trend}
                <span className="text-slate-400 font-normal">عن الشهر الماضي</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.trendUp ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
              <metric.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">تحليلات التحويل (Conversion)</h2>
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 outline-none">
              <option>آخر 7 أيام</option>
              <option>هذا الشهر</option>
            </select>
          </div>
          <div className="h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="العملاء" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">كيف يتم إنفاق ميزانيتك؟</h2>
          </div>
          <div className="space-y-4 flex-1">
            
            {/* CPL Campaign */}
            <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-900">حملة العقارات الصيفية</h3>
                  <span className="text-xs text-slate-500 font-medium">نموذج الدفع: <span className="text-blue-600 font-bold">CPL (دفع مقابل رسالة واتساب)</span></span>
                </div>
              </div>
              <div className="p-3 mt-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">التكلفة المبرمجة:</span>
                  <span className="font-bold text-slate-900">2.00 د.أ للعميل</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-600">العملاء الذين وصلوا:</span>
                  <span className="font-bold text-emerald-600">50 عميل</span>
                </div>
                <div className="flex justify-between text-sm mt-3 pt-2 border-t border-slate-200">
                  <span className="text-slate-900 font-medium">إجمالي الخصم التلقائي:</span>
                  <span className="font-bold text-red-500">-100.00 د.أ</span>
                </div>
              </div>
            </div>

            {/* CPA Campaign */}
            <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-900">التسجيل في دورة التسويق</h3>
                  <span className="text-xs text-slate-500 font-medium">نموذج الدفع: <span className="text-purple-600 font-bold">CPA (مشاركة أرباح المبيعات)</span></span>
                </div>
              </div>
              <div className="p-3 mt-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">عمولة البيع:</span>
                  <span className="font-bold text-slate-900">100.00 د.أ للمبيعة</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-600">المبيعات المؤكدة (عبر OFlow):</span>
                  <span className="font-bold text-emerald-600">3 مبيعات</span>
                </div>
                <div className="flex justify-between text-sm mt-3 pt-2 border-t border-slate-200">
                  <span className="text-slate-900 font-medium">إجمالي العمولة المدفوعة:</span>
                  <span className="font-bold text-red-500">-300.00 د.أ</span>
                </div>
              </div>
            </div>

          </div>
          <button className="w-full mt-6 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
            عرض الفواتير التفصيلية
          </button>
        </div>
      </div>
    </div>
  );
}
