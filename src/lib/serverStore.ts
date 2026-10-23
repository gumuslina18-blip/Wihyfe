import fs from 'fs';
import path from 'path';
import { AdminOrder, AdminTicket, AdminAuditLog } from '@/config/admin';
import { CustomerBot, CustomerLicense } from '@/config/customer';
import { SITE_CONFIG, getAllBotProducts } from '@/config/site';
import { FinanceTransaction } from '@/types/admin';

export interface PackagePeriodConfigState {
  isAvailable: boolean;
  statusBadge?: string;
  paytrUrl?: string;
  customPrice?: string;
}

export interface DepositRequest {
  id: string; // e.g. "DEP-4343"
  userId: string;
  userName: string;
  userEmail?: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CouponRecord {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  description?: string;
}

export interface UserRecord {
  id: string; // e.g. Discord ID or user id
  username: string;
  discriminator?: string;
  avatarUrl?: string;
  email?: string;
  tier: 'Free' | 'Plus' | 'Plus+';
  role?: string;
  balance: number;
  transactions: Array<{
    id: string;
    date: string;
    type: 'deposit' | 'spend';
    amount: number;
    amountFormatted: string;
    description: string;
    status: 'Tamamlandı' | 'Beklemede' | 'İptal';
    paymentMethod?: string;
  }>;
  orders?: any[];
  phone?: string;
  company?: string;
  notifications?: {
    email: boolean;
    sms: boolean;
    discord: boolean;
  };
  twoFactorEnabled?: boolean;
  serversCount?: number;
  activeBotsCount?: number;
  guilds?: any[];
  referral?: {
    code: string;
    referredBy?: string;
    referredUsersCount: number;
    totalEarned: number;
    history: Array<{
      id: string;
      date: string;
      userName: string;
      commissionAmount: number;
      orderAmount: number;
    }>;
  };
  joinedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  password?: string;
  panelAccess?: boolean;
}

export interface EndOfDayReport {
  id: string; // e.g. "Z-20261018-01"
  date: string; // "18.10.2026"
  periodStart: string; // "18.10.2026 00:00"
  closedAt: string; // "18.10.2026 14:15"
  closedBy: string; // "Luna (Owner)"
  metrics: {
    totalRevenue: number;
    totalRevenueFormatted: string;
    ordersCount: number;
    completedOrdersCount: number;
    pendingOrdersCount: number;
    cancelledOrdersCount: number;
    depositsTotal: number;
    depositsCount: number;
    ticketsOpened: number;
    ticketsResolved: number;
    newUsersCount: number;
    newPinsCount: number;
  };
  highlights: {
    topProduct: string;
    topCustomer: string;
    largestOrderAmount: number;
  };
  orderIds: string[];
  notes?: string;
}

export interface WispGlobalStore {
  orders: AdminOrder[];
  tickets: AdminTicket[];
  logs: AdminAuditLog[];
  customerBots: CustomerBot[];
  customerLicenses: CustomerLicense[];
  packageConfig: Record<string, Record<string, PackagePeriodConfigState>>;
  pins?: any[];
  productOverrides?: Record<string, any>;
  depositRequests?: DepositRequest[];
  users?: Record<string, UserRecord>;
  financeLogs?: FinanceTransaction[];
  coupons?: CouponRecord[];
  endOfDayReports?: EndOfDayReport[];
  lastEndOfDayTimestamp?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __wispStore: WispGlobalStore | undefined;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

export function initializePackageConfig(): Record<string, Record<string, PackagePeriodConfigState>> {
  const config: Record<string, Record<string, PackagePeriodConfigState>> = {};
  getAllBotProducts().forEach((bot) => {
    config[bot.id] = {
      monthly: {
        isAvailable: true,
        paytrUrl: bot.pricing.monthly.paytrUrl || '',
        customPrice: bot.pricing.monthly.totalPrice,
      },
      quarterly: {
        isAvailable: false,
        statusBadge: 'Yakında',
        paytrUrl: bot.pricing.quarterly.paytrUrl || '',
        customPrice: bot.pricing.quarterly.totalPrice,
      },
      'semi-annual': {
        isAvailable: false,
        statusBadge: 'Yakında',
        paytrUrl: bot.pricing['semi-annual'].paytrUrl || '',
        customPrice: bot.pricing['semi-annual'].totalPrice,
      },
      annual: {
        isAvailable: false,
        statusBadge: 'Yakında',
        paytrUrl: bot.pricing.annual.paytrUrl || '',
        customPrice: bot.pricing.annual.totalPrice,
      },
    };
  });
  return config;
}

function loadStoreFromFile(): WispGlobalStore {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      const defaults = initializePackageConfig();
      const loadedConfig: Record<string, Record<string, PackagePeriodConfigState>> = { ...defaults };

      if (parsed.packageConfig) {
        Object.keys(parsed.packageConfig).forEach((botId) => {
          loadedConfig[botId] = {
            ...(defaults[botId] || {}),
            ...(parsed.packageConfig[botId] || {}),
          };
        });
      }

      return {
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
        tickets: Array.isArray(parsed.tickets) ? parsed.tickets : [],
        logs: Array.isArray(parsed.logs) ? parsed.logs : [],
        customerBots: Array.isArray(parsed.customerBots) ? parsed.customerBots : [],
        customerLicenses: Array.isArray(parsed.customerLicenses) ? parsed.customerLicenses : [],
        packageConfig: loadedConfig,
        pins: Array.isArray(parsed.pins)
          ? parsed.pins.filter((p: any) => p.id !== 'pin_default_void64' && p.pin !== 'VOID64')
          : [],
        productOverrides: typeof parsed.productOverrides === 'object' && parsed.productOverrides ? parsed.productOverrides : {},
        depositRequests: Array.isArray(parsed.depositRequests) ? parsed.depositRequests : [],
        users: typeof parsed.users === 'object' && parsed.users !== null ? parsed.users : {},
      };
    }
  } catch (err) {
    console.error('Failed to load store from file:', err);
  }

  const initial: WispGlobalStore = {
    orders: [],
    tickets: [],
    logs: [],
    customerBots: [],
    customerLicenses: [],
    packageConfig: initializePackageConfig(),
    pins: [],
    productOverrides: {},
    depositRequests: [],
    users: {},
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing initial store:', e);
  }

  return initial;
}

if (!globalThis.__wispStore) {
  globalThis.__wispStore = loadStoreFromFile();
}

export const serverStore: WispGlobalStore = globalThis.__wispStore;

export function reloadStore(): WispGlobalStore {
  const fresh = loadStoreFromFile();
  // Clear keys and reassign to keep exact same object reference
  for (const key of Object.keys(serverStore)) {
    delete (serverStore as any)[key];
  }
  Object.assign(serverStore, fresh);
  globalThis.__wispStore = serverStore;
  return serverStore;
}

export function saveStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(serverStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store to file:', err);
  }
}

export function getUserRecord(identifier?: string): UserRecord | undefined {
  if (!identifier) return undefined;
  reloadStore();
  const users = serverStore.users || {};
  if (users[identifier]) return users[identifier];

  const lower = identifier.toLowerCase();

  // Special alias mapping: 'lunaalvine', 'usr_lunaalvine', 'luna', 'gumuslina18@gmail.com'
  if (
    lower === 'usr_lunaalvine' ||
    lower === 'lunaalvine' ||
    lower === 'luna' ||
    lower === 'gumuslina18@gmail.com'
  ) {
    if (users['181209570092384257']) return users['181209570092384257'];
  }

  const foundKey = Object.keys(users).find((k) => {
    const u = users[k];
    return (
      u.id === identifier ||
      (u.username && u.username.toLowerCase() === lower) ||
      (u.email && u.email.toLowerCase() === lower)
    );
  });
  return foundKey ? users[foundKey] : undefined;
}

export function saveUserRecord(userData: Partial<UserRecord> & { id: string; username: string }): UserRecord {
  reloadStore();
  if (!serverStore.users) {
    serverStore.users = {};
  }

  const existing = getUserRecord(userData.id) || getUserRecord(userData.username);
  const now = new Date();
  const dateStamp = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  const record: UserRecord = {
    id: userData.id,
    username: userData.username,
    discriminator: userData.discriminator || existing?.discriminator || '',
    avatarUrl: userData.avatarUrl || existing?.avatarUrl || '',
    email: userData.email || existing?.email || '',
    tier: userData.tier || existing?.tier || 'Free',
    role: userData.role || existing?.role || 'Member',
    balance: typeof userData.balance === 'number' ? userData.balance : (existing?.balance ?? 0),
    transactions: Array.isArray(userData.transactions)
      ? userData.transactions
      : (existing?.transactions || []),
    orders: Array.isArray(userData.orders) ? userData.orders : (existing?.orders || []),
    phone: userData.phone !== undefined ? userData.phone : existing?.phone,
    company: userData.company !== undefined ? userData.company : existing?.company,
    notifications: userData.notifications || existing?.notifications || { email: true, sms: false, discord: true },
    twoFactorEnabled: userData.twoFactorEnabled !== undefined ? userData.twoFactorEnabled : (existing?.twoFactorEnabled ?? false),
    serversCount: typeof userData.serversCount === 'number' ? userData.serversCount : (existing?.serversCount ?? 0),
    activeBotsCount: typeof userData.activeBotsCount === 'number' ? userData.activeBotsCount : (existing?.activeBotsCount ?? 0),
    guilds: userData.guilds || existing?.guilds || [],
    joinedDate: userData.joinedDate || existing?.joinedDate || dateStamp,
    createdAt: existing?.createdAt || dateStamp,
    updatedAt: dateStamp,
  };

  serverStore.users[record.id] = record;
  saveStore();
  return record;
}

export function creditUserBalance(
  identifier: string,
  amount: number,
  description?: string,
  paymentMethod?: string
): UserRecord | null {
  reloadStore();
  const user = getUserRecord(identifier);
  if (!user) return null;

  const numAmount = Number(amount) || 0;
  if (numAmount <= 0) return user;

  const now = new Date();
  const dateStamp =
    now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' +
    now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  const tx = {
    id: `TX-${Date.now().toString().slice(-6)}`,
    date: dateStamp,
    type: 'deposit' as const,
    amount: numAmount,
    amountFormatted: `+${numAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`,
    description: description || 'Bakiye Yükleme (PayTR 3D Secure)',
    status: 'Tamamlandı' as const,
    paymentMethod: paymentMethod || 'PayTR 3D Secure',
  };

  user.balance = (user.balance || 0) + numAmount;
  if (!Array.isArray(user.transactions)) {
    user.transactions = [];
  }
  user.transactions.unshift(tx);
  user.updatedAt = dateStamp;

  if (!serverStore.users) {
    serverStore.users = {};
  }
  serverStore.users[user.id] = user;
  saveStore();
  return user;
}

export function modifyUserBalanceInStore({
  userId,
  amount,
  type,
  reason,
  staffName,
}: {
  userId: string;
  amount: number;
  type: 'add' | 'deduct';
  reason?: string;
  staffName?: string;
}): {
  success: boolean;
  user?: UserRecord;
  error?: string;
  previousBalance?: number;
  newBalance?: number;
  log?: any;
} {
  reloadStore();
  let user = getUserRecord(userId);
  if (!user && (userId.includes('luna') || userId.includes('gumuslina'))) {
    user = getUserRecord('181209570092384257');
  }

  if (!user) {
    return { success: false, error: `Kullanıcı bulunamadı: ${userId}` };
  }

  const numAmount = Math.abs(Number(amount));
  if (isNaN(numAmount) || numAmount <= 0) {
    return { success: false, error: 'Geçersiz tutar girdiniz.' };
  }

  const previousBalance = Number(user.balance) || 0;
  const newBalance =
    type === 'add' ? previousBalance + numAmount : Math.max(0, previousBalance - numAmount);
  user.balance = newBalance;

  const now = new Date();
  const dateStamp =
    now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' +
    now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  // Add transaction to user's history
  const tx = {
    id: `TX-${Date.now().toString().slice(-6)}`,
    date: dateStamp,
    type: type === 'add' ? ('deposit' as const) : ('spend' as const),
    amount: numAmount,
    amountFormatted: `${type === 'add' ? '+' : '-'}₺${numAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
    description: reason || (type === 'add' ? 'Yetkili Bakiye Tanımlaması' : 'Yetkili Bakiye Kesintisi'),
    status: 'Tamamlandı' as const,
    paymentMethod: 'Yetkili Panel',
  };
  if (!Array.isArray(user.transactions)) {
    user.transactions = [];
  }
  user.transactions.unshift(tx);
  user.updatedAt = dateStamp;

  // Add audit log
  if (!Array.isArray(serverStore.logs)) {
    serverStore.logs = [];
  }
  serverStore.logs.unshift({
    id: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp: dateStamp,
    staffName: staffName || 'Yetkili',
    action:
      type === 'add'
        ? `Bakiye Eklendi (+₺${numAmount.toLocaleString('tr-TR')})`
        : `Bakiye Silindi (-₺${numAmount.toLocaleString('tr-TR')})`,
    details: `${user.username} (${user.id}) | Önceki: ₺${previousBalance.toLocaleString('tr-TR')} -> Yeni: ₺${newBalance.toLocaleString('tr-TR')} | Neden: ${reason || 'Belirtilmedi'}`,
    type: 'auth',
  });

  // Add finance log
  const finLog: FinanceTransaction = {
    id: `fin_${Date.now()}`,
    userId: user.id,
    userName: user.username,
    type,
    amount: numAmount,
    previousBalance,
    newBalance,
    reason: reason || (type === 'add' ? 'Manuel bakiye eklemesi' : 'Manuel bakiye kesintisi'),
    staffName: staffName || 'Yetkili',
    timestamp: dateStamp,
  };

  if (!serverStore.financeLogs) {
    serverStore.financeLogs = [];
  }
  serverStore.financeLogs.unshift(finLog);

  if (!serverStore.users) {
    serverStore.users = {};
  }
  serverStore.users[user.id] = user;
  saveStore();

  return {
    success: true,
    user,
    previousBalance,
    newBalance,
    log: finLog,
  };
}

export function getAllUsersForAdmin() {
  reloadStore();
  const usersMap = serverStore.users || {};
  const list = Object.values(usersMap).map((u) => ({
    id: u.id,
    username: u.username,
    discriminator: u.discriminator?.replace(/^#/, '') || '0001',
    avatarUrl: u.avatarUrl || '/wihyfe-icon.png',
    email: u.email || '',
    role: (u.role || (u.id === '181209570092384257' ? 'Owner' : 'Müşteri')) as any,
    subscription: (u.tier === 'Plus+' ? 'Plus+' : u.tier === 'Plus' ? 'Plus' : 'Free') as any,
    balance: Number(u.balance) || 0,
    status: 'Aktif' as const,
    joinedDate: u.joinedDate || '17.10.2026',
    lastLogin: 'Çevrimiçi',
    ipAddress: '127.0.0.1 (Kayıtlı Kullanıcı)',
    panelAccess: u.role === 'Owner' || u.role === 'Admin' || u.id === '181209570092384257',
  }));

  // Ensure Gumus is also in the list for admin staff operations
  if (!list.some((u) => u.username.toLowerCase() === 'gumus')) {
    list.push({
      id: 'usr_gumus',
      username: 'Gumus',
      discriminator: '1907',
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
      email: 'gumus@wihyfe.com',
      role: 'Admin' as any,
      subscription: 'Plus+' as any,
      balance: 0,
      status: 'Aktif' as const,
      joinedDate: '17.10.2026',
      lastLogin: 'Çevrimiçi',
      ipAddress: '127.0.0.1 (Yetkili)',
      panelAccess: true,
    });
  }

  return list;
}

const DEFAULT_COUPONS: CouponRecord[] = [
  {
    id: 'CPN-WIHYFE20',
    code: 'WIHYFE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 100,
    maxUses: 1000,
    usedCount: 14,
    isActive: true,
    createdAt: '18.10.2026',
    description: '%20 Tüm Hizmetlerde Geçerli Özel İndirim',
  },
  {
    id: 'CPN-LUNA50',
    code: 'LUNA50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 200,
    maxUses: 500,
    usedCount: 28,
    isActive: true,
    createdAt: '18.10.2026',
    description: '₺50 Luna Özel Hediye Kuponu',
  },
  {
    id: 'CPN-HOSGELDIN',
    code: 'HOSGELDIN',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 50,
    maxUses: 2000,
    usedCount: 65,
    isActive: true,
    createdAt: '18.10.2026',
    description: '%15 Yeni Üye Hoş Geldin İndirimi',
  },
];

export function getCoupons(): CouponRecord[] {
  reloadStore();
  if (!Array.isArray(serverStore.coupons) || serverStore.coupons.length === 0) {
    serverStore.coupons = DEFAULT_COUPONS;
    saveStore();
  }
  return serverStore.coupons;
}

export function validateCoupon(
  code: string,
  cartTotal: number
): { valid: boolean; discountAmount: number; finalTotal: number; coupon?: CouponRecord; error?: string } {
  if (!code || typeof code !== 'string') {
    return { valid: false, discountAmount: 0, finalTotal: cartTotal, error: 'Kupon kodu giriniz.' };
  }

  const cleanCode = code.trim().toUpperCase();
  const coupons = getCoupons();
  const found = coupons.find((c) => c.code.toUpperCase() === cleanCode);

  if (!found) {
    return { valid: false, discountAmount: 0, finalTotal: cartTotal, error: 'Geçersiz kupon kodu.' };
  }

  if (!found.isActive) {
    return {
      valid: false,
      discountAmount: 0,
      finalTotal: cartTotal,
      error: 'Bu kuponun kullanım süresi dolmuş veya pasif.',
    };
  }

  if (found.maxUses && found.usedCount >= found.maxUses) {
    return {
      valid: false,
      discountAmount: 0,
      finalTotal: cartTotal,
      error: 'Bu kuponun kullanım limiti dolmuştur.',
    };
  }

  if (found.minOrderAmount && cartTotal < found.minOrderAmount) {
    return {
      valid: false,
      discountAmount: 0,
      finalTotal: cartTotal,
      error: `Bu kupon minimum ₺${found.minOrderAmount.toLocaleString('tr-TR')} sepet tutarında geçerlidir.`,
    };
  }

  let discountAmount = 0;
  if (found.discountType === 'percentage') {
    discountAmount = Math.round((cartTotal * found.discountValue) / 100);
  } else {
    discountAmount = Math.min(cartTotal, found.discountValue);
  }

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return {
    valid: true,
    discountAmount,
    finalTotal,
    coupon: found,
  };
}

export function saveCoupon(
  couponData: Partial<CouponRecord> & { code: string; discountValue: number }
): CouponRecord {
  const coupons = getCoupons();
  const cleanCode = couponData.code.trim().toUpperCase();
  const index = coupons.findIndex((c) => c.code.toUpperCase() === cleanCode || c.id === couponData.id);

  const record: CouponRecord = {
    id: couponData.id || `CPN-${cleanCode}`,
    code: cleanCode,
    discountType: couponData.discountType || 'percentage',
    discountValue: Number(couponData.discountValue) || 10,
    minOrderAmount: couponData.minOrderAmount ? Number(couponData.minOrderAmount) : 0,
    maxUses: couponData.maxUses ? Number(couponData.maxUses) : 1000,
    usedCount:
      typeof couponData.usedCount === 'number'
        ? couponData.usedCount
        : index !== -1
        ? coupons[index].usedCount
        : 0,
    isActive: couponData.isActive !== undefined ? couponData.isActive : true,
    createdAt: index !== -1 ? coupons[index].createdAt : new Date().toLocaleDateString('tr-TR'),
    description: couponData.description || 'Promosyon İndirim Kuponu',
  };

  if (index !== -1) {
    coupons[index] = record;
  } else {
    coupons.unshift(record);
  }

  serverStore.coupons = coupons;
  saveStore();
  return record;
}

export function deleteCoupon(idOrCode: string): boolean {
  const coupons = getCoupons();
  const clean = idOrCode.trim().toUpperCase();
  const filtered = coupons.filter((c) => c.id !== idOrCode && c.code.toUpperCase() !== clean);
  serverStore.coupons = filtered;
  saveStore();
  return true;
}

export function applyCouponUsage(code: string): boolean {
  const coupons = getCoupons();
  const clean = code.trim().toUpperCase();
  const found = coupons.find((c) => c.code.toUpperCase() === clean);
  if (found) {
    found.usedCount = (found.usedCount || 0) + 1;
    serverStore.coupons = coupons;
    saveStore();
    return true;
  }
  return false;
}

export function creditReferralCommission(
  referredUserId: string,
  orderAmount: number
): { credited: boolean; commission: number; referrerId?: string } {
  reloadStore();
  const referredUser = getUserRecord(referredUserId);

  if (!referredUser || !referredUser.referral?.referredBy) {
    return { credited: false, commission: 0 };
  }

  const referrerId = referredUser.referral.referredBy;
  const referrer = getUserRecord(referrerId);
  if (!referrer) return { credited: false, commission: 0 };

  // 10% commission rate
  const commission = Math.round(orderAmount * 0.1);
  if (commission <= 0) return { credited: false, commission: 0 };

  // Credit balance to referrer
  creditUserBalance(
    referrer.id,
    commission,
    `Referans Komisyonu (${referredUser.username} alışverişi: ₺${orderAmount.toLocaleString('tr-TR')})`,
    'Referans Sistemi (%10)'
  );

  // Update referrer's referral stats
  if (!referrer.referral) {
    referrer.referral = {
      code: referrer.username.toLowerCase(),
      referredUsersCount: 1,
      totalEarned: commission,
      history: [],
    };
  } else {
    referrer.referral.totalEarned = (referrer.referral.totalEarned || 0) + commission;
  }

  const dateStamp =
    new Date().toLocaleDateString('tr-TR') +
    ' ' +
    new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  if (!Array.isArray(referrer.referral.history)) {
    referrer.referral.history = [];
  }

  referrer.referral.history.unshift({
    id: `REF-${Date.now().toString().slice(-6)}`,
    date: dateStamp,
    userName: referredUser.username,
    commissionAmount: commission,
    orderAmount,
  });

  serverStore.users![referrer.id] = referrer;
  saveStore();
  return { credited: true, commission, referrerId: referrer.id };
}
