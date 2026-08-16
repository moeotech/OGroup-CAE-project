import { Wallet, Video, Users, ArrowUpRight, TrendingUp, Play, DollarSign, Percent } from 'lucide-react';

export default function CreatorDashboard() {
  const creatorVideos = [
    { id: 1, title: 'أفضل 5 ديكورات لعام 2026', thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&q=80', views: 14500, leads: 20, earned: 28 },
    { id: 2, title: 'تجربتي مع عيادة الأسنان الحديثة', thumbnail: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=300&q=80', views: 8200, leads: 5, earned: 150 }, // High ticket CPA
    { id: 3, title: 'مراجعة مطعم البرجر الجديد', thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80', views: 45000, leads: 120, earned: 84 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">لوحة صانع المحتوى</h1>
        <p className="text-slate-500 mt-1">تتبع أرباحك بشفافية بناءً على النتائج (The Traceability Law)</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 p-10 bg-white/5 rounded-full -ml-8 -mt-8 blur-2xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-1 rounded font-bold tracking-wider">متاح للسحب</span>
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1 relative z-10">الأرباح المكتسبة (من النتائج)</p>
          <h3 className="text-3xl font-bold relative z-10">262 <span className="text-lg text-slate-400 font-medium">د.أ</span></h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">أرباح تم سحبها</p>
          <h3 className="text-2xl font-bold text-slate-900">1,450 <span className="text-base text-slate-500 font-medium">د.أ</span></h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Video className="w-5 h-5" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">إجمالي المشاهدات</p>
          <h3 className="text-2xl font-bold text-slate-900">67,700</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">العملاء المحولين (Leads)</p>
          <h3 className="text-2xl font-bold text-slate-900">145</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Videos & Transparent Tracking */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">أداء الفيديوهات والأرباح</h2>
          </div>
          <div className="space-y-4">
            {creatorVideos.map(video => (
              <div key={video.id} className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 relative bg-slate-200">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-sm mb-2">{video.title}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium mb-0.5">المشاهدات</div>
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        {video.views.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium mb-0.5">العملاء (Leads)</div>
                      <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        {video.leads}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium mb-0.5">الأرباح (صافي)</div>
                      <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
                        {video.earned} د.أ
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-slate-400 font-medium flex items-center gap-1 border-t border-slate-100 pt-2">
                    <Percent className="w-3 h-3" />
                    معدل التحويل (Conversion): {((video.leads / video.views) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Campaigns (CPL / CPA Models) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">فرص إعلانية (حملات متاحة)</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">تصفح السوق</button>
          </div>
          <div className="space-y-4">
            
            {/* CPL Example */}
            <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    🏢
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">شركة إعمار للعقارات</h3>
                    <p className="text-xs text-slate-500 mt-0.5">الهدف: رسائل واتساب (Lead)</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">
                  CPL (دفع مقابل عميل)
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-600 font-medium">حصة صانع المحتوى المبرمجة:</span>
                  <span className="text-xs font-bold text-slate-900">70% من الميزانية</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-emerald-600 font-bold flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    1.40 د.أ <span className="text-[10px] text-slate-500 font-normal">/ لكل رسالة واتساب</span>
                  </div>
                  <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md font-medium text-xs hover:bg-blue-700 transition-colors">
                    ترويج
                  </button>
                </div>
              </div>
            </div>

            {/* CPA Example */}
            <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    🎓
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">أكاديمية المستقبل</h3>
                    <p className="text-xs text-slate-500 mt-0.5">الهدف: مبيعات فعلية (Sale)</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-full">
                  CPA (مشاركة الأرباح)
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-600 font-medium">عمولة البيع الثابتة:</span>
                  <span className="text-xs font-bold text-slate-900">100 د.أ للمبيعة</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-emerald-600 font-bold flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    60.00 د.أ <span className="text-[10px] text-slate-500 font-normal">/ لكل عملية شراء ناجحة</span>
                  </div>
                  <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md font-medium text-xs hover:bg-blue-700 transition-colors">
                    ترويج
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
