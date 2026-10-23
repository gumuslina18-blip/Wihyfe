'use client';

import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { DonateMarketView, MdtCadView, CashVCommunityView } from '@/components/ShowcaseDemoViews';

export type DeviceType = 'desktop' | 'laptop' | 'tablet' | 'mobile';

export interface ShowcaseTemplate {
  id: string;
  name: string;
  tag: string;
  badge: string;
  icon: React.ReactNode;
  url: string;
  desc: string;
}

export const SHOWCASE_TEMPLATES: ShowcaseTemplate[] = [
  {
    id: 'donate-market',
    name: 'Donate & Market Sistemi',
    tag: 'Web - Donate',
    badge: 'Yakında',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    url: '/showcase/donate-market',
    desc: 'Bakiye, VIP paketleri, özel araç & mülk satışı ve PayTR otomatik teslimatlı e-ticaret vitrini.',
  },
  {
    id: 'mdt-cad',
    name: 'LSPD Polis & MDT/CAD Portalı',
    tag: 'Web - Legal',
    badge: 'Yakında',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    url: '/showcase/mdt-cad',
    desc: 'Canlı 911 ihbar akışı, GBT vatandaş sorgulama, devriye birim takibi ve vaka raporları.',
  },
  {
    id: 'community-cashv',
    name: 'CashV Community Portalı',
    tag: 'Web - Community',
    badge: 'Topluluk Portalı',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    url: 'http://localhost:3001',
    desc: 'CashV FiveM roleplay topluluk vitrini, canlı sunucu istatistikleri, başvuru ve Discord bağlantısı.',
  },
];

interface DeviceConfig {
  width: number;
  height: number;
  label: string;
  resolution: string;
  icon: React.ReactNode;
  scaleDesktop: number;
}

const DEVICE_CONFIGS: Record<DeviceType, DeviceConfig> = {
  desktop: {
    width: 1200,
    height: 720,
    label: 'Masaüstü (iMac)',
    resolution: '1920 × 1080 (FHD)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    scaleDesktop: 0.82,
  },
  laptop: {
    width: 1040,
    height: 650,
    label: 'Dizüstü (MacBook)',
    resolution: '1440 × 900 (Retina)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />
        <path d="M2 19h20" />
      </svg>
    ),
    scaleDesktop: 0.84,
  },
  tablet: {
    width: 768,
    height: 980,
    label: 'Tablet (iPad Pro)',
    resolution: '768 × 1024',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    scaleDesktop: 0.8,
  },
  mobile: {
    width: 390,
    height: 820,
    label: 'Mobil (iPhone 16 Pro)',
    resolution: '390 × 844 (OLED)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    scaleDesktop: 0.95,
  },
};

export default function WebsiteLiveShowcase() {
  const defaultTmpl = SHOWCASE_TEMPLATES.find((t) => t.id === 'community-cashv') || SHOWCASE_TEMPLATES[0];
  const [selectedTemplate, setSelectedTemplate] = useState<ShowcaseTemplate>(defaultTmpl);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');
  const [currentUrl, setCurrentUrl] = useState<string>(defaultTmpl.url);
  const [addressBarInput, setAddressBarInput] = useState<string>('https://demo.wihyfe.com' + defaultTmpl.url);
  const [showMockupPreview, setShowMockupPreview] = useState<boolean>(false);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [isAutoFloating, setIsAutoFloating] = useState<boolean>(false);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number | 'auto'>('auto');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [useLocalhostIframe, setUseLocalhostIframe] = useState<boolean>(true);

  const [isLivePreviewActive] = useState<boolean>(true);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll Reveal Observer: Triggers massive 3D entrance animation when user scrolls to section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 3D Tilt rotation state
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync address bar input when template changes
  const handleSelectTemplate = (template: ShowcaseTemplate) => {
    setSelectedTemplate(template);
    setCurrentUrl(template.url);
    setShowMockupPreview(false);
    if (template.url.startsWith('http://') || template.url.startsWith('https://')) {
      setAddressBarInput(template.url);
    } else {
      setAddressBarInput('https://demo.wihyfe.com' + template.url);
    }
    triggerReload();
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = addressBarInput.trim();
    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      url = 'https://' + url;
    }

    setCurrentUrl(url);
    triggerReload();
  };

  const triggerReload = () => {
    setIsReloading(true);
    if (iframeRef.current) {
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = src;
        setIsReloading(false);
      }, 350);
    } else {
      setTimeout(() => setIsReloading(false), 400);
    }
  };

  // Interactive 3D mouse tracking
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!is3DMode || isAutoFloating || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Subtle natural tilt angles (-10deg to +10deg)
    const maxAngle = 11;
    const rY = (mouseX / (rect.width / 2)) * maxAngle;
    const rX = -(mouseY / (rect.height / 2)) * maxAngle;

    setRotateX(Math.min(Math.max(rX, -maxAngle), maxAngle));
    setRotateY(Math.min(Math.max(rY, -maxAngle), maxAngle));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isAutoFloating) {
      setRotateX(0);
      setRotateY(0);
    }
  };

  // Copy URL to clipboard
  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(addressBarInput);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Open in new tab
  const handleOpenExternal = () => {
    if (typeof window !== 'undefined') {
      window.open(currentUrl, '_blank');
    }
  };

  // Listen to external custom events (e.g. from WebsitesSection "Canlı 3D Önizle" buttons)
  useEffect(() => {
    const handleSwitchEvent = (e: CustomEvent<{ templateId: string; device?: DeviceType }>) => {
      const { templateId, device } = e.detail || {};
      const found = SHOWCASE_TEMPLATES.find((t) => t.id === templateId || t.tag.toLowerCase().includes(templateId));
      if (found) {
        handleSelectTemplate(found);
      }
      if (device) {
        setSelectedDevice(device);
      }
    };

    window.addEventListener('switch-showcase-template' as any, handleSwitchEvent);
    return () => {
      window.removeEventListener('switch-showcase-template' as any, handleSwitchEvent);
    };
  }, []);

  const device = DEVICE_CONFIGS[selectedDevice];

  // Dynamic transform string
  const transformStyle = is3DMode
    ? isAutoFloating
      ? 'rotateX(8deg) rotateY(-12deg) translateZ(10px)'
      : `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`
    : 'none';

  return (
    <section 
      ref={sectionRef} 
      className={`section live-showcase-section ${isRevealed ? 'is-revealed' : ''}`} 
      id="canli-vitrin"
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">
            <span className="showcase-tag-pulse" />
            3D İnteraktif Canlı Önizleme Vitrini
          </div>
          <h2 className="section-title">
            Web Sitenizi <span className="text-accent">Canlı & 3D Deneyimleyin</span>
          </h2>
          <p className="section-desc">
            Hazırladığımız anahtar teslim web sistemlerini ve özel yazılımları gerçek zamanlı, 3D açılı ve responsive cihaz simülatöründe hemen test edin.
          </p>
        </div>

        {!isLivePreviewActive ? (
          /* TEASER MODE: 2nd Image with 3D Animated YAKINDA */
          <div className="showcase-teaser-container">
            <div className="showcase-mockup-wrapper">
              <img
                src="/showcase-preview-mockup.png"
                alt="Wihyfe 3D Canlı Önizleme Vitrini"
                className="showcase-mockup-img"
              />
              <div className="showcase-mockup-sheen" aria-hidden="true" />
            </div>

            <div className="showcase-yakinda-box">
              <div className="showcase-yakinda-badge">
                <span className="showcase-yakinda-pulse-ring" />
                <span>3D İNTERAKTİF CİHAZ VİTRİNİ</span>
              </div>

              <h3 className="showcase-yakinda-title-3d">YAKINDA</h3>

              <p className="showcase-yakinda-desc">
                Tüm web sistemlerimizi ve özel projelerimizi masaüstü, laptop, tablet ve mobil cihaz modlarında 3D açılı simülatörle canlı test edebileceğiniz yeni vitrin teknolojimiz çok yakında aktif edilecektir.
              </p>
            </div>
          </div>
        ) : (
          /* FULL INTERACTIVE 3D SHOWCASE (PRESERVED INTACT) */
          <>
            {/* Template Selector Bar */}
            <div className="showcase-templates-bar" role="tablist" aria-label="Web Sitesi Şablonları">
          {SHOWCASE_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate.id === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`showcase-template-btn ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectTemplate(tmpl)}
              >
                <span className="template-icon">{tmpl.icon}</span>
                <div className="template-info">
                  <span className="template-name">{tmpl.name}</span>
                  <span className="template-tag">{tmpl.tag}</span>
                </div>
                {tmpl.badge && (
                  <span className={`template-badge ${tmpl.badge === 'Yakında' ? 'badge-soon' : ''}`}>
                    {tmpl.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Controls & Device Switcher Bar */}
        <div className="showcase-toolbar">
          {/* Left: Device Switcher */}
          <div className="showcase-device-group">
            <span className="toolbar-label">Cihaz Modu:</span>
            {(Object.keys(DEVICE_CONFIGS) as DeviceType[]).map((devKey) => {
              const cfg = DEVICE_CONFIGS[devKey];
              const isActive = selectedDevice === devKey;
              return (
                <button
                  key={devKey}
                  type="button"
                  className={`showcase-device-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedDevice(devKey)}
                  title={`${cfg.label} (${cfg.resolution})`}
                >
                  <span className="device-btn-icon">{cfg.icon}</span>
                  <span className="device-btn-label">{cfg.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Right: 3D & Perspective Controls */}
          <div className="showcase-action-group">
            {/* 3D vs 2D Toggle */}
            <button
              type="button"
              className={`showcase-action-btn ${is3DMode ? 'active' : ''}`}
              onClick={() => setIs3DMode(!is3DMode)}
              title={is3DMode ? 'Düz 2D Görünüme Geç' : '3D Perspektif Görünümünü Aç'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <span>{is3DMode ? '3D Perspektif' : '2D Düz Mod'}</span>
            </button>

            {/* Auto Floating Toggle */}
            {is3DMode && (
              <button
                type="button"
                className={`showcase-action-btn ${isAutoFloating ? 'active' : ''}`}
                onClick={() => setIsAutoFloating(!isAutoFloating)}
                title="Otomatik 3D Süzülme Animasyonunu Aç/Kapat"
              >
                {isAutoFloating ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                )}
                <span>{isAutoFloating ? 'Sabitle' : '3D Süzülme'}</span>
              </button>
            )}

            {/* Reload iframe */}
            <button
              type="button"
              className="showcase-action-btn"
              onClick={triggerReload}
              title="Önizlemeyi Yenile"
            >
              <svg
                className={isReloading ? 'spin-anim' : ''}
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
              <span>Yenile</span>
            </button>

            {/* Open in external tab */}
            <button
              type="button"
              className="showcase-action-btn"
              onClick={handleOpenExternal}
              title="Yeni Sekmede Tam Ekran Aç"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Yeni Sekme</span>
            </button>

            {/* Fullscreen Expand Modal */}
            <button
              type="button"
              className="showcase-action-btn btn-highlight"
              onClick={() => setIsFullscreen(true)}
              title="Büyük Ekran Vitrin Modu"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
              <span>Tam Ekran</span>
            </button>
          </div>
        </div>

        {/* 3D Showcase Stage Canvas */}
        <div
          ref={stageRef}
          className={`showcase-3d-stage ${is3DMode ? 'is-3d' : 'is-flat'} ${isAutoFloating ? 'auto-floating' : ''} ${isRevealed ? 'stage-revealed' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Ambient Lighting & Hologram Background Glow */}
          <div className="showcase-stage-ambient-glow" />
          <div className="showcase-stage-grid-floor" />
          <div className="showcase-epic-reveal-burst" aria-hidden="true" />

          {/* 3D Device Container */}
          <div
            className={`showcase-device-frame device-${selectedDevice}`}
            style={{
              transform: transformStyle,
              maxWidth: `${device.width}px`,
            }}
          >
            {/* Top Chrome / Browser Bar */}
            <div className="device-browser-chrome">
              {/* Apple Traffic Light Buttons */}
              <div className="device-window-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>

              {/* Navigation Arrows */}
              <div className="device-chrome-nav">
                <button type="button" className="chrome-nav-btn" title="Geri">
                  ‹
                </button>
                <button type="button" className="chrome-nav-btn" title="İleri">
                  ›
                </button>
                <button
                  type="button"
                  className="chrome-nav-btn"
                  title="Yenile"
                  onClick={triggerReload}
                >
                  <span className={isReloading ? 'spin-anim inline-block' : 'inline-block'}>↻</span>
                </button>
              </div>

              {/* Omnibox / Address Bar Form */}
              <form className="device-address-bar" onSubmit={handleAddressSubmit}>
                <span className="ssl-lock-icon" title="256-Bit SSL Güvenli Bağlantı">
                  🔒
                </span>
                <input
                  type="text"
                  value={addressBarInput}
                  onChange={(e) => setAddressBarInput(e.target.value)}
                  placeholder="https://..."
                  className="device-address-input"
                  title="Önizlemek istediğiniz web adresini girebilirsiniz"
                />
                <button type="submit" className="device-address-go-btn" title="Adrese Git">
                  Git ↵
                </button>
              </form>

              {/* Device Resolution & Copy Pill */}
              <div className="device-chrome-badges">
                {selectedTemplate.id === 'community-cashv' && (
                  <button
                    type="button"
                    className="device-copy-pill"
                    style={{
                      background: useLocalhostIframe ? 'rgba(168, 85, 247, 0.35)' : 'rgba(59, 130, 246, 0.35)',
                      color: '#ffffff',
                      borderColor: 'rgba(168, 85, 247, 0.5)',
                      fontWeight: 700,
                    }}
                    onClick={() => setUseLocalhostIframe(!useLocalhostIframe)}
                    title="Yerel Port 3001 ile Entegre Vitrin Arasında Geçiş Yap"
                  >
                    {useLocalhostIframe ? '⚡ Yerel:3001' : '👁️ Vitrin'}
                  </button>
                )}
                <span className="device-res-pill" title="Aktif Çözünürlük">
                  {device.resolution}
                </span>
                <button
                  type="button"
                  className="device-copy-pill"
                  onClick={handleCopyLink}
                  title="Bağlantıyı Kopyala"
                >
                  {isCopied ? '✓ Alındı' : '🔗 Link'}
                </button>
              </div>
            </div>

            {/* Dynamic Island for Mobile (iPhone) */}
            {selectedDevice === 'mobile' && (
              <div className="device-dynamic-island">
                <div className="island-camera" />
                <div className="island-mic-dot" />
              </div>
            )}

            {/* Screen Glass Reflection Sheen */}
            <div className="device-glass-sheen" aria-hidden="true" />

            {/* Screen Viewport with Rich Live Content or External Iframe */}
            <div
              className="device-screen-viewport"
              style={{
                height: `${device.height}px`,
              }}
            >
              {isReloading ? (
                <div className="device-loading-state">
                  <div className="showcase-loader-spinner" />
                  <span>Canlı demo yükleniyor...</span>
                </div>
              ) : (selectedTemplate.id === 'donate-market' || selectedTemplate.id === 'mdt-cad') && !showMockupPreview ? (
                <div className="device-coming-soon-screen">
                  <div className="coming-soon-badge-row">
                    <span className="pulse-dot-amber" />
                    <span>ÇOK YAKINDA</span>
                  </div>
                  <div className="coming-soon-icon-box">
                    {selectedTemplate.id === 'donate-market' ? (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    ) : (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="coming-soon-title">{selectedTemplate.name}</h3>
                  <p className="coming-soon-desc">
                    {selectedTemplate.id === 'donate-market'
                      ? 'PayTR otomatik teslimatlı bakiye, araç ve VIP paket market altyapısı geliştirme aşamasındadır. Çok yakında hizmete sunulacaktır.'
                      : 'FiveM canlı 911 ihbar akışı, GBT vatandaş sorgulama ve devriye takip CAD sistemi geliştirme aşamasındadır. Çok yakında aktif olacaktır.'}
                  </p>
                  <div className="coming-soon-btn-group">
                    <button
                      type="button"
                      className="coming-soon-cta-btn"
                      onClick={() => {
                        const cashv = SHOWCASE_TEMPLATES.find((t) => t.id === 'community-cashv');
                        if (cashv) handleSelectTemplate(cashv);
                      }}
                    >
                      <span>⚡ Aktif CashV Canlı Vitrinini İncele</span>
                    </button>
                    <button
                      type="button"
                      className="coming-soon-secondary-btn"
                      onClick={() => setShowMockupPreview(true)}
                    >
                      <span>👁️ Tasarım Önizlemesini Gör</span>
                    </button>
                  </div>
                </div>
              ) : selectedTemplate.id === 'donate-market' && !currentUrl.startsWith('http://') && !currentUrl.startsWith('https://') ? (
                <div className="device-screen-scroll-container">
                  <DonateMarketView />
                </div>
              ) : selectedTemplate.id === 'mdt-cad' && !currentUrl.startsWith('http://') && !currentUrl.startsWith('https://') ? (
                <div className="device-screen-scroll-container">
                  <MdtCadView />
                </div>
              ) : selectedTemplate.id === 'community-cashv' && (!useLocalhostIframe || (typeof window !== 'undefined' && window.location.protocol === 'https:') || currentUrl.includes('/showcase/community-cashv')) ? (
                <div className="device-screen-scroll-container">
                  <CashVCommunityView />
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={currentUrl}
                  title="Web Sitesi Canlı Önizlemesi"
                  className="device-iframe"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  onError={() => setUseLocalhostIframe(false)}
                />
              )}
            </div>

            {/* Mobile Home Indicator Swipe Bar */}
            {selectedDevice === 'mobile' && (
              <div className="device-home-bar" />
            )}

            {/* Laptop Aluminum Base Notch */}
            {selectedDevice === 'laptop' && (
              <div className="device-laptop-base">
                <div className="laptop-notch-lip" />
              </div>
            )}
          </div>

          {/* Realistic Dynamic Shadow Beneath Floating 3D Device */}
          <div
            className={`showcase-dynamic-shadow device-${selectedDevice}`}
            style={{
              maxWidth: `${device.width * 0.9}px`,
            }}
          />
        </div>

        {/* Feature Highlights beneath Showcase (Gelişmiş Kart Tarzı - Image 2) */}
        <div className="showcase-perks-grid advanced-perks-grid">
          {/* Card 1: %100 Responsive & Akıcı */}
          <div className="advanced-perk-card perk-theme-cyan">
            <div className="perk-card-glow-bar" />
            <div className="perk-card-header-row">
              <span className="perk-card-number">01</span>
              <span className="perk-card-pill">RETINA & 4K UYUMLU</span>
            </div>
            <div className="perk-icon-container">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <h4 className="perk-card-title">%100 Responsive & Akıcı</h4>
            <p className="perk-card-desc">
              Tüm ekran çözünürlüklerinde, iPhone, iPad ve ultra-wide masaüstü ekranlarda kusursuz uyumluluk.
            </p>
            <div className="perk-card-tags">
              <span className="perk-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                iPhone & iPad
              </span>
              <span className="perk-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                4K Ultra-Wide
              </span>
              <span className="perk-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Fluid Grid
              </span>
            </div>
          </div>

          {/* Card 2: Ultra Yüksek Hız & SEO */}
          <div className="advanced-perk-card perk-theme-amber">
            <div className="perk-card-glow-bar" />
            <div className="perk-card-header-row">
              <span className="perk-card-number">02</span>
              <span className="perk-card-pill">98+ PAGESPEED</span>
            </div>
            <div className="perk-icon-container">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h4 className="perk-card-title">Ultra Yüksek Hız & SEO</h4>
            <p className="perk-card-desc">
              Modern Next.js mimarisi, anında sayfa geçişleri ve Google PageSpeed 98+ puan optimizasyonu.
            </p>
            <div className="perk-card-tags">
              <span className="perk-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                Next.js 15 SSR
              </span>
              <span className="perk-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                0.2s LCP
              </span>
              <span className="perk-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Full SEO
              </span>
            </div>
          </div>

          {/* Card 3: PayTR & Otomatik Teslimat */}
          <div className="advanced-perk-card perk-theme-emerald">
            <div className="perk-card-glow-bar" />
            <div className="perk-card-header-row">
              <span className="perk-card-number">03</span>
              <span className="perk-card-pill">3D SECURE & SQL</span>
            </div>
            <div className="perk-icon-container">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h4 className="perk-card-title">PayTR & Otomatik Teslimat</h4>
            <p className="perk-card-desc">
              3D Secure kredi kartı, banka havalesi ve oyun içi veritabanı anında teslimat otomasyonu.
            </p>
            <div className="perk-card-tags">
              <span className="perk-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                PayTR & Havale
              </span>
              <span className="perk-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                0-Sn SQL Teslim
              </span>
              <span className="perk-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                256-Bit SSL
              </span>
            </div>
          </div>

          {/* Card 4: Özel UI/UX & Glassmorphism */}
          <div className="advanced-perk-card perk-theme-purple">
            <div className="perk-card-glow-bar" />
            <div className="perk-card-header-row">
              <span className="perk-card-number">04</span>
              <span className="perk-card-pill">ÖZEL FİGMA ÇİZİMİ</span>
            </div>
            <div className="perk-icon-container">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
              </svg>
            </div>
            <h4 className="perk-card-title">Özel UI/UX & Glassmorphism</h4>
            <p className="perk-card-desc">
              Topluluğunuza ve markanıza özel, modern neon ışıklandırmalı premium koyu tema tasarımı.
            </p>
            <div className="perk-card-tags">
              <span className="perk-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 18 3 22 9 12 22 2 9"/></svg>
                Glassmorphism
              </span>
              <span className="perk-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                Neon Koyu Tema
              </span>
              <span className="perk-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
                Özel Tipografi
              </span>
            </div>
          </div>
        </div>
        </>
        )}
      </div>

      {/* Fullscreen Modal View */}
      {isLivePreviewActive && isFullscreen && (
        <div className="showcase-fullscreen-modal" role="dialog" aria-modal="true">
          <div className="fullscreen-modal-header">
            <div className="fullscreen-title-box">
              <span className="dot dot-green" />
              <strong>{selectedTemplate.name}</strong>
              <span className="fullscreen-url-pill">{addressBarInput}</span>
            </div>
            <div className="fullscreen-modal-actions">
              <button
                type="button"
                className="showcase-action-btn"
                onClick={handleOpenExternal}
              >
                Yeni Sekmede Aç ↗
              </button>
              <button
                type="button"
                className="fullscreen-close-btn"
                onClick={() => setIsFullscreen(false)}
                aria-label="Tam Ekrandan Çık"
              >
                ✕ Kapat (ESC)
              </button>
            </div>
          </div>
          <div className="fullscreen-modal-body">
            <iframe
              src={currentUrl}
              title="Tam Ekran Web Sitesi Önizlemesi"
              className="fullscreen-iframe"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      )}
    </section>
  );
}
