'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function FeaturesShowcase() {
  const { t } = useLanguage();
  const [activeArtifactFile, setActiveArtifactFile] = useState<'shimcache' | 'prefetch' | 'amcache'>('prefetch');

  return (
    <section className="section features-showcase-section" id="ozellikler">
      <div className="container">
        {/* Section Header matching screenshot */}
        <div className="features-section-header">
          <div className="features-header-left">
            <h2 className="features-main-title">{t.featuresSection.title}</h2>
          </div>

          <div className="features-header-right">
            <p className="features-main-desc">
              {t.featuresSection.desc}
            </p>
          </div>
        </div>

        {/* 2x2 Feature Cards Grid */}
        <div className="features-cards-grid">
          {/* ================= CARD 1: Derin Tarama ================= */}
          <div className="feature-card feature-card-deep">
            <div className="feature-card-header">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7V4h3" />
                  <path d="M20 7V4h-3" />
                  <path d="M4 17v3h3" />
                  <path d="M20 17v3h-3" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="feature-card-title">{t.featuresSection.card1.title}</h3>
            </div>

            <p className="feature-card-desc">{t.featuresSection.card1.desc}</p>

            <div className="feature-tags-row">
              {t.featuresSection.card1.tags.map((tag, i) => (
                <span key={i} className="feature-tag">
                  <span className="feature-tag-bullet" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>

            {/* Visual Mockup 1: Code Terminal + Glowing Lock Shield */}
            <div className="feature-mockup-frame mockup-deep-scan">
              <div className="mini-terminal-window">
                <div className="terminal-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>

                <div className="terminal-code-body">
                  <span className="code-comment">// WIHYFE GUARD SECURITY ENGINE</span>
                  <span className="code-line">
                    <span className="code-fn">guard</span>.<span className="code-method">protect</span>(<span className="code-str">&quot;guild.channels&quot;</span>);
                  </span>
                  <div className="code-skeleton-line line-1" />
                  <div className="code-skeleton-line line-2" />
                </div>

                {/* Glowing Shield Lock in Center-Right */}
                <div className="terminal-shield-orb">
                  <div className="shield-orb-glow" />
                  <div className="shield-orb-core">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <rect x="10" y="11" width="4" height="4" rx="1" fill="#FFFFFF" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CARD 2: Adli Tarayıcı ================= */}
          <div className="feature-card feature-card-forensic">
            <div className="feature-card-header">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="feature-card-title">{t.featuresSection.card2.title}</h3>
            </div>

            <p className="feature-card-desc">{t.featuresSection.card2.desc}</p>

            <div className="feature-tags-row">
              {t.featuresSection.card2.tags.map((tag, i) => (
                <span key={i} className="feature-tag">
                  <span className="feature-tag-bullet" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>

            {/* Visual Mockup 2: Circuit Tracks + Center Cyber Shield */}
            <div className="feature-mockup-frame mockup-circuit-scan">
              <div className="circuit-canvas-wrapper">
                {/* SVG Circuit Traces */}
                <svg className="circuit-svg" viewBox="0 0 460 160" fill="none">
                  <defs>
                    <linearGradient id="circuitGradLeft" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0878FF" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="circuitGradRight" x1="1" y1="0" x2="0" y2="0">
                      <stop offset="0%" stopColor="#0878FF" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Left Circuit Tracks */}
                  <path d="M 20,80 L 140,80" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
                  <path d="M 20,50 L 100,50 L 140,75" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
                  <path d="M 20,110 L 100,110 L 140,85" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />

                  {/* Right Circuit Tracks */}
                  <path d="M 440,80 L 320,80" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
                  <path d="M 440,50 L 360,50 L 320,75" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
                  <path d="M 440,110 L 360,110 L 320,85" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />

                  {/* Animated Energy Pulses Left */}
                  <circle cx="20" cy="80" r="3.5" fill="#38bdf8" className="circuit-energy-pulse-left">
                    <animateMotion path="M 20,80 L 140,80" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="20" cy="50" r="3" fill="#60a5fa" className="circuit-energy-pulse-left">
                    <animateMotion path="M 20,50 L 100,50 L 140,75" dur="3.1s" repeatCount="indefinite" />
                  </circle>

                  {/* Animated Energy Pulses Right */}
                  <circle cx="440" cy="80" r="3.5" fill="#38bdf8" className="circuit-energy-pulse-right">
                    <animateMotion path="M 440,80 L 320,80" dur="2.6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="440" cy="110" r="3" fill="#60a5fa" className="circuit-energy-pulse-right">
                    <animateMotion path="M 440,110 L 360,110 L 320,85" dur="3.3s" repeatCount="indefinite" />
                  </circle>
                </svg>

                {/* Center Beveled Cyber Lock Shield */}
                <div className="cyber-shield-badge">
                  <div className="cyber-shield-outer-glow" />
                  <div className="cyber-shield-inner-box">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <rect x="9.5" y="10.5" width="5" height="5" rx="1.2" fill="#FFFFFF" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CARD 3: Kalıntı Denetleyici ================= */}
          <div className="feature-card feature-card-remnants">
            <div className="feature-card-header">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <h3 className="feature-card-title">{t.featuresSection.card3.title}</h3>
            </div>

            <p className="feature-card-desc">{t.featuresSection.card3.desc}</p>

            <div className="feature-tags-row">
              {t.featuresSection.card3.tags.map((tag, i) => (
                <span key={i} className="feature-tag">
                  <span className="feature-tag-bullet" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>

            {/* Visual Mockup 3: Vertical Trace Rail + Stacked Artifact Files */}
            <div className="feature-mockup-frame mockup-remnants-scan">
              <div className="remnants-rail-layout">
                {/* Vertical Scanning Rail */}
                <div className="remnants-vertical-rail">
                  <div className="rail-line" />
                  <div 
                    className="rail-scan-node" 
                    data-target={activeArtifactFile}
                  />
                </div>

                {/* File Stack Cards */}
                <div className="remnants-files-stack">
                  {/* File 1: Shimcache */}
                  <div 
                    className={`artifact-file-item ${activeArtifactFile === 'shimcache' ? 'is-active' : ''}`}
                    onClick={() => setActiveArtifactFile('shimcache')}
                  >
                    <div className="file-item-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                      </svg>
                    </div>
                    <div className="file-item-meta">
                      <span className="file-item-name">audit-logs.json</span>
                      <div className="file-item-bar-subtle" />
                    </div>
                  </div>

                  {/* File 2: Prefetch (Default Highlighted) */}
                  <div 
                    className={`artifact-file-item ${activeArtifactFile === 'prefetch' ? 'is-active' : ''}`}
                    onClick={() => setActiveArtifactFile('prefetch')}
                  >
                    <div className="file-item-icon icon-glow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    </div>
                    <div className="file-item-meta">
                      <span className="file-item-name active-highlight">auto-backup.db</span>
                      <div className="file-item-bar-glow" />
                    </div>
                  </div>

                  {/* File 3: Amcache */}
                  <div 
                    className={`artifact-file-item ${activeArtifactFile === 'amcache' ? 'is-active' : ''}`}
                    onClick={() => setActiveArtifactFile('amcache')}
                  >
                    <div className="file-item-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="file-item-meta">
                      <span className="file-item-name">member-roles.cache</span>
                      <div className="file-item-bar-subtle" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CARD 4: Otomatik Araç Seti ================= */}
          <div className="feature-card feature-card-tools">
            <div className="feature-card-header">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <h3 className="feature-card-title">{t.featuresSection.card4.title}</h3>
            </div>

            <p className="feature-card-desc">{t.featuresSection.card4.desc}</p>

            <div className="feature-tags-row">
              {t.featuresSection.card4.tags.map((tag, i) => (
                <span key={i} className="feature-tag">
                  <span className="feature-tag-bullet" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>

            {/* Visual Mockup 4: Flow Tree Nodes (Sistem -> Moderatör -> Rapor) */}
            <div className="feature-mockup-frame mockup-flow-tree">
              <div className="flow-tree-container">
                {/* Node 1: Sistem */}
                <div className="flow-node node-system">
                  <div className="flow-node-header">
                    <span className="flow-node-role">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>Sistem</span>
                    </span>
                    <span className="flow-node-step">01</span>
                  </div>
                  <div className="flow-node-text">
                    <strong>Yeni</strong> destek talebi açıldı
                  </div>
                </div>

                {/* Flow Connector Line 1-2 */}
                <div className="flow-connector">
                  <div className="connector-line" />
                  <div className="connector-packet" />
                </div>

                {/* Node 2: Moderatör (Active Glowing) */}
                <div className="flow-node node-moderator is-active">
                  <div className="flow-node-header">
                    <span className="flow-node-role active-role">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span>Yetkili Ekip</span>
                    </span>
                    <span className="flow-node-step active-step">02</span>
                  </div>
                  <div className="flow-node-title-row">
                    <span className="flow-node-main">Kullanıcı yanıtlandı</span>
                    <span className="flow-connected-badge">
                      <span className="live-pulse" />
                      <span>Aktif</span>
                    </span>
                  </div>

                  {/* Simulated Pointer Cursor */}
                  <div className="simulated-cursor">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF">
                      <polygon points="3 3 10 21 13 14 21 11 3 3" />
                    </svg>
                  </div>
                </div>

                {/* Flow Connector Line 2-3 */}
                <div className="flow-connector">
                  <div className="connector-line" />
                </div>

                {/* Node 3: Rapor */}
                <div className="flow-node node-report">
                  <div className="flow-node-header">
                    <span className="flow-node-role">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      </svg>
                      <span>Transkript</span>
                    </span>
                    <span className="flow-node-step">03</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
