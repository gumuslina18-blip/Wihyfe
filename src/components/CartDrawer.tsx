'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/context/StoreContext';

function getCartIcon(iconName: string) {
  switch (iconName) {
    case 'discord':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      );
    case 'shield':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'scale':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10" />
          <path d="M12 3v18" />
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
      );
    case 'gamepad':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="12" x2="10" y2="12" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <line x1="15" y1="13" x2="15.01" y2="13" strokeWidth="3" />
          <line x1="18" y1="11" x2="18.01" y2="11" strokeWidth="3" />
          <rect x="2" y="6" width="20" height="12" rx="6" />
        </svg>
      );
    case 'terminal':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
    case 'users':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'lock':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'ticket':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
          <path d="M13 5v2" />
          <path d="M13 17v2" />
        </svg>
      );
    case 'clock':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'code':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'globe':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
  }
}

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    cartCount,
    cartTotalFormatted,
    appliedCoupon,
    couponDiscountAmount,
    finalCartTotalFormatted,
    applyCoupon,
    removeCoupon,
    removeFromCart,
    clearCart,
    startCheckout,
  } = useStore();

  const [couponInput, setCouponInput] = React.useState('');
  const [couponLoading, setCouponLoading] = React.useState(false);
  const [couponFeedback, setCouponFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponFeedback(null);
    const res = await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    if (res.success) {
      setCouponFeedback({ type: 'success', message: `İndirim uygulandı! (₺${res.discountAmount?.toLocaleString('tr-TR')} tasarruf)` });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', message: res.error || 'Geçersiz kupon' });
    }
  };

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleGoToPackages = () => {
    setIsCartOpen(false);
    const element = document.getElementById('paketler');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)} aria-modal="true" role="dialog">
      <div
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Alışveriş Sepeti"
      >
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-title-wrap">
            <div className="cart-header-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <div>
              <h3 className="cart-header-title">Sepetim</h3>
              <p className="cart-header-subtitle">
                {cartCount > 0 ? `${cartCount} ürün eklendi` : 'Sepetiniz boş'}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Sepeti Kapat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon-wrap">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1" fill="currentColor" />
                  <circle cx="19" cy="21" r="1" fill="currentColor" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </div>
              <h4 className="cart-empty-title">Sepetinizde ürün bulunmuyor</h4>
              <p className="cart-empty-text">
                Discord sunucunuza güç katacak paketleri ve bağımsız botları hemen inceleyin.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleGoToPackages}
              >
                <span>Paketleri İncele</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-icon">
                    {getCartIcon(item.icon)}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-head">
                      <h4 className="cart-item-name">{item.name}</h4>
                      {item.badge && <span className="cart-item-badge">{item.badge}</span>}
                    </div>
                    <div className="cart-item-period">{item.periodLabel}</div>
                    <div className="cart-item-price-row">
                      <span className="cart-item-price">{item.price}</span>
                      {item.paytrUrl ? (
                        <span className="cart-item-paytr-badge">✓ PayTR Linki Hazır</span>
                      ) : (
                        <span className="cart-item-paytr-pending">Link Hazırlanıyor</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-item-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`${item.name} ürününü sepetten çıkar`}
                    title="Sepetten Çıkar"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Summary & Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Coupon Code Section */}
            <div className="cart-coupon-section">
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="cart-coupon-form">
                  <div className="cart-coupon-input-wrap">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="coupon-icon-prefix">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                    <input
                      type="text"
                      className="cart-coupon-input"
                      placeholder="İndirim Kuponu Kodu"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponFeedback(null);
                      }}
                      maxLength={20}
                    />
                  </div>
                  <button
                    type="submit"
                    className="cart-coupon-apply-btn"
                    disabled={couponLoading || !couponInput.trim()}
                  >
                    {couponLoading ? '...' : 'Uygula'}
                  </button>
                </form>
              ) : (
                <div className="cart-coupon-active-badge">
                  <div className="coupon-active-info">
                    <span className="coupon-active-code">✓ {appliedCoupon.code}</span>
                    <span className="coupon-active-desc">
                      {appliedCoupon.discountType === 'percentage'
                        ? `%${appliedCoupon.discountValue} İndirim`
                        : `₺${appliedCoupon.discountValue} İndirim`}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="coupon-remove-btn"
                    onClick={removeCoupon}
                    title="Kuponu Kaldır"
                  >
                    Kaldır
                  </button>
                </div>
              )}

              {couponFeedback && (
                <div className={`cart-coupon-feedback is-${couponFeedback.type}`}>
                  {couponFeedback.message}
                </div>
              )}
            </div>

            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span>Ara Toplam</span>
                <span>{cartTotalFormatted} TL</span>
              </div>
              {appliedCoupon && couponDiscountAmount > 0 && (
                <div className="cart-summary-row cart-discount-row">
                  <span className="discount-label">
                    🏷️ Kupon İndirimi ({appliedCoupon.code})
                  </span>
                  <span className="discount-amount">
                    -₺{couponDiscountAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              <div className="cart-summary-row">
                <span>Ödeme Altyapısı</span>
                <span className="cart-free-tag">PayTR Güvenli Link</span>
              </div>
              <div className="cart-summary-row cart-total-row">
                <span className="cart-total-label">Toplam Tutar</span>
                <span className="cart-total-amount">{finalCartTotalFormatted} TL</span>
              </div>
            </div>

            <div className="cart-footer-actions">
              <button
                type="button"
                className="btn btn-primary btn-block cart-checkout-btn"
                onClick={startCheckout}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>PayTR ile Güvenli Öde</span>
              </button>

              <button
                type="button"
                className="cart-clear-btn"
                onClick={clearCart}
              >
                Sepeti Temizle
              </button>
            </div>

            <div className="cart-trust-badges">
              <span className="trust-badge-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                PayTR 256-Bit SSL
              </span>
              <span className="trust-badge-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Anında Kurulum
              </span>
              <span className="trust-badge-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                7/24 Destek
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
