export type RoleType = 'Owner' | 'Admin' | 'Staff' | 'Master' | 'VIP' | 'Müşteri';

export type SubscriptionTier = 'Free' | 'Plus' | 'Plus+';

export type DeliveryStatus = 'Beklemede' | 'İşlemde' | 'Tamamlandı' | 'İptal Edildi';

export type ProductCategory = 'Bot' | 'Website' | 'Service' | 'Software';

export interface AdminUser {
  id: string;
  username: string;
  discriminator: string;
  avatarUrl: string;
  email: string;
  role: RoleType;
  subscription: SubscriptionTier;
  balance: number;
  status: 'Aktif' | 'Kısıtlı' | 'Yasaklı';
  joinedDate: string;
  lastLogin: string;
  ipAddress: string;
  restrictionsNote?: string;
  panelAccess?: boolean;
  password?: string;
}

export interface ProductPeriodItem {
  price: number;
  periodLabel: string;
  originalPrice?: string;
  discountBadge?: string;
  isAvailable: boolean;
  statusBadge?: string;
  paytrUrl?: string;
}

export interface AdminProduct {
  id: string;
  originalId?: string; // e.g. "discord-full-pack"
  name: string;
  category: ProductCategory;
  price: number;
  discountPrice?: number;
  badge?: string;
  description: string;
  features: string[];
  status: 'Aktif' | 'Tükendi' | 'Gizli';
  salesCount: number;
  updatedAt: string;
  period?: string; // For standalone / single-period products e.g. "Aylık", "Tek Seferlik"
  paytrUrl?: string;
  periods?: {
    monthly?: ProductPeriodItem;
    quarterly?: ProductPeriodItem;
    'semi-annual'?: ProductPeriodItem;
    annual?: ProductPeriodItem;
  };
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerDiscord: string;
  customerEmail: string;
  productName: string;
  category: string;
  amount: number;
  paymentMethod: 'PayTR' | 'Bakiye' | 'Kredi Kartı' | 'Havale/EFT';
  status: DeliveryStatus;
  notes?: string;
  createdAt: string;
  deliveryTime?: string;
  history?: OrderHistoryEntry[];
  source?: 'site' | 'panel';
}

export interface OrderHistoryEntry {
  status: DeliveryStatus;
  at: string;
  by: string;
  note?: string;
}

export interface SecurityThreat {
  id: string;
  type: 'DDoS' | 'Rate Limit' | 'Brute Force' | 'SQLi/XSS' | 'Bot Spam' | 'Yetkisiz Erişim';
  sourceIp: string;
  targetPath: string;
  severity: 'Kritik' | 'Yüksek' | 'Orta' | 'Düşük';
  status: 'Engellendi' | 'İnceleniyor' | 'İzole Edildi';
  timestamp: string;
  mitigation: string;
}

export interface SecurityBan {
  id: string;
  targetType: 'ip' | 'user';
  targetValue: string;
  targetName?: string;
  reason: string;
  bannedBy: string;
  duration: '1 saat' | '24 saat' | '7 gün' | 'Kalıcı';
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface AdminPin {
  id: string;
  pin: string; // 6-digit or custom formatted PIN (e.g. 'WSP-894', 'VOID64')
  targetApp: string;
  maxUses: number;
  currentUses: number;
  status: 'Aktif' | 'Kullanıldı' | 'Süresi Doldu' | 'İptal';
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  assignedUser?: string;
  note?: string;
  usageLog?: { at: string; ip: string }[];
}

export type AuditCategory = 'ürün' | 'sipariş' | 'kullanıcı' | 'pin' | 'güvenlik' | 'finans' | 'sistem' | 'yetki';

export interface AuditEntry {
  id: string;
  at: string;
  staff: string;
  action: string;
  details: string;
  category: AuditCategory;
}

export interface AdminNotification {
  id: string;
  at: string;
  title: string;
  message: string;
  kind: 'order' | 'user' | 'pin' | 'security' | 'system';
  read: boolean;
}

export interface ServerHealth {
  ok: boolean;
  latencyMs: number;
  cpuPercent: number;
  memUsedPercent: number;
  memUsedMb: number;
  memTotalMb: number;
  uptimeSec: number;
  nodeVersion: string;
  cores: number;
  platform: string;
  siteOrders: number;
  pinsCount: number;
  discordWebhook: boolean;
  latencyHistory: number[];
}

export interface FinanceTransaction {
  id: string;
  userId: string;
  userName: string;
  type: 'add' | 'deduct' | 'purchase' | 'refund';
  amount: number;
  previousBalance: number;
  newBalance: number;
  reason: string;
  staffName: string;
  timestamp: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalLogins: number;
  newAccountsToday: number;
  blockedAttacks: number;
  activePins: number;
  conversionRate: number;
}
