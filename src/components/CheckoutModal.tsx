'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { SITE_CONFIG } from '@/config/site';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartItems,
    cartTotalFormatted,
    cartTotalNumeric,
    appliedCoupon,
    couponDiscountAmount,
    finalCartTotalNumeric,
    finalCartTotalFormatted,
    clearCart,
    addOrder,
    user,
    balance,
    balanceFormatted,
    deductBalance,
    setIsDepositModalOpen,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 'success'>(1);
  const [paymentMethod, setPaymentMethod] = useState<'paytr' | 'balance'>('paytr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [activePaytrUrl, setActivePaytrUrl] = useState<string | null>(null);

  // Form states
  const [discordTag, setDiscordTag] = useState('');
  const [serverId, setServerId] = useState('');
  const [email, setEmail] = useState('');

  // Sync profile when opened
  useEffect(() => {
    if (user && isCheckoutOpen) {
      setDiscordTag(`${user.username}${user.discriminator}`);
      setEmail(user.email || '');
    }
  }, [user, isCheckoutOpen]);

  // Reset states when closed
  useEffect(() => {
    if (!isCheckoutOpen) {
      setStep(1);
      setIsSubmitting(false);
    }
  }, [isCheckoutOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCheckoutOpen && !isSubmitting) {
        setIsCheckoutOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutOpen, setIsCheckoutOpen, isSubmitting]);

  // Lock body scroll
  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discordTag.trim() || !serverId.trim() || !email.trim()) {
      alert('Lütfen tüm alanları eksiksiz doldurunuz.');
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFinalPayment = () => {
    setIsSubmitting(true);
    const generatedId = `WSP-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);

    // Identify primary PayTR URL
    const targetPaytrUrl = cartItems.find((i) => i.paytrUrl)?.paytrUrl || null;
    setActivePaytrUrl(targetPaytrUrl);

    if (paymentMethod === 'balance') {
      if (balance < finalCartTotalNumeric) {
        alert('Yetersiz bakiye! Lütfen önce bakiye yükleyiniz.');
        setIsSubmitting(false);
        return;
      }
      deductBalance(finalCartTotalNumeric, `Wihyfe Siparişi: ${cartItems.map((i) => i.name).join(', ')}${appliedCoupon ? ` (Kupon: ${appliedCoupon.code})` : ''}`);
    }

    const matchedGuild = user?.guilds?.find((g) => g.id === serverId);
    const resolvedServerName = matchedGuild ? matchedGuild.name : serverId;

    addOrder({
      orderId: generatedId,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      items: cartItems.map((i) => ({ name: i.name, periodLabel: i.periodLabel, price: i.price })),
      totalFormatted: finalCartTotalFormatted,
      serverId: serverId,
      serverName: resolvedServerName,
      status: paymentMethod === 'paytr' ? 'PayTR Ödeme Bekleniyor' : 'Onaylandı',
      paymentMethod: paymentMethod === 'paytr' ? 'PayTR Link' : 'Mevcut Bakiye',
      paytrUrl: targetPaytrUrl || undefined,
    });

    // Send real order to backend for admin view
    const primaryItem = cartItems[0];
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: generatedId,
        customerDiscord: discordTag,
        customerEmail: email,
        serverId: serverId,
        serverName: resolvedServerName || serverId,
        packageName: cartItems.map((i) => i.name).join(', '),
        periodLabel: primaryItem?.periodLabel || 'Aylık',
        price: `${finalCartTotalFormatted} TL`,
        numericPrice: finalCartTotalNumeric,
        paytrUrl: targetPaytrUrl,
      }),
    }).catch((e) => console.warn('Order sync note:', e));

    // Register coupon usage if a coupon was active
    if (appliedCoupon) {
      fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: appliedCoupon.code, cartTotal: cartTotalNumeric, action: 'apply' }),
      }).catch((e) => console.warn('Coupon usage sync note:', e));
    }

    // Process referral commission (%10) if user was invited
    if (user?.id) {
      fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'commission', userId: user.id, orderAmount: finalCartTotalNumeric }),
      }).catch((e) => console.warn('Referral commission sync note:', e));
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');

      // If paytr method and url exists, open PayTR link in new tab
      if (paymentMethod === 'paytr' && targetPaytrUrl) {
        window.open(targetPaytrUrl, '_blank', 'noopener,noreferrer');
      }

      clearCart();
    }, 1000);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep(1);
  };

  return (
    <div className="checkout-overlay" onClick={handleClose} aria-modal="true" role="dialog">
      <div
        className="checkout-modal"
        onClick={(e) => e.stopPropagation()}
        aria-label="Güvenli Ödeme Ekranı"
      >
        {/* Modal Header */}
        <div className="checkout-header">
          <div className="checkout-header-left">
            <div className="checkout-header-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <span>256-Bit SSL Güvenli Ödeme</span>
            </div>
            <h3 className="checkout-title">
              {step === 'success' ? 'Siparişiniz Alındı!' : 'Wihyfe Lisans & Ödeme'}
            </h3>
          </div>

          <button
            type="button"
            className="cart-close-btn"
            onClick={handleClose}
            aria-label="Kapat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Step Indicator (shown if not success) */}
        {step !== 'success' && (
          <div className="checkout-steps-bar">
            <div className={`checkout-step-item ${step >= 1 ? 'is-active' : ''} ${step > 1 ? 'is-completed' : ''}`}>
              <span className="step-number">{step > 1 ? '✓' : '1'}</span>
              <span className="step-label">Sunucu & İletişim</span>
            </div>
            <div className="step-divider"></div>
            <div className={`checkout-step-item ${step >= 2 ? 'is-active' : ''} ${step > 2 ? 'is-completed' : ''}`}>
              <span className="step-number">{step > 2 ? '✓' : '2'}</span>
              <span className="step-label">Ödeme Yöntemi</span>
            </div>
            <div className="step-divider"></div>
            <div className={`checkout-step-item ${step === 3 ? 'is-active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Onay & Aktivasyon</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="checkout-body">
          {/* STEP 1: Sunucu & Bilgiler */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="checkout-form">
              <p className="checkout-step-desc">
                Bot lisansınızın Discord sunucunuza sorunsuz tanımlanabilmesi için lütfen aşağıdaki bilgileri girin.
              </p>

              <div className="form-group">
                <label className="form-label" htmlFor="discord-tag">
                  Discord Kullanıcı Adınız / Tag
                  <span className="form-required">*</span>
                </label>
                <div className="form-input-wrapper">
                  <span className="form-input-icon">@</span>
                  <input
                    id="discord-tag"
                    type="text"
                    className="form-input has-icon"
                    placeholder="ornek_kullanici veya user#0001"
                    value={discordTag}
                    onChange={(e) => setDiscordTag(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="server-id">
                  Discord Sunucu Adı veya Sunucu ID
                  <span className="form-required">*</span>
                </label>
                <div className="form-input-wrapper">
                  <span className="form-input-icon">#</span>
                  <input
                    id="server-id"
                    type="text"
                    className="form-input has-icon"
                    placeholder="Wihyfe Roleplay veya 10928491029481"
                    value={serverId}
                    onChange={(e) => setServerId(e.target.value)}
                    required
                  />
                </div>
                <span className="form-help-text">
                  Geliştirici modunu açıp sunucuya sağ tıklayarak 'Sunucu Kimliğini Kopyala' diyebilirsiniz.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">
                  İletişim & Fatura E-Postası
                  <span className="form-required">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="form-input"
                  placeholder="ornek@alanadi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="checkout-actions">
                <button type="submit" className="btn btn-primary btn-block">
                  <span>Ödeme Yöntemine Geç</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Ödeme Yöntemi */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="checkout-form">
              <div className="payment-method-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={paymentMethod === 'paytr'}
                  className={`payment-tab-btn ${paymentMethod === 'paytr' ? 'is-active' : ''}`}
                  onClick={() => setPaymentMethod('paytr')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <span>PayTR Link ile Öde</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={paymentMethod === 'balance'}
                  className={`payment-tab-btn ${paymentMethod === 'balance' ? 'is-active' : ''}`}
                  onClick={() => setPaymentMethod('balance')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                    <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
                    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                  </svg>
                  <span>Bakiye ile Öde ({balanceFormatted})</span>
                </button>
              </div>

              {/* Balance Panel */}
              {paymentMethod === 'balance' && (
                <div className="payment-panel balance-checkout-panel">
                  {balance >= finalCartTotalNumeric ? (
                    <div className="balance-valid-box">
                      <div className="balance-valid-head">
                        <span className="balance-valid-icon">✓</span>
                        <div>
                          <h4 className="balance-valid-title">Mevcut Bakiyeniz Yeterli</h4>
                          <p className="balance-valid-desc">
                            Sipariş onaylandığında tutar otomatik olarak cüzdanınızdan düşülecek ve ürününüz anında aktif edilecektir.
                          </p>
                        </div>
                      </div>
                      <div className="balance-calc-grid">
                        <div className="calc-item">
                          <span>Mevcut Bakiye:</span>
                          <strong>{balanceFormatted}</strong>
                        </div>
                        <div className="calc-item">
                          <span>Sipariş Tutarı:</span>
                          <strong>{finalCartTotalFormatted} TL {appliedCoupon ? `(İndirimli)` : ''}</strong>
                        </div>
                        <div className="calc-item highlight">
                          <span>Kalan Bakiye:</span>
                          <strong className="text-emerald">{(balance - finalCartTotalNumeric).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="balance-invalid-box">
                      <div className="balance-invalid-head">
                        <span className="balance-invalid-icon">⚠️</span>
                        <div>
                          <h4 className="balance-invalid-title">Yetersiz Bakiye</h4>
                          <p className="balance-invalid-desc">
                            Mevcut bakiyeniz ({balanceFormatted}) bu sipariş için ({finalCartTotalFormatted} TL) yeterli değildir.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => setIsDepositModalOpen(true)}
                      >
                        <span>+ Bakiye Yükle</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* PayTR Direct Link Panel */}
              {paymentMethod === 'paytr' && (
                <div className="payment-panel paytr-panel">
                  <div className="paytr-banner-box">
                    <div className="paytr-banner-header">
                      <div className="paytr-brand-group">
                        <span className="paytr-logo-badge">PayTR</span>
                        <span className="paytr-official-tag">Resmi Ödeme Altyapısı</span>
                      </div>
                      <span className="paytr-security-pill">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                        </svg>
                        256-Bit SSL 3D Secure
                      </span>
                    </div>
                    <p className="paytr-banner-desc">
                      Ödemeniz, PayTR&apos;ın güvenli linkle tahsilat sayfası üzerinden gerçekleştirilir. Tüm kredi/banka kartları, taksit seçenekleri ve banka transferleri desteklenir.
                    </p>
                  </div>

                  <div className="paytr-items-card">
                    <span className="paytr-items-heading">Seçili Paketler & PayTR Link Durumu:</span>
                    <div className="paytr-items-list">
                      {cartItems.map((item) => (
                        <div key={item.id} className="paytr-item-row">
                          <div className="paytr-item-left">
                            <span className="paytr-item-name">{item.name}</span>
                            <span className="paytr-item-period">({item.periodLabel})</span>
                          </div>
                          <div className="paytr-item-right">
                            <span className="paytr-item-price">{item.price}</span>
                            {item.paytrUrl ? (
                              <span className="paytr-badge-ready">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                PayTR Linki Hazır
                              </span>
                            ) : (
                              <span className="paytr-badge-pending">
                                Link Hazırlanıyor
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="payment-security-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span>Kart ve ödeme bilgileriniz Wihyfe üzerinde tutulmaz; doğrudan resmi PayTR sayfasına aktarılırsınız.</span>
                  </div>
                </div>
              )}

              <div className="checkout-btn-group">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(1)}
                >
                  Geri
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Sipariş Özetine Geç</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Sipariş Onayı & Ödeme */}
          {step === 3 && (
            <div className="checkout-step-summary">
              <div className="checkout-summary-card">
                <h4 className="summary-section-title">Sipariş Bilgileri</h4>
                <div className="summary-info-grid">
                  <div className="summary-item">
                    <span className="summary-item-label">Discord Kullanıcısı:</span>
                    <span className="summary-item-val">{discordTag}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-item-label">Hedef Sunucu:</span>
                    <span className="summary-item-val">{serverId}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-item-label">E-Posta:</span>
                    <span className="summary-item-val">{email}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-item-label">Ödeme Yöntemi:</span>
                    <span className="summary-item-val">
                      {paymentMethod === 'paytr' ? 'PayTR Linkle Güvenli Ödeme (3D Secure)' : 'Mevcut Cüzdan Bakiyesi'}
                    </span>
                  </div>
                </div>

                <div className="summary-items-preview">
                  <h4 className="summary-section-title">Paket Listesi ({cartItems.length} Ürün)</h4>
                  {cartItems.map((item) => (
                    <div key={item.id} className="summary-item-row">
                      <div>
                        <strong>{item.name}</strong>
                        <span className="summary-item-period"> • {item.periodLabel}</span>
                      </div>
                      <span className="summary-item-price">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="summary-calc-rows" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <span>Ara Toplam</span>
                    <span>{cartTotalFormatted} TL</span>
                  </div>
                  {appliedCoupon && couponDiscountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>
                      <span>🏷️ Kupon İndirimi ({appliedCoupon.code})</span>
                      <span>-₺{couponDiscountAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                    </div>
                  )}
                </div>

                <div className="summary-final-total">
                  <span>Ödenecek Toplam Tutar:</span>
                  <span className="final-amount">{finalCartTotalFormatted} TL</span>
                </div>
              </div>

              <div className="checkout-btn-group">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                >
                  Geri
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handleFinalPayment}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="checkout-spinner-wrap">
                      <span className="checkout-spinner"></span>
                      <span>
                        {paymentMethod === 'paytr'
                          ? 'PayTR Sayfasına Yönlendiriliyorsunuz...'
                          : 'Bakiye ile Siparişiniz Tamamlanıyor...'}
                      </span>
                    </span>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <span>
                        {paymentMethod === 'paytr'
                          ? `PayTR ile Güvenli Öde (${cartTotalFormatted} TL)`
                          : `Bakiye ile Öde (${cartTotalFormatted} TL)`}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <p className="checkout-legal-disclaimer text-xs text-center text-muted mt-3">
                Siparişi tamamlayarak{' '}
                <a href="/kullanim-sartlari" target="_blank" rel="noopener noreferrer" className="text-accent underline">
                  Kullanım Şartları
                </a>{' '}
                ve{' '}
                <a href="/gizlilik-politikasi" target="_blank" rel="noopener noreferrer" className="text-accent underline">
                  Gizlilik Politikası
                </a>
                &apos;nı kabul etmiş sayılırsınız.
              </p>
            </div>
          )}

          {/* SUCCESS SCREEN */}
          {step === 'success' && (
            <div className="checkout-success-view">
              <div className="success-icon-badge">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#315BCE" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>

              <h4 className="success-title">
                {paymentMethod === 'paytr' ? 'PayTR Ödeme Sayfasına Yönlendirildiniz!' : 'Siparişiniz Başarıyla Onaylandı!'}
              </h4>
              <p className="success-subtitle">
                {paymentMethod === 'paytr'
                  ? 'PayTR resmi ödeme sayfası yeni sekmede açıldı. Ödemenizi tamamladıktan sonra botunuz sunucunuza tanımlanacaktır.'
                  : 'Sipariş tutarı cüzdanınızdan düşüldü ve botunuz sunucunuza tanımlandı.'}
              </p>

              <div className="success-order-box">
                <span className="order-box-label">Sipariş Takip No:</span>
                <span className="order-box-number">{orderId}</span>
              </div>

              {paymentMethod === 'paytr' && activePaytrUrl && (
                <div className="success-paytr-direct">
                  <p className="paytr-direct-note">Ödeme sayfası otomatik açılmadıysa veya kapandıysa:</p>
                  <a
                    href={activePaytrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-block paytr-direct-btn"
                  >
                    <span>PayTR Ödeme Sayfasını Aç</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              )}

              <div className="success-action-buttons">
                <a
                  href={SITE_CONFIG.brand.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary-accent btn-block"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Discord Kurulum Desteğine Katıl</span>
                </a>

                <button
                  type="button"
                  className="btn btn-secondary-accent btn-block"
                  onClick={handleClose}
                >
                  Pencereyi Kapat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
