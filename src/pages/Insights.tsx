import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { regionData, creatorData } from '../data';
import { Target, TrendingUp, DollarSign, Download, Users, Award, BarChart3, UserCheck, ArrowUpRight } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

export default function Insights() {
  const salesRepsData = React.useMemo(() => {
    const stored = localStorage.getItem('crm_sales_reps');
    const reps = stored ? JSON.parse(stored) : [
      { id: 'rep-1', name: 'سامر قاسم', role: 'كبير مسؤولي مبيعات', activeLeads: 18, totalLeads: 45, convertedLeads: 18, monthlyTarget: 15000, currentSales: 12400 },
      { id: 'rep-2', name: 'رانيا العبدالله', role: 'مسؤولة مبيعات أولى', activeLeads: 22, totalLeads: 50, convertedLeads: 23, monthlyTarget: 12000, currentSales: 10800 },
      { id: 'rep-3', name: 'حمزة الشريف', role: 'مستشار مبيعات وحجوزات', activeLeads: 14, totalLeads: 35, convertedLeads: 11, monthlyTarget: 10000, currentSales: 7500 },
      { id: 'rep-4', name: 'فرح الزعبي', role: 'متابعة عملاء الجملة', activeLeads: 9, totalLeads: 25, convertedLeads: 7, monthlyTarget: 8000, currentSales: 4200 },
    ];

    return reps.map((r: any) => {
      const totalLeads = r.totalLeads ?? (r.activeLeads ? r.activeLeads + 15 : 25);
      const convertedLeads = r.convertedLeads ?? Math.round(totalLeads * (r.currentSales && r.monthlyTarget ? (r.currentSales / r.monthlyTarget) * 0.5 : 0.35));
      const conversionRate = totalLeads > 0 ? Number(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0;
      
      return {
        ...r,
        totalLeads,
        convertedLeads,
        conversionRate,
      };
    });
  }, []);

  const totalLeadsTeam = salesRepsData.reduce((acc, r) => acc + r.totalLeads, 0);
  const totalConvertedTeam = salesRepsData.reduce((acc, r) => acc + r.convertedLeads, 0);
  const avgTeamConversion = totalLeadsTeam > 0 ? Number(((totalConvertedTeam / totalLeadsTeam) * 100).toFixed(1)) : 0;
  const topSalesRep = [...salesRepsData].sort((a, b) => b.conversionRate - a.conversionRate)[0];

  const handleDownload = () => {
    // Combine data or get specific data you want to export
    const exportData = {
      timestamp: new Date().toISOString(),
      creatorPerformance: creatorData,
      regionalDistribution: regionData,
      salesTeamPerformance: salesRepsData
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "performance_analytics_report.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto" dir="rtl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">التقارير والتحليلات (OInsights)</h1>
          <p className="text-slate-500 mt-1">تقارير أداء الحملات، تحويل العملاء، وكفاءة فريق المبيعات</p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs cursor-pointer">
            <option value="today">اليوم</option>
            <option value="7days">آخر 7 أيام</option>
            <option value="30days">آخر شهر</option>
            <option value="all">كل الأوقات</option>
          </select>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-xs text-sm"
          >
            <Download className="w-4 h-4" />
            تصدير البيانات (JSON)
          </button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">تكلفة الاستحواذ (CAC)</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">2.5 د.أ</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">نسبة تحويل الإعلانات</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">4.2%</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">معدل تحويل المبيعات</p>
            <h3 className="text-xl font-bold text-emerald-600 mt-0.5">{avgTeamConversion}%</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">العائد على الاستثمار (ROI)</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">6.4x</h3>
          </div>
        </div>
      </div>

      {/* NEW SECTION: Sales Team Conversion Rates Analytics */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">معدلات تحويل العملاء حسب موظف المبيعات</h2>
            </div>
            <p className="text-slate-500 text-xs mt-1">قياس كفاءة كل موظف مبيعات في إغلاق الصفقات وتحويل العملاء إلى عملاء يدفعون</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>الموظف الأكثر تحويلاً: <strong>{topSalesRep?.name} ({topSalesRep?.conversionRate}%)</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion Rate Bar Chart */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 flex flex-col">
            <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center justify-between">
              <span>معدل التحويل (%) لكل مسؤول مبيعات</span>
              <span className="text-xs text-slate-500 font-normal">المستهدف الأسبوعي &gt; 35%</span>
            </h3>
            <div className="h-[280px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesRepsData} margin={{ top: 15, right: 15, left: 0, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'right', direction: 'rtl' }}
                    formatter={(value: any, _name: any, item: any) => [`${value}% (${item.payload.convertedLeads} صفقة من أصل ${item.payload.totalLeads} عميل)`, 'معدل التحويل']}
                  />
                  <Bar dataKey="conversionRate" radius={[8, 8, 0, 0]} barSize={36}>
                    {salesRepsData.map((entry, index) => (
                      <Cell 
                        key={`cell-rep-${index}`} 
                        fill={entry.conversionRate >= 40 ? '#10b981' : entry.conversionRate >= 30 ? '#3b82f6' : '#f59e0b'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Assigned vs Converted Leads Chart */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 flex flex-col">
            <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center justify-between">
              <span>إجمالي العملاء المستلمين مقابل الصفقات المغلقة</span>
              <span className="text-xs text-slate-500 font-normal">إجمالي الصفقات: {totalConvertedTeam}</span>
            </h3>
            <div className="h-[280px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesRepsData} margin={{ top: 15, right: 15, left: 0, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'right', direction: 'rtl' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }} />
                  <Bar dataKey="totalLeads" name="إجمالي العملاء المستلمين" fill="#94a3b8" radius={[6, 6, 0, 0]} barSize={22} />
                  <Bar dataKey="convertedLeads" name="الصفقات المحولة بنجاح" fill="#10b981" radius={[6, 6, 0, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sales Team Leaderboard Table */}
        <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-100">
                <th className="py-3 px-4 font-bold">موظف المبيعات</th>
                <th className="py-3 px-4 font-bold">المسمى الوظيفي</th>
                <th className="py-3 px-4 font-bold">العملاء المستلمون</th>
                <th className="py-3 px-4 font-bold">الصفقات المغلقة</th>
                <th className="py-3 px-4 font-bold">معدل التحويل</th>
                <th className="py-3 px-4 font-bold">حالة الأداء</th>
              </tr>
            </thead>
            <tbody>
              {salesRepsData.map((rep) => (
                <tr key={rep.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {rep.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{rep.role}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{rep.totalLeads} عميل</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{rep.convertedLeads} صفقة</td>
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      {rep.conversionRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {rep.conversionRate >= 40 ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        ممتاز 🔥
                      </span>
                    ) : rep.conversionRate >= 30 ? (
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                        جيد جداً 👍
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        يحتاج متابعة
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Creator Comparison */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-6">مقارنة أداء صناع المحتوى</h2>
          <div className="flex-1 min-h-[300px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={creatorData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} width={80} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: 'right'}} />
                <Bar dataKey="leads" name="العملاء (Leads)" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region Map */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-6">التوزيع الجغرافي للعملاء</h2>
          <div className="flex-1 min-h-[300px] flex items-center justify-center" dir="ltr">
            <div className="w-full h-full max-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="leads"
                    stroke="none"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: 'right'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-6 flex-wrap">
            {regionData.map((region, idx) => (
              <div key={region.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-sm font-medium text-slate-600">{region.name}</span>
                <span className="text-sm font-bold text-slate-900">({region.leads})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

