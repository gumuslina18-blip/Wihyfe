'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG } from '@/config/site';
import { useLanguage } from '@/context/LanguageContext';
import PaymentMethodsBar from './PaymentLogos';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);
  const { t, language } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/showcase')) {
    return null;
  }

  return (
    <footer className="site-footer">
      {/* Background Watermark Reflection "WIHYFE" */}
      <div className="footer-watermark-reflection" aria-hidden="true">
        <span>WIHYFE</span>
      </div>

      <div className="container">
        <div className="footer-top">
          {/* Brand Summary */}
          <div className="footer-brand-col">
            <Link
              href="/"
              className="void-brand-link"
              aria-label="Wihyfe"
              onClick={(e) => {
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
            <p className="footer-tagline">
              {t.footer.desc}
            </p>
          </div>

          {/* On-Page Links */}
          <div className="footer-nav-col">
            <span className="footer-col-title">{t.footer.navigation}</span>
            {SITE_CONFIG.navLinks.map((link) => {
              const href = pathname === '/' ? link.href : `/${link.href}`;
              return (
                <Link key={link.href} href={href} className="footer-link">
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Community / Contact */}
          <div className="footer-nav-col">
            <span className="footer-col-title">{language === 'EN' ? 'Community' : 'Topluluk'}</span>
            <a
              href={SITE_CONFIG.brand.discordUrl}
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                style={{ display: 'inline-block', verticalAlign: '-1px', marginRight: '6px' }}
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              {language === 'EN' ? 'Discord Server' : 'Discord Sunucusu'}
            </a>
            <a
              href={SITE_CONFIG.brand.instagramUrl}
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ display: 'inline-block', verticalAlign: '-2px', marginRight: '6px' }}
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              Instagram
            </a>
          </div>

          {/* Legal Links */}
          <div className="footer-nav-col">
            <span className="footer-col-title">{t.footer.legal}</span>
            <Link href="/kullanim-sartlari" className="footer-link">
              {t.footer.terms}
            </Link>
            <Link href="/mesafeli-satis-sozlesmesi" className="footer-link">
              {language === 'EN' ? 'Distance Sales Contract' : 'Mesafeli Satış Sözleşmesi'}
            </Link>
            <Link href="/iade-ve-teslimat-kosullari" className="footer-link">
              {language === 'EN' ? 'Refund & Delivery Terms' : 'İptal, İade & Teslimat'}
            </Link>
            <Link href="/gizlilik-politikasi" className="footer-link">
              {t.footer.privacy}
            </Link>
            <Link href="/cerez-politikasi" className="footer-link">
              {t.footer.cookies}
            </Link>
          </div>
        </div>

        {/* Sol Alt Köşe: Güvenli Ödeme Yöntemleri Görselleri */}
        <PaymentMethodsBar />

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Wihyfe. {t.footer.rights}
          </p>
          <div className="footer-brand-badge">
            <img
              src="/wihyfe-icon.png"
              alt="Wihyfe"
              width={20}
              height={20}
              className="footer-emblem-img"
            />
            <span>{language === 'EN' ? 'Reliable Discord Infrastructure' : 'Güvenilir Discord Altyapısı'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
