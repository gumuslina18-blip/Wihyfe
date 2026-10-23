export type PlanCategory = 'discord' | 'fivem' | 'panel' | 'website' | 'software' | 'free';

export interface ProductPlanTag {
  id: string;
  tag: string; // e.g. "Discord Full Pack - 1 Aylık"
  productName: string;
  periodLabel: string;
  category: PlanCategory;
  badgeColor: string;
  borderColor: string;
  textColor: string;
  panelType: 'discord' | 'fivem' | 'website' | 'software';
  icon: 'discord' | 'gamepad' | 'terminal' | 'globe' | 'shield' | 'code' | 'zap';
}

const PERIODS = [
  { label: '1 Aylık', key: '1m' },
  { label: '3 Aylık', key: '3m' },
  { label: '6 Aylık', key: '6m' },
  { label: '1 Yıllık', key: '1y' },
];

export const PRODUCT_PLAN_TAGS: ProductPlanTag[] = [
  // Standart / Free
  {
    id: 'tag-free',
    tag: 'Free / Standart Plan',
    productName: 'Standart Üyelik',
    periodLabel: 'Süresiz',
    category: 'free',
    badgeColor: 'rgba(148, 163, 184, 0.12)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
    textColor: '#94a3b8',
    panelType: 'discord',
    icon: 'zap',
  },

  // Discord Full Pack
  ...PERIODS.map((p) => ({
    id: `tag-dfp-${p.key}`,
    tag: `Discord Full Pack - ${p.label}`,
    productName: 'Discord Full Pack',
    periodLabel: p.label,
    category: 'discord' as PlanCategory,
    badgeColor: 'rgba(88, 101, 242, 0.18)',
    borderColor: 'rgba(88, 101, 242, 0.45)',
    textColor: '#818cf8',
    panelType: 'discord' as const,
    icon: 'discord' as const,
  })),

  // Fivem Full Pack
  ...PERIODS.map((p) => ({
    id: `tag-ffp-${p.key}`,
    tag: `Fivem Full Pack - ${p.label}`,
    productName: 'Fivem Full Pack',
    periodLabel: p.label,
    category: 'fivem' as PlanCategory,
    badgeColor: 'rgba(239, 68, 68, 0.18)',
    borderColor: 'rgba(239, 68, 68, 0.45)',
    textColor: '#f87171',
    panelType: 'fivem' as const,
    icon: 'shield' as const,
  })),

  // FiveM Oyun İçi Admin Paneli
  ...PERIODS.map((p) => ({
    id: `tag-fadm-${p.key}`,
    tag: `FiveM Oyun İçi Admin Paneli - ${p.label}`,
    productName: 'FiveM Oyun İçi Admin Paneli',
    periodLabel: p.label,
    category: 'panel' as PlanCategory,
    badgeColor: 'rgba(245, 158, 11, 0.18)',
    borderColor: 'rgba(245, 158, 11, 0.45)',
    textColor: '#fbbf24',
    panelType: 'fivem' as const,
    icon: 'gamepad' as const,
  })),

  // Discord Web Yönetim Paneli
  ...PERIODS.map((p) => ({
    id: `tag-dwp-${p.key}`,
    tag: `Discord Web Yönetim Paneli - ${p.label}`,
    productName: 'Discord Web Yönetim Paneli',
    periodLabel: p.label,
    category: 'panel' as PlanCategory,
    badgeColor: 'rgba(168, 85, 247, 0.18)',
    borderColor: 'rgba(168, 85, 247, 0.45)',
    textColor: '#c084fc',
    panelType: 'discord' as const,
    icon: 'terminal' as const,
  })),

  // Kişiye Özel Uygulama
  ...PERIODS.map((p) => ({
    id: `tag-custom-app-${p.key}`,
    tag: `Kişiye Özel Uygulama - ${p.label}`,
    productName: 'Kişiye Özel Uygulama',
    periodLabel: p.label,
    category: 'software' as PlanCategory,
    badgeColor: 'rgba(6, 182, 212, 0.18)',
    borderColor: 'rgba(6, 182, 212, 0.45)',
    textColor: '#22d3ee',
    panelType: 'software' as const,
    icon: 'code' as const,
  })),

  // Tüm Yazılım Çözümleri
  ...PERIODS.map((p) => ({
    id: `tag-all-soft-${p.key}`,
    tag: `Tüm Yazılım Çözümleri - ${p.label}`,
    productName: 'Tüm Yazılım Çözümleri',
    periodLabel: p.label,
    category: 'software' as PlanCategory,
    badgeColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: 'rgba(16, 185, 129, 0.45)',
    textColor: '#34d399',
    panelType: 'software' as const,
    icon: 'code' as const,
  })),

  // Website - Donate
  ...PERIODS.map((p) => ({
    id: `tag-web-donate-${p.key}`,
    tag: `Website - Donate - ${p.label}`,
    productName: 'Website - Donate',
    periodLabel: p.label,
    category: 'website' as PlanCategory,
    badgeColor: 'rgba(59, 130, 246, 0.18)',
    borderColor: 'rgba(59, 130, 246, 0.45)',
    textColor: '#60a5fa',
    panelType: 'website' as const,
    icon: 'globe' as const,
  })),

  // Website - Community
  ...PERIODS.map((p) => ({
    id: `tag-web-comm-${p.key}`,
    tag: `Website - Community - ${p.label}`,
    productName: 'Website - Community',
    periodLabel: p.label,
    category: 'website' as PlanCategory,
    badgeColor: 'rgba(147, 51, 234, 0.18)',
    borderColor: 'rgba(147, 51, 234, 0.45)',
    textColor: '#c084fc',
    panelType: 'website' as const,
    icon: 'globe' as const,
  })),

  // Website - XM Studio
  ...PERIODS.map((p) => ({
    id: `tag-web-xm-${p.key}`,
    tag: `Website - XM Studio - ${p.label}`,
    productName: 'Website - XM Studio',
    periodLabel: p.label,
    category: 'website' as PlanCategory,
    badgeColor: 'rgba(236, 72, 153, 0.18)',
    borderColor: 'rgba(236, 72, 153, 0.45)',
    textColor: '#f472b6',
    panelType: 'website' as const,
    icon: 'globe' as const,
  })),

  // Website - Legal
  ...PERIODS.map((p) => ({
    id: `tag-web-legal-${p.key}`,
    tag: `Website - Legal - ${p.label}`,
    productName: 'Website - Legal',
    periodLabel: p.label,
    category: 'website' as PlanCategory,
    badgeColor: 'rgba(14, 165, 233, 0.18)',
    borderColor: 'rgba(14, 165, 233, 0.45)',
    textColor: '#38bdf8',
    panelType: 'website' as const,
    icon: 'globe' as const,
  })),

  // Standalone: Moderasyon
  ...PERIODS.map((p) => ({
    id: `tag-mod-${p.key}`,
    tag: `Moderasyon Botu - ${p.label}`,
    productName: 'Moderasyon Botu',
    periodLabel: p.label,
    category: 'discord' as PlanCategory,
    badgeColor: 'rgba(99, 102, 241, 0.18)',
    borderColor: 'rgba(99, 102, 241, 0.45)',
    textColor: '#818cf8',
    panelType: 'discord' as const,
    icon: 'shield' as const,
  })),

  // Standalone: Guard
  ...PERIODS.map((p) => ({
    id: `tag-guard-${p.key}`,
    tag: `Guard Botu - ${p.label}`,
    productName: 'Guard Botu',
    periodLabel: p.label,
    category: 'discord' as PlanCategory,
    badgeColor: 'rgba(225, 29, 72, 0.18)',
    borderColor: 'rgba(225, 29, 72, 0.45)',
    textColor: '#fb7185',
    panelType: 'discord' as const,
    icon: 'shield' as const,
  })),

  // Standalone: Ticket
  ...PERIODS.map((p) => ({
    id: `tag-ticket-${p.key}`,
    tag: `Ticket Botu - ${p.label}`,
    productName: 'Ticket Botu',
    periodLabel: p.label,
    category: 'discord' as PlanCategory,
    badgeColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: 'rgba(16, 185, 129, 0.45)',
    textColor: '#34d399',
    panelType: 'discord' as const,
    icon: 'shield' as const,
  })),

  // Standalone: Ekip Sistemi
  ...PERIODS.map((p) => ({
    id: `tag-ekip-${p.key}`,
    tag: `Ekip Sistemi Botu - ${p.label}`,
    productName: 'Ekip Sistemi Botu',
    periodLabel: p.label,
    category: 'discord' as PlanCategory,
    badgeColor: 'rgba(249, 115, 22, 0.18)',
    borderColor: 'rgba(249, 115, 22, 0.45)',
    textColor: '#fb923c',
    panelType: 'discord' as const,
    icon: 'shield' as const,
  })),
];

/**
 * Finds or normalizes plan tag details for any string tag or legacy subscription.
 */
export function getPlanTagInfo(rawTag?: string): ProductPlanTag {
  if (!rawTag || !rawTag.trim()) {
    return PRODUCT_PLAN_TAGS[0]; // Free
  }

  const clean = rawTag.trim().toLowerCase();

  // Exact match
  const exact = PRODUCT_PLAN_TAGS.find((p) => p.tag.toLowerCase() === clean);
  if (exact) return exact;

  // Fuzzy match with product and period
  const match = PRODUCT_PLAN_TAGS.find(
    (p) =>
      clean.includes(p.productName.toLowerCase()) ||
      clean.includes(p.tag.toLowerCase())
  );
  if (match) return match;

  // Legacy mappings
  if (clean === 'plus+' || clean.includes('plus+')) {
    return (
      PRODUCT_PLAN_TAGS.find((p) => p.tag === 'Discord Full Pack - 1 Yıllık') ||
      PRODUCT_PLAN_TAGS[1]
    );
  }
  if (clean === 'plus' || clean.includes('plus')) {
    return (
      PRODUCT_PLAN_TAGS.find((p) => p.tag === 'Discord Full Pack - 1 Aylık') ||
      PRODUCT_PLAN_TAGS[1]
    );
  }

  // Fallback custom tag
  return {
    id: `tag-custom-${clean.replace(/[^a-z0-9]/g, '-')}`,
    tag: rawTag,
    productName: rawTag.split('-')[0]?.trim() || rawTag,
    periodLabel: rawTag.split('-')[1]?.trim() || 'Özel',
    category: 'software',
    badgeColor: 'rgba(139, 92, 246, 0.18)',
    borderColor: 'rgba(139, 92, 246, 0.45)',
    textColor: '#c4b5fd',
    panelType: clean.includes('fivem')
      ? 'fivem'
      : clean.includes('web')
      ? 'website'
      : 'discord',
    icon: clean.includes('fivem')
      ? 'gamepad'
      : clean.includes('web')
      ? 'globe'
      : 'zap',
  };
}
