'use client';

import React, { useState } from 'react';

interface ArchitectureLayer {
  id: string;
  level: string;
  title: string;
  subtitle: string;
  themeColor: string;
  accentBorder: string;
  accentBg: string;
  badge: string;
  features: string[];
  techStack: string[];
  iconSvg: React.ReactNode;
}

const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 'layer-4',
    level: '04',
    title: 'Web Yönetim & E-Ticaret Portalı',
    subtitle: 'Kullanıcı dostu arayüz ve otomatik FiveM market entegrasyonu',
    themeColor: '#38bdf8',
    accentBorder: 'rgba(56, 189, 248, 0.45)',
    accentBg: 'rgba(56, 189, 248, 0.08)',
    badge: 'EN ÜST KATMAN // UI & API',
    features: [
      'Next.js 15 SSR & React 19 ile anında açılan yönetim konsolu',
      'PayTR 3D Secure & Banka Havalesi otomatik teslimat webhooku',
      'Canlı 911 ihbar akışlı Polis MDT / CAD portalı',
      'Oyun içi SQL veritabanına 0-Saniye lisans anahtarı teslimi',
    ],
    techStack: ['Next.js 15', 'Tailwind', 'REST API', 'WebSocket', 'PayTR'],
    iconSvg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: 'layer-3',
    level: '03',
    title: 'Otonom Siber Koruma (Guard Core)',
    subtitle: 'Yetkisiz müdahaleleri 0.01 saniyede engelleyen koruma motoru',
    themeColor: '#fb7185',
    accentBorder: 'rgba(244, 63, 94, 0.45)',
    accentBg: 'rgba(244, 63, 94, 0.08)',
    badge: 'GÜVENLİK KATMANI // HEURISTIC',
    features: [
      'Yetkisiz kanal, rol veya webhook silme girişimlerine anında karşı kilit',
      'Token koruması ve sunucu patlatma (anti-raid) saldırı engelleyici',
      'Saniyede 10.000+ gelen spam isteğini anında filtreleyen kalkan',
      'Yönetici yetkileri suiistimal edildiğinde otomatik karantina',
    ],
    techStack: ['Heuristic AI', 'Anti-Raid', 'Token Guard', 'Auto-Jail'],
    iconSvg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'layer-2',
    level: '02',
    title: 'Bot Otomasyon & İşlem Motoru',
    subtitle: '7/24 Kesintisiz komut dağıtımı ve destek orkestrasyonu',
    themeColor: '#c084fc',
    accentBorder: 'rgba(192, 132, 252, 0.45)',
    accentBg: 'rgba(192, 132, 252, 0.08)',
    badge: 'İŞLEM KATMANI // DISCORD ENGINE',
    features: [
      'Butonlu ve menülü çok kategorili ticket (destek) yönetimi',
      'Otomatik HTML formatında bilet kayıt ve transkript arşivi',
      'Sıfır gecikmeli dinamik ses odası ve kayıt sistemi',
      'Oyun içi rütbeler ile Discord rollerinin 7/24 senkronizasyonu',
    ],
    techStack: ['Discord.js v14', 'Node.js Cluster', 'Voice Engine', 'Transcripts'],
    iconSvg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    id: 'layer-1',
    level: '01',
    title: 'Yüksek Hızlı SQL & Cloudflare Edge',
    subtitle: 'Veri kaybını sıfıra indiren kurumsal bulut altyapısı',
    themeColor: '#34d399',
    accentBorder: 'rgba(52, 211, 153, 0.45)',
    accentBg: 'rgba(52, 211, 153, 0.08)',
    badge: 'TABAN KATMANI // INFRASTRUCTURE',
    features: [
      'FiveM MySQL / PostgreSQL veritabanı ile çift yönlü köprü',
      'Cloudflare R2 üzerinde şifreli otomatik saatlik rol ve kanal yedekleri',
      '3.2 Tbps Voxility Anti-DDoS ağ filtreleme kalkanı',
      'Redis in-memory önbellek ile anında sorgu yanıtı',
    ],
    techStack: ['PostgreSQL', 'Redis Cache', 'Cloudflare R2', 'Voxility DDoS'],
    iconSvg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
];

export default function BotArchitectureExploded() {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-4');

  const selectedLayer = ARCHITECTURE_LAYERS.find((l) => l.id === selectedLayerId) || ARCHITECTURE_LAYERS[0];

  return (
    <section className="section exploded-arch-section" id="bot-mimarisi">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">
            <span className="arch-tag-dot" />
            ÇOK KATMANLI YAZILIM MOTORU
          </div>
          <h2 className="section-title">
            Wihyfe Bot Mimarisi <span className="text-accent">(4 Katmanlı Mühendislik)</span>
          </h2>
          <p className="section-desc">
            Sıradan bir bot değil, her katmanı bağımsız mikroservislerle güçlendirilmiş kurumsal bir yazılım ekosistemi. İncelemek istediğiniz katmana tıklayın.
          </p>
        </div>

        {/* Layered Presentation Stage */}
        <div className="exploded-stage-card">
          <div className="exploded-grid-layout">
            {/* Left Column: Stacked Layer Plates (Never breaks or distorts on hover) */}
            <div className="arch-stack-column">
              {ARCHITECTURE_LAYERS.map((layer) => {
                const isSelected = selectedLayerId === layer.id;

                return (
                  <div
                    key={layer.id}
                    className={`arch-layer-card plate-${layer.id} ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setSelectedLayerId(layer.id)}
                    style={{
                      borderColor: isSelected ? layer.themeColor : 'rgba(255, 255, 255, 0.1)',
                      boxShadow: isSelected
                        ? `0 12px 30px -4px ${layer.accentBorder}, 0 0 20px ${layer.accentBg}`
                        : undefined,
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="arch-card-left">
                      <div
                        className="arch-icon-box"
                        style={{
                          color: layer.themeColor,
                          background: layer.accentBg,
                          borderColor: layer.accentBorder,
                        }}
                      >
                        {layer.iconSvg}
                      </div>

                      <div className="arch-card-info">
                        <div className="arch-card-title-row">
                          <span className="arch-level-pill" style={{ color: layer.themeColor }}>
                            KATMAN {layer.level}
                          </span>
                          <h4 className="arch-card-name">{layer.title}</h4>
                        </div>
                        <p className="arch-card-short-desc">{layer.subtitle}</p>
                      </div>
                    </div>

                    <div className="arch-card-right">
                      <span
                        className="arch-status-indicator"
                        style={{
                          background: isSelected ? layer.themeColor : 'rgba(255, 255, 255, 0.2)',
                          boxShadow: isSelected ? `0 0 10px ${layer.themeColor}` : 'none',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Active Layer Detail Telemetry */}
            <div className="exploded-detail-panel">
              <div className="arch-detail-header">
                <div>
                  <span
                    className="arch-detail-badge"
                    style={{ color: selectedLayer.themeColor, borderColor: selectedLayer.accentBorder }}
                  >
                    {selectedLayer.badge}
                  </span>
                  <h3 className="arch-detail-title">{selectedLayer.title}</h3>
                </div>
                <div className="arch-level-big" style={{ color: selectedLayer.themeColor }}>
                  {selectedLayer.level}
                </div>
              </div>

              <p className="arch-detail-subtitle">{selectedLayer.subtitle}</p>

              {/* Technical Features Checklist */}
              <div className="arch-features-box">
                <h4 className="arch-features-heading">Temel Yetenekler & Çözümler</h4>
                <ul className="arch-features-list">
                  {selectedLayer.features.map((feat, idx) => (
                    <li key={idx} className="arch-feature-item">
                      <span className="arch-check-icon" style={{ color: selectedLayer.themeColor }}>
                        ✓
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Chips */}
              <div className="arch-tech-stack-row">
                <span className="arch-tech-label">Kullanılan Altyapı & Teknolojiler:</span>
                <div className="arch-tech-chips">
                  {selectedLayer.techStack.map((tech, idx) => (
                    <span key={idx} className="arch-tech-chip" style={{ color: selectedLayer.themeColor }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Layer Switcher */}
              <div className="arch-layer-selector-row">
                {ARCHITECTURE_LAYERS.map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    className={`arch-selector-btn ${selectedLayerId === layer.id ? 'active' : ''}`}
                    onClick={() => setSelectedLayerId(layer.id)}
                  >
                    <span>Katman {layer.level}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
