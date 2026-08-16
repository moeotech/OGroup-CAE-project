import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Plus, Search, Filter, MoreVertical, DollarSign, X, CheckCircle, Clock, Settings, Store, Globe, ExternalLink, Tag, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Commerce() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'inventory' | 'discounts'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingDiscount, setIsAddingDiscount] = useState(false);
  const [isSettingUpStore, setIsSettingUpStore] = useState(false);
  const [storeInfo, setStoreInfo] = useState({ name: 'متجري', currency: 'JOD', description: '' });
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '', commissionRate: '5' });
  const [newDiscount, setNewDiscount] = useState({ code: '', type: 'percentage', value: '', status: 'active' });

  const initialProducts = [
    { id: 1, name: 'باقة تبييض الأسنان المنزلي', price: 45, stock: 120, category: 'منتجات طبية', status: 'active', sales: 34, commissionRate: 5 },
    { id: 2, name: 'فرشاة كهربائية متطورة', price: 85, stock: 45, category: 'أدوات', status: 'active', sales: 128, commissionRate: 3 },
    { id: 3, name: 'غسول فم طبيعي', price: 15, stock: 0, category: 'عناية يومية', status: 'out_of_stock', sales: 412, commissionRate: 4 },
  ];

  const initialOrders = [
    { id: 'ORD-001', customer: 'محمد علي', items: 2, total: 130, date: '2026-08-08', status: 'delivered' },
    { id: 'ORD-002', customer: 'سارة خالد', items: 1, total: 45, date: '2026-08-08', status: 'processing' },
    { id: 'ORD-003', customer: 'أحمد محمود', items: 3, total: 145, date: '2026-08-07', status: 'shipped' },
  ];

  const initialDiscounts = [
    { id: 1, code: 'SUMMER26', type: 'percentage', value: 15, status: 'active', usageCount: 42 },
    { id: 2, code: 'WELCOME5', type: 'flat', value: 5, status: 'active', usageCount: 18 },
  ];

  const [products, setProducts] = useState<any[]>(initialProducts);
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [discounts, setDiscounts] = useState<any[]>(initialDiscounts);

  const [editingStockId, setEditingStockId] = useState<number | null>(null);
  const [editingStockValue, setEditingStockValue] = useState<number>(0);

  const [userCurrency, setUserCurrency] = useState('JOD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isLocating, setIsLocating] = useState(true);

  const rates = { JOD: 1, SAR: 5.3, AED: 5.18, EGP: 68.5, USD: 1.41 };
  const currencies = { JOD: 'د.أ', SAR: 'ر.س', AED: 'د.إ', EGP: 'ج.م', USD: '$' };

  useEffect(() => {
    // Simulate geo-location based on timezone
    const detectCurrency = () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        let detected = 'JOD';
        
        if (tz.includes('Riyadh') || tz.includes('Qatar') || tz.includes('Bahrain')) {
          detected = 'SAR';
        } else if (tz.includes('Dubai') || tz.includes('Muscat')) {
          detected = 'AED';
        } else if (tz.includes('Cairo')) {
          detected = 'EGP';
        } else if (tz.includes('America') || tz.includes('Europe')) {
          detected = 'USD';
        }

        setUserCurrency(detected);
        setExchangeRate(rates[detected as keyof typeof rates] || 1);
      } catch (e) {
        setUserCurrency('JOD');
        setExchangeRate(1);
      } finally {
        setIsLocating(false);
      }
    };
    
    // Simulate slight network delay for geo IP lookup
    const timer = setTimeout(detectCurrency, 600);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (priceInJOD: number) => {
    return (priceInJOD * exchangeRate).toLocaleString('ar-JO', { maximumFractionDigits: 2 }) + ' ' + (currencies[userCurrency as keyof typeof currencies] || userCurrency);
  };

  useEffect(() => {
    const stored = localStorage.getItem('crm_products');
    if (stored) {
      setProducts(JSON.parse(stored));
    }
    const storedDiscounts = localStorage.getItem('crm_discounts');
    if (storedDiscounts) {
      setDiscounts(JSON.parse(storedDiscounts));
    }
    const storedOrders = localStorage.getItem('crm_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      category: newProduct.category,
      commissionRate: Number(newProduct.commissionRate) || 5,
      status: Number(newProduct.stock) > 0 ? 'active' : 'out_of_stock',
      sales: 0
    };
    const updated = [product, ...products];
    setProducts(updated);
    localStorage.setItem('crm_products', JSON.stringify(updated));
    setIsAddingProduct(false);
    setNewProduct({ name: '', price: '', stock: '', category: '', commissionRate: '5' });
  };

  const updateProductCommission = (id: number, rate: number) => {
    const updated = products.map(p => p.id === id ? { ...p, commissionRate: rate } : p);
    setProducts(updated);
    localStorage.setItem('crm_products', JSON.stringify(updated));
  };

  const updateProductStatus = (id: number, status: string) => {
    const updated = products.map(p => p.id === id ? { ...p, status } : p);
    setProducts(updated);
    localStorage.setItem('crm_products', JSON.stringify(updated));
  };

  const handleUpdateStock = (id: number) => {
    const updated = products.map(p => 
      p.id === id 
        ? { ...p, stock: editingStockValue, status: editingStockValue > 0 ? (p.status === 'out_of_stock' ? 'active' : p.status) : 'out_of_stock' }
        : p
    );
    setProducts(updated);
    localStorage.setItem('crm_products', JSON.stringify(updated));
    setEditingStockId(null);
  };

  const updateOrderStatus = (id: string, status: string) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
  };

  const updateDiscountStatus = (id: number, status: string) => {
    const updated = discounts.map(d => d.id === id ? { ...d, status } : d);
    setDiscounts(updated);
    localStorage.setItem('crm_discounts', JSON.stringify(updated));
  };

  const handleAddDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = {
      id: Date.now(),
      code: newDiscount.code.toUpperCase(),
      type: newDiscount.type,
      value: Number(newDiscount.value),
      status: newDiscount.status,
      usageCount: 0
    };
    const updated = [discount, ...discounts];
    setDiscounts(updated);
    localStorage.setItem('crm_discounts', JSON.stringify(updated));
    setIsAddingDiscount(false);
    setNewDiscount({ code: '', type: 'percentage', value: '', status: 'active' });
  };

  const filteredProducts = products.filter(p => p.name.includes(searchTerm) || p.category.includes(searchTerm));
  const filteredOrders = orders.filter(o => o.customer.includes(searchTerm) || o.id.includes(searchTerm));
  const filteredDiscounts = discounts.filter(d => d.code.includes(searchTerm.toUpperCase()));

  const totalSales = products.reduce((acc, curr) => acc + (curr.price * curr.sales), 0);
  const totalOrders = orders.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{storeInfo.name}</h1>
          </div>
          <p className="text-slate-500 mt-2">إدارة المنتجات، المخزون، والطلبات المباشرة</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg transition-all" title="عملة العرض (تلقائي حسب الموقع)">
            {isLocating ? (
              <Clock className="w-4 h-4 text-slate-400 animate-spin" />
            ) : (
              <Globe className="w-4 h-4 text-blue-500" />
            )}
            <select 
              value={userCurrency}
              onChange={(e) => {
                const c = e.target.value;
                setUserCurrency(c);
                setExchangeRate(rates[c as keyof typeof rates] || 1);
              }}
              className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="JOD">دينار أردني (JOD)</option>
              <option value="SAR">ريال سعودي (SAR)</option>
              <option value="AED">درهم إماراتي (AED)</option>
              <option value="EGP">جنيه مصري (EGP)</option>
              <option value="USD">دولار أمريكي (USD)</option>
            </select>
          </div>

          <Link
            to="/store/my-store"
            className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2 shadow-sm"
          >
            <ExternalLink className="w-5 h-5" />
            عرض المتجر
          </Link>

          <button 
            onClick={() => setIsSettingUpStore(true)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Settings className="w-5 h-5" />
            إعداد المتجر
          </button>
          {activeTab === 'products' && (
            <button 
              onClick={() => setIsAddingProduct(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              إضافة منتج
            </button>
          )}
          {activeTab === 'discounts' && (
            <button 
              onClick={() => setIsAddingDiscount(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              إضافة كود خصم
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:border-blue-200 transition-colors" onClick={() => setActiveTab('orders')}>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">إجمالي الطلبات</p>
            <h3 className="text-xl font-bold text-slate-900">{totalOrders}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">المبيعات</p>
            <h3 className="text-xl font-bold text-slate-900">{formatPrice(totalSales)}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:border-blue-200 transition-colors" onClick={() => setActiveTab('products')}>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">المنتجات النشطة</p>
            <h3 className="text-xl font-bold text-slate-900">{products.filter(p => p.status === 'active').length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'products' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          المنتجات ({products.length})
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          الطلبات الأخيرة
        </button>
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'inventory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          لوحة المخزون
          {products.filter(p => p.stock <= 10).length > 0 && (
            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
              {products.filter(p => p.stock <= 10).length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('discounts')}
          className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'discounts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          أكواد الخصم
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={`ابحث عن ${activeTab === 'products' ? 'منتج' : activeTab === 'orders' ? 'طلب' : activeTab === 'discounts' ? 'كود خصم' : 'عنصر في المخزون'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            تصفية
          </button>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'products' && (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-slate-500 text-sm">
                  <th className="py-4 px-6 font-medium">المنتج</th>
                  <th className="py-4 px-6 font-medium">التصنيف</th>
                  <th className="py-4 px-6 font-medium">السعر</th>
                  <th className="py-4 px-6 font-medium">المخزون</th>
                  <th className="py-4 px-6 font-medium">نسبة العمولة (%)</th>
                  <th className="py-4 px-6 font-medium">المبيعات</th>
                  <th className="py-4 px-6 font-medium">الحالة</th>
                  <th className="py-4 px-6 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6 font-bold text-slate-900">{product.name}</td>
                    <td className="py-4 px-6 text-slate-500 text-sm">{product.category}</td>
                    <td className="py-4 px-6 font-bold text-slate-700">{formatPrice(product.price)}</td>
                    <td className="py-4 px-6 font-medium">
                      <span className={product.stock > 10 ? 'text-slate-700' : 'text-red-600'}>
                        {product.stock > 0 ? product.stock : 'نفذت الكمية'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-purple-700">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={product.commissionRate ?? 5}
                          onChange={(e) => updateProductCommission(product.id, Number(e.target.value))}
                          className="w-16 px-2 py-1 bg-purple-50 border border-purple-200 text-purple-800 rounded-lg text-xs font-bold text-center outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <span className="text-xs text-purple-600">%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500">{product.sales}</td>
                    <td className="py-4 px-6">
                      <select 
                        value={product.status}
                        onChange={(e) => updateProductStatus(product.id, e.target.value)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full outline-none cursor-pointer appearance-none ${
                          product.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}
                      >
                        <option value="active">نشط</option>
                        <option value="out_of_stock">غير متوفر</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-left">
                      <button className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'orders' && (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-slate-500 text-sm">
                  <th className="py-4 px-6 font-medium">رقم الطلب</th>
                  <th className="py-4 px-6 font-medium">العميل</th>
                  <th className="py-4 px-6 font-medium">التاريخ</th>
                  <th className="py-4 px-6 font-medium">المنتجات</th>
                  <th className="py-4 px-6 font-medium">الإجمالي</th>
                  <th className="py-4 px-6 font-medium">الحالة</th>
                  <th className="py-4 px-6 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6 font-mono font-bold text-slate-700">{order.id}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{order.customer}</td>
                    <td className="py-4 px-6 text-slate-500 text-sm">{order.date}</td>
                    <td className="py-4 px-6 text-slate-500">{order.items} عناصر</td>
                    <td className="py-4 px-6 font-bold text-slate-700">{formatPrice(order.total)}</td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full outline-none cursor-pointer appearance-none text-center ${
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                          order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                          'bg-amber-50 text-amber-600'
                        }`}
                      >
                        <option value="processing">قيد المعالجة</option>
                        <option value="shipped">تم الشحن</option>
                        <option value="delivered">مكتمل</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-left">
                      <button className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'inventory' && (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-slate-500 text-sm">
                  <th className="py-4 px-6 font-medium">المنتج</th>
                  <th className="py-4 px-6 font-medium">المخزون الحالي</th>
                  <th className="py-4 px-6 font-medium">الحالة</th>
                  <th className="py-4 px-6 font-medium">تنبيه إعادة الطلب</th>
                  <th className="py-4 px-6 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={`inv-${product.id}`} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6 font-bold text-slate-900">{product.name}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px]">
                          <div 
                            className={`h-2 rounded-full ${product.stock > 20 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-700">{product.stock} وحدة</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {product.stock <= 10 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-red-50 text-red-600">
                          <X className="w-3.5 h-3.5" /> مخزون منخفض
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-600">
                          <CheckCircle className="w-3.5 h-3.5" /> متوفر
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-sm">
                      عند وصول الكمية إلى 10
                    </td>
                    <td className="py-4 px-6 text-left">
                      {editingStockId === product.id ? (
                        <div className="flex items-center gap-2 justify-end">
                          <input
                            type="number"
                            min="0"
                            value={editingStockValue}
                            onChange={(e) => setEditingStockValue(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-center"
                          />
                          <button 
                            onClick={() => handleUpdateStock(product.id)}
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setEditingStockId(null)}
                            className="p-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setEditingStockId(product.id);
                            setEditingStockValue(product.stock);
                          }}
                          className="text-sm px-4 py-1.5 font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          تحديث الكمية
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'discounts' && (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-slate-500 text-sm">
                  <th className="py-4 px-6 font-medium">كود الخصم</th>
                  <th className="py-4 px-6 font-medium">النوع</th>
                  <th className="py-4 px-6 font-medium">القيمة</th>
                  <th className="py-4 px-6 font-medium">مرات الاستخدام</th>
                  <th className="py-4 px-6 font-medium">الحالة</th>
                  <th className="py-4 px-6 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredDiscounts.map((discount) => (
                  <tr key={discount.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      <span className="bg-slate-100 px-2 py-1 rounded-md">{discount.code}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {discount.type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                    </td>
                    <td className="py-4 px-6 font-bold text-blue-600">
                      {discount.type === 'percentage' ? `${discount.value}%` : formatPrice(discount.value)}
                    </td>
                    <td className="py-4 px-6 text-slate-500">{discount.usageCount} مرات</td>
                    <td className="py-4 px-6">
                      <select
                        value={discount.status}
                        onChange={(e) => updateDiscountStatus(discount.id, e.target.value)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full outline-none cursor-pointer appearance-none ${
                          discount.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <option value="active">نشط</option>
                        <option value="inactive">غير نشط</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-left">
                      <button className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isAddingProduct && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">إضافة منتج جديد</h2>
              <button 
                onClick={() => setIsAddingProduct(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-right">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">اسم المنتج</label>
                <input 
                  type="text" 
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">السعر (الأساسي JOD)</label>
                  <input 
                    type="number" 
                    required min="0" step="any"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">المخزون (وحدة)</label>
                  <input 
                    type="number" 
                    required min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">التصنيف</label>
                  <input 
                    type="text" 
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                    <span>نسبة العمولة (%)</span>
                    <span className="text-xs text-purple-600 font-normal">محددة لكل منتج</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      required min="0" max="100" step="0.5"
                      placeholder="مثال: 5"
                      value={newProduct.commissionRate}
                      onChange={(e) => setNewProduct({...newProduct, commissionRate: e.target.value})}
                      className="w-full pl-8 pr-4 py-2 bg-purple-50/50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-bold text-purple-900"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 font-bold text-xs">%</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  إضافة المنتج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddingDiscount && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-6 h-6 text-indigo-600" />
                إضافة كود خصم
              </h2>
              <button 
                onClick={() => setIsAddingDiscount(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDiscount} className="space-y-4 text-right">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">كود الخصم</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: SUMMER26"
                  value={newDiscount.code}
                  onChange={(e) => setNewDiscount({...newDiscount, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">نوع الخصم</label>
                  <select 
                    value={newDiscount.type}
                    onChange={(e) => setNewDiscount({...newDiscount, type: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="flat">مبلغ ثابت</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">القيمة</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      required min="0" step="any"
                      value={newDiscount.value}
                      onChange={(e) => setNewDiscount({...newDiscount, value: e.target.value})}
                      className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {newDiscount.type === 'percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الحالة</label>
                <select 
                  value={newDiscount.status}
                  onChange={(e) => setNewDiscount({...newDiscount, status: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddingDiscount(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                  إضافة الكود
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSettingUpStore && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Store className="w-6 h-6 text-indigo-600" />
                إعدادات المتجر
              </h2>
              <button 
                onClick={() => setIsSettingUpStore(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsSettingUpStore(false); }} className="space-y-4 text-right">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">اسم المتجر</label>
                <input 
                  type="text" 
                  value={storeInfo.name}
                  onChange={(e) => setStoreInfo({...storeInfo, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">وصف المتجر (يظهر للعملاء)</label>
                <textarea 
                  rows={3}
                  value={storeInfo.description}
                  onChange={(e) => setStoreInfo({...storeInfo, description: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">العملة الأساسية للمتجر (التسعير)</label>
                <select 
                  value={storeInfo.currency}
                  onChange={(e) => setStoreInfo({...storeInfo, currency: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="JOD">دينار أردني (JOD)</option>
                  <option value="SAR">ريال سعودي (SAR)</option>
                  <option value="AED">درهم إماراتي (AED)</option>
                  <option value="USD">دولار أمريكي (USD)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsSettingUpStore(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  حفظ الإعدادات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
