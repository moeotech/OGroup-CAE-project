import { useState } from 'react';
import { X, Plus, Trash2, Mail, Save, Calculator, FileText, MessageCircle } from 'lucide-react';
import { showToast } from '../utils/toast';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface CreateQuoteProps {
  onClose: () => void;
  onSave: (quote: any) => void;
}

const predefinedCustomers = [
  { name: 'محمد علي', email: 'mohammad@example.com' },
  { name: 'سارة خالد', email: 'sara@example.com' },
  { name: 'أحمد حسن', email: 'ahmed@example.com' },
  { name: 'خالد يوسف', email: 'khaled@example.com' },
  { name: 'ريم سعيد', email: 'reem@example.com' },
  { name: 'شركة الأفق المحدودة', email: 'contact@alufuq.com' },
  { name: 'مؤسسة الرواد', email: 'info@alruwad.com' },
  { name: 'مجموعة النور', email: 'hello@alnoor-group.com' },
  { name: 'شركة التقنية الحديثة', email: 'tech@modern-tech.io' }
];

export default function CreateQuote({ onClose, onSave }: CreateQuoteProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 }
  ]);
  const [taxRate, setTaxRate] = useState(16); // Default 16% VAT

  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const generateQuoteData = (status: string) => ({
    id: `Q-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    customer: customerName,
    amount: total,
    date: new Date().toISOString().split('T')[0],
    status,
    items,
    subtotal,
    taxRate,
    taxAmount
  });

  const handleSave = () => {
    if (!customerName.trim()) return;
    onSave(generateQuoteData('draft'));
  };

  const handleEmailShare = () => {
    if (!customerEmail.trim()) {
      showToast('الرجاء اختيار عميل لديه بريد إلكتروني', 'warning', 'تنبيه');
      return;
    }
    
    onSave(generateQuoteData('pending'));
    
    const subject = `عرض سعر مبدئي - ${customerName}`;
    const body = `مرحباً ${customerName}،\n\nنرفق لكم عرض السعر المبدئي بقيمة إجمالية ${total.toLocaleString()} د.أ.\n\nتفضلوا بقبول فائق الاحترام.`;
    const mailtoUrl = `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleWhatsAppShare = () => {
    if (!customerName.trim()) {
      showToast('الرجاء إدخال اسم العميل أولاً', 'warning', 'تنبيه');
      return;
    }
    
    onSave(generateQuoteData('pending'));
    
    const text = `مرحباً ${customerName}،\n\nنرفق لكم عرض السعر المبدئي بقيمة إجمالية ${total.toLocaleString()} د.أ.\n\nتفضلوا بقبول فائق الاحترام.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:bg-white print:p-0">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none">
        
        {/* Header - Hidden on Print */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">إنشاء عرض سعر جديد</h2>
              <p className="text-sm text-slate-500">قم بإضافة بيانات العميل وتفاصيل الخدمات/المنتجات</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 print:p-0">
          <div className="print-container">
            {/* Print Header */}
            <div className="hidden print:flex justify-between items-start mb-12 border-b border-slate-200 pb-8">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-wider text-blue-600">OGroup CAE</h1>
                <p className="text-slate-500 mt-2">عرض سعر مبدئي</p>
              </div>
              <div className="text-left" dir="ltr">
                <p className="font-bold text-slate-900">التاريخ: {new Date().toLocaleDateString('ar-JO')}</p>
                <p className="text-slate-500">رقم العرض: مسودة</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">بيانات العميل</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 print:hidden">اسم العميل / الشركة</label>
                  <select 
                    value={customerName}
                    onChange={(e) => {
                      const selected = predefinedCustomers.find(c => c.name === e.target.value);
                      setCustomerName(e.target.value);
                      if (selected) setCustomerEmail(selected.email);
                    }}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium print:hidden"
                  >
                    <option value="">اختر العميل...</option>
                    {predefinedCustomers.map((c, i) => (
                      <option key={i} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  {/* Print only view */}
                  <div className="hidden print:block text-lg font-bold">
                    {customerName || "—"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 print:hidden">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-left print:bg-transparent print:border-none print:p-0"
                    dir="ltr"
                  />
                </div>
              </div>
              
              <div className="space-y-4 print:hidden">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">إعدادات العرض</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">نسبة الضريبة (%)</label>
                  <input 
                    type="number" 
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-900">تفاصيل العرض (Line Items)</h3>
                <button 
                  onClick={handleAddItem}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 print:hidden"
                >
                  <Plus className="w-4 h-4" />
                  إضافة بند
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm print:bg-transparent print:border-b-2 print:border-slate-800">
                      <th className="py-3 px-4 font-bold">الوصف</th>
                      <th className="py-3 px-4 font-bold w-32">الكمية</th>
                      <th className="py-3 px-4 font-bold w-40">سعر الوحدة</th>
                      <th className="py-3 px-4 font-bold w-40">المجموع</th>
                      <th className="py-3 px-4 font-bold w-16 print:hidden"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className="border-b border-slate-100">
                        <td className="py-2 px-4">
                          <input 
                            type="text"
                            value={item.description}
                            onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                            placeholder="وصف الخدمة أو المنتج..."
                            className="w-full bg-transparent border-none outline-none font-medium text-slate-900 focus:ring-0 p-2 print:p-0"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <input 
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 p-2 text-center print:bg-transparent print:border-none print:p-0"
                            min="1"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <div className="relative flex items-center">
                            <input 
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 p-2 pl-8 print:bg-transparent print:border-none print:p-0"
                              min="0"
                            />
                            <span className="absolute left-3 text-slate-400 text-sm print:hidden">د.أ</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 font-bold text-slate-900">
                          {(item.quantity * item.unitPrice).toLocaleString()} د.أ
                        </td>
                        <td className="py-2 px-4 text-left print:hidden">
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={items.length === 1}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full md:w-1/2 lg:w-1/3 space-y-3 bg-slate-50 p-6 rounded-2xl print:bg-transparent print:p-0 print:border-t-2 print:border-slate-800 print:rounded-none">
                <div className="flex justify-between items-center text-slate-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold text-slate-900">{subtotal.toLocaleString()} د.أ</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>الضريبة ({taxRate}%):</span>
                  <span className="font-bold text-slate-900">{taxAmount.toLocaleString()} د.أ</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-lg text-slate-900">الإجمالي:</span>
                  <span className="font-bold text-xl text-blue-600">{total.toLocaleString()} د.أ</span>
                </div>
              </div>
            </div>
            
            <div className="hidden print:block mt-16 text-center text-slate-500 text-sm">
              <p>شكراً لتعاملكم معنا. هذا العرض صالح لمدة 30 يوماً من تاريخ إصداره.</p>
            </div>
          </div>
        </div>

        {/* Footer - Hidden on Print */}
        <div className="p-6 border-t border-slate-100 flex justify-between gap-3 bg-white print:hidden">
          <div className="flex gap-3">
            <button 
              onClick={handleEmailShare}
              className="px-6 py-2.5 text-slate-700 bg-white border border-slate-200 font-bold hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
            >
              <Mail className="w-4 h-4" />
              إرسال عبر الإيميل
            </button>
            <button 
              onClick={handleWhatsAppShare}
              className="px-6 py-2.5 text-white bg-green-600 font-bold hover:bg-green-700 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              إرسال عبر واتساب
            </button>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button 
              onClick={handleSave}
              disabled={!customerName.trim()}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              حفظ العرض
            </button>
          </div>
        </div>

      </div>
      
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
