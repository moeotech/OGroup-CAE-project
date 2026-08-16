import { useState } from 'react';
import { mockVideos } from '../data';
import { User, Mail, Shield, Play, TrendingUp, Users, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user: currentUser, updateProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editEmail, setEditEmail] = useState(currentUser.email);

  const handleSave = () => {
    updateProfile({ name: editName, email: editEmail });
    setIsEditing(false);
  };
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-slate-800 to-slate-900"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 mt-12">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 shadow-lg overflow-hidden flex items-center justify-center text-4xl font-bold text-slate-400">
            {currentUser.name.charAt(0)}
          </div>
          
          <div className="flex-1 text-center md:text-right mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{currentUser.name}</h1>
            <p className="text-slate-500 mt-1 flex items-center justify-center md:justify-start gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              حساب موثق - {currentUser.role === 'business' ? 'شركة / معلن' : 'صانع محتوى'}
            </p>
          </div>
          
          <div className="flex gap-3 mb-2">
            <button 
              onClick={() => {
                setEditName(currentUser.name);
                setEditEmail(currentUser.email);
                setIsEditing(true);
              }}
              className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              تعديل الملف
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
              مشاركة الصفحة
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-4">المعلومات الشخصية</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <User className="w-5 h-5 text-slate-400" />
                <span className="font-medium">{currentUser.name}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="font-medium">{currentUser.email}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-4">إحصائيات سريعة</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-slate-700">الفيديوهات</span>
                </div>
                <span className="font-bold text-slate-900">24</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium text-slate-700">Leads</span>
                </div>
                <span className="font-bold text-slate-900">650</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-slate-700">المبيعات</span>
                </div>
                <span className="font-bold text-slate-900">33</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-6">أحدث الفيديوهات</h2>
            <div className="space-y-4">
              {mockVideos.map(video => (
                <div key={video.id} className="flex gap-4 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-32 h-20 rounded-lg overflow-hidden shrink-0 relative bg-slate-200">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium shadow-sm">
                      {video.platform}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{video.title}</h3>
                    <div className="flex items-center gap-6 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5" />
                        {video.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {video.leads}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">تعديل الملف الشخصي</h2>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الاسم الكامل</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-left"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold hover:bg-blue-700 rounded-xl transition-colors"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
