import { useState } from 'react';
import { Download, X, Printer, BarChart3, Users, Target } from 'lucide-react';
import { mockLeads, mockCampaigns } from '../data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReportModal({ onClose }: { onClose: () => void }) {
  const currentMonth = new Date().toLocaleString('ar-JO', { month: 'long', year: 'numeric' });
  const totalLeads = mockLeads.length;
  const wonLeads = mockLeads.filter(l => l.status === 'won').length;
  const conversionRate = totalLeads ? Math.round((wonLeads / totalLeads) * 100) : 0;
  
  const campaignStats = mockCampaigns.map(c => ({
    name: c.name,
    leads: c.leads,
    sales: mockLeads.filter(l => l.campaignId === c.id && l.status === 'won').length
  }));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative" id="print-area">
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              #print-area, #print-area * {
                visibility: visible;
              }
              #print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                box-shadow: none;
              }
              .no-print {
                display: none !important;
              }
            }
          `}
        </style>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 no-print">
          <div>
            <h2 className="text-xl font-bold text-slate-900">تقرير أداء الاستحواذ</h2>
            <p className="text-slate-500 text-sm mt-1">تصدير إحصائيات العملاء المحتملين (Leads) للشهر الحالي</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              طباعة / حفظ PDF
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-xl border border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-white">
          <div className="mb-8 text-center border-b border-slate-100 pb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">تقرير أداء الاستحواذ والمبيعات</h1>
            <p className="text-slate-500">شهر {currentMonth}</p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-700">إجمالي العملاء</h3>
              </div>
              <p className="text-3xl font-black text-slate-900 mt-4">{totalLeads}</p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-700">المبيعات المحققة (Won)</h3>
              </div>
              <p className="text-3xl font-black text-slate-900 mt-4">{wonLeads}</p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-700">معدل التحويل</h3>
              </div>
              <p className="text-3xl font-black text-slate-900 mt-4">{conversionRate}%</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">أداء الحملات الإعلانية</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="leads" name="العملاء (Leads)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sales" name="المبيعات" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6">تفاصيل أحدث العملاء</h3>
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 text-slate-500 font-medium">الاسم</th>
                  <th className="py-3 px-4 text-slate-500 font-medium">المصدر</th>
                  <th className="py-3 px-4 text-slate-500 font-medium">تاريخ التسجيل</th>
                  <th className="py-3 px-4 text-slate-500 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {mockLeads.slice(0, 5).map(lead => (
                  <tr key={lead.id} className="border-b border-slate-100">
                    <td className="py-3 px-4 font-bold text-slate-900">{lead.name}</td>
                    <td className="py-3 px-4 text-slate-600">{lead.source}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(lead.createdAt).toLocaleDateString('ar-JO')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        lead.status === 'won' ? 'bg-emerald-100 text-emerald-700' :
                        lead.status === 'appointment' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {lead.status === 'won' ? 'تم البيع' : 
                         lead.status === 'appointment' ? 'موعد' : 'جديد'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-12 text-center text-slate-400 text-sm">
            تم إنشاء هذا التقرير تلقائياً بواسطة نظام OFlow
          </div>
        </div>
      </div>
    </div>
  );
}
