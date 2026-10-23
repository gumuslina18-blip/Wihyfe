'use client';

import { useState, useRef, useEffect } from 'react';
import { SITE_CONFIG, BotProduct, BILLING_PERIODS, BillingPeriod, PricingPlan } from '@/config/site';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { animateFlyToCart } from '@/lib/cartAnimation';

function getAppIcon(iconType: BotProduct['icon']) {
  switch (iconType) {
    case 'scale':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case 'code':
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
}

export default function CustomAppsSection() {
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>('monthly');
  const [currentPage, setCurrentPage] = useState(0);
  const [addedAppId, setAddedAppId] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const { addToCart, dynamicPeriods, getPackagePeriodInfo, getProductOverride } = useStore();
  const { language } = useLanguage();

  const customApps = SITE_CONFIG.customApps || [];
  const totalApps = customApps.length;
  const totalPages = Math.max(1, totalApps);

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

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, app: BotProduct, plan: PricingPlan) => {
    const periodInfo = getPackagePeriodInfo(app.id, selectedPeriod);
    const isAvailable = periodInfo.isAvailable && currentPeriodObj.isAvailable;
    if (!isAvailable) return;

    animateFlyToCart(e.currentTarget);
    setAddedAppId(app.id);
    setTimeout(() => {
      setAddedAppId((curr) => (curr === app.id ? null : curr));
    }, 1800);

    const override = getProductOverride(app.id);
    const rawPrice = periodInfo.customPrice || plan.totalPrice;
    const cleanPrice = String(rawPrice || '').replace(/\s*TL\s*/gi, '').trim();
    const numeric = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '')) || 0;

    addToCart({
      productId: app.id,
      name: override?.name || app.name,
      periodLabel: plan.periodLabel,
      price: `${cleanPrice} TL`,
      numericPrice: numeric,
      icon: app.icon,
      badge: override?.badge !== undefined ? override.badge : app.badge,
      paytrUrl: periodInfo.paytrUrl || plan.paytrUrl,
      periodKey: selectedPeriod,
    });
  };

  return (
    <section className="section custom-apps-section" id="ozel-yazilim">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
            <span>{language === 'TR' ? 'ÖZEL YAZILIM & UYGULAMA' : 'CUSTOM APPS & SOFTWARE'}</span>
          </div>

          <h2 className="section-title">
            {language === 'TR' ? 'İhtiyacınıza Özel ' : 'Tailored For You '}
            <span className="text-accent">{language === 'TR' ? 'Uygulama & Yazılım Çözümleri' : 'Apps & Software Solutions'}</span>
          </h2>

          <p className="section-desc">
            {language === 'TR'
              ? 'Standart şablonların ötesinde; markanıza özel Windows masaüstü araçları, tersine mühendislik korumaları, otomasyonlar ve kurumsal altyapı.'
              : 'Beyond standard packages; custom Windows desktop clients, reverse engineering defenses, automations, and enterprise infrastructure.'}
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
            <span className="card-slider-pulse-dot" style={{ backgroundColor: '#a855f7', boxShadow: '0 0 10px #a855f7' }} />
            <span>
              {language === 'EN'
                ? `Page ${currentPage + 1} / ${totalPages} • ${totalApps} Solutions`
                : `Sayfa ${currentPage + 1} / ${totalPages} • ${totalApps} Özel Çözüm`}
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
                transform: `translateX(-${currentPage * 100}%)`,
              }}
            >
              {customApps.map((app) => {
                const override = getProductOverride(app.id);
                if (override?.status === 'Gizli') return null;

                const displayName = override?.name || app.name;
                const displayBadge = override?.badge !== undefined ? override.badge : app.badge;
                const displayDesc = override?.description || app.description;
                const isOutOfStock = override?.status === 'Tükendi';

                const periodInfo = getPackagePeriodInfo(app.id, selectedPeriod);
                const plan = app.pricing[selectedPeriod];
                const rawPrice = periodInfo.customPrice || plan.totalPrice;
                const isAvailable = periodInfo.isAvailable && !isOutOfStock;
                const statusBadge = isOutOfStock ? 'Tükendi' : (periodInfo.statusBadge || 'Yakında');
                const cleanPriceVal = String(rawPrice || '').replace(/\s*TL\s*/gi, '').trim();

                return (
                  <div key={app.id} className="card-slider-slide-single">
                    <article
                      className={`app-card-box ${app.popular ? 'app-card-popular' : ''}`}
                      id={`app-${app.id}`}
                    >
                      {app.popular && <div className="card-popular-glow" aria-hidden="true" />}

                      {/* Top Badge */}
                      <div className="app-card-top-row">
                        <div className="app-badge-pill">
                          <span>{displayBadge}</span>
                        </div>
                        {app.popular && (
                          <span className="app-highlight-pill">
                            🔥 {language === 'TR' ? 'ÖNERİLEN ÇÖZÜM' : 'RECOMMENDED SOLUTION'}
                          </span>
                        )}
                      </div>

                      {/* Header Icon + Title */}
                      <div className="app-card-header">
                        <div className="app-icon-wrap" aria-hidden="true">
                          {getAppIcon(app.icon)}
                        </div>
                        <div>
                          <h3 className="app-card-title">{displayName}</h3>
                          <p className="app-card-desc">{displayDesc}</p>
                        </div>
                      </div>

                      {/* Price Block */}
                      <div className="app-price-box">
                        <div className="app-price-main">
                          <span className="panel-currency">₺</span>
                          <span className="panel-price-num">{cleanPriceVal}</span>
                          <span className="panel-freq">
                            /{plan.periodLabel.replace(/TL\s*\/?\s*/gi, '').trim() || 'ay'}
                          </span>
                        </div>

                        <div className="app-price-sub">
                          {plan.originalPrice && (
                            <span className="panel-price-old">{plan.originalPrice}</span>
                          )}
                          {plan.discountBadge && (
                            <span className="panel-discount-tag">{plan.discountBadge}</span>
                          )}
                          {plan.monthlyEquivalent && selectedPeriod !== 'monthly' && (
                            <span className="panel-monthly-equiv">
                              ({plan.monthlyEquivalent})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons: Add to Cart + Discord Consult */}
                      <div className="app-actions-group">
                        <button
                          type="button"
                          className={`btn btn-block ${app.popular ? 'btn-primary' : 'btn-secondary'} is-disabled`}
                          onClick={(e) => handleAddToCart(e, app, plan)}
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
                          ) : addedAppId === app.id ? (
                            <span className="btn-added-label">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>{language === 'EN' ? 'Added!' : 'Sepete Eklendi!'}</span>
                            </span>
                          ) : (
                            <>
                              <span>{language === 'EN' ? 'Order Solution' : 'Hemen Başlat & Satın Al'}</span>
                              <svg className="icon-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                              </svg>
                            </>
                          )}
                        </button>

                        <a
                          href={SITE_CONFIG.brand.discordUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="app-consult-btn"
                        >
                          <span>{language === 'TR' ? '💬 Projeyi Görüş & Özel Teklif İste' : '💬 Discuss Project on Discord'}</span>
                        </a>
                      </div>

                      {/* Features Checklist */}
                      <div className="app-features-block">
                        <span className="app-features-heading">
                          {language === 'TR' ? 'Kapsam & Mimari Detaylar:' : 'Scope & Architecture Details:'}
                        </span>
                        <ul className="app-features-list">
                          {app.features.map((feat, idx) => (
                            <li key={idx} className="app-feature-item">
                              <svg className="app-check-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
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
          <span>{language === 'EN' ? 'Swipe left or right to browse solutions' : 'Çözümleri görmek için sağa / sola kaydırın'}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
