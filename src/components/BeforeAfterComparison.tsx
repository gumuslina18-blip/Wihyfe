'use client';

import React, { useState } from 'react';

export default function BeforeAfterComparison() {
  // Mode: 'BEFORE' (only before focused), 'COMPARE' (50/50 side by side), 'AFTER' (only after focused)
  const [viewMode, setViewMode] = useState<'BEFORE' | 'COMPARE' | 'AFTER'>('COMPARE');

  return (
    <section className="section before-after-section" id="karsilastirma">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">
            <span className="before-after-tag-dot" />
            İNTERAKTİF DÖNÜŞÜM TESTİ
          </div>
          <h2 className="section-title">
            Wihyfe Öncesi <span className="text-accent">vs. Wihyfe Sonrası</span>
          </h2>
          <p className="section-desc">
            Sunucunuzun güvenliğini ve operasyonunu tesadüflere bırakmayın. İki durum arasındaki farkı yan yana veya tek tek inceleyin.
          </p>

          {/* Mode Switcher Buttons */}
          <div className="before-after-mode-selector" role="tablist" aria-label="Karşılaştırma Modu">
            <button
              type="button"
              className={`ba-mode-btn mode-danger ${viewMode === 'BEFORE' ? 'active' : ''}`}
              onClick={() => setViewMode('BEFORE')}
            >
              <span className="mode-btn-dot red" />
              <span>⚠️ Wihyfe Öncesi (Kaos)</span>
            </button>

            <button
              type="button"
              className={`ba-mode-btn mode-compare ${viewMode === 'COMPARE' ? 'active' : ''}`}
              onClick={() => setViewMode('COMPARE')}
            >
              <span className="mode-btn-dot cyan" />
              <span>⚖️ Yan Yana Karşılaştır (Önerilen)</span>
            </button>

            <button
              type="button"
              className={`ba-mode-btn mode-success ${viewMode === 'AFTER' ? 'active' : ''}`}
              onClick={() => setViewMode('AFTER')}
            >
              <span className="mode-btn-dot green" />
              <span>✓ Wihyfe Gücü (Tam Güvence)</span>
            </button>
          </div>
        </div>

        {/* Side-by-Side Dual Card Grid (Never overlaps text) */}
        <div className={`ba-dual-grid view-${viewMode.toLowerCase()}`}>
          {/* 1. LEFT CARD: BEFORE (WIHYFE ÖNCESİ) */}
          {(viewMode === 'COMPARE' || viewMode === 'BEFORE') && (
            <div className={`ba-card-box card-before ${viewMode === 'BEFORE' ? 'is-full-focus' : ''}`}>
              <div className="card-top-indicator danger-glow">
                <div className="ba-badge-pill badge-danger">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>WİHYFE ÖNCESİ • SAVUNMASIZ</span>
                </div>
                <span className="ba-state-tag text-rose">YÜKSEK RİSK</span>
              </div>

              <h3 className="ba-panel-title text-rose">Dağınık &amp; Güvensiz Altyapı</h3>
              <p className="ba-panel-desc">
                Sürekli çöken dağınık botlar, FiveM oyun içi admin ve envanter yönetim eksikliği, manuel satış karmaşası ve korumasız yazılımlar.
              </p>

              {/* Metrics Grid */}
              <div className="ba-stats-grid">
                <div className="ba-stat-item">
                  <span className="stat-label">Sistem Uptime</span>
                  <strong className="stat-num text-rose">%48.2 (Sık Çöküyor)</strong>
                </div>
                <div className="ba-stat-item">
                  <span className="stat-label">FiveM &amp; Bot Yönetimi</span>
                  <strong className="stat-num text-amber">Manuel / Hantal</strong>
                </div>
                <div className="ba-stat-item">
                  <span className="stat-label">Saldırı Koruması</span>
                  <strong className="stat-num text-rose">YOK (Savunmasız)</strong>
                </div>
                <div className="ba-stat-item">
                  <span className="stat-label">Rol &amp; SQL Yedekleme</span>
                  <strong className="stat-num text-rose">Sıfır Güvence</strong>
                </div>
              </div>

              {/* Feature Checklist (Danger) */}
              <div className="ba-problems-list">
                <div className="ba-problem-row">
                  <span className="ba-cross-icon">✕</span>
                  <span>Bir yetkili hesabı çalındığında tüm sunucu kanalları ve rolleri silinebilir</span>
                </div>
                <div className="ba-problem-row">
                  <span className="ba-cross-icon">✕</span>
                  <span>FiveM sunucusunda hile ve yetkisiz müdahalelere oyun içi anında müdahale edilemez</span>
                </div>
                <div className="ba-problem-row">
                  <span className="ba-cross-icon">✕</span>
                  <span>Manuel IBAN kontrolü sebebiyle saatlerce mağdur olan oyuncular ve müşteriler</span>
                </div>
                <div className="ba-problem-row">
                  <span className="ba-cross-icon">✕</span>
                  <span>Oyun içi yetkiler ile Discord rolleri arasında sürekli kopan senkronizasyon</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. RIGHT CARD: AFTER (WIHYFE SONRASI) */}
          {(viewMode === 'COMPARE' || viewMode === 'AFTER') && (
            <div className={`ba-card-box card-after ${viewMode === 'AFTER' ? 'is-full-focus' : ''}`}>
              <div className="card-top-indicator success-glow">
                <div className="ba-badge-pill badge-success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>WİHYFE İLE • TAM GÜVENCE</span>
                </div>
                <span className="ba-state-tag text-emerald">7/24 AKTİF KORUMA</span>
              </div>

              <h3 className="ba-panel-title text-emerald">Entegre &amp; Güçlü Yazılım Ekosistemi</h3>
              <p className="ba-panel-desc">
                FiveM oyun içi canlı admin paneli, kesintisiz Discord bot altyapısı, web kontrol konsolu ve PayTR 0-saniye otomatik market teslimatı.
              </p>

              {/* Metrics Grid */}
              <div className="ba-stats-grid">
                <div className="ba-stat-item">
                  <span className="stat-label">Sistem Uptime</span>
                  <strong className="stat-num text-emerald">%99.99 (Kesintisiz)</strong>
                </div>
                <div className="ba-stat-item">
                  <span className="stat-label">FiveM &amp; Bot Yönetimi</span>
                  <strong className="stat-num text-cyan">0.02s Anlık Senkron</strong>
                </div>
                <div className="ba-stat-item">
                  <span className="stat-label">Saldırı Koruması</span>
                  <strong className="stat-num text-emerald">3.2 Tbps Hexagon Shield</strong>
                </div>
                <div className="ba-stat-item">
                  <span className="stat-label">Rol &amp; SQL Yedekleme</span>
                  <strong className="stat-num text-cyan">Anlık R2 Şifreleme</strong>
                </div>
              </div>

              {/* Feature Checklist (Success) */}
              <div className="ba-solutions-list">
                <div className="ba-solution-row">
                  <span className="ba-check-icon">✓</span>
                  <span>FiveM Oyun İçi Canlı Admin Paneli ile tek tıkla oyuncu, ban, kick ve ekonomi denetimi</span>
                </div>
                <div className="ba-solution-row">
                  <span className="ba-check-icon">✓</span>
                  <span>PayTR 3D Secure ile 0 saniyede oyun içi SQL veritabanına VIP/Donate teslimi</span>
                </div>
                <div className="ba-solution-row">
                  <span className="ba-check-icon">✓</span>
                  <span>Yetkisiz webhook veya kanal silme girişimlerinde 0.01 saniyede otomatik kilit</span>
                </div>
                <div className="ba-solution-row">
                  <span className="ba-check-icon">✓</span>
                  <span>Web Yönetim Paneli ile tarayıcı üzerinden canlı loglar ve yetki yapılandırması</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
