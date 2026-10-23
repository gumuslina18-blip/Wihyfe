'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Process() {
  const { t, language } = useLanguage();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      num: '01',
      title: language === 'EN' ? 'Share Your Project' : 'İhtiyacını paylaş',
      desc: language === 'EN'
        ? 'Tell us your FiveM, Discord, web, or custom software requirements.'
        : 'FiveM, Discord, web sitesi veya özel yazılım taleplerini bize aktar.',
      phaseBadge: language === 'EN' ? 'Phase 01 • Consultation' : 'Aşama 01 • Danışma & Talep',
      accentColor: '#0878FF',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 9h8" />
          <path d="M8 13h5" />
        </svg>
      ),
    },
    {
      num: '02',
      title: language === 'EN' ? 'Tailored Architecture' : 'Çözümü netleştirelim',
      desc: language === 'EN'
        ? 'We customize the panel, bot, or web application architecture together.'
        : 'Size özel panel, bot veya yazılım mimarisini ve özelliklerini belirleyelim.',
      phaseBadge: language === 'EN' ? 'Phase 02 • Architecture' : 'Aşama 02 • Mimari & Kodlama',
      accentColor: '#38bdf8',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="14" x2="23" y2="14" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="14" x2="4" y2="14" />
        </svg>
      ),
    },
    {
      num: '03',
      title: language === 'EN' ? 'Deploy & Launch Live' : 'Anında yayına al',
      desc: language === 'EN'
        ? 'Automatic setup, web console access, and 24/7 technical engineering support.'
        : 'Otomatik kurulum, web paneli erişimi ve 7/24 destekle hemen kullanmaya başla.',
      phaseBadge: language === 'EN' ? 'Phase 03 • Deployment' : 'Aşama 03 • Canlıya Alma',
      accentColor: '#10b981',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      ),
    },
  ];

  return (
    <section className="section process-section-modern" id="surec">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">{t.process.badge}</div>
          <h2 className="section-title">
            {t.process.title} <span className="text-accent">{t.process.titleAccent}</span>
          </h2>
          <p className="section-desc">
            {t.process.desc}
          </p>
        </div>

        {/* Animated Connecting Track Line */}
        <div className="process-track-container" aria-hidden="true">
          <div className="process-track-line">
            <span className="process-laser-photon" />
          </div>
        </div>

        {/* 3 Animated Process Cards */}
        <div className="process-cards-grid">
          {/* ================= STEP 01 ================= */}
          <div
            className={`process-modern-card ${hoveredStep === 0 ? 'is-focused' : ''}`}
            onMouseEnter={() => setHoveredStep(0)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div className="process-card-ambient-flare flare-blue" aria-hidden="true" />
            
            {/* Top Bar with Number & Icon */}
            <div className="process-card-topbar">
              <div className="process-modern-badge badge-blue">
                <span className="badge-num">{steps[0].num}</span>
                <span className="badge-ping-dot" />
              </div>
              <div className="process-phase-pill">{steps[0].phaseBadge}</div>
              <div className="process-icon-box box-blue" aria-hidden="true">
                {steps[0].icon}
              </div>
            </div>

            {/* Title & Desc */}
            <h3 className="process-modern-title">{steps[0].title}</h3>
            <p className="process-modern-desc">{steps[0].desc}</p>

            {/* Animated Interactive Mockup Window: Step 01 */}
            <div className="process-anim-window">
              <div className="process-anim-header">
                <div className="process-header-dots">
                  <span className="dot dot-blue" />
                  <span className="dot dot-cyan" />
                  <span className="dot dot-indigo" />
                </div>
                <span className="process-header-title">#talep-kanalı (Discord)</span>
                <span className="process-header-badge badge-blue">7/24 Aktif</span>
              </div>

              <div className="process-window-content">
                {/* Floating animated requirements chips */}
                <div className="process-req-chips">
                  <span className="process-chip chip-1">
                    <span className="chip-indicator cyan" />
                    FiveM Guard
                  </span>
                  <span className="process-chip chip-2">
                    <span className="chip-indicator blue" />
                    Yetkili Takip
                  </span>
                  <span className="process-chip chip-3">
                    <span className="chip-indicator purple" />
                    Gelişmiş Ticket
                  </span>
                  <span className="process-chip chip-4">
                    <span className="chip-indicator green" />
                    Anlık Log
                  </span>
                </div>

                {/* Discord command line simulation */}
                <div className="process-cmd-box">
                  <span className="cmd-prompt">/talep olustur</span>
                  <span className="cmd-param">kategori:</span>
                  <span className="cmd-val">özel-bot-sistemi</span>
                  <span className="cmd-cursor" />
                </div>

                {/* Live response ticker */}
                <div className="process-live-status">
                  <span className="pulse-beacon beacon-blue" />
                  <span>Danışmanınız 2 dakikada yanıtlar</span>
                </div>
              </div>
            </div>

            <div className="process-card-bottom-beam beam-blue" />
          </div>

          {/* ================= STEP 02 ================= */}
          <div
            className={`process-modern-card ${hoveredStep === 1 ? 'is-focused' : ''}`}
            onMouseEnter={() => setHoveredStep(1)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div className="process-card-ambient-flare flare-cyan" aria-hidden="true" />

            {/* Top Bar with Number & Icon */}
            <div className="process-card-topbar">
              <div className="process-modern-badge badge-cyan">
                <span className="badge-num">{steps[1].num}</span>
                <span className="badge-ping-dot" />
              </div>
              <div className="process-phase-pill">{steps[1].phaseBadge}</div>
              <div className="process-icon-box box-cyan" aria-hidden="true">
                {steps[1].icon}
              </div>
            </div>

            {/* Title & Desc */}
            <h3 className="process-modern-title">{steps[1].title}</h3>
            <p className="process-modern-desc">{steps[1].desc}</p>

            {/* Animated Interactive Mockup Window: Step 02 */}
            <div className="process-anim-window">
              <div className="process-anim-header">
                <div className="process-header-dots">
                  <span className="dot dot-cyan" />
                  <span className="dot dot-blue" />
                  <span className="dot dot-indigo" />
                </div>
                <span className="process-header-title">wihyfe-build.compiler</span>
                <span className="process-header-badge badge-optimizing">Derleniyor</span>
              </div>

              <div className="process-window-content">
                {/* Code stream & building lines */}
                <div className="process-code-stream">
                  <div className="stream-line">
                    <span className="stream-kw">const</span> <span className="stream-var">arch</span> = <span className="stream-fn">createBotArchitecture</span>();
                  </div>
                  <div className="stream-line indent">
                    <span className="stream-prop">security:</span> <span className="stream-str">&apos;Anti-Crash & Backup&apos;</span>,
                  </div>
                  <div className="stream-line indent">
                    <span className="stream-prop">latency:</span> <span className="stream-val">&lt; 10ms (NVMe Cloud)</span>
                  </div>
                </div>

                {/* Animated Build Progress Bar */}
                <div className="process-progress-wrap">
                  <div className="process-progress-labels">
                    <span>Modüller Optimize Ediliyor</span>
                    <span className="progress-pct">100%</span>
                  </div>
                  <div className="process-progress-bar">
                    <div className="process-progress-fill" />
                  </div>
                </div>

                {/* Architecture telemetry badges */}
                <div className="process-telemetry-row">
                  <span className="telemetry-pill">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Node.js v22
                  </span>
                  <span className="telemetry-pill">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    PostgreSQL
                  </span>
                  <span className="telemetry-pill">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    DDoS Shield
                  </span>
                </div>
              </div>
            </div>

            <div className="process-card-bottom-beam beam-cyan" />
          </div>

          {/* ================= STEP 03 ================= */}
          <div
            className={`process-modern-card ${hoveredStep === 2 ? 'is-focused' : ''}`}
            onMouseEnter={() => setHoveredStep(2)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div className="process-card-ambient-flare flare-green" aria-hidden="true" />

            {/* Top Bar with Number & Icon */}
            <div className="process-card-topbar">
              <div className="process-modern-badge badge-green">
                <span className="badge-num">{steps[2].num}</span>
                <span className="badge-ping-dot" />
              </div>
              <div className="process-phase-pill">{steps[2].phaseBadge}</div>
              <div className="process-icon-box box-green" aria-hidden="true">
                {steps[2].icon}
              </div>
            </div>

            {/* Title & Desc */}
            <h3 className="process-modern-title">{steps[2].title}</h3>
            <p className="process-modern-desc">{steps[2].desc}</p>

            {/* Animated Interactive Mockup Window: Step 03 */}
            <div className="process-anim-window">
              <div className="process-anim-header">
                <div className="process-header-dots">
                  <span className="dot dot-green" />
                  <span className="dot dot-cyan" />
                  <span className="dot dot-blue" />
                </div>
                <span className="process-header-title">cluster.wihyfe.io</span>
                <span className="process-header-badge badge-live">Canlı & Aktif</span>
              </div>

              <div className="process-window-content">
                {/* Live Ping & Member Counter Card */}
                <div className="process-live-server-card">
                  <div className="server-avatar-box">
                    <span className="server-pulse-ring" />
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m4.93 4.93 4.24 4.24" />
                      <path d="m14.83 9.17 4.24-4.24" />
                      <path d="m14.83 14.83 4.24 4.24" />
                      <path d="m9.17 14.83-4.24 4.24" />
                    </svg>
                  </div>
                  <div className="server-details">
                    <div className="server-name">FiveM Topluluk Sunucusu</div>
                    <div className="server-sub">Bot başarıyla bağlandı • 1.450 Üye</div>
                  </div>
                  <div className="server-ping-badge">
                    <span className="ping-dot" />
                    8ms
                  </div>
                </div>

                {/* Command execution & success bubble */}
                <div className="process-deploy-bubble">
                  <div className="deploy-cmd">!wihyfe baslat --full</div>
                  <div className="deploy-success">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Tüm sistemler 7/24 kesintisiz devrede!</span>
                  </div>
                </div>

                {/* Sparkle banner */}
                <div className="process-live-status live-green">
                  <span className="pulse-beacon green" />
                  <span>%99.99 Uptime • Kesintisiz Canlı Hizmet</span>
                </div>
              </div>
            </div>

            <div className="process-card-bottom-beam beam-green" />
          </div>
        </div>
      </div>
    </section>
  );
}
