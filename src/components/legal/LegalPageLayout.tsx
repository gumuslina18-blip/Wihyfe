'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LegalNavTabs from './LegalNavTabs';
import { SITE_CONFIG } from '@/config/site';

export interface TocItem {
  id: string;
  number: string;
  title: string;
}

export interface SummaryCard {
  icon: string;
  title: string;
  desc: string;
}

interface LegalPageLayoutProps {
  activeTab: 'terms' | 'privacy' | 'cookies' | 'distance-sales' | 'refund-delivery';
  badge: string;
  title: string;
  description: string;
  lastUpdated: string;
  version: string;
  readingTime: string;
  summaryCards: SummaryCard[];
  tableOfContents: TocItem[];
  children: React.ReactNode;
}

export default function LegalPageLayout({
  activeTab,
  badge,
  title,
  description,
  lastUpdated,
  version,
  readingTime,
  summaryCards,
  tableOfContents,
  children,
}: LegalPageLayoutProps) {
  const [activeHeadingId, setActiveHeadingId] = useState<string>(tableOfContents[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Track active section for sidebar table of contents
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      for (let i = tableOfContents.length - 1; i >= 0; i--) {
        const item = tableOfContents[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveHeadingId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="legal-page-container">
      <div className="container">
        <div className="legal-inner-wrap">
          {/* Breadcrumb Navigation */}
          <nav className="legal-breadcrumb" aria-label="Gezinme Yolu">
            <Link href="/">Ana Sayfa</Link>
            <span className="crumb-sep">/</span>
            <span>Yasal Merkez</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">{title}</span>
          </nav>

          {/* Hero Header */}
          <header className="legal-hero-section">
            <div className="legal-hero-top-row">
              <div className="legal-badge-pill">
                <span className="live-pulse-dot" />
                <span>{badge}</span>
              </div>
              <div className="legal-quick-actions">
                <button
                  type="button"
                  className="legal-action-btn"
                  onClick={handleCopyLink}
                  title="Bağlantıyı Kopyala"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>{copiedLink ? 'Kopyalandı!' : 'Bağlantıyı Paylaş'}</span>
                </button>
                <button
                  type="button"
                  className="legal-action-btn"
                  onClick={handlePrint}
                  title="Sayfayı Yazdır veya PDF Kaydet"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  <span>Yazdır / PDF</span>
                </button>
              </div>
            </div>

            <h1 className="legal-main-title">{title}</h1>
            <p className="legal-hero-sub">{description}</p>

            <div className="legal-meta-bar">
              <span className="legal-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Son Güncelleme: {lastUpdated}
              </span>
              <span className="legal-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                </svg>
                Sürüm: {version}
              </span>
              <span className="legal-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 14 14" />
                </svg>
                Tahmini: {readingTime}
              </span>
              <span className="legal-meta-item legal-meta-verified">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Yürürlükte &amp; Güncel
              </span>
            </div>
          </header>

          {/* Legal Document Navigation Tabs */}
          <LegalNavTabs activeTab={activeTab} />

          {/* Executive Summary Highlights */}
          {summaryCards && summaryCards.length > 0 && (
            <div className="legal-summary-section">
              <div className="legal-summary-header">
                <span className="legal-summary-tag">Hızlı Bakış</span>
                <h3 className="legal-summary-title">Özet Prensipler</h3>
              </div>
              <div className="legal-summary-grid">
                {summaryCards.map((card, idx) => (
                  <div key={idx} className="legal-summary-card">
                    <span className="summary-card-icon">{card.icon}</span>
                    <h4 className="summary-card-title">{card.title}</h4>
                    <p className="summary-card-desc">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Two-Column Layout: Sidebar TOC + Main Content */}
          <div className="legal-layout-grid">
            {/* Sticky Sidebar Navigation */}
            <aside className="legal-sidebar-sticky">
              <div className="legal-sidebar-panel">
                <div className="legal-sidebar-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  <span>İçindekiler</span>
                </div>

                {/* Table of Contents Links */}
                <nav className="legal-toc-list" aria-label="Sayfa İçi Gezinme">
                  {tableOfContents.map((item) => {
                    const isActive = activeHeadingId === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`legal-toc-item ${isActive ? 'is-active' : ''}`}
                      >
                        <span className="toc-num">{item.number}</span>
                        <span className="toc-text">{item.title}</span>
                      </a>
                    );
                  })}
                </nav>

                {/* Direct Contact Card inside Sidebar */}
                <div className="legal-sidebar-help-box">
                  <div className="sidebar-help-icon">⚖️</div>
                  <div className="sidebar-help-text">
                    <strong>Hukuki Danışma</strong>
                    <span>Sorularınız veya veri talepleriniz için destek ekibimizle görüşün.</span>
                  </div>
                  <a
                    href={SITE_CONFIG.brand.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="legal-sidebar-help-btn"
                  >
                    Discord Destek Masası
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Article Document */}
            <main className="legal-content-column">
              <article className="legal-article-card">
                {children}

                {/* Bottom Assistance Banner */}
                <div className="legal-support-card">
                  <div className="legal-support-info">
                    <h4>Wihyfe Hukuki Süreçleri Hakkında Bilgi mi Almak İstiyorsunuz?</h4>
                    <p>
                      Sözleşme maddelerimiz, lisanslama şartlarımız veya kişisel veri güvenliği hakkında dilediğiniz zaman Discord sunucumuz üzerinden destek bileti açabilirsiniz.
                    </p>
                  </div>
                  <div className="legal-support-actions">
                    <a
                      href={SITE_CONFIG.brand.discordUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                    >
                      <span>7/24 Discord Destek Masası</span>
                    </a>
                    <Link href="/" className="btn btn-sm btn-ghost">
                      <span>Ana Sayfaya Dön</span>
                    </Link>
                  </div>
                </div>
              </article>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
