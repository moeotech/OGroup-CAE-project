import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, MessageCircle, Calendar, ExternalLink, Share2, Building2, UserCheck, CheckCircle2, Sparkles, DollarSign, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { mockVideos } from '../data';
import { tracker } from '../services/TrackingService';

export default function PublicOVideoViewer() {
  const { id } = useParams();

  // Retrieve stored video or find in mock
  const [video, setVideo] = useState(() => {
    const stored = localStorage.getItem('crm_videos');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const found = parsed.find((v: any) => v.id.toString() === id);
        if (found) return found;
      } catch (e) {}
    }
    return mockVideos.find(v => v.id.toString() === id) || mockVideos[0];
  });

  const companyPromoUrl = localStorage.getItem('crm_company_promo_url') || 'https://www.youtube.com/watch?v=promo_dental_care';
  const creatorPortfolioUrl = localStorage.getItem('crm_creator_portfolio_url') || 'https://www.tiktok.com/@creator/video/portfolio_reel';

  // Booking & Revenue Distribution States
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({ name: '', phone: '', service: 'تبييض أسنان منزلي', date: new Date().toISOString().split('T')[0] });

  // Live Revenue Distribution Modal for Investor Demo
  const [showEngineModal, setShowEngineModal] = useState(false);
  const [engineTx, setEngineTx] = useState<{ amount: number; creatorAmt: number; platformAmt: number; companyAmt: number; actionType: string } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    tracker.trackPageView(`video_${id}`, 'ovideo_viewer');
    tracker.trackAdImpression('cmp_company_promo', video.creator);
  }, [id, video]);

  const triggerRevenueDistribution = (actionType: 'whatsapp' | 'booking' | 'profile_visit', customTraceId?: string) => {
    const totalFee = 5.00;
    const creatorAmt = 3.00; // 60%
    const platformAmt = 1.00; // 20%
    const companyAmt = 1.00; // 20%

    const actionTextMap = {
      whatsapp: 'نقرة واتساب مباشرة',
      booking: 'حجز موعد مؤكد',
      profile_visit: 'زيارة بروفايل مع Trace_ID'
    };

    setEngineTx({
      amount: totalFee,
      creatorAmt,
      platformAmt,
      companyAmt,
      actionType: actionTextMap[actionType] || actionType
    });
    setShowEngineModal(true);

    // Save transaction to local storage so Sales and Wallet page reflect it!
    const existingLogs = JSON.parse(localStorage.getItem('crm_engine_txs') || '[]');
    const newTx = {
      id: Date.now(),
      videoTitle: video.title,
      creator: video.creator,
      amount: totalFee,
      creatorAmt,
      platformAmt,
      companyAmt,
      type: actionType,
      traceId: customTraceId || `tr_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toLocaleTimeString('ar-JO')
    };
    localStorage.setItem('crm_engine_txs', JSON.stringify([newTx, ...existingLogs]));
  };

  const handleWhatsAppClick = () => {
    tracker.trackCTAClick(video.id.toString(), 'whatsapp');
    triggerRevenueDistribution('whatsapp');
    
    // Open WhatsApp
    const msg = `مرحباً، أود الاستفسار والشراء بناءً على الفيديو الذي شاهدته: "${video.title}"`;
    window.open(`https://wa.me/962791234567?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleProfileVisitClick = () => {
    const generatedTraceId = `tr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    tracker.trackCTAClick(video.id.toString(), 'call');
    triggerRevenueDistribution('profile_visit', generatedTraceId);

    // Redirect to profile page with Trace ID appended
    setTimeout(() => {
      window.open(`/ovideo-profile/medical-clinic?trace_id=${generatedTraceId}&src=oads_video_${video.id}`, '_blank');
    }, 1200);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    tracker.trackCTAClick(video.id.toString(), 'form');
    triggerRevenueDistribution('booking');
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowBookingModal(false);
    }, 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between" dir="rtl">
      {/* Top Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/videos" className="w-9 h-9 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center transition-colors">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                OVideo Smart Share
              </span>
              <h1 className="text-sm font-bold text-white line-clamp-1">{video.title}</h1>
            </div>
          </div>

          <button 
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copiedLink ? 'تم النسخ!' : 'مشاركة الرابط'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6 w-full space-y-6 flex-1">
        
        {/* Creator Info & Platform Tag */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow-md">
              {video.creator?.[0] || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-white">{video.creator}</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  مبدع موثق
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">منشور عبر منصة {video.platform}</p>
            </div>
          </div>

          <a 
            href={creatorPortfolioUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="text-xs bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 shrink-0"
          >
            معرض الأعمال <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Video Stage with Company Promo Pre-Roll Ad Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-0">
          
          {/* Company Promo Pre-Roll Ad Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-3.5 px-5 border-b border-blue-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-md shadow-xs animate-pulse">
                فاصل دعائي للشركة
              </span>
              <p className="font-bold text-white text-xs">
                عرض خاص: خصم 20% على باقة تبييض الأسنان من العيادة النموذجية
              </p>
            </div>

            <a 
              href={companyPromoUrl} 
              target="_blank" 
              rel="noreferrer"
              className="text-[11px] bg-white text-slate-950 hover:bg-slate-100 font-bold px-3 py-1 rounded-xl transition-all flex items-center gap-1 shrink-0 shadow-xs"
            >
              <Building2 className="w-3 h-3 text-blue-600" />
              مشاهدة إعلان العيادة الأصلي
            </a>
          </div>

          {/* Video Player Display */}
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="w-full h-full object-cover opacity-60"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mb-3 shadow-2xl shadow-blue-600/50 scale-95 group-hover:scale-105 transition-transform cursor-pointer">
                <Play className="w-8 h-8 fill-current mr-0.5" />
              </div>
              <h3 className="text-lg font-black text-white max-w-lg mb-1">{video.title}</h3>
              <p className="text-xs text-slate-300 font-medium mb-4">تشغيل الفيديو مع تطبيق الفاصل الإعلاني وأزرار التحويل المباشر</p>

              <a 
                href={video.url} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2 backdrop-blur-md"
              >
                فتح الفيديو الأساسي في {video.platform} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* OAds Conversion Panel (Investor Demo Core) */}
          <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  خيارات الشراء والتواصل المباشر مع العيادة / المتجر
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">اضغط على أي خيار لمشاهدة محرك توزيع العوائد اللحظي OAds Revenue Engine</p>
              </div>

              <span className="text-[11px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-bold self-start sm:self-auto">
                ميزة التحويل المباشر
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-3 rounded-2xl font-bold text-xs transition-all shadow-lg shadow-emerald-900/30 group"
              >
                <MessageCircle className="w-4 h-4 fill-current group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">تواصل عبر الواتساب</span>
              </button>

              {/* Booking Button */}
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-3 rounded-2xl font-bold text-xs transition-all shadow-lg shadow-blue-900/30 group"
              >
                <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">حجز موعد مباشر</span>
              </button>

              {/* Profile Visit Button (Brand Awareness with Trace ID) */}
              <button
                onClick={handleProfileVisitClick}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 px-3 rounded-2xl font-bold text-xs transition-all shadow-lg shadow-purple-900/30 group border border-purple-400/30"
              >
                <Building2 className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0 text-amber-300" />
                <span className="truncate">زيارة البروفايل (Trace ID)</span>
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-900 bg-slate-950">
        <p>منصة OGroup CAE | محرك التسويق المدمج وتوزيع الإيرادات الذكي</p>
      </footer>

      {/* Real-time Revenue Engine Modal (Investor Aha Moment) */}
      {showEngineModal && engineTx && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={() => setShowEngineModal(false)}></div>
          <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-emerald-500/40 text-white p-6 my-8 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                    OAds Revenue Engine • Proof of Concept
                  </span>
                  <h3 className="text-base font-bold text-white">محرك توزيع العوائد المالي اللحظي</h3>
                </div>
              </div>
              <button onClick={() => setShowEngineModal(false)} className="text-slate-400 hover:text-white p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-center">
                <span className="text-xs text-emerald-300 font-bold block mb-1 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Unique Lead Verified! Instant Revenue Split Executed.
                </span>
                <span className="text-[11px] text-emerald-400 font-medium block mb-2">
                  (تم التحقق من عميل فريد! تم تنفيذ تقسيم العوائد المباشر والمستقطع فوراً)
                </span>
                <div className="text-3xl font-black text-white flex items-center justify-center gap-1">
                  <span>${engineTx.amount.toFixed(2)}</span>
                  <span className="text-xs text-emerald-400 font-medium">USD (ميزانية الإعلان)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">الإجراء المحفز: <strong className="text-white">{engineTx.actionType}</strong></p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">تفاصيل تشريح وتوزيع العوائد (Instant Split):</h4>

                {/* Creator Share */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                      60%
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">حصة صانع المحتوى ({video.creator})</span>
                      <span className="text-[10px] text-slate-400">تودع فوراً في محفظة المبدع</span>
                    </div>
                  </div>
                  <strong className="text-purple-400 font-black text-sm">${engineTx.creatorAmt.toFixed(2)}</strong>
                </div>

                {/* Platform Share */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      20%
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">أرباح المنصة OAds Platform</span>
                      <span className="text-[10px] text-slate-400">رسوم المعالجة التقنية للنظام</span>
                    </div>
                  </div>
                  <strong className="text-blue-400 font-black text-sm">${engineTx.platformAmt.toFixed(2)}</strong>
                </div>

                {/* Company Referral Share */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                      20%
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">عائد العيادة / رصيد الإحالة للمتجر</span>
                      <span className="text-[10px] text-slate-400">تحول لمسار الحملة التسويقية</span>
                    </div>
                  </div>
                  <strong className="text-amber-400 font-black text-sm">${engineTx.companyAmt.toFixed(2)}</strong>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setShowEngineModal(false)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg"
                >
                  فهمت، إغلاق العرض
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowBookingModal(false)}></div>
          <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-slate-800 text-white">
            <div className="px-6 py-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold">حجز موعد مباشر من خلال الفيديو</h3>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-white p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-bold text-white">تم تأكيد طلب الحجز المباشر!</h4>
                <p className="text-xs text-slate-400">تم توزيع حصص العوائد المالية وتأكيد الطلب في لوحة التحكم.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الاسم الكامل *</label>
                  <input 
                    type="text" 
                    required
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    placeholder="مثال: دانا محمود"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رقم الواتساب *</label>
                  <input 
                    type="tel" 
                    required
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    placeholder="+962 79 000 0000"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-medium"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">التاريخ والوقت المطلوب</label>
                  <input 
                    type="date" 
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowBookingModal(false)} 
                    className="flex-1 px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-colors text-xs"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors text-xs shadow-md shadow-blue-900/50 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    تأكيد الحجز وتوزيع العائد
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
