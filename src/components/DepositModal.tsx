'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import WalletTitaniumCard from '@/components/WalletTitaniumCard';

const PRESET_AMOUNTS = [
  { amount: 100, label: '100 TL' },
  { amount: 250, label: '250 TL' },
  { amount: 500, label: '500 TL' },
  { amount: 1000, label: '1.000 TL', isPopular: true },
  { amount: 2500, label: '2.500 TL' },
];

export default function DepositModal() {
  const {
    isDepositModalOpen,
    setIsDepositModalOpen,
    balanceFormatted,
    user,
    isLoggedIn,
    loginWithDiscord,
    setIsLoginModalOpen,
    depositPresetAmount,
  } = useStore();

  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'paytr'>('paytr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPendingVerification, setIsPendingVerification] = useState(false);

  useEffect(() => {
    if (depositPresetAmount) {
      setSelectedAmount(depositPresetAmount);
      setCustomAmount('');
    }
  }, [depositPresetAmount, isDepositModalOpen]);

  if (!isDepositModalOpen) return null;

  // Active amount calculation
  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleSelectPreset = (amt: number) => {
    setSelectedAmount(amt);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    return; // Bakiye yükleme şu anda kapalıdır (Yakında)
  };

  const handleClose = () => {
    setIsDepositModalOpen(false);
    setIsPendingVerification(false);
  };

  return (
    <div className="deposit-overlay" onClick={handleClose} aria-modal="true" role="dialog">
      <div className="deposit-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="deposit-header">
          <div className="deposit-header-left">
            <div className="deposit-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
                <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
              </svg>
              <span>Wihyfe Güvenli Cüzdan</span>
            </div>
            <h3 className="deposit-title">Bakiye Yükle</h3>
            <p className="deposit-subtitle">
              Hesabınıza bakiye yükleyerek bot lisansları ve ek hizmetleri tek tıkla satın alabilirsiniz.
            </p>
          </div>
          <button
            type="button"
            className="deposit-close-btn"
            onClick={handleClose}
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        {/* Current Balance Pill */}
        <div className="deposit-balance-banner">
          <div className="deposit-balance-content">
            <span className="deposit-balance-lbl">Mevcut Bakiyeniz</span>
            <span className="deposit-balance-val">{balanceFormatted}</span>
          </div>
          {isLoggedIn && user ? (
            <div className="deposit-user-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{user.username}</span>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-xs btn-outline"
              onClick={loginWithDiscord}
            >
              Discord Giriş
            </button>
          )}
        </div>

        {/* 3D Titanium Wihyfe Black Card */}
        <WalletTitaniumCard
          balanceFormatted={balanceFormatted}
          userName={user?.username || 'Wihyfe Üyesi'}
        />

        {isPendingVerification ? (
          /* REAL PAYMENT VERIFICATION STATE */
          <div className="deposit-success-view">
            <div className="deposit-success-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.12)', borderColor: 'rgba(59, 130, 246, 0.35)' }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h4 className="deposit-success-title" style={{ color: '#93c5fd' }}>PayTR 3D Secure Doğrulaması</h4>
            <p className="deposit-success-desc">
              <strong>{currentAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</strong> tutarında bakiye yükleme talebi oluşturuldu.
            </p>
            <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '0.95rem', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6, textAlign: 'left', margin: '0.5rem 0 1.25rem' }}>
              <span style={{ color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                Güvenlik Bildirimi:
              </span>
              Gerçek banka/kredi kartı veya PayTR 3D Secure ödeme onayı alınmadan cüzdana bakiye eklenemez. Ödemeniz PayTR tarafından onaylandığı an bakiyeniz otomatik olarak güncellenecektir.
            </div>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={handleClose}
            >
              Tamam
            </button>
          </div>
        ) : (
          /* FORM STATE */
          <form onSubmit={handleSubmit} className="deposit-form">
            {/* Step 1: Preset Amounts */}
            <div className="deposit-section-block">
              <label className="deposit-field-label">
                <span>1. Yüklenecek Tutarı Seçin</span>
                <span className="deposit-min-notice">Min. 50 TL</span>
              </label>

              <div className="deposit-presets-grid">
                {PRESET_AMOUNTS.map((item) => {
                  const isActive = !customAmount && selectedAmount === item.amount;
                  return (
                    <button
                      key={item.amount}
                      type="button"
                      disabled={true}
                      className={`deposit-preset-btn ${isActive ? 'is-active' : ''} ${
                        item.isPopular ? 'is-popular' : ''
                      }`}
                      style={{ cursor: 'not-allowed', opacity: 0.6 }}
                      onClick={() => handleSelectPreset(item.amount)}
                    >
                      <span className="preset-amount">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Input */}
              <div className="deposit-custom-wrap">
                <span className="deposit-custom-label">veya Farklı Bir Tutar Girin:</span>
                <div className="deposit-input-box" style={{ opacity: 0.6 }}>
                  <input
                    type="text"
                    disabled={true}
                    placeholder="Örn: 750"
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="deposit-input"
                    style={{ cursor: 'not-allowed' }}
                    maxLength={6}
                  />
                  <span className="deposit-input-currency">TL</span>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="deposit-section-block">
              <label className="deposit-field-label">
                <span>2. Ödeme Yöntemi</span>
                <span className="deposit-ssl-tag">256-Bit SSL</span>
              </label>

              <div className="deposit-methods-grid single-method">
                <button
                  type="button"
                  className="deposit-method-card is-active"
                  style={{ width: '100%' }}
                >
                  <div className="method-icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </div>
                  <div className="method-details">
                    <span className="method-name">Kredi / Banka Kartı</span>
                    <span className="method-sub">3D Secure ile anında güvenli bakiye yükleme</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Total Summary Row */}
            <div className="deposit-summary-box">
              <div className="summary-row">
                <span className="summary-lbl">Yüklenecek Tutar:</span>
                <span className="summary-val">{currentAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total-row">
                <span className="summary-lbl">Cüzdana Eklenecek Toplam:</span>
                <span className="summary-val-highlight">{currentAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="deposit-actions">
              <button
                type="button"
                disabled={true}
                className="btn btn-primary btn-block deposit-submit-btn is-disabled"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>Yakında</span>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
