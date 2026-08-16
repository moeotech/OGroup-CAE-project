import { useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Play, CheckCircle2, Share2, ExternalLink, ShieldCheck, Tag } from 'lucide-react';
import { mockVideos } from '../data';
import { tracker } from '../services/TrackingService';

export default function OVideoProfile() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const traceId = searchParams.get('trace_id');
  const srcVideo = searchParams.get('src');
  
  // In a real app, we would fetch the profile using the slug
  const profileName = slug ? slug.replace('-', ' ') : 'عيادة د. أحمد للأسنان';

  useEffect(() => {
    tracker.trackPageView(slug || 'default', 'medical_clinic');
    if (traceId) {
      tracker.trackEvent('cta_click', { actionType: 'trace_id_landing', traceId, srcVideo });
    } else {
      tracker.trackAdImpression('cmp_dental_promo', 'adv_dental_care');
    }
  }, [slug, traceId, srcVideo]);

  const handleWhatsAppClick = () => {
    tracker.trackCTAClick('profile_main_cta', 'whatsapp');
    // Phase 3 simulation: if they proceed to Whatsapp and we get their number
    // In a real flow, this happens via the business API webhook later.
    setTimeout(() => {
      tracker.identifyUser('+962791234567');
    }, 2000);
  };

  const handleBookClick = () => {
    tracker.trackCTAClick('profile_main_cta', 'form');
  };

  const handleVideoClick = (videoId: string, platform: string) => {
    tracker.trackVideoView(videoId, platform);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Trace ID Attribution Banner */}
      {traceId && (
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white px-4 py-3 border-b border-emerald-500/40 shadow-lg sticky top-0 z-40">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold text-emerald-300">زيارة مؤكدة ومحولة من فيديو المبدع عبر OAds</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/10 font-mono text-[11px] dir-ltr text-amber-300">
              <Tag className="w-3 h-3 text-amber-400" />
              <span>Trace ID: {traceId}</span>
            </div>
          </div>
        </div>
      )}

      {/* Cover & Profile Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="h-48 bg-gradient-to-r from-blue-900 to-slate-900 w-full relative">
          <button className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-24 mb-6 flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden shrink-0 flex items-center justify-center relative">
              <img 
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex-1 text-center sm:text-right pb-2">
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full mb-3">
                مركز طبي
              </div>
              <h1 className="text-3xl font-bold text-slate-900 capitalize">{profileName}</h1>
              <p className="text-slate-500 mt-2 max-w-lg mx-auto sm:mx-0">
                مركز متخصص في طب وتجميل الأسنان. نقدم أحدث التقنيات للحصول على ابتسامة مثالية ومشرقة.
              </p>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4 text-sm text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  عمان, الأردن
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  +962 79 123 4567
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons (Conversion Layer) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8 border-b border-slate-100">
            <button onClick={handleWhatsAppClick} className="flex items-center justify-center gap-2 w-full bg-emerald-500 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-sm">
              <MessageCircle className="w-5 h-5" />
              تواصل عبر واتساب
            </button>
            <button onClick={handleBookClick} className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
              احجز موعدك الآن
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Videos Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">محتوى العيادة</h2>
            <span className="text-sm font-medium text-slate-500">3 فيديوهات</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {mockVideos.map(video => (
              <a 
                href={video.url} 
                target="_blank" 
                rel="noreferrer" 
                key={video.id} 
                onClick={() => handleVideoClick(video.id.toString(), video.platform)}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="relative aspect-video bg-slate-200">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center group-hover:bg-slate-900/40 transition-colors">
                    <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-5 h-5 fill-current ml-1" />
                    </div>
                  </div>
                  <span className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-md text-xs font-bold text-slate-700 capitalize shadow-sm">
                    {video.platform}
                  </span>
                </div>
                <div className="p-4 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{video.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{video.views.toLocaleString()} مشاهدة</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Smart Monetization Layer (OAds Mock) */}
        <section className="bg-gradient-to-br from-blue-50 to-slate-100 p-6 sm:p-8 rounded-3xl border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">OAds Sponsored</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-white shadow-sm border border-slate-200 p-2 shrink-0">
              <img src="https://images.unsplash.com/photo-1551076805-e1869043e560?w=200&q=80" alt="Ad" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="flex-1 text-center sm:text-right">
              <h3 className="text-lg font-bold text-slate-900">مهتم بالعناية بالأسنان؟</h3>
              <p className="text-slate-600 mt-1 text-sm">احصل على خصم 20% على منتجات العناية المنزلية من متجر دنتال كير.</p>
            </div>
            <button 
              onClick={() => tracker.trackCTAClick('cmp_dental_promo', 'form')}
              className="w-full sm:w-auto px-6 py-2.5 bg-white border-2 border-slate-200 text-slate-900 rounded-xl font-bold hover:border-blue-500 hover:text-blue-600 transition-colors shrink-0 shadow-sm"
            >
              تسوق الآن
            </button>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="text-center py-8 text-sm text-slate-400 font-medium">
        <p>مدعوم بواسطة <Link to="/" className="text-blue-500 hover:underline">OGroup CAE</Link></p>
      </footer>
    </div>
  );
}
