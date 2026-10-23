'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG } from '@/config/site';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import ProfileMenu from './ProfileMenu';

interface CategoryItem {
  href: string;
  title: string;
  desc: string;
  badge?: string;
  icon: React.ReactNode;
}

const SERVICE_CATEGORIES: CategoryItem[] = [
  {
    href: '#paketler',
    title: 'Paketlerimiz',
    desc: 'Hazır bot paketleri & gelişmiş altyapılar',
    badge: 'Popüler',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    href: '#websiteler',
    title: 'Web Siteler',
    desc: 'Özel tasarım & anahtar teslim siteler',
    badge: 'Yeni',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    href: '#canli-vitrin',
    title: '3D Canlı Vitrin',
    desc: 'İnteraktif 3D & responsive web demosu',
    badge: '3D Canlı',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
      </svg>
    ),
  },
  {
    href: '#botlar',
    title: 'Botlarımız',
    desc: 'Ticket, Guard, Moderasyon & Özel Çözümler',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8" y2="16" />
        <line x1="16" y1="16" x2="16" y2="16" />
      </svg>
    ),
  },
  {
    href: '#ek-hizmetler',
    title: 'Ek Hizmetler',
    desc: 'Yetkili Takip, Koruma & Güvenlik Çözümleri',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    href: '#ilanlar',
    title: 'Topluluk İlanları',
    desc: 'Reklam, Tanıtım & Çekiliş Sponsorlukları',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 11 18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    ),
  },
];

const DISCOVERY_CATEGORIES: CategoryItem[] = [
  {
    href: '#neden-wihyfe',
    title: 'Neden Wihyfe?',
    desc: 'Yüksek performans & 7/24 kesintisiz destek',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    href: '#ekibimiz',
    title: 'Ekibimiz',
    desc: 'Yönetim ve geliştirici kadromuz',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '#surec',
    title: 'Sipariş & Kurulum Süreci',
    desc: '3 adımlı sipariş ve anında teslimat süreci',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    href: '#sss',
    title: 'Sıkça Sorulanlar',
    desc: 'Sıkça sorulan sorular & merak edilen detaylar',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { language: currentLang, setLanguage: setCurrentLang, t } = useLanguage();
  const [activeSection, setActiveSection] = useState('#hero');
  const pathname = usePathname();
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const {
    cartCount,
    setIsCartOpen,
    balanceFormatted,
    setIsDepositModalOpen,
    setIsLoginModalOpen,
    loginWithDiscord,
    isLoggedIn,
    user,
  } = useStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesOpen(false);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCategoriesOpen(false);
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (pathname !== '/') {
        return;
      }

      // If user reaches near the bottom of the page, activate FAQ
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) {
        setActiveSection('#sss');
        return;
      }

      // Ordered list of section IDs from top to bottom
      const sectionIds = [
        'hero',
        'ozellikler',
        'paketler',
        'websiteler',
        'ek-hizmetler',
        'ilanlar',
        'neden-wihyfe',
        'kontrol-paneli',
        'nasil-calisir',
        'ekibimiz',
        'surec',
        'sss',
        'partnerler',
      ];

      const scrollPosition = window.scrollY + 180;

      let current = '';
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            current = `#${sectionIds[i]}`;
            break;
          }
        }
      }

      if (current) {
        setActiveSection(current);
      } else {
        setActiveSection('#hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  const openCart = () => {
    setIsCartOpen(true);
    closeMenu();
  };

  // Only highlight "Kaynaklar" when one of the dropdown's sub-sections is in view
  const isAnyCategoryActive = [
    '#websiteler',
    '#canli-vitrin',
    '#botlar',
    '#ek-hizmetler',
    '#neden-wihyfe',
    '#ekibimiz',
    '#surec',
  ].includes(activeSection);

  const getSectionHref = (hash: string) => (pathname === '/' ? hash : `/${hash}`);

  // Hide public navigation header completely when inside dedicated /admin management panel or /showcase iframe
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/showcase')) {
    return null;
  }

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`} id="site-header">
      <div className="void-header-capsule">
        {/* Brand Logo - Official Wihyfe Icon & Wordmark */}
        <Link
          href="/"
          className="void-brand-link"
          aria-label="Wihyfe Ana Sayfası"
          onClick={(e) => {
            closeMenu();
            if (pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <div className="void-brand-icon-box">
            <img
              src="/wihyfe-icon.png"
              alt="Wihyfe Logo"
              width={28}
              height={28}
              className="void-brand-icon-img"
            />
          </div>
          <span className="void-brand-title">wihyfe</span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="void-nav-links" aria-label="Ana Menü">
          <a
            href={pathname === '/' ? '#ozellikler' : '/#ozellikler'}
            className={`void-nav-item ${activeSection === '#ozellikler' ? 'active' : ''}`}
            onClick={() => setIsCategoriesOpen(false)}
          >
            {t.nav.features}
          </a>

          <a
            href={pathname === '/' ? '#nasil-calisir' : '/#nasil-calisir'}
            className={`void-nav-item ${activeSection === '#nasil-calisir' ? 'active' : ''}`}
            onClick={() => setIsCategoriesOpen(false)}
          >
            {t.nav.howItWorks}
          </a>

          <a
            href={pathname === '/' ? '#paketler' : '/#paketler'}
            className={`void-nav-item ${activeSection === '#paketler' ? 'active' : ''}`}
            onClick={() => setIsCategoriesOpen(false)}
          >
            {t.nav.pricing}
          </a>

          <Link
            href="/indir"
            className={`void-nav-item ${pathname === '/indir' ? 'active' : ''}`}
            onClick={() => setIsCategoriesOpen(false)}
          >
            {t.nav.download}
          </Link>

          <a
            href={pathname === '/' ? '#sss' : '/#sss'}
            className={`void-nav-item ${activeSection === '#sss' ? 'active' : ''}`}
            onClick={() => setIsCategoriesOpen(false)}
          >
            {t.nav.faq}
          </a>

          {/* Kaynaklar Dropdown Trigger */}
          <div className="nav-categories-wrapper" ref={categoriesDropdownRef}>
            <button
              type="button"
              className={`void-nav-dropdown-btn ${isCategoriesOpen ? 'is-active' : ''} ${isAnyCategoryActive ? 'section-active' : ''}`}
              onClick={() => setIsCategoriesOpen((prev) => !prev)}
              aria-expanded={isCategoriesOpen}
              aria-haspopup="true"
              id="categories-dropdown-trigger"
            >
              <span>{t.nav.resources}</span>
              <svg
                className={`void-chevron ${isCategoriesOpen ? 'rotate' : ''}`}
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown Panel */}
            {isCategoriesOpen && (
              <div className="nav-categories-dropdown" role="menu" aria-labelledby="categories-dropdown-trigger">
                <div className="categories-dropdown-grid">
                  {/* Kolon 1: Hizmetler & Çözümler */}
                  <div className="cat-dropdown-col">
                    <div className="cat-col-heading">
                      <span className="cat-col-dot" />
                      <span>Hizmetler &amp; Çözümler</span>
                    </div>
                    <div className="cat-col-list">
                      {SERVICE_CATEGORIES.map((item) => (
                        <a
                          key={item.href}
                          href={getSectionHref(item.href)}
                          className={`dropdown-cat-item ${activeSection === item.href ? 'item-active' : ''}`}
                          onClick={() => setIsCategoriesOpen(false)}
                          role="menuitem"
                        >
                          <div className="cat-item-icon-box">{item.icon}</div>
                          <div className="cat-item-content">
                            <div className="cat-item-top">
                              <span className="cat-item-title">{item.title}</span>
                              {item.badge && <span className="cat-item-badge">{item.badge}</span>}
                            </div>
                            <span className="cat-item-desc">{item.desc}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Kolon 2: Keşfet & Rehber */}
                  <div className="cat-dropdown-col">
                    <div className="cat-col-heading">
                      <span className="cat-col-dot dot-cyan" />
                      <span>Keşfet &amp; Rehber</span>
                    </div>
                    <div className="cat-col-list">
                      {DISCOVERY_CATEGORIES.map((item) => (
                        <a
                          key={item.href}
                          href={getSectionHref(item.href)}
                          className={`dropdown-cat-item ${activeSection === item.href ? 'item-active' : ''}`}
                          onClick={() => setIsCategoriesOpen(false)}
                          role="menuitem"
                        >
                          <div className="cat-item-icon-box">{item.icon}</div>
                          <div className="cat-item-content">
                            <div className="cat-item-top">
                              <span className="cat-item-title">{item.title}</span>
                            </div>
                            <span className="cat-item-desc">{item.desc}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Alt Hızlı Bar (Animasyonlu & Sembollü) */}
                <div className="dropdown-footer-row">

                  <a
                    href="https://discord.gg/SbrKk6Q87H"
                    className="cat-footer-link discord-accent"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsCategoriesOpen(false)}
                  >
                    <span className="footer-link-symbol">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                    </span>
                    <span>Discord Destek</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions - Wihyfe Capsule Style */}
        <div className="void-header-right">
          {/* Language Selector (文A) */}
          <div className="void-lang-wrap" ref={langDropdownRef}>
            <button
              type="button"
              className="void-lang-btn"
              onClick={() => setIsLangOpen((prev) => !prev)}
              aria-label="Dil Değiştir"
              title={`Dil: ${currentLang}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 8 6 6" />
                <path d="m4 14 6-6 2-3" />
                <path d="M2 5h12" />
                <path d="M7 2h1" />
                <path d="m22 22-5-10-5 10" />
                <path d="M14 18h6" />
              </svg>
            </button>

            {isLangOpen && (
              <div className="void-lang-menu">
                <button
                  type="button"
                  className={`void-lang-item ${currentLang === 'TR' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentLang('TR');
                    setIsLangOpen(false);
                  }}
                >
                  <span className="void-lang-code-badge">TR</span>
                  <span>Türkçe</span>
                </button>
                <button
                  type="button"
                  className={`void-lang-item ${currentLang === 'EN' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentLang('EN');
                    setIsLangOpen(false);
                  }}
                >
                  <span className="void-lang-code-badge">EN</span>
                  <span>English</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Wallet Button (Sadece giriş yapılmışsa gösterilir) */}
          {isLoggedIn && user && (
            <button
              type="button"
              className="void-icon-pill"
              onClick={() => setIsDepositModalOpen(true)}
              title="Cüzdan Bakiyesi"
              aria-label="Bakiye"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
                <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
              </svg>
              <span className="void-balance-amount">{balanceFormatted}</span>
            </button>
          )}

          {/* Quick Cart Button */}
          <button
            type="button"
            id="header-cart-btn"
            className="void-icon-pill void-cart-pill"
            onClick={openCart}
            title="Alışveriş Sepeti"
            aria-label="Sepet"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && <span className="void-cart-count">{cartCount}</span>}
          </button>

          {/* Divider */}
          <div className="void-divider" aria-hidden="true" />

          {/* Discord Login Button */}
          {!isLoggedIn ? (
            <button
              type="button"
              className="void-discord-login-btn"
              onClick={() => setIsLoginModalOpen(true)}
              title={t.nav.signIn}
              aria-label={t.nav.signIn}
            >
              <svg className="void-discord-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span className="void-discord-label">{t.nav.signIn}</span>
            </button>
          ) : (
            <ProfileMenu />
          )}

          {/* Müşteri Paneli CTA Button */}
          <Link
            href="/panel"
            className="void-cta-btn void-cta-panel-btn"
            onClick={() => setIsCategoriesOpen(false)}
            title="Müşteri Paneli"
            aria-label="Müşteri Paneli"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className={`mobile-toggle ${isMenuOpen ? 'is-active' : ''}`}
            type="button"
            aria-label="Menüyü aç/kapat"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-drawer"
            onClick={toggleMenu}
          >
            <div className="mobile-toggle-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-drawer ${isMenuOpen ? 'is-open' : ''}`} id="mobile-drawer" aria-label="Mobil Menü">
        <div className="mobile-cart-wrap">
          {isLoggedIn && user && (
            <button
              type="button"
              className="btn btn-secondary btn-block header-mobile-balance-btn"
              onClick={() => {
                closeMenu();
                setIsDepositModalOpen(true);
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                  <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                  <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
                  <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                </svg>
                <span>Bakiye: {balanceFormatted}</span>
              </span>
              <span className="badge-plus">+ Yükle</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-block header-mobile-cart-btn"
            onClick={() => {
              closeMenu();
              setIsCartOpen(true);
            }}
          >
            <svg
              className="header-cart-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>Sepetim ({cartCount})</span>
          </button>
        </div>

        <Link
          href="/"
          className={`nav-link ${pathname === '/' && activeSection === '#hero' ? 'active' : ''}`}
          onClick={(e) => {
            closeMenu();
            if (pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          Ana Sayfa
        </Link>

        <div className="mobile-drawer-categories">
          <div className="mobile-cat-group-title">Hizmetler &amp; Çözümler</div>
          {SERVICE_CATEGORIES.map((item) => (
            <a
              key={item.href}
              href={getSectionHref(item.href)}
              className={`mobile-cat-link ${activeSection === item.href ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="mobile-cat-icon">{item.icon}</span>
              <span className="mobile-cat-text">{item.title}</span>
              {item.badge && <span className="cat-item-badge">{item.badge}</span>}
            </a>
          ))}

          <div className="mobile-cat-group-title" style={{ marginTop: '0.85rem' }}>Keşfet &amp; Rehber</div>
          {DISCOVERY_CATEGORIES.map((item) => (
            <a
              key={item.href}
              href={getSectionHref(item.href)}
              className={`mobile-cat-link ${activeSection === item.href ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="mobile-cat-icon">{item.icon}</span>
              <span className="mobile-cat-text">{item.title}</span>
            </a>
          ))}
        </div>

        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link
            href="/indir"
            className="nav-link cust-nav-link"
            onClick={closeMenu}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{t.nav.download} (İstemci İndir)</span>
          </Link>

          <a
            href="https://discord.gg/SbrKk6Q87H"
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
          >
            <svg
              className="header-discord-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span>Discord’a Katıl</span>
          </a>
        </div>
      </div>
    </header>
  );
}
