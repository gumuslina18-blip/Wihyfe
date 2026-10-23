'use client';

import { useState, useRef, useEffect } from 'react';
import { SITE_CONFIG, WebsiteProduct, BILLING_PERIODS, BillingPeriod, PricingPlan } from '@/config/site';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';

export default function WebsitesSection() {
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>('monthly');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const { getProductOverride, getPackagePeriodInfo } = useStore();
  const { t, language } = useLanguage();

  const websites = SITE_CONFIG.websites || [];
  const totalWebsites = websites.length;

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

  const totalPages = Math.max(1, Math.ceil(totalWebsites / itemsPerPage));

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

  return (
    <section className="section websites-section" id="websiteler">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">{t.websites.badge}</div>
          <h2 className="section-title website-main-heading">
            {t.websites.title} <span className="text-accent">{t.websites.titleAccent}</span>
          </h2>
          <p className="section-desc">
            {t.websites.desc}
          </p>

          {/* Billing Period Selector */}
          <div className="pricing-toggle-container">
            <div className="pricing-toggle-wrapper" role="tablist" aria-label="Fatura Dönemi Seçimi">
              {BILLING_PERIODS.map((period) => {
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
            <span className="card-slider-pulse-dot" style={{ backgroundColor: '#00d26a', boxShadow: '0 0 10px #00d26a' }} />
            <span>
              {language === 'EN'
                ? `Page ${currentPage + 1} / ${totalPages} • ${totalWebsites} Custom Solutions`
                : `Sayfa ${currentPage + 1} / ${totalPages} • ${totalWebsites} Web Çözümü`}
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
                  role="tab"
                  aria-selected={i === currentPage}
                  className={`card-slider-dot ${i === currentPage ? 'is-active' : ''}`}
                  onClick={() => setCurrentPage(i)}
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
              id="websites-slider-track"
            >
              {websites.map((site: WebsiteProduct) => {
                const override = getProductOverride(site.id);
                if (override?.status === 'Gizli') return null;

                const displayName = override?.name || site.name;
                const displayBadge = override?.badge !== undefined ? override.badge : site.badge;
                const displayDesc = override?.description || site.description;

                const periodInfo = getPackagePeriodInfo(site.id, selectedPeriod);
                const plan = site.pricing[selectedPeriod];
                const isFeatured = site.isCustomQuote || site.popular;
                const rawPrice = periodInfo.customPrice || plan.totalPrice;
                const cleanPriceVal = String(rawPrice || '').replace(/\s*TL\s*/gi, '').trim();
                const statusBadge = periodInfo.statusBadge || 'Yakında';

                return (
                  <div key={site.id} className="card-slider-slide-2col">
                    <article
                      className={`bot-card ${isFeatured ? 'bot-card-popular' : ''}`}
                      id={`site-${site.id}`}
                    >
                      {/* Ambient Blue Flare on Featured Card */}
                      {isFeatured && <div className="card-popular-glow" aria-hidden="true" />}

                      {/* Watermark Line-art Icon in Background */}
                      <div className="card-watermark-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </div>

                      {/* Top Badge */}
                      {isFeatured ? (
                        <div className="card-top-badge">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                          </svg>
                          <span>{displayBadge || (language === 'EN' ? 'FEATURED' : 'ÖNE ÇIKAN')}</span>
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
                          {site.isCustomQuote ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="16 18 22 12 16 6" />
                              <polyline points="8 6 2 12 8 18" />
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="2" y1="12" x2="22" y2="12" />
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                          )}
                        </div>
                        <h3 className="card-header-title">{displayName}</h3>
                      </div>

                      {/* Subtitle / Description */}
                      <p className="card-header-desc">{displayDesc}</p>

                      {/* Price Block: Currency + Large Price + /ay + subline */}
                      <div className="card-price-block">
                        <div className="card-price-main-line">
                          {site.isCustomQuote ? (
                            <span className="card-price-val" style={{ fontSize: '2.1rem' }}>Özel Teklif</span>
                          ) : (
                            <>
                              <span className="card-price-currency">₺</span>
                              <span className="card-price-val">{cleanPriceVal}</span>
                              <span className="card-price-freq">
                                /{plan.periodLabel.replace(/TL\s*\/?\s*/gi, '').trim() || 'ay'}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="card-price-subline">
                          {site.setupFee && (
                            <span>Kurulum Bedeli: {site.setupFee}</span>
                          )}
                          {plan.originalPrice && (
                            <>
                              <span className="card-price-old">{plan.originalPrice}</span>
                              {plan.discountBadge && (
                                <span className="card-discount-pill">{plan.discountBadge}</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Button: Set to Yakinda / Disabled for all items */}
                      <div className="card-action-wrap">
                        <button
                          type="button"
                          disabled
                          className="card-action-btn btn-standard-dark is-disabled"
                          aria-label={`${displayName} yakında aktif olacak`}
                        >
                          <span>{statusBadge || (language === 'EN' ? 'Coming Soon' : 'Yakında')}</span>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </button>

                        {/* 3D Live Interactive Preview Button */}
                        <button
                          type="button"
                          className="card-preview-3d-btn"
                          onClick={() => {
                            let targetTemplate = 'donate-market';
                            if (site.id.includes('legal')) targetTemplate = 'mdt-cad';
                            else if (site.id.includes('xm')) targetTemplate = 'community-xmstudio';
                            else if (site.id.includes('community')) targetTemplate = 'community-cashv';
                            else if (site.id.includes('illegal')) targetTemplate = 'darknet-illegal';
                            else if (site.id.includes('ozel')) targetTemplate = 'saas-portal';

                            if (typeof window !== 'undefined') {
                              window.dispatchEvent(new CustomEvent('switch-showcase-template', { detail: { templateId: targetTemplate } }));
                              const el = document.getElementById('canli-vitrin');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect width="20" height="14" x="2" y="3" rx="2" />
                            <line x1="8" x2="16" y1="21" y2="21" />
                            <line x1="12" x2="12" y1="17" y2="21" />
                          </svg>
                          <span>{language === 'EN' ? '3D Live Preview' : '3D Canlı Önizle'}</span>
                        </button>
                      </div>

                      {/* Divider: PLANA DAHİL */}
                      <div className="card-features-divider">
                        <span className="card-divider-label">{language === 'EN' ? 'INCLUDED IN PLAN' : 'PLANA DAHİL'}</span>
                        <span className="card-divider-line" />
                      </div>

                      {/* Feature List with Thin Checkmarks */}
                      <ul className="card-features-list">
                        {site.features.map((feature, idx) => (
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
                            <span>{feature}</span>
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

        {/* Swipe Hint */}
        <div className="card-slider-hint text-center">
          <span>{language === 'EN' ? '💡 Use arrows or swipe horizontally to navigate solutions' : '💡 Çözümler arasında gezinmek için oklara tıklayın veya parmağınızla sağa/sola kaydırın'}</span>
        </div>
      </div>
    </section>
  );
}
