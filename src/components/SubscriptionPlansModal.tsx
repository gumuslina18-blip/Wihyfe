'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '@/context/StoreContext';

type PlanTier = 'Free' | 'Plus' | 'Plus+';
type BillingCycle = 'monthly' | 'quarterly' | 'semi-annual';

interface PlanDetails {
  name: PlanTier;
  badge?: string;
  desc: string;
  monthlyPrice: number;
  multiplier: {
    monthly: number;
    quarterly: number;
    'semi-annual': number;
  };
  features: Array<{ text: string; included: boolean }>;
  bottomNote: string;
}

const PLANS: Record<PlanTier, PlanDetails> = {
  Free: {
    name: 'Free',
    desc: 'Küçük topluluklar ve temel sunucu araçları için ücretsiz başlangıç.',
    monthlyPrice: 0,
    multiplier: { monthly: 0, quarterly: 0, 'semi-annual': 0 },
    bottomNote: 'Temel araçlar dahil',
    features: [
      { text: 'Temel Sunucu Yönetimi & İstatistikler', included: true },
      { text: 'Topluluk Discord Desteği', included: true },
      { text: 'Standart Bot Komutları & Yetkilendirme', included: true },
      { text: '7/24 Kesintisiz Cloud Uptime', included: false },
      { text: 'Gelişmiş RCON & FiveM Entegrasyonu', included: false },
      { text: 'REST API ve Gizli API Anahtarları', included: false },
      { text: 'Çoklu Yetkili Ekip Yönetimi', included: false },
    ],
  },
  Plus: {
    name: 'Plus',
    badge: 'En çok tercih edilen',
    desc: 'Gelişmiş bot yönetimi, 7/24 kesintisiz uptime ve FiveM & Discord araçları.',
    monthlyPrice: 350,
    multiplier: {
      monthly: 350,
      quarterly: Math.round(350 * 3 * 0.9), // 945 TL
      'semi-annual': Math.round(350 * 6 * 0.8), // 1680 TL
    },
    bottomNote: 'Gelişmiş tespit araçları →',
    features: [
      { text: 'Temel 5,000+ Bot/Sunucu Yönetim Kütüphanesi', included: true },
      { text: '7/24 Kesintisiz Cloud Uptime & Auto-Restart', included: true },
      { text: 'Gelişmiş RCON, FiveM & Roleplay Entegrasyonu', included: true },
      { text: 'Sınırsız Rol Dağıtımı & Otomatik Kayıt', included: true },
      { text: 'Öncelikli VIP Destek Talepleri (Ticket)', included: true },
      { text: 'REST API ve Gizli API Anahtarları', included: true },
      { text: 'Çoklu Yetkili Ekip Yönetimi', included: false },
    ],
  },
  'Plus+': {
    name: 'Plus+',
    badge: 'En Kapsamlı',
    desc: 'Çoklu sunucu ağları, sınırsız API yetkisi ve tam kapsamlı kurumsal erişim.',
    monthlyPrice: 650,
    multiplier: {
      monthly: 650,
      quarterly: Math.round(650 * 3 * 0.9), // 1755 TL
      'semi-annual': Math.round(650 * 6 * 0.8), // 3120 TL
    },
    bottomNote: 'Ekip yönetimi dahil →',
    features: [
      { text: 'Temel 5,000+ Bot/Sunucu Yönetim Kütüphanesi', included: true },
      { text: '7/24 Kesintisiz Cloud Uptime & Auto-Restart', included: true },
      { text: 'Gelişmiş RCON, FiveM & Roleplay Entegrasyonu', included: true },
      { text: 'Sınırsız Rol Dağıtımı & Otomatik Kayıt', included: true },
      { text: 'Öncelikli VIP Destek Talepleri (Ticket)', included: true },
      { text: 'REST API ve Gizli API Anahtarları', included: true },
      { text: 'Çoklu Yetkili Ekip Yönetimi & Özel Loglama', included: true },
    ],
  },
};

interface SubscriptionPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionPlansModal({ isOpen, onClose }: SubscriptionPlansModalProps) {
  const { user, updateUserProfile, balance, deductBalance } = useStore();

  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('Plus');
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('monthly');
  const [activationOpen, setActivationOpen] = useState(false);
  const [licenseInput, setLicenseInput] = useState('');
  const [activationStatus, setActivationStatus] = useState<{
    type: 'checking' | 'success' | 'error';
    message: string;
  } | null>(null);
  const [checkoutFeedback, setCheckoutFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTier: PlanTier = (user?.tier as PlanTier) || 'Free';
  const planData = PLANS[selectedPlan];
  const totalPrice = planData.multiplier[selectedCycle];
  const periodLabel =
    selectedCycle === 'monthly' ? 'Aylık' : selectedCycle === 'quarterly' ? '3 Aylık' : '6 Aylık';

  const handleSelectPlan = (tier: PlanTier) => {
    setSelectedPlan(tier);
  };

  const handleCheckout = () => {
    if (selectedPlan === currentTier) return;

    if (selectedPlan === 'Free') {
      updateUserProfile({ tier: 'Free', role: 'Member' });
      setCheckoutFeedback('Planınız Free olarak güncellendi.');
      setTimeout(() => setCheckoutFeedback(null), 3000);
      return;
    }

    // Check balance
    if (balance >= totalPrice) {
      const ok = deductBalance(totalPrice, `${selectedPlan} Abonelik (${periodLabel})`);
      if (ok) {
        updateUserProfile({ tier: selectedPlan, role: selectedPlan === 'Plus+' ? 'VIP' : 'Plus' });
        setCheckoutFeedback(`Tebrikler! ${selectedPlan} aboneliğiniz bakiyenizle başarıyla aktifleştirildi.`);
        setTimeout(() => setCheckoutFeedback(null), 4000);
        return;
      }
    }

    // Otherwise redirect to PayTR or Scroll to packages
    onClose();
    const el = document.getElementById('paketler');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleActivateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseInput.trim()) return;

    setActivationStatus({ type: 'checking', message: 'Lisans kodu doğrulanıyor...' });
    try {
      const res = await fetch('/api/license/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: licenseInput.trim(),
          userId: user?.id,
          userName: user?.username,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActivationStatus({
          type: 'success',
          message: data.message || `✓ [${data.tier}] lisansı başarıyla hesabınıza tanımlandı!`,
        });
        if (data.tier) {
          updateUserProfile({
            tier: data.tier,
            role: data.role || (data.tier === 'Plus+' ? 'VIP' : data.tier === 'Plus' ? 'Plus' : 'Member'),
          });
        }
        setTimeout(() => {
          setActivationStatus(null);
          setActivationOpen(false);
          setLicenseInput('');
        }, 3000);
      } else {
        setActivationStatus({
          type: 'error',
          message: data.error || 'Geçersiz lisans kodu!',
        });
      }
    } catch (err: any) {
      setActivationStatus({
        type: 'error',
        message: 'Bağlantı hatası: ' + (err.message || 'Lütfen tekrar deneyiniz.'),
      });
    }
  };

  const modalContent = (
    <div className="plans-modal-overlay" onClick={onClose}>
      <div
        className="plans-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="plans-modal-header-row">
          <div>
            <h2 className="plans-modal-title">Planlar ve ödeme</h2>
            <p className="plans-modal-subtitle">
              Ekibinize uygun planı ve ödeme dönemini seçin. Tüm tutarlar TRY cinsindedir.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="plans-activate-header-btn"
              onClick={() => setActivationOpen((prev) => !prev)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 2l-2 2m-1.5 1.5L14 9l2 2 2-2 1.5 1.5L21 9l-2-2 1.5-1.5z" />
                <circle cx="7.5" cy="15.5" r="5.5" />
              </svg>
              <span>Siparişimi etkinleştir</span>
            </button>

            <button type="button" className="account-modal-close-btn" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* License Activation Drawer if open */}
        {activationOpen && (
          <div className="plans-activation-banner">
            <form onSubmit={handleActivateLicense} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <input
                  type="text"
                  required
                  placeholder="Sipariş No veya Lisans Kodu (Örn: WZ83J3, PLUS26, FREE26)"
                  value={licenseInput}
                  onChange={(e) => setLicenseInput(e.target.value.toUpperCase())}
                  className="account-text-input"
                  style={{ padding: '0.55rem 0.85rem', letterSpacing: '0.05em' }}
                />
              </div>
              <button
                type="submit"
                className="account-btn-primary"
                disabled={activationStatus?.type === 'checking'}
                style={{ padding: '0.55rem 1.1rem' }}
              >
                {activationStatus?.type === 'checking' ? 'Kontrol Ediliyor...' : 'Etkinleştir'}
              </button>
              <button
                type="button"
                className="account-btn-secondary"
                onClick={() => { setActivationOpen(false); setActivationStatus(null); }}
                style={{ padding: '0.55rem 0.85rem' }}
              >
                Kapat
              </button>
            </form>
            {activationStatus?.type === 'checking' && (
              <div style={{ color: '#60a5fa', fontSize: '0.78rem', marginTop: '0.5rem' }}>
                {activationStatus.message}
              </div>
            )}
            {activationStatus?.type === 'success' && (
              <div style={{ color: '#34d399', fontSize: '0.78rem', marginTop: '0.5rem', fontWeight: 600 }}>
                {activationStatus.message}
              </div>
            )}
            {activationStatus?.type === 'error' && (
              <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.5rem', fontWeight: 600 }}>
                ✕ {activationStatus.message}
              </div>
            )}
          </div>
        )}

        {/* Current Plan Banner */}
        <div className="plans-current-banner">
          <div className="plans-current-left">
            <div className="plans-shield-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <div className="plans-current-label">Mevcut planınız</div>
              <div className="plans-current-val">{currentTier === 'Free' ? 'Ücretsiz (Free)' : currentTier}</div>
            </div>
          </div>
          <div className="plans-current-right">
            Paketinizi buradan anında yükseltebilirsiniz.
          </div>
        </div>

        {/* Section Header & Period Switcher */}
        <div className="plans-select-header-bar">
          <div>
            <h3 className="plans-select-title">Çalışma alanınıza uygun plan</h3>
            <p className="plans-select-sub">Özellikleri karşılaştırmak için bir paket seçin.</p>
          </div>

          {/* Billing Cycle Pills */}
          <div className="plans-cycle-pills-wrap">
            <button
              type="button"
              className={`plans-cycle-pill ${selectedCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setSelectedCycle('monthly')}
            >
              Aylık
            </button>
            <button
              type="button"
              className={`plans-cycle-pill ${selectedCycle === 'quarterly' ? 'active' : ''}`}
              onClick={() => setSelectedCycle('quarterly')}
            >
              3 aylık <span className="plans-cycle-discount">-10%</span>
            </button>
            <button
              type="button"
              className={`plans-cycle-pill ${selectedCycle === 'semi-annual' ? 'active' : ''}`}
              onClick={() => setSelectedCycle('semi-annual')}
            >
              6 aylık <span className="plans-cycle-discount">-20%</span>
            </button>
          </div>
        </div>

        {/* 3 Tier Cards Grid: Free, Plus, Plus+ */}
        <div className="plans-cards-grid">
          {/* 1. FREE */}
          <div
            className={`plans-tier-card ${selectedPlan === 'Free' ? 'selected' : ''}`}
            onClick={() => handleSelectPlan('Free')}
          >
            <div className="plans-card-top-row">
              <div className="plans-card-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>

              <div className="plans-card-radio">
                {currentTier === 'Free' ? (
                  <span className="plans-active-now-tag">Aktif</span>
                ) : (
                  <span className={`plans-radio-circle ${selectedPlan === 'Free' ? 'checked' : ''}`} />
                )}
              </div>
            </div>

            <h4 className="plans-tier-name">Free</h4>
            <p className="plans-tier-desc">{PLANS.Free.desc}</p>

            <div className="plans-price-wrap">
              <span className="plans-currency">₺</span>
              <span className="plans-amount">0</span>
              <span className="plans-period-suffix">/ay</span>
            </div>

            <div className="plans-payment-note">Ücretsiz ömür boyu kullanım</div>

            <div className="plans-card-footer-note">
              <span>{PLANS.Free.bottomNote}</span>
            </div>
          </div>

          {/* 2. PLUS */}
          <div
            className={`plans-tier-card featured ${selectedPlan === 'Plus' ? 'selected' : ''}`}
            onClick={() => handleSelectPlan('Plus')}
          >
            <div className="plans-featured-badge-top">
              <span>{PLANS.Plus.badge}</span>
            </div>

            <div className="plans-card-top-row">
              <div className="plans-card-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>

              <div className="plans-card-radio">
                {currentTier === 'Plus' ? (
                  <span className="plans-active-now-tag">Aktif</span>
                ) : (
                  <span className={`plans-radio-circle ${selectedPlan === 'Plus' ? 'checked' : ''}`} />
                )}
              </div>
            </div>

            <h4 className="plans-tier-name">Plus</h4>
            <p className="plans-tier-desc">{PLANS.Plus.desc}</p>

            <div className="plans-price-wrap">
              <span className="plans-currency">₺</span>
              <span className="plans-amount">
                {selectedCycle === 'monthly'
                  ? '350'
                  : selectedCycle === 'quarterly'
                  ? (PLANS.Plus.multiplier.quarterly / 3).toFixed(0)
                  : (PLANS.Plus.multiplier['semi-annual'] / 6).toFixed(0)}
              </span>
              <span className="plans-period-suffix">/ay</span>
            </div>

            <div className="plans-payment-note">
              {selectedCycle === 'monthly'
                ? 'Aylık ödeme'
                : selectedCycle === 'quarterly'
                ? `3 aylık toplam ₺${PLANS.Plus.multiplier.quarterly}`
                : `6 aylık toplam ₺${PLANS.Plus.multiplier['semi-annual']}`}
            </div>

            <div className="plans-card-footer-note">
              <span>{PLANS.Plus.bottomNote}</span>
            </div>
          </div>

          {/* 3. PLUS+ */}
          <div
            className={`plans-tier-card ${selectedPlan === 'Plus+' ? 'selected' : ''}`}
            onClick={() => handleSelectPlan('Plus+')}
          >
            <div className="plans-card-top-row">
              <div className="plans-card-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>

              <div className="plans-card-radio">
                {currentTier === 'Plus+' ? (
                  <span className="plans-active-now-tag">Aktif</span>
                ) : (
                  <span className={`plans-radio-circle ${selectedPlan === 'Plus+' ? 'checked' : ''}`} />
                )}
              </div>
            </div>

            <h4 className="plans-tier-name">Plus+</h4>
            <p className="plans-tier-desc">{PLANS['Plus+'].desc}</p>

            <div className="plans-price-wrap">
              <span className="plans-currency">₺</span>
              <span className="plans-amount">
                {selectedCycle === 'monthly'
                  ? '650'
                  : selectedCycle === 'quarterly'
                  ? (PLANS['Plus+'].multiplier.quarterly / 3).toFixed(0)
                  : (PLANS['Plus+'].multiplier['semi-annual'] / 6).toFixed(0)}
              </span>
              <span className="plans-period-suffix">/ay</span>
            </div>

            <div className="plans-payment-note">
              {selectedCycle === 'monthly'
                ? 'Aylık ödeme'
                : selectedCycle === 'quarterly'
                ? `3 aylık toplam ₺${PLANS['Plus+'].multiplier.quarterly}`
                : `6 aylık toplam ₺${PLANS['Plus+'].multiplier['semi-annual']}`}
            </div>

            <div className="plans-card-footer-note">
              <span>{PLANS['Plus+'].bottomNote}</span>
            </div>
          </div>
        </div>

        {/* Bottom Details Row: Features on Left, Summary on Right */}
        <div className="plans-bottom-grid">
          {/* Features Column */}
          <div className="plans-features-box">
            <div className="plans-features-header">
              <span className="plans-features-label">SEÇİLEN PAKET</span>
              <span className="plans-features-count">{planData.features.filter((f) => f.included).length} özellik dahil</span>
            </div>
            <h3 className="plans-features-title">{planData.name}</h3>

            <div className="plans-features-list">
              {planData.features.map((item, idx) => (
                <div key={idx} className={`plans-feature-item ${item.included ? 'included' : 'excluded'}`}>
                  {item.included ? (
                    <span className="plans-check-icon">✓</span>
                  ) : (
                    <span className="plans-cross-icon">✕</span>
                  )}
                  <span className="plans-feature-text">{item.text}</span>
                  {!item.included && <span className="plans-not-included-tag">Dahil değil</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Summary Column */}
          <div className="plans-summary-box">
            <div className="plans-summary-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span>Ödeme özeti</span>
            </div>

            <div className="plans-summary-rows">
              <div className="plans-summary-row">
                <span className="plans-summary-k">Paket</span>
                <span className="plans-summary-v">{planData.name}</span>
              </div>
              <div className="plans-summary-row">
                <span className="plans-summary-k">Dönem</span>
                <span className="plans-summary-v">{periodLabel}</span>
              </div>
              <div className="plans-summary-row">
                <span className="plans-summary-k">Aylık karşılığı</span>
                <span className="plans-summary-v">
                  {totalPrice === 0
                    ? '₺0'
                    : `₺${(totalPrice / (selectedCycle === 'monthly' ? 1 : selectedCycle === 'quarterly' ? 3 : 6)).toFixed(0)}`}
                </span>
              </div>

              <div className="plans-summary-divider" />

              <div className="plans-summary-row total">
                <span className="plans-summary-k total">Dönem toplamı</span>
                <span className="plans-summary-v total">₺{totalPrice.toLocaleString('tr-TR')} <span className="plans-currency-code">TRY</span></span>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <button
                type="button"
                className="plans-checkout-btn"
                onClick={handleCheckout}
                disabled={selectedPlan === currentTier && selectedPlan === 'Free'}
              >
                <span>
                  {selectedPlan === currentTier
                    ? '✓ Mevcut Paketiniz (Aktif)'
                    : selectedPlan === 'Free'
                    ? 'Free Planına Geç'
                    : 'Ödemeye geç →'}
                </span>
              </button>
            </div>

            <div className="plans-security-footer">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Ödeme, PayTR 256-bit SSL güvencesiyle tamamlanır.</span>
            </div>

            <div style={{ marginTop: '0.65rem', textAlign: 'center' }}>
              <button
                type="button"
                className="plans-link-btn"
                onClick={() => setActivationOpen((prev) => !prev)}
              >
                Zaten lisansım var / Satın aldım ↗
              </button>
            </div>



            {checkoutFeedback && (
              <div className="plans-feedback-notice">
                {checkoutFeedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
