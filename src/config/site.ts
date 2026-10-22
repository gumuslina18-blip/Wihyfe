export type BillingPeriod = 'monthly' | 'quarterly' | 'semi-annual' | 'annual';

export interface BillingPeriodOption {
  id: BillingPeriod;
  label: string;
  durationMonths: number;
  discountBadge?: string;
  isPopular?: boolean;
  isAvailable: boolean;
  statusBadge?: string;
}

export const BILLING_PERIODS: BillingPeriodOption[] = [
  { id: 'monthly', label: 'Aylık', durationMonths: 1, isAvailable: false, statusBadge: 'Yakında' },
  { id: 'quarterly', label: '3 Aylık', durationMonths: 3, discountBadge: '%10 İndirim', isAvailable: false, statusBadge: 'Yakında' },
  { id: 'semi-annual', label: '6 Aylık', durationMonths: 6, discountBadge: '%20 İndirim', isAvailable: false, statusBadge: 'Yakında' },
  { id: 'annual', label: 'Yıllık', durationMonths: 12, discountBadge: '%35 İndirim', isPopular: true, isAvailable: false, statusBadge: 'Yakında' },
];

export interface PricingPlan {
  totalPrice: string;
  periodLabel: string;
  originalPrice?: string;
  discountBadge?: string;
  monthlyEquivalent?: string;
  paytrUrl?: string;
}

export interface StandaloneBot {
  id: string;
  name: string;
  badge?: string;
  description: string;
  price: string;
  period: string;
  icon: 'shield' | 'lock' | 'ticket' | 'users' | 'clock' | 'code';
  features: string[];
  buttonText: string;
  popular?: boolean;
  paytrUrl?: string;
  isAvailable?: boolean;
  statusBadge?: string;
}

export interface AdditionalService {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  numericPrice: number;
  periodLabel: string;
  features: string[];
  buttonText: string;
  badge?: string;
  popular?: boolean;
  paytrUrl?: string;
  isAvailable?: boolean;
  statusBadge?: string;
}


export interface BotProduct {
  id: string;
  name: string;
  badge?: string;
  description: string;
  icon: 'discord' | 'shield' | 'scale' | 'gamepad' | 'terminal' | 'users';
  features: string[];
  buttonText: string;
  popular?: boolean;
  pricing: Record<BillingPeriod, PricingPlan>;
}

export interface WhyUsItem {
  title: string;
  description: string;
  icon: 'zap' | 'sliders' | 'layout' | 'trending';
}

export interface ProcessItem {
  number: string;
  title: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleColor: 'gold' | 'purple' | 'blue' | 'cyan' | 'pink';
  avatar: string;
}

export interface WebsiteProduct {
  id: string;
  name: string;
  badge?: string;
  description: string;
  setupFee: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  pricing: Record<BillingPeriod, PricingPlan>;
  isCustomQuote?: boolean;
  customQuoteUrl?: string;
}

export interface PartnerServer {
  id: string;
  name: string;
  tag: string;
  members: string;
  online: string;
  badge?: string;
  verified?: boolean;
  color: 'blue' | 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose';
  iconLetter: string;
  iconType?: string;
  avatarUrl?: string;
  description: string;
  infrastructure: string;
  discordUrl?: string;
}

export const SITE_CONFIG = {
  brand: {
    name: 'Wihyfe',
    title: 'Wihyfe | Yazılım Çözümleri',
    tagline: 'Discord toplulukları için işlevsel bot çözümleri.',
    description: 'Discord sunucunuz için moderasyon, ticket ve özel bot çözümleri. Yönetimi kolaylaştırın, topluluğunuza özel deneyimler sunun.',
    discordUrl: 'https://discord.gg/wihyfe',
    instagramUrl: 'https://www.instagram.com/wihyfe?utm_source=ig_web_button_share_sheet&srtk=ZDNlZDc0MzIxNw==',
  },

  navLinks: [
    { label: 'Ana Sayfa', href: '#hero' },
    { label: 'Paketlerimiz', href: '#paketler' },
    { label: 'Websiteler', href: '#websiteler' },
    { label: 'Botlarımız', href: '#botlar' },
    { label: 'Ek Hizmetler', href: '#ek-hizmetler' },
    { label: 'Neden Wihyfe?', href: '#neden-wihyfe' },
    { label: 'Ekibimiz', href: '#ekibimiz' },
    { label: 'Nasıl Çalışır?', href: '#nasil-calisir' },
    { label: 'Süreç', href: '#surec' },
    { label: 'İş Birliklerimiz', href: '#partnerler' },
    { label: 'SSS', href: '#sss' },
  ],

  heroBadges: [
    'Modüler özellikler',
    'Sunucuna özel çözümler',
    'Düzenli yönetim',
  ],

  bots: [
    {
      id: 'discord-full-pack',
      name: 'Discord Full Pack',
      badge: 'En Popüler',
      description: 'Tam kapsamlı Discord sunucu yönetimi',
      icon: 'discord',
      popular: true,
      buttonText: 'Sepete Ekle',
      features: [
        'Gelişmiş Moderasyon',
        'Guard',
        'Backup',
        'BlackList Sunucu Kontrolü',
        'Log Sunucusu İçin Yetkili Kontrolü',
      ],
      pricing: {
        monthly: {
          totalPrice: '1.300,00',
          periodLabel: 'TL / ay',
          paytrUrl: 'https://www.paytr.com/link/7MFXrXH',
        },
        quarterly: {
          totalPrice: '3.510,00',
          periodLabel: 'TL / 3 ay',
          originalPrice: '3.900,00 TL',
          discountBadge: '%10 İndirim',
          monthlyEquivalent: '1.170 TL / ay',
        },
        'semi-annual': {
          totalPrice: '6.240,00',
          periodLabel: 'TL / 6 ay',
          originalPrice: '7.800,00 TL',
          discountBadge: '%20 İndirim',
          monthlyEquivalent: '1.040 TL / ay',
        },
        annual: {
          totalPrice: '10.140,00',
          periodLabel: 'TL / yıl',
          originalPrice: '15.600,00 TL',
          discountBadge: '%35 İndirim',
          monthlyEquivalent: '845 TL / ay',
        },
      },
    },
    {
      id: 'discord-pack',
      name: 'Discord Pack',
      badge: 'Standart',
      description: 'Temel Discord sunucu yönetimi',
      icon: 'shield',
      buttonText: 'Sepete Ekle',
      features: [
        'Gelişmiş Moderasyon',
        'Guard',
        'Backup',
      ],
      pricing: {
        monthly: {
          totalPrice: '850,00',
          periodLabel: 'TL / ay',
          paytrUrl: 'https://www.paytr.com/link/A3L1Mxc',
        },
        quarterly: {
          totalPrice: '2.295,00',
          periodLabel: 'TL / 3 ay',
          originalPrice: '2.550,00 TL',
          discountBadge: '%10 İndirim',
          monthlyEquivalent: '765 TL / ay',
        },
        'semi-annual': {
          totalPrice: '4.080,00',
          periodLabel: 'TL / 6 ay',
          originalPrice: '5.100,00 TL',
          discountBadge: '%20 İndirim',
          monthlyEquivalent: '680 TL / ay',
        },
        annual: {
          totalPrice: '6.630,00',
          periodLabel: 'TL / yıl',
          originalPrice: '10.200,00 TL',
          discountBadge: '%35 İndirim',
          monthlyEquivalent: '552 TL / ay',
        },
      },
    },
    {
      id: 'legal-pack',
      name: 'Legal Pack',
      badge: 'Legal',
      description: 'Legal ekipler için en uygun paket',
      icon: 'scale',
      buttonText: 'Sepete Ekle',
      features: [
        'Mesai Yönetimi',
        'Guard Yönetimi',
      ],
      pricing: {
        monthly: {
          totalPrice: '500,00',
          periodLabel: 'TL / ay',
          paytrUrl: 'https://www.paytr.com/link/UYZRQ17',
        },
        quarterly: {
          totalPrice: '1.350,00',
          periodLabel: 'TL / 3 ay',
          originalPrice: '1.500,00 TL',
          discountBadge: '%10 İndirim',
          monthlyEquivalent: '450 TL / ay',
        },
        'semi-annual': {
          totalPrice: '2.400,00',
          periodLabel: 'TL / 6 ay',
          originalPrice: '3.000,00 TL',
          discountBadge: '%20 İndirim',
          monthlyEquivalent: '400 TL / ay',
        },
        annual: {
          totalPrice: '3.900,00',
          periodLabel: 'TL / yıl',
          originalPrice: '6.000,00 TL',
          discountBadge: '%35 İndirim',
          monthlyEquivalent: '325 TL / ay',
        },
      },
    },
    {
      id: 'garrys-mod-full',
      name: "Garry's Mod Full",
      badge: 'Tam Kapsamlı',
      description: "Tam kapsamlı Garry's Mod sunucu yönetimi",
      icon: 'gamepad',
      popular: true,
      buttonText: 'Sepete Ekle',
      features: [
        'Gelişmiş Moderasyon',
        'Guard ve Backup',
        'Hızlı Giriş Sistemi',
        'Mesai Sistemi',
        'Başvuru Sistemi',
      ],
      pricing: {
        monthly: {
          totalPrice: '1.100,00',
          periodLabel: 'TL / ay',
          paytrUrl: 'https://www.paytr.com/link/fzN5wEF',
        },
        quarterly: {
          totalPrice: '2.970,00',
          periodLabel: 'TL / 3 ay',
          originalPrice: '3.300,00 TL',
          discountBadge: '%10 İndirim',
          monthlyEquivalent: '990 TL / ay',
        },
        'semi-annual': {
          totalPrice: '5.280,00',
          periodLabel: 'TL / 6 ay',
          originalPrice: '6.600,00 TL',
          discountBadge: '%20 İndirim',
          monthlyEquivalent: '880 TL / ay',
        },
        annual: {
          totalPrice: '8.580,00',
          periodLabel: 'TL / yıl',
          originalPrice: '13.200,00 TL',
          discountBadge: '%35 İndirim',
          monthlyEquivalent: '715 TL / ay',
        },
      },
    },
    {
      id: 'garrys-mod',
      name: "Garry's Mod",
      badge: 'Temel Oyun',
      description: "Temel Garry's Mod sunucu yönetimi",
      icon: 'terminal',
      buttonText: 'Sepete Ekle',
      features: [
        'Moderasyon',
        'Guard ve Backup',
        'Hızlı Giriş Sistemi',
      ],
      pricing: {
        monthly: {
          totalPrice: '850,00',
          periodLabel: 'TL / ay',
          paytrUrl: 'https://www.paytr.com/link/zTJyByr',
        },
        quarterly: {
          totalPrice: '2.295,00',
          periodLabel: 'TL / 3 ay',
          originalPrice: '2.550,00 TL',
          discountBadge: '%10 İndirim',
          monthlyEquivalent: '765 TL / ay',
        },
        'semi-annual': {
          totalPrice: '4.080,00',
          periodLabel: 'TL / 6 ay',
          originalPrice: '5.100,00 TL',
          discountBadge: '%20 İndirim',
          monthlyEquivalent: '680 TL / ay',
        },
        annual: {
          totalPrice: '6.630,00',
          periodLabel: 'TL / yıl',
          originalPrice: '10.200,00 TL',
          discountBadge: '%35 İndirim',
          monthlyEquivalent: '552 TL / ay',
        },
      },
    },
    {
      id: 'ekip-pack',
      name: 'Ekip Pack',
      badge: 'Ekip & Çete',
      description: 'Aile ve Çete ekipleri için en doğru seçim',
      icon: 'users',
      buttonText: 'Sepete Ekle',
      features: [
        'Ekip Yönetimi',
        'Guard ve Backup',
      ],
      pricing: {
        monthly: {
          totalPrice: '500,00',
          periodLabel: 'TL / ay',
          paytrUrl: 'https://www.paytr.com/link/RLJTW7n',
        },
        quarterly: {
          totalPrice: '1.350,00',
          periodLabel: 'TL / 3 ay',
          originalPrice: '1.500,00 TL',
          discountBadge: '%10 İndirim',
          monthlyEquivalent: '450 TL / ay',
        },
        'semi-annual': {
          totalPrice: '2.400,00',
          periodLabel: 'TL / 6 ay',
          originalPrice: '3.000,00 TL',
          discountBadge: '%20 İndirim',
          monthlyEquivalent: '400 TL / ay',
        },
        annual: {
          totalPrice: '3.900,00',
          periodLabel: 'TL / yıl',
          originalPrice: '6.000,00 TL',
          discountBadge: '%35 İndirim',
          monthlyEquivalent: '325 TL / ay',
        },
      },
    },
  ] as BotProduct[],

  websites: [
    {
      id: 'website-donate',
      name: 'Website - Donate',
      description: 'Mevcut fiyatlandırma bakım & güncelleme hizmeti içindir, ilk kurulum ücreti için ticket oluşturunuz.',
      setupFee: 'Kurulum Ücreti: +1750.00 TL',
      buttonText: 'Sepete Ekle',
      popular: true,
      features: [
        'Bakiye & Kullanıcı Yönetimi',
        'Kategori & Ürün Yönetimi',
        'İndirim Kodu Yönetimi',
        'Tema Yönetimi',
        'Paywant Entegrasyonu',
        'DETAYLI BİLGİ İÇİN TİCKET',
      ],
      pricing: {
        monthly: {
          totalPrice: '750,00',
          periodLabel: 'TL / ay',
        },
        quarterly: {
          totalPrice: '2.025,00',
          periodLabel: 'TL / 3 ay',
          originalPrice: '2.250,00 TL',
          discountBadge: '%10 İndirim',
          monthlyEquivalent: '675 TL / ay',
        },
        'semi-annual': {
          totalPrice: '3.600,00',
          periodLabel: 'TL / 6 ay',
          originalPrice: '4.500,00 TL',
          discountBadge: '%20 İndirim',
          monthlyEquivalent: '600 TL / ay',
        },
        annual: {
          totalPrice: '5.850,00',
          periodLabel: 'TL / yıl',
          originalPrice: '9.000,00 TL',
          discountBadge: '%35 İndirim',
          monthlyEquivalent: '487,50 TL / ay',
        },
      },
    },
    {
      id: 'website-legal',
      name: 'Website - Legal',
      description: 'Mevcut fiyatlandırma bakım & güncelleme hizmeti içindir, ilk kurulum ücreti için ticket oluşturunuz.',
      setupFee: 'Kurulum Ücreti: +700.00 TL',
      buttonText: 'Sepete Ekle',
      features: [
        'Tam Özelleştirme',
        'Mesai Takibi',
        'Rapor Yönetimi',
        'Personel Yönetimi',
        'FTO & FTS Atamaları',
        'Vatandaş Veritabanı',
        'Başvuru Yönetimi',
        'Prim Yönetimi',
        'Bilgi Merkezi (Handbook)',
      ],
      pricing: {
        monthly: {
          totalPrice: '300,00',
          periodLabel: 'TL / ay',
        },
        quarterly: {
          totalPrice: '810,00',
          periodLabel: 'TL / 3 ay',
          originalPrice: '900,00 TL',
          discountBadge: '%10 İndirim',
          monthlyEquivalent: '270 TL / ay',
        },
        'semi-annual': {
          totalPrice: '1.440,00',
          periodLabel: 'TL / 6 ay',
          originalPrice: '1.800,00 TL',
          discountBadge: '%20 İndirim',
          monthlyEquivalent: '240 TL / ay',
        },
        annual: {
          totalPrice: '2.340,00',
          periodLabel: 'TL / yıl',
          originalPrice: '3.600,00 TL',
          discountBadge: '%35 İndirim',
          monthlyEquivalent: '195 TL / ay',
        },
      },
    },
    {
      id: 'website-ozel',
      name: 'Website – Özel Proje',
      badge: 'Özel Yazılım',
      description: 'Sunucunuza ve topluluğunuza özel sıfırdan tasarlanan web arayüzleri, veritabanı ve yönetim sistemleri.',
      setupFee: 'Kurulum & Geliştirme: Projeye Göre',
      buttonText: 'Teklif Al (Ticket)',
      isCustomQuote: true,
      customQuoteUrl: 'https://discord.gg/wihyfe',
      features: [
        'Tamamen Özelleştirilebilir Tasarım (UI/UX)',
        'Discord Bot & Veritabanı Entegrasyonu',
        'Özel Yönetim (Admin) & Yetkili Paneli',
        'İsteğe Özel Ödeme Sistemleri (PayTR vb.)',
        'Veritabanı Mimarisi & API Geliştirme',
        'Mobil Uyumlu (Responsive) & Modern UI',
        '7/24 Kesintisiz Hosting & DDoS Koruması',
        'DETAYLI BİLGİ & TEKLİF İÇİN TİCKET',
      ],
      pricing: {
        monthly: {
          totalPrice: 'Özel Fiyat',
          periodLabel: 'Projeye Göre',
        },
        quarterly: {
          totalPrice: 'Özel Fiyat',
          periodLabel: 'Projeye Göre',
        },
        'semi-annual': {
          totalPrice: 'Özel Fiyat',
          periodLabel: 'Projeye Göre',
        },
        annual: {
          totalPrice: 'Özel Fiyat',
          periodLabel: 'Projeye Göre',
        },
      },
    },
  ] as WebsiteProduct[],

  standaloneBots: [
    {
      id: 'moderasyon-bot',
      name: 'Moderasyon',
      badge: 'Çok Satan',
      description: 'Fivem, Garry\'s Mod , Public vb. Sunucular için',
      price: '550,00',
      period: 'TL / ay',
      icon: 'shield',
      popular: true,
      buttonText: 'Yakında',
      isAvailable: false,
      statusBadge: 'Yakında',
      features: [
        'Ticket Sistemi',
        'Kayıt Sistemi',
        'Ekip Sistemi',
        'Uyarı Sistemi',
        'Log Sistemi',
        'Gelişmiş Ceza ve Log sistemleri',
      ],
    },
    {
      id: 'guard-bot',
      name: 'Guard',
      badge: 'Güvenlik',
      description: 'Discord Sunucunuz için Gelişmiş koruma ve backup sistemi',
      price: '450,00',
      period: 'TL / ay',
      icon: 'lock',
      popular: false,
      buttonText: 'Yakında',
      isAvailable: false,
      statusBadge: 'Yakında',
      features: [
        'Gelişmiş Koruma Sistemleri',
        'Ayarlanabilir güvenli listeler',
        'Backup sistemleri',
      ],
    },
    {
      id: 'ticket-bot',
      name: 'Ticket',
      badge: 'Destek',
      description: 'Destek bileti sistemi',
      price: '300,00',
      period: 'TL / ay',
      icon: 'ticket',
      popular: false,
      buttonText: 'Yakında',
      isAvailable: false,
      statusBadge: 'Yakında',
      features: [
        'Gelişmiş Ticket Sistemi',
        'Kategori Sistemi',
        'Transcript Sistemi',
        'Log Sistemi',
      ],
    },
    {
      id: 'ekip-sistemi-bot',
      name: 'Ekip Sistemi',
      badge: 'Topluluk',
      description: 'Aile ve Çete ekipleri için en ideal çözüm',
      price: '350,00',
      period: 'TL / ay',
      icon: 'users',
      popular: false,
      buttonText: 'Yakında',
      isAvailable: false,
      statusBadge: 'Yakında',
      features: [
        'Etkinlik sistemi',
        'Aktiflik sistemi',
        'Başvuru ve Ticket sistemleri',
        'Gelişmiş Loglar',
      ],
    },
    {
      id: 'mesai-sistemi-bot',
      name: 'Mesai Sistemi',
      badge: 'Yönetim',
      description: 'Legal ekipler için en ideal çözüm',
      price: '350,00',
      period: 'TL / ay',
      icon: 'clock',
      popular: false,
      buttonText: 'Yakında',
      isAvailable: false,
      statusBadge: 'Yakında',
      features: [
        'Mesai Sistemi',
        'Başvuru ve Ticket sistemi',
        'Gelişmiş Loglar',
      ],
    },
    {
      id: 'ozel-bot-cozum',
      name: 'Özel Bot Geliştirme',
      badge: 'Özel Çözüm',
      description: 'Sunucunuza ve topluluğunuza özel sıfırdan geliştirilen bot',
      price: 'Özel Fiyat',
      period: '/ proje',
      icon: 'code',
      popular: true,
      buttonText: 'Teklif Al',
      features: [
        'İhtiyaca Özel Komutlar',
        'Özelleştirilebilir İş Akışları',
        'Sunucuya Uygun Entegrasyon',
        '7/24 Kesintisiz Destek',
      ],
    },
  ] as StandaloneBot[],

  whyUs: [
    {
      title: 'Kolay yönetim',
      description: 'Tekrarlayan işleri sadeleştir, topluluğuna daha fazla zaman ayır.',
      icon: 'zap',
    },
    {
      title: 'İhtiyaca uygun yapı',
      description: 'Sunucunun kullanımına göre özellikleri belirle.',
      icon: 'sliders',
    },
    {
      title: 'Tutarlı deneyim',
      description: 'Komutları ve etkileşimleri anlaşılır bir düzende sun.',
      icon: 'layout',
    },
    {
      title: 'Gelişime açık',
      description: 'Topluluğun büyüdükçe yeni ihtiyaçlara uyum sağla.',
      icon: 'trending',
    },
  ] as WhyUsItem[],

  team: [
    {
      id: 'lunaalvine',
      name: 'lunaalvine',
      role: 'Wihyfe',
      roleColor: 'gold',
      avatar: '/team/lunaalvine.jpg',
    },
  ] as TeamMember[],

  process: [
    {
      number: '01',
      title: 'İhtiyacını paylaş',
      description: 'Sunucunu ve botundan beklentilerini anlat.',
    },
    {
      number: '02',
      title: 'Çözümü netleştirelim',
      description: 'Özellikleri ve kurulum kapsamını birlikte belirleyelim.',
    },
    {
      number: '03',
      title: 'Sunucunda kullan',
      description: 'Botunu sunucuna ekle ve yapılandırmanı tamamla.',
    },
  ] as ProcessItem[],

  faq: [
    {
      id: 'faq-1',
      question: 'Sunucuma özel bot yaptırabilir miyim?',
      answer: 'İstediğin komutları ve işleyişi paylaşarak özel bot talebini iletebilirsin.',
    },
    {
      id: 'faq-2',
      question: 'Hangi botu seçmeliyim?',
      answer: 'Yönetim ihtiyaçları için moderasyon, destek süreçleri için ticket çözümünü inceleyebilirsin. Farklı ihtiyaçların varsa özel bot seçeneğini konuşabiliriz.',
    },
    {
      id: 'faq-3',
      question: 'Fiyatı nasıl öğrenebilirim?',
      answer: 'İlgilendiğin botu veya istediğin özellikleri Discord üzerinden paylaşarak fiyat bilgisi alabilirsin.',
    },
    {
      id: 'faq-4',
      question: 'Kurulum süreci nasıl ilerliyor?',
      answer: 'Botun kapsamı netleştirildikten sonra sunucuya ekleme, gerekli izinler ve yapılandırma adımları belirlenir.',
    },
  ] as FaqItem[],

  additionalServices: [
    {
      id: 'service-yetkili-takip',
      name: 'Yetkili Takip',
      badge: 'Güvenlik',
      subtitle: 'Sunucu yetkililerini ve izin değişikliklerini anlık denetleyin',
      price: '250,00',
      numericPrice: 250,
      periodLabel: 'TL / 1 Ay',
      buttonText: 'Yakında',
      isAvailable: false,
      statusBadge: 'Yakında',
      features: [
        'Log Sunucusu Güvenliği',
        'Yetkili Komut & Rol Takibi',
        'Anlık Şüpheli Hareket Bildirimi',
        'Detaylı Denetim Kaydı',
      ],
    },
    {
      id: 'service-black-list-sunucu',
      name: 'Black List Sunucu',
      badge: 'Koruma',
      subtitle: 'Kara listedeki zararlı kullanıcıları sunucunuzdan uzak tutun',
      price: '250,00',
      numericPrice: 250,
      periodLabel: 'TL / 1 Ay',
      buttonText: 'Yakında',
      isAvailable: false,
      statusBadge: 'Yakında',
      features: [
        'Black List sunucudaki üyelere uyarı DM\'i',
        'Otomatik Rol Alma & Yasaklama',
        'Güvenli Kullanıcı İstisnası',
        'Otomatik Bildirim & Raporlama',
      ],
    },
    {
      id: 'service-webhook-korumasi',
      name: 'Webhook Koruması',
      badge: 'En Çok Satan',
      popular: true,
      subtitle: 'Log sistemleri ve webhook entegrasyonları için maksimum koruma',
      price: '350,00',
      numericPrice: 350,
      periodLabel: 'TL / 1 Ay',
      buttonText: 'Yakında',
      isAvailable: false,
      statusBadge: 'Yakında',
      features: [
        'Gelişmiş IP & Token koruma',
        'Detaylı spam & veri loglama',
        'Takım yönetimi entegrasyonu',
        'Gelişmiş analitik & takip',
      ],
    },
    {
      id: 'service-kisisellestirilebilir',
      name: 'Kişiselleştirilebilir Hizmetler',
      badge: 'Özel Çözüm',
      subtitle: 'Topluluğunuzun ihtiyacına uygun esnek özel sistemler',
      price: '100,00',
      numericPrice: 100,
      periodLabel: 'TL / 1 Ay',
      buttonText: 'Yakında',
      isAvailable: false,
      statusBadge: 'Yakında',
      features: [
        'İsteklerinize en uygun çözümler',
        'Özel komut & rol entegrasyonu',
        'Esnek veritabanı bağlama',
        'Birebir teknik yapılandırma',
      ],
    },
    {
      id: 'service-reklam-1-haftalik',
      name: 'Reklam 1 Haftalık',
      badge: 'Hızlı Tanıtım',
      subtitle: 'Wihyfe Discordundan açılan bir kanal üzerinden belirttiğiniz text @everyone atılarak paylaşılır',
      price: '600,00',
      numericPrice: 600,
      periodLabel: 'TL / 1 Haftalık',
      buttonText: 'Yakında',
      isAvailable: false,
      statusBadge: 'Yakında',
      features: [
        '7 Gün kalıcı özel reklam kanalı',
        'İstediğiniz metin & banner paylaşımı',
        'Çekiliş ekleme imkanı',
        '@everyone etiketli anlık duyuru',
      ],
    },
    {
      id: 'service-reklam-1-aylik',
      name: 'Reklam 1 Aylık',
      badge: 'Maksimum Erişim',
      popular: true,
      subtitle: 'Wihyfe Discordundan açılan bir kanal üzerinden belirttiğiniz text @everyone atılarak paylaşılır',
      price: '1.800,00',
      numericPrice: 1800,
      periodLabel: 'TL / 1 Ay',
      buttonText: 'Yakında',
      isAvailable: false,
      statusBadge: 'Yakında',
      features: [
        '30 Gün kalıcı özel reklam kanalı',
        'İstediğiniz metin & banner paylaşımı',
        'Çekiliş ekleme imkanı',
        'Sürekli üye akışı & görünürlük',
      ],
    },
  ] as AdditionalService[],

  partnerServers: [
    {
      id: 'server-red-roleplay',
      name: 'Red Roleplay',
      tag: 'FiveM RP',
      members: 'Aktif Topluluk',
      online: '7/24 Aktif',
      badge: 'Resmi Partner',
      verified: true,
      color: 'rose',
      iconLetter: 'RR',
      iconType: 'red-roleplay',
      avatarUrl: '/red-roleplay.png',
      description: 'Wihyfe Discord bot altyapısı ve kesintisiz güvenlik sistemleriyle güçlendirilen resmi FiveM partnerimiz.',
      infrastructure: 'Wihyfe Discord Full Pack',
      discordUrl: 'https://discord.gg/wihyfe',
    },
    {
      id: 'server-cashv-roleplay',
      name: 'CashV Roleplay',
      tag: 'FiveM RP',
      members: 'Aktif Topluluk',
      online: '7/24 Aktif',
      badge: 'Resmi Partner',
      verified: true,
      color: 'purple',
      iconLetter: 'CV',
      iconType: 'cashv-roleplay',
      avatarUrl: '/cashv-logo.webp',
      description: 'Wihyfe Discord bot altyapısı ve kesintisiz güvenlik sistemleriyle güçlendirilen resmi FiveM partnerimiz.',
      infrastructure: 'Wihyfe Discord Full Pack',
      discordUrl: 'https://discord.gg/wihyfe',
    },
  ] as PartnerServer[],
};

export function getPaytrUrl(productId: string, period?: BillingPeriod): string | undefined {
  const bot = SITE_CONFIG.bots.find((b) => b.id === productId);
  if (bot && period && bot.pricing[period]?.paytrUrl) {
    return bot.pricing[period].paytrUrl;
  }
  const website = SITE_CONFIG.websites.find((w) => w.id === productId);
  if (website && period && website.pricing[period]?.paytrUrl) {
    return website.pricing[period].paytrUrl;
  }
  const standalone = SITE_CONFIG.standaloneBots.find((s) => s.id === productId);
  if (standalone?.paytrUrl) {
    return standalone.paytrUrl;
  }
  const service = SITE_CONFIG.additionalServices.find((s) => s.id === productId);
  if (service?.paytrUrl) {
    return service.paytrUrl;
  }
  return undefined;
}
