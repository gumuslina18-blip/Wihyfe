'use client';

import { useState, useRef, useEffect } from 'react';
import { SITE_CONFIG, BotProduct, BILLING_PERIODS, BillingPeriod, PricingPlan } from '@/config/site';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { animateFlyToCart } from '@/lib/cartAnimation';

function getBotIcon(iconType: BotProduct['icon']) {
  switch (iconType) {
    case 'discord':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 8V5a1 1 0 0 1 1-1h3" />
          <path d="M20 8V5a1 1 0 0 0-1-1h-3" />
          <path d="M4 16v3a1 1 0 0 0 1 1h3" />
          <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'shield':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'scale':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case 'gamepad':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="4" />
          <line x1="6" y1="12" x2="10" y2="12" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <line x1="15" y1="13" x2="15.01" y2="13" strokeWidth="3" />
          <line x1="18" y1="11" x2="18.01" y2="11" strokeWidth="3" />
        </svg>
      );
    case 'terminal':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
    case 'code':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
}

export default function PackagesSection() {
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>('monthly');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [addedBotId, setAddedBotId] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const { addToCart, dynamicPeriods, getPackagePeriodInfo, getProductOverride } = useStore();
  const { t, language } = useLanguage();

  const totalBots = SITE_CONFIG.bots.length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalBots / itemsPerPage));

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

  const activePeriods = dynamicPeriods && dynamicPeriods.length > 0 ? dynamicPeriods : BILLING_PERIODS;
  const currentPeriodObj = activePeriods.find((p) => p.id === selectedPeriod) || activePeriods[0];

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, bot: BotProduct, plan: PricingPlan) => {
    e.stopPropagation();
    const periodInfo = getPackagePeriodInfo(bot.id, selectedPeriod);
    const override = getProductOverride(bot.id);
    if (!periodInfo.isAvailable || override?.status === 'Tükendi') return;

    // Trigger glowing flying cart animation
    try {
      animateFlyToCart(e.currentTarget);
    } catch (animErr) {
      console.warn('Cart animation warning:', animErr);
    }

    // Show celebratory checkmark state on button
    setAddedBotId(bot.id);
    setTimeout(() => {
      setAddedBotId((curr) => (curr === bot.id ? null : curr));
    }, 1800);

    const rawPrice = periodInfo.customPrice || plan.totalPrice;
    const rawPriceStr = String(rawPrice || '');
    const cleanPrice = rawPriceStr.replace(/\s*TL\s*/gi, '').trim();
    const numeric = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '')) || 0;
    addToCart({
      productId: bot.id,
      name: override?.name || bot.name,
      periodLabel: plan.periodLabel,
      price: `${cleanPrice} TL`,
      numericPrice: numeric,
      icon: bot.icon,
      badge: override?.badge !== undefined ? override.badge : bot.badge,
      paytrUrl: periodInfo.paytrUrl || plan.paytrUrl,
      periodKey: selectedPeriod,
    });
  };

  return (
    <section className="section" id="paketler">
      <div className="container">
        <div className="section-header text-center">
          <div className="section-tag">{t.packages.badge}</div>
          <h2 className="section-title">
            {t.packages.title} <span className="text-accent">{t.packages.titleAccent}</span>
          </h2>
          <p className="section-desc">
            {t.packages.desc}
          </p>

          {/* Billing Period Selector (Glassmorphic Button Group) */}
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

        {/* Slider Controls Bar (only if more than 1 page) */}
        {totalPages > 1 && (
          <div className="card-slider-header-bar">
            <div className="card-slider-telemetry">
              <span className="card-slider-pulse-dot" />
              <span>
                {language === 'EN'
                  ? `Page ${currentPage + 1} / ${totalPages} • ${totalBots} Packages`
                  : `Sayfa ${currentPage + 1} / ${totalPages} • ${totalBots} Paket`}
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
        )}

        {/* Sliding Carousel Viewport */}
        <div
          className="card-slider-outer"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Edge Left Button (Desktop) */}
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
              id="packages-container"
            >
              {SITE_CONFIG.bots.map((bot) => {
                const override = getProductOverride(bot.id);
                if (override?.status === 'Gizli') return null;

                const displayName = override?.name || bot.name;
                const displayBadge = override?.badge !== undefined ? override.badge : bot.badge;
                const displayDesc = override?.description || bot.description;
                const isOutOfStock = override?.status === 'Tükendi';

                const periodInfo = getPackagePeriodInfo(bot.id, selectedPeriod);
                const plan = bot.pricing[selectedPeriod];
                const rawPrice = periodInfo.customPrice || plan.totalPrice;
                const isAvailable = periodInfo.isAvailable && !isOutOfStock;
                const statusBadge = isOutOfStock ? 'Tükendi' : periodInfo.statusBadge;
                const cleanPriceVal = String(rawPrice || '').replace(/\s*TL\s*/gi, '').trim();

                return (
                  <div key={bot.id} className="card-slider-slide">
                    <article
                      className={`bot-card ${bot.popular ? 'bot-card-popular' : ''}`}
                      id={`pkg-${bot.id}`}
                    >
                        {/* Ambient Blue Flare on Popular Card */}
                        {bot.popular && <div className="card-popular-glow" aria-hidden="true" />}

                      {/* Watermark Line-art Icon in Background */}
                      <div className="card-watermark-icon" aria-hidden="true">
                        {bot.popular ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                            <polyline points="2 17 12 22 22 17" />
                            <polyline points="2 12 12 17 22 12" />
                          </svg>
                        )}
                      </div>

                      {/* Top Badge (✨ EN ÇOK TERCİH EDİLEN or standard pill) */}
                      {bot.popular ? (
                        <div className="card-top-badge">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                          </svg>
                          <span>{language === 'EN' ? 'MOST POPULAR' : 'EN ÇOK TERCİH EDİLEN'}</span>
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
                          {getBotIcon(bot.icon)}
                        </div>
                        <h3 className="card-header-title">{displayName}</h3>
                      </div>

                      {/* Subtitle / Description */}
                      <p className="card-header-desc">{displayDesc}</p>

                      {/* Price Block: Currency + Large Price + /ay + subline */}
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
                              {plan.monthlyEquivalent && (
                                <span className="card-monthly-eq">({plan.monthlyEquivalent})</span>
                              )}
                            </>
                          ) : (
                            <span>{language === 'EN' ? 'Recurring subscription' : 'Aylık abonelik'}</span>
                          )}
                        </div>
                      </div>

                      {/* Action Button (Located immediately below price) */}
                      <div className="card-action-wrap">
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, bot, plan)}
                          disabled={!isAvailable}
                          className={`card-action-btn ${
                            bot.popular ? 'btn-popular-highlight' : 'btn-standard-dark'
                          } ${!isAvailable ? 'is-disabled' : ''} ${addedBotId === bot.id ? 'is-added' : ''}`}
                          aria-label={`${bot.name} paketi ${!isAvailable ? 'yakında aktif' : 'sepete ekle'}`}
                        >
                          {!isAvailable ? (
                            <>
                              <span>{statusBadge || (language === 'EN' ? 'Coming Soon' : 'Yakında')}</span>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                            </>
                          ) : addedBotId === bot.id ? (
                            <>
                              <span style={{ fontWeight: 700 }}>{language === 'EN' ? 'Added to Cart!' : 'Sepete Eklendi!'}</span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </>
                          ) : (
                            <>
                              <span>{language === 'EN' ? 'Select Package' : 'Paketi Seç'}</span>
                              <svg className="btn-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                              </svg>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Divider: PLANA DAHİL ────────────── */}
                      <div className="card-features-divider">
                        <span className="card-divider-label">{language === 'EN' ? 'INCLUDED IN PLAN' : 'PLANA DAHİL'}</span>
                        <span className="card-divider-line" />
                      </div>

                      {/* Features List with Thin Checkmarks */}
                      <ul className="card-features-list">
                        {(override?.features || bot.features).map((feature: string, idx: number) => (
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

          {/* Edge Right Button (Desktop) */}
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

        {totalPages > 1 && (
          <div className="card-slider-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>{language === 'EN' ? 'Swipe left or right to browse packages' : 'Paketleri görmek için sağa / sola kaydırın'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}
