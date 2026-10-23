import {
  AdminUser,
  AdminProduct,
  AdminOrder,
  SecurityThreat,
  SecurityBan,
  AdminPin,
  FinanceTransaction,
} from '@/types/admin';
import { SITE_CONFIG, getAllBotProducts } from '@/config/site';

// 100% Real users: Only actual site staff/owner (lunaalvine & Gumus). No fabricated demo users.
export const INITIAL_USERS: AdminUser[] = [
  {
    id: 'usr_lunaalvine',
    username: 'lunaalvine',
    discriminator: '0001',
    avatarUrl: '/team/lunaalvine.jpg',
    email: 'lunaalvine@wihyfe.com',
    role: 'Owner',
    subscription: 'Plus+',
    balance: 0,
    status: 'Aktif',
    joinedDate: '17.10.2026',
    lastLogin: 'Çevrimiçi',
    ipAddress: '127.0.0.1 (Yetkili)',
    panelAccess: true,
  },
  {
    id: 'usr_gumus',
    username: 'Gumus',
    discriminator: '1907',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
    email: 'gumus@wihyfe.com',
    role: 'Admin',
    subscription: 'Plus+',
    balance: 0,
    status: 'Aktif',
    joinedDate: '17.10.2026',
    lastLogin: 'Çevrimiçi',
    ipAddress: '127.0.0.1 (Yetkili)',
    panelAccess: true,
  },
];

// Helper to convert formatted price string (e.g. "1.300,00" or "500,00" or "Özel Fiyat") to number
function parsePrice(priceStr?: string): number {
  if (!priceStr || priceStr.toLowerCase().includes('özel')) return 0;
  const clean = priceStr.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : Math.round(num);
}

// 100% Real products: Dynamically mapped from SITE_CONFIG (All real bots, standalone bots, and websites)
export const INITIAL_PRODUCTS: AdminProduct[] = [
  // 1. Packaged Bots, Panels & Apps (Aylık, 3 Aylık, 6 Aylık, Yıllık periyotlarıyla)
  ...getAllBotProducts().map((bot) => ({
    id: `prod_${bot.id}`,
    originalId: bot.id,
    name: bot.name,
    category: 'Bot' as const,
    price: parsePrice(bot.pricing.monthly.totalPrice),
    badge: bot.badge,
    description: bot.description,
    features: bot.features,
    status: 'Aktif' as const,
    salesCount: 0,
    updatedAt: new Date().toLocaleDateString('tr-TR'),
    period: 'Aylık',
    paytrUrl: bot.pricing.monthly.paytrUrl || '',
    periods: {
      monthly: {
        price: parsePrice(bot.pricing.monthly.totalPrice),
        periodLabel: 'Aylık',
        isAvailable: false,
        statusBadge: 'Yakında',
        paytrUrl: bot.pricing.monthly.paytrUrl || '',
      },
      quarterly: {
        price: parsePrice(bot.pricing.quarterly.totalPrice),
        periodLabel: '3 Aylık',
        originalPrice: bot.pricing.quarterly.originalPrice,
        discountBadge: bot.pricing.quarterly.discountBadge || '%10 İndirim',
        isAvailable: false,
        statusBadge: 'Yakında',
        paytrUrl: bot.pricing.quarterly.paytrUrl || '',
      },
      'semi-annual': {
        price: parsePrice(bot.pricing['semi-annual'].totalPrice),
        periodLabel: '6 Aylık',
        originalPrice: bot.pricing['semi-annual'].originalPrice,
        discountBadge: bot.pricing['semi-annual'].discountBadge || '%20 İndirim',
        isAvailable: false,
        statusBadge: 'Yakında',
        paytrUrl: bot.pricing['semi-annual'].paytrUrl || '',
      },
      annual: {
        price: parsePrice(bot.pricing.annual.totalPrice),
        periodLabel: 'Yıllık',
        originalPrice: bot.pricing.annual.originalPrice,
        discountBadge: bot.pricing.annual.discountBadge || '%35 İndirim',
        isAvailable: false,
        statusBadge: 'Yakında',
        paytrUrl: bot.pricing.annual.paytrUrl || '',
      },
    },
  })),

  // 2. Standalone Bots
  ...SITE_CONFIG.standaloneBots.map((bot) => ({
    id: `prod_${bot.id}`,
    originalId: bot.id,
    name: `${bot.name} Botu`,
    category: 'Bot' as const,
    price: parsePrice(bot.price),
    badge: bot.badge,
    description: bot.description,
    features: bot.features,
    status: 'Aktif' as const,
    salesCount: 0,
    updatedAt: new Date().toLocaleDateString('tr-TR'),
    period: bot.period || 'Aylık',
    paytrUrl: bot.paytrUrl || '',
  })),

  // 3. Websites
  ...SITE_CONFIG.websites.map((web) => ({
    id: `prod_${web.id}`,
    originalId: web.id,
    name: web.name,
    category: 'Website' as const,
    price: parsePrice(web.pricing.monthly.totalPrice),
    badge: web.badge,
    description: web.description,
    features: web.features,
    status: 'Aktif' as const,
    salesCount: 0,
    updatedAt: new Date().toLocaleDateString('tr-TR'),
    period: 'Aylık',
    paytrUrl: web.pricing.monthly.paytrUrl || '',
    periods: {
      monthly: {
        price: parsePrice(web.pricing.monthly.totalPrice),
        periodLabel: 'Aylık',
        isAvailable: false,
        statusBadge: 'Yakında',
        paytrUrl: web.pricing.monthly.paytrUrl || '',
      },
      quarterly: {
        price: parsePrice(web.pricing.quarterly.totalPrice),
        periodLabel: '3 Aylık',
        originalPrice: web.pricing.quarterly.originalPrice,
        discountBadge: web.pricing.quarterly.discountBadge || '%10 İndirim',
        isAvailable: false,
        statusBadge: 'Yakında',
        paytrUrl: web.pricing.quarterly.paytrUrl || '',
      },
      'semi-annual': {
        price: parsePrice(web.pricing['semi-annual'].totalPrice),
        periodLabel: '6 Aylık',
        originalPrice: web.pricing['semi-annual'].originalPrice,
        discountBadge: web.pricing['semi-annual'].discountBadge || '%20 İndirim',
        isAvailable: false,
        statusBadge: 'Yakında',
        paytrUrl: web.pricing['semi-annual'].paytrUrl || '',
      },
      annual: {
        price: parsePrice(web.pricing.annual.totalPrice),
        periodLabel: 'Yıllık',
        originalPrice: web.pricing.annual.originalPrice,
        discountBadge: web.pricing.annual.discountBadge || '%35 İndirim',
        isAvailable: false,
        statusBadge: 'Yakında',
        paytrUrl: web.pricing.annual.paytrUrl || '',
      },
    },
  })),
];

// 100% Real orders: Starts clean. Populated only when customers actually order.
export const INITIAL_ORDERS: AdminOrder[] = [];

// 100% Real PIN: Starts clean. PINs are only created manually by admin from the panel.
export const INITIAL_PINS: AdminPin[] = [];

// 100% Real threats: Starts clean. No fake attacks.
export const INITIAL_THREATS: SecurityThreat[] = [];

// 100% Real bans: Starts clean. No fake bans.
export const INITIAL_BANS: SecurityBan[] = [];

// 100% Real finance logs: Starts clean.
export const INITIAL_FINANCE_LOGS: FinanceTransaction[] = [];
