import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, CreditCard, PieChart } from 'lucide-react';

export default function Wallet() {
  const transactions = [
    { id: 'TRX-1093', type: 'commission', amount: 60, date: 'الآن', description: 'عمولة بيع - أكاديمية المستقبل (CPA - 60%)', status: 'completed' },
    { id: 'TRX-1092', type: 'commission', amount: 1.4, date: 'قبل 15 دقيقة', description: 'عمولة عميل (واتساب) - شركة إعمار (CPL - 70%)', status: 'completed' },
    { id: 'TRX-1091', type: 'deposit', amount: 500, date: '2026-08-05 10:30', description: 'شحن رصيد الحملات (معلن)', status: 'completed' },
    { id: 'TRX-1090', type: 'campaign_fee', amount: -2.0, date: '2026-08-05 10:35', description: 'خصم استهلاك حملة - نقرة واتساب (CPL)', status: 'completed' },
    { id: 'TRX-1089', type: 'withdrawal', amount: -150, date: '2026-08-01 11:15', description: 'سحب أرباح إلى الحساب البنكي', status: 'pending' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">المحفظة المالية (OWallet)</h1>
        <p className="text-slate-500 mt-1">تتبع التوزيع التلقائي للأرباح وفق قانون التتبع (The Traceability Law)</p>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-slate-400 font-medium mb-1">الرصيد المتاح للسحب (مكتسب من النتائج)</p>
                <h2 className="text-4xl font-bold">262.00 <span className="text-xl font-medium text-slate-400">د.أ</span></h2>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <WalletIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                <ArrowDownRight className="w-5 h-5" /> شحن الرصيد
              </button>
              <button className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/20 transition-colors backdrop-blur-sm flex justify-center items-center gap-2">
                <ArrowUpRight className="w-5 h-5" /> سحب الأرباح
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <PieChart className="w-48 h-48" />
          </div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-slate-500 font-medium mb-1">الرصيد المعلق (بانتظار تأكيد البيع - CPA)</p>
              <h2 className="text-3xl font-bold text-slate-900">340.00 <span className="text-lg font-medium text-slate-500">د.أ</span></h2>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4 items-center relative z-10">
            <div className="flex-1">
              <h4 className="font-bold text-blue-900 text-sm">محرك توزيع العوائد (Revenue Split)</h4>
              <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                يتم تشريح المبالغ برمجياً فور تحقيق النتيجة (نقرة واتساب أو عملية بيع مؤكدة) وتودع حصتك فوراً.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-lg">سجل الحركات المالية (Real-time Ledger)</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {transactions.map(trx => (
            <div key={trx.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  trx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                  {trx.type === 'withdrawal' || trx.amount < 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{trx.description}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-slate-500">{trx.date}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-xs font-mono text-slate-400">{trx.id}</span>
                  </div>
                </div>
              </div>
              <div className="text-left flex flex-col items-end">
                <div className={`font-bold text-lg ${trx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`} dir="ltr">
                  {trx.amount > 0 ? '+' : ''}{trx.amount.toFixed(2)} JOD
                </div>
                {trx.status === 'pending' && (
                  <span className="text-xs font-semibold text-amber-500 mt-1 inline-block bg-amber-50 px-2 py-0.5 rounded">قيد المعالجة</span>
                )}
                {trx.type === 'commission' && (
                  <span className="text-[10px] font-bold text-blue-600 mt-1 inline-block bg-blue-50 px-2 py-0.5 rounded">حصة صانع المحتوى</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Inline clock icon just for this file to avoid extra imports if not present
function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
