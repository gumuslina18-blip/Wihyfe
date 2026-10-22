'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardPreview() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'pins' | 'history' | 'guard' | 'tools'>('overview');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);

  // 3D Interactive Perspective Tilt & Glare Specular Lighting
  const wrapperRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized coordinates from -1 (left/top) to +1 (right/bottom)
    const px = Math.max(-1, Math.min(1, ((x / rect.width) - 0.5) * 2));
    const py = Math.max(-1, Math.min(1, ((y / rect.height) - 0.5) * 2));

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (!frameRef.current) return;
      const MAX_TILT = 8.5; // Natural 3D tilt range in degrees
      const rotX = -py * MAX_TILT;
      const rotY = px * MAX_TILT;

      frameRef.current.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      frameRef.current.style.transition = 'transform 0.08s ease-out, box-shadow 0.12s ease-out';

      // Subtle reactive 3D drop-shadow (much softer edge lighting)
      const shadowX = -px * 24;
      const shadowY = -py * 24 + 35;
      frameRef.current.style.boxShadow = `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 70px -12px rgba(0, 0, 0, 0.95), ${px * 5}px ${py * 5}px 30px -5px rgba(8, 120, 255, 0.1)`;

      if (glareRef.current) {
        const glarePercentX = ((x / rect.width) * 100).toFixed(1);
        const glarePercentY = ((y / rect.height) * 100).toFixed(1);
        glareRef.current.style.opacity = '0.35';
        glareRef.current.style.background = `radial-gradient(circle 420px at ${glarePercentX}% ${glarePercentY}%, rgba(255, 255, 255, 0.07), rgba(139, 92, 246, 0.05) 40%, transparent 70%)`;
      }
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (frameRef.current) {
      frameRef.current.style.transition = 'transform 0.22s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.22s ease-out';
    }
    if (glareRef.current) {
      glareRef.current.style.transition = 'opacity 0.3s ease-out';
      glareRef.current.style.opacity = '0.35';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (!frameRef.current) return;

    // Smooth elastic spring return to resting 3D orientation
    frameRef.current.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.8s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.4s ease';
    frameRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    frameRef.current.style.boxShadow = '0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 45px -5px rgba(8, 120, 255, 0.12)';

    if (glareRef.current) {
      glareRef.current.style.transition = 'opacity 0.65s cubic-bezier(0.23, 1, 0.32, 1)';
      glareRef.current.style.opacity = '0';
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // SVG Area Chart Data Points (Simulating the 14-day wave chart from screenshot)
  const chartPoints = [
    { day: '01', val: 42, y: 155 },
    { day: '02', val: 58, y: 140 },
    { day: '03', val: 78, y: 110 },
    { day: '04', val: 62, y: 135 },
    { day: '05', val: 89, y: 95 },
    { day: '06', val: 74, y: 120 },
    { day: '07', val: 96, y: 88 },
    { day: '08', val: 84, y: 105 },
    { day: '09', val: 104, y: 78 },
    { day: '10', val: 92, y: 98 },
    { day: '11', val: 112, y: 65 },
    { day: '12', val: 98, y: 85 },
    { day: '13', val: 118, y: 55 },
    { day: '14', val: 124, y: 40 },
  ];

  return (
    <section className="section dashboard-preview-section" id="kontrol-paneli">
      <div className="container">
        {/* Top Header Row matching the screenshot */}
        <div className="dashboard-section-header">
          <div className="dashboard-header-left">
            <h2 className="dashboard-main-title">{t.dashboardPreview.title}</h2>
            <p className="dashboard-main-desc">
              {t.dashboardPreview.desc}
            </p>
          </div>

          <div className="dashboard-header-right">
            <Link href="/panel" className="dashboard-open-link" id="btn-open-control-panel">
              <span>{t.dashboardPreview.openPanel}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 3D Perspective Tilt Wrapper */}
        <div
          className="dashboard-tilt-wrapper"
          ref={wrapperRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Outer Mockup Browser / App Frame with 3D Transform */}
          <div className="dashboard-window-frame" ref={frameRef}>
            {/* 3D Dynamic Specular Light Glare Overlay */}
            <div className="dashboard-window-glare" ref={glareRef} aria-hidden="true" />

            <div className="dashboard-window-ambient-glow" aria-hidden="true" />

          {/* Window Title Bar */}
          <div className="dashboard-window-topbar">
            <div className="dashboard-window-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>

            <div className="dashboard-window-address">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>panel.wihyfe.com</span>
            </div>

            <div className="dashboard-window-right">
              <span className="dashboard-sample-pill">Canlı Bot Verileri</span>
            </div>
          </div>

          {/* Inner App Canvas: Sidebar + Main Content */}
          <div className="dashboard-inner-app">
            {/* Left Sidebar */}
            <aside className="dashboard-sidebar">
              {/* App Brand */}
              <div className="dashboard-app-brand">
                <img
                  src="/wihyfe-icon.png"
                  alt="Wihyfe Logo"
                  width={22}
                  height={22}
                  style={{ objectFit: 'contain' }}
                />
                <span className="dashboard-app-title">Wihyfe</span>
                <span className="dashboard-app-reg">®</span>
              </div>

              {/* Workspace Badge Card */}
              <div className="dashboard-workspace-card">
                <div className="dashboard-workspace-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="dashboard-workspace-meta">
                  <span className="dashboard-ws-name">Wihyfe Topluluk Sunucusu</span>
                  <span className="dashboard-ws-plan">Wihyfe Bot Suite • Aktif</span>
                </div>
              </div>

              {/* Navigation Menu Groups */}
              <div className="dashboard-nav-group">
                <span className="dashboard-group-label">BOT YÖNETİMİ</span>
                <button
                  type="button"
                  className={`dashboard-nav-btn ${activeTab === 'overview' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  <span>Genel bakış</span>
                  {activeTab === 'overview' && <span className="active-glow-pill" />}
                </button>

                <button
                  type="button"
                  className={`dashboard-nav-btn ${activeTab === 'pins' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('pins')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Guard &amp; Koruma</span>
                </button>

                <button
                  type="button"
                  className={`dashboard-nav-btn ${activeTab === 'history' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Ticket &amp; Destek</span>
                </button>
              </div>

              <div className="dashboard-nav-group">
                <span className="dashboard-group-label">SİSTEM AYARLARI</span>
                <button
                  type="button"
                  className={`dashboard-nav-btn ${activeTab === 'guard' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('guard')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Oto-Moderasyon</span>
                </button>

                <button
                  type="button"
                  className={`dashboard-nav-btn ${activeTab === 'tools' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('tools')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <span>Özel Komutlar</span>
                </button>

                <button
                  type="button"
                  className="dashboard-nav-btn"
                  onClick={() => setActiveTab('tools')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                  </svg>
                  <span>Yedekleme &amp; Loglar</span>
                </button>
              </div>
            </aside>

            {/* Main Dashboard Canvas Area */}
            <main className="dashboard-main-canvas">
              {/* Top Bar inside canvas */}
              <div className="dashboard-content-header">
                <div>
                  <span className="dashboard-scope-tag">SUNUCU KONTROL MERKEZİ</span>
                  <h3 className="dashboard-page-heading">Bot Genel Bakış</h3>
                  <span className="dashboard-page-sub">Wihyfe Bot v4.2 • Frankfurt Node (14ms Ping)</span>
                </div>

                <Link href="/panel" className="btn btn-primary dashboard-action-btn">
                  <span>+ Botu Sunucuya Ekle</span>
                </Link>
              </div>

              {/* 4 Metric KPI Cards */}
              <div className="dashboard-kpi-grid">
                {/* KPI 1 */}
                <div className="dashboard-kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">İşlenen Komutlar</span>
                    <div className="kpi-icon-box">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                  </div>
                  <div className="kpi-val-row">
                    <span className="kpi-value">142,890</span>
                  </div>
                  <div className="kpi-sub-row">
                    <span className="kpi-subtext">Toplam komut akışı</span>
                    {/* Mini SVG Sparkline */}
                    <svg className="kpi-sparkline" width="60" height="18" viewBox="0 0 60 18" fill="none">
                      <path d="M2 14L15 12L28 15L42 8L58 10" stroke="#0878FF" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* KPI 2 */}
                <div className="dashboard-kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">Engellenen Saldırı</span>
                    <div className="kpi-icon-box kpi-icon-danger">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                  </div>
                  <div className="kpi-val-row">
                    <span className="kpi-value">348</span>
                  </div>
                  <div className="kpi-sub-row">
                    <span className="kpi-subtext">Anti-Raid &amp; Spam engeli</span>
                    <svg className="kpi-sparkline" width="60" height="18" viewBox="0 0 60 18" fill="none">
                      <path d="M2 15L16 14L30 10L44 14L58 7" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* KPI 3 */}
                <div className="dashboard-kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">Aktif Ticketlar</span>
                    <div className="kpi-icon-box kpi-icon-warn">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                  </div>
                  <div className="kpi-val-row">
                    <span className="kpi-value">12</span>
                  </div>
                  <div className="kpi-sub-row">
                    <span className="kpi-subtext">Yanıt bekleyen talep</span>
                    <svg className="kpi-sparkline" width="60" height="18" viewBox="0 0 60 18" fill="none">
                      <path d="M2 13L15 15L30 11L44 13L58 9" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* KPI 4 */}
                <div className="dashboard-kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-label">Korumalı Üyeler</span>
                    <div className="kpi-icon-box">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                      </svg>
                    </div>
                  </div>
                  <div className="kpi-val-row">
                    <span className="kpi-value">24,850</span>
                  </div>
                  <div className="kpi-sub-row">
                    <span className="kpi-subtext">Aktif topluluk üyesi</span>
                    <svg className="kpi-sparkline" width="60" height="18" viewBox="0 0 60 18" fill="none">
                      <path d="M2 14L16 11L30 13L44 8L58 6" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Main Charts Row: Wave Area Chart + Donut Results Distribution */}
              <div className="dashboard-charts-row">
                {/* Big Activity Chart Card */}
                <div className="dashboard-chart-card dashboard-chart-left">
                  <div className="chart-card-topbar">
                    <div>
                      <h4 className="chart-title">Bot Komut Aktivitesi</h4>
                      <p className="chart-subtitle">Günlük tetiklenen bot komutları ve API çağrıları</p>
                    </div>

                    <div className="chart-time-pill">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      <span>Son 14 gün</span>
                    </div>
                  </div>

                  {/* Big Number Row */}
                  <div className="chart-big-metric">
                    <span className="big-stat-val">18.420</span>
                    <span className="big-stat-unit">günlük komut akışı</span>
                    <span className="big-stat-legend">
                      <span className="legend-dot" />
                      <span>Komut Trafiği</span>
                    </span>
                  </div>

                  {/* SVG Wave Chart Container */}
                  <div className="svg-chart-container">
                    {/* Y-Axis Grid Guidelines */}
                    <div className="chart-grid-guidelines">
                      <div className="grid-line"><span className="axis-num">124</span></div>
                      <div className="grid-line"><span className="axis-num">93</span></div>
                      <div className="grid-line"><span className="axis-num">62</span></div>
                      <div className="grid-line"><span className="axis-num">31</span></div>
                      <div className="grid-line"><span className="axis-num">0</span></div>
                    </div>

                    {/* Smooth Multi-Sine Wave SVG with Gradient */}
                    <svg className="chart-wave-svg" viewBox="0 0 640 180" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="waveBlueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0878FF" stopOpacity="0.45" />
                          <stop offset="65%" stopColor="#0878FF" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="#0878FF" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Wave Fill Area */}
                      <path
                        d="M 25,160 
                           C 55,160 65,135 95,135 
                           C 125,135 135,150 165,150 
                           C 195,150 205,128 235,128 
                           C 265,128 275,142 305,142 
                           C 335,142 345,118 375,118 
                           C 405,118 415,132 445,132 
                           C 475,132 485,108 515,108 
                           C 545,108 555,122 575,122 
                           C 595,122 610,85 625,75 
                           L 625,180 L 25,180 Z"
                        fill="url(#waveBlueGrad)"
                      />

                      {/* Wave Glowing Stroke */}
                      <path
                        d="M 25,160 
                           C 55,160 65,135 95,135 
                           C 125,135 135,150 165,150 
                           C 195,150 205,128 235,128 
                           C 265,128 275,142 305,142 
                           C 335,142 345,118 375,118 
                           C 405,118 415,132 445,132 
                           C 475,132 485,108 515,108 
                           C 545,108 555,122 575,122 
                           C 595,122 610,85 625,75"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        className="animated-wave-line"
                      />

                      {/* Interactive Hover Nodes */}
                      {chartPoints.map((pt, i) => (
                        <circle
                          key={i}
                          cx={25 + i * 46}
                          cy={165 - pt.val * 0.72}
                          r={hoveredDataPoint === i ? 5 : 2.5}
                          fill={hoveredDataPoint === i ? '#ffffff' : '#38bdf8'}
                          stroke="#0878FF"
                          strokeWidth="2"
                          className="chart-hover-node"
                          onMouseEnter={() => setHoveredDataPoint(i)}
                          onMouseLeave={() => setHoveredDataPoint(null)}
                        />
                      ))}
                    </svg>
                  </div>

                  {/* X-Axis Dates & Footnote */}
                  <div className="chart-x-axis">
                    <span className="x-label">01</span>
                    <span className="x-label">03</span>
                    <span className="x-label">05</span>
                    <span className="x-label">07</span>
                    <span className="x-label">09</span>
                    <span className="x-label">11</span>
                    <span className="x-label">14</span>
                  </div>

                  <div className="chart-card-footer">
                    <span className="chart-range-tag">01 — 14</span>
                    <span className="chart-peak-stat">En yüksek günlük komut: <strong>2.450</strong></span>
                  </div>
                </div>

                {/* Right Donut Distribution Card */}
                <div className="dashboard-chart-card dashboard-chart-right">
                  <div className="chart-card-topbar">
                    <div>
                      <h4 className="chart-title">Güvenlik &amp; Olay Dağılımı</h4>
                      <p className="chart-subtitle">Tüm bot ve üye aksiyonları</p>
                    </div>

                    <button type="button" className="chart-expand-btn" title="Genişlet" aria-label="Genişlet">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                    </button>
                  </div>

                  {/* Circular Donut Gauge SVG */}
                  <div className="donut-gauge-wrapper">
                    <svg className="donut-gauge-svg" width="160" height="160" viewBox="0 0 160 160">
                      {/* Background Track */}
                      <circle
                        cx="80"
                        cy="80"
                        r="62"
                        fill="none"
                        stroke="#131b2e"
                        strokeWidth="11"
                      />
                      {/* Red Threat Segment (3%) */}
                      <circle
                        cx="80"
                        cy="80"
                        r="62"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="11"
                        strokeDasharray="389"
                        strokeDashoffset="377"
                        transform="rotate(-90 80 80)"
                      />
                      {/* Amber Warning Segment (7%) */}
                      <circle
                        cx="80"
                        cy="80"
                        r="62"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="11"
                        strokeDasharray="389"
                        strokeDashoffset="362"
                        transform="rotate(-78 80 80)"
                      />
                      {/* Emerald Clean Segment (90%) */}
                      <circle
                        cx="80"
                        cy="80"
                        r="62"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="11"
                        strokeDasharray="389"
                        strokeDashoffset="42"
                        transform="rotate(-52 80 80)"
                        strokeLinecap="round"
                        className="donut-clean-arc"
                      />
                    </svg>

                    {/* Donut Inner Text */}
                    <div className="donut-inner-content">
                      <span className="donut-center-num">%99.9</span>
                      <span className="donut-center-sub">Uptime &amp; Güvenlik</span>
                    </div>
                  </div>

                  {/* Breakdown Legend List matching screenshot */}
                  <div className="donut-breakdown-list">
                    <div className="donut-breakdown-item">
                      <div className="item-name-group">
                        <span className="item-color-bullet bullet-green" />
                        <span className="item-name">Başarılı Komutlar</span>
                      </div>
                      <div className="item-stats-group">
                        <span className="item-count">14,290</span>
                        <span className="item-percent">94%</span>
                      </div>
                    </div>

                    <div className="donut-breakdown-item">
                      <div className="item-name-group">
                        <span className="item-color-bullet bullet-yellow" />
                        <span className="item-name">Filtrelenen Spam / Reklam</span>
                      </div>
                      <div className="item-stats-group">
                        <span className="item-count">820</span>
                        <span className="item-percent">4%</span>
                      </div>
                    </div>

                    <div className="donut-breakdown-item">
                      <div className="item-name-group">
                        <span className="item-color-bullet bullet-red" />
                        <span className="item-name">Engellenen Tehdit / Raid</span>
                      </div>
                      <div className="item-stats-group">
                        <span className="item-count">180</span>
                        <span className="item-percent">2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
