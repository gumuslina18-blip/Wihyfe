'use client';

import { useState } from 'react';
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
  const [addedPanelId, setAddedPanelId] = useState<string | null>(null);

  const { addToCart, dynamicPeriods, getPackagePeriodInfo, getProductOverride } = useStore();
  const { language } = useLanguage();

  const panels = SITE_CONFIG.panels || [];
  const activePeriods = dynamicPeriods && dynamicPeriods.length > 0 ? dynamicPeriods : BILLING_PERIODS;
  const currentPeriodObj = activePeriods.find((p) => p.id === selectedPeriod) || activePeriods[0];

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, panel: BotProduct, plan: PricingPlan) => {
    const periodInfo = getPackagePeriodInfo(panel.id, selectedPeriod);
    const isAvailable = periodInfo.isAvailable && currentPeriodObj.isAvailable;
    if (!isAvailable) return;

    // Trigger glowing flying cart animation
    animateFlyToCart(e.currentTarget);

    // Show checkmark success state
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

        {/* 2 Wide Interactive Cards Grid */}
        <div className="panels-cards-grid">
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
            const statusBadge = isOutOfStock ? 'Tükendi' : periodInfo.statusBadge;
            const cleanPriceVal = String(rawPrice || '').replace(/\s*TL\s*/gi, '').trim();

            return (
              <article
                key={panel.id}
                className={`panel-card-box ${panel.popular ? 'panel-card-popular' : ''}`}
                id={`panel-${panel.id}`}
              >
                {panel.popular && <div className="card-popular-glow" aria-hidden="true" />}

                {/* Top Badge */}
                <div className="panel-card-top-row">
                  <div className="panel-badge-pill">
                    <span>{displayBadge}</span>
                  </div>
                  {panel.popular && (
                    <span className="panel-highlight-pill">
                      ⭐ {language === 'TR' ? 'ÖNE ÇIKAN PANEL' : 'FEATURED PANEL'}
                    </span>
                  )}
                </div>

                {/* Header Icon + Title */}
                <div className="panel-card-header">
                  <div className="panel-icon-wrap" aria-hidden="true">
                    {getPanelIcon(panel.icon)}
                  </div>
                  <div>
                    <h3 className="panel-card-title">{displayName}</h3>
                    <p className="panel-card-desc">{displayDesc}</p>
                  </div>
                </div>

                {/* Price Block */}
                <div className="panel-price-box">
                  <div className="panel-price-main">
                    <span className="panel-currency">₺</span>
                    <span className="panel-price-num">{cleanPriceVal}</span>
                    <span className="panel-freq">
                      /{plan.periodLabel.replace(/TL\s*\/?\s*/gi, '').trim() || 'ay'}
                    </span>
                  </div>

                  <div className="panel-price-sub">
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

                {/* CTA Action Button */}
                <div className="panel-action-wrap">
                  <button
                    type="button"
                    className={`btn btn-block ${panel.popular ? 'btn-primary' : 'btn-secondary'} ${
                      addedPanelId === panel.id ? 'btn-added-success' : ''
                    }`}
                    onClick={(e) => handleAddToCart(e, panel, plan)}
                    disabled={!isAvailable}
                    aria-label={`${displayName} ${isAvailable ? 'Satın Al' : statusBadge}`}
                  >
                    {addedPanelId === panel.id ? (
                      <span className="btn-added-label">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{language === 'EN' ? 'Added!' : 'Sepete Eklendi!'}</span>
                      </span>
                    ) : (
                      <>
                        <span>{isAvailable ? (language === 'EN' ? 'Select Panel' : 'Paneli Satın Al') : statusBadge}</span>
                        {isAvailable && (
                          <svg className="icon-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        )}
                      </>
                    )}
                  </button>
                </div>

                {/* Features Checklist */}
                <div className="panel-features-block">
                  <span className="panel-features-heading">
                    {language === 'TR' ? 'Panel Özellikleri & Modülleri:' : 'Panel Features & Modules:'}
                  </span>
                  <ul className="panel-features-list">
                    {panel.features.map((feat, idx) => (
                      <li key={idx} className="panel-feature-item">
                        <svg className="panel-check-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
