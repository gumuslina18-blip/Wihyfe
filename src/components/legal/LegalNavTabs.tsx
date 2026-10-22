'use client';

import Link from 'next/link';

interface LegalNavTabsProps {
  activeTab: 'terms' | 'privacy' | 'cookies' | 'distance-sales' | 'refund-delivery';
}

export default function LegalNavTabs({ activeTab }: LegalNavTabsProps) {
  const tabs = [
    {
      id: 'terms',
      label: 'Kullanım Şartları',
      href: '/kullanim-sartlari',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      id: 'distance-sales',
      label: 'Mesafeli Satış Sözleşmesi',
      href: '/mesafeli-satis-sozlesmesi',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M9 14l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'refund-delivery',
      label: 'İptal, İade & Teslimat',
      href: '/iade-ve-teslimat-kosullari',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'privacy',
      label: 'Gizlilik (KVKK)',
      href: '/gizlilik-politikasi',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      id: 'cookies',
      label: 'Çerez Politikası',
      href: '/cerez-politikasi',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 1 10 10c0 1.5-.5 3-1.5 4" />
          <path d="m8.5 8.5.01 0" />
          <path d="m15.5 8.5.01 0" />
          <path d="m9.5 15.5.01 0" />
          <path d="m14.5 14.5.01 0" />
          <path d="m12 11.5.01 0" />
        </svg>
      ),
    },
  ];

  return (
    <div className="legal-tabs-wrapper">
      <div className="legal-tabs-bar">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`legal-tab-item ${isActive ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {isActive && <span className="tab-active-glow" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
