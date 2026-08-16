import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Megaphone, 
  Video, 
  Users, 
  PieChart, 
  Settings,
  Bell,
  Search,
  UserCircle,
  ShoppingCart,
  Calendar,
  Wallet,
  Activity,
  Receipt,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Role } from '../types';

import NotificationPopover from './NotificationPopover';
import ToastContainer from './ToastContainer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, setRole } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const getNavItems = (role: Role) => {
    switch(role) {
      case 'creator':
        return [
          { name: 'لوحة القيادة', href: '/', icon: LayoutDashboard },
          { name: 'فيديوهاتي', href: '/videos', icon: Video },
          { name: 'الفرص الإعلانية', href: '/campaigns', icon: Megaphone },
          { name: 'المحفظة', href: '/wallet', icon: Wallet },
          { name: 'الملف الشخصي', href: '/profile', icon: UserCircle },
        ];
      case 'sales_manager':
        return [
          { name: 'لوحة التحكم القيادية', href: '/', icon: LayoutDashboard },
          { name: 'صفحة مدير المبيعات', href: '/sales-manager', icon: ShieldCheck },
          { name: 'إدارة الموظفين والهيكلية', href: '/employees', icon: Users },
          { name: 'العملاء (CRM)', href: '/crm', icon: Users },
          { name: 'المبيعات والتحصيل', href: '/sales', icon: Receipt },
          { name: 'الملف الشخصي', href: '/profile', icon: UserCircle },
        ];
      case 'sales':
        return [
          { name: 'لوحة القيادة', href: '/', icon: LayoutDashboard },
          { name: 'العملاء (CRM)', href: '/crm', icon: Users },
          { name: 'الملف الشخصي', href: '/profile', icon: UserCircle },
        ];
      case 'admin':
        return [
          { name: 'لوحة القيادة', href: '/', icon: LayoutDashboard },
          { name: 'الشركات', href: '/companies', icon: Users },
          { name: 'التقارير', href: '/insights', icon: PieChart },
          { name: 'الملف الشخصي', href: '/profile', icon: UserCircle },
        ];
      case 'business':
      default:
        return [
          { group: 'نظرة عامة' },
          { name: 'لوحة التحكم', href: '/', icon: LayoutDashboard },
          
          { group: 'OFlow Core (النواة)' },
          { name: 'المركز (OFlow)', href: '/oflow', icon: Activity },
          { name: 'العملاء (CRM)', href: '/crm', icon: Users },
          { name: 'المتجر الإلكتروني', href: '/commerce', icon: ShoppingCart },
          { name: 'المواعيد والحجوزات', href: '/booking', icon: Calendar },
          { name: 'المبيعات والتحصيل', href: '/sales', icon: Receipt },
          { name: 'إدارة الموظفين', href: '/employees', icon: Users },
          { name: 'المحفظة (الأرباح)', href: '/wallet', icon: Wallet },
          
          { group: 'OAds Engine (التسويق)' },
          { name: 'إدارة الحملات', href: '/campaigns', icon: Megaphone },
          { name: 'مكتبة الفيديوهات', href: '/videos', icon: Video },
          
          { group: 'OInsights (البيانات)' },
          { name: 'التقارير والتحليلات', href: '/insights', icon: PieChart },
          
          { group: 'الإعدادات' },
          { name: 'الملف الشخصي', href: '/profile', icon: UserCircle },
        ];
    }
  };

  const navigation = getNavItems(user.role);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <ToastContainer />
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 dark:bg-slate-900 text-white flex flex-col hidden md:flex border-l border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold tracking-wider text-blue-400">OGroup CAE</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item, index) => {
            if ('group' in item) {
              return (
                <div key={item.group} className={`px-3 ${index !== 0 ? 'pt-4' : ''} pb-1`}>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{item.group}</span>
                </div>
              );
            }

            const isActive = location.pathname === item.href;
            const Icon = item.icon as any;
            return (
              <Link
                key={item.name}
                to={item.href as string}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-100">{user.name}</p>
              <p className="text-xs text-slate-400">
                {user.role === 'business' ? 'إدارة الشركة' : 
                 user.role === 'creator' ? 'صانع محتوى' : 
                 user.role === 'sales_manager' ? 'مدير مبيعات' :
                 user.role === 'sales' ? 'فريق المبيعات' : 'إدارة النظام'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="بحث..." 
                className="w-full pl-4 pr-10 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Role Switcher for Demo Purposes */}
            <div className="flex items-center gap-2 mr-2 border-r border-slate-200 dark:border-slate-800 pr-3">
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">الصلاحية:</span>
              <select 
                value={user.role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2 py-1 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="business">Business (شركة)</option>
                <option value="creator">Creator (مبدع)</option>
                <option value="sales">Sales (مبيعات)</option>
                <option value="sales_manager">Sales Manager (مدير مبيعات)</option>
                <option value="admin">Admin (إدارة)</option>
              </select>
            </div>

            {/* Global Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none ring-1 ring-slate-200 dark:ring-slate-700/80"
              title={isDark ? "تغيير إلى الوضع النهارية (Light)" : "تغيير إلى الوضع الليلي (Dark)"}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            <NotificationPopover />
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}
