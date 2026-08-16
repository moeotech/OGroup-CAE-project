import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Calendar, 
  Check, 
  CheckCheck, 
  Trash2, 
  UserCheck, 
  ExternalLink, 
  Sparkles, 
  X, 
  ArrowLeft,
  DollarSign,
  Clock,
  Flame,
  CheckSquare,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Info,
  ChevronLeft,
  Filter,
  CheckCircle2,
  Megaphone
} from 'lucide-react';
import { showToast } from '../utils/toast';

export type AlertCategory = 'urgent' | 'task' | 'system' | 'booking' | 'lead';

export interface NotificationItem {
  id: string;
  category: AlertCategory;
  type?: 'booking' | 'lead' | 'order' | 'broadcast' | 'system' | 'urgent';
  title: string;
  message: string;
  customerName?: string;
  phone?: string;
  service?: string;
  amount?: number;
  time: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'urgent' | 'task' | 'system'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load notifications from localStorage
  const loadNotifications = () => {
    const stored = localStorage.getItem('crm_notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure category property exists on legacy notifications
        const normalized: NotificationItem[] = parsed.map((item: any) => {
          let cat: AlertCategory = item.category || 'system';
          if (!item.category) {
            if (item.type === 'booking') cat = 'booking';
            else if (item.type === 'lead') cat = 'lead';
            else if (item.type === 'broadcast') cat = 'task';
            else if (item.type === 'order') cat = 'system';
            else if (item.title?.includes('عاجل') || item.message?.includes('طارئ')) cat = 'urgent';
          }
          return { ...item, category: cat };
        });
        setNotifications(normalized);
      } catch (e) {
        setNotifications([]);
      }
    } else {
      // Sample rich notifications with distinct categories
      const sampleNotifs: NotificationItem[] = [
        {
          id: 'sample-urgent-1',
          category: 'urgent',
          type: 'urgent',
          title: '🔥 تنبيه عاجل: عميل مهتم جداً بانتظار اتصال',
          message: 'العميل د. محمد علي يطلب معاودة الاتصال فوراً بخصوص عقد السنوية بقيمة 3,500 د.أ',
          customerName: 'د. محمد علي',
          phone: '0799887766',
          time: 'منذ 3 دقائق',
          read: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'sample-task-1',
          category: 'task',
          type: 'broadcast',
          title: '📋 مهمة جديدة: إغلاق طلبات الحجز المعلّقة',
          message: 'توجيه إداري من مدير المبيعات: يرجى التواصل مع جميع العملاء المعلّقين قبل نهاية اليوم',
          time: 'منذ 20 دقيقة',
          read: false,
          createdAt: new Date(Date.now() - 20 * 60000).toISOString()
        },
        {
          id: 'sample-booking-1',
          category: 'booking',
          type: 'booking',
          title: '📅 حجز جديد عبر النموذج العام',
          message: 'تم استلام حجز جديد لخدمة (استشارة أسنان مجانية) غداً الساعة 10:30 صباحاً',
          customerName: 'أحمد خليل',
          phone: '0791112233',
          service: 'استشارة أسنان مجانية',
          time: 'منذ 45 دقيقة',
          read: false,
          createdAt: new Date(Date.now() - 45 * 60000).toISOString()
        },
        {
          id: 'sample-system-1',
          category: 'system',
          type: 'order',
          title: '⚙️ تحديث نظام: تم إغلاق وتأكيد صفقة تحصيل',
          message: 'تم تحويل ومستند القابض بمبلغ 450 د.أ بنجاح لحساب شركة الأفق للتكنولوجيا',
          customerName: 'شركة الأفق',
          amount: 450,
          time: 'منذ ساعتين',
          read: true,
          createdAt: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      localStorage.setItem('crm_notifications', JSON.stringify(sampleNotifs));
      setNotifications(sampleNotifs);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      const stored = localStorage.getItem('crm_notifications');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const normalized: NotificationItem[] = parsed.map((item: any) => ({
            ...item,
            category: item.category || (item.type === 'booking' ? 'booking' : item.type === 'lead' ? 'lead' : item.type === 'broadcast' ? 'task' : 'system')
          }));
          setNotifications(normalized);
        } catch (e) {}
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Filtered notifications
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'urgent') return n.category === 'urgent';
    if (activeTab === 'task') return n.category === 'task';
    if (activeTab === 'system') return n.category === 'system' || n.category === 'booking' || n.category === 'lead';
    return true;
  });

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('crm_notifications', JSON.stringify(updated));
    showToast('تم تحديث جميع الإشعارات كمقروءة', 'success');
  };

  const handleClearAll = () => {
    setNotifications([]);
    localStorage.setItem('crm_notifications', JSON.stringify([]));
    showToast('تم مسح جميع الإشعارات', 'info');
  };

  const handleToggleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.map(n => n.id === id ? { ...n, read: !n.read } : n);
    setNotifications(updated);
    localStorage.setItem('crm_notifications', JSON.stringify(updated));
  };

  const handleCardClick = (notif: NotificationItem) => {
    // Mark as read
    const updated = notifications.map(n => n.id === notif.id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('crm_notifications', JSON.stringify(updated));
    setIsOpen(false);

    if (notif.customerName) {
      // Ensure lead exists
      const storedLeads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
      const existingIndex = storedLeads.findIndex((l: any) => l.name === notif.customerName || (notif.phone && l.phone === notif.phone));
      if (existingIndex < 0) {
        storedLeads.unshift({
          id: Date.now().toString(),
          name: notif.customerName,
          phone: notif.phone || '0790000000',
          source: `إشعار (${notif.service || notif.title})`,
          status: notif.category === 'booking' ? 'appointment' : 'new',
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('crm_leads', JSON.stringify(storedLeads));
      }
      navigate(`/crm/customer/360?name=${encodeURIComponent(notif.customerName)}`);
    } else if (notif.category === 'task') {
      navigate('/sales-manager');
    } else if (notif.type === 'order') {
      navigate('/sales');
    } else {
      navigate('/crm');
    }
  };

  const handleSimulateAlert = (cat: AlertCategory) => {
    const timeNow = 'الآن';
    let newNotif: NotificationItem;

    if (cat === 'urgent') {
      newNotif = {
        id: `notif-urgent-${Date.now()}`,
        category: 'urgent',
        type: 'urgent',
        title: '🔥 اتصال طارئ: طلب إلغاء صفقة أو تصعيد',
        message: 'طلب العميل سامر العبدالله التواصل المباشر مع مدير المبيعات بشكل عاجل!',
        customerName: 'سامر العبدالله',
        phone: '0798765432',
        time: timeNow,
        read: false,
        createdAt: new Date().toISOString()
      };
    } else if (cat === 'task') {
      newNotif = {
        id: `notif-task-${Date.now()}`,
        category: 'task',
        type: 'broadcast',
        title: '📋 مهمة جديدة: إحصائيات المبيعات الأسبوعية',
        message: 'يرجى مراجعة وتعديل مستهدف المبيعات للعملاء المحولين قبل الساعة 5 مساءً',
        time: timeNow,
        read: false,
        createdAt: new Date().toISOString()
      };
    } else if (cat === 'booking') {
      newNotif = {
        id: `notif-booking-${Date.now()}`,
        category: 'booking',
        type: 'booking',
        title: '📅 حجز جديد: استشارة فورية',
        message: 'تم حجز موعد جديد باسم العميل هدى الشامي لخدمة استشارة تسويق',
        customerName: 'هدى الشامي',
        phone: '0791234567',
        service: 'استشارة تسويق',
        time: timeNow,
        read: false,
        createdAt: new Date().toISOString()
      };
    } else {
      newNotif = {
        id: `notif-sys-${Date.now()}`,
        category: 'system',
        type: 'system',
        title: '⚙️ تنبيه نظام: مزامنة القنوات التلقائية',
        message: 'تمت مزامنة جميع رسائل الواتساب وحسابات المتجر الإلكتروني بنجاح',
        time: timeNow,
        read: false,
        createdAt: new Date().toISOString()
      };
    }

    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    localStorage.setItem('crm_notifications', JSON.stringify(updated));

    const toastType = cat === 'urgent' ? 'error' : cat === 'task' ? 'warning' : 'info';
    showToast(newNotif.message, toastType, newNotif.title);
  };

  // Helper renderer for category icons & styling
  const getCategoryMeta = (notif: NotificationItem) => {
    switch (notif.category) {
      case 'urgent':
        return {
          label: 'طارئ وعاجل',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
          iconBg: 'bg-rose-500 text-white shadow-rose-200',
          cardBorder: 'border-rose-300 ring-1 ring-rose-200/60 bg-rose-50/20',
          Icon: Flame,
        };
      case 'task':
        return {
          label: 'مهمة وتوجيه',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          iconBg: 'bg-amber-500 text-white shadow-amber-200',
          cardBorder: 'border-amber-300 ring-1 ring-amber-200/60 bg-amber-50/20',
          Icon: CheckSquare,
        };
      case 'booking':
        return {
          label: 'حجز موعد',
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
          iconBg: 'bg-purple-600 text-white shadow-purple-200',
          cardBorder: 'border-purple-200 hover:border-purple-300 bg-white',
          Icon: Calendar,
        };
      case 'lead':
        return {
          label: 'عميل جديد',
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
          iconBg: 'bg-blue-600 text-white shadow-blue-200',
          cardBorder: 'border-blue-200 hover:border-blue-300 bg-white',
          Icon: UserCheck,
        };
      case 'system':
      default:
        return {
          label: 'إشعار نظام',
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
          iconBg: 'bg-slate-800 text-white shadow-slate-200',
          cardBorder: 'border-slate-200 hover:border-slate-300 bg-white',
          Icon: ShieldAlert,
        };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-full transition-all focus:outline-none ${
          isOpen 
            ? 'bg-slate-900 text-white shadow-md' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title="مركز الإشعارات والتنبيهات"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Card-Based Notification Center Popover */}
      {isOpen && (
        <div 
          className="absolute left-0 mt-2.5 w-80 sm:w-96 md:w-[420px] bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          dir="rtl"
        >
          {/* Header Bar */}
          <div className="p-4 bg-slate-900 dark:bg-slate-950 text-white border-b border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm tracking-tight text-white">مركز التنبيهات والمهام</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full shadow-xs">
                        {unreadCount} جديد
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    إشعارات فورية مبوبة حسب الأولوية
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all ${
                    activeTab === 'all' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  الكل ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab('urgent')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeTab === 'urgent' 
                      ? 'bg-rose-500 text-white shadow-sm' 
                      : 'text-rose-400 hover:text-rose-300'
                  }`}
                >
                  <Flame className="w-3 h-3" />
                  طارئ
                </button>
                <button
                  onClick={() => setActiveTab('task')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeTab === 'task' 
                      ? 'bg-amber-500 text-white shadow-sm' 
                      : 'text-amber-400 hover:text-amber-300'
                  }`}
                >
                  <CheckSquare className="w-3 h-3" />
                  مهام
                </button>
                <button
                  onClick={() => setActiveTab('system')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all ${
                    activeTab === 'system' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  نظام وحجوزات
                </button>
              </div>

              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead} 
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-bold transition-colors flex items-center gap-1 shrink-0 mr-1"
                  title="قراءة الجميع"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Simulation Quick Bar */}
          <div className="bg-slate-200/60 dark:bg-slate-800/80 p-2 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              تجربة إشعار:
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleSimulateAlert('urgent')}
                className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 rounded-lg text-[10px] font-black transition-colors"
              >
                🔥 عاجل
              </button>
              <button
                onClick={() => handleSimulateAlert('task')}
                className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 rounded-lg text-[10px] font-black transition-colors"
              >
                📋 مهمة
              </button>
              <button
                onClick={() => handleSimulateAlert('booking')}
                className="px-2 py-0.5 bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800 rounded-lg text-[10px] font-black transition-colors"
              >
                📅 حجز
              </button>
            </div>
          </div>

          {/* Card List Container */}
          <div className="max-h-[390px] overflow-y-auto p-3 space-y-2.5">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2.5 text-slate-400 dark:text-slate-500">
                  <CheckCircle2 className="w-6 h-6 text-slate-300 dark:text-slate-500" />
                </div>
                <p className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">لا توجد تنبيهات في هذا القسم</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">
                  جميع التنبيهات المعنية ستظهر فوراً في هذه القائمة
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const meta = getCategoryMeta(notif);
                const CategoryIcon = meta.Icon;

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleCardClick(notif)}
                    className={`p-3.5 rounded-2xl border shadow-xs transition-all cursor-pointer group relative ${
                      !notif.read 
                        ? `${meta.cardBorder} dark:bg-slate-800/90 dark:border-blue-500/40 shadow-md` 
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 opacity-90'
                    }`}
                  >
                    {/* Top Row: Category Badge & Time & Read Toggle */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {/* Icon Badge */}
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center shadow-xs ${meta.iconBg}`}>
                          <CategoryIcon className="w-4 h-4" />
                        </div>

                        {/* Category Tag */}
                        <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-lg border ${meta.badgeBg}`}>
                          {meta.label}
                        </span>

                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-300 dark:text-slate-500" />
                          {notif.time}
                        </span>

                        <button
                          onClick={(e) => handleToggleRead(notif.id, e)}
                          className="p-1 text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title={notif.read ? 'تحديد كغير مقروء' : 'تحديد كمقروء'}
                        >
                          <Check className={`w-3.5 h-3.5 ${notif.read ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Card Title & Content */}
                    <h4 className={`font-black text-xs mb-1 leading-snug ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {notif.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-2.5">
                      {notif.message}
                    </p>

                    {/* Footer Row: Details & CTA */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 dark:border-slate-700/60 text-[11px]">
                      {notif.customerName ? (
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                          <span className="truncate">{notif.customerName}</span>
                          {notif.phone && (
                            <span className="text-slate-400 dark:text-slate-400 font-normal text-[10px]" dir="ltr">
                              ({notif.phone})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">تنبيه إداري عام</span>
                      )}

                      <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-extrabold group-hover:translate-x-[-2px] transition-transform text-[11px]">
                        <span>{notif.customerName ? 'الملف الشخصي' : 'متابعة'}</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Navigation Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between text-xs border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/crm');
              }}
              className="text-blue-700 dark:text-blue-400 font-extrabold hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>سجل العملاء التفاعلي (CRM)</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-slate-400 hover:text-rose-600 font-bold transition-colors flex items-center gap-1 text-[11px]"
              >
                <Trash2 className="w-3 h-3" />
                مسح القائمة
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

