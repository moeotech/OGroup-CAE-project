import { useState, useEffect } from 'react';
import { mockCampaigns } from '../data';
import { Plus, MoreVertical, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Campaigns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [campaigns, setCampaigns] = useState<any[]>(mockCampaigns);

  useEffect(() => {
    const stored = localStorage.getItem('user_campaigns');
    if (stored) {
      try {
        const userCamps = JSON.parse(stored);
        setCampaigns([...userCamps, ...mockCampaigns]);
      } catch (e) {}
    }
  }, []);

  const filtered = campaigns.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">الحملات الإعلانية</h1>
          <p className="text-slate-500 mt-1">إدارة حملاتك التسويقية ومتابعة أدائها</p>
        </div>
        <Link 
          to="/campaigns/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          حملة جديدة
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث عن حملة..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            تصفية
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="py-3 px-6 font-medium">اسم الحملة</th>
                <th className="py-3 px-6 font-medium">الحالة</th>
                <th className="py-3 px-6 font-medium">الميزانية</th>
                <th className="py-3 px-6 font-medium">المصروف</th>
                <th className="py-3 px-6 font-medium">العملاء (Leads)</th>
                <th className="py-3 px-6 font-medium">تاريخ البدء</th>
                <th className="py-3 px-6 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((campaign) => (
                <tr key={campaign.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6 font-bold text-slate-900">{campaign.name}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      campaign.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {campaign.status === 'active' ? 'نشطة' : 'منتهية'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{campaign.budget} د.أ</td>
                  <td className="py-4 px-6 text-slate-700">{campaign.spent} د.أ</td>
                  <td className="py-4 px-6 text-slate-700">{campaign.leads}</td>
                  <td className="py-4 px-6 text-slate-500 text-sm">{campaign.startDate}</td>
                  <td className="py-4 px-6 text-left">
                    <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
