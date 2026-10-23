'use client';

import { useState, useRef, useEffect } from 'react';
import { SITE_CONFIG, BotProduct, BILLING_PERIODS, BillingPeriod, PricingPlan } from '@/config/site';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { animateFlyToCart } from '@/lib/cartAnimation';

function getPanelIcon(iconType: BotProduct['icon']) {
  switch (iconType) {
    case 'gamepad':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="4" />
          <line x1="6" y1="12" x2="10" y2="12" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <line x1="15" y1="13" x2="15.01" y2="13" strokeWidth="3" />
          <line x1="18" y1="11" x2="18.01" y2="11" strokeWidth="3" />
        </svg>
      );
    case 'terminal':
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
  }
}

export default function PanelsSection() {
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>('monthly');
  const [currentPage, setCurrentPage] = useState(0);
  const [addedPanelId, setAddedPanelId] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const { addToCart, dynamicPeriods, getPackagePeriodInfo, getProductOverride } = useStore();
  const { language } = useLanguage();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(2);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const panels = SITE_CONFIG.panels || [];
  const totalPanels = panels.length;
  const totalPages = Math.max(1, Math.ceil(totalPanels / itemsPerPage));

  const activePeriods = dynamicPeriods && dynamicPeriods.length > 0 ? dynamicPeriods : BILLING_PERIODS;
  const currentPeriodObj = activePeriods.find((p) => p.id === selectedPeriod) || activePeriods[0];

  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentPage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = (touchStartY.current || 0) - e.changedTouches[0].clientY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
      } else {
        setCurrentPage((p) => Math.max(0, p - 1));
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, panel: BotProduct, plan: PricingPlan) => {
    const periodInfo = getPackagePeriodInfo(panel.id, selectedPeriod);
    const isAvailable = periodInfo.isAvailable && currentPeriodObj.isAvailable;
    if (!isAvailable) return;

    animateFlyToCart(e.currentTarget);
    setAddedPanelId(panel.id);
    setTimeout(() => {
      setAddedPanelId((curr) => (curr === panel.id ? null : curr));
    }, 1800);

    const override = getProductOverride(panel.id);
    const rawPrice = periodInfo.customPrice || plan.totalPrice;
    const cleanPrice = String(rawPrice || '').replace(/\s*TL\s*/gi, '').trim();
    const numeric = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '')) || 0;

    addToCart({
      productId: panel.id,
      name: override?.name || panel.name,
      periodLabel: plan.periodLabel,
      price: `${cleanPrice} TL`,
      numericPrice: numeric,
      icon: panel.icon,
      badge: override?.badge !== undefined ? override.badge : panel.badge,
      paytrUrl: periodInfo.paytrUrl || plan.paytrUrl,
      periodKey: selectedPeriod,
    });
  };

  return (
    <section className="section panels-section" id="paneller">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
            <span>{language === 'TR' ? 'YÖNETİM PANELLERİ' : 'MANAGEMENT PANELS'}</span>
          </div>

          <h2 className="section-title">
            {language === 'TR' ? 'Sunucunuza Özel ' : 'Tailored Server '}
            <span className="text-accent">{language === 'TR' ? 'Gelişmiş Yönetim Panelleri' : 'Management Panels'}</span>
          </h2>

          <p className="section-desc">
            {language === 'TR'
              ? 'FiveM oyun içi canlı admin konsolu ve web tabanlı Discord yönetim panelleri ile sunucunuzun tüm operasyonunu tek tıkla kontrol edin.'
              : 'Control your entire server operation with FiveM in-game live admin UI and web-based Discord management dashboards.'}
          </p>

          {/* Billing Period Selector */}
          <div className="pricing-toggle-container">
            <div className="pricing-toggle-wrapper" role="tablist" aria-label="Fatura Dönemi Seçimi">
              {activePeriods.map((period) => {
                const isActive = selectedPeriod === period.id;
                return (
                  <button
                    key={period.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`pricing-toggle-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => setSelectedPeriod(period.id)}
                  >
                    <span>{period.label}</span>
                    {period.discountBadge && (
                      <span className="pricing-toggle-discount">{period.discountBadge}</span>
                    )}
                    {period.statusBadge && (
                      <span className="pricing-toggle-soon">{period.statusBadge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Slider Controls Bar */}
        <div className="card-slider-header-bar">
          <div className="card-slider-telemetry">
            <span className="card-slider-pulse-dot" style={{ backgroundColor: '#0878ff', boxShadow: '0 0 10px #0878ff' }} />
            <span>
              {language === 'EN'
                ? `Page ${currentPage + 1} / ${totalPages} • ${totalPanels} Active Panels`
                : `Sayfa ${currentPage + 1} / ${totalPages} • ${totalPanels} Aktif Panel`}
            </span>
          </div>

          <div className="card-slider-nav">
            <button
              type="button"
              className="card-slider-btn"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              aria-label="Önceki Sayfa"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="card-slider-dots-row" role="tablist" aria-label="Sayfa Göstergesi">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i)}
                  className={`card-slider-dot ${i === currentPage ? 'is-active' : ''}`}
                  aria-label={`Sayfa ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="card-slider-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              aria-label="Sonraki Sayfa"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sliding Carousel Viewport */}
        <div
          className="card-slider-outer"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {totalPages > 1 && (
            <button
              type="button"
              className="card-slider-edge-btn edge-prev"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              aria-label="Önceki Sayfa"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <div className="card-slider-viewport">
            <div
              className="card-slider-track"
              style={{
                transform: `translateX(calc(-${currentPage} * (100% + 1.5rem)))`,
              }}
            >
              {panels.map((panel) => {
                const override = getProductOverride(panel.id);
                if (override?.status === 'Gizli') return null;

                const displayName = override?.name || panel.name;
                const displayBadge = override?.badge !== undefined ? override.badge : panel.badge;
                const displayDesc = override?.description || panel.description;
                const isOutOfStock = override?.status === 'Tükendi';

                const periodInfo = getPackagePeriodInfo(panel.id, selectedPeriod);
                const plan = panel.pricing[selectedPeriod];
                const rawPrice = periodInfo.customPrice || plan.totalPrice;
                const isAvailable = periodInfo.isAvailable && !isOutOfStock;
                const statusBadge = isOutOfStock ? 'Tükendi' : (periodInfo.statusBadge || 'Yakında');
                const cleanPriceVal = String(rawPrice || '').replace(/\s*TL\s*/gi, '').trim();

                return (
                  <div key={panel.id} className="card-slider-slide-2col">
                    <article
                      className={`bot-card ${panel.popular ? 'bot-card-popular' : ''}`}
                      id={`panel-${panel.id}`}
                    >
                      {/* Ambient Blue Flare on Featured Card */}
                      {panel.popular && <div className="card-popular-glow" aria-hidden="true" />}

                      {/* Watermark Line-art Icon in Background */}
                      <div className="card-watermark-icon" aria-hidden="true">
                        {panel.icon === 'gamepad' ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="2" y="6" width="20" height="12" rx="4" />
                            <line x1="6" y1="12" x2="10" y2="12" />
                            <line x1="8" y1="10" x2="8" y2="14" />
                            <line x1="15" y1="13" x2="15.01" y2="13" strokeWidth="3" />
                            <line x1="18" y1="11" x2="18.01" y2="11" strokeWidth="3" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="4 17 10 11 4 5" />
                            <line x1="12" y1="19" x2="20" y2="19" />
                          </svg>
                        )}
                      </div>

                      {/* Top Badge */}
                      {panel.popular ? (
                        <div className="card-top-badge">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                          </svg>
                          <span>{displayBadge || (language === 'EN' ? 'FEATURED PANEL' : 'ÖNE ÇIKAN PANEL')}</span>
                        </div>
                      ) : displayBadge ? (
                        <div className="card-top-badge badge-regular">
                          <span>{displayBadge}</span>
                        </div>
                      ) : (
                        <div className="card-top-badge-placeholder" aria-hidden="true" />
                      )}

                      {/* Header Row: Square Icon Box + Title */}
                      <div className="card-header-row">
                        <div className="card-header-icon-box" aria-hidden="true">
                          {getPanelIcon(panel.icon)}
                        </div>
                        <h3 className="card-header-title">{displayName}</h3>
                      </div>

                      {/* Subtitle / Description */}
                      <p className="card-header-desc">{displayDesc}</p>

                      {/* Price Block */}
                      <div className="card-price-block">
                        <div className="card-price-main-line">
                          <span className="card-price-currency">₺</span>
                          <span className="card-price-val">{cleanPriceVal}</span>
                          <span className="card-price-freq">
                            /{plan.periodLabel.replace(/TL\s*\/?\s*/gi, '').trim() || 'ay'}
                          </span>
                        </div>

                        <div className="card-price-subline">
                          {plan.originalPrice ? (
                            <>
                              <span className="card-price-old">{plan.originalPrice}</span>
                              {plan.discountBadge && (
                                <span className="card-discount-pill">{plan.discountBadge}</span>
                              )}
                              {plan.monthlyEquivalent && selectedPeriod !== 'monthly' && (
                                <span className="card-monthly-eq">({plan.monthlyEquivalent})</span>
                              )}
                            </>
                          ) : (
                            <span>{language === 'EN' ? 'Recurring subscription' : 'Aylık abonelik'}</span>
                          )}
                        </div>
                      </div>

                      {/* CTA Action Button */}
                      <div className="card-action-wrap">
                        <button
                          type="button"
                          className={`card-action-btn ${
                            panel.popular ? 'btn-popular-highlight' : 'btn-standard-dark'
                          } ${!isAvailable ? 'is-disabled' : ''} ${addedPanelId === panel.id ? 'is-added' : ''}`}
                          onClick={(e) => handleAddToCart(e, panel, plan)}
                          disabled={!isAvailable}
                          aria-label={`${displayName} ${isAvailable ? 'Satın Al' : statusBadge}`}
                        >
                          {!isAvailable ? (
                            <>
                              <span>{statusBadge || 'Yakında'}</span>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                            </>
                          ) : addedPanelId === panel.id ? (
                            <span className="btn-added-label">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>{language === 'EN' ? 'Added!' : 'Sepete Eklendi!'}</span>
                            </span>
                          ) : (
                            <>
                              <span>{language === 'EN' ? 'Select Panel' : 'Paneli Satın Al'}</span>
                              <svg className="icon-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                              </svg>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="card-features-divider">
                        <span className="card-divider-label">
                          {language === 'TR' ? 'PANEL ÖZELLİKLERİ & MODÜLLERİ' : 'PANEL FEATURES & MODULES'}
                        </span>
                        <span className="card-divider-line" />
                      </div>

                      {/* Features Checklist */}
                      <ul className="card-features-list">
                        {panel.features.map((feat, idx) => (
                          <li key={idx} className="card-feature-item">
                            <svg
                              className="card-feature-check"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          {totalPages > 1 && (
            <button
              type="button"
              className="card-slider-edge-btn edge-next"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              aria-label="Sonraki Sayfa"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>

        <div className="card-slider-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>{language === 'EN' ? 'Swipe left or right to browse panels' : 'Panelleri görmek için sağa / sola kaydırın'}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
