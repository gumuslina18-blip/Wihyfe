'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const PIN_SAMPLES = [
  ['4', '2', '8', '1', '9', '0'],
  ['7', '1', '5', '3', '8', '4'],
  ['9', '0', '6', '2', '4', '8'],
  ['5', '8', '2', '4', '7', '0'],
];

export default function InteractiveWorkflow() {
  const { t, language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(68);
  const [pinSampleIndex, setPinSampleIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [isPinSuccess, setIsPinSuccess] = useState(false);

  const stepsData = [
    {
      number: '01',
      title: language === 'TR' ? 'Wihyfe Yazılım & İstemci' : 'Wihyfe Software & Client',
      desc: language === 'TR' 
        ? 'Wihyfe istemcisini edinin veya web konsolu üzerinden sistem oturumunuzu başlatın.' 
        : 'Download the Wihyfe client or launch session via web console.',
      category: language === 'TR' ? 'Yazılım İstemcisi' : 'Software Client',
      mockupTitle: 'Wihyfe',
      mockupSub: language === 'TR' ? 'Wihyfe istemcisini indir & başlat.' : 'Download & launch Wihyfe client.',
      icon: 'download',
    },
    {
      number: '02',
      title: language === 'TR' ? 'Oturuma Bağlan' : 'Connect Session',
      desc: language === 'TR'
        ? 'İstemciyi veya web konsolunu açarak güvenli Wihyfe yönetim oturumuna bağlanın.'
        : 'Launch client or web console and connect to secure Wihyfe session.',
      category: language === 'TR' ? 'Yetkili Oturumu' : 'Privileged Session',
      mockupTitle: language === 'TR' ? 'Yönetici olarak çalıştır.' : 'Run as administrator.',
      mockupSub: language === 'TR' ? 'İstemciyi aç ve Wihyfe oturumuna bağlan.' : 'Launch client and connect to Wihyfe session.',
      icon: 'folder',
    },
    {
      number: '03',
      title: language === 'TR' ? 'PIN ile Başlat' : 'Start with PIN',
      desc: language === 'TR'
        ? '6 haneli Wihyfe PIN kodunuzu girerek lisanslı yazılımınızı ve panelinizi anında kullanmaya başlayın.'
        : 'Enter your 6-digit Wihyfe PIN to activate your software and management dashboard.',
      category: language === 'TR' ? 'Wihyfe PIN\'i' : 'Wihyfe PIN',
      mockupTitle: language === 'TR' ? 'Oturumu bağla.' : 'Connect session.',
      mockupSub: language === 'TR' ? 'Wihyfe PIN\'i ile kullanmaya başla.' : 'Start using with Wihyfe PIN.',
      icon: 'shield-check',
    },
    {
      number: '04',
      title: language === 'TR' ? 'Sistem & Veri Denetimi' : 'System & Data Audit',
      desc: language === 'TR'
        ? 'FiveM SQL dizeleri, işlemler, komut akışları ve canlı logları tek ekranda izleyin.'
        : 'Monitor FiveM SQL strings, operations, command flow, and live telemetry in one place.',
      category: language === 'TR' ? 'Denetim Kapsamı' : 'Audit Scope',
      mockupTitle: language === 'TR' ? 'İnceleme alanları' : 'Inspection Areas',
      mockupSub: language === 'TR' ? 'FiveM, web ve Discord işlemleri, komutlar ve hata ayıklamaları.' : 'FiveM, web, and Discord operations, commands, and debugging.',
      icon: 'search',
    },
    {
      number: '05',
      title: language === 'TR' ? 'Otonom Güvenlik Taraması' : 'Autonomous Security Scan',
      desc: language === 'TR'
        ? 'Gelişmiş güvenlik motoru sistemleri inceler; yetkiler, API köprüleri ve tehditleri filtreler.'
        : 'Advanced security engine inspects server roles, API bridges, and threat vectors.',
      category: language === 'TR' ? 'Sistem Taraması' : 'System Scan',
      mockupTitle: language === 'TR' ? 'Sistem inceleniyor.' : 'System inspecting.',
      mockupSub: language === 'TR' ? 'Derin altyapı analizi' : 'Deep infrastructure analysis',
      icon: 'hourglass',
    },
    {
      number: '06',
      title: language === 'TR' ? 'Panel Kullanıma Hazır' : 'Panel Ready to Use',
      desc: language === 'TR'
        ? 'Kurulum ve yetkilendirme tamamlandı! Yönetim paneli aktif, tüm operasyonunuz kontrolünüz altında.'
        : 'Setup and authorization complete! Management dashboard is active, operations under your control.',
      category: language === 'TR' ? 'Operasyon Durumu' : 'Operation Status',
      mockupTitle: language === 'TR' ? 'Doğrulandı: Panel Kullanıma Hazır.' : 'Verified: Panel Ready to Use.',
      mockupSub: language === 'TR' ? 'Tüm modüller aktif, yönetim paneli parmaklarınızın ucunda.' : 'All modules active, dashboard at your fingertips.',
      icon: 'file-text',
    },
  ];

  // Auto-play interval
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stepsData.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, stepsData.length]);

  // Subtle animated progress bar for Step 5
  useEffect(() => {
    if (activeStep === 4) {
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 98) return 54;
          return prev + 1;
        });
      }, 120);
      return () => clearInterval(interval);
    }
  }, [activeStep]);

  // Step 3 PIN auto-typing animation loop
  useEffect(() => {
    if (activeStep !== 2) {
      setTypedLength(0);
      setIsPinSuccess(false);
      return;
    }

    let timer: NodeJS.Timeout;

    if (typedLength < 6) {
      const delay = typedLength === 0 ? 350 : 280;
      timer = setTimeout(() => {
        setTypedLength((prev) => prev + 1);
      }, delay);
    } else if (typedLength === 6 && !isPinSuccess) {
      timer = setTimeout(() => {
        setIsPinSuccess(true);
      }, 200);
    } else if (isPinSuccess) {
      timer = setTimeout(() => {
        setIsPinSuccess(false);
        setTypedLength(0);
        setPinSampleIndex((prev) => (prev + 1) % PIN_SAMPLES.length);
      }, 1600);
    }

    return () => clearTimeout(timer);
  }, [activeStep, typedLength, isPinSuccess]);

  const handleNextStep = () => {
    setActiveStep((prev) => (prev + 1) % stepsData.length);
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'download':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        );
      case 'folder':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        );
      case 'shield-check':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        );
      case 'search':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        );
      case 'hourglass':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 22h14" />
            <path d="M5 2h14" />
            <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
            <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
          </svg>
        );
      case 'file-text':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section 
      className="section how-it-works-section" 
      id="nasil-calisir"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        {/* Section Header matching screenshots */}
        <div className="hiw-section-header">
          <h2 className="hiw-main-title">{t.workflow.title}</h2>
          <span className="hiw-header-subtext">{t.workflow.stepSubtext}</span>
        </div>

        {/* Two-Column Interactive Grid */}
        <div className="hiw-interactive-grid">
          {/* Left Column: Interactive Step Selector */}
          <div className="hiw-steps-list">
            {stepsData.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.number}
                  className={`hiw-step-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveStep(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveStep(idx);
                    }
                  }}
                >
                  <div className="hiw-step-header">
                    <div className="hiw-step-num-title">
                      <span className="hiw-step-number">{step.number}</span>
                      <span className="hiw-step-title">{step.title}</span>
                    </div>
                    <div className="hiw-step-icon">
                      {renderIcon(step.icon)}
                    </div>
                  </div>

                  {isActive && (
                    <div className="hiw-step-desc-wrapper">
                      <p className="hiw-step-desc">{step.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Preview Window Mockup */}
          <div className="hiw-mockup-window">
            <div className="hiw-window-ambient" aria-hidden="true" />

            {/* Window Header */}
            <div className="hiw-mockup-topbar">
              <div className="hiw-mockup-brand">
                <img
                  src="/wihyfe-icon.png"
                  alt="Wihyfe Logo"
                  width={20}
                  height={20}
                  style={{ objectFit: 'contain' }}
                />
                <span className="hiw-brand-name">Wihyfe</span>
              </div>

              <div className="hiw-mockup-sample-badge">
                <span>{t.workflow.sampleData}</span>
              </div>
            </div>

            {/* Window Subheader */}
            <div className="hiw-mockup-meta-row">
              <span className="hiw-meta-category">{stepsData[activeStep].category}</span>
              <span className="hiw-meta-code">WH / 428190</span>
            </div>

            {/* Dynamic Center Canvas (Animates based on activeStep) */}
            <div className="hiw-mockup-body">
              {/* STEP 1: İstemciyi İndir */}
              {activeStep === 0 && (
                <div className="hiw-scene hiw-scene-step1 fade-in">
                  <div className="hiw-floating-cube-wrap">
                    <div className="hiw-client-card-3d">
                      <div className="hiw-card-spine" />
                      <div className="hiw-card-face">
                        <img
                          src="/wihyfe-icon.png"
                          alt="Wihyfe"
                          width={44}
                          height={44}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <div className="hiw-code-chip">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="16 18 22 12 16 6" />
                          <polyline points="8 6 2 12 8 18" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <h3 className="hiw-scene-heading">{stepsData[0].mockupTitle}</h3>
                  <p className="hiw-scene-sub">{stepsData[0].mockupSub}</p>

                  <div className="hiw-verified-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Wihyfe İstemcisi</span>
                  </div>
                </div>
              )}

              {/* STEP 2: Yönetici Olarak Çalıştır */}
              {activeStep === 1 && (
                <div className="hiw-scene hiw-scene-step2 fade-in">
                  <div className="hiw-floating-cube-wrap">
                    <div className="hiw-client-card-3d">
                      <div className="hiw-card-spine" />
                      <div className="hiw-card-face">
                        <img
                          src="/wihyfe-icon.png"
                          alt="Wihyfe"
                          width={44}
                          height={44}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <div className="hiw-shield-chip">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <h3 className="hiw-scene-heading">{stepsData[1].mockupTitle}</h3>
                  <p className="hiw-scene-sub">{stepsData[1].mockupSub}</p>

                  <div className="hiw-verified-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Wihyfe İstemcisi</span>
                  </div>
                </div>
              )}

              {/* STEP 3: Oturuma Bağlan */}
              {activeStep === 2 && (
                <div className="hiw-scene hiw-scene-step3 fade-in">
                  <div className="hiw-pin-device-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
                      <line x1="9" y1="7" x2="9.01" y2="7" />
                      <line x1="12" y1="7" x2="12.01" y2="7" />
                      <line x1="15" y1="7" x2="15.01" y2="7" />
                      <line x1="9" y1="11" x2="9.01" y2="11" />
                      <line x1="12" y1="11" x2="12.01" y2="11" />
                      <line x1="15" y1="11" x2="15.01" y2="11" />
                      <line x1="9" y1="15" x2="9.01" y2="15" />
                      <line x1="12" y1="15" x2="12.01" y2="15" />
                      <line x1="15" y1="15" x2="15.01" y2="15" />
                    </svg>
                  </div>

                  <h3 className="hiw-scene-heading">{stepsData[2].mockupTitle}</h3>
                  <p className="hiw-scene-sub">{stepsData[2].mockupSub}</p>

                  {/* 6 Digit PIN Boxes with live typing animation loop */}
                  <div className="hiw-pin-digits-row">
                    {PIN_SAMPLES[pinSampleIndex].map((digit, i) => {
                      const isFilled = i < typedLength;
                      const isCurrent = i === typedLength && !isPinSuccess;
                      return (
                        <div
                          key={i}
                          className={`hiw-pin-box ${isFilled ? 'is-filled' : ''} ${isCurrent ? 'is-active-cursor' : ''} ${isPinSuccess ? 'is-verified' : ''}`}
                        >
                          {isFilled ? (
                            <span className="hiw-pin-digit-val animate-pop">{digit}</span>
                          ) : isCurrent ? (
                            <span className="hiw-pin-cursor">|</span>
                          ) : (
                            <span className="hiw-pin-dot">•</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className={`hiw-status-sub-pill ${isPinSuccess ? 'is-connected' : ''}`}>
                    <span className={`dot-live ${isPinSuccess ? 'dot-success' : ''}`} />
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>
                      {isPinSuccess
                        ? (language === 'TR' ? 'Oturum bağlandı • Doğrulandı' : 'Session connected • Verified')
                        : (language === 'TR' ? 'Wihyfe bot oturumu' : 'Wihyfe bot session')
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 4: Hedef Denetimi */}
              {activeStep === 3 && (
                <div className="hiw-scene hiw-scene-step4 fade-in">
                  <div className="hiw-display-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>

                  <h3 className="hiw-scene-heading">{stepsData[3].mockupTitle}</h3>

                  <div className="hiw-audit-cards-list">
                    <div className="hiw-audit-card">
                      <div className="hiw-audit-left">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                          <rect x="4" y="4" width="16" height="16" rx="2" />
                          <line x1="9" y1="9" x2="15" y2="9" />
                          <line x1="9" y1="13" x2="15" y2="13" />
                          <line x1="9" y1="17" x2="13" y2="17" />
                        </svg>
                        <span>{language === 'TR' ? 'Sunucu dizeleri' : 'Server strings'}</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>

                    <div className="hiw-audit-card">
                      <div className="hiw-audit-left">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                          <polygon points="12 2 2 7 12 12 22 7 12 2" />
                          <polyline points="2 17 12 22 22 17" />
                          <polyline points="2 12 12 17 22 12" />
                        </svg>
                        <span>{language === 'TR' ? 'İşlemler ve komutlar' : 'Processes and commands'}</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>

                    <div className="hiw-audit-card">
                      <div className="hiw-audit-left">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <circle cx="11" cy="14" r="3" />
                          <line x1="13.5" y1="16.5" x2="16" y2="19" />
                        </svg>
                        <span>{language === 'TR' ? 'Hata ayıklamaları' : 'Debugging logs'}</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Adli Motor (Animated Radar + Progress Bar) */}
              {activeStep === 4 && (
                <div className="hiw-scene hiw-scene-step5 fade-in">
                  <div className="hiw-radar-container">
                    <div className="hiw-radar-ring ring-1" />
                    <div className="hiw-radar-ring ring-2" />
                    <div className="hiw-radar-ring ring-3" />
                    <div className="hiw-radar-crosshair-h" />
                    <div className="hiw-radar-crosshair-v" />
                    <div className="hiw-radar-sweep-beam" />
                    
                    {/* Pulsing Target Points */}
                    <span className="hiw-radar-blip blip-1" />
                    <span className="hiw-radar-blip blip-2" />

                    <div className="hiw-radar-center-logo">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="hiw-scene-heading">{stepsData[4].mockupTitle}</h3>

                  {/* Progress Bar Container */}
                  <div className="hiw-progress-widget">
                    <div className="hiw-progress-labels">
                      <span className="hiw-progress-name">{language === 'TR' ? 'Sunucu analizi' : 'Server analysis'}</span>
                      <span className="hiw-progress-val">{analysisProgress}%</span>
                    </div>
                    <div className="hiw-progress-track">
                      <div 
                        className="hiw-progress-fill" 
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="hiw-analysis-tags-row">
                    <span className="hiw-tag-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{language === 'TR' ? 'İşlemler' : 'Processes'}</span>
                    </span>
                    <span className="hiw-tag-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{language === 'TR' ? 'Komutlar' : 'Commands'}</span>
                    </span>
                    <span className="hiw-tag-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                      </svg>
                      <span>{language === 'TR' ? 'Sunucu dizeleri' : 'Server strings'}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 6: Karar Dosyası (Verdict Report) */}
              {activeStep === 5 && (
                <div className="hiw-scene hiw-scene-step6 fade-in">
                  <div className="hiw-verdict-shield-glow">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>

                  <h3 className="hiw-scene-heading">{stepsData[5].mockupTitle}</h3>
                  <p className="hiw-scene-sub">{stepsData[5].mockupSub}</p>

                  <div className="hiw-verdict-details-box">
                    <div className="hiw-verdict-row">
                      <div className="hiw-verdict-item green-tag">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{language === 'TR' ? 'Doğrulandı: Panel Kullanıma Hazır' : 'Verified: Panel Ready to Use'}</span>
                      </div>
                      <span className="hiw-verdict-threats">{language === 'TR' ? 'Canlı & Aktif' : 'Live & Active'}</span>
                    </div>

                    <div className="hiw-verdict-meta">
                      <span>{language === 'TR' ? 'Yönetim Paneli: ' : 'Dashboard: '}<strong>{language === 'TR' ? 'Aktif & Senkronize' : 'Active & Synced'}</strong></span>
                      <span>{language === 'TR' ? 'Durum: ' : 'Status: '}<strong>#PANEL-AKTIF-ONLINE</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Window Bottom Info Bar */}
            <div className="hiw-mockup-bottombar">
              <div className="hiw-preview-indicator">
                <span className="dot-live" />
                <span>{t.workflow.previewBadge}</span>
              </div>

              <div className="hiw-os-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.8" />
                </svg>
                <span>{t.workflow.previewWindows}</span>
              </div>
            </div>

            {/* Window Footer Step Navigation */}
            <div className="hiw-mockup-footer-nav">
              <div className="hiw-footer-counter">
                <span className="hiw-step-count-badge">
                  {stepsData[activeStep].number} / 06
                </span>
                <span className="hiw-step-count-title">
                  {stepsData[activeStep].title}
                </span>
              </div>

              <button 
                type="button" 
                className="hiw-next-btn"
                onClick={handleNextStep}
                title="Sonraki Adım"
                aria-label="Sonraki Adım"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
