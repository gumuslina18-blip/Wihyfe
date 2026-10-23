'use client';

import React, { useState } from 'react';
import { SITE_CONFIG } from '@/config/site';
import { useLanguage } from '@/context/LanguageContext';

interface AudienceCard {
  id: string;
  category: string;
  badge: string;
  title: string;
  headline: string;
  description: string;
  accentColor: string;
  glowBorder: string;
  glowBg: string;
  features: string[];
  metrics: { label: string; value: string };
  ctaText: string;
  ctaHref: string;
  icon: React.ReactNode;
}

export default function TargetAudiencesSection() {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'fivem' | 'discord' | 'software' | 'web'>('all');

  const audiences: AudienceCard[] = [
    {
      id: 'fivem',
      category: 'fivem',
      badge: language === 'TR' ? 'FIVEM & ROLEPLAY' : 'FIVEM & ROLEPLAY',
      title: language === 'TR' ? 'FiveM Sunucu Sahipleri & RP Ekipleri' : 'FiveM Server Owners & RP Teams',
      headline: language === 'TR' ? 'Oyun İçi Canlı Admin Paneli, Ekonomi Denetimi & FiveM Botları' : 'In-Game Live Admin Panel, Economy Control & FiveM Bots',
      description: language === 'TR'
        ? 'FiveM sunucunuzun operasyonunu tek çatı altında toplayın. Oyun içinden canlı oyuncu denetimi, ceza ve envanter müdahalesi, Discord mesai-vardiya botları ve PayTR otomatik donate marketi.'
        : 'Centralize FiveM operations. In-game live player inspection, punishment & inventory management, Discord duty bots, and automated PayTR donate store.',
      accentColor: '#10b981',
      glowBorder: 'rgba(16, 185, 129, 0.45)',
      glowBg: 'rgba(16, 185, 129, 0.08)',
      features: language === 'TR'
        ? [
            'Oyun İçi Canlı Admin & Oyuncu Yönetim Paneli (Ceza/Ban/Kick/Jail)',
            'Canlı Envanter, Para, Kara Para ve Araç Denetimi',
            'Discord Mesai & Vardiya Takip Bot Altyapısı',
            'PayTR 3D Secure Donate & Otomatik Ürün Teslimat Marketi',
            'Polis / İllegal MDT & CAD Portalları ve SQL Senkronu',
          ]
        : [
            'In-Game Live Admin & Player Management (Ban/Kick/Jail)',
            'Live Inventory, Cash, Black Money & Vehicle Auditing',
            'Discord Duty & Shift Tracking Bot Engine',
            'PayTR 3D Secure Donate & Auto-Delivery Web Store',
            'Police / Illegal MDT & CAD Portals with SQL Sync',
          ],
      metrics: {
        label: language === 'TR' ? 'Canlı Senkron' : 'Live Sync',
        value: '< 0.1s SQL',
      },
      ctaText: language === 'TR' ? 'FiveM Paketlerini İncele' : 'Explore FiveM Packages',
      ctaHref: '#paketler',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="4" />
          <line x1="6" y1="12" x2="10" y2="12" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <line x1="15" y1="13" x2="15.01" y2="13" strokeWidth="3" />
          <line x1="18" y1="11" x2="18.01" y2="11" strokeWidth="3" />
        </svg>
      ),
    },
    {
      id: 'discord-community',
      category: 'discord',
      badge: language === 'TR' ? 'DİSCORD TOPLULUKLARI' : 'DISCORD COMMUNITIES',
      title: language === 'TR' ? 'Discord Sunucu Sahipleri & Yöneticileri' : 'Discord Server Owners & Managers',
      headline: language === 'TR' ? '7/24 Kesintisiz Bot Altyapısı & Web Tabanlı Yönetim Konsolu' : '24/7 Resilient Bot Engine & Web Management Console',
      description: language === 'TR'
        ? 'Binlerce üyeli topluluğunuzu çökmeyen, 0-gecikmeli mikroservis altyapısıyla koruyun. Web tarayıcısı üzerinden tek tıkla yetkili denetimi, bilet arşivi ve otonom guard kalkanı.'
        : 'Protect high-traffic communities with zero-downtime microservices. Web-based moderation console, ticket transcripts, and autonomous anti-raid guard.',
      accentColor: '#818cf8',
      glowBorder: 'rgba(129, 140, 248, 0.45)',
      glowBg: 'rgba(129, 140, 248, 0.08)',
      features: language === 'TR'
        ? [
            'Web Tabanlı Canlı Discord Yönetim Konsolu (Tarayıcıdan Denetim)',
            '0.01s Otonom Anti-Raid & Token Guard Güvenlik Kalkanı',
            'Kayıt, Moderasyon & Dinamik Ses Odası Motoru',
            'HTML Transkript Arşivli Butonlu Destek & Ticket Sistemi',
            'Cloudflare R2 Şifreli Saatlik Otomatik Rol/Kanal Yedekleme',
          ]
        : [
            'Web-Based Live Discord Management Console',
            '0.01s Autonomous Anti-Raid & Token Guard Shield',
            'Registration, Moderation & Dynamic Voice Channels',
            'HTML Transcript-Backed Ticket & Support Engine',
            'Cloudflare R2 Hourly Encrypted Role/Channel Backups',
          ],
      metrics: {
        label: language === 'TR' ? 'Kesintisiz Uptime' : 'Active Uptime',
        value: '%99.99',
      },
      ctaText: language === 'TR' ? 'Discord Çözümlerini Gör' : 'View Discord Solutions',
      ctaHref: '#paketler',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 8V5a1 1 0 0 1 1-1h3" />
          <path d="M20 8V5a1 1 0 0 0-1-1h-3" />
          <path d="M4 16v3a1 1 0 0 0 1 1h3" />
          <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      id: 'custom-app',
      category: 'software',
      badge: language === 'TR' ? 'ÖZEL MASAÜSTÜ YAZILIM' : 'CUSTOM DESKTOP SOFTWARE',
      title: language === 'TR' ? 'Kişiye & Projeye Özel Yazılım Arayanlar' : 'Custom App & Software Clients',
      headline: language === 'TR' ? 'Size Özel Windows Masaüstü Uygulamaları & Otomasyon İstemcileri' : 'Tailored Windows Desktop Apps & Automation Clients',
      description: language === 'TR'
        ? 'Piyasada hazır bulunmayan, tamamen sizin gereksinimlerinize göre sıfırdan kodlanan masaüstü uygulamaları, otomasyon araçları, tersine mühendislik korumaları ve özel API köprüleri.'
        : 'Bespoke Windows desktop applications, automation tools, reverse engineering protections, and specialized API bridges engineered from scratch.',
      accentColor: '#f59e0b',
      glowBorder: 'rgba(245, 158, 11, 0.45)',
      glowBg: 'rgba(245, 158, 11, 0.08)',
      features: language === 'TR'
        ? [
            'Özel Windows Masaüstü İstemcileri (C# / C++ / Electron / Rust)',
            'Donanım (HWID) ve Lisans Anahtar Doğrulama Motoru',
            'Tersine Mühendislik, Dump & Bellek Manipülasyon Koruması',
            'Özel Arka Plan Bot & Webhook Otomasyon Sistemleri',
            'Projeye Özel RESTful API & Özel SQL Veritabanı Entegrasyonu',
          ]
        : [
            'Custom Windows Desktop Clients (C# / C++ / Electron / Rust)',
            'Hardware (HWID) & License Key Authorization Engine',
            'Reverse Engineering, Dump & Memory Manipulation Defense',
            'Custom Background Bot & Webhook Automations',
            'Tailored RESTful API & Relational SQL Database Integration',
          ],
      metrics: {
        label: language === 'TR' ? 'Mimari' : 'Architecture',
        value: 'Native / C++',
      },
      ctaText: language === 'TR' ? 'Özel Yazılım Teklifi Al' : 'Request Custom Quote',
      ctaHref: SITE_CONFIG.brand.discordUrl,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      id: 'web-projects',
      category: 'web',
      badge: language === 'TR' ? 'WEB & E-TİCARET' : 'WEB & E-COMMERCE',
      title: language === 'TR' ? 'Web Sitesi, E-Ticaret & Özel Web Portalları' : 'Websites, E-Commerce & Portals',
      headline: language === 'TR' ? 'Next.js 15 Tabanlı Ultra Hızlı Web Siteleri & Satış Sistemleri' : 'Next.js 15 Blazing-Fast Websites & Automated Stores',
      description: language === 'TR'
        ? 'Topluluğunuz veya markanız için prestijli, mobil uyumlu ve yüksek dönüşümlü web sayfaları. PayTR 3D Secure entegreli bağış (donate) marketi ve yönetim portalları.'
        : 'Prestigious, mobile-friendly websites with high conversion. PayTR 3D Secure integrated donate stores and centralized administration portals.',
      accentColor: '#38bdf8',
      glowBorder: 'rgba(56, 189, 248, 0.45)',
      glowBg: 'rgba(56, 189, 248, 0.08)',
      features: language === 'TR'
        ? [
            'Next.js 15 Server-Side Rendered (SSR) & React 19 Modern UI',
            'PayTR 3D Secure / Sanal POS Entegreli Otomatik Donate Marketi',
            'Oyun İçi SQL Veritabanına 0-Saniye Otomatik Lisans & Ürün Teslimi',
            'Mobil Uyumlu Yönetici Konsolu & Detaylı Satış İstatistikleri',
            'Ücretsiz SSL, DDoS Koruması & Cloudflare Global Edge Ağı',
          ]
        : [
            'Next.js 15 Server-Side Rendered (SSR) & React 19 Modern UI',
            'PayTR 3D Secure / Virtual POS Automated Donate Store',
            'Instant 0-Second Delivery to In-Game SQL Database',
            'Responsive Admin Dashboard & Revenue Analytics',
            'Free SSL, DDoS Shield & Cloudflare Global Edge Network',
          ],
      metrics: {
        label: language === 'TR' ? 'Sayfa Yükleme' : 'Load Time',
        value: '< 0.3s SSR',
      },
      ctaText: language === 'TR' ? 'Web Sitelerini İncele' : 'Explore Websites',
      ctaHref: '#websiteler',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      id: 'discord-dashboard-card',
      category: 'discord',
      badge: language === 'TR' ? 'KONSOL & DASHBOARD' : 'CONSOLE & DASHBOARD',
      title: language === 'TR' ? 'Discord Web Yönetim Paneli İsteyenler' : 'Discord Web Dashboard Seekers',
      headline: language === 'TR' ? 'Discord\'a Bağımlı Olmadan Tarayıcıdan Tüm Sunucuyu Yönetin' : 'Manage Your Whole Server via Browser Independently',
      description: language === 'TR'
        ? 'Yetkili ekibinizin performansını, rol değişikliklerini, sunucu loglarını ve ceza kayıtlarını mobil veya bilgisayar tarayıcısından tek tıkla izleyin ve anında müdahale edin.'
        : 'Monitor staff duty, role modifications, server audit logs, and punishments directly from your browser with single-click precision.',
      accentColor: '#f43f5e',
      glowBorder: 'rgba(244, 63, 94, 0.45)',
      glowBg: 'rgba(244, 63, 94, 0.08)',
      features: language === 'TR'
        ? [
            'Yetkili Mesai, Ceza & Komut Kullanım Denetimi',
            'Canlı İstatistikler & Saatlik Aktivite Grafikleri',
            'Tek Tıkla Guard Kurallarını Değiştirme ve Kilit Açma',
            'Geçmiş Biletler & Canlı Log Akışı İncelemesi',
            'Çoklu Yönetici Rol İzin Hiyerarşisi',
          ]
        : [
            'Staff Duty, Punishment & Command Usage Auditing',
            'Live Activity Graphs & Hourly Engagement Analytics',
            'Single-Click Guard Security Rule Tuning',
            'Ticket Transcripts & Real-Time Event Feed',
            'Multi-Tier Role Permission Hierarchy',
          ],
      metrics: {
        label: language === 'TR' ? 'Erişim' : 'Access',
        value: '7/24 Web UI',
      },
      ctaText: language === 'TR' ? 'Panel Paketini İncele' : 'View Dashboard Plan',
      ctaHref: '#paketler',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      ),
    },
    {
      id: 'full-spectrum-software',
      category: 'software',
      badge: language === 'TR' ? 'TÜM YAZILIM ÇÖZÜMLERİ' : 'FULL SOFTWARE SOLUTIONS',
      title: language === 'TR' ? 'Kurumsal & Kapsamlı Altyapı Çözümleri' : 'Enterprise & Full-Spectrum Solutions',
      headline: language === 'TR' ? 'Özel Veritabanı Mimarisi, 3.2 Tbps DDoS Kalkanı & SLA Desteği' : 'Custom Database Architecture, 3.2 Tbps DDoS Shield & SLA',
      description: language === 'TR'
        ? 'Performans darboğazlarını çözen, veritabanınızı optimize eden ve 3.2 Tbps Voxility DDoS korumasıyla projenizi kesintisiz ayakta tutan komple teknik çözüm ortaklığı.'
        : 'End-to-end technical partnership solving bottlenecks, database tuning, and defending your infrastructure with 3.2 Tbps Voxility DDoS filtering.',
      accentColor: '#a855f7',
      glowBorder: 'rgba(168, 85, 247, 0.45)',
      glowBg: 'rgba(168, 85, 247, 0.08)',
      features: language === 'TR'
        ? [
            'Özel SQL Veritabanı Mimarisi (PostgreSQL / MySQL / Redis Caching)',
            'Voxility 3.2 Tbps L3/L4/L7 Gelişmiş DDoS Savunması',
            'Mikroservis Mimarisi & Otomatik Hata Kurtarma Kümesi',
            '7/24 Kesintisiz Kıdemli Yazılım Mühendisi Desteği & SLA',
            'Anahtar Teslim Proje Geliştirme & Canlı Dağıtım',
          ]
        : [
            'Bespoke SQL Database Architecture (PostgreSQL / Redis Caching)',
            'Voxility 3.2 Tbps L3/L4/L7 Advanced DDoS Defense',
            'Microservice Architecture & Auto-Failover Clusters',
            '24/7 Senior Software Engineering Support & SLA',
            'Turnkey Project Engineering & Deployment',
          ],
      metrics: {
        label: language === 'TR' ? 'DDoS Kalkanı' : 'DDoS Shield',
        value: '3.2 Tbps Voxility',
      },
      ctaText: language === 'TR' ? 'Ek Hizmetleri Keşfet' : 'Explore Services',
      ctaHref: '#ek-hizmetler',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
  ];

  const filteredAudiences = activeFilter === 'all'
    ? audiences
    : audiences.filter((a) => a.category === activeFilter);

  return (
    <section className="section target-audiences-section" id="hitap-ettiklerimiz">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
            <span>{language === 'TR' ? 'HEDEF KİTLE & ÇÖZÜM YELPAZESİ' : 'TARGET AUDIENCE & SPECTRUM'}</span>
          </div>

          <h2 className="section-title">
            {language === 'TR' ? 'Wihyfe Nelere & ' : 'Who & What Does '}
            <span className="text-accent">{language === 'TR' ? 'Kimlere Hitap Ediyor?' : 'Wihyfe Cater To?'}</span>
          </h2>

          <p className="section-desc">
            {language === 'TR'
              ? 'Wihyfe yalnızca bir bot sağlayıcısı değildir; FiveM oyun içi yönetiminden özel masaüstü uygulamalarına, web sitelerinden Discord kontrol panellerine kadar tüm yazılım ihtiyaçlarınızı tek noktada karşılar.'
              : 'Wihyfe is not merely a bot platform; we empower FiveM in-game operations, bespoke desktop applications, websites, and community dashboards under one roof.'}
          </p>

          {/* Category Filter Pills */}
          <div className="audiences-filter-pills" role="tablist" aria-label="Kategori Filtresi">
            <button
              type="button"
              className={`audience-filter-btn ${activeFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              <span>{language === 'TR' ? 'Tüm Çözümlerimiz' : 'All Solutions'}</span>
              <span className="filter-count">{audiences.length}</span>
            </button>
            <button
              type="button"
              className={`audience-filter-btn ${activeFilter === 'fivem' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('fivem')}
            >
              <span>FiveM &amp; RP</span>
            </button>
            <button
              type="button"
              className={`audience-filter-btn ${activeFilter === 'discord' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('discord')}
            >
              <span>Discord &amp; Topluluk</span>
            </button>
            <button
              type="button"
              className={`audience-filter-btn ${activeFilter === 'software' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('software')}
            >
              <span>{language === 'TR' ? 'Özel Yazılım' : 'Custom Software'}</span>
            </button>
            <button
              type="button"
              className={`audience-filter-btn ${activeFilter === 'web' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('web')}
            >
              <span>{language === 'TR' ? 'Web & E-Ticaret' : 'Web & E-Commerce'}</span>
            </button>
          </div>
        </div>

        {/* 6 Grid Cards */}
        <div className="audiences-cards-grid">
          {filteredAudiences.map((card) => {
            return (
              <article
                key={card.id}
                className="audience-feature-card"
                style={{
                  '--card-accent': card.accentColor,
                  '--card-border': card.glowBorder,
                  '--card-bg': card.glowBg,
                } as React.CSSProperties}
              >
                {/* Background Ambient Glow */}
                <div className="audience-card-glow" aria-hidden="true" />

                {/* Top Header Row */}
                <div className="audience-card-top">
                  <div className="audience-icon-badge">
                    <span className="audience-icon-box">{card.icon}</span>
                    <span className="audience-badge-pill">{card.badge}</span>
                  </div>

                  <div className="audience-metric-tag">
                    <span className="metric-label">{card.metrics.label}</span>
                    <strong className="metric-val">{card.metrics.value}</strong>
                  </div>
                </div>

                {/* Card Title & Headline */}
                <div className="audience-card-headings">
                  <h3 className="audience-title">{card.title}</h3>
                  <h4 className="audience-headline">{card.headline}</h4>
                </div>

                <p className="audience-description">{card.description}</p>

                {/* Features Checklist */}
                <div className="audience-features-block">
                  <span className="audience-features-label">
                    {language === 'TR' ? 'Öne Çıkan Yetenekler:' : 'Key Capabilities:'}
                  </span>
                  <ul className="audience-checklist">
                    {card.features.map((feat, idx) => (
                      <li key={idx} className="audience-checklist-item">
                        <svg className="audience-check-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer CTA */}
                <div className="audience-card-footer">
                  <a
                    href={card.ctaHref}
                    className="audience-action-btn"
                    target={card.ctaHref.startsWith('http') ? '_blank' : '_self'}
                    rel={card.ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <span>{card.ctaText}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
