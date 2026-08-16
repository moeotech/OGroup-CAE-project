export type Role = 'business' | 'creator' | 'sales' | 'sales_manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Campaign {
  id: string;
  name: string;
  budget: number;
  spent: number;
  leads: number;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'appointment' | 'won' | 'lost';
  campaignId: string;
  createdAt: string;
  assignedTo?: string;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  role: 'مدير مبيعات' | 'مسؤول مبيعات' | 'مستشار حجز' | 'مسؤول متجر' | string;
  isManager?: boolean;
  managerId?: string | null;
  managerName?: string | null;
  specialtyChannel: string;
  monthlyTarget: number;
  dailyLimit: number;
  status: 'active' | 'suspended';
  isOnline: boolean;
  activeLeads?: number;
  totalLeads?: number;
  convertedLeads?: number;
  currentSales?: number;
  avatar?: string;
}

export interface MetricCard {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
  trendUp?: boolean;
}

export interface Video {
  id: string;
  title: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'snapchat' | 'twitter' | 'linkedin' | 'website' | string;
  url: string;
  thumbnail: string;
  views: number;
  leads: number;
  sales: number;
  creator: string;
  companyPromoUrl?: string;
  creatorPortfolioUrl?: string;
}
