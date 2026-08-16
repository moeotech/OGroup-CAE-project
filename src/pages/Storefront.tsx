import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Package, Search, Plus, Minus, ArrowRight, CheckCircle, Tag, X } from 'lucide-react';

export default function Storefront() {
  const { storeId } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<{product: any, quantity: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form'>('cart');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [discountError, setDiscountError] = useState('');
  
  const [userCurrency, setUserCurrency] = useState('JOD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const rates = { JOD: 1, SAR: 5.3, AED: 5.18, EGP: 68.5, USD: 1.41 };
  const currencies = { JOD: 'د.أ', SAR: 'ر.س', AED: 'د.إ', EGP: 'ج.م', USD: '$' };

  useEffect(() => {
    const stored = localStorage.getItem('crm_products');
    if (stored) {
      setProducts(JSON.parse(stored).filter((p: any) => p.status === 'active' && p.stock > 0));
    } else {
      setProducts([
        { id: 1, name: 'باقة تبييض الأسنان المنزلي', price: 45, stock: 120, category: 'منتجات طبية', status: 'active' },
        { id: 2, name: 'فرشاة كهربائية متطورة', price: 85, stock: 45, category: 'أدوات', status: 'active' },
      ]);
    }

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      let detected = 'JOD';
      if (tz.includes('Riyadh') || tz.includes('Qatar') || tz.includes('Bahrain')) detected = 'SAR';
      else if (tz.includes('Dubai') || tz.includes('Muscat')) detected = 'AED';
      else if (tz.includes('Cairo')) detected = 'EGP';
      else if (tz.includes('America') || tz.includes('Europe')) detected = 'USD';

      setUserCurrency(detected);
      setExchangeRate(rates[detected as keyof typeof rates] || 1);
    } catch (e) {
      setUserCurrency('JOD');
    }
  }, []);

  const formatPrice = (priceInJOD: number) => {
    return (priceInJOD * exchangeRate).toLocaleString('ar-JO', { maximumFractionDigits: 2 }) + ' ' + (currencies[userCurrency as keyof typeof currencies] || userCurrency);
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const discountAmount = appliedDiscount ? 
    (appliedDiscount.type === 'percentage' ? (cartTotal * (appliedDiscount.value / 100)) : appliedDiscount.value)
    : 0;
  
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const applyDiscount = () => {
    const storedDiscounts = localStorage.getItem('crm_discounts');
    setDiscountError('');
    if (storedDiscounts) {
      const discounts = JSON.parse(storedDiscounts);
      const discount = discounts.find((d: any) => d.code === discountCode.toUpperCase() && d.status === 'active');
      if (discount) {
        setAppliedDiscount(discount);
        setDiscountCode('');
      } else {
        setDiscountError('كود الخصم غير صحيح أو غير فعال');
      }
    } else {
      setDiscountError('كود الخصم غير صحيح أو غير فعال');
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) return;

    // Save to CRM leads
    const storedLeads = localStorage.getItem('crm_leads');
    const leads = storedLeads ? JSON.parse(storedLeads) : [];
    const newLead = {
      id: Date.now().toString(),
      name: customerInfo.name,
      phone: customerInfo.phone,
      source: 'Storefront',
      status: 'new',
      campaignId: 'store',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('crm_leads', JSON.stringify([newLead, ...leads]));

    const storedOrders = localStorage.getItem('crm_orders');
    const existingOrders = storedOrders ? JSON.parse(storedOrders) : [
      { id: 'ORD-001', customer: 'محمد علي', items: 2, total: 130, date: '2026-08-08', status: 'delivered' },
      { id: 'ORD-002', customer: 'سارة خالد', items: 1, total: 45, date: '2026-08-08', status: 'processing' },
      { id: 'ORD-003', customer: 'أحمد محمود', items: 3, total: 145, date: '2026-08-07', status: 'shipped' }
    ];
    
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customer: customerInfo.name,
      items: cart.reduce((sum, item) => sum + item.quantity, 0),
      total: finalTotal,
      date: new Date().toISOString().split('T')[0],
      status: 'processing'
    };
    
    localStorage.setItem('crm_orders', JSON.stringify([newOrder, ...existingOrders]));

    // Update product stock
    const storedProducts = localStorage.getItem('crm_products');
    if (storedProducts) {
      const allProducts = JSON.parse(storedProducts);
      const updatedProducts = allProducts.map((p: any) => {
        const cartItem = cart.find(item => item.product.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, p.stock - cartItem.quantity);
          return {
            ...p,
            stock: newStock,
            sales: (p.sales || 0) + cartItem.quantity,
            status: newStock === 0 ? 'out_of_stock' : p.status
          };
        }
        return p;
      });
      localStorage.setItem('crm_products', JSON.stringify(updatedProducts));
    }

    // Optionally update usage count
    if (appliedDiscount) {
      const storedDiscounts = localStorage.getItem('crm_discounts');
      if (storedDiscounts) {
        const discounts = JSON.parse(storedDiscounts);
        const updated = discounts.map((d: any) => d.id === appliedDiscount.id ? { ...d, usageCount: d.usageCount + 1 } : d);
        localStorage.setItem('crm_discounts', JSON.stringify(updated));
      }
    }
    
    setOrderPlaced(true);
    setCart([]);
    setAppliedDiscount(null);
    setCustomerInfo({ name: '', phone: '', address: '' });
    setCheckoutStep('cart');
    setTimeout(() => setOrderPlaced(false), 3000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">تم تأكيد الطلب بنجاح!</h1>
          <p className="text-slate-500 mb-8">سنتواصل معك قريباً لتأكيد تفاصيل الشحن.</p>
          <button 
            onClick={() => setOrderPlaced(false)}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            العودة للمتجر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/commerce" className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors hidden md:block">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">{storeId === 'my-store' ? 'متجري' : storeId}</h1>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">اكتشف منتجاتنا المميزة</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">أفضل المنتجات بأفضل الأسعار، مختارة بعناية لتناسب احتياجاتك.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
              <div className="aspect-square bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-slate-300">
                <Package className="w-16 h-16" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-2 inline-block">
                  {product.category}
                </span>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{product.name}</h3>
                <p className="text-xl font-black text-slate-900">{formatPrice(product.price)}</p>
              </div>
              <button 
                onClick={() => addToCart(product)}
                className="mt-4 w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة للسلة
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                سلة المشتريات
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {checkoutStep === 'cart' ? (
                cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
                    <p className="font-medium text-lg">السلة فارغة</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.product.id} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                        <Package className="w-8 h-8 text-slate-300" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 line-clamp-1">{item.product.name}</h4>
                          <p className="text-blue-600 font-bold">{formatPrice(item.product.price)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-lg mb-4">بيانات العميل</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الاسم الكامل *</label>
                    <input 
                      type="text" 
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="محمد علي"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">رقم الهاتف *</label>
                    <input 
                      type="tel" 
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="0791234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">عنوان التوصيل</label>
                    <textarea 
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-24"
                      placeholder="عمان، شارع مكة..."
                    ></textarea>
                  </div>
                </form>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
                
                {/* Discount Section */}
                {!appliedDiscount ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text"
                          placeholder="كود الخصم"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          className="w-full pl-3 pr-9 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono text-sm"
                        />
                      </div>
                      <button 
                        onClick={applyDiscount}
                        disabled={!discountCode.trim()}
                        className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors"
                      >
                        تطبيق
                      </button>
                    </div>
                    {discountError && <p className="text-red-500 text-xs font-bold">{discountError}</p>}
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Tag className="w-4 h-4" />
                      <div>
                        <p className="text-sm font-bold">تم تطبيق كود {appliedDiscount.code}</p>
                        <p className="text-xs opacity-80">
                          خصم {appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}%` : formatPrice(appliedDiscount.value)}
                        </p>
                      </div>
                    </div>
                    <button onClick={removeDiscount} className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 text-sm">
                    <span>المجموع الفرعي</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex items-center justify-between text-emerald-600 text-sm font-bold">
                      <span>الخصم</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-900 font-bold">الإجمالي</span>
                    <span className="text-2xl font-black text-slate-900">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {checkoutStep === 'cart' ? (
                  <button 
                    onClick={() => setCheckoutStep('form')}
                    className="w-full py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mt-4"
                  >
                    متابعة الدفع
                  </button>
                ) : (
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => setCheckoutStep('cart')}
                      className="flex-1 py-4 bg-slate-100 text-slate-700 text-lg font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      عودة
                    </button>
                    <button 
                      type="submit"
                      form="checkout-form"
                      className="flex-[2] py-4 bg-emerald-600 text-white text-lg font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                    >
                      تأكيد الطلب
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
