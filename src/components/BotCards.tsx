'use client';

import { useState, useRef, useEffect } from 'react';
import { SITE_CONFIG, StandaloneBot } from '@/config/site';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { animateFlyToCart } from '@/lib/cartAnimation';

function getStandaloneBotIcon(iconType: StandaloneBot['icon']) {
  switch (iconType) {
    case 'shield':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'lock':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'ticket':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
          <path d="M13 5v2" />
          <path d="M13 17v2" />
          <path d="M13 11v2" />
        </svg>
      );
    case 'users':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'clock':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
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

export default function BotCards() {
  const { addToCart, getProductOverride } = useStore();
  const { t, language } = useLanguage();

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [addedBotId, setAddedBotId] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const totalBots = SITE_CONFIG.standaloneBots.length;

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

  const handleBotAction = (e: React.MouseEvent<HTMLButtonElement>, bot: StandaloneBot) => {
    e.stopPropagation();
    if (bot.id === 'ozel-bot-cozum') {
      window.open(SITE_CONFIG.brand.discordUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const override = getProductOverride(bot.id);
    const isOutOfStock = override?.status === 'Tükendi';
    const isSoon = bot.isAvailable === false || override?.status === 'Yakında' || override?.isAvailable === false || true;
    if (isOutOfStock || isSoon) return;

    // Trigger glowing flying cart animation
    try {
      animateFlyToCart(e.currentTarget);
    } catch (animErr) {
      console.warn('Cart animation warning:', animErr);
    }

    // Show checkmark success state
    setAddedBotId(bot.id);
    setTimeout(() => {
      setAddedBotId((curr) => (curr === bot.id ? null : curr));
    }, 1800);

    const rawPrice = override?.price !== undefined
      ? (typeof override.price === 'number' ? override.price.toLocaleString('tr-TR') : override.price)
      : bot.price;
    const cleanPrice = rawPrice.replace(/\s*TL\s*/gi, '').trim();
    const numeric = typeof override?.price === 'number'
      ? override.price
      : parseFloat(rawPrice.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '')) || 0;

    addToCart({
      productId: bot.id,
      name: override?.name || bot.name,
      periodLabel: override?.period || bot.period,
      price: `${cleanPrice} TL`,
      numericPrice: numeric,
      icon: bot.icon,
      badge: override?.badge !== undefined ? override.badge : bot.badge,
      paytrUrl: override?.paytrUrl || bot.paytrUrl,
    });
  };

  return (
    <section className="section section-bots" id="botlar">
      <div className="container">
        <div className="section-header text-center">
          <div className="section-tag">{t.botCards.badge}</div>
          <h2 className="section-title">
            {t.botCards.title} <span className="text-accent">{t.botCards.titleAccent}</span>
          </h2>
          <p className="section-desc">
            {t.botCards.desc}
          </p>
        </div>

        {/* Slider Controls Bar */}
        <div className="card-slider-header-bar">
          <div className="card-slider-telemetry">
            <span className="card-slider-pulse-dot" />
            <span>
              {language === 'EN'
                ? `Page ${currentPage + 1} / ${totalPages} • ${totalBots} Ready Bots`
                : `Sayfa ${currentPage + 1} / ${totalPages} • ${totalBots} Hazır Bot`}
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
          {/* Edge Left Button (Desktop) */}
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

          <div className="card-slider-viewport">
            <div
              className="card-slider-track"
              style={{
                transform: `translateX(calc(-${currentPage} * (100% + 1.5rem)))`,
              }}
              id="standalone-bots-container"
            >
              {SITE_CONFIG.standaloneBots.map((bot) => {
                const override = getProductOverride(bot.id);
                if (override?.status === 'Gizli') return null;

                const displayName = override?.name || bot.name;
                const displayBadge = override?.badge !== undefined ? override.badge : bot.badge;
                const displayDesc = override?.description || bot.description;
                const displayPeriod = override?.period || bot.period;
                const isOutOfStock = override?.status === 'Tükendi';
                const isQuote = bot.id === 'ozel-bot-cozum';
                const isSoon = !isQuote && (bot.isAvailable === false || override?.status === 'Yakında' || override?.isAvailable === false || true);

                const rawPrice = override?.price !== undefined
                  ? (typeof override.price === 'number' ? override.price.toLocaleString('tr-TR') : override.price)
                  : bot.price;
                const cleanPriceVal = String(rawPrice || '').replace(/\s*TL\s*/gi, '').trim();

                return (
                  <div key={bot.id} className="card-slider-slide">
                    <article
                      className={`bot-card ${bot.popular ? 'bot-card-popular' : ''}`}
                      id={`bot-${bot.id}`}
                    >
                        {/* Ambient Blue Flare on Popular Card */}
                        {bot.popular && <div className="card-popular-glow" aria-hidden="true" />}

                      {/* Watermark Line-art Icon in Background */}
                      <div className="card-watermark-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polygon points="12 2 2 7 12 12 22 7 12 2" />
                          <polyline points="2 17 12 22 22 17" />
                          <polyline points="2 12 12 17 22 12" />
                        </svg>
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
                          {getStandaloneBotIcon(bot.icon)}
                        </div>
                        <h3 className="card-header-title">{displayName}</h3>
                      </div>

                      {/* Subtitle / Description */}
                      <p className="card-header-desc">{displayDesc}</p>

                      {/* Price Block: Currency + Large Price + /ay + subline */}
                      <div className="card-price-block">
                        <div className="card-price-main-line">
                          {isQuote ? (
                            <span className="card-price-val" style={{ fontSize: '2.1rem' }}>Özel Fiyat</span>
                          ) : (
                            <>
                              <span className="card-price-currency">₺</span>
                              <span className="card-price-val">{cleanPriceVal}</span>
                              <span className="card-price-freq">
                                /{displayPeriod.replace(/TL\s*\/?\s*/gi, '').trim() || 'ay'}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="card-price-subline">
                          <span>
                            {isQuote
                              ? (language === 'EN' ? 'Custom enterprise quotation' : 'İhtiyacınıza göre teklif')
                              : (language === 'EN' ? `${displayPeriod} abonelik` : `${displayPeriod} abonelik`)}
                          </span>
                        </div>
                      </div>

                      {/* Action Button (Located immediately below price) */}
                      <div className="card-action-wrap">
                        <button
                          type="button"
                          onClick={(e) => handleBotAction(e, bot)}
                          disabled={isOutOfStock || isSoon}
                          className={`card-action-btn ${
                            bot.popular ? 'btn-popular-highlight' : 'btn-standard-dark'
                          } ${isSoon ? 'is-disabled' : ''} ${addedBotId === bot.id ? 'is-added' : ''}`}
                          aria-label={`${displayName} ${isQuote ? 'teklif al' : isSoon ? 'yakında' : isOutOfStock ? 'tükendi' : 'sepete ekle'}`}
                        >
                          {isOutOfStock ? (
                            <span>Tükendi</span>
                          ) : isQuote ? (
                            <>
                              <span>{language === 'EN' ? 'Get a Quote' : 'Teklif Al'}</span>
                              <svg className="btn-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                              </svg>
                            </>
                          ) : isSoon ? (
                            <>
                              <span>{language === 'EN' ? 'Coming Soon' : 'Yakında'}</span>
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
                              <span>{bot.popular ? (language === 'EN' ? 'Select Bot' : 'Botu Seç') : (language === 'EN' ? 'Select Bot' : 'Botu Seç')}</span>
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
                        {bot.features.map((feature, idx) => (
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
        </div>

        <div className="card-slider-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>{language === 'EN' ? 'Swipe left or right to browse bots' : 'Botları görmek için sağa / sola kaydırın'}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
