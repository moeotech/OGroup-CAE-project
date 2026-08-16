import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Users, Video, Tag, CreditCard, ChevronLeft, ChevronRight, Check, Package, Zap, TrendingUp, Sparkles, Calculator } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'الهدف', icon: Target },
  { id: 2, title: 'الجمهور', icon: Users },
  { id: 3, title: 'المطابقة (AI Matching)', icon: Zap },
  { id: 4, title: 'التسعير والمزايدة', icon: Tag },
  { id: 5, title: 'الميزانية والتحليل', icon: CreditCard },
];

export default function CreateCampaign() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<string>('زيادة العملاء');
  const [businessCategory, setBusinessCategory] = useState<string>('صحة وتجميل (أسنان، جلدية، عيادات)');
  const [offerTitle, setOfferTitle] = useState<string>('فحص أسنان مجاني وتنظيف بخصم 50%');
  const [maxCplBid, setMaxCplBid] = useState<number>(2.00);
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [totalBudget, setTotalBudget] = useState<number>(500);
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('crm_products');
    if (stored) {
      setProducts(JSON.parse(stored).filter((p: any) => p.status === 'active' && p.stock > 0));
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(c => c + 1);
    } else {
      // Save campaign to localStorage
      const newCampaign = {
        id: `camp-${Date.now()}`,
        name: offerTitle || 'حملة تسويقية جديدة',
        goal: selectedGoal,
        category: businessCategory,
        status: 'active',
        budget: totalBudget,
        spent: 0,
        leads: 0,
        bid: maxCplBid,
        commission: commissionRate,
        startDate: new Date().toISOString().split('T')[0]
      };
      
      const existing = localStorage.getItem('user_campaigns');
      let campaignsList = [];
      if (existing) {
        try {
          campaignsList = JSON.parse(existing);
        } catch (e) {}
      }
      campaignsList.unshift(newCampaign);
      localStorage.setItem('user_campaigns', JSON.stringify(campaignsList));

      navigate('/campaigns');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(c => c - 1);
    } else {
      navigate('/campaigns');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">إنشاء حملة جديدة</h1>
        <p className="text-slate-500 mt-1">دعنا نطلق حملتك في 5 خطوات بسيطة</p>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full">
          <div 
            className="absolute top-0 right-0 h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
        
        <div className="relative z-10 flex justify-between">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors ${
                  isActive ? 'bg-blue-600 border-blue-100 text-white' :
                  isCompleted ? 'bg-blue-500 border-white text-white' :
                  'bg-white border-slate-100 text-slate-400'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className={`text-sm font-medium ${isActive || isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px] flex flex-col">
        <div className="flex-1">
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">ما هو هدف حملتك؟</h2>
                <p className="text-sm text-slate-500 mt-1">حدد الإجراء الرئيسي الذي تريد من المتابعين اتخاذه عند مشاهدة الإعلان</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'زيادة العملاء',
                    title: 'زيادة العملاء (WhatsApp Leads)',
                    badge: '🟢 CPL Model',
                    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    desc: 'توجيه المتابعين لبدء محادثة واتساب مباشرة وتأكيد رقم الهاتف وتسجيل العميل فوراً في CRM.'
                  },
                  {
                    id: 'زيادة الحجوزات',
                    title: 'زيادة الحجوزات (Bookings)',
                    badge: '📅 CPA Model',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    desc: 'توجيه العملاء إلى صفحة نموذج الحجز الإلكتروني التفاعلي لاختيار وتأكيد الموعد مباشرة.'
                  },
                  {
                    id: 'زيادة المبيعات',
                    title: 'زيادة المبيعات (E-commerce)',
                    badge: '🛒 Revenue Split',
                    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                    desc: 'توجيه العملاء لصفحة الشراء في المتجر الإلكتروني بخصم مباشر ونسبة عمولة لصانع المحتوى.'
                  }
                ].map(goal => (
                  <label 
                    key={goal.id} 
                    className={`border-2 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between gap-3 relative ${
                      selectedGoal === goal.id ? 'border-blue-600 bg-blue-50/60 shadow-sm' : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <input 
                          type="radio" 
                          name="goal" 
                          value={goal.id}
                          checked={selectedGoal === goal.id}
                          onChange={(e) => setSelectedGoal(e.target.value)}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${goal.badgeBg}`}>
                          {goal.badge}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 text-base block">{goal.title}</span>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {goal.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold">من هو جمهورك المستهدف؟</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">المدينة Target City</label>
                  <select className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500">
                    <option>عمان (Amman)</option>
                    <option>إربد (Irbid)</option>
                    <option>الزرقاء (Zarqa)</option>
                    <option>جميع المحافظات (All Jordan)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">الفئة العمرية Target Age</label>
                  <select className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500">
                    <option>جميع الأعمار (18 - 65+)</option>
                    <option>18 - 25</option>
                    <option>26 - 35</option>
                    <option>36 - 50</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">الاهتمامات الرئيسية Target Audience Interests</label>
                  <input type="text" defaultValue="العناية بالأسنان، التجميل، الصحة، الطب" className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  المطابقة الذكية واستضافة الإعلان (AI Matching)
                </h2>
                <p className="text-sm text-slate-500 mt-1">اختر فئة نشاطك التجاري، وسيقوم محرك OGroup AI بمطابقة عرضك تلقائياً ونشره فوق فيديوهات المبدعين الأكثر انتشاراً</p>
              </div>

              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    فئة النشاط التجاري (Business Category) *
                  </label>
                  <select 
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-2xl p-4 bg-blue-50/30 font-bold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-base"
                  >
                    <option value="صحة وتجميل (أسنان، جلدية، عيادات)">🏥 صحة وتجميل (أسنان، جلدية، مراكز طبية وعيادات)</option>
                    <option value="مطاعم وكافيهات ومأكولات">🍔 مطاعم وكافيهات ومأكولات سريعة</option>
                    <option value="تجزئة ومتاجر إلكترونية وأزياء">🛍️ تجزئة ومتاجر إلكترونية وأزياء وموضة</option>
                    <option value="خدمات الأعمال والاستشارات">💼 خدمات الأعمال والاستشارات والتدريب</option>
                    <option value="سيارات وخدمات نقل">🚗 سيارات ومراكز صيانة وخدمات نقل</option>
                  </select>
                </div>

                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-500/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
                      <Sparkles className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">مطابقة فورية بدون الحاجة لرفع فيديوهات (Zero Upload Friction)</h3>
                      <p className="text-xs text-indigo-200 mt-0.5">Automated Campaign Distribution Engine</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/10">
                    <strong className="text-amber-300">OGroup AI will automatically match and place your WhatsApp button over viral creator videos. No video upload needed.</strong>
                    <br />
                    (يقوم النظام الذكي بمطابقة عرضك التجاري ونشر زر الواتساب الخاطف آلياً فوق الفيديوهات ذات أعلى معدل مشاهدات وتفاعل ضمن فئة <span className="text-white font-bold">{businessCategory}</span> دون الحاجة لإنتاج أو رفع مقاطع فيديو بنفسك).
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">العرض التجاري واستراتيجية المزايدة الحرة</h2>
                <p className="text-xs text-slate-500 mt-1">
                  حدد تفاصيل العرض وسعر المزايدة المنافس لجذب كبار صناع المحتوى لاستضافة إعلانك.
                </p>
              </div>

              <div className="space-y-6 max-w-xl">
                {/* Offer Title */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">
                    عنوان العرض التجاري *
                  </label>
                  <input 
                    type="text" 
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                    placeholder="مثال: فحص أسنان مجاني وتنظيف بخصم 50%" 
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm text-slate-900" 
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    سيظهر هذا العرض للعملاء كطبقة تفاعلية (Ad Overlay) فوق فيديوهات صناع المحتوى.
                  </p>
                </div>

                {/* Goal 1: WhatsApp Leads (زيادة العملاء) */}
                {selectedGoal === 'زيادة العملاء' && (
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
                      <label className="block text-sm font-bold text-emerald-950 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                          إعدادات الواتساب المباشر (WhatsApp CTA)
                        </span>
                        <span className="text-[11px] bg-emerald-200/60 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
                          CPL Model
                        </span>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">رقم الواتساب لاستقبال العملاء</label>
                          <input 
                            type="tel" 
                            defaultValue="962791234567" 
                            className="w-full border border-slate-200 rounded-xl p-2.5 bg-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono dir-ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">الرسالة التلقائية</label>
                          <input 
                            type="text" 
                            defaultValue="مرحباً، أود الاستفسار عن العرض المعلن عنه" 
                            className="w-full border border-slate-200 rounded-xl p-2.5 bg-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bidding Input for CPL */}
                    <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                          Max CPL Bid (أقصى سعر لرسالة الواتساب) *
                        </label>
                        <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          المزاد المفتوح
                        </span>
                      </div>

                      <div className="relative">
                        <input 
                          type="number" 
                          step="0.10"
                          min="0.50"
                          value={maxCplBid}
                          onChange={(e) => setMaxCplBid(parseFloat(e.target.value) || 0)}
                          className="w-full border-2 border-blue-500 rounded-xl p-3 bg-blue-50/20 text-xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-200 pl-20 dir-ltr"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                          JOD / عميل
                        </span>
                      </div>

                      <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 space-y-1 text-xs text-amber-900">
                        <div className="font-bold flex items-center gap-1.5 text-amber-950">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>كيف يعمل نظام المزايدة في OGroup؟</span>
                        </div>
                        <p className="leading-relaxed text-slate-600">
                          Higher bids ensure your WhatsApp button is placed on top-tier creators' viral videos. Low bids may result in zero traffic.
                          (السعر الأعلى يضمن ظهور زر الواتساب الخاص بك على فيديوهات كبار صناع المحتوى الأكثر انتشاراً. السعر المنخفض قد يؤدي لعدم وصول حركة زوار).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Goal 2: Sales (زيادة المبيعات - Commission %) */}
                {selectedGoal === 'زيادة المبيعات' && (
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4 text-indigo-500" />
                        وجهة الترويج (رابط الإعلان)
                      </label>
                      <select className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm">
                        <option value="store">الترويج للمتجر كاملاً (تصفح جميع المنتجات)</option>
                        <optgroup label="ترويج منتج محدد">
                          {products.map(product => (
                            <option key={product.id} value={product.id}>{product.name} - {product.price} JOD</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    <div className="bg-white border border-indigo-200 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-indigo-600" />
                          Commission Percentage (نسبة العمولة) *
                        </label>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                          CPA Model
                        </span>
                      </div>

                      <div className="relative">
                        <input 
                          type="number" 
                          min="5"
                          max="80"
                          value={commissionRate}
                          onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                          className="w-full border-2 border-indigo-500 rounded-xl p-3 bg-indigo-50/20 text-xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-200 pl-16 dir-ltr"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                          % عمولة
                        </span>
                      </div>

                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 space-y-1 text-xs text-indigo-950">
                        <div className="font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>تنافسية العمولة</span>
                        </div>
                        <p className="leading-relaxed text-slate-600">
                          Creators will only promote your products if the commission is competitive.
                          (سيتنافس صناع المحتوى على الترويج لمنتجاتك إذا كانت نسبة العمولة منافسة ومغرية - التوصية: 15% إلى 25%).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Goal 3: Bookings (زيادة الحجوزات - CPA per Booking) */}
                {selectedGoal === 'زيادة الحجوزات' && (
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1">اختر نموذج الحجز المستهدف</label>
                      <select className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm">
                        <option value="dental">استشارة أسنان مجانية (30 دقيقة)</option>
                        <option value="marketing">اجتماع تسويق مبدئي (45 دقيقة)</option>
                        <option value="cleaning">حجز تنظيف ليزر</option>
                      </select>
                    </div>

                    <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-blue-600" />
                          Max Booking Bid (أقصى تكلفة للحجز المؤكد) *
                        </label>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                          CPA Booking
                        </span>
                      </div>

                      <div className="relative">
                        <input 
                          type="number" 
                          step="0.50"
                          min="1.00"
                          value={maxCplBid}
                          onChange={(e) => setMaxCplBid(parseFloat(e.target.value) || 0)}
                          className="w-full border-2 border-blue-500 rounded-xl p-3 bg-blue-50/20 text-xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-200 pl-20 dir-ltr"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                          JOD / حجز
                        </span>
                      </div>

                      <p className="text-xs text-slate-500">
                        يتم الخصم وتحويل المكافأة لصانع المحتوى فور قيام العميل بحجز موعد مؤكد عبر نموذج الحجز المباشر.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">الميزانية والتحليل المالي المتوقع (Fintech Ad-Engine)</h2>
                <p className="text-xs text-slate-500 mt-1">
                  حدد إجمالي ميزانية الحملة للتعرف فوراً على النتائج المتوقعة وتوزيع المحفظة المالي.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Budget Input Section */}
                <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      Total Campaign Budget (الميزانية الكلية للحملة) *
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                        placeholder="500" 
                        className="w-full border-2 border-blue-600 rounded-2xl p-4 bg-slate-50 text-2xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 pl-20 dir-ltr" 
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-blue-600 text-base">
                        JOD
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      سيتم خصم الميزانية تدريجياً ولحظياً من محفظة OWallet فقط عند تحقق الإجراءات المحددة.
                    </p>
                  </div>

                  {/* Quick Budget Shortcuts */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">ميزانيات سريعة موصى بها:</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 250, 500, 1000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setTotalBudget(amt)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                            totalBudget === amt 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' 
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {amt} د.أ
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Financial Distribution Ledger Preview */}
                  <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
                      <span>توزيع المحرك المالي اللحظي (Ledger Split)</span>
                      <span className="text-emerald-400">100% شفافية</span>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          حصة صناع المحتوى (60%):
                        </span>
                        <span className="font-bold font-mono text-emerald-400">
                          {(totalBudget * 0.60).toFixed(2)} JOD
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          عمولة منصة OGroup (20%):
                        </span>
                        <span className="font-bold font-mono text-blue-300">
                          {(totalBudget * 0.20).toFixed(2)} JOD
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          حساب الاحتياطي والإحالات (20%):
                        </span>
                        <span className="font-bold font-mono text-amber-300">
                          {(totalBudget * 0.20).toFixed(2)} JOD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Results & Campaign Summary Card */}
                <div className="space-y-4">
                  {/* Estimated Results Card */}
                  <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl border border-blue-500/30 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-amber-400" />
                        <span className="font-extrabold text-sm text-white">Estimated Results / النتائج المتوقعة</span>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        حاسبة OGroup الذكية
                      </span>
                    </div>

                    {/* Dynamic Result Banner */}
                    {selectedGoal === 'زيادة العملاء' && (
                      <div className="space-y-2 py-2">
                        <div className="text-xs text-slate-400 font-medium">النتائج والعملاء المتوقعين:</div>
                        <div className="text-3xl font-black text-amber-300 flex items-baseline gap-2">
                          <span>{maxCplBid > 0 ? Math.floor(totalBudget / maxCplBid) : 0}</span>
                          <span className="text-sm font-bold text-white">Estimated Results: WhatsApp Customers</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                          بناءً على الميزانية ({totalBudget} د.أ) وسعر المزايدة ({maxCplBid} د.أ)، ستتلقى عيادتك/نشاطك التجاري نحو <strong>{maxCplBid > 0 ? Math.floor(totalBudget / maxCplBid) : 0} عميل محتمل ومحادثة واتساب مباشرة</strong>.
                        </p>
                      </div>
                    )}

                    {selectedGoal === 'زيادة المبيعات' && (
                      <div className="space-y-2 py-2">
                        <div className="text-xs text-slate-400 font-medium">المبيعات والعوائد المتوقعة:</div>
                        <div className="text-3xl font-black text-emerald-400 flex items-baseline gap-2">
                          <span>{commissionRate > 0 ? Math.floor(totalBudget / (30 * (commissionRate / 100))) : 0}</span>
                          <span className="text-sm font-bold text-white">طلب شراء مؤكد</span>
                        </div>
                        <div className="text-xs text-slate-300 pt-1 flex justify-between">
                          <span>حجم المبيعات الإجمالي المتوقع:</span>
                          <strong className="text-amber-300 font-mono">
                            {(commissionRate > 0 ? Math.floor(totalBudget / (30 * (commissionRate / 100))) * 30 : 0).toLocaleString()} JOD
                          </strong>
                        </div>
                      </div>
                    )}

                    {selectedGoal === 'زيادة الحجوزات' && (
                      <div className="space-y-2 py-2">
                        <div className="text-xs text-slate-400 font-medium">الحجوزات المؤكدة المتوقعة:</div>
                        <div className="text-3xl font-black text-blue-300 flex items-baseline gap-2">
                          <span>{maxCplBid > 0 ? Math.floor(totalBudget / maxCplBid) : 0}</span>
                          <span className="text-sm font-bold text-white">حجز موعد مؤكد</span>
                        </div>
                        <p className="text-[11px] text-slate-300 pt-1">
                          سيتم توجيه العملاء إلى نموذج الحجز التفاعلي مباشرة.
                        </p>
                      </div>
                    )}

                    {/* Competitiveness Meter */}
                    <div className="mt-4 pt-3 border-t border-white/10 bg-white/5 p-3 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-slate-300">مؤشر تنافسية العرض (ROI Score):</span>
                      <span className="font-extrabold text-amber-300 flex items-center gap-1">
                        <span>مستوى المزايدة ممتاز 🔥 (High Coverage)</span>
                      </span>
                    </div>
                  </div>

                  {/* Summary Details Card */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">ملخص استراتيجية الحملة</h4>
                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>الهدف الاستراتيجي:</span>
                        <strong className="text-slate-900">{selectedGoal}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>الفئة المستهدفة:</span>
                        <strong className="text-slate-900 truncate max-w-[180px]">{businessCategory}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>العنوان التجاري:</span>
                        <strong className="text-slate-900 truncate max-w-[180px]">{offerTitle || 'فحص أسنان مجاني'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>المزايدة / العمولة (Bid Rate):</span>
                        <strong className="text-blue-600 font-mono">
                          {selectedGoal === 'زيادة العملاء' && `Max CPL Bid: ${maxCplBid} JOD`}
                          {selectedGoal === 'زيادة المبيعات' && `Commission: ${commissionRate}%`}
                          {selectedGoal === 'زيادة الحجوزات' && `Max CPA Bid: ${maxCplBid} JOD`}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>الميزانية الإجمالية:</span>
                        <strong className="text-emerald-600 font-mono">{totalBudget} JOD</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 mt-8 border-t border-slate-100">
          <button 
            onClick={handleBack}
            className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <ChevronRight className="w-5 h-5" />
            {currentStep === 1 ? 'إلغاء' : 'السابق'}
          </button>
          
          <button 
            onClick={handleNext}
            className="px-8 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            {currentStep === STEPS.length ? 'إطلاق الحملة' : 'التالي'}
            {currentStep !== STEPS.length && <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
