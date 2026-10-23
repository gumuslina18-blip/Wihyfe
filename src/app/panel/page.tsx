'use client';

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import Link from 'next/link';
import { PRODUCT_PLAN_TAGS, getPlanTagInfo, ProductPlanTag } from '@/config/planTags';

export default function CustomerPanelPage() {
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [activePinCode, setActivePinCode] = useState<string | null>(null);
  const [activePlanTag, setActivePlanTag] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [availableUserPins, setAvailableUserPins] = useState<{ pin: string; targetApp: string }[]>([]);

  // Interactive Panel Tabs
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'settings' | 'logs' | 'backups'>('overview');
  const [isCopied, setIsCopied] = useState(false);

  // Bot Settings State
  const [guardActive, setGuardActive] = useState(true);
  const [antiRaidActive, setAntiRaidActive] = useState(true);
  const [backupAuto, setBackupAuto] = useState(true);
  const [botPrefix, setBotPrefix] = useState('!');
  const [saveToast, setSaveToast] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load session or saved PIN on mount
  useEffect(() => {
    // Check saved PIN in localStorage
    const savedPin = localStorage.getItem('wihyfe_active_pin');
    const savedPlan = localStorage.getItem('wihyfe_customer_plan');
    if (savedPin && savedPlan) {
      setActivePinCode(savedPin);
      setActivePlanTag(savedPlan);
    }

    // Check user info from auth
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          if (data.user.tier && data.user.tier !== 'Free' && !savedPlan) {
            setActivePlanTag(data.user.tier);
            setActivePinCode('AUTHPIN');
          }
        }
      })
      .catch(() => {});

    // Fetch user's registered PINs from API or store
    fetch('/api/admin/pins')
      .then((res) => res.json())
      .then((data) => {
        if (data.pins && Array.isArray(data.pins)) {
          setAvailableUserPins(
            data.pins.map((p: any) => ({
              pin: p.pin,
              targetApp: p.targetApp || 'Discord Full Pack - 1 Aylık',
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const fullPin = pinDigits.join('').toUpperCase();

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
    setErrorMessage(null);

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
    } else if (e.key === 'Enter' && fullPin.length === 6) {
      handleVerifyPin();
    }
  };

  const handleVerifyPin = async (codeToVerify?: string) => {
    const code = (codeToVerify || fullPin).trim().toUpperCase();
    if (code.length < 4) {
      setErrorMessage('Lütfen geçerli bir PIN kodu giriniz.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/license/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          userId: currentUser?.id,
          userName: currentUser?.username,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const resolvedTag = data.pin?.targetApp || data.tier || 'Discord Full Pack - 1 Aylık';
        setActivePinCode(code);
        setActivePlanTag(resolvedTag);
        localStorage.setItem('wihyfe_active_pin', code);
        localStorage.setItem('wihyfe_customer_plan', resolvedTag);
        setSuccessMessage(`✓ [${resolvedTag}] müşteri paneli başarıyla açıldı!`);
      } else {
        setErrorMessage(data.error || 'Bu PIN kodu geçersiz veya yetkilendirilmemiş.');
      }
    } catch (err: any) {
      setErrorMessage('Doğrulama sunucusuna erişilemedi: ' + (err.message || 'Hata'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSwitchPin = () => {
    localStorage.removeItem('wihyfe_active_pin');
    localStorage.removeItem('wihyfe_customer_plan');
    setActivePinCode(null);
    setActivePlanTag(null);
    setPinDigits(['', '', '', '', '', '']);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleCopyPin = () => {
    if (activePinCode) {
      navigator.clipboard.writeText(activePinCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSaveSettings = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const planInfo: ProductPlanTag = getPlanTagInfo(activePlanTag || '');

  return (
    <div style={{ minHeight: '100vh', background: '#0a0d14', color: '#f8fafc', padding: '1.5rem 1rem 4rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Navigation Bar */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1rem 1.25rem',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(16px)',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                color: '#fff',
                fontWeight: 800,
                fontSize: '1.15rem',
                letterSpacing: '-0.02em',
              }}
            >
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
                }}
              >
                W
              </span>
              <span>Wihyfe</span>
            </Link>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>/</span>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Müşteri Paneli</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {activePlanTag && (
              <button
                type="button"
                onClick={handleSwitchPin}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#cbd5e1',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>🔑 Başka PIN Gir / İlan Değiştir</span>
              </button>
            )}

            <Link
              href="/"
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>← Ana Sayfa</span>
            </Link>
          </div>
        </header>

        {/* --- SCENARIO A: NO PIN / ENTER PIN PORTAL --- */}
        {!activePlanTag ? (
          <div style={{ maxWidth: '640px', margin: '2.5rem auto 0' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(20, 24, 39, 0.95), rgba(13, 17, 28, 0.95))',
                borderRadius: '20px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '2.25rem 2rem',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(139, 92, 246, 0.15)',
                textAlign: 'center',
              }}
            >
              {/* Shield Icon */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 1.25rem',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.15))',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 25px rgba(139, 92, 246, 0.35)',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>
                Müşteri Paneli Girişi
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: '1.5', margin: '0 auto 1.75rem', maxWidth: '480px' }}>
                Satın aldığınız ilan veya yetkilimiz tarafından size iletilen <strong>6 haneli lisans PIN kodunuzu</strong> giriniz. PIN kodunuz ile doğrudan satın aldığınız ilana özel yönetim paneline erişeceksiniz.
              </p>

              {/* 6 Digit Input Boxes */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.55rem', marginBottom: '1.5rem' }}>
                {pinDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    style={{
                      width: '48px',
                      height: '56px',
                      textAlign: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      color: '#c084fc',
                      background: 'rgba(0, 0, 0, 0.45)',
                      border: digit ? '2px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      outline: 'none',
                      boxShadow: digit ? '0 0 12px rgba(168, 85, 247, 0.4)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  />
                ))}
              </div>

              {/* Error or Success Alert */}
              {errorMessage && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#fca5a5',
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#6ee7b7',
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  {successMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={() => handleVerifyPin()}
                disabled={fullPin.length !== 6 || isVerifying}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  background: fullPin.length === 6 ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : 'rgba(255, 255, 255, 0.08)',
                  color: fullPin.length === 6 ? '#fff' : '#64748b',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: fullPin.length === 6 ? 'pointer' : 'not-allowed',
                  boxShadow: fullPin.length === 6 ? '0 0 25px rgba(139, 92, 246, 0.4)' : 'none',
                  transition: 'all 0.2s ease',
                  marginBottom: '1.5rem',
                }}
              >
                {isVerifying ? 'PIN Doğrulanıyor...' : 'Müşteri Paneline Giriş Yap →'}
              </button>

              {/* Available PINs One-Click List */}
              {availableUserPins.length > 0 && (
                <div style={{ marginTop: '1.5rem', textAlign: 'left', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.65rem' }}>
                    Sistemde Kayıtlı Aktif PIN Kodları (Hızlı Geçiş):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {availableUserPins.slice(0, 4).map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleVerifyPin(p.pin)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.55rem 0.85rem',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#c084fc', fontSize: '0.85rem' }}>
                            {p.pin}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#e2e8f0' }}>{p.targetApp}</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>Giriş Yap →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* --- SCENARIO B: ACTIVE CUSTOMER PANEL --- */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Top Plan Hero Banner */}
            <div
              style={{
                background: `linear-gradient(135deg, rgba(20, 24, 45, 0.95), rgba(10, 14, 25, 0.95))`,
                borderRadius: '16px',
                border: `1px solid ${planInfo.borderColor}`,
                padding: '1.5rem',
                boxShadow: `0 15px 40px -10px ${planInfo.badgeColor}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: planInfo.badgeColor,
                      border: `1px solid ${planInfo.borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    {planInfo.category === 'fivem' ? '🎮' : planInfo.category === 'website' ? '🌐' : planInfo.category === 'software' ? '💻' : '🤖'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                        {planInfo.productName}
                      </h1>
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          background: planInfo.badgeColor,
                          border: `1px solid ${planInfo.borderColor}`,
                          color: planInfo.textColor,
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      >
                        {planInfo.periodLabel}
                      </span>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                        ● Aktif Hizmet
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      Müşteri: <strong>{currentUser?.username || 'Doğrulanmış Müşteri'}</strong> • Kalan Süre: <strong>29 Gün</strong> • Son Kullanma: <strong>31.12.2026</strong>
                    </div>
                  </div>
                </div>

                {/* PIN Code Box */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Aktif Oturum PIN Kodu</div>
                    <div style={{ fontFamily: 'monospace', fontWeight: 800, color: '#c084fc', fontSize: '0.95rem' }}>
                      {activePinCode}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPin}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      padding: '0.35rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                    }}
                  >
                    {isCopied ? 'Kopyalandı!' : 'Kopyala'}
                  </button>
                </div>
              </div>

              {/* Sub Navigation Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('overview')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    background: activeSubTab === 'overview' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: activeSubTab === 'overview' ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: activeSubTab === 'overview' ? '#fff' : '#94a3b8',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  📊 Genel Bakış &amp; Canlı Metrikler
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('settings')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    background: activeSubTab === 'settings' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: activeSubTab === 'settings' ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: activeSubTab === 'settings' ? '#fff' : '#94a3b8',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  ⚙️ İlan Yapılandırması &amp; Güvenlik
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('logs')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    background: activeSubTab === 'logs' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: activeSubTab === 'logs' ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: activeSubTab === 'logs' ? '#fff' : '#94a3b8',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  📜 Canlı Denetim &amp; İşlem Logları
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('backups')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    background: activeSubTab === 'backups' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: activeSubTab === 'backups' ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: activeSubTab === 'backups' ? '#fff' : '#94a3b8',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  💾 Yedekleme (Snapshot) &amp; Lisans
                </button>
              </div>
            </div>

            {/* --- TAB CONTENT: OVERVIEW --- */}
            {activeSubTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* 4 Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>HİZMET DURUMU</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#34d399', margin: '0.35rem 0' }}>%99.98 Çevrimiçi</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Kesintisiz 7/24 Uptime Garantisi</div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>GECİKME (PING)</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#38bdf8', margin: '0.35rem 0' }}>14 ms</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>İstanbul &amp; Frankfurt DC</div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>KORUNAN KULLANICI / OYUNCU</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#c084fc', margin: '0.35rem 0' }}>2,840 Aktif</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Whitelist senkronize</div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>GÜVENLİK KALKANI</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fbbf24', margin: '0.35rem 0' }}>Seviye 3 (Kernel)</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Anti-DDoS &amp; Rate Limit Aktif</div>
                  </div>
                </div>

                {/* Specific Panel Modules based on Category */}
                {planInfo.panelType === 'discord' && (
                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 1rem', color: '#fff' }}>
                      🤖 Discord Bot &amp; Topluluk Yönetim Merkezi
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontWeight: 700, color: '#818cf8', marginBottom: '0.35rem' }}>🛡️ Guard &amp; Rol Koruması</div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 0.85rem' }}>
                          Yetkisiz yönetici rolü verilmesini veya bot izni açılmasını 0.02 saniye içinde algılar ve engeller.
                        </p>
                        <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>● Koruma Modülü Aktif</span>
                      </div>

                      <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontWeight: 700, color: '#818cf8', marginBottom: '0.35rem' }}>⚡ Otomatik Backup (Yedek)</div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 0.85rem' }}>
                          Roller, kanallar ve kategori izinleri her 6 saatte bir şifrelenerek buluta kopyalanır.
                        </p>
                        <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>● Son Yedek: 42 dakika önce</span>
                      </div>

                      <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontWeight: 700, color: '#818cf8', marginBottom: '0.35rem' }}>📋 Ceza &amp; Sicil Takip</div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 0.85rem' }}>
                          Mute, ban, jail ve ceza puanları Discord sunucunuzla anlık senkronizedir.
                        </p>
                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>● 18 Ceza Kaydı İncelendi</span>
                      </div>
                    </div>
                  </div>
                )}

                {planInfo.panelType === 'fivem' && (
                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 1rem', color: '#fff' }}>
                      🎮 FiveM Oyun İçi Admin &amp; Sunucu Konsolu
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.35rem' }}>🕹️ Canlı Oyuncu Yönetimi</div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 0.85rem' }}>
                          Oyun içi oyuncuları canlı listeleyin, envanterlerini denetleyin veya kick/ban uygulayın.
                        </p>
                        <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>● 64/128 Oyuncu Bağlı</span>
                      </div>

                      <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.35rem' }}>⚡ 0.04 ms Resmon Optimizasyonu</div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 0.85rem' }}>
                          FiveM admin panel scripti sunucuda neredeyse 0 gecikmeyle (resmon: 0.04ms) çalışır.
                        </p>
                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>● CPU &amp; RAM Kararlı</span>
                      </div>

                      <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.35rem' }}>🛡️ Cfx.re &amp; Discord Whitelist</div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 0.85rem' }}>
                          Discord üzerinden onaylanan başvurular doğrudan FiveM sunucu whitelist'ine işlenir.
                        </p>
                        <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>● Senkronizasyon Açık</span>
                      </div>
                    </div>
                  </div>
                )}

                {planInfo.panelType === 'website' && (
                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 1rem', color: '#fff' }}>
                      🌐 Web Sitesi Yönetim Paneli
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: '0.35rem' }}>🔒 Cloudflare &amp; SSL Koruması</div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 0.85rem' }}>
                          Web siteniz Cloudflare Enterprise DDoS kalkanı arkasında tam güvenliklidir.
                        </p>
                        <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>● SSL Sertifikası Aktif</span>
                      </div>

                      <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: '0.35rem' }}>💳 PayTR / Paywant Ödeme Entegrasyonu</div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 0.85rem' }}>
                          Müşterilerinizin yaptığı bakiye yüklemeleri anında market bakiyelerine yansır.
                        </p>
                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>● 3D Secure Doğrulandı</span>
                      </div>
                    </div>
                  </div>
                )}

                {planInfo.panelType === 'software' && (
                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 1rem', color: '#fff' }}>
                      💻 Kişiye Özel Yazılım &amp; İstemci Konsolu
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontWeight: 700, color: '#22d3ee', marginBottom: '0.35rem' }}>🚀 Windows Masaüstü İstemcisi</div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 0.85rem' }}>
                          Özel derlenmiş Wihyfe Client uygulamanızı PIN kodunuz ile /indir sayfasından doğrudan indirebilirsiniz.
                        </p>
                        <Link href="/indir" style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>
                          İstemciyi İndir Sayfası →
                        </Link>
                      </div>

                      <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontWeight: 700, color: '#22d3ee', marginBottom: '0.35rem' }}>🔐 HWID Lisans Kilidi</div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 0.85rem' }}>
                          Uygulamanız yalnızca yetkilendirilmiş donanım kimliğinizde (HWID) çalışır.
                        </p>
                        <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>● 1 Cihaz Yetkilendirildi</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- TAB CONTENT: SETTINGS --- */}
            {activeSubTab === 'settings' && (
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.75rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 1.25rem', color: '#fff' }}>
                  ⚙️ İlan Yapılandırması &amp; Güvenlik Ayarları
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '650px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Guard &amp; Anti-Spam Koruması</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>İzinsiz bot davetlerini ve yetki suistimallerini anında engeller.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={guardActive}
                      onChange={(e) => setGuardActive(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#8b5cf6' }}
                    />
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Anti-Raid &amp; Bot Saldırı Filtresi</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Toplu sahte hesap girişlerinde sunucuyu otomatik kilitler.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={antiRaidActive}
                      onChange={(e) => setAntiRaidActive(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#8b5cf6' }}
                    />
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Otomatik Snapshot Yedekleme</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Her 6 saatte bir kanalları ve rolleri şifreli kaydeder.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={backupAuto}
                      onChange={(e) => setBackupAuto(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#8b5cf6' }}
                    />
                  </label>

                  <div style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>Bot / Panel Komut Ön Eki (Prefix)</div>
                    <input
                      type="text"
                      value={botPrefix}
                      onChange={(e) => setBotPrefix(e.target.value)}
                      maxLength={3}
                      style={{
                        padding: '0.4rem 0.65rem',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        width: '80px',
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                      marginTop: '0.5rem',
                    }}
                  >
                    Değişiklikleri Kaydet
                  </button>

                  {saveToast && (
                    <div style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.35rem' }}>
                      ✓ Ayarlarınız başarıyla kaydedildi ve anlık olarak uygulandı!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- TAB CONTENT: LOGS --- */}
            {activeSubTab === 'logs' && (
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 1rem', color: '#fff' }}>
                  📜 Canlı Denetim &amp; İşlem Log Akışı
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { at: 'Bugün 18:42', text: 'PIN doğrulandı; Müşteri paneli oturumu açıldı.', tag: 'Güvenlik' },
                    { at: 'Bugün 15:30', text: 'Otomatik snapshot yedeği başarıyla alındı (28 kanal, 42 rol).', tag: 'Sistem' },
                    { at: 'Dün 22:15', text: 'Cfx.re & FiveM whitelist senkronizasyonu tamamlandı.', tag: 'FiveM' },
                    { at: 'Dün 14:05', text: 'Cloudflare DDoS koruması seviye 3 olarak güncellendi.', tag: 'Kalkan' },
                  ].map((log, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        fontSize: '0.78rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{log.at}</span>
                        <span style={{ color: '#f1f5f9' }}>{log.text}</span>
                      </div>
                      <span style={{ padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', fontSize: '0.68rem', fontWeight: 700 }}>
                        {log.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- TAB CONTENT: BACKUPS --- */}
            {activeSubTab === 'backups' && (
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                      💾 Yedekleme (Snapshot) Noktaları &amp; Lisans Dosyası
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.25rem 0 0' }}>
                      İstediğiniz zaman tek tıkla yeni yedek oluşturabilir ve geri yükleyebilirsiniz.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Anlık snapshot yedeği başarıyla oluşturuldu!')}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: '#34d399',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    + Şimdi Anlık Yedek Al
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {[
                    { id: 'SNP-9921', at: '23.10.2026 15:30', name: 'Otomatik Periyodik Yedek', size: '1.4 MB' },
                    { id: 'SNP-8412', at: '22.10.2026 18:00', name: 'Kurulum Öncesi Güvenlik Yedeği', size: '1.2 MB' },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#fff' }}>{s.name} ({s.id})</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Tarih: {s.at} • Boyut: {s.size}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert(`Yedek ${s.id} başarıyla geri yüklendi!`)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          background: 'rgba(59, 130, 246, 0.15)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: '#60a5fa',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Geri Yükle
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
