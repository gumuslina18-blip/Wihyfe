'use client';

import { useState } from 'react';
import { SITE_CONFIG, WebsiteProduct, BILLING_PERIODS, BillingPeriod, PricingPlan } from '@/config/site';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { animateFlyToCart } from '@/lib/cartAnimation';

export default function WebsitesSection() {
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>('monthly');
  const [addedSiteId, setAddedSiteId] = useState<string | null>(null);
  const { addToCart, getProductOverride, getPackagePeriodInfo } = useStore();
  const { t, language } = useLanguage();

  const currentPeriodObj = BILLING_PERIODS.find((p) => p.id === selectedPeriod) || BILLING_PERIODS[0];

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, site: WebsiteProduct, plan: PricingPlan) => {
    const periodInfo = getPackagePeriodInfo(site.id, selectedPeriod);
    const isAvailable = periodInfo.isAvailable !== false && currentPeriodObj.isAvailable;
    if (!isAvailable) return;

    // Trigger glowing flying cart animation
    animateFlyToCart(e.currentTarget);

    // Show checkmark success state
    setAddedSiteId(site.id);
    setTimeout(() => {
      setAddedSiteId((curr) => (curr === site.id ? null : curr));
    }, 1800);

    const override = getProductOverride(site.id);
    const rawPrice = periodInfo.customPrice || plan.totalPrice;
    const cleanPrice = rawPrice.replace(/\s*TL\s*/gi, '').trim();
    const numeric = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '')) || 0;

    addToCart({
      productId: site.id,
      name: override?.name || site.name,
      periodLabel: plan.periodLabel,
      price: `${cleanPrice} TL`,
      numericPrice: numeric,
      icon: 'globe',
      badge: override?.badge !== undefined ? override.badge : 'Website',
      paytrUrl: periodInfo.paytrUrl || plan.paytrUrl,
      periodKey: selectedPeriod,
    });
  };

  return (
    <section className="section websites-section" id="websiteler">
      <div className="container">
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

        <div className="websites-grid">
          {SITE_CONFIG.websites.map((site: WebsiteProduct) => {
            const override = getProductOverride(site.id);
            if (override?.status === 'Gizli') return null;

            const displayName = override?.name || site.name;
            const displayBadge = override?.badge !== undefined ? override.badge : site.badge;
            const displayDesc = override?.description || site.description;
            const isOutOfStock = override?.status === 'Tükendi';

            const periodInfo = getPackagePeriodInfo(site.id, selectedPeriod);
            const plan = site.pricing[selectedPeriod];
            const isFeatured = site.isCustomQuote || site.popular;
            const rawPrice = periodInfo.customPrice || plan.totalPrice;
            const cleanPriceVal = rawPrice.replace(/\s*TL\s*/gi, '').trim();
            const isAvailable = periodInfo.isAvailable !== false && currentPeriodObj.isAvailable && !isOutOfStock;
            const statusBadge = isOutOfStock ? 'Tükendi' : periodInfo.statusBadge;

            return (
              <article
                key={site.id}
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

                {/* Action Button (Located immediately below price) */}
                <div className="card-action-wrap">
                  {site.isCustomQuote ? (
                    <a
                      href={site.customQuoteUrl || SITE_CONFIG.brand.discordUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-action-btn btn-popular-highlight"
                      aria-label={`${displayName} için ticket açarak teklif alın`}
                      style={{ textDecoration: 'none' }}
                    >
                      <span>{language === 'EN' ? 'Get a Quote' : 'Teklif Al'}</span>
                      <svg className="btn-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, site, plan)}
                      disabled={!isAvailable}
                      className={`card-action-btn ${
                        isFeatured ? 'btn-popular-highlight' : 'btn-standard-dark'
                      } ${!isAvailable ? 'is-disabled' : ''} ${
                        addedSiteId === site.id ? 'is-added' : ''
                      }`}
                      aria-label={`${displayName} web sitesini seç`}
                    >
                      {!isAvailable ? (
                        <>
                          <span>{statusBadge || (language === 'EN' ? 'Coming Soon' : 'Yakında')}</span>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </>
                      ) : addedSiteId === site.id ? (
                        <>
                          <span style={{ fontWeight: 700 }}>{language === 'EN' ? 'Added to Cart!' : 'Sepete Eklendi!'}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>{language === 'EN' ? 'Select Website' : 'Web Sitesi Seç'}</span>
                          <svg className="btn-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}

                  {/* 3D Live Interactive Preview Button */}
                  <button
                    type="button"
                    className="card-preview-3d-btn"
                    onClick={() => {
                      let targetTemplate = 'donate-market';
                      if (site.id.includes('legal')) targetTemplate = 'mdt-cad';
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

                {/* Divider: PLANA DAHİL ────────────── */}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
