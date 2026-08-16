import { Campaign, Lead, User, Video } from './types';

export const currentUser: User = {
  id: '1',
  name: 'أحمد عبدالله',
  email: 'ahmed@business.com',
  role: 'business',
};

export const mockCampaigns: Campaign[] = [
  { id: '1', name: 'عرض تبييض الأسنان', budget: 500, spent: 420, leads: 120, status: 'active', startDate: '2026-08-01' },
  { id: '2', name: 'عروض رمضان', budget: 300, spent: 300, leads: 80, status: 'completed', startDate: '2026-03-01' },
  { id: '3', name: 'ابتسامة هوليود', budget: 1000, spent: 150, leads: 45, status: 'active', startDate: '2026-08-03' },
];

export const mockLeads: Lead[] = [
  { id: '101', name: 'محمد علي', phone: '0791234567', source: 'WhatsApp', status: 'new', campaignId: '1', createdAt: '2026-08-05T09:00:00Z', assignedTo: 'محمد علي' },
  { id: '102', name: 'سارة خالد', phone: '0797654321', source: 'WhatsApp', status: 'new', campaignId: '1', createdAt: '2026-08-05T10:15:00Z', assignedTo: 'سامر قاسم' },
  { id: '103', name: 'أحمد حسن', phone: '0781112223', source: 'Call', status: 'contacted', campaignId: '2', createdAt: '2026-08-04T14:30:00Z', assignedTo: 'رانيا العبدالله' },
  { id: '104', name: 'خالد يوسف', phone: '0779998887', source: 'Booking', status: 'appointment', campaignId: '1', createdAt: '2026-08-03T11:00:00Z', assignedTo: 'حمزة الشريف' },
  { id: '105', name: 'ريم سعيد', phone: '0794445556', source: 'WhatsApp', status: 'won', campaignId: '1', createdAt: '2026-08-01T16:45:00Z', assignedTo: 'فرح الزعبي' },
];

export const performanceData = [
  { name: 'الأحد', المشاهدات: 4000, العملاء: 24, المبيعات: 2 },
  { name: 'الإثنين', المشاهدات: 3000, العملاء: 13, المبيعات: 1 },
  { name: 'الثلاثاء', المشاهدات: 2000, العملاء: 98, المبيعات: 4 },
  { name: 'الأربعاء', المشاهدات: 2780, العملاء: 39, المبيعات: 2 },
  { name: 'الخميس', المشاهدات: 1890, العملاء: 48, المبيعات: 3 },
  { name: 'الجمعة', المشاهدات: 2390, العملاء: 38, المبيعات: 2 },
  { name: 'السبت', المشاهدات: 3490, العملاء: 43, المبيعات: 4 },
];

export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'نصائح لأسنان صحية',
    platform: 'youtube',
    url: 'https://youtube.com',
    thumbnail: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
    views: 50000,
    leads: 230,
    sales: 15,
    creator: 'Ahmed Media'
  },
  {
    id: '2',
    title: 'تبييض الأسنان بالليزر',
    platform: 'tiktok',
    url: 'https://tiktok.com',
    thumbnail: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80',
    views: 85000,
    leads: 420,
    sales: 18,
    creator: 'Dr. Smile'
  },
  {
    id: '3',
    title: 'مراجعة خيط الأسنان المائي',
    platform: 'instagram',
    url: 'https://instagram.com',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    views: 32000,
    leads: 180,
    sales: 12,
    creator: 'Sara Dental'
  },
  {
    id: '4',
    title: 'فيديو توعوي: العناية بأسنان الأطفال',
    platform: 'facebook',
    url: 'https://facebook.com',
    thumbnail: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&auto=format&fit=crop&q=80',
    views: 64000,
    leads: 310,
    sales: 22,
    creator: 'العيادة النموذجية - فيسبوك'
  },
  {
    id: '5',
    title: 'سناب حصرى: عروض ابتسامة هوليود',
    platform: 'snapchat',
    url: 'https://snapchat.com',
    thumbnail: 'https://images.unsplash.com/photo-1598256989800-fea5f6c8d0a3?w=600&auto=format&fit=crop&q=80',
    views: 41000,
    leads: 290,
    sales: 27,
    creator: 'Smile Snapchat'
  }
];

export const regionData = [
  { name: 'عمان', leads: 100 },
  { name: 'إربد', leads: 40 },
  { name: 'الزرقاء', leads: 60 }
];

export const creatorData = [
  { name: 'Creator A', views: 100000, leads: 500 },
  { name: 'Creator B', views: 50000, leads: 700 }
];
