import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, CheckCircle2, User, Phone, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function PublicBookingForm() {
  const { formId } = useParams();
  
  const [formDetails, setFormDetails] = useState<any>({
    title: 'استشارة أسنان مجانية',
    duration: '30 دقيقة',
    fields: [
      { id: '1', label: 'الاسم الكامل', type: 'text', required: true },
      { id: '2', label: 'رقم الهاتف (واتساب)', type: 'tel', required: true },
      { id: '3', label: 'البريد الإلكتروني', type: 'email', required: false }
    ]
  });

  const [selectedDate, setSelectedDate] = useState('2026-08-06');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Try reading custom forms stored in localStorage
    const forms = JSON.parse(localStorage.getItem('crm_booking_forms') || '[]');
    const match = forms.find((f: any) => f.id === formId || f.link?.includes(formId));
    if (match) {
      setFormDetails(match);
    }
  }, [formId]);

  const availableSlots = [
    '09:00 AM', '10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // 1. Add to appointments (crm_appointments)
    const storedApts = JSON.parse(localStorage.getItem('crm_appointments') || '[]');
    const newAppointment = {
      id: Date.now(),
      customer: formData.name,
      phone: formData.phone,
      service: formDetails.title,
      staff: 'فريق الاستشارات',
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed',
      source: `نموذج حجز: ${formDetails.title}`,
      remindersSent: 0,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('crm_appointments', JSON.stringify([newAppointment, ...storedApts]));

    // 2. Sync to CRM Leads (crm_leads) as "appointment" status
    const storedLeads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
    const existingIndex = storedLeads.findIndex((l: any) => l.phone === formData.phone || l.name === formData.name);
    
    if (existingIndex >= 0) {
      storedLeads[existingIndex].status = 'appointment';
      storedLeads[existingIndex].source = `نموذج حجز (${formDetails.title})`;
    } else {
      const newLead = {
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        source: `نموذج حجز (${formDetails.title})`,
        status: 'appointment',
        campaignId: 'booking_form',
        createdAt: new Date().toISOString()
      };
      storedLeads.unshift(newLead);
    }
    localStorage.setItem('crm_leads', JSON.stringify(storedLeads));

    // 3. Log to Customer Timeline (crm_timeline)
    const storedTimeline = JSON.parse(localStorage.getItem('crm_timeline') || '[]');
    const timelineEvent = {
      id: `booking-${Date.now()}`,
      customer: formData.name,
      type: 'booking',
      title: `حجز موعد عبر ${formDetails.title}`,
      description: `تم حجز موعد يوم ${selectedDate} الساعة ${selectedTime} عبر نموذج الحجز الإلكتروني`,
      date: new Date().toISOString()
    };
    localStorage.setItem('crm_timeline', JSON.stringify([timelineEvent, ...storedTimeline]));

    // 4. Send system notification (crm_notifications)
    const storedNotifs = JSON.parse(localStorage.getItem('crm_notifications') || '[]');
    const newNotification = {
      id: `notif-${Date.now()}`,
      type: 'booking',
      title: 'حجز جديد من نموذج الحجز العام!',
      message: `قام العميل ${formData.name} بحجز موعد لخدمة (${formDetails.title}) بتاريخ ${selectedDate} الساعة ${selectedTime}`,
      customerName: formData.name,
      phone: formData.phone,
      service: formDetails.title,
      time: 'الآن',
      read: false,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('crm_notifications', JSON.stringify([newNotification, ...storedNotifs]));

    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12" dir="rtl">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white mb-4">
              <Sparkles className="w-3.5 h-3.5" /> حجز موعد أونلاين
            </div>
            <h1 className="text-2xl font-bold">{formDetails.title}</h1>
            <p className="text-blue-100 text-sm mt-2 flex items-center gap-2">
              <Clock className="w-4 h-4" /> مدة الموعد: {formDetails.duration || '30 دقيقة'}
            </p>
          </div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="p-6 md:p-8">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">تم تأكيد حجزك بنجاح!</h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                شكراً <span className="font-bold text-slate-900">{formData.name}</span>، تم تسجيل موعدك لـ <span className="font-bold text-blue-600">{formDetails.title}</span> بتاريخ <span className="font-bold text-slate-900">{selectedDate}</span> الساعة <span className="font-bold text-slate-900">{selectedTime}</span>.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-md mx-auto text-right text-xs space-y-2 mt-4">
                <div className="flex justify-between text-slate-600">
                  <span>الاسم:</span>
                  <span className="font-bold text-slate-900">{formData.name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>رقم الهاتف:</span>
                  <span className="font-bold text-slate-900" dir="ltr">{formData.phone}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>حالة الموعد:</span>
                  <span className="font-bold text-emerald-600">مؤكد تلقائياً</span>
                </div>
              </div>

              <div className="pt-6">
                <Link to="/booking" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors">
                  <ArrowRight className="w-4 h-4" /> العودة لنظام المواعيد
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Date & Time */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                  اختر التاريخ والوقت المناسب
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">التاريخ</label>
                    <input 
                      type="date" 
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">الوقت المتاح</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {availableSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  بيانات التواصل
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="مثال: أحمد عبدالله"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    رقم الهاتف (واتساب) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel"
                    required
                    placeholder="0791234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">البريد الإلكتروني (اختياري)</label>
                  <input 
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ملاحظات أو استفسار إضافي</label>
                  <textarea 
                    rows={2}
                    placeholder="أود الاستفسار عن..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  تأكيد واستلام الحجز
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                حجزك مؤمن ومشفر عبر نظام OFlow Engine
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
