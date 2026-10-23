'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Chapter {
  id: string;
  num: string;
  titleTR: string;
  titleEN: string;
  shortDescTR: string;
  shortDescEN: string;
  tagTR: string;
  tagEN: string;
  metric: string;
  metricLabelTR: string;
  metricLabelEN: string;
  accent: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 'management',
    num: '01',
    titleTR: 'Kolay Yönetim & Turbo Kurulum',
    titleEN: 'Easy Management & Turbo Setup',
    shortDescTR: 'Tekrarlayan işleri sadeleştirin, yazılım ve yönetim sistemleriniz saniyeler içinde devreye girsin.',
    shortDescEN: 'Streamline repetitive tasks, your software and management systems deploy in seconds.',
    tagTR: 'Otomasyon & Hız',
    tagEN: 'Automation & Speed',
    metric: '12ms',
    metricLabelTR: 'Ortalama Yanıt',
    metricLabelEN: 'Average Latency',
    accent: '#0878FF',
  },
  {
    id: 'modular',
    num: '02',
    titleTR: 'İhtiyaca Uygun & Modüler Yapı',
    titleEN: 'Custom Fit & Modular Design',
    shortDescTR: 'Sunucunuzun ölçeğine ve topluluğunuza özel modülleri seçin, sadece ihtiyacınızı çalıştırın.',
    shortDescEN: 'Pick tailored modules for your community size; only run what you genuinely need.',
    tagTR: 'Esnek Mimari',
    tagEN: 'Flexible Architecture',
    metric: '4 Modül',
    metricLabelTR: 'Bağımsız Sistem',
    metricLabelEN: 'Independent Engine',
    accent: '#00D2FF',
  },
  {
    id: 'experience',
    num: '03',
    titleTR: 'Tutarlı Deneyim & Çift Yönlü Senkron',
    titleEN: 'Consistent Experience & 2-Way Sync',
    shortDescTR: 'Web yönetim paneli ve Discord komutları kusursuz uyum ve sıfır gecikmeyle senkronize.',
    shortDescEN: 'Web management panel and Discord slash commands operate with instant bidirectional sync.',
    tagTR: 'Canlı Entegrasyon',
    tagEN: 'Live Integration',
    metric: '<8ms',
    metricLabelTR: 'Veri Senkronizasyonu',
    metricLabelEN: 'Data Sync Time',
    accent: '#6366F1',
  },
  {
    id: 'scale',
    num: '04',
    titleTR: 'Gelişime Açık & Kesintisiz Bulut',
    titleEN: 'Infinite Scale & 24/7 Cloud',
    shortDescTR: 'Topluluğunuz büyüdükçe otomatik ölçeklenen bulut mimarisi ve %99.99 kesintisiz uptime.',
    shortDescEN: 'Auto-scaling enterprise cloud infrastructure with a guaranteed 99.99% active uptime.',
    tagTR: 'Yüksek Performans',
    tagEN: 'High Performance',
    metric: '%99.99',
    metricLabelTR: 'Kesintisiz Uptime',
    metricLabelEN: 'Active Uptime',
    accent: '#10B981',
  },
];

export default function WhyUs() {
  const { t, language } = useLanguage();
  const [activeChapter, setActiveChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 - 100 within current chapter
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);
  const [isAudioActive, setIsAudioActive] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Scene 1 interactive toggle states
  const [guardActive, setGuardActive] = useState(true);
  const [welcomeActive, setWelcomeActive] = useState(true);
  const [ticketActive, setTicketActive] = useState(true);

  // Scene 2 interactive customization slider
  const [defenseLevel, setDefenseLevel] = useState(100);

  // Scene 3 interactive sync pulse
  const [syncCount, setSyncCount] = useState(1480);

  // Animated sound waves
  const [waveHeights, setWaveHeights] = useState([40, 75, 55, 90, 60, 30, 85, 45]);

  const playerRef = useRef<HTMLDivElement>(null);
  const CHAPTER_DURATION_MS = 6500; // 6.5s per chapter at 1x speed

  // Soundwave animation effect
  useEffect(() => {
    if (!isPlaying || !isAudioActive) return;
    const interval = setInterval(() => {
      setWaveHeights([
        Math.floor(25 + Math.random() * 70),
        Math.floor(30 + Math.random() * 65),
        Math.floor(40 + Math.random() * 60),
        Math.floor(50 + Math.random() * 50),
        Math.floor(35 + Math.random() * 65),
        Math.floor(20 + Math.random() * 75),
        Math.floor(45 + Math.random() * 55),
        Math.floor(30 + Math.random() * 65),
      ]);
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying, isAudioActive]);

  // Main playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 40; // ~25 fps update for smooth progress
    const increment = (intervalTime / (CHAPTER_DURATION_MS / playbackSpeed)) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          setActiveChapter((curr) => (curr + 1) % CHAPTERS.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  // Periodic simulated sync ticker
  useEffect(() => {
    const syncTimer = setInterval(() => {
      setSyncCount((prev) => prev + Math.floor(1 + Math.random() * 3));
    }, 2400);
    return () => clearInterval(syncTimer);
  }, []);

  const handleSelectChapter = (idx: number) => {
    setActiveChapter(idx);
    setProgress(0);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handlePrevChapter = () => {
    setActiveChapter((prev) => (prev === 0 ? CHAPTERS.length - 1 : prev - 1));
    setProgress(0);
  };

  const handleNextChapter = () => {
    setActiveChapter((prev) => (prev + 1) % CHAPTERS.length);
    setProgress(0);
  };

  const currentChapter = CHAPTERS[activeChapter];
  const isTR = language !== 'EN';

  // Elapsed video time calculation (total 26s video loop)
  const totalSeconds = 26;
  const currentTotalSec = (activeChapter * (totalSeconds / 4) + (progress / 100) * (totalSeconds / 4)).toFixed(1);

  return (
    <section className="section why-us-showcase-section" id="neden-wihyfe">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">{t.whyUs.badge}</div>
          <h2 className="section-title">
            {t.whyUs.title} <span className="text-accent">{t.whyUs.titleAccent}</span>
          </h2>
          <p className="section-desc">
            {t.whyUs.desc}
          </p>

          {/* Interactive Feature Badge Pill */}
          <div className="why-video-mode-pill">
            <span className="live-rec-dot" />
            <span className="live-rec-text">
              {isTR ? 'İNTERAKTİF VİDEO ANLATIMI & VİTRİN' : 'INTERACTIVE VIDEO SHOWCASE & DEMO'}
            </span>
            <span className="pill-divider">•</span>
            <span className="pill-specs">4K 60FPS ULTRA HD</span>
          </div>
        </div>

        {/* ====================================================================
            THE CINEMATIC VIDEO PLAYER THEATER
            ==================================================================== */}
        <div
          ref={playerRef}
          className={`why-video-theater ${isFullscreen ? 'is-expanded-cinema' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ambient Cyber Glow */}
          <div className="theater-ambient-glow" aria-hidden="true" style={{ background: `radial-gradient(circle at 50% 30%, ${currentChapter.accent}22 0%, transparent 70%)` }} />

          {/* Top HUD Viewfinder Bar */}
          <div className="theater-top-hud">
            <div className="hud-left">
              <span className={`hud-rec-badge ${isPlaying ? 'is-recording' : ''}`}>
                <span className="hud-rec-dot" />
                <span>{isPlaying ? 'REC' : 'PAUSED'}</span>
              </span>
              <span className="hud-scene-name">
                WIHYFE_SHOWCASE_CH0{activeChapter + 1}.MP4
              </span>
            </div>

            <div className="hud-center">
              <div className="hud-chapter-pill">
                <span className="hud-ch-tag">BÖLÜM {currentChapter.num}:</span>
                <span className="hud-ch-title">{isTR ? currentChapter.titleTR : currentChapter.titleEN}</span>
              </div>
            </div>

            <div className="hud-right">
              {/* Audio Equalizer Visualizer */}
              <button
                type="button"
                className={`hud-audio-btn ${isAudioActive ? 'is-active' : ''}`}
                onClick={() => setIsAudioActive(!isAudioActive)}
                title={isAudioActive ? (isTR ? 'Sesi Kapat' : 'Mute') : (isTR ? 'Sesi Aç' : 'Unmute')}
              >
                <div className="hud-sound-wave" aria-hidden="true">
                  {waveHeights.map((h, i) => (
                    <span
                      key={i}
                      className="wave-bar"
                      style={{ height: isPlaying && isAudioActive ? `${h}%` : '20%' }}
                    />
                  ))}
                </div>
                <span className="audio-label">{isAudioActive ? 'AUDIO ON' : 'MUTED'}</span>
              </button>

              <div className="hud-badge-4k">4K • 60 FPS</div>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                className="hud-tool-btn"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? (isTR ? 'Normal Görünüm' : 'Exit Fullscreen') : (isTR ? 'Genişletilmiş Sinema' : 'Cinema Mode')}
              >
                {isFullscreen ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="14" y1="10" x2="21" y2="3" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Viewfinder Framing Marks */}
          <div className="theater-viewfinder-overlay" aria-hidden="true">
            <span className="corner-bracket top-left" />
            <span className="corner-bracket top-right" />
            <span className="corner-bracket bottom-left" />
            <span className="corner-bracket bottom-right" />
            <span className="center-crosshair" />
          </div>

          {/* ==================================================================
              DYNAMIC ANIMATED VIDEO SCREEN CANVAS
              ================================================================== */}
          <div className="theater-screen-viewport">
            {/* Big Center Play/Pause Overlay (Shows on Hover or when Paused) */}
            <button
              type="button"
              className={`theater-center-play-overlay ${!isPlaying || isHovered ? 'is-visible' : ''}`}
              onClick={handleTogglePlay}
              aria-label={isPlaying ? 'Videoyu Duraklat' : 'Videoyu Oynat'}
            >
              <div className="play-overlay-circle">
                {isPlaying ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                )}
              </div>
              <span className="play-overlay-text">
                {isPlaying ? (isTR ? 'Duraklatmak için tıkla' : 'Click to pause') : (isTR ? 'Oynatmak için tıkla' : 'Click to resume')}
              </span>
            </button>

            {/* SCENE 01: KOLAY YÖNETİM & TURBO KURULUM */}
            {activeChapter === 0 && (
              <div className="scene-container scene-management animate-fade-in">
                <div className="scene-inner-grid">
                  {/* Left: Simulated Discord Command Execution Terminal */}
                  <div className="scene-terminal-box">
                    <div className="terminal-header">
                      <div className="terminal-dots">
                        <span className="t-dot dot-red" />
                        <span className="t-dot dot-yellow" />
                        <span className="t-dot dot-green" />
                      </div>
                      <span className="terminal-title">discord-shell / bot-deploy.sh</span>
                      <span className="terminal-badge">READY</span>
                    </div>

                    <div className="terminal-body">
                      <div className="cmd-line">
                        <span className="prompt-symbol">$</span>
                        <span className="cmd-text typing-animation">/wihyfe auto-setup --mode=turbo --guild=community</span>
                        <span className="typing-cursor" />
                      </div>

                      <div className="cmd-output-card">
                        <div className="bot-author-row">
                          <div className="bot-avatar-mock">W</div>
                          <div className="bot-info-meta">
                            <span className="bot-name">Wihyfe Bot</span>
                            <span className="bot-verified-tag">✓ BOT</span>
                            <span className="bot-time">Bugün 14:32</span>
                          </div>
                        </div>

                        <div className="bot-embed-response">
                          <div className="embed-strip" />
                          <div className="embed-content">
                            <h4 className="embed-title">🚀 Turbo Sunucu Mimarisi Canlıya Alındı!</h4>
                            <p className="embed-desc">
                              Wihyfe akıllı motoru sunucunuzu optimize etti. Roller, kanallar ve koruma kalkanları senkronize edildi.
                            </p>

                            <div className="embed-features-list">
                              <div className="embed-feature-row">
                                <span className="feat-check">✓</span>
                                <span className="feat-label">14 Kategori &amp; 42 Kanal Oluşturuldu</span>
                                <span className="feat-speed">8ms</span>
                              </div>
                              <div className="embed-feature-row">
                                <span className="feat-check">✓</span>
                                <span className="feat-label">Yetkili &amp; Üye İzin Hiyerarşisi Kilitlendi</span>
                                <span className="feat-speed">12ms</span>
                              </div>
                              <div className="embed-feature-row">
                                <span className="feat-check">✓</span>
                                <span className="feat-label">7/24 Kesintisiz Guard &amp; Anti-Spam Devrede</span>
                                <span className="feat-speed">100%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Floating Live Telemetry Cards */}
                  <div className="scene-metrics-column">
                    <div className="telemetry-card card-lightning">
                      <div className="telemetry-header">
                        <div className="tele-icon-circle icon-blue">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                          </svg>
                        </div>
                        <span className="tele-pill">ULTRA HIZLI</span>
                      </div>
                      <div className="telemetry-value">12<span className="unit">ms</span></div>
                      <div className="telemetry-title">{isTR ? 'Kurulum ve Entegrasyon' : 'Deployment Latency'}</div>
                      <p className="telemetry-sub">{isTR ? 'Tek tıkla hazır şablonlar ile saatler süren sunucu ayarlarını dakikalara indirin.' : 'Reduce hours of server setup to seconds with 1-click cloud templates.'}</p>
                    </div>

                    <div className="telemetry-card card-interactive">
                      <div className="interactive-toggles-box">
                        <span className="toggles-header-title">{isTR ? 'Canlı Otonom Modüller' : 'Live Autonomous Modules'}</span>
                        <div className="toggles-list">
                          <button
                            type="button"
                            className={`module-switch-item ${guardActive ? 'is-on' : ''}`}
                            onClick={() => setGuardActive(!guardActive)}
                          >
                            <span className="switch-dot" />
                            <span className="switch-name">Anti-Raid &amp; Bot Guard</span>
                            <span className="switch-status">{guardActive ? 'AKTİF' : 'DEVRE DIŞI'}</span>
                          </button>
                          <button
                            type="button"
                            className={`module-switch-item ${welcomeActive ? 'is-on' : ''}`}
                            onClick={() => setWelcomeActive(!welcomeActive)}
                          >
                            <span className="switch-dot" />
                            <span className="switch-name">Akıllı Butonlu Kayıt</span>
                            <span className="switch-status">{welcomeActive ? 'AKTİF' : 'DEVRE DIŞI'}</span>
                          </button>
                          <button
                            type="button"
                            className={`module-switch-item ${ticketActive ? 'is-on' : ''}`}
                            onClick={() => setTicketActive(!ticketActive)}
                          >
                            <span className="switch-dot" />
                            <span className="switch-name">7/24 Destek Ticket</span>
                            <span className="switch-status">{ticketActive ? 'AKTİF' : 'DEVRE DIŞI'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 02: İHTİYACA UYGUN & MODÜLER YAPI */}
            {activeChapter === 1 && (
              <div className="scene-container scene-modular animate-fade-in">
                <div className="modular-visualizer-wrap">
                  {/* Center Core Engine */}
                  <div className="modular-core-engine">
                    <div className="core-rings-pulse" aria-hidden="true" />
                    <div className="core-inner-chip">
                      <div className="core-logo-mark">W</div>
                      <span className="core-chip-title">CORE KERNEL</span>
                      <span className="core-chip-sub">WIHYFE v4.2</span>
                      <div className="core-status-badge">
                        <span className="pulse-green-dot" />
                        <span>MODULAR ENGINE</span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Surrounding Modulated Blocks */}
                  <div className="modular-satellites-grid">
                    <div className="satellite-module-card sat-1">
                      <div className="sat-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <div className="sat-info">
                        <span className="sat-name">Güvenlik &amp; Guard</span>
                        <span className="sat-desc">Anti-Spam, Link Engelleyici, Rol Koruma</span>
                      </div>
                      <span className="sat-badge">PLUG &amp; PLAY</span>
                    </div>

                    <div className="satellite-module-card sat-2">
                      <div className="sat-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <line x1="3" y1="9" x2="21" y2="9" />
                          <line x1="9" y1="21" x2="9" y2="9" />
                        </svg>
                      </div>
                      <div className="sat-info">
                        <span className="sat-name">Yetkili Yönetimi &amp; Log</span>
                        <span className="sat-desc">Ses Denetimi, Mesaj Takip, Denetim Kaydı</span>
                      </div>
                      <span className="sat-badge">REALTIME</span>
                    </div>

                    <div className="satellite-module-card sat-3">
                      <div className="sat-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                      </div>
                      <div className="sat-info">
                        <span className="sat-name">Topluluk &amp; Etkileşim</span>
                        <span className="sat-desc">Seviye Sistemi, Ekonomi, Çekilişler</span>
                      </div>
                      <span className="sat-badge">MODULAR</span>
                    </div>

                    <div className="satellite-module-card sat-4">
                      <div className="sat-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <div className="sat-info">
                        <span className="sat-name">Özel Destek &amp; Ticket</span>
                        <span className="sat-desc">Formlu Talep, Butonlu Kategori Seçimi</span>
                      </div>
                      <span className="sat-badge">AUTOMATED</span>
                    </div>
                  </div>

                  {/* Interactive Control Dial */}
                  <div className="modular-bottom-controller">
                    <div className="controller-meta">
                      <span className="controller-label">{isTR ? 'Modüler Güvenlik Seviyesi Ayarı:' : 'Modular Defense Intensity:'}</span>
                      <span className="controller-val">%{defenseLevel} Askeri Düzey</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={defenseLevel}
                      onChange={(e) => setDefenseLevel(Number(e.target.value))}
                      className="defense-slider"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 03: TUTARLI DENEYİM & ÇİFT YÖNLÜ SENKRON */}
            {activeChapter === 2 && (
              <div className="scene-container scene-sync animate-fade-in">
                <div className="sync-showcase-split">
                  {/* Left: Web UI Action */}
                  <div className="sync-side-card card-web-panel">
                    <div className="sync-card-topbar">
                      <div className="topbar-browser-dots">
                        <span className="dot dot-red" />
                        <span className="dot dot-yellow" />
                        <span className="dot dot-green" />
                      </div>
                      <span className="sync-topbar-title">https://wihyfe.com/panel</span>
                      <span className="sync-topbar-tag">WEB PANEL</span>
                    </div>

                    <div className="sync-card-body">
                      <div className="web-action-preview">
                        <div className="web-field-row">
                          <span className="field-name">Guard Modu:</span>
                          <span className="field-badge-on">AKTİF (0ms)</span>
                        </div>
                        <div className="web-field-row">
                          <span className="field-name">Log Kanalı:</span>
                          <span className="field-val">#wihyfe-denetim-kaydi</span>
                        </div>
                        <div className="web-field-row">
                          <span className="field-name">Maksimum Üye Limiti:</span>
                          <span className="field-val">Sınırsız</span>
                        </div>

                        <div className="sync-live-event-badge">
                          <span className="event-pulse-dot" />
                          <span>Panel üzerinden 1 saniye önce güncellendi</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center: Fiber Optic Laser Data Pipe */}
                  <div className="sync-middle-pipe">
                    <div className="pipe-line">
                      <div className="pipe-laser-photon" />
                    </div>
                    <div className="pipe-speed-pill">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                      <span>7.8ms SYNC</span>
                    </div>
                    <span className="pipe-protocol">WEBSOCKET v2 • TLS 1.3</span>
                  </div>

                  {/* Right: Instant Discord Reaction */}
                  <div className="sync-side-card card-discord-panel">
                    <div className="sync-card-topbar discord-style-top">
                      <span className="hash-symbol">#</span>
                      <span className="sync-topbar-title">wihyfe-denetim-kaydi</span>
                      <span className="sync-topbar-tag discord-tag">DISCORD GUILD</span>
                    </div>

                    <div className="sync-card-body discord-body">
                      <div className="discord-audit-stream">
                        <div className="audit-entry">
                          <div className="audit-icon">🛡️</div>
                          <div className="audit-text">
                            <strong>Wihyfe Guard</strong>: Güvenlik politikaları web panelinden anında senkronize edildi.
                          </div>
                          <span className="audit-time">Şimdi</span>
                        </div>

                        <div className="audit-entry">
                          <div className="audit-icon">⚡</div>
                          <div className="audit-text">
                            Toplam İşlenen Olay: <strong>{syncCount.toLocaleString('tr-TR')}</strong>
                          </div>
                          <span className="audit-time">Canlı</span>
                        </div>

                        <div className="audit-entry success-entry">
                          <div className="audit-icon">✓</div>
                          <div className="audit-text">
                            Rol yetkileri sıfır gecikmeyle uygulandı.
                          </div>
                          <span className="audit-time">12ms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 04: GELİŞİME AÇIK & KESİNTİSİZ BULUT */}
            {activeChapter === 3 && (
              <div className="scene-container scene-cloud animate-fade-in">
                <div className="cloud-infrastructure-grid">
                  {/* Left: Global Server Cluster Map */}
                  <div className="cloud-nodes-card">
                    <div className="cloud-card-header">
                      <div className="header-flex">
                        <span className="nodes-title">WIHYFE GLOBAL CLOUD MATRIX</span>
                        <span className="nodes-badge">3 REGIONS ACTIVE</span>
                      </div>
                      <p className="nodes-sub">Yüksek erişilebilirlik garantili yük dengeleyiciler ve anlık CDN ağı.</p>
                    </div>

                    <div className="nodes-list">
                      <div className="node-item is-live">
                        <div className="node-status-indicator">
                          <span className="ping-ring" />
                          <span className="ping-dot" />
                        </div>
                        <div className="node-info">
                          <span className="node-city">İstanbul, TR (TR-Central-01)</span>
                          <span className="node-stats">8ms Ping • %18 Yük • 0 Kesinti</span>
                        </div>
                        <span className="node-uptime">100% UPTIME</span>
                      </div>

                      <div className="node-item is-live">
                        <div className="node-status-indicator">
                          <span className="ping-ring" />
                          <span className="ping-dot" />
                        </div>
                        <div className="node-info">
                          <span className="node-city">Frankfurt, DE (EU-West-02)</span>
                          <span className="node-stats">14ms Ping • %24 Yük • 0 Kesinti</span>
                        </div>
                        <span className="node-uptime">100% UPTIME</span>
                      </div>

                      <div className="node-item is-live">
                        <div className="node-status-indicator">
                          <span className="ping-ring" />
                          <span className="ping-dot" />
                        </div>
                        <div className="node-info">
                          <span className="node-city">Londra, UK (EU-North-01)</span>
                          <span className="node-stats">18ms Ping • %15 Yük • 0 Kesinti</span>
                        </div>
                        <span className="node-uptime">100% UPTIME</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Live Telemetry & Automated Backup System */}
                  <div className="cloud-stats-column">
                    <div className="cloud-stat-card card-uptime-guarantee">
                      <div className="guarantee-top">
                        <span className="guarantee-pct">%99.99</span>
                        <span className="guarantee-pill">SLA KESİNTİSİZLİK</span>
                      </div>
                      <div className="guarantee-title">{isTR ? 'Kesintisiz 7/24 Bulut Garantisi' : 'Guaranteed 24/7 Cloud Uptime'}</div>
                      <p className="guarantee-desc">
                        {isTR
                          ? 'DDoS korumalı kurumsal bulut sunucularımızda botlarınız asla kapanmaz veya çevrimdışı kalmaz.'
                          : 'Hosted on DDoS-shielded enterprise clouds, your bots never drop offline or suffer downtime.'}
                      </p>

                      {/* Animated Real-time SVG Sine Wave Uptime Chart */}
                      <div className="uptime-svg-container" aria-hidden="true">
                        <svg className="uptime-svg-chart" viewBox="0 0 300 45" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M0,25 Q30,15 60,25 T120,25 T180,20 T240,25 T300,20 L300,45 L0,45 Z"
                            fill="url(#chartGradient)"
                          />
                          <path
                            d="M0,25 Q30,15 60,25 T120,25 T180,20 T240,25 T300,20"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="2.5"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="cloud-stat-card card-backup-pulse">
                      <div className="backup-icon-row">
                        <div className="backup-icon">💾</div>
                        <span className="backup-status-text">ANLIK OTOMATİK YEDEKLEME</span>
                      </div>
                      <span className="backup-file">Snapshot #8491 - Şifreli &amp; Güvende</span>
                      <div className="backup-progress-line">
                        <span className="backup-progress-fill" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ==================================================================
              PERSISTENT BOTTOM VIDEO SCRUBBER & CONTROLS BAR
              ================================================================== */}
          <div className="theater-bottom-controls">
            {/* Play/Pause & Skip Buttons */}
            <div className="playback-buttons-group">
              <button
                type="button"
                className="ctrl-btn btn-skip"
                onClick={handlePrevChapter}
                title={isTR ? 'Önceki Bölüm' : 'Previous Chapter'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="19 20 9 12 19 4 19 20" />
                  <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>

              <button
                type="button"
                className="ctrl-btn btn-play-pause"
                onClick={handleTogglePlay}
                title={isPlaying ? (isTR ? 'Duraklat' : 'Pause') : (isTR ? 'Oynat' : 'Play')}
              >
                {isPlaying ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                className="ctrl-btn btn-skip"
                onClick={handleNextChapter}
                title={isTR ? 'Sonraki Bölüm' : 'Next Chapter'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 4 15 12 5 20 5 4" />
                  <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>

            {/* Timecode display */}
            <div className="theater-timecode">
              <span className="time-current">00:{String(Math.floor(Number(currentTotalSec))).padStart(2, '0')}</span>
              <span className="time-slash">/</span>
              <span className="time-total">00:{totalSeconds}</span>
            </div>

            {/* Segmented Chapter Timeline Scrubber */}
            <div className="theater-timeline-scrubber" aria-label="Video Bölümleri">
              {CHAPTERS.map((ch, idx) => {
                const isPast = idx < activeChapter;
                const isCurrent = idx === activeChapter;
                const fillWidth = isPast ? 100 : isCurrent ? progress : 0;

                return (
                  <button
                    key={ch.id}
                    type="button"
                    className={`scrubber-segment ${isCurrent ? 'is-current' : ''}`}
                    onClick={() => handleSelectChapter(idx)}
                    title={`${ch.num}: ${isTR ? ch.titleTR : ch.titleEN}`}
                  >
                    <span className="segment-track">
                      <span
                        className="segment-fill"
                        style={{
                          width: `${fillWidth}%`,
                          backgroundColor: isCurrent ? ch.accent : '#0878FF',
                        }}
                      />
                    </span>
                    <span className="segment-label">
                      {ch.num} • {isTR ? ch.tagTR : ch.tagEN}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Speed Selector Toggle (1x, 1.5x, 2x) */}
            <button
              type="button"
              className="ctrl-btn btn-speed"
              onClick={() => {
                const nextSpeed = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1;
                setPlaybackSpeed(nextSpeed);
              }}
              title={isTR ? 'Oynatma Hızı' : 'Playback Speed'}
            >
              <span>{playbackSpeed}x</span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            THE 4 SYNCHRONIZED CHAPTER PILLAR CARDS
            ==================================================================== */}
        <div className="why-chapters-grid">
          {CHAPTERS.map((ch, idx) => {
            const isActive = activeChapter === idx;

            return (
              <div
                key={ch.id}
                className={`why-chapter-card ${isActive ? 'is-active-chapter' : ''}`}
                onClick={() => handleSelectChapter(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelectChapter(idx);
                  }
                }}
              >
                {/* Active Indicator Top Progress Bar */}
                <div className="card-top-progress-track">
                  <div
                    className="card-top-progress-fill"
                    style={{
                      width: isActive ? `${progress}%` : '0%',
                      backgroundColor: ch.accent,
                    }}
                  />
                </div>

                {/* Top Row: Number, Tag, Live Indicator */}
                <div className="chapter-card-topbar">
                  <div className="chapter-num-badge" style={{ borderColor: isActive ? ch.accent : 'rgba(255,255,255,0.1)' }}>
                    <span>{ch.num}</span>
                  </div>

                  {isActive && (
                    <div className="chapter-live-playing-badge" style={{ color: ch.accent }}>
                      <span className="live-playing-dot" style={{ backgroundColor: ch.accent }} />
                      <span>{isTR ? 'OYNATILIYOR' : 'PLAYING'}</span>
                    </div>
                  )}

                  <div className="chapter-metric-pill">
                    <span className="metric-val">{ch.metric}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="chapter-card-title">
                  {isTR ? ch.titleTR : ch.titleEN}
                </h3>
                <p className="chapter-card-desc">
                  {isTR ? ch.shortDescTR : ch.shortDescEN}
                </p>

                {/* Bottom Tag & Click to Preview */}
                <div className="chapter-card-footer">
                  <span className="chapter-footer-tag">
                    {isTR ? ch.tagTR : ch.tagEN}
                  </span>
                  <span className="chapter-watch-btn">
                    <span>{isActive ? (isTR ? 'İzleniyor' : 'Watching') : (isTR ? 'Bölümü İzle' : 'Watch Scene')}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
