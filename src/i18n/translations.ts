export type Language = 'TR' | 'EN';

export interface Translations {
  nav: {
    features: string;
    howItWorks: string;
    pricing: string;
    resources: string;
    readyBots: string;
    webDev: string;
    customServices: string;
    whyUs: string;
    team: string;
    faq: string;
    signIn: string;
    getStarted: string;
    wallet: string;
    cart: string;
    download: string;
  };
  hero: {
    badge: string;
    titleMain: string;
    titleAccent: string;
    titleSuffix: string;
    desc: string;
    exploreBots: string;
    discussProject: string;
    badges: string[];
  };
  packages: {
    badge: string;
    title: string;
    titleAccent: string;
    desc: string;
    periodMonthly: string;
    periodQuarterly: string;
    periodSemiAnnual: string;
    periodAnnual: string;
    addToCart: string;
    mostPopular: string;
    featuresIncluded: string;
    saveBadge: string;
  };
  websites: {
    badge: string;
    title: string;
    titleAccent: string;
    desc: string;
    orderWebsite: string;
    preview: string;
  };
  botCards: {
    badge: string;
    title: string;
    titleAccent: string;
    desc: string;
    addServer: string;
    details: string;
  };
  additionalServices: {
    badge: string;
    title: string;
    titleAccent: string;
    desc: string;
    requestQuote: string;
  };
  whyUs: {
    badge: string;
    title: string;
    titleAccent: string;
    desc: string;
  };
  team: {
    badge: string;
    title: string;
    titleAccent: string;
    desc: string;
  };
  process: {
    badge: string;
    title: string;
    titleAccent: string;
    desc: string;
  };
  workflow: {
    badge: string;
    title: string;
    stepSubtext: string;
    previewBadge: string;
    previewWindows: string;
    sampleData: string;
  };
  featuresSection: {
    title: string;
    desc: string;
    card1: {
      title: string;
      desc: string;
      tags: string[];
    };
    card2: {
      title: string;
      desc: string;
      tags: string[];
    };
    card3: {
      title: string;
      desc: string;
      tags: string[];
    };
    card4: {
      title: string;
      desc: string;
      tags: string[];
    };
  };
  downloadPage: {
    badge: string;
    title: string;
    desc: string;
    verifyAndDownload: string;
    verifying: string;
    termsAgreementPre: string;
    termsLink: string;
    and: string;
    privacyLink: string;
    termsAgreementPost: string;
    card1: {
      step: string;
      title: string;
      desc: string;
    };
    card2: {
      step: string;
      title: string;
      desc: string;
    };
    card3: {
      step: string;
      title: string;
      desc: string;
    };
  };
  faq: {
    badge: string;
    title: string;
    titleAccent: string;
    desc: string;
  };
  dashboardPreview: {
    badge: string;
    title: string;
    desc: string;
    openPanel: string;
    overview: string;
    guardSecurity: string;
    tickets: string;
    automation: string;
    auditLogs: string;
    totalCommands: string;
    blockedThreats: string;
    activeTickets: string;
    protectedMembers: string;
    activityTitle: string;
    distributionTitle: string;
  };
  partners: {
    badge: string;
    title: string;
    titleAccent: string;
    desc: string;
    statServers: string;
    statMembers: string;
    statUptime: string;
    statSecurity: string;
    liveBadge: string;
    verifiedServer: string;
    members: string;
    online: string;
    joinServer: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
    discordButton: string;
  };
  cta: {
    badge: string;
    title: string;
    desc: string;
    joinDiscord: string;
    explorePackages: string;
  };
  footer: {
    desc: string;
    navigation: string;
    legal: string;
    privacy: string;
    terms: string;
    cookies: string;
    rights: string;
  };
  auth: {
    modalTitle: string;
    heading: string;
    desc: string;
    scope1: string;
    scope2: string;
    scope3: string;
    continueDiscord: string;
    quickDemo: string;
    cancel: string;
    logout: string;
  };
}

export const translations: Record<Language, Translations> = {
  TR: {
    nav: {
      features: 'Özellikler',
      howItWorks: 'Nasıl Çalışır?',
      pricing: 'Fiyatlar',
      resources: 'Kaynaklar',
      readyBots: 'Hazır Botlar',
      webDev: 'Web Yazılım',
      customServices: 'Özel Hizmetler',
      whyUs: 'Neden Biz?',
      team: 'Ekibimiz',
      faq: 'Sıkça Sorulanlar',
      signIn: 'Giriş Yap',
      getStarted: 'Hemen Başla',
      wallet: 'Bakiye',
      cart: 'Sepetim',
      download: 'İndir',
    },
    hero: {
      badge: 'YAZILIM & TEKNOLOJİ STÜDYOSU',
      titleMain: 'Gücünü',
      titleAccent: 'Wihyfe İle',
      titleSuffix: 'Açığa Çıkar.',
      desc: 'Discord botlarından FiveM oyun içi admin panellerine, web sitelerinden kişiye özel uygulamalara kadar tüm yazılım çözümleriniz tek çatı altında.',
      exploreBots: 'Çözümleri Keşfet',
      discussProject: 'Projenizi Konuşalım',
      badges: ['7/24 Kesintisiz Aktif', 'Anında Otomatik Kurulum', 'Türkçe & Global Destek'],
    },
    packages: {
      badge: 'YAZILIM ÇÖZÜMLERİ',
      title: 'İhtiyacınıza Özel',
      titleAccent: 'Yazılım & Paketlerimiz',
      desc: 'Discord botları, FiveM yönetim panelleri ve kişiye özel uygulamalarla projenizi bir üst seviyeye taşıyın.',
      periodMonthly: 'Aylık',
      periodQuarterly: '3 Aylık (%15 İndirim)',
      periodSemiAnnual: '6 Aylık (%20 İndirim)',
      periodAnnual: 'Yıllık (%30 İndirim)',
      addToCart: 'Sepete Ekle & Satın Al',
      mostPopular: 'EN POPÜLER',
      featuresIncluded: 'Paket Özellikleri',
      saveBadge: 'İndirimli',
    },
    websites: {
      badge: 'WEB ÇÖZÜMLERİ',
      title: 'Topluluğunuza Özel',
      titleAccent: 'Modern Web Siteleri',
      desc: 'Discord sunucunuz ve projeniz için özel yönetim panelleri, tanıtım sayfaları ve e-ticaret çözümleri.',
      orderWebsite: 'Web Sitesi Satın Al',
      preview: 'Önizle',
    },
    botCards: {
      badge: 'HAZIR BOTLAR',
      title: 'Öne Çıkan',
      titleAccent: 'Bot Çözümlerimiz',
      desc: 'Güvenlikten otomatik kayıta, destek taleplerinden eğlenceye kadar her modül tek altyapıda.',
      addServer: 'Sunucuna Ekle',
      details: 'Detayları İncele',
    },
    additionalServices: {
      badge: 'ÖZEL HİZMETLER',
      title: 'İhtiyacınıza Uygun',
      titleAccent: 'Gelişmiş Çözümler',
      desc: 'Standart paketlerin ötesinde, tamamen projenize özel bot, API ve web geliştirme hizmetleri.',
      requestQuote: 'Teklif Al',
    },
    whyUs: {
      badge: 'NEDEN BİZ?',
      title: 'Wihyfe Ayrıcalığını',
      titleAccent: 'Keşfedin',
      desc: 'Gelişmiş bulut altyapımız, anlık teslimat garantimiz ve uzman kadromuzla sunucunuz emin ellerde.',
    },
    team: {
      badge: 'EKİBİMİZ',
      title: 'Wihyfe Arkasındaki',
      titleAccent: 'Uzman Kadro',
      desc: 'Yılların Discord bot ve yazılım tecrübesine sahip dinamik geliştirici ve yönetim ekibimiz.',
    },
    process: {
      badge: 'SİPARİŞ & KURULUM SÜRECİ',
      title: '3 Kolay Adımda',
      titleAccent: 'Yayındasınız',
      desc: 'Dakikalar içinde botunuzu seçin, sunucunuza davet edin ve hemen kullanmaya başlayın.',
    },
    workflow: {
      badge: 'İŞLEYİŞ & ENTEGRASYON',
      title: 'Nasıl çalışır?',
      stepSubtext: 'Kurulumdan güvenliğe, adım adım.',
      previewBadge: 'Ürün önizlemesi',
      previewWindows: 'Windows',
      sampleData: 'Örnek veriler',
    },
    featuresSection: {
      title: 'Özellikler',
      desc: 'Wihyfe, Discord sunucunuzun güvenliğini, moderasyonunu ve üye etkileşimini en üst düzeye çıkarır. Gelişmiş guard koruması, yapay zeka destekli ticket sistemi ve otomatik moderasyon araçlarıyla topluluğunuzu 7/24 kesintisiz korur ve yönetir.',
      card1: {
        title: 'Guard & Anti-Raid',
        desc: 'İzinsiz rol silme, kanal silme, bot ekleme ve webhook saldırılarını 5ms içinde algılayarak sunucunuzu anında korur ve yetkileri otomatik geri alır.',
        tags: ['Rol & Kanal Koruması', 'Anti-Raid & Spam'],
      },
      card2: {
        title: 'Akıllı Moderasyon',
        desc: 'Reklam engelleyici, küfür & hakaret filtresi, büyük harf ve spam korumasıyla sohbet akışını otomatik denetler ve yetkili ekibinize tam kontrol sağlar.',
        tags: ['Akıllı Filtreler', 'Yetkili Denetimi'],
      },
      card3: {
        title: 'Yedekleme & Loglama',
        desc: 'Sunucunuzdaki tüm rol, kanal, izin ve kullanıcı hareketlerini anlık olarak kaydeder; olası bir felaket anında tek komutla tüm sunucuyu geri yükler.',
        tags: ['Anlık Yedekleme', 'Denetim Kaydı', 'Hızlı Geri Yükleme'],
      },
      card4: {
        title: 'Yapay Zeka Destek Sistemi',
        desc: 'Butonlu ticket sistemi, özel oda yönetimi ve yapay zeka asistanıyla üye taleplerini anında yanıtlayın, transkriptleri otomatik arşivleyin.',
        tags: ['Butonlu Ticket', 'Canlı İletişim', 'Arşiv & Transkript'],
      },
    },
    downloadPage: {
      badge: 'Bot Kurulum Hattı • Wihyfe Gateway',
      title: 'Wihyfe Bot\'u Başlat',
      desc: 'Bot yönetim panelinize bağlanmak veya istemciyi indirmek için 6 karakterlik oturum PIN\'inizi girin.',
      verifyAndDownload: 'Doğrula ve Başlat',
      verifying: 'Doğrulanıyor...',
      termsAgreementPre: '',
      termsLink: 'Hizmet Şartları\'nı',
      and: 've',
      privacyLink: 'Gizlilik Politikası\'nı',
      termsAgreementPost: 'kabul ediyorum.',
      card1: {
        step: '01',
        title: 'Davet Et & İndir',
        desc: 'Sunucuna yetkilendir veya istemciyi al',
      },
      card2: {
        step: '02',
        title: 'Yapılandır & Başlat',
        desc: 'Modülleri ve Guard korumasını aktif et',
      },
      card3: {
        step: '03',
        title: 'Canlı Yönet',
        desc: '7/24 kesintisiz koruma ve komut akışı',
      },
    },
    faq: {
      badge: 'SIKÇA SORULANLAR',
      title: 'Aklınıza Takılan',
      titleAccent: 'Sorular',
      desc: 'Wihyfe botları, web geliştirme ve destek hakkında en çok merak edilen soruların yanıtları.',
    },
    dashboardPreview: {
      badge: 'YÖNETİM PLATFORMU',
      title: 'Bot Yönetim & Kontrol Paneli',
      desc: 'Discord sunucunuzun tüm bot ayarlarını, Guard koruma modüllerini, ticket akışını ve canlı sunucu istatistiklerini web üzerinden anında yapılandırın.',
      openPanel: 'Kontrol panelini aç',
      overview: 'Genel bakış',
      guardSecurity: 'Guard & Güvenlik',
      tickets: 'Destek Talepleri',
      automation: 'Otomasyon',
      auditLogs: 'Log Kayıtları',
      totalCommands: 'İşlenen Komutlar',
      blockedThreats: 'Engellenen Saldırı',
      activeTickets: 'Aktif Ticketlar',
      protectedMembers: 'Korumalı Üyeler',
      activityTitle: 'Bot Aktivitesi',
      distributionTitle: 'Güvenlik Dağılımı',
    },
    partners: {
      badge: 'RESMİ İŞ BİRLİĞİ',
      title: 'Wihyfe Güvencesindeki',
      titleAccent: 'Resmi Partnerimiz',
      desc: 'Wihyfe Discord bot altyapısı ve kesintisiz güvenlik sistemleriyle korunan resmi partner topluluğumuz.',
      statServers: 'Resmi Partner',
      statMembers: 'Wihyfe Bot Altyapısı',
      statUptime: '%99.9 Kesintisiz Uptime',
      statSecurity: '7/24 Kesintisiz Guard',
      liveBadge: 'CANLI ANLAŞMA',
      verifiedServer: 'Doğrulanmış Partner',
      members: 'Üye',
      online: 'Aktif',
      joinServer: 'Sunucuyu İncele',
      ctaTitle: 'Sizin Sunucunuz da Bu Listede Yer Alsın!',
      ctaDesc: 'Sunucunuzu profesyonel Wihyfe botlarıyla donatın, anlaşmalı sunucularımız arasına katılarak ayrıcalıklardan yararlanın.',
      ctaButton: 'İş Birliği & Sunucu Başvurusu Yap',
      discordButton: 'Discord\'umuza Katılın',
    },
    cta: {
      badge: 'HEMEN BAŞLAYIN',
      title: 'Sunucunuzu bir üst seviyeye taşımaya hazır mısınız?',
      desc: 'Wihyfe ile sunucunuzu profesyonelleştirin, üyelerinize benzersiz bir deneyim sunun.',
      joinDiscord: 'Discord Sunucumuza Katılın',
      explorePackages: 'Paketleri İnceleyin',
    },
    footer: {
      desc: 'Discord toplulukları ve projeleri için yeni nesil bot altyapısı, özel yazılım ve web çözümleri sunan güvenilir platform.',
      navigation: 'Gezinme',
      legal: 'Yasal',
      privacy: 'Gizlilik Politikası',
      terms: 'Kullanım Şartları',
      cookies: 'Çerez Politikası',
      rights: 'Tüm hakları saklıdır.',
    },
    auth: {
      modalTitle: 'Discord ile Giriş Yap',
      heading: 'Wihyfe Paneline Bağlanın',
      desc: 'Wihyfe hesabınıza bağlanarak aktif sunucularınızı, bot lisanslarınızı ve fatura geçmişinizi tek tıkla yönetin.',
      scope1: 'Kullanıcı adı, avatar ve Discord ID görüntüleme',
      scope2: 'Yönetici olduğunuz Discord sunucularını listeleme',
      scope3: 'Bot davet yetkisi ve hızlı kurulum izinleri',
      continueDiscord: 'Discord ile Devam Et',
      quickDemo: 'Hızlı Demo Girişi',
      cancel: 'Vazgeç',
      logout: 'Çıkış Yap',
    },
  },
  EN: {
    nav: {
      features: 'Features',
      howItWorks: 'How It Works?',
      pricing: 'Pricing',
      resources: 'Resources',
      readyBots: 'Ready Bots',
      webDev: 'Web Development',
      customServices: 'Custom Services',
      whyUs: 'Why Us?',
      team: 'Our Team',
      faq: 'FAQ',
      signIn: 'Sign In',
      getStarted: 'Get Started',
      wallet: 'Balance',
      cart: 'My Cart',
      download: 'Download',
    },
    hero: {
      badge: 'SOFTWARE & TECHNOLOGY STUDIO',
      titleMain: 'Unleash Your Power With',
      titleAccent: 'Wihyfe.',
      titleSuffix: '',
      desc: 'From high-performance Discord bots to FiveM in-game admin dashboards, bespoke web apps and custom desktop software — all your digital solutions under one roof.',
      exploreBots: 'Explore Solutions',
      discussProject: 'Discuss Your Project',
      badges: ['24/7 High Availability', 'Instant Automated Setup', 'Turkish & Global Support'],
    },
    packages: {
      badge: 'SOFTWARE SOLUTIONS',
      title: 'Engineered For Scale,',
      titleAccent: 'Our Core Packages',
      desc: 'Explore cutting-edge Discord bots, FiveM management dashboards, and bespoke custom applications.',
      periodMonthly: 'Monthly',
      periodQuarterly: '3 Months (15% Off)',
      periodSemiAnnual: '6 Months (20% Off)',
      periodAnnual: 'Annual (30% Off)',
      addToCart: 'Add to Cart & Checkout',
      mostPopular: 'MOST POPULAR',
      featuresIncluded: 'Package Features',
      saveBadge: 'Save',
    },
    websites: {
      badge: 'WEB SOLUTIONS',
      title: 'Tailored for You',
      titleAccent: 'Modern Web Platforms',
      desc: 'Custom management dashboards, community landing pages, and automated e-commerce web applications.',
      orderWebsite: 'Order Website',
      preview: 'Live Preview',
    },
    botCards: {
      badge: 'READY BOTS',
      title: 'Featured',
      titleAccent: 'Bot Solutions',
      desc: 'From server guard to registration, ticketing, and moderation — all powered by our lightning-fast infrastructure.',
      addServer: 'Add to Server',
      details: 'View Details',
    },
    additionalServices: {
      badge: 'CUSTOM SERVICES',
      title: 'Engineered for Scale',
      titleAccent: 'Advanced Solutions',
      desc: 'Beyond ready-made packages: fully customized Discord bot development, API integrations, and cloud architectures.',
      requestQuote: 'Get a Quote',
    },
    whyUs: {
      badge: 'WHY US?',
      title: 'Experience the',
      titleAccent: 'Wihyfe Difference',
      desc: 'With our 99.9% cloud uptime, instant automated setup, and dedicated 24/7 technical team, your community is always protected.',
    },
    team: {
      badge: 'OUR TEAM',
      title: 'The Experts',
      titleAccent: 'Behind Wihyfe',
      desc: 'Our dynamic engineering and infrastructure team brings years of specialized Discord and SaaS experience.',
    },
    process: {
      badge: 'ORDER & SETUP PROCESS',
      title: 'Live in Just',
      titleAccent: '3 Easy Steps',
      desc: 'Select your preferred bot package, invite it to your Discord guild, configure permissions, and launch instantly.',
    },
    workflow: {
      badge: 'WORKFLOW & INTEGRATION',
      title: 'How it works?',
      stepSubtext: 'Step by step, from setup to complete server protection.',
      previewBadge: 'Product preview',
      previewWindows: 'Windows',
      sampleData: 'Sample data',
    },
    featuresSection: {
      title: 'Features',
      desc: 'Wihyfe elevates your Discord server security, moderation, and community engagement. With advanced guard protection, AI-powered ticketing, and automated moderation tools, it secures and powers your server 24/7.',
      card1: {
        title: 'Guard & Anti-Raid',
        desc: 'Detects unauthorized role wipes, channel deletions, malicious bot invites, and webhook floods in under 5ms, immediately reverting unauthorized actions.',
        tags: ['Role & Channel Guard', 'Anti-Raid & Spam'],
      },
      card2: {
        title: 'Smart Moderation',
        desc: 'Automates ad blocking, profanity filtering, caps lock control, and spam prevention while providing your staff team with comprehensive audit tools.',
        tags: ['Smart Filters', 'Staff Audit'],
      },
      card3: {
        title: 'Backups & Audit Logs',
        desc: 'Continuously archives all server roles, channels, permissions, and member events with single-command full server rollback capability.',
        tags: ['Instant Backup', 'Audit Logging', 'Fast Restore'],
      },
      card4: {
        title: 'AI & Ticket System',
        desc: 'Streamline member requests with interactive button tickets, private voice rooms, and AI-driven automated responses with HTML transcript archiving.',
        tags: ['Button Ticket', 'Live Chat', 'Transcript Archive'],
      },
    },
    downloadPage: {
      badge: 'Bot Gateway • Cloud Connection',
      title: 'Launch Wihyfe Bot',
      desc: 'Enter your 6-character session PIN to access your bot dashboard or download the management client.',
      verifyAndDownload: 'Verify & Launch',
      verifying: 'Verifying...',
      termsAgreementPre: 'I accept the ',
      termsLink: 'Terms of Service',
      and: ' and ',
      privacyLink: 'Privacy Policy',
      termsAgreementPost: '.',
      card1: {
        step: '01',
        title: 'Invite & Download',
        desc: 'Authorize on your Discord guild or get client',
      },
      card2: {
        step: '02',
        title: 'Configure & Launch',
        desc: 'Enable Guard modules and bot permissions',
      },
      card3: {
        step: '03',
        title: 'Live Management',
        desc: '24/7 continuous protection and command flow',
      },
    },
    faq: {
      badge: 'FAQ',
      title: 'Frequently Asked',
      titleAccent: 'Questions',
      desc: 'Quick answers to everything you need to know about Wihyfe bots, web development, and support.',
    },
    dashboardPreview: {
      badge: 'MANAGEMENT PLATFORM',
      title: 'Bot Management & Control Panel',
      desc: 'Configure all your Discord bot settings, Guard protection modules, ticket workflows, and live server analytics directly from the web.',
      openPanel: 'Open control panel',
      overview: 'Overview',
      guardSecurity: 'Guard & Security',
      tickets: 'Support Tickets',
      automation: 'Automation',
      auditLogs: 'Audit Logs',
      totalCommands: 'Processed Commands',
      blockedThreats: 'Blocked Threats',
      activeTickets: 'Active Tickets',
      protectedMembers: 'Protected Members',
      activityTitle: 'Bot Activity',
      distributionTitle: 'Security Distribution',
    },
    partners: {
      badge: 'OFFICIAL PARTNERSHIP',
      title: 'Officially Powered by',
      titleAccent: 'Wihyfe',
      desc: 'Our official community partner powered and protected by Wihyfe Discord bot infrastructure and 24/7 security.',
      statServers: 'Official Partner',
      statMembers: 'Wihyfe Bot Infrastructure',
      statUptime: '99.9% Reliable Uptime',
      statSecurity: '24/7 Active Shield',
      liveBadge: 'LIVE PARTNER',
      verifiedServer: 'Verified Community',
      members: 'Members',
      online: 'Online',
      joinServer: 'Visit Community',
      ctaTitle: 'Ready to Put Your Server on This List?',
      ctaDesc: 'Elevate your Discord server with Wihyfe enterprise bots and unlock exclusive partner benefits.',
      ctaButton: 'Apply for Partnership',
      discordButton: 'Join Our Discord',
    },
    cta: {
      badge: 'GET STARTED TODAY',
      title: 'Ready to elevate your Discord community to elite status?',
      desc: 'Automate moderation, simplify ticketing, and give your members the fastest, most reliable experience.',
      joinDiscord: 'Join Our Discord Server',
      explorePackages: 'Explore Plans',
    },
    footer: {
      desc: 'The next-generation platform delivering enterprise-grade Discord bot infrastructure, custom software, and modern web applications.',
      navigation: 'Navigation',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
      rights: 'All rights reserved.',
    },
    auth: {
      modalTitle: 'Sign In with Discord',
      heading: 'Connect to Wihyfe Portal',
      desc: 'Connect your Discord account to manage servers, active bot subscriptions, and billing in one unified dashboard.',
      scope1: 'View username, avatar, and Discord ID',
      scope2: 'List servers where you have administrative access',
      scope3: 'Bot invite privileges and automated installation permissions',
      continueDiscord: 'Continue with Discord',
      quickDemo: 'Quick Demo Login',
      cancel: 'Cancel',
      logout: 'Logout',
    },
  },
};
