'use client';

import React, { useState } from 'react';

/* Vector SVG symbols used instead of OS emojis */
export function IconDiamond({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <polygon points="6 3 18 3 22 9 12 22 2 9" />
      <line x1="2" y1="9" x2="22" y2="9" />
      <polyline points="10 3 12 9 14 3" />
      <line x1="12" y1="9" x2="12" y2="22" />
    </svg>
  );
}

export function IconCrown({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconCar({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11 2 11.3 2 11.6V16c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

export function IconBuilding({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="9" y1="6" x2="9.01" y2="6" />
      <line x1="15" y1="6" x2="15.01" y2="6" />
      <line x1="9" y1="10" x2="9.01" y2="10" />
      <line x1="15" y1="10" x2="15.01" y2="10" />
      <line x1="9" y1="14" x2="9.01" y2="14" />
      <line x1="15" y1="14" x2="15.01" y2="14" />
    </svg>
  );
}

export function IconZap({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function IconCart({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export function IconSearch({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function IconFlame({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

export function IconTrophy({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34M7 4h10v6a5 5 0 0 1-10 0V4z" />
    </svg>
  );
}

export function IconLock({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function IconCheck({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function IconShield({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function IconAlert({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function IconTag({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

export function IconUser({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function IconFile({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export function IconDatabase({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

export function IconFlag({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

/* Badge Icon Helper */
function ProductBadgeIcon({ type }: { type: string }) {
  if (type === 'flame') return <IconFlame size={12} />;
  if (type === 'trophy') return <IconTrophy size={12} />;
  if (type === 'zap') return <IconZap size={12} />;
  if (type === 'crown') return <IconCrown size={12} />;
  if (type === 'flag') return <IconFlag size={12} />;
  if (type === 'diamond') return <IconDiamond size={12} />;
  if (type === 'building') return <IconBuilding size={12} />;
  return <IconZap size={12} />;
}

/* Product Big Visual Symbol */
export function ProductVisualSymbol({ type, color }: { type: string; color?: string }) {
  const strokeColor = color || '#38bdf8';

  if (type === 'crown' || type === 'vip') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
        <circle cx="12" cy="19" r="1.5" fill={strokeColor} />
      </svg>
    );
  }
  if (type === 'jesko' || type === 'gt3rs' || type === 'car') {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11 2 11.3 2 11.6V16c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    );
  }
  if (type === 'm8' || type === 'suv') {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="11" width="20" height="6" rx="2" />
        <path d="M5 11l2-5h10l2 5" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    );
  }
  if (type === 'mansion' || type === 'house') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" />
        <circle cx="9" cy="9" r="1" fill={strokeColor} />
        <circle cx="15" cy="9" r="1" fill={strokeColor} />
      </svg>
    );
  }
  if (type === 'penthouse' || type === 'building') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="9" y1="6" x2="9.01" y2="6" />
        <line x1="15" y1="6" x2="15.01" y2="6" />
        <line x1="9" y1="10" x2="9.01" y2="10" />
        <line x1="15" y1="10" x2="15.01" y2="10" />
        <line x1="9" y1="14" x2="9.01" y2="14" />
        <line x1="15" y1="14" x2="15.01" y2="14" />
      </svg>
    );
  }
  if (type === 'credits' || type === 'diamond') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="6 3 18 3 22 9 12 22 2 9" />
        <line x1="2" y1="9" x2="22" y2="9" />
        <polyline points="10 3 12 9 14 3" />
        <line x1="12" y1="9" x2="12" y2="22" />
      </svg>
    );
  }
  // Star fallback
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export interface DemoProduct {
  id: string;
  category: 'vip' | 'cars' | 'houses' | 'credits';
  name: string;
  duration: string;
  price: number;
  badge: string;
  badgeIcon: string;
  badgeColor: string;
  imageIcon: string;
  specs?: string[];
  features: string[];
}

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'vip-diamond',
    category: 'vip',
    name: 'V.I.P Diamond Üyelik',
    duration: '30 Günlük Erişim',
    price: 450,
    badge: 'Çok Satan',
    badgeIcon: 'flame',
    badgeColor: '#ec4899',
    imageIcon: 'crown',
    specs: ['Öncelikli Sıra', '+15 Araç Slotu', '%25 Maaş Bonusu'],
    features: [
      'Giriş Sırasında En Öncelikli Sıra (Queue Skip)',
      '+15 Özel Araç Garaj Slotu',
      'Özel Discord & Oyun İçi VIP Rolü ve Rengi',
      '%25 Oyun İçi Maaş ve İşletme Geliri Artışı',
      'Özel VIP Lounge ve Helikopter Pisti Erişimi',
    ],
  },
  {
    id: 'car-jesko',
    category: 'cars',
    name: 'Koenigsegg Jesko Attack (2026)',
    duration: 'Kalıcı Lisanslı Araç',
    price: 950,
    badge: 'Efsanevi Araç',
    badgeIcon: 'trophy',
    badgeColor: '#eab308',
    imageIcon: 'jesko',
    specs: ['385 km/s Hız', '0-100: 2.1s', 'Aktif DRS Kanat'],
    features: [
      'Özel Handling & Süspansiyon Yazılımı',
      '385 km/s Gerçekçi Son Hız Dinamiği',
      'Aktif Aerodinamik DRS Arka Kanat',
      'Kalıcı Sigortalı Anahtar & Vale Çağırma',
      'Özel Twin-Turbo V8 Motor Sesi',
    ],
  },
  {
    id: 'car-m8',
    category: 'cars',
    name: 'BMW M8 Competition G-Power',
    duration: 'Kalıcı Lisanslı Araç',
    price: 850,
    badge: 'Custom Egzoz',
    badgeIcon: 'zap',
    badgeColor: '#3b82f6',
    imageIcon: 'm8',
    specs: ['340 km/s Hız', 'Air Süspansiyon', 'Pop-Bang Egzoz'],
    features: [
      'Özel Ayarlanabilir Air Süspansiyon Kiti',
      'Pop-Bang ve Alevli Çift Egzos Akustiği',
      'Custom Forged Karbon Jant & Bodykit',
      'X-Drive 4 Çeker / Arkadan İtiş Mod Geçişi',
      'Sigorta Kapsamında Çalınmaya Karşı Koruma',
    ],
  },
  {
    id: 'house-mansion',
    category: 'houses',
    name: 'Vinewood Lüks Malikane',
    duration: 'Kalıcı Özel Mülk',
    price: 1200,
    badge: 'Ultra Lüks',
    badgeIcon: 'crown',
    badgeColor: '#a855f7',
    imageIcon: 'mansion',
    specs: ['10 Araçlık Garaj', 'Özel Helipad', 'Sonsuzluk Havuzu'],
    features: [
      '10 Araç Kapasiteli Kapalı Yeraltı Garajı',
      'Çatıda Özel Helikopter İniş Pisti (Helipad)',
      'Şifreli Çelik Para Kasası ve Depolama Alanı',
      'Sonsuzluk Havuzu ve Panoramik Şehir Manzarası',
      'Özel Güvenlik Kameraları ve Alarm Sistemi',
    ],
  },
  {
    id: 'car-gt3rs',
    category: 'cars',
    name: 'Porsche 911 GT3 RS (992)',
    duration: 'Kalıcı Lisanslı Araç',
    price: 900,
    badge: 'Pist Canavarı',
    badgeIcon: 'flag',
    badgeColor: '#ef4444',
    imageIcon: 'gt3rs',
    specs: ['330 km/s Hız', 'PDK Şanzıman', 'Karbon Seramik'],
    features: [
      'Weissach Hafifletilmiş Karbon Gövde Paketi',
      'Yarış Tipi Roll-Cage ve Karbon Çanak Koltuklar',
      'Yüksek Basınçlı Karbon Seramik Yarış Frenleri',
      'Direksiyondan Ayarlanabilir Şasi ve DRS',
      'Kalıcı Araç Mülkiyeti & Vale Teslimi',
    ],
  },
  {
    id: 'vip-platinum',
    category: 'vip',
    name: 'V.I.P Platinum Üyelik',
    duration: '30 Günlük Erişim',
    price: 350,
    badge: 'Popüler VIP',
    badgeIcon: 'diamond',
    badgeColor: '#06b6d4',
    imageIcon: 'star',
    specs: ['Hızlı Sıra', '+10 Araç Slotu', '%15 Maaş Bonusu'],
    features: [
      'Öncelikli Sunucu Giriş Sırası',
      '+10 Ekstra Garaj ve Araç Kapasitesi',
      'Özel Discord Platinum Rolü ve Rengi',
      '%15 Oyun İçi Meslek ve Maaş Bonusu',
      'Özel Günlük Giriş Kredi Ödülleri',
    ],
  },
  {
    id: 'credits-5000',
    category: 'credits',
    name: '5.000 Sunucu Kredisi',
    duration: 'Anında Bakiye Yükleme',
    price: 500,
    badge: '+1.000 Bonus',
    badgeIcon: 'zap',
    badgeColor: '#10b981',
    imageIcon: 'credits',
    specs: ['Anında Teslim', 'Tüm Mağazada Geçerli', '%20 Ekstra'],
    features: [
      '5.000 + 1.000 Bonus Toplam 6.000 Kredi',
      'Tüm Araç, Mülk ve VIP Alımlarında Geçerli',
      'Oyun İçi ATM ve Telefon Bankacılığı Entegrasyonu',
      'PayTR ve 3D Secure ile Anında Otomatik Yükleme',
      'İade ve Bakiye Koruma Güvencesi',
    ],
  },
  {
    id: 'house-penthouse',
    category: 'houses',
    name: 'Eclipse Tower Penthouse',
    duration: 'Kalıcı Rezidans',
    price: 950,
    badge: 'Rezidans',
    badgeIcon: 'building',
    badgeColor: '#6366f1',
    imageIcon: 'penthouse',
    specs: ['6 Araçlık Garaj', 'Özel Asansör', 'Teras Jakuzi'],
    features: [
      'Gökdelen En Üst Kat Dubleks Rezidans',
      'Özel Parmak İzi Okuyuculu Asansör',
      'Panoramik Şehir Manzaralı Teras ve Jakuzi',
      '6 Araçlık VIP Rezidans Otopark Alanı',
      'Entegre Ses Sistemi ve Özel Bar Masası',
    ],
  },
];

/* =========================================================================
   1. DONATE & MARKET VİTRİNİ BİLEŞENİ (PROFESYONEL OYUN & FIVEM MAĞAZASI)
   ========================================================================= */
export function DonateMarketView() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<DemoProduct[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredProducts = DEMO_PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.duration.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: DemoProduct) => {
    setCart((prev) => [...prev, product]);
    setToastMessage(`"${product.name}" sepete eklendi!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="demo-site-root demo-market-advanced">
      {/* 1. Üst Canlı Bilgi Şeridi */}
      <div className="demo-announcement-bar">
        <div className="demo-announcement-left">
          <span className="demo-live-dot" />
          <span className="demo-server-online">SUNUCU: <strong>248 / 250 OYUNCU AKTİF</strong></span>
          <span className="demo-ip-chip">connect play.wihyfe.net</span>
        </div>
        <div className="demo-announcement-right">
          <span className="demo-credit-rate">
            <IconDiamond size={13} /> 1.000 Kredi = 100 TL
          </span>
          <span className="demo-promo-tag">
            <IconTag size={13} /> %20 Hafta Sonu İndirimi Aktif!
          </span>
        </div>
      </div>

      {/* 2. Mağaza Navigasyon & Kullanıcı Barı */}
      <header className="demo-market-nav-header">
        <div className="demo-brand-container">
          <div className="demo-brand-icon">
            <IconZap size={20} />
          </div>
          <div>
            <h1 className="demo-brand-heading">WIHYFE STORE</h1>
            <p className="demo-brand-caption">Otomatik Teslimatlı Sunucu Marketi</p>
          </div>
        </div>

        {/* Arama Kutusu */}
        <div className="demo-search-wrapper">
          <span className="demo-search-icon">
            <IconSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Paket, araç veya mülk ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="demo-search-input"
          />
        </div>

        {/* Kategori Filtre Butonları */}
        <div className="demo-category-pills">
          <button
            type="button"
            className={activeCategory === 'all' ? 'active' : ''}
            onClick={() => setActiveCategory('all')}
          >
            Tümü ({DEMO_PRODUCTS.length})
          </button>
          <button
            type="button"
            className={activeCategory === 'vip' ? 'active' : ''}
            onClick={() => setActiveCategory('vip')}
          >
            <IconCrown size={13} /> VIP
          </button>
          <button
            type="button"
            className={activeCategory === 'cars' ? 'active' : ''}
            onClick={() => setActiveCategory('cars')}
          >
            <IconCar size={13} /> Araçlar
          </button>
          <button
            type="button"
            className={activeCategory === 'houses' ? 'active' : ''}
            onClick={() => setActiveCategory('houses')}
          >
            <IconBuilding size={13} /> Mülkler
          </button>
          <button
            type="button"
            className={activeCategory === 'credits' ? 'active' : ''}
            onClick={() => setActiveCategory('credits')}
          >
            <IconDiamond size={13} /> Kredi
          </button>
        </div>

        {/* Sepet ve Bakiye */}
        <div className="demo-user-actions">
          <button type="button" className="demo-cart-btn">
            <IconCart size={14} />
            <span>Sepetim</span>
            <span className="demo-cart-counter">{cart.length}</span>
          </button>
          <div className="demo-user-badge">
            <span className="demo-user-avatar-dot">W</span>
            <span className="demo-user-text">
              Luna Alvine (1.450 <IconDiamond size={11} />)
            </span>
          </div>
        </div>
      </header>

      {/* Canlı Toast Bildirimi */}
      {toastMessage && (
        <div className="demo-live-toast">
          <IconCheck size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Öne Çıkan Hero Vitrini */}
      <div className="demo-hero-banner">
        <div className="demo-hero-glow-bg" />
        <div className="demo-hero-body">
          <div className="demo-hero-tag">
            <span className="demo-tag-fire">
              <IconFlame size={13} />
            </span>
            <span>HAFTANIN EFSANEVİ PAKETİ</span>
          </div>
          <h2 className="demo-hero-title">Koenigsegg Jesko Attack (2026)</h2>
          <p className="demo-hero-desc">
            385 km/s son hız, aktif DRS aerodinamik kanat sistemi ve özel handling yazılımıyla Los Santos sokaklarının hakimi olun. Otomatik oyun içi teslimat.
          </p>

          <div className="demo-hero-specs-row">
            <div className="demo-spec-chip">
              <span className="demo-spec-label">Maks. Hız</span>
              <strong className="demo-spec-val">385 km/s</strong>
            </div>
            <div className="demo-spec-chip">
              <span className="demo-spec-label">0-100 Hızlanma</span>
              <strong className="demo-spec-val">2.1 Saniye</strong>
            </div>
            <div className="demo-spec-chip">
              <span className="demo-spec-label">Teslimat Süresi</span>
              <strong className="demo-spec-val">Anında (SQL)</strong>
            </div>
            <div className="demo-spec-chip">
              <span className="demo-spec-label">Kalan Stok</span>
              <strong className="demo-spec-val text-amber">3 Adet</strong>
            </div>
          </div>

          <div className="demo-hero-btn-row">
            <button
              type="button"
              className="demo-btn-primary"
              onClick={() => handleAddToCart(DEMO_PRODUCTS[1])}
            >
              <IconZap size={14} />
              <span>Hemen Satın Al • 950 TL</span>
            </button>
            <span className="demo-hero-paytr-guarantee">
              <IconLock size={13} /> PayTR 3D Secure & Anında Teslimat
            </span>
          </div>
        </div>
      </div>

      {/* 4. Ürün Kartları Grid */}
      <section className="demo-products-section">
        <div className="demo-products-header-row">
          <div>
            <h3 className="demo-section-heading">Tüm Sunucu Paketleri & Ürünler</h3>
            <p className="demo-section-sub">Aktif filtrelere göre {filteredProducts.length} adet ürün listeleniyor</p>
          </div>
          <div className="demo-filter-tags-summary">
            <span className="demo-safe-chip">
              <IconCheck size={12} /> Güvenli Ödeme
            </span>
            <span className="demo-safe-chip">
              <IconDatabase size={12} /> 7/24 SQL Bot Teslimatı
            </span>
          </div>
        </div>

        <div className="demo-products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="demo-product-card-adv">
              {/* Üst Rozet ve Süre */}
              <div className="demo-pcard-header">
                <span
                  className="demo-pcard-badge"
                  style={{ borderColor: product.badgeColor, color: product.badgeColor }}
                >
                  <ProductBadgeIcon type={product.badgeIcon} />
                  <span>{product.badge}</span>
                </span>
                <span className="demo-pcard-duration">{product.duration}</span>
              </div>

              {/* İkon / Görsel Temsili (Vector Symbol) */}
              <div className="demo-pcard-visual">
                <div className="demo-pcard-icon-box">
                  <ProductVisualSymbol type={product.imageIcon} color={product.badgeColor} />
                </div>
                {product.specs && (
                  <div className="demo-pcard-specs-bar">
                    {product.specs.map((s, idx) => (
                      <span key={idx} className="demo-mini-spec">{s}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Başlık */}
              <h4 className="demo-pcard-title">{product.name}</h4>

              {/* Özellikler Listesi */}
              <ul className="demo-pcard-features-list">
                {product.features.map((feat, fIdx) => (
                  <li key={fIdx}>
                    <span className="demo-check-icon">
                      <IconCheck size={11} />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Kart Altı: Fiyat & Satın Al */}
              <div className="demo-pcard-footer">
                <div className="demo-pcard-pricing">
                  <span className="demo-pcard-price-main">{product.price} TL</span>
                  <span className="demo-pcard-price-gems">
                    veya {(product.price * 10).toLocaleString()} <IconDiamond size={11} />
                  </span>
                </div>
                <button
                  type="button"
                  className="demo-pcard-buy-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  <span>Sepete Ekle</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Canlı Teslimat Ticker Akışı */}
      <div className="demo-live-purchase-ticker">
        <span className="demo-ticker-pulse">● CANLI TESLİMAT:</span>
        <div className="demo-ticker-content">
          <span>
            <IconCrown size={13} /> berk_k9 az önce <strong>VIP Diamond</strong> satın aldı (2 dk önce)
          </span>
          <span className="demo-ticker-sep">•</span>
          <span>
            <IconCar size={13} /> mert_59 az önce <strong>Koenigsegg Jesko Attack</strong> teslim aldı (5 dk önce)
          </span>
          <span className="demo-ticker-sep">•</span>
          <span>
            <IconDiamond size={13} /> caner_rp az önce <strong>5.000 Sunucu Kredisi</strong> yükledi (8 dk önce)
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. MDT / CAD POLİS & LEGAL PORTAL VİTRİNİ (LSPD POLİS VERİ TERMİNALİ)
   ========================================================================= */
export function MdtCadView() {
  const [activeTab, setActiveTab] = useState<'calls' | 'gbt' | 'units' | 'warrants'>('calls');
  const [gbtQuery, setGbtQuery] = useState<string>('Luna Alvine');
  const [officerStatus, setOfficerStatus] = useState<string>('10-8 GÖREVDE');
  const [panicActive, setPanicActive] = useState<boolean>(false);

  const callsList = [
    {
      id: '#9420',
      code: 'KOD 3 - ACİL İHBAR',
      codeColor: '#ef4444',
      title: 'Paleto Bay Fleeca Banka Soygunu',
      time: '2 dakika önce',
      location: 'Paleto Blvd & Great Ocean Hwy',
      caller: 'Banka Güvenlik Alarmı #4',
      details: '4 Silahlı şüpheli rehinelerle içeride. Siyah Sultan RS marka araç kaçış için bekletiliyor. Otomatik silah atışları raporlandı.',
      assignedUnits: ['Birim 204 (Adam-1)', 'Birim 108 (Mary-4)'],
      status: 'Müdahale Sürüyor',
    },
    {
      id: '#9418',
      code: 'KOD 2 - SİLAHLI ÇATIŞMA',
      codeColor: '#f97316',
      title: 'Legion Square Çete Çatışması',
      time: '6 dakika önce',
      location: 'Legion Square Meydanı',
      caller: 'Vatandaş İhbarı (911)',
      details: 'İki grup arasında karşılıklı çatışma çıktı. 1 sivil yaralı var, EMS acil intikal bekliyor.',
      assignedUnits: ['Birim 312 (Lincoln-2)'],
      status: 'Yolda',
    },
    {
      id: '#9415',
      code: 'KOD 2 - YÜKSEK HIZ İHLALİ & KAÇIŞ',
      codeColor: '#f59e0b',
      title: 'Dur İhtarına Uymayan Spor Araç',
      time: '11 dakika önce',
      location: 'Del Perro Freeway Kuzey Yönü',
      caller: 'Birim 102 Devriye Ekibi',
      details: 'Plakasız kırmızı spor araç 290 km/s hızla kuzeye ilerliyor. Spike strip ve hava desteği (Air-1) talep edildi.',
      assignedUnits: ['Air-1 (Heli)', 'Birim 102 (Interceptor)'],
      status: 'Takipte',
    },
    {
      id: '#9411',
      code: 'KOD 1 - MÜLK HIRSIZLIĞI',
      codeColor: '#3b82f6',
      title: 'Vinewood Hills Villa Alarmı',
      time: '18 dakika önce',
      location: 'Vinewood Hills Kimble Hill Dr.',
      caller: 'Özel Güvenlik Merkezi',
      details: 'Arka bahçeden villaya sızma girişimi tespit edildi. Şüpheli maskeli tek kişi.',
      assignedUnits: ['Birim 409 (K-9 Birimi)'],
      status: 'Olay Yerinde',
    },
  ];

  const patrolUnits = [
    { callsign: 'Adam-1', unitNo: '204', officers: 'Kaptan Luna Alvine, Çavuş E. Stone', vehicle: 'Vapid Stanier Cruiser', status: '10-8 Görevde', freq: '101.5 MHz' },
    { callsign: 'Lincoln-2', unitNo: '312', officers: 'Kıdemli Memur D. Vance', vehicle: 'Buffalo STX Interceptor', status: '10-6 Olay Yerinde', freq: '101.5 MHz' },
    { callsign: 'Mary-4', unitNo: '108', officers: 'Memur K. Miller (Motorize)', vehicle: 'LSPD Western Sovereign', status: '10-8 Görevde', freq: '101.5 MHz' },
    { callsign: 'Air-1', unitNo: '701', officers: 'Pilot Teğmen R. Hayes', vehicle: 'Buckingham Maverick Heli', status: '10-8 Havada', freq: '101.5 MHz' },
    { callsign: 'K9-1', unitNo: '409', officers: 'Memur S. Walker & K-9 Rex', vehicle: 'Vapid Scout SUV K-9', status: '10-8 Görevde', freq: '101.5 MHz' },
  ];

  const wantedList = [
    { name: 'Marcus "Viper" Drake', bounty: '$50.000', charges: 'Banka Soygunu, Polise Silahlı Saldırı', danger: 'Silahlı & Son Derece Tehlikeli', lastSeen: 'Sandy Shores' },
    { name: 'Elena Rostova', bounty: '$35.000', charges: 'Kara Para Aklama, Çalıntı Araç Şebekesi', danger: 'Tehlikeli / Kaçma Riski Yüksek', lastSeen: 'Vinewood Hills' },
    { name: 'Jack "Ghost" Taylor', bounty: '$25.000', charges: 'Cezaevi Firarı, Ağır Yaralama', danger: 'Silahlı & Firari', lastSeen: 'South Los Santos' },
  ];

  return (
    <div className="demo-site-root demo-mdt-advanced">
      {/* 1. Üst Polis Bilgi & Memur Durum Barı */}
      <div className="demo-mdt-topbar">
        <div className="demo-mdt-topbar-left">
          <span className="demo-police-shield">
            <IconShield size={22} />
          </span>
          <div>
            <strong className="demo-mdt-agency-title">LOS SANTOS POLICE DEPT. • MDT / CAD TERMINAL</strong>
            <span className="demo-mdt-agency-sub">Terminal v4.8 • Güvenli Kolluk Kuvvetleri Ağı</span>
          </div>
          <span className="demo-mdt-live-pill">● SİSTEM ONLINE</span>
        </div>

        <div className="demo-mdt-topbar-right">
          <span className="demo-mdt-officer-info">
            Memur: <strong>Kaptan Luna Alvine #409</strong> (Metro Div.)
          </span>
          <select
            value={officerStatus}
            onChange={(e) => setOfficerStatus(e.target.value)}
            className="demo-mdt-status-select"
          >
            <option value="10-8 GÖREVDE">10-8 GÖREVDE</option>
            <option value="10-6 DEVRİYEDE">10-6 DEVRİYEDE</option>
            <option value="10-7 MEŞGUL">10-7 MEŞGUL</option>
          </select>
          <button
            type="button"
            className={`demo-panic-btn ${panicActive ? 'active' : ''}`}
            onClick={() => setPanicActive(!panicActive)}
          >
            <IconAlert size={14} />
            <span>{panicActive ? 'PANİK AKTİF (10-99)' : 'PANİK BUTONU'}</span>
          </button>
        </div>
      </div>

      {/* 2. MDT Sekme Seçicisi */}
      <div className="demo-mdt-tabs-nav">
        <button
          type="button"
          className={activeTab === 'calls' ? 'active' : ''}
          onClick={() => setActiveTab('calls')}
        >
          <IconAlert size={14} />
          <span>911 İhbar Akışı ({callsList.length} Aktif)</span>
        </button>
        <button
          type="button"
          className={activeTab === 'gbt' ? 'active' : ''}
          onClick={() => setActiveTab('gbt')}
        >
          <IconUser size={14} />
          <span>GBT & Vatandaş Sorgulama</span>
        </button>
        <button
          type="button"
          className={activeTab === 'units' ? 'active' : ''}
          onClick={() => setActiveTab('units')}
        >
          <IconCar size={14} />
          <span>Devriye & Araç Takip ({patrolUnits.length} Birim)</span>
        </button>
        <button
          type="button"
          className={activeTab === 'warrants' ? 'active' : ''}
          onClick={() => setActiveTab('warrants')}
        >
          <IconFile size={14} />
          <span>Yakalama Emirleri ({wantedList.length})</span>
        </button>
      </div>

      {/* 3. MDT İçerik Alanı */}
      <div className="demo-mdt-main-content">
        {/* TAB 1: 911 İHBARLARI */}
        {activeTab === 'calls' && (
          <div className="demo-mdt-calls-grid">
            {callsList.map((call) => (
              <div key={call.id} className="demo-mdt-call-card">
                <div className="demo-call-top-row">
                  <span className="demo-call-badge" style={{ backgroundColor: call.codeColor }}>
                    {call.code}
                  </span>
                  <span className="demo-call-id">{call.id} • {call.time}</span>
                  <span className="demo-call-status-badge">{call.status}</span>
                </div>

                <h4 className="demo-call-title">{call.title}</h4>

                <div className="demo-call-meta-info">
                  <div><strong>Konum:</strong> {call.location}</div>
                  <div><strong>İhbar Eden:</strong> {call.caller}</div>
                </div>

                <p className="demo-call-details-box">{call.details}</p>

                <div className="demo-call-footer-row">
                  <div className="demo-assigned-units">
                    <span>Atanan Birimler:</span>
                    {call.assignedUnits.map((u, i) => (
                      <span key={i} className="demo-unit-tag">{u}</span>
                    ))}
                  </div>
                  <div className="demo-call-actions">
                    <button type="button" className="demo-call-btn">İntikal Et</button>
                    <button type="button" className="demo-call-btn highlight">Kod Yükselt</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: GBT SORGULAMA */}
        {activeTab === 'gbt' && (
          <div className="demo-mdt-gbt-section">
            <div className="demo-gbt-search-bar">
              <input
                type="text"
                placeholder="Vatandaş İsim, TC No veya Parmak İzi girin..."
                value={gbtQuery}
                onChange={(e) => setGbtQuery(e.target.value)}
                className="demo-gbt-input"
              />
              <button type="button" className="demo-gbt-search-btn">Sorgula ↵</button>
            </div>

            <div className="demo-citizen-dossier-card">
              <div className="demo-citizen-header">
                <div className="demo-citizen-avatar">
                  <IconUser size={26} />
                </div>
                <div className="demo-citizen-primary">
                  <h3>Luna Alvine</h3>
                  <p>Vatandaşlık ID: <strong>TR-892401</strong> • Yaş: 27 • Kan Grubu: 0 Rh+</p>
                  <div className="demo-citizen-status-chips">
                    <span className="demo-status-clean">
                      <IconCheck size={12} /> ARANMASI YOK (TEMİZ)
                    </span>
                    <span className="demo-status-license">Legal Silah Ruhsatı: AKTİF</span>
                    <span className="demo-status-driver">Sürücü Belgesi: Sınıf A & B</span>
                  </div>
                </div>
              </div>

              <div className="demo-citizen-details-grid">
                <div className="demo-dossier-box">
                  <h5>Kayıtlı Araçlar (2 Adet)</h5>
                  <ul>
                    <li>
                      <IconCar size={13} /> <strong>Koenigsegg Jesko Attack</strong> (Plaka: 34WPF01) • Sigortalı
                    </li>
                    <li>
                      <IconCar size={13} /> <strong>BMW M8 Competition</strong> (Plaka: 34LUN09) • Sigortalı
                    </li>
                  </ul>
                </div>
                <div className="demo-dossier-box">
                  <h5>Kayıtlı Mülkler & İkamet</h5>
                  <ul>
                    <li>
                      <IconBuilding size={13} /> <strong>Vinewood Lüks Malikane #14</strong> (Tapu No: VN-9021)
                    </li>
                    <li>
                      <IconBuilding size={13} /> <strong>Eclipse Tower Penthouse #32</strong> (Tapu No: EC-401)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="demo-dossier-box full-width">
                <h5>Geçmiş Sicil & Ceza Kayıtları</h5>
                <div className="demo-record-item">
                  <span className="demo-record-date">14.02.2025</span>
                  <span className="demo-record-charge">Hız Sınırı İhlali (180 km/s - Great Ocean Hwy)</span>
                  <span className="demo-record-fine">500$ Ceza Ödendi • Memur: S. Walker</span>
                </div>
                <div className="demo-record-item">
                  <span className="demo-record-date">09.11.2024</span>
                  <span className="demo-record-charge">Hatalı Park İhlali (Legion Square Meydanı)</span>
                  <span className="demo-record-fine">İhtar Verildi • Memur: K. Miller</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEVRİYE VE BİRİMLER */}
        {activeTab === 'units' && (
          <div className="demo-units-table-container">
            <table className="demo-units-table">
              <thead>
                <tr>
                  <th>Çağrı Kodu</th>
                  <th>Birim No</th>
                  <th>Görevli Memurlar</th>
                  <th>Devriye Aracı</th>
                  <th>Durum</th>
                  <th>Telsiz Frekansı</th>
                </tr>
              </thead>
              <tbody>
                {patrolUnits.map((u, i) => (
                  <tr key={i}>
                    <td><strong className="text-cyan">{u.callsign}</strong></td>
                    <td>#{u.unitNo}</td>
                    <td>{u.officers}</td>
                    <td>{u.vehicle}</td>
                    <td><span className="demo-table-status-pill">{u.status}</span></td>
                    <td>{u.freq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: YAKALAMA EMİRLERİ */}
        {activeTab === 'warrants' && (
          <div className="demo-warrants-grid">
            {wantedList.map((w, i) => (
              <div key={i} className="demo-warrant-card">
                <div className="demo-warrant-top">
                  <span className="demo-warrant-badge">EN ÇOK ARANAN</span>
                  <span className="demo-warrant-bounty">Ödül: {w.bounty}</span>
                </div>
                <h4 className="demo-warrant-name">{w.name}</h4>
                <div className="demo-warrant-meta">
                  <div><strong>Suçlar:</strong> {w.charges}</div>
                  <div><strong>Tehlike Seviyesi:</strong> <span className="text-red">{w.danger}</span></div>
                  <div><strong>Son Görüldüğü Yer:</strong> {w.lastSeen}</div>
                </div>
                <button type="button" className="demo-warrant-action-btn">Yakalama Emrini Başlat</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
