import React, { useState, useEffect } from 'react';
import { 
  Plus, Play, ExternalLink, X, Video as VideoIcon, CheckCircle2, Sparkles, 
  Share2, MessageCircle, Calendar, Building2, UserCheck, ShoppingBag, Copy, 
  Tv, RefreshCw, DollarSign, ArrowUpRight, TrendingUp, Layers, Eye, Users, 
  Check, ArrowRight, ShieldCheck, ArrowDownToLine, Zap
} from 'lucide-react';
import { mockVideos } from '../data';
import { Video } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../utils/toast';

export default function Videos() {
  const { user } = useAuth();

  // Active view tab state: 'company' | 'creator' | 'investor_demo'
  const [activeTabMode, setActiveTabMode] = useState<'company' | 'creator' | 'investor_demo'>(
    user.role === 'creator' ? 'creator' : 'company'
  );

  // Video Library State
  const [videos, setVideos] = useState<Video[]>(() => {
    const stored = localStorage.getItem('crm_videos');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return mockVideos;
      }
    }
    return mockVideos;
  });

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activePlayVideo, setActivePlayVideo] = useState<Video | null>(null);

  // Dedicated Video Links
  const [creatorPortfolioUrl, setCreatorPortfolioUrl] = useState<string>(() => {
    return localStorage.getItem('crm_creator_portfolio_url') || 'https://www.tiktok.com/@creator/video/portfolio_reel';
  });

  const [minThresholdCpl, setMinThresholdCpl] = useState<string>(() => {
    return localStorage.getItem('crm_creator_min_cpl') || localStorage.getItem('crm_creator_min_threshold') || '1.50';
  });

  const [minThresholdCommission, setMinThresholdCommission] = useState<string>(() => {
    return localStorage.getItem('crm_creator_min_commission') || '10';
  });

  const [minThresholdBooking, setMinThresholdBooking] = useState<string>(() => {
    return localStorage.getItem('crm_creator_min_booking') || '3.00';
  });

  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Player Interlude & Conversion State
  const [activeAdTab, setActiveAdTab] = useState<'company' | 'creator' | 'store'>('company');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    service: 'تبييض أسنان منزلي',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Investor Revenue Engine Live Transactions Log
  const [engineTxs, setEngineTxs] = useState<any[]>(() => {
    const stored = localStorage.getItem('crm_engine_txs');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return [
      { id: 101, videoTitle: 'تبييض الأسنان بالليزر', creator: 'Dr. Smile', amount: 5.00, creatorAmt: 3.00, platformAmt: 1.00, companyAmt: 1.00, type: 'whatsapp', timestamp: '10:42 AM' },
      { id: 102, videoTitle: 'نصائح لأسنان صحية', creator: 'Ahmed Media', amount: 5.00, creatorAmt: 3.00, platformAmt: 1.00, companyAmt: 1.00, type: 'booking', timestamp: '09:15 AM' }
    ];
  });

  // Live Engine Split Modal for Investor POC Demo
  const [showEngineModal, setShowEngineModal] = useState(false);
  const [activeEngineTx, setActiveEngineTx] = useState<any | null>(null);

  const [newVideo, setNewVideo] = useState({
    title: '',
    platform: 'facebook',
    customPlatform: '',
    url: '',
    thumbnail: '',
    creator: ''
  });

  useEffect(() => {
    localStorage.setItem('crm_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('crm_engine_txs', JSON.stringify(engineTxs));
  }, [engineTxs]);

  const handleSaveCreatorPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    localStorage.setItem('crm_creator_portfolio_url', creatorPortfolioUrl);
    setTimeout(() => {
      setIsSavingSettings(false);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }, 400);
  };

  const handleSaveMonetizationSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    localStorage.setItem('crm_creator_min_cpl', minThresholdCpl);
    localStorage.setItem('crm_creator_min_threshold', minThresholdCpl);
    localStorage.setItem('crm_creator_min_commission', minThresholdCommission);
    localStorage.setItem('crm_creator_min_booking', minThresholdBooking);
    setTimeout(() => {
      setIsSavingSettings(false);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }, 400);
  };

  const triggerRevenueDistribution = (videoItem: Video, actionType: 'whatsapp' | 'booking') => {
    const totalFee = 5.00;
    const creatorAmt = 3.00; // 60%
    const platformAmt = 1.00; // 20%
    const companyAmt = 1.00; // 20%

    const newTx = {
      id: Date.now(),
      videoTitle: videoItem.title,
      creator: videoItem.creator,
      amount: totalFee,
      creatorAmt,
      platformAmt,
      companyAmt,
      type: actionType,
      isUnique: true,
      timestamp: new Date().toLocaleTimeString('ar-JO')
    };

    setEngineTxs([newTx, ...engineTxs]);
    setActiveEngineTx(newTx);
    setShowEngineModal(true);
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.url) return;

    const finalPlatform = newVideo.platform === 'other'
      ? (newVideo.customPlatform.trim() || 'منصة أخرى')
      : newVideo.platform;

    const defaultThumbnails: Record<string, string> = {
      facebook: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&auto=format&fit=crop&q=80',
      snapchat: 'https://images.unsplash.com/photo-1598256989800-fea5f6c8d0a3?w=600&auto=format&fit=crop&q=80',
      tiktok: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80',
      youtube: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
      instagram: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
      twitter: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&auto=format&fit=crop&q=80',
      linkedin: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=600&auto=format&fit=crop&q=80',
      pinterest: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      telegram: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80',
      threads: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&auto=format&fit=crop&q=80',
      whatsapp: 'https://images.unsplash.com/photo-1614680376593-902f749f705b?w=600&auto=format&fit=crop&q=80',
      website: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      other: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
    };

    const addedVideo: Video = {
      id: Date.now().toString(),
      title: newVideo.title,
      platform: finalPlatform,
      url: newVideo.url,
      thumbnail: newVideo.thumbnail || defaultThumbnails[newVideo.platform.toLowerCase()] || defaultThumbnails.other,
      views: 1200,
      leads: 18,
      sales: 2,
      creator: newVideo.creator || (user.role === 'creator' ? user.name : 'صانع محتوى'),
      creatorPortfolioUrl: creatorPortfolioUrl
    };

    setVideos([addedVideo, ...videos]);
    setShowAddModal(false);
    setNewVideo({ title: '', platform: 'facebook', customPlatform: '', url: '', thumbnail: '', creator: '' });
  };

  const handleCopySmartLink = (video: Video) => {
    const shareableUrl = `${window.location.origin}/ovideo/${video.id}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activePlayVideo) {
      triggerRevenueDistribution(activePlayVideo, 'booking');
    }
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowBookingModal(false);
      setBookingData({ name: '', phone: '', service: 'تبييض أسنان منزلي', date: new Date().toISOString().split('T')[0], notes: '' });
    }, 2500);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80';
  };

  const getPlatformBadgeColor = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('facebook') || p.includes('فيسبوك')) return 'bg-blue-600 text-white border-blue-700';
    if (p.includes('snapchat') || p.includes('سناب')) return 'bg-yellow-400 text-slate-900 border-yellow-500';
    if (p.includes('youtube') || p.includes('يوتيوب')) return 'bg-red-600 text-white border-red-700';
    if (p.includes('tiktok') || p.includes('تيك')) return 'bg-slate-900 text-white border-slate-800';
    if (p.includes('instagram') || p.includes('إنستغرام') || p.includes('انستقرام')) return 'bg-pink-600 text-white border-pink-700';
    if (p.includes('twitter') || p.includes('إكس') || p.includes('تويتر')) return 'bg-slate-900 text-white border-slate-800';
    if (p.includes('linkedin') || p.includes('لينكدإن')) return 'bg-blue-700 text-white border-blue-800';
    if (p.includes('pinterest') || p.includes('بنترست')) return 'bg-red-700 text-white border-red-800';
    if (p.includes('telegram') || p.includes('تليجرام')) return 'bg-sky-500 text-white border-sky-600';
    if (p.includes('whatsapp') || p.includes('واتساب')) return 'bg-emerald-600 text-white border-emerald-700';
    if (p.includes('threads') || p.includes('ثريدز')) return 'bg-slate-900 text-white border-slate-800';
    if (p.includes('website') || p.includes('موقع')) return 'bg-indigo-600 text-white border-indigo-700';
    return 'bg-purple-600 text-white border-purple-700';
  };

  const filteredVideos = selectedFilter === 'all' 
    ? videos 
    : videos.filter(v => v.platform.toLowerCase().includes(selectedFilter.toLowerCase()));

  // Metrics for Company View
  const totalCompanyImpressions = videos.reduce((acc, v) => acc + v.views, 0);
  const totalCompanyLeads = videos.reduce((acc, v) => acc + v.leads, 0);
  const totalCompanySpent = engineTxs.reduce((acc, tx) => acc + tx.amount, 0);
  const totalPlatformProfit = engineTxs.reduce((acc, tx) => acc + tx.platformAmt, 0);
  const totalCreatorPayout = engineTxs.reduce((acc, tx) => acc + tx.creatorAmt, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto" dir="rtl">
      {/* Toast Confirmation */}
      {showSavedToast && (
        <div className="fixed top-5 left-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold animate-bounce text-sm">
          <CheckCircle2 className="w-5 h-5" />
          تم تحديث الرابط بنجاح!
        </div>
      )}

      {copiedLink && (
        <div className="fixed top-5 left-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-sm border border-slate-700">
          <Share2 className="w-5 h-5 text-blue-400" />
          تم نسخ رابط المشاركة الذكي المدمج بالفاصل الإعلاني والواتساب والحجز!
        </div>
      )}

      {/* Top Main Mode Switcher Navigation (Company vs Creator vs Investor Demo) */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] bg-blue-50 text-blue-700 font-extrabold px-3 py-1 rounded-full border border-blue-200">
            OVideo Core Platform • OGroup CAE
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1">
            {activeTabMode === 'company' && '🏢 بوابة الفيديوهات والإعلانات للشركة (Company Portal)'}
            {activeTabMode === 'creator' && '🎬 استوديو وفيديوهات صانع المحتوى (Creator Studio)'}
            {activeTabMode === 'investor_demo' && '🚀 نموذج إثبات المفهوم للمستثمرين (Investor Proof of Concept)'}
          </h1>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTabMode('company')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTabMode === 'company' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            واجهة الشركة
          </button>

          <button
            onClick={() => setActiveTabMode('creator')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTabMode === 'creator' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            واجهة المبدع
          </button>

          <button
            onClick={() => setActiveTabMode('investor_demo')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTabMode === 'investor_demo' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            عرض المستثمرين (POC)
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🏢 MODE 1: COMPANY / BUSINESS VIEW */}
      {/* ========================================================================= */}
      {activeTabMode === 'company' && (
        <div className="space-y-8">
          
          {/* Ad Distribution Matrix (توزيع الإعلانات على صانعي المحتوى) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  خارطة توزيع الإعلانات والطبقات التفاعلية على فيديوهات صانعي المحتوى
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  تلقائياً يقوم النظام بربط عروض وحملات الشركة بطبقات تفاعلية (Ad Overlay) فوق فيديوهات المبدعين النشطين في المنصة
                </p>
              </div>

              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                إجمالي التوزيع: {videos.length} فيديو مبدع
              </span>
            </div>

            {/* Matrix Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from(new Set(videos.map(v => v.creator))).map((creatorName, idx) => {
                const creatorVids = videos.filter(v => v.creator === creatorName);
                const totalViews = creatorVids.reduce((a, b) => a + b.views, 0);
                const totalLeads = creatorVids.reduce((a, b) => a + b.leads, 0);

                return (
                  <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                          {creatorName[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">{creatorName}</h3>
                          <span className="text-[10px] text-slate-500">{creatorVids.length} فيديوهات مفعلة</span>
                        </div>
                      </div>

                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        مربوط بالإعلان ⚡
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-slate-200/60">
                      <div className="bg-white p-2 rounded-xl border border-slate-100">
                        <span className="block text-[10px] text-slate-400 font-bold">المشاهدات</span>
                        <strong className="text-slate-900 font-black">{totalViews.toLocaleString()}</strong>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-100">
                        <span className="block text-[10px] text-blue-600 font-bold">العملاء المحولون</span>
                        <strong className="text-blue-700 font-black">{totalLeads} عميل</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Videos Grid with Distribution Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">جميع فيديوهات صانعي المحتوى المستضيفة لإعلان الشركة</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-md shadow-blue-100 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                إضافة فيديو جديد للمكتبة
              </button>
            </div>

            {/* Platform Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'all', label: 'جميع المنصات' },
                { id: 'facebook', label: 'فيسبوك' },
                { id: 'instagram', label: 'إنستغرام' },
                { id: 'tiktok', label: 'تيك توك' },
                { id: 'youtube', label: 'يوتيوب' },
                { id: 'snapchat', label: 'سناب شات' },
                { id: 'twitter', label: 'إكس / تويتر' },
                { id: 'linkedin', label: 'لينكدإن' },
                { id: 'pinterest', label: 'بنترست' },
                { id: 'telegram', label: 'تليجرام' },
                { id: 'whatsapp', label: 'واتساب' },
                { id: 'website', label: 'موقع إلكتروني' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedFilter === f.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredVideos.map(video => (
                <div key={video.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-md transition-all flex flex-col">
                  <div className="relative h-48 bg-slate-900/10 overflow-hidden">
                    <img src={video.thumbnail} alt={video.title} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    {/* Pre-roll indicator */}
                    <div className="absolute top-3 left-3 bg-slate-900/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold border border-white/20 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-blue-400" />
                      إعلان الشركة مدمج
                    </div>

                    {/* Platform Badge */}
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold border shadow-sm ${getPlatformBadgeColor(video.platform)}`}>
                      {video.platform}
                    </span>

                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                      <button 
                        onClick={() => setActivePlayVideo(video)}
                        className="px-3.5 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg hover:bg-blue-500"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        معاينة الفاصل الدعائي
                      </button>
                      <button
                        onClick={() => handleCopySmartLink(video)}
                        className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/40 shadow-lg"
                        title="نسخ رابط الترويج"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 line-clamp-1 text-sm">{video.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        المبدع: {video.creator}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-bold">العملاء: <strong className="text-blue-600">{video.leads}</strong></span>
                      <button 
                        onClick={() => handleCopySmartLink(video)}
                        className="text-blue-600 font-bold hover:underline text-xs flex items-center gap-1"
                      >
                        مشاركة الرابط الذكي ←
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🎬 MODE 2: CREATOR / PORTFOLIO STUDIO VIEW */}
      {/* ========================================================================= */}
      {activeTabMode === 'creator' && (
        <div className="space-y-8">
          
          {/* Creator Profile & Verified Badge Header */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center text-white text-xl font-black shadow-md shadow-purple-200 shrink-0">
                أ الم
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-black text-slate-900">أحمد المبدع (Creator Partner)</h1>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm" title="Handpicked creator network.">
                    <ShieldCheck className="w-4 h-4 text-emerald-200" />
                    Verified Partner (Tier 1)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-semibold flex items-center gap-1.5 flex-wrap">
                  <span className="text-purple-700 font-bold">Handpicked creator network</span>
                  <span className="text-slate-300">•</span>
                  <span>شبكة نخبة صناع المحتوى المعتمدين لمرحلة Phase 0 (دعوات خاصة Invite-Only)</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3 text-xs text-purple-950 font-bold">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <span>شريك معتمد تلقائي القبول والتوزيع (Instant Payout Authorized)</span>
            </div>
          </div>

          {/* Creator Configuration Grid: Portfolio Reel & Monetization Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Creator Portfolio Video Input Card */}
            <form onSubmit={handleSaveCreatorPortfolio} className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-purple-800/40 flex flex-col justify-between space-y-4">
              <div className="relative z-10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        رابط فيديو معرض أعمال المبدع (Portfolio Reel)
                        <span className="text-[10px] bg-purple-500/30 text-purple-200 font-bold px-2 py-0.5 rounded-full border border-purple-400/30">Portfolio</span>
                      </h2>
                      <p className="text-xs text-slate-300">رابط فيديو قصير يمثل أهم أعمال السيرة الإبداعية</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0"
                  >
                    {isSavingSettings ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    حفظ المعرض
                  </button>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
                  <label className="block text-xs font-bold text-purple-300">رابط فيديو أداء المبدع (TikTok Reel / Shorts / Insta):</label>
                  <div className="flex gap-2">
                    <input 
                      type="url"
                      required
                      value={creatorPortfolioUrl}
                      onChange={(e) => setCreatorPortfolioUrl(e.target.value)}
                      placeholder="https://www.tiktok.com/@creator/video/portfolio_reel"
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-white/20 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-purple-400 font-medium"
                      dir="ltr"
                    />
                    <a 
                      href={creatorPortfolioUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1 border border-white/20 shrink-0"
                    >
                      معاينة <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </form>

            {/* Monetization Settings (إعدادات تحقيق الدخل) Card */}
            <form onSubmit={handleSaveMonetizationSettings} className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="relative z-10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Zap className="w-6 h-6 fill-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        إعدادات تحقيق الدخل (Monetization Settings)
                        <span className="text-[10px] bg-amber-500/30 text-amber-200 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">Automated Bidding</span>
                      </h2>
                      <p className="text-xs text-slate-300">حدد الحد الأدنى للقبول التلقائي للإعلانات دون تدخل يدوي</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0"
                  >
                    {isSavingSettings ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    حفظ التسعيرة
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* 1. WhatsApp Leads (CPL) */}
                  <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-amber-300">1. WhatsApp Leads (CPL)</label>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">CPL</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Minimum Earning per Lead ($)</p>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.10"
                        min="0.50"
                        required
                        value={minThresholdCpl}
                        onChange={(e) => setMinThresholdCpl(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/20 rounded-xl text-base font-black text-amber-300 outline-none focus:border-amber-400 pl-8 dir-ltr"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">$ / lead</span>
                    </div>
                  </div>

                  {/* 2. E-commerce Sales (CPA %) */}
                  <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-amber-300">2. E-commerce Sales (CPA)</label>
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 rounded border border-indigo-500/30">Revenue %</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Minimum Store Commission (%)</p>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="1"
                        min="1"
                        max="80"
                        required
                        value={minThresholdCommission}
                        onChange={(e) => setMinThresholdCommission(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/20 rounded-xl text-base font-black text-amber-300 outline-none focus:border-amber-400 pl-7 dir-ltr"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">% comm</span>
                    </div>
                  </div>

                  {/* 3. Confirmed Bookings (CPA) */}
                  <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-amber-300">3. Confirmed Bookings</label>
                      <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.5 rounded border border-purple-500/30">CPA</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Minimum Earning per Booking ($)</p>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.50"
                        min="1.00"
                        required
                        value={minThresholdBooking}
                        onChange={(e) => setMinThresholdBooking(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/20 rounded-xl text-base font-black text-amber-300 outline-none focus:border-amber-400 pl-8 dir-ltr"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">$ / booking</span>
                    </div>
                  </div>
                </div>

                {/* Engine Status Indicator */}
                <div className="bg-emerald-950/60 border border-emerald-500/30 p-3.5 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <div>
                      <span className="text-xs font-black text-emerald-300 block">OAds Auto-Matching: Active</span>
                      <p className="text-[11px] font-bold text-emerald-200">
                        Currently matched with 12 high-paying campaigns across all 3 models.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/40 shrink-0">
                    Auto-Filter On
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                  <strong className="text-amber-300 block mb-0.5">OAds AI automatically matches your videos with advertisers bidding at or above your specific thresholds across all campaign types (Leads, Sales, Bookings).</strong>
                  (يقوم محرك الذكاء الاصطناعي بمطابقة فيديوهاتك آلياً مع المعلنين الذين يزايدون بسعر أو نسبة تساوي أو تتجاوز حدودك الدنيا المحددة عبر كافة أنواع الحملات: العملاء، المبيعات، والحجوزات).
                </p>
              </div>
            </form>
          </div>

          {/* Creator Earnings Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-bold block mb-1">Instant Available Balance (رصيد الأرباح الفورية)</span>
                  <strong className="text-2xl font-black text-purple-700">${totalCreatorPayout.toFixed(2)} USD</strong>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">⚡ سحب فوري دون فترة انتظار/Escrow</span>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <button 
                onClick={() => showToast("طلب سحب الأرباح الفورية: جاري تحويل المبلغ المتاح لحسابك عبر زين كاش / الحساب البنكي المباشر!", "success", "⚡ سحب أرباح")}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                Withdraw (سحب الأرباح)
              </button>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold block mb-1">Unique Verified Leads (تحويلات فريدة موثقة)</span>
                <strong className="text-2xl font-black text-slate-900">{engineTxs.length} عملاء فريدين</strong>
                <span className="text-[10px] text-blue-600 font-bold block mt-0.5">مكتسبة بـ Unique Lead Rule</span>
              </div>
              <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold block mb-1">Duplicate Clicks Filtered (نقرات مكررة لم تُحتسب)</span>
                <strong className="text-2xl font-black text-amber-600">42 نقرة ($0.00)</strong>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">تصفية لحماية ميزانية المعلن</span>
              </div>
              <div className="w-11 h-11 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold block mb-1">نسبة تحويل الجمهور (CR)</span>
                <strong className="text-2xl font-black text-emerald-600">4.8% ⭐</strong>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">أداء عالي الجودة</span>
              </div>
              <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Creator Uploaded Videos List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">فيديوهاتي وحملاتي المرفوعة</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-purple-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-md shadow-purple-100 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                رفع فيديو ترويجي جديد
              </button>
            </div>

            {/* Platform Filter Bar for Creator */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'all', label: 'جميع المنصات' },
                { id: 'facebook', label: 'فيسبوك' },
                { id: 'instagram', label: 'إنستغرام' },
                { id: 'tiktok', label: 'تيك توك' },
                { id: 'youtube', label: 'يوتيوب' },
                { id: 'snapchat', label: 'سناب شات' },
                { id: 'twitter', label: 'إكس / تويتر' },
                { id: 'linkedin', label: 'لينكدإن' },
                { id: 'pinterest', label: 'بنترست' },
                { id: 'telegram', label: 'تليجرام' },
                { id: 'whatsapp', label: 'واتساب' },
                { id: 'website', label: 'موقع إلكتروني' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedFilter === f.id
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredVideos.map(video => (
                <div key={video.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-md transition-all flex flex-col">
                  <div className="relative h-48 bg-slate-900/10 overflow-hidden">
                    <img src={video.thumbnail} alt={video.title} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold border shadow-sm ${getPlatformBadgeColor(video.platform)}`}>
                      {video.platform}
                    </span>

                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                      <button 
                        onClick={() => setActivePlayVideo(video)}
                        className="px-3.5 py-2 bg-purple-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg hover:bg-purple-500"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        تشغيل مع إعلان الشركة
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 line-clamp-1 text-sm">{video.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{video.views.toLocaleString()} مشاهدة</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-purple-700 font-bold">حصة العائد: <strong className="text-slate-900">$3.00 / تحويل</strong></span>
                      <button 
                        onClick={() => handleCopySmartLink(video)}
                        className="text-purple-600 font-bold hover:underline text-xs flex items-center gap-1"
                      >
                        نسخ رابط الترويج الذكي
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 MODE 3: INVESTOR POC DEMO (PROOFOFCONCEPT DASHBOARD) */}
      {/* ========================================================================= */}
      {activeTabMode === 'investor_demo' && (
        <div className="space-y-8">
          
          {/* Investor Pitch Hero Box */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-indigo-500/30">
            <div className="max-w-3xl space-y-4 relative z-10">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Proof of Concept (POC Demo)
              </span>
              <h2 className="text-2xl font-black text-white">
                محاكاة تحويل الرابط إلى أموال وتوزيع الإيرادات اللحظي
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                Advertisers are ONLY charged for UNIQUE WhatsApp leads. Duplicate numbers are auto-filtered (Zero Advertiser Fraud). Creators are paid INSTANTLY upon a unique conversion.
                <br />
                <span className="text-xs text-amber-300 font-bold mt-1.5 block">
                  (يتم خصم الرصيد من المعلن فقط عند التقاط جهة اتصال/عميل فريد Unique Lead. النقرات والأرقام المكررة تُفلتر آلياً لمنع الاحتيال Zero Fraud، وتُدفع أرباح المبدع 60% فوراً دون انتظار/Escrow).
                </span>
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActivePlayVideo(videos[0])}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  تشغيل سيناريو المشاهد والتحويل المباشر
                </button>
                <a
                  href={`/ovideo/${videos[0]?.id || 1}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
                >
                  فتح صفحة المشاركة العامة المستقلة <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Real-time Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold block">إجمالي ميزانية الإعلانات المعالجة</span>
              <strong className="text-2xl font-black text-slate-900">${totalCompanySpent.toFixed(2)}</strong>
              <span className="text-[10px] text-emerald-600 font-bold block">مباشرة من محرك Laravel backend</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold block">أرباح المنصة المباشرة (Platform)</span>
              <strong className="text-2xl font-black text-blue-600">${totalPlatformProfit.toFixed(2)}</strong>
              <span className="text-[10px] text-blue-600 font-bold block">20% رسوم المعالجة المضمونة</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold block">مستحقات المبدعين المحولة</span>
              <strong className="text-2xl font-black text-purple-600">${totalCreatorPayout.toFixed(2)}</strong>
              <span className="text-[10px] text-purple-600 font-bold block">60% توجيه فوري للمحفظة</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold block">إجمالي الحجوزات والواتساب</span>
              <strong className="text-2xl font-black text-emerald-600">{engineTxs.length} تحويلات حية</strong>
              <span className="text-[10px] text-emerald-600 font-bold block">100% نسبة التقاط موثوقة</span>
            </div>
          </div>

          {/* Live Transaction Ledger for Investor Pitch */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                <h3 className="text-base font-bold text-white">سجل العمليات المالية اللحظية (Real-time Split Ledger)</h3>
              </div>
              <span className="text-xs text-slate-400 font-bold">تحديث فورى بعد كل نقرة</span>
            </div>

            <div className="space-y-3">
              {engineTxs.map(tx => (
                <div key={tx.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{tx.videoTitle}</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">صانع المحتوى: {tx.creator} • الإجراء: {tx.type === 'whatsapp' ? 'واتساب مباشر' : 'نموذج حجز'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">إجمالي الحركة:</span>
                      <strong className="text-white text-sm font-black">${tx.amount.toFixed(2)}</strong>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-purple-400 block">المبدع (60%):</span>
                      <strong className="text-purple-400 text-sm font-black">${tx.creatorAmt.toFixed(2)}</strong>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-blue-400 block">المنصة (20%):</span>
                      <strong className="text-blue-400 text-sm font-black">${tx.platformAmt.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW VIDEO */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-slate-100">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold">إضافة فيديو جديد لمكتبة OVideo</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الفيديو *</label>
                <input 
                  type="text" 
                  required
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="مثال: تجربتي مع تبييض الأسنان"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المنصة / المصدر *</label>
                  <select
                    value={newVideo.platform}
                    onChange={(e) => setNewVideo({ ...newVideo, platform: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="facebook">فيسبوك (Facebook)</option>
                    <option value="instagram">إنستغرام (Instagram)</option>
                    <option value="tiktok">تيك توك (TikTok)</option>
                    <option value="youtube">يوتيوب (YouTube)</option>
                    <option value="snapchat">سناب شات (Snapchat)</option>
                    <option value="twitter">إكس / تويتر (X / Twitter)</option>
                    <option value="linkedin">لينكدإن (LinkedIn)</option>
                    <option value="pinterest">بنترست (Pinterest)</option>
                    <option value="telegram">تليجرام (Telegram)</option>
                    <option value="threads">ثريدز (Threads)</option>
                    <option value="whatsapp">حالات / قناة واتساب (WhatsApp)</option>
                    <option value="website">موقع / رابط مباشر (Direct URL)</option>
                    <option value="other">أخرى (منصة أو مصدر آخر...)</option>
                  </select>
                </div>

                {newVideo.platform === 'other' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">اسم المنصة أو المصدر *</label>
                    <input 
                      type="text" 
                      required
                      value={newVideo.customPlatform}
                      onChange={(e) => setNewVideo({ ...newVideo, customPlatform: e.target.value })}
                      placeholder="مثال: Rumble, Vimeo, DailyMotion, Vimeo..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">صانع المحتوى / القناة</label>
                    <input 
                      type="text" 
                      value={newVideo.creator}
                      onChange={(e) => setNewVideo({ ...newVideo, creator: e.target.value })}
                      placeholder="مثال: Dr. Smile"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                )}
              </div>

              {newVideo.platform === 'other' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">صانع المحتوى / القناة</label>
                  <input 
                    type="text" 
                    value={newVideo.creator}
                    onChange={(e) => setNewVideo({ ...newVideo, creator: e.target.value })}
                    placeholder="مثال: Dr. Smile"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رابط الفيديو (URL) *</label>
                <input 
                  type="url" 
                  required
                  value={newVideo.url}
                  onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                  placeholder="https://www.tiktok.com/@user/video/..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  dir="ltr"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-sm shadow-md shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  إضافة الفيديو
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SMART VIDEO PLAYER & INTERLUDE MODAL */}
      {/* ========================================================================= */}
      {activePlayVideo && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActivePlayVideo(null)}></div>
          <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl relative z-10 overflow-hidden border border-slate-800 text-white my-8">
            
            {/* Modal Top Header */}
            <div className="px-6 py-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600/20 border border-blue-500/40 rounded-xl flex items-center justify-center text-blue-400">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">{activePlayVideo.platform} Smart Player</span>
                  <h3 className="text-base font-bold text-white line-clamp-1">{activePlayVideo.title}</h3>
                </div>
              </div>
              <button onClick={() => setActivePlayVideo(null)} className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ad Interlude Switcher Bar */}
            <div className="bg-slate-900 p-3 px-6 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                معاينة الفاصل الإعلاني المدمج:
              </span>
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveAdTab('company')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    activeAdTab === 'company' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  فيديو الشركة الدعائي
                </button>
                <button
                  onClick={() => setActiveAdTab('creator')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    activeAdTab === 'creator' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  معرض أداء المبدع
                </button>
                <button
                  onClick={() => setActiveAdTab('store')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    activeAdTab === 'store' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  فاصل المتجر
                </button>
              </div>
            </div>

            {/* Video & Interlude Stage */}
            <div className="p-6 space-y-6">
              {/* Simulated Video Player Screen */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-slate-800 shadow-inner group">
                <img 
                  src={activePlayVideo.thumbnail} 
                  alt={activePlayVideo.title} 
                  onError={handleImageError}
                  className="w-full h-full object-cover opacity-50" 
                />

                {/* Pre-roll Ad / Interlude Overlay Banner */}
                <div className="absolute top-4 right-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between shadow-2xl">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold text-[10px] rounded-full border border-amber-400/30 animate-pulse">
                      فاصل إعلاني ترويجي
                    </span>
                    <p className="text-xs font-bold text-white line-clamp-1">
                      {activeAdTab === 'company' && 'عرض العيادة والشركة: خصم 20% على باقة تبييض الأسنان'}
                      {activeAdTab === 'creator' && `معرض الأعمال والدعايات المنجزة بواسطة: ${activePlayVideo.creator}`}
                      {activeAdTab === 'store' && 'فاصل المتجر الإلكتروني: شحن مجاني عند الطلب عبر الواتساب'}
                    </p>
                  </div>
                  <a 
                    href={activeAdTab === 'company' ? activePlayVideo.url : creatorPortfolioUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[11px] bg-white text-slate-900 font-bold px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1 shrink-0"
                  >
                    رابط الفاصل الأصلي <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Main Player Center Action */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-t from-black/90 via-transparent to-black/40">
                  <div className="w-16 h-16 bg-blue-600/90 rounded-full flex items-center justify-center text-white mb-3 shadow-xl shadow-blue-600/50 scale-95 group-hover:scale-105 transition-all">
                    <Play className="w-8 h-8 fill-current mr-0.5" />
                  </div>
                  <h4 className="text-base font-bold max-w-lg mb-1">{activePlayVideo.title}</h4>
                  <p className="text-xs text-slate-300 mb-4">بواسطة: {activePlayVideo.creator} ({activePlayVideo.platform})</p>
                  
                  <a 
                    href={activePlayVideo.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-2"
                  >
                    مشاهدة الفيديو الكامل في {activePlayVideo.platform} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Conversion Buttons Layer (WhatsApp Direct Buy + Instant Booking Form) */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      أزرار الشراء المباشر والتحويل المدمجة بالنظام
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Direct Conversion</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">تتيح للعميل الشراء مباشرة أو حجز موعد أثناء تصفح الفيديو</p>
                  </div>
                  <button
                    onClick={() => handleCopySmartLink(activePlayVideo)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 border border-slate-700"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-400" />
                    نسخ رابط المشاركة الذكي
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* WhatsApp Direct Purchase Button */}
                  <button 
                    onClick={() => {
                      triggerRevenueDistribution(activePlayVideo, 'whatsapp');
                      const msg = `مرحباً، أود الشراء والاستفسار عن العرض المعروض في الفيديو: "${activePlayVideo.title}"`;
                      window.open(`https://wa.me/962791234567?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 px-4 rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-900/30 group"
                  >
                    <MessageCircle className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                    <span>شراء مباشر عبر الواتساب</span>
                  </button>

                  {/* Booking Form Trigger Button */}
                  <button 
                    onClick={() => setShowBookingModal(true)}
                    className="flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-4 rounded-xl font-bold text-xs transition-all shadow-lg shadow-blue-900/30 group"
                  >
                    <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>تعبئة نموذج الحجز المباشر</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: QUICK BOOKING FORM */}
      {/* ========================================================================= */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowBookingModal(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-slate-100 text-slate-900">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">نموذج الحجز المباشر عبر الفيديو</h3>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-white p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">تم تسجيل حجزك وتوزيع العوائد بنجاح!</h4>
                <p className="text-xs text-slate-500">سيقوم فريق المبيعات والعيادة بالتواصل معك فوراً لتأكيد تفاصيل الموعد.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل *</label>
                  <input 
                    type="text" 
                    required
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    placeholder="مثال: محمد علي"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف (الواتساب) *</label>
                  <input 
                    type="tel" 
                    required
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    placeholder="+962 79 123 4567"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">الخدمة / المنتج</label>
                    <select
                      value={bookingData.service}
                      onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="تبييض أسنان منزلي">تبييض أسنان منزلي</option>
                      <option value="فرشاة أسنان كهربائية">فرشاة أسنان كهربائية</option>
                      <option value="استشارة عيادة طبية">استشارة عيادة طبية</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">التاريخ المفضل</label>
                    <input 
                      type="date" 
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowBookingModal(false)} 
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors text-xs"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-xs shadow-md shadow-blue-200 flex items-center justify-center gap-1.5"
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

      {/* ========================================================================= */}
      {/* MODAL 4: REVENUE ENGINE ANIMATED DISTRIBUTION SPLIT MODAL (INVESTOR POC) */}
      {/* ========================================================================= */}
      {showEngineModal && activeEngineTx && (
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
                    OAds Revenue Engine
                  </span>
                  <h3 className="text-base font-bold text-white">محرك معالجة العوائد المباشر</h3>
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
                  <span>${activeEngineTx.amount.toFixed(2)}</span>
                  <span className="text-xs text-emerald-400 font-medium">USD (ميزانية التحويل)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  فيديو: <strong className="text-white">{activeEngineTx.videoTitle}</strong> • صانع المحتوى: <strong className="text-white">{activeEngineTx.creator}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">تفاصيل توزيع العوائد (Instant Revenue Dissection):</h4>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                      60%
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">حصة صانع المحتوى ({activeEngineTx.creator})</span>
                      <span className="text-[10px] text-slate-400">تودع فوراً في محفظة المبدع المخصصة</span>
                    </div>
                  </div>
                  <strong className="text-purple-400 font-black text-sm">${activeEngineTx.creatorAmt.toFixed(2)}</strong>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      20%
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">أرباح المنصة OAds Platform</span>
                      <span className="text-[10px] text-slate-400">رسوم معالجة التقنية والربط</span>
                    </div>
                  </div>
                  <strong className="text-blue-400 font-black text-sm">${activeEngineTx.platformAmt.toFixed(2)}</strong>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                      20%
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">عائد العيادة / عمولة الإحالة للمتجر</span>
                      <span className="text-[10px] text-slate-400">تضاف لمسار التسويق التراكمي</span>
                    </div>
                  </div>
                  <strong className="text-amber-400 font-black text-sm">${activeEngineTx.companyAmt.toFixed(2)}</strong>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setShowEngineModal(false)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg"
                >
                  حسناً، إغلاق الشاشة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
