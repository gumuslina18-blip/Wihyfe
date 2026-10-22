export interface AdminOrder {
  id: string; // e.g. '#WSP-8419'
  customerDiscord: string; // e.g. 'Gumus#0001'
  customerDiscordId?: string;
  customerEmail: string;
  serverId: string;
  serverName: string;
  packageName: string;
  periodLabel: string; // 'Aylık', '3 Aylık', '6 Aylık', 'Yıllık'
  periodKey: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  price: string;
  numericPrice: number;
  paytrUrl?: string;
  status: 'pending_paytr' | 'active' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

export interface AdminTicket {
  id: string;
  customerName: string;
  customerDiscordId?: string;
  customerEmail?: string;
  subject: string;
  category: 'Ödeme & Fatura' | 'Kurulum Destek' | 'Özel Bot Talebi' | 'Teknik Sorun';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt?: string;
  lastReplyBy?: string;
  messages: Array<{
    id?: string;
    sender: string;
    isStaff: boolean;
    text: string;
    timestamp: string;
  }>;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  staffName: string;
  action: string;
  details: string;
  type: 'order' | 'pricing' | 'ticket' | 'auth' | 'system';
}

export interface PackagePeriodConfig {
  periodKey: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  label: string;
  isAvailable: boolean;
  statusBadge?: string;
  discountBadge?: string;
  paytrUrl?: string;
}

export interface AdminPackageSetting {
  id: string;
  name: string;
  badge?: string;
  monthlyPrice: string;
  periods: Record<string, { isAvailable: boolean; statusBadge?: string; paytrUrl?: string }>;
}

export const ADMIN_CONFIG = {
  // Authorized Discord User IDs
  authorizedDiscordIds: [
    '1557022423625371688', // Primary Client ID
    // Add additional staff Discord snowflake IDs here
  ],

  // Master Passcode for staff access
  masterPasscode: process.env.ADMIN_SECRET_KEY || 'Aa0090.0090',

  // System stats
  systemStatus: {
    gateway: 'Hazır',
    botApi: 'Aktif',
    paytrWebhook: '6 Paket Linki Tanımlı',
    database: 'Hazır',
  },
};

export const INITIAL_ADMIN_ORDERS: AdminOrder[] = [];

export const INITIAL_ADMIN_TICKETS: AdminTicket[] = [];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [];

