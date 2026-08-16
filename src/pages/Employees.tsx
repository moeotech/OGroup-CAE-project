import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, ShieldCheck, Key, Lock, Eye, EyeOff, Search, Filter, 
  MoreVertical, CheckCircle2, XCircle, Edit3, Trash2, UserCheck, RefreshCw, 
  Briefcase, Target, Phone, Mail, ChevronRight, Award, Sparkles, Building2,
  Check, ArrowRight, Shield, Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Employee } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'سامر قاسم',
    phone: '0791112233',
    email: 'samer@company.com',
    password: 'SamerPass2026!',
    role: 'مدير مبيعات',
    isManager: true,
    managerId: null,
    managerName: null,
    specialtyChannel: 'all',
    monthlyTarget: 30000,
    dailyLimit: 20,
    status: 'active',
    isOnline: true,
    activeLeads: 18,
    totalLeads: 45,
    convertedLeads: 18,
    currentSales: 24500,
    avatar: '👨‍💼'
  },
  {
    id: 'emp-2',
    name: 'رانيا العبدالله',
    phone: '0792223344',
    email: 'rania@company.com',
    password: 'RaniaPass2026!',
    role: 'مسؤول مبيعات المتجر',
    isManager: false,
    managerId: null,
    managerName: null,
    specialtyChannel: 'store',
    monthlyTarget: 12000,
    dailyLimit: 10,
    status: 'active',
    isOnline: true,
    activeLeads: 22,
    totalLeads: 50,
    convertedLeads: 23,
    currentSales: 10800,
    avatar: '👩‍💼'
  },
  {
    id: 'emp-3',
    name: 'حمزة الشريف',
    phone: '0793334455',
    email: 'hamzah@company.com',
    password: 'HamzahPass2026!',
    role: 'مستشار مبيعات الحجوزات',
    isManager: false,
    managerId: 'emp-1',
    managerName: 'سامر قاسم',
    specialtyChannel: 'booking',
    monthlyTarget: 10000,
    dailyLimit: 8,
    status: 'active',
    isOnline: true,
    activeLeads: 14,
    totalLeads: 35,
    convertedLeads: 11,
    currentSales: 7500,
    avatar: '👨‍💻'
  },
  {
    id: 'emp-4',
    name: 'فرح الزعبي',
    phone: '0794445566',
    email: 'farah@company.com',
    password: 'FarahPass2026!',
    role: 'مسؤولة مبيعات الواتساب',
    isManager: false,
    managerId: 'emp-1',
    managerName: 'سامر قاسم',
    specialtyChannel: 'whatsapp',
    monthlyTarget: 8000,
    dailyLimit: 10,
    status: 'active',
    isOnline: true,
    activeLeads: 9,
    totalLeads: 25,
    convertedLeads: 7,
    currentSales: 4200,
    avatar: '👩‍💻'
  },
  {
    id: 'emp-5',
    name: 'محمد علي',
    phone: '0795556677',
    email: 'mohammed@company.com',
    password: 'MohammedPass2026!',
    role: 'مسؤول مبيعات مباشر',
    isManager: false,
    managerId: 'emp-1',
    managerName: 'سامر قاسم',
    specialtyChannel: 'all',
    monthlyTarget: 10000,
    dailyLimit: 12,
    status: 'active',
    isOnline: true,
    activeLeads: 15,
    totalLeads: 30,
    convertedLeads: 10,
    currentSales: 6800,
    avatar: '👨‍💼'
  }
];

export default function Employees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const stored = localStorage.getItem('crm_sales_reps');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((e: any) => {
          const isManager = e.isManager ?? (e.role?.includes('مدير') || e.name === 'سامر قاسم');
          let mgrId = isManager ? null : (e.managerId || null);
          let mgrName = isManager ? null : (e.managerName || null);
          if (!mgrId) {
            mgrId = null;
            mgrName = null;
          }
          return {
            ...e,
            role: e.role || 'مسؤول مبيعات',
            isManager,
            password: e.password || 'Pass2026!',
            status: e.status || 'active',
            managerId: mgrId,
            managerName: mgrName
          };
        });
      } catch (err) {}
    }
    return INITIAL_EMPLOYEES;
  });

  useEffect(() => {
    localStorage.setItem('crm_sales_reps', JSON.stringify(employees));
  }, [employees]);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'manager' | 'rep'>('all');
  const [managerFilter, setManagerFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [viewMode, setViewMode] = useState<'hierarchy' | 'table'>('hierarchy');

  // Modal States
  const [isCreating, setIsCreating] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [passwordModalEmp, setPasswordModalEmp] = useState<Employee | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassInModal, setShowPassInModal] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Employee Form Data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'مسؤول مبيعات',
    isManager: false,
    managerId: '',
    specialtyChannel: 'all',
    monthlyTarget: 10000,
    dailyLimit: 10,
    status: 'active' as 'active' | 'suspended'
  });

  const salesManagers = employees.filter(e => e.isManager || e.role?.includes('مدير'));

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleOpenCreateModal = (presetIsManager: boolean = false) => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: generateRandomPassword(),
      role: presetIsManager ? 'مدير مبيعات' : 'مسؤول مبيعات',
      isManager: presetIsManager,
      managerId: '',
      specialtyChannel: 'all',
      monthlyTarget: presetIsManager ? 25000 : 10000,
      dailyLimit: 10,
      status: 'active'
    });
    setEditingEmployee(null);
    setIsCreating(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      phone: emp.phone || '',
      email: emp.email || '',
      password: emp.password || 'Pass2026!',
      role: emp.role || 'مسؤول مبيعات',
      isManager: !!emp.isManager,
      managerId: emp.managerId || '',
      specialtyChannel: emp.specialtyChannel || 'all',
      monthlyTarget: emp.monthlyTarget || 10000,
      dailyLimit: emp.dailyLimit || 10,
      status: emp.status || 'active'
    });
    setIsCreating(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const assignedManagerObj = formData.managerId ? salesManagers.find(m => m.id === formData.managerId) : null;
    const managerName = formData.isManager ? null : (assignedManagerObj ? assignedManagerObj.name : null);

    if (editingEmployee) {
      // Update existing
      const updated = employees.map(emp => {
        if (emp.id === editingEmployee.id) {
          return {
            ...emp,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            password: formData.password || emp.password,
            role: formData.role,
            isManager: formData.isManager,
            managerId: formData.isManager ? null : (formData.managerId || null),
            managerName: managerName,
            specialtyChannel: formData.specialtyChannel,
            monthlyTarget: Number(formData.monthlyTarget),
            dailyLimit: Number(formData.dailyLimit),
            status: formData.status
          };
        }
        return emp;
      });
      setEmployees(updated);
      showToast(`تم تحديث بيانات الموظف (${formData.name}) بنجاح!`);
    } else {
      // Create new
      const created: Employee = {
        id: `emp-${Date.now()}`,
        name: formData.name,
        phone: formData.phone || '0790000000',
        email: formData.email,
        password: formData.password || generateRandomPassword(),
        role: formData.role,
        isManager: formData.isManager,
        managerId: formData.isManager ? null : (formData.managerId || null),
        managerName: managerName,
        specialtyChannel: formData.specialtyChannel,
        monthlyTarget: Number(formData.monthlyTarget),
        dailyLimit: Number(formData.dailyLimit),
        status: formData.status,
        isOnline: true,
        activeLeads: 0,
        totalLeads: 0,
        convertedLeads: 0,
        currentSales: 0,
        avatar: formData.isManager ? '👨‍💼' : '👤'
      };
      setEmployees([created, ...employees]);
      showToast(`تم إنشاء الموظف الجديد (${formData.name}) وتعيين كلمة السر بنجاح! 🎉`);
    }

    setIsCreating(false);
    setEditingEmployee(null);
  };

  const handleOpenPasswordModal = (emp: Employee) => {
    setPasswordModalEmp(emp);
    setNewPassword(emp.password || generateRandomPassword());
    setShowPassInModal(true);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalEmp || !newPassword) return;

    const updated = employees.map(emp => {
      if (emp.id === passwordModalEmp.id) {
        return { ...emp, password: newPassword };
      }
      return emp;
    });
    setEmployees(updated);
    showToast(`تم تغيير كلمة سر الموظف (${passwordModalEmp.name}) بنجاح! 🔑`);
    setPasswordModalEmp(null);
  };

  const handleToggleStatus = (empId: string) => {
    const updated = employees.map(emp => {
      if (emp.id === empId) {
        const nextStatus = emp.status === 'active' ? 'suspended' : 'active';
        return { ...emp, status: nextStatus as 'active' | 'suspended' };
      }
      return emp;
    });
    setEmployees(updated);
    showToast('تم تغيير حالة حساب الموظف بنجاح');
  };

  const handleDeleteEmployee = (empId: string, empName: string) => {
    if (confirm(`هل أنت محقق من حذف الموظف (${empName})؟ لن يتمكن من تسجيل الدخول بعد الآن.`)) {
      setEmployees(employees.filter(e => e.id !== empId));
      showToast(`تم حذف الموظف (${empName}) بنجاح`);
    }
  };

  // Filtered lists
  const filteredEmployees = employees.filter(emp => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = emp.name.toLowerCase().includes(q);
      const matchEmail = emp.email.toLowerCase().includes(q);
      const matchPhone = emp.phone?.includes(q);
      const matchRole = emp.role.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchRole) return false;
    }
    // Role filter
    if (roleFilter === 'manager' && !emp.isManager) return false;
    if (roleFilter === 'rep' && emp.isManager) return false;

    // Manager filter
    if (managerFilter !== 'all') {
      if (emp.managerId !== managerFilter && emp.id !== managerFilter) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && emp.status !== statusFilter) return false;

    return true;
  });

  // Calculate high-level stats
  const totalEmpsCount = employees.length;
  const managersCount = salesManagers.length;
  const activeRepsCount = employees.filter(e => e.status === 'active' && !e.isManager).length;
  const totalTargetSum = employees.reduce((acc, e) => acc + (e.monthlyTarget || 0), 0);
  const totalSalesAchieved = employees.reduce((acc, e) => acc + (e.currentSales || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm">{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">إدارة الموظفين وفريق المبيعات</h1>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
              {totalEmpsCount} موظف
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            أنشئ الموظفين، عيّن كلمات السر، وحدد مدير المبيعات المسؤول لمتابعة الأداء والتوزيع
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenCreateModal(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 border border-slate-700"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            + إضافة مدير مبيعات
          </button>
          <button
            onClick={() => handleOpenCreateModal(false)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            + إنشاء موظف جديد
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">إجمالي كادر المبيعات</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{totalEmpsCount} موظف</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">مدراء المبيعات</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{managersCount} مدير مبيعات</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">مسؤولو المبيعات النشطون</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{activeRepsCount} موظف</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">إجمالي الهدف / المحقق</p>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              {totalSalesAchieved.toLocaleString()} / {totalTargetSum.toLocaleString()} <span className="text-xs text-slate-500 font-normal">د.أ</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، البريد، الهاتف، أو المسمى..."
              className="w-full pl-4 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Filter Role */}
            <select
              value={roleFilter}
              onChange={(e: any) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">كل الأدوار (مدراء وموظفين)</option>
              <option value="manager">مدراء المبيعات فقط</option>
              <option value="rep">مسؤولو المبيعات فقط</option>
            </select>

            {/* Filter Sales Manager */}
            <select
              value={managerFilter}
              onChange={(e) => setManagerFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">جميع المدراء المسؤولين</option>
              {salesManagers.map(m => (
                <option key={m.id} value={m.id}>مدير: {m.name}</option>
              ))}
            </select>

            {/* Filter Status */}
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">🟢 الحسابات النشطة</option>
              <option value="suspended">🔴 الحسابات الموقوفة</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 mr-auto md:mr-0">
              <button
                onClick={() => setViewMode('hierarchy')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'hierarchy' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                الهيكلية والإدارة 🌳
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                جدول الموظفين 📋
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'hierarchy' ? (
        /* HIERARCHY VIEW: Sales Managers & Reps reporting to them */
        <div className="space-y-6">
          {salesManagers.map(manager => {
            const teamMembers = filteredEmployees.filter(e => e.managerId === manager.id || (e.managerName === manager.name && !e.isManager));
            const managerSales = manager.currentSales || 0;
            const teamTotalSales = teamMembers.reduce((acc, m) => acc + (m.currentSales || 0), managerSales);
            const teamTotalTarget = teamMembers.reduce((acc, m) => acc + (m.monthlyTarget || 0), manager.monthlyTarget || 0);
            const teamPct = teamTotalTarget > 0 ? Math.round((teamTotalSales / teamTotalTarget) * 100) : 0;

            return (
              <div key={manager.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden transition-all">
                {/* Sales Manager Header Banner */}
                <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-2xl font-bold shrink-0">
                      {manager.avatar || '👨‍💼'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-lg text-white">{manager.name}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-900">
                          👑 مدير مبيعات
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${manager.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300'}`}>
                          {manager.status === 'active' ? 'نشط' : 'موقوف'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-1.5">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-400" /> {manager.email}</span>
                        <span className="flex items-center gap-1" dir="ltr"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {manager.phone}</span>
                        <span className="flex items-center gap-1 text-amber-300 font-bold">
                          <Key className="w-3.5 h-3.5" /> كلمة السر: <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-200">{manager.password || '••••••••'}</code>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Manager Level Stats & Actions */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <div className="text-left bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 font-bold block">فريق المبيعات التابع</span>
                      <span className="text-sm font-black text-amber-300">{teamMembers.length} موظف مبيعات</span>
                    </div>

                    <div className="text-left bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 font-bold block">إنجاز هدف الفريق</span>
                      <span className="text-sm font-black text-emerald-400">{teamPct}% ({teamTotalSales.toLocaleString()} د.أ)</span>
                    </div>

                    <button
                      onClick={() => handleOpenPasswordModal(manager)}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl transition-colors border border-slate-700"
                      title="تغيير كلمة السر"
                    >
                      <Key className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(manager)}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-xl transition-colors border border-slate-700"
                      title="تعديل الموظف"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Team Reps List under this Sales Manager */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      الموظفون والمناديب المباشرون تحت إشراف ({manager.name}):
                    </h4>
                  </div>

                  {teamMembers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teamMembers.map(rep => {
                        const repSales = rep.currentSales || 0;
                        const repTarget = rep.monthlyTarget || 10000;
                        const repPct = repTarget > 0 ? Math.round((repSales / repTarget) * 100) : 0;

                        return (
                          <div key={rep.id} className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-2xl p-4 transition-all relative group">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shadow-xs">
                                  {rep.avatar || '👤'}
                                </div>
                                <div>
                                  <h5 className="font-extrabold text-slate-900 text-sm">{rep.name}</h5>
                                  <span className="text-xs text-slate-500 block font-medium">{rep.role}</span>
                                </div>
                              </div>

                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                rep.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {rep.status === 'active' ? 'نشط' : 'موقوف'}
                              </span>
                            </div>

                            <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-200/60 pt-3">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-bold">البريد الإلكتروني:</span>
                                <span className="font-bold text-slate-800">{rep.email}</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-bold">كلمة السر الحالية:</span>
                                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                                  <Key className="w-3 h-3" />
                                  {rep.password || 'Pass2026!'}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-bold">تخصص القناة:</span>
                                <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                                  {rep.specialtyChannel === 'all' ? '🌐 جميع المبيعات' : rep.specialtyChannel === 'whatsapp' ? '💬 الواتساب' : rep.specialtyChannel === 'booking' ? '📅 الحجوزات' : '🛒 المتجر'}
                                </span>
                              </div>

                              {/* Target Progress Bar */}
                              <div className="pt-2">
                                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                                  <span className="text-slate-500">مبيعات الشهر: {repSales.toLocaleString()} د.أ</span>
                                  <span className="text-blue-600">{repPct}% من الهدف ({repTarget.toLocaleString()} د.أ)</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${repPct >= 100 ? 'bg-emerald-500' : repPct >= 70 ? 'bg-blue-500' : 'bg-amber-500'}`} 
                                    style={{ width: `${Math.min(repPct, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                              <button
                                onClick={() => handleOpenPasswordModal(rep)}
                                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                                title="تعيين/تعديل كلمة السر"
                              >
                                <Key className="w-3.5 h-3.5" />
                                كلمة السر
                              </button>

                              <button
                                onClick={() => handleToggleStatus(rep.id)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors border ${
                                  rep.status === 'active' 
                                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                {rep.status === 'active' ? 'تجميد الحساب' : 'تنشيط'}
                              </button>

                              <div className="flex items-center gap-1 mr-auto">
                                <button
                                  onClick={() => handleOpenEditModal(rep)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                  title="تعديل الموظف والمدير المسؤول"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEmployee(rep.id, rep.name)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                  title="حذف الموظف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-medium">
                      لا يوجد موظفو مبيعات معينون تحت إشراف هذا المدير حالياً.
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Unassigned Sales Reps (Not assigned to any manager) */}
          {(() => {
            const unassignedReps = filteredEmployees.filter(e => !e.isManager && (!e.managerId || e.managerId === ''));
            if (unassignedReps.length === 0) return null;

            return (
              <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm overflow-hidden">
                <div className="p-5 bg-amber-500/10 border-b border-amber-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold text-lg">
                      🚫
                    </div>
                    <div>
                      <h3 className="font-extrabold text-amber-950 text-base">موظفون غير معينين لمدير مسؤول ({unassignedReps.length})</h3>
                      <p className="text-xs text-amber-800">هؤلاء الموظفون مستقلون ولا يتبعون لأي فريق مدير مبيعات حالياً</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unassignedReps.map(rep => (
                      <div key={rep.id} className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 transition-all">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-lg">
                              {rep.avatar || '👩‍💼'}
                            </div>
                            <div>
                              <h5 className="font-extrabold text-slate-900 text-sm">{rep.name}</h5>
                              <span className="text-xs text-amber-800 font-bold block">{rep.role}</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            مستقل
                          </span>
                        </div>

                        <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-amber-200/50 pt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-bold">البريد الإلكتروني:</span>
                            <span className="font-bold text-slate-800">{rep.email}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-bold">كلمة السر الحالية:</span>
                            <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                              {rep.password || 'Pass2026!'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                          <button
                            onClick={() => handleOpenEditModal(rep)}
                            className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <UserCheck className="w-4 h-4" />
                            تعيين مدير مبيعات له
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        /* TABLE VIEW: Comprehensive Employee Table */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              سجل الموظفين الشامل
            </h3>
            <span className="text-xs font-bold text-slate-500">عرض {filteredEmployees.length} من أصل {employees.length} موظف</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-3.5 px-6 whitespace-nowrap">اسم الموظف</th>
                  <th className="py-3.5 px-6 whitespace-nowrap">المسمى الوظيفي</th>
                  <th className="py-3.5 px-6 whitespace-nowrap">المدير المبيعات المسؤول</th>
                  <th className="py-3.5 px-6 whitespace-nowrap">كلمة السر</th>
                  <th className="py-3.5 px-6 whitespace-nowrap">التخصص والقناة</th>
                  <th className="py-3.5 px-6 whitespace-nowrap">الهدف الشهري</th>
                  <th className="py-3.5 px-6 whitespace-nowrap">الحالة</th>
                  <th className="py-3.5 px-6 whitespace-nowrap text-left">إجراءات الإدارة</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-base">
                          {emp.avatar || (emp.isManager ? '👨‍💼' : '👤')}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 block text-sm">{emp.name}</span>
                          <span className="text-slate-400 font-mono text-[11px]">{emp.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                        emp.isManager ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}>
                        {emp.isManager ? '👑 ' : ''}{emp.role}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      {emp.isManager ? (
                        <span className="text-slate-400 font-bold italic">مدير مباشر مستقل</span>
                      ) : emp.managerName ? (
                        <span className="font-bold text-slate-800 bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                          👤 {emp.managerName}
                        </span>
                      ) : (
                        <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                          🚫 غير محدد (بدون مدير)
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenPasswordModal(emp)}
                        className="font-mono font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                        title="انقر لتعديل كلمة السر"
                      >
                        <Key className="w-3.5 h-3.5 text-amber-600" />
                        {emp.password || '••••••••'}
                      </button>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap font-bold text-slate-700">
                      {emp.specialtyChannel === 'all' ? '🌐 جميع القنوات' : emp.specialtyChannel === 'whatsapp' ? '💬 واتساب' : emp.specialtyChannel === 'booking' ? '📅 حجوزات' : '🛒 متجر'}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap font-black text-slate-900 text-sm">
                      {(emp.monthlyTarget || 10000).toLocaleString()} د.أ
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        emp.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {emp.status === 'active' ? '🟢 نشط' : '🔴 موقوف'}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-left">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleOpenPasswordModal(emp)}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Key className="w-3.5 h-3.5" />
                          كلمة السر
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(emp)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تعديل الموظف"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف الموظف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT EMPLOYEE */}
      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingEmployee ? `تعديل بيانات الموظف: ${editingEmployee.name}` : 'إنشاء موظف جديد وتعيين كلمة السر'}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    قم بملء تفاصيل الموظف، المسمى الوظيفي، المدير المسؤول، وكلمة السر الحصرية
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreating(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-4">
              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم الموظف الثلاثي *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: طارق محمود العلي"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف / الواتساب *</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0791234567"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 text-right"
                  />
                </div>
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني (اسم الدخول) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="employee@company.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">كلمة السر المخصصة *</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, password: generateRandomPassword() })}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      🎲 كلمة سر عشوائية
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showFormPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="أدخل كلمة السر..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-amber-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFormPassword(!showFormPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Is Manager Toggle & Role */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-xs text-amber-900 block">هل هذا الموظف مدير مبيعات؟ (Sales Manager)</span>
                    <span className="text-[11px] text-amber-700 font-medium">
                      مدير المبيعات يستطيع الإشراف على فريق مبيعات يتبع له ويدير أداءهم
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isManager}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData({
                        ...formData,
                        isManager: checked,
                        role: checked ? 'مدير مبيعات' : 'مسؤول مبيعات'
                      });
                    }}
                    className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                  />
                </div>

                {!formData.isManager && (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      تعيين مدير المبيعات المسؤول التابع له الموظف (اختياري):
                    </label>
                    <select
                      value={formData.managerId}
                      onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="">🚫 بدون مدير مبيعات (موظف مستقل / تابع للشركة مباشرة)</option>
                      {salesManagers.map(m => (
                        <option key={m.id} value={m.id}>👤 {m.name} ({m.email})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Job Title & Channel Specialty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المسمى الوظيفي *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="مثال: مسؤول مبيعات المتجر"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تخصص القناة الموجهة *</label>
                  <select
                    value={formData.specialtyChannel}
                    onChange={(e) => setFormData({ ...formData, specialtyChannel: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">🌐 جميع المبيعات والقنوات</option>
                    <option value="whatsapp">💬 الواتساب المباشر</option>
                    <option value="booking">📅 نماذج الحجز والموقع</option>
                    <option value="store">🛒 المتجر الإلكتروني</option>
                  </select>
                </div>
              </div>

              {/* Monthly Target & Daily Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الهدف الشهري (د.أ) *</label>
                  <input
                    type="number"
                    required
                    value={formData.monthlyTarget}
                    onChange={(e) => setFormData({ ...formData, monthlyTarget: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">السعة اليومية للعملاء *</label>
                  <input
                    type="number"
                    required
                    value={formData.dailyLimit}
                    onChange={(e) => setFormData({ ...formData, dailyLimit: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Account Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">حالة الحساب *</label>
                <select
                  value={formData.status}
                  onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">🟢 حساب نشط ومفعل</option>
                  <option value="suspended">🔴 حساب موقوف ومجمد</option>
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors"
                >
                  {editingEmployee ? 'حفظ التعديلات' : 'حفظ وإنشاء الموظف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / RESET PASSWORD ONLY */}
      {passwordModalEmp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  تعيين كلمة سر جديدة للموظف ({passwordModalEmp.name})
                </h3>
              </div>
              <button 
                onClick={() => setPasswordModalEmp(null)} 
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <span className="text-xs text-slate-500 block mb-2 font-medium">
                  البريد الإلكتروني للحساب: <strong className="text-slate-900">{passwordModalEmp.email}</strong>
                </span>

                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">كلمة السر الجديدة *</label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(generateRandomPassword())}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800"
                  >
                    🎲 كلمة سر عشوائية
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassInModal ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="أدخل كلمة السر الجديدة..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-amber-900 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassInModal(!showPassInModal)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassInModal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalEmp(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold rounded-xl text-xs shadow-md shadow-amber-200"
                >
                  حفظ كلمة السر الجديدة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
