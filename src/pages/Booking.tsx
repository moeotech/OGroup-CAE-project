import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, MoreVertical, Settings, CalendarDays, Plus, Save, ChevronRight, ChevronLeft, Trash2, GripVertical, Type, Phone as PhoneIcon, Mail, AlignLeft, Send, X, ExternalLink, ChevronDown, Check, AlertCircle, XCircle } from 'lucide-react';

export default function Booking() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'forms' | 'settings'>('schedule');
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 7, 6)); // 2026-08-06
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1)); 
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormDuration, setNewFormDuration] = useState('30 دقيقة');
  const [newFormFields, setNewFormFields] = useState([
    { id: 1, type: 'text', label: 'الاسم الكامل', required: true },
    { id: 2, type: 'email', label: 'البريد الإلكتروني', required: true },
    { id: 3, type: 'phone', label: 'رقم الهاتف', required: true },
  ]);

  const [bookingForms, setBookingForms] = useState(() => {
    const stored = localStorage.getItem('crm_booking_forms');
    if (stored) return JSON.parse(stored);
    return [
      { id: 'dental', title: 'استشارة أسنان مجانية', duration: '30 دقيقة', active: true, link: 'oflow.com/book/dental' },
      { id: 'marketing', title: 'اجتماع تسويق مبدئي', duration: '45 دقيقة', active: true, link: 'oflow.com/book/marketing' },
      { id: 'cleaning', title: 'حجز تنظيف ليزر', duration: '60 دقيقة', active: false, link: 'oflow.com/book/cleaning' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('crm_booking_forms', JSON.stringify(bookingForms));
  }, [bookingForms]);

  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem('crm_appointments');
    if (stored) return JSON.parse(stored);
    return [
      { id: 1, customer: 'سارة أحمد', phone: '0790000001', service: 'استشارة تسويقية', staff: 'أحمد محمود', date: '2026-08-06', time: '10:00 AM', status: 'confirmed', remindersSent: 0 },
      { id: 2, customer: 'محمد علي', phone: '0791234567', service: 'اجتماع مبيعات', staff: 'نور الدين', date: '2026-08-06', time: '11:30 AM', status: 'pending', remindersSent: 0 },
      { id: 3, customer: 'يوسف خليل', phone: '0790000003', service: 'استشارة قانونية', staff: 'ليلى سمير', date: '2026-08-06', time: '02:00 PM', status: 'confirmed', remindersSent: 0 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('crm_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [newAppointmentData, setNewAppointmentData] = useState({ customer: '', phone: '', service: 'استشارة تسويقية', date: '2026-08-06', time: '09:00 AM' });

  const [selectedTestForm, setSelectedTestForm] = useState<any>(null);
  const [testBookingData, setTestBookingData] = useState({ name: '', phone: '', email: '', date: '2026-08-06', time: '11:00 AM' });

  const handleTestBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testBookingData.name || !testBookingData.phone || !selectedTestForm) return;

    const newApt = {
      id: Date.now(),
      customer: testBookingData.name,
      phone: testBookingData.phone,
      service: selectedTestForm.title,
      staff: 'فريق الحجوزات',
      date: testBookingData.date,
      time: testBookingData.time,
      status: 'confirmed',
      source: `نموذج حجز: ${selectedTestForm.title}`,
      remindersSent: 0,
      createdAt: new Date().toISOString()
    };

    const updatedApts = [newApt, ...appointments];
    setAppointments(updatedApts);

    // Save as CRM Lead
    const storedLeads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
    const existingIndex = storedLeads.findIndex((l: any) => l.phone === testBookingData.phone || l.name === testBookingData.name);
    
    if (existingIndex >= 0) {
      storedLeads[existingIndex].status = 'appointment';
      storedLeads[existingIndex].source = `نموذج حجز (${selectedTestForm.title})`;
    } else {
      const newLead = {
        id: Date.now().toString(),
        name: testBookingData.name,
        phone: testBookingData.phone,
        source: `نموذج حجز (${selectedTestForm.title})`,
        status: 'appointment',
        campaignId: 'booking_form',
        createdAt: new Date().toISOString()
      };
      storedLeads.unshift(newLead);
    }
    localStorage.setItem('crm_leads', JSON.stringify(storedLeads));

    // Timeline event
    const storedTimeline = JSON.parse(localStorage.getItem('crm_timeline') || '[]');
    const timelineEvent = {
      id: `booking-${Date.now()}`,
      customer: testBookingData.name,
      type: 'booking',
      title: `حجز موعد عبر نموذج ${selectedTestForm.title}`,
      description: `تم إرسال حجز موعد جديد عبر نموذج الحجز الإلكتروني يوم ${testBookingData.date} الساعة ${testBookingData.time}`,
      date: new Date().toISOString()
    };
    localStorage.setItem('crm_timeline', JSON.stringify([timelineEvent, ...storedTimeline]));

    // Notification
    const storedNotifs = JSON.parse(localStorage.getItem('crm_notifications') || '[]');
    const newNotification = {
      id: `notif-${Date.now()}`,
      type: 'booking',
      title: 'حجز جديد من نموذج الحجز الإلكتروني!',
      message: `قام العميل ${testBookingData.name} بحجز موعد لخدمة (${selectedTestForm.title}) بتاريخ ${testBookingData.date} الساعة ${testBookingData.time}`,
      customerName: testBookingData.name,
      phone: testBookingData.phone,
      service: selectedTestForm.title,
      time: 'الآن',
      read: false,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('crm_notifications', JSON.stringify([newNotification, ...storedNotifs]));

    setSelectedTestForm(null);
    setTestBookingData({ name: '', phone: '', email: '', date: '2026-08-06', time: '11:00 AM' });
    setActiveTab('schedule');
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppointmentData.customer || !newAppointmentData.phone) return;
    
    const newApt = {
      id: Date.now(),
      customer: newAppointmentData.customer,
      phone: newAppointmentData.phone,
      service: newAppointmentData.service,
      staff: 'أحمد محمود',
      date: newAppointmentData.date,
      time: newAppointmentData.time,
      status: 'confirmed',
      remindersSent: 0
    };
    
    setAppointments([newApt, ...appointments]);

    // Save as lead
    const storedLeads = localStorage.getItem('crm_leads');
    const leads = storedLeads ? JSON.parse(storedLeads) : [];
    
    if (!leads.find((l: any) => l.phone === newAppointmentData.phone)) {
      const newLead = {
        id: Date.now().toString(),
        name: newAppointmentData.customer,
        phone: newAppointmentData.phone,
        source: 'Booking',
        status: 'appointment',
        campaignId: 'manual',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('crm_leads', JSON.stringify([newLead, ...leads]));
    }
    
    setShowAddAppointmentModal(false);
    setNewAppointmentData({ customer: '', phone: '', service: 'استشارة تسويقية', date: '2026-08-06', time: '09:00 AM' });
  };

  const handleSendReminder = (appointment: any) => {
    // Generate WhatsApp URL
    const text = `مرحباً ${appointment.customer}،\n\nنود تذكيركم بموعدكم القادم لـ "${appointment.service}" بتاريخ ${appointment.date} الساعة ${appointment.time}.\n\nيرجى تأكيد الحضور. شكراً لكم.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');

    // Update appointment state
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { ...apt, remindersSent: (apt.remindersSent || 0) + 1 }
        : apt
    ));

    // Log action to customer timeline
    const timelineEvents = JSON.parse(localStorage.getItem('crm_timeline') || '[]');
    const newEvent = {
      id: `evt-${Date.now()}`,
      customer: appointment.customer,
      type: 'reminder',
      title: 'إرسال تذكير بالموعد',
      description: `تم إرسال تذكير عبر واتساب لموعد ${appointment.service}`,
      date: new Date().toISOString(),
    };
    localStorage.setItem('crm_timeline', JSON.stringify([newEvent, ...timelineEvents]));
  };

  const handleStatusChange = (aptId: number | string, newStatus: string) => {
    const updated = appointments.map(apt => 
      apt.id === aptId ? { ...apt, status: newStatus } : apt
    );
    setAppointments(updated);
    localStorage.setItem('crm_appointments', JSON.stringify(updated));

    const targetApt = appointments.find(a => a.id === aptId);
    if (targetApt) {
      const statusLabels: Record<string, string> = {
        confirmed: 'مؤكد',
        pending: 'بانتظار التأكيد',
        completed: 'مكتمل',
        cancelled: 'ملغى'
      };
      const timelineEvents = JSON.parse(localStorage.getItem('crm_timeline') || '[]');
      const newEvent = {
        id: `evt-status-${Date.now()}`,
        customer: targetApt.customer,
        type: 'status_update',
        title: `تحديث حالة الموعد إلى (${statusLabels[newStatus] || newStatus})`,
        description: `تم تغيير حالة موعد ${targetApt.service} إلى ${statusLabels[newStatus] || newStatus}`,
        date: new Date().toISOString(),
      };
      localStorage.setItem('crm_timeline', JSON.stringify([newEvent, ...timelineEvents]));
    }
  };

  const workingDays = [
    { id: 'sun', name: 'الأحد', active: true, start: '09:00', end: '17:00' },
    { id: 'mon', name: 'الإثنين', active: true, start: '09:00', end: '17:00' },
    { id: 'tue', name: 'الثلاثاء', active: true, start: '09:00', end: '17:00' },
    { id: 'wed', name: 'الأربعاء', active: true, start: '09:00', end: '17:00' },
    { id: 'thu', name: 'الخميس', active: true, start: '09:00', end: '17:00' },
    { id: 'fri', name: 'الجمعة', active: false, start: '09:00', end: '17:00' },
    { id: 'sat', name: 'السبت', active: false, start: '09:00', end: '17:00' },
  ];

  const [schedule, setSchedule] = useState(workingDays);
  const [defaultDuration, setDefaultDuration] = useState("30");

  const handleAddField = (type: string) => {
    const newId = Math.max(...newFormFields.map(f => f.id), 0) + 1;
    let label = 'حقل جديد';
    if (type === 'text') label = 'نص قصير';
    if (type === 'textarea') label = 'نص طويل';
    if (type === 'email') label = 'البريد الإلكتروني';
    if (type === 'phone') label = 'رقم الهاتف';
    
    setNewFormFields([...newFormFields, { id: newId, type, label, required: false }]);
  };

  const handleRemoveField = (id: number) => {
    setNewFormFields(newFormFields.filter(f => f.id !== id));
  };

  const handleUpdateField = (id: number, key: string, value: string | boolean) => {
    setNewFormFields(newFormFields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const handleSaveForm = () => {
    if (!newFormTitle.trim()) return;
    
    const newForm = {
      id: `form_${Date.now()}`,
      title: newFormTitle,
      duration: newFormDuration,
      active: true,
      link: `oflow.com/book/${newFormTitle.toLowerCase().replace(/\s+/g, '-')}`
    };
    
    setBookingForms([newForm, ...bookingForms]);
    setIsCreatingForm(false);
    setNewFormTitle('');
    setNewFormFields([
      { id: 1, type: 'text', label: 'الاسم الكامل', required: true },
      { id: 2, type: 'email', label: 'البريد الإلكتروني', required: true },
      { id: 3, type: 'phone', label: 'رقم الهاتف', required: true },
    ]);
  };

  const toggleFormStatus = (id: string) => {
    setBookingForms(bookingForms.map(form => 
      form.id === id ? { ...form, active: !form.active } : form
    ));
  };

  const toggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].active = !newSchedule[index].active;
    setSchedule(newSchedule);
  };

  const handleTimeChange = (index: number, field: 'start' | 'end', value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const dayNames = ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];

  const formatAMPM = (timeString: string) => {
    const [h, m] = timeString.split(':');
    let hours = parseInt(h);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, '0')}:${m} ${ampm}`;
  };

  const parseAMPM = (timeString: string) => {
    let [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  const getAvailableSlots = () => {
    const dayIndex = selectedDate.getDay();
    const daySchedule = schedule[dayIndex];
    
    if (!daySchedule.active) return [];

    const [startH, startM] = daySchedule.start.split(':').map(Number);
    const [endH, endM] = daySchedule.end.split(':').map(Number);
    
    let currentMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    const duration = parseInt(defaultDuration, 10);
    
    const slots = [];
    while (currentMins + duration <= endMins) {
      const h = Math.floor(currentMins / 60);
      const m = currentMins % 60;
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      currentMins += duration;
    }

    const dateString = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
    
    const bookedTimes = appointments
      .filter(apt => apt.date === dateString)
      .map(apt => parseAMPM(apt.time));

    return slots.filter(slot => !bookedTimes.includes(slot));
  };

  const availableSlots = getAvailableSlots();
  const selectedDateString = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
  const dayAppointments = appointments.filter(apt => apt.date === selectedDateString);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">المواعيد والحجوزات (Booking)</h1>
          <p className="text-slate-500 mt-1">إدارة حجوزات العملاء وجداول العمل للموظفين</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm text-sm">
          <Plus className="w-4 h-4" />
          حجز جديد
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'schedule' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          جدول المواعيد
        </button>
        <button
          onClick={() => setActiveTab('forms')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'forms' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          نماذج الحجز
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Settings className="w-4 h-4" />
          إعدادات الدوام
        </button>
      </div>

      {activeTab === 'schedule' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="font-bold text-slate-900 text-lg">مواعيد يوم {selectedDate.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
              <button 
                onClick={() => setShowAddAppointmentModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة موعد
              </button>
            </div>
            
            {dayAppointments.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-slate-400">
                <CalendarIcon className="w-12 h-12 mb-3 text-slate-300" />
                <p className="font-medium">لا توجد حجوزات في هذا اليوم</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dayAppointments.map(apt => (
                  <div key={apt.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:border-blue-200 transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{apt.customer}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{apt.service} • {apt.staff}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-sm">{apt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <select
                            value={apt.status || 'pending'}
                            onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                            className={`appearance-none cursor-pointer pl-7 pr-3 py-1.5 rounded-full text-xs font-bold transition-all border outline-none focus:ring-2 focus:ring-blue-500/20 ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : apt.status === 'completed'
                                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                : apt.status === 'cancelled'
                                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            <option value="confirmed">✓ مؤكد</option>
                            <option value="pending">⏳ بانتظار التأكيد</option>
                            <option value="completed">🎉 مكتمل</option>
                            <option value="cancelled">✕ ملغى</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                        <button 
                          onClick={() => handleSendReminder(apt)}
                          className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          تذكير
                          {apt.remindersSent > 0 && <span className="mr-1 opacity-70">({apt.remindersSent})</span>}
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6">
              <h3 className="font-bold text-slate-900 mb-4">الأوقات المتاحة للحجز ({availableSlots.length} فترة)</h3>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {availableSlots.map((slot, i) => (
                    <button key={i} className="py-2 px-3 border border-slate-200 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors">
                      {formatAMPM(slot)}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-sm font-medium">
                  {schedule[selectedDate.getDay()].active 
                    ? "جميع الأوقات محجوزة في هذا اليوم." 
                    : "هذا اليوم مغلق حسب إعدادات الدوام."}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-lg"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
                <h3 className="font-bold text-slate-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-xs font-bold text-slate-400">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8"></div>
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const date = i + 1;
                  const isSelected = selectedDate.getDate() === date && selectedDate.getMonth() === currentMonth.getMonth() && selectedDate.getFullYear() === currentMonth.getFullYear();
                  
                  // Check if this specific date is active based on schedule
                  const dayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date).getDay();
                  const isDayActive = schedule[dayOfWeek].active;
                  
                  return (
                    <button 
                      key={date}
                      onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date))}
                      className={`h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        isSelected ? 'bg-blue-600 text-white' : 
                        !isDayActive ? 'text-slate-300 hover:bg-slate-50' : 
                        'text-slate-700 hover:bg-slate-100'
                      }`}
                      disabled={!isDayActive}
                    >
                      {date}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">إحصائيات سريعة</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <span className="text-sm text-slate-600 font-medium">حجوزات اليوم</span>
                  <span className="font-bold text-slate-900">{dayAppointments.length}</span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <span className="text-sm text-slate-600 font-medium">فترات متاحة</span>
                  <span className="font-bold text-blue-600">{availableSlots.length}</span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <span className="text-sm text-slate-600 font-medium">مواعيد ملغاة</span>
                  <span className="font-bold text-red-500">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'forms' ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">نماذج الحجز (Booking Forms)</h2>
              <p className="text-sm text-slate-500 mt-1">قم بإنشاء نماذج حجز مختلفة لخدماتك، ليتمكن العملاء من الحجز من خلالها في الحملات الإعلانية.</p>
            </div>
            {!isCreatingForm && (
              <button 
                onClick={() => setIsCreatingForm(true)}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm shadow-sm"
              >
                <Plus className="w-4 h-4" />
                نموذج جديد
              </button>
            )}
          </div>
          <div className="p-6 lg:p-8">
            {isCreatingForm ? (
              <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">عنوان النموذج</label>
                        <input 
                          type="text" 
                          value={newFormTitle}
                          onChange={(e) => setNewFormTitle(e.target.value)}
                          placeholder="مثال: استشارة مجانية، حجز موعد..." 
                          className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">مدة الحجز الافتراضية</label>
                        <select 
                          value={newFormDuration}
                          onChange={(e) => setNewFormDuration(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        >
                          <option value="15 دقيقة">15 دقيقة</option>
                          <option value="30 دقيقة">30 دقيقة</option>
                          <option value="45 دقيقة">45 دقيقة</option>
                          <option value="60 دقيقة">ساعة واحدة</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900">حقول النموذج</h3>
                        <div className="flex gap-2">
                          <button onClick={() => handleAddField('text')} className="p-2 bg-white text-slate-600 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors" title="نص قصير"><Type className="w-4 h-4" /></button>
                          <button onClick={() => handleAddField('textarea')} className="p-2 bg-white text-slate-600 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors" title="نص طويل"><AlignLeft className="w-4 h-4" /></button>
                          <button onClick={() => handleAddField('phone')} className="p-2 bg-white text-slate-600 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors" title="رقم هاتف"><PhoneIcon className="w-4 h-4" /></button>
                          <button onClick={() => handleAddField('email')} className="p-2 bg-white text-slate-600 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors" title="بريد إلكتروني"><Mail className="w-4 h-4" /></button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {newFormFields.map((field, index) => (
                          <div key={field.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm group">
                            <div className="cursor-move text-slate-300 hover:text-slate-500">
                              <GripVertical className="w-5 h-5" />
                            </div>
                            <input 
                              type="text" 
                              value={field.label}
                              onChange={(e) => handleUpdateField(field.id, 'label', e.target.value)}
                              className="flex-1 bg-transparent border-none outline-none font-medium text-sm focus:ring-0 p-0"
                            />
                            <div className="flex items-center gap-4 border-r border-slate-100 pr-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={field.required}
                                  onChange={(e) => handleUpdateField(field.id, 'required', e.target.checked)}
                                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
                                />
                                <span className="text-xs font-medium text-slate-600">مطلوب</span>
                              </label>
                              <button 
                                onClick={() => handleRemoveField(field.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 sticky top-6">
                      <h3 className="font-bold text-slate-900 mb-4 text-sm">معاينة النموذج</h3>
                      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                        <div className="text-center mb-4">
                          <h4 className="font-bold text-slate-900">{newFormTitle || 'عنوان النموذج'}</h4>
                          <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3" /> {newFormDuration}
                          </p>
                        </div>
                        {newFormFields.map(field => (
                          <div key={field.id}>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <div className="w-full h-8 bg-slate-50 border border-slate-200 rounded-lg"></div>
                          </div>
                        ))}
                        <button className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-bold opacity-50 cursor-not-allowed">
                          تأكيد الحجز
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button 
                    onClick={() => setIsCreatingForm(false)}
                    className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    إلغاء
                  </button>
                  <button 
                    onClick={handleSaveForm}
                    disabled={!newFormTitle.trim()}
                    className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    حفظ النموذج
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookingForms.map(form => (
                  <div key={form.id} className="border border-slate-200 rounded-2xl p-5 hover:border-blue-500 transition-colors bg-white shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={form.active}
                          onChange={() => toggleFormStatus(form.id)}
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{form.title}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
                      <Clock className="w-4 h-4" />
                      <span>المدة: {form.duration}</span>
                    </div>
                    
                    <div className="mt-auto pt-5 border-t border-slate-100 flex flex-col gap-3">
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span className="font-mono bg-slate-50 px-2 py-1 rounded text-left border border-slate-100" dir="ltr">{form.link}</span>
                        <Link 
                          to={`/book/${form.id}`} 
                          target="_blank" 
                          className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-xs"
                        >
                          فتح صفحة الحجز <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedTestForm(form);
                          setTestBookingData({ name: '', phone: '', email: '', date: '2026-08-06', time: '11:00 AM' });
                        }}
                        className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        تجربة تقديم حجز بالنموذج
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">أيام وساعات العمل (Availability)</h2>
              <p className="text-sm text-slate-500 mt-1">حدد الأوقات المتاحة للعملاء لحجز المواعيد فيها</p>
            </div>
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm shadow-sm">
              <Save className="w-4 h-4" />
              حفظ الإعدادات
            </button>
          </div>
          
          <div className="p-6 lg:p-8">
            <div className="max-w-3xl space-y-6">
              
              {/* Duration Setting */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">مدة الموعد الافتراضية</h4>
                  <p className="text-xs text-slate-500 mt-1">المدة الزمنية المخصصة لكل حجز (سيتم تقسيم الأوقات المتاحة بناءً عليها)</p>
                </div>
                <select 
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(e.target.value)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
                >
                  <option value="15">15 دقيقة</option>
                  <option value="30">30 دقيقة</option>
                  <option value="45">45 دقيقة</option>
                  <option value="60">1 ساعة</option>
                  <option value="120">2 ساعة</option>
                </select>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base mb-4">الجدول الأسبوعي</h3>
                {schedule.map((day, index) => (
                  <div key={day.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 rounded-2xl hover:border-blue-100 transition-colors bg-white">
                    <div className="flex items-center gap-3 w-40">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={day.active}
                          onChange={() => toggleDay(index)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                      <span className={`font-bold ${day.active ? 'text-slate-900' : 'text-slate-400'}`}>
                        {day.name}
                      </span>
                    </div>

                    {day.active ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">من</span>
                          <input 
                            type="time" 
                            value={day.start}
                            onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <span className="text-slate-300">-</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">إلى</span>
                          <input 
                            type="time" 
                            value={day.end}
                            onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-slate-400 italic">
                        مغلق
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddAppointmentModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowAddAppointmentModal(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">إضافة موعد جديد</h2>
              <button onClick={() => setShowAddAppointmentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الاسم الكامل</label>
                <input 
                  type="text" 
                  required
                  value={newAppointmentData.customer}
                  onChange={(e) => setNewAppointmentData({...newAppointmentData, customer: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="محمد علي"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">رقم الهاتف</label>
                <input 
                  type="tel" 
                  required
                  value={newAppointmentData.phone}
                  onChange={(e) => setNewAppointmentData({...newAppointmentData, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0791234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الخدمة / الموعد</label>
                <input 
                  type="text" 
                  required
                  value={newAppointmentData.service}
                  onChange={(e) => setNewAppointmentData({...newAppointmentData, service: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="مثال: استشارة تسويقية"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">التاريخ</label>
                  <input 
                    type="date" 
                    required
                    value={newAppointmentData.date}
                    onChange={(e) => setNewAppointmentData({...newAppointmentData, date: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">الوقت</label>
                  <input 
                    type="time" 
                    required
                    value={newAppointmentData.time}
                    onChange={(e) => setNewAppointmentData({...newAppointmentData, time: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddAppointmentModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                  إلغاء
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                  حفظ الموعد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Booking Form Submission Modal */}
      {selectedTestForm && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedTestForm(null)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-slate-100">
            <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">نموذج حجز إلكتروني</span>
                <h2 className="text-xl font-bold mt-0.5">{selectedTestForm.title}</h2>
              </div>
              <button onClick={() => setSelectedTestForm(null)} className="text-white/80 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleTestBookingSubmit} className="p-6 space-y-4">
              <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-100 text-xs text-blue-800">
                💡 <span className="font-bold">تجربة تقديم حجز:</span> إرسال هذا النموذج سينشئ موعداً حقيقياً في جدول المواعيد، وسيتم ربطه تلقائياً بسجلات العملاء CRM وتتبع رحلته!
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم العميل بالكامل *</label>
                <input 
                  type="text" 
                  required
                  value={testBookingData.name}
                  onChange={(e) => setTestBookingData({...testBookingData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  placeholder="مثال: يوسف إبراهيم"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف (واتساب) *</label>
                <input 
                  type="tel" 
                  required
                  value={testBookingData.phone}
                  onChange={(e) => setTestBookingData({...testBookingData, phone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  placeholder="0791234567"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني (اختياري)</label>
                <input 
                  type="email" 
                  value={testBookingData.email}
                  onChange={(e) => setTestBookingData({...testBookingData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  placeholder="yousef@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تاريخ الموعد</label>
                  <input 
                    type="date" 
                    required
                    value={testBookingData.date}
                    onChange={(e) => setTestBookingData({...testBookingData, date: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">وقت الموعد</label>
                  <select
                    value={testBookingData.time}
                    onChange={(e) => setTestBookingData({...testBookingData, time: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  >
                    <option value="09:00 AM">09:00 صباحاً</option>
                    <option value="10:00 AM">10:00 صباحاً</option>
                    <option value="11:00 AM">11:00 صباحاً</option>
                    <option value="01:00 PM">01:00 ظهراً</option>
                    <option value="02:30 PM">02:30 ظهراً</option>
                    <option value="04:00 PM">04:00 عصراً</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setSelectedTestForm(null)} 
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-sm shadow-md shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  تقديم الحجز الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
