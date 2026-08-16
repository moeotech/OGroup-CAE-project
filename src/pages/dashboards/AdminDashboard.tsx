import { Activity, Briefcase, Users, Video, DollarSign, Building } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { performanceData } from '../../data';

export default function AdminDashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">إدارة المنصة (Admin Console)</h1>
        <p className="text-slate-500 mt-1">مراقبة صحة النظام، الإيرادات، والمستخدمين</p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-t-4 border-t-blue-500">
          <p className="text-sm font-medium text-slate-500 mb-1">إيرادات المنصة</p>
          <h3 className="text-2xl font-bold text-slate-900">34,500 <span className="text-base text-slate-500">د.أ</span></h3>
          <p className="text-xs text-emerald-600 font-medium mt-2">+12% هذا الشهر</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-t-4 border-t-emerald-500">
          <p className="text-sm font-medium text-slate-500 mb-1">الشركات المسجلة (B2B)</p>
          <h3 className="text-2xl font-bold text-slate-900">120</h3>
          <p className="text-xs text-emerald-600 font-medium mt-2">+5 شركات جديدة</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-t-4 border-t-purple-500">
          <p className="text-sm font-medium text-slate-500 mb-1">صناع المحتوى النشطين</p>
          <h3 className="text-2xl font-bold text-slate-900">85</h3>
          <p className="text-xs text-emerald-600 font-medium mt-2">+12 طلب انضمام</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-t-4 border-t-amber-500">
          <p className="text-sm font-medium text-slate-500 mb-1">صحة النظام (Uptime)</p>
          <h3 className="text-2xl font-bold text-slate-900">99.9%</h3>
          <p className="text-xs text-slate-400 font-medium mt-2">All systems operational</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">حجم العمليات الإجمالي (Platform Traffic)</h2>
          </div>
          <div className="h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="المشاهدات" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6">مراقبة السوق النشط</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">حملات نشطة الآن</h4>
                  <p className="text-xs text-slate-500 mt-0.5">في جميع القطاعات</p>
                </div>
              </div>
              <span className="font-bold text-slate-900">45</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">فيديوهات OVideo</h4>
                  <p className="text-xs text-slate-500 mt-0.5">روابط مُضافة للنظام</p>
                </div>
              </div>
              <span className="font-bold text-slate-900">1,240</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">أكثر القطاعات نشاطاً</h4>
                  <p className="text-xs text-slate-500 mt-0.5">القطاع الطبي والتجميل</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
