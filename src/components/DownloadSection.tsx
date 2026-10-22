'use client';

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface DownloadSectionProps {
  isStandalonePage?: boolean;
}

export default function DownloadSection({ isStandalonePage = false }: DownloadSectionProps) {
  const { t, language } = useLanguage();
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationProgress, setVerificationProgress] = useState<number>(0);
  const [verificationPhase, setVerificationPhase] = useState<string>('');
  const [downloadStatus, setDownloadStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message?: string;
    downloadUrl?: string;
  }>({ type: 'idle' });

  // Radar simulated artifacts detection count
  const [scannedObjects, setScannedObjects] = useState<number>(4820);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Live counter animation for radar card
  useEffect(() => {
    const interval = setInterval(() => {
      setScannedObjects((prev) => {
        const delta = Math.floor(Math.random() * 25) - 10;
        return Math.max(4500, Math.min(5200, prev + delta));
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const fullPin = pinDigits.join('');
  const isPinComplete = fullPin.length === 6;

  const handleDigitChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!cleanValue) {
      const newDigits = [...pinDigits];
      newDigits[index] = '';
      setPinDigits(newDigits);
      return;
    }

    const lastChar = cleanValue.slice(-1);
    const newDigits = [...pinDigits];
    newDigits[index] = lastChar;
    setPinDigits(newDigits);
    setDownloadStatus({ type: 'idle' });

    if (index < 5 && lastChar) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!pinDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter' && isPinComplete && agreedToTerms) {
      handleVerifyAndDownload();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!pastedText) return;

    const chars = pastedText.slice(0, 6).split('');
    const newDigits = [...pinDigits];
    chars.forEach((ch, idx) => {
      newDigits[idx] = ch;
    });
    setPinDigits(newDigits);
    setDownloadStatus({ type: 'idle' });

    const nextIndex = Math.min(chars.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };


  const handleVerifyAndDownload = async () => {
    if (!isPinComplete || !agreedToTerms || isVerifying) return;

    setIsVerifying(true);
    setVerificationProgress(20);
    setVerificationPhase(language === 'TR' ? 'PIN doğrulanıyor...' : 'Authenticating PIN...');
    setDownloadStatus({ type: 'idle' });

    try {
      setTimeout(() => {
        setVerificationProgress(60);
        setVerificationPhase(language === 'TR' ? 'İstemci kriptografik imzası kontrol ediliyor...' : 'Validating cryptographic signature...');
      }, 400);

      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: fullPin }),
      });

      const data = await res.json();

      setTimeout(() => {
        setVerificationProgress(100);
        setVerificationPhase(language === 'TR' ? 'İndirme akışı başlatılıyor!' : 'Dispatching client stream!');

        setTimeout(() => {
          if (res.ok && data.success) {
            setDownloadStatus({
              type: 'success',
              message: data.message || (language === 'TR' ? `PIN ${fullPin} doğrulandı! İndirme işlemi başlatılıyor...` : `PIN ${fullPin} verified! Starting download...`),
              downloadUrl: data.downloadUrl || '#',
            });

            if (data.downloadUrl && data.downloadUrl !== '#') {
              const link = document.createElement('a');
              link.href = data.downloadUrl;
              link.download = data.fileName || 'Wihyfe_Client.exe';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          } else {
            setDownloadStatus({
              type: 'error',
              message: data.error || (language === 'TR' ? 'Geçersiz veya süresi dolmuş tarama PIN kodu. Lütfen tekrar deneyin.' : 'Invalid or expired scan PIN. Please retry.'),
            });
          }
          setIsVerifying(false);
          setVerificationProgress(0);
        }, 350);
      }, 800);
    } catch {
      setDownloadStatus({
        type: 'error',
        message: language === 'TR' ? 'Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.' : 'Connection error. Please check your network and retry.',
      });
      setIsVerifying(false);
      setVerificationProgress(0);
    }
  };

  return (
    <section 
      className={`download-section ${isStandalonePage ? 'is-page-view' : ''}`}
      id="indir"
    >
      {/* Background Holographic Cyber Rings & Aura */}
      <div className="download-ambient-container" aria-hidden="true">
        <div className="download-ambient-ring-outer" />
        <div className="download-ambient-ring" />
        <div className="download-ambient-glow" />
        <div className="download-radial-beams" />
      </div>

      <div className="container download-inner-container">
        {/* Top Telemetry Pills Strip */}
        <div className="download-telemetry-strip">
          <div className="telemetry-chip">
            <span className="telemetry-dot live" />
            <span>v2.4.8-RELEASE (x64)</span>
          </div>
          <div className="telemetry-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>SHA-256 EV İmzalı</span>
          </div>
          <div className="telemetry-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>Win 10/11 Uyumlu</span>
          </div>
          <div className="telemetry-chip highlight-chip">
            <span className="telemetry-dot-cyan" />
            <span>VirusTotal 0/72 Temiz</span>
          </div>
        </div>

        {/* Hero Title with Cyber Shimmer */}
        <h1 className="download-hero-title">
          <span>{t.downloadPage.title}</span>
          <span className="download-title-glow" />
        </h1>

        {/* Hero Description */}
        <p className="download-hero-desc">
          {t.downloadPage.desc}
        </p>

        {/* PIN Input Interactive Card */}
        <div className="download-pin-card">
          <div className="download-pin-card-header">
            <div className="pin-auth-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>6 Haneli Oturum PIN Kodu</span>
            </div>
          </div>

          <div className="download-pin-boxes-row">
            {pinDigits.map((digit, idx) => (
              <div 
                key={idx} 
                className={`download-pin-box-wrapper ${digit ? 'has-value' : ''}`}
                onClick={() => inputRefs.current[idx]?.focus()}
              >
                <input
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className="download-pin-input"
                  aria-label={`PIN hanesi ${idx + 1}`}
                  autoComplete="off"
                />
                {!digit && <span className="pin-blinking-cursor" />}
                <span className="pin-box-corner top-l" />
                <span className="pin-box-corner bottom-r" />
              </div>
            ))}
          </div>

          {/* Verification Progress Bar when checking */}
          {isVerifying && (
            <div className="download-verifying-tray">
              <div className="verifying-text-row">
                <span className="verifying-phase-text">{verificationPhase}</span>
                <span className="verifying-percent">{verificationProgress}%</span>
              </div>
              <div className="verifying-bar-bg">
                <div 
                  className="verifying-bar-fill" 
                  style={{ width: `${verificationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Button: Verify and Download */}
          <button
            type="button"
            className={`btn-verify-download ${isPinComplete && agreedToTerms && !isVerifying ? 'is-ready' : 'is-disabled'}`}
            onClick={handleVerifyAndDownload}
            disabled={!isPinComplete || !agreedToTerms || isVerifying}
          >
            {isVerifying ? (
              <>
                <svg className="spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                </svg>
                <span>{t.downloadPage.verifying}</span>
              </>
            ) : (
              <>
                <span className="btn-verify-label">{t.downloadPage.verifyAndDownload}</span>
                <span className="btn-verify-icon-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </span>
              </>
            )}
          </button>

          {/* Terms & Privacy Agreement Checkbox */}
          <label className="download-terms-agreement">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="download-terms-checkbox"
            />
            <span className="download-terms-text">
              {t.downloadPage.termsAgreementPre}
              <Link href="/kullanim-sartlari" className="terms-link" target="_blank">
                {t.downloadPage.termsLink}
              </Link>{' '}
              {t.downloadPage.and}{' '}
              <Link href="/gizlilik-politikasi" className="terms-link" target="_blank">
                {t.downloadPage.privacyLink}
              </Link>{' '}
              {t.downloadPage.termsAgreementPost}
            </span>
          </label>

          {/* Status Message (Success / Error Notification) */}
          {downloadStatus.type === 'error' && (
            <div className="download-status-alert alert-error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{downloadStatus.message}</span>
            </div>
          )}

          {downloadStatus.type === 'success' && (
            <div className="download-status-alert alert-success">
              <div className="alert-success-icon-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="alert-success-content">
                <strong>{downloadStatus.message}</strong>
                <span className="alert-sub">Otomatik başlamadıysa{' '}
                  <a href={downloadStatus.downloadUrl || '#'} className="alert-direct-link">
                    buraya tıklayarak indir
                  </a>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Section Heading for Steps */}
        <div className="download-steps-header">
          <span className="steps-header-tag">3 Kolay Adım</span>
          <h2 className="steps-header-title">Bot Kurulum &amp; Entegrasyon Süreci</h2>
        </div>

        {/* Bottom 3 Steps/Feature Cards with Rich Animated Visual Mockups */}
        <div className="download-steps-grid">
          {/* ================= CARD 01: Davet Et & İndir ================= */}
          <div className="download-step-card">
            <div className="download-step-card-header">
              <div className="step-card-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <span className="step-card-number">{t.downloadPage.card1.step}</span>
            </div>
            
            <h3 className="step-card-title">{t.downloadPage.card1.title}</h3>
            <p className="step-card-desc">{t.downloadPage.card1.desc}</p>

            {/* Visual Mockup 1: Bot Package & Live Gateway Progress */}
            <div className="step-mockup-frame mockup-package">
              <div className="mockup-exe-header">
                <div className="mockup-file-icon">
                  <img
                    src="/wihyfe-icon.png"
                    alt="Wihyfe Logo"
                    width={18}
                    height={18}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="mockup-file-meta">
                  <span className="mockup-file-name">Wihyfe_Bot_v4.exe</span>
                  <span className="mockup-file-size">Bot Suite • v4.2 Taşınabilir</span>
                </div>
                <span className="mockup-verified-tag">Doğrulandı</span>
              </div>

              {/* Progress Bar with Shimmer Beam */}
              <div className="mockup-download-bar-wrap">
                <div className="mockup-download-bar-head">
                  <span>Hazırlık &amp; Kurulum: %100</span>
                  <span>14ms Gateway</span>
                </div>
                <div className="mockup-download-bar-track">
                  <div className="mockup-download-bar-fill">
                    <span className="bar-shimmer-beam" />
                  </div>
                </div>
              </div>

              <div className="mockup-cert-row">
                <span className="cert-dot" />
                <span>Discord API &amp; Gateway v10 (SSL/TLS)</span>
              </div>
            </div>
          </div>

          {/* ================= CARD 02: Yapılandır & Başlat ================= */}
          <div className="download-step-card">
            <div className="download-step-card-header">
              <div className="step-card-icon-box step-icon-orange">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span className="step-card-number">{t.downloadPage.card2.step}</span>
            </div>

            <h3 className="step-card-title">{t.downloadPage.card2.title}</h3>
            <p className="step-card-desc">{t.downloadPage.card2.desc}</p>

            {/* Visual Mockup 2: Terminal Console */}
            <div className="step-mockup-frame mockup-uac-terminal">
              <div className="uac-terminal-top">
                <div className="terminal-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <span className="uac-terminal-title">Wihyfe Console: Bot Gateway</span>
              </div>

              <div className="uac-terminal-body">
                <div className="terminal-cmd-line">
                  <span className="t-prompt">PS C:\&gt;</span>
                  <span className="t-cmd">.\WihyfeBot.exe --start --guild-sync</span>
                </div>
                <div className="terminal-log-row">
                  <span className="t-badge-ok">[OK]</span>
                  <span className="t-msg">Guard &amp; Anti-Raid modules loaded</span>
                </div>
                <div className="terminal-log-row">
                  <span className="t-badge-ok">[OK]</span>
                  <span className="t-msg">Discord Gateway v10 connected (14ms)</span>
                </div>
              </div>

              <div className="uac-shield-pill">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Bot Yetkileri Doğrulandı</span>
              </div>
            </div>
          </div>

          {/* ================= CARD 03: Canlı Yönetim ================= */}
          <div className="download-step-card">
            <div className="download-step-card-header">
              <div className="step-card-icon-box step-icon-cyan">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <span className="step-card-number">{t.downloadPage.card3.step}</span>
            </div>

            <h3 className="step-card-title">{t.downloadPage.card3.title}</h3>
            <p className="step-card-desc">{t.downloadPage.card3.desc}</p>

            {/* Visual Mockup 3: Animated Radar Sweeper & Live Command Telemetry */}
            <div className="step-mockup-frame mockup-radar">
              <div className="radar-circle-wrap">
                <div className="radar-grid-ring ring-1" />
                <div className="radar-grid-ring ring-2" />
                <div className="radar-grid-cross cross-h" />
                <div className="radar-grid-cross cross-v" />
                <div className="radar-sweep-beam" />
                {/* Blinking detected telemetry nodes */}
                <span className="radar-blip blip-1" title="Guard" />
                <span className="radar-blip blip-2" title="Tickets" />
                <span className="radar-blip blip-3" title="AutoMod" />
              </div>

              <div className="radar-telemetry-side">
                <div className="radar-stat-box">
                  <span className="radar-stat-label">Komut &amp; Olay Akışı</span>
                  <span className="radar-stat-val">{scannedObjects.toLocaleString()} <small>işlem/sn</small></span>
                </div>
                <div className="radar-status-badge">
                  <span className="pulse-green-dot" />
                  <span>Sunucuya Senkronize</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Specs & Compatibility Strip */}
        <div className="download-system-specs-bar">
          <div className="spec-item">
            <span className="spec-label">Desteklenen Platform</span>
            <span className="spec-val">Discord (Web / Masaüstü / Mobil)</span>
          </div>
          <div className="spec-divider" />
          <div className="spec-item">
            <span className="spec-label">Kurulum Tipi</span>
            <span className="spec-val">Bulut Tabanlı (Cloud Gateway)</span>
          </div>
          <div className="spec-divider" />
          <div className="spec-item">
            <span className="spec-label">Sunucu Yükü</span>
            <span className="spec-val">Sıfır Yük (&lt; 15ms Ping)</span>
          </div>
          <div className="spec-divider" />
          <div className="spec-item">
            <span className="spec-label">Uptime &amp; Koruma</span>
            <span className="spec-val">%99.9 Kesintisiz (7/24 Guard)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
