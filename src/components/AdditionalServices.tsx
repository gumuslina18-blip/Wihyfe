'use client';

import { useState, useRef, useEffect } from 'react';
import { SITE_CONFIG, AdditionalService } from '@/config/site';
import { useStore } from '@/context/StoreContext';
import { useLanguage } from '@/context/LanguageContext';
import { animateFlyToCart } from '@/lib/cartAnimation';

function getServiceIcon(id: string) {
  if (id.includes('yetkili')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="M7 21h10" />
        <path d="M12 3v18" />
        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
      </svg>
    );
  }
  if (id.includes('black-list')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  }
  if (id.includes('webhook')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  if (id.includes('kisisel')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    );
  }
  if (id.includes('reklam-1-haftalik')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    );
  }
  if (id.includes('reklam-1-aylik')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function getServiceWatermark(id: string) {
  if (id.includes('yetkili')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="M7 21h10" />
        <path d="M12 3v18" />
        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
      </svg>
    );
  }
  if (id.includes('black-list')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  }
  if (id.includes('webhook')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  if (id.includes('reklam')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function AdditionalServices() {
  const { addToCart } = useStore();
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [addedId, setAddedId] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const totalServices = SITE_CONFIG.additionalServices.length;

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

  const totalPages = Math.max(1, Math.ceil(totalServices / itemsPerPage));

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

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, service: AdditionalService) => {
    // Services are currently not for sale (Coming Soon / Yakında)
    return;

    setAddedId(service.id);
    setTimeout(() => {
      setAddedId((curr) => (curr === service.id ? null : curr));
    }, 1800);

    addToCart({
      productId: service.id,
      name: service.name,
      periodLabel: service.periodLabel,
      price: `${service.price} TL`,
      numericPrice: service.numericPrice,
      icon: 'shield',
      badge: service.badge || 'Ek Hizmet',
      paytrUrl: service.paytrUrl,
    });
  };

  return (
    <section id="ek-hizmetler" className="services-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">{t.additionalServices.badge}</div>
          <h2 className="section-title services-main-heading">
            {t.additionalServices.title} <span className="text-accent">{t.additionalServices.titleAccent}</span>
          </h2>
          <p className="section-desc">
            {t.additionalServices.desc}
          </p>
        </div>

        {/* Slider Controls Bar */}
        <div className="card-slider-header-bar">
          <div className="card-slider-telemetry">
            <span className="card-slider-pulse-dot" />
            <span>
              {language === 'EN'
                ? `Page ${currentPage + 1} / ${totalPages} • ${totalServices} Custom Services`
                : `Sayfa ${currentPage + 1} / ${totalPages} • ${totalServices} Ek Hizmet`}
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
              id="additional-services-container"
            >
              {SITE_CONFIG.additionalServices.map((service) => {
                const isAdded = addedId === service.id;
                const cleanPriceVal = service.price.replace(/\s*TL\s*/gi, '').trim();
                const cleanFreq = service.periodLabel.replace(/TL\s*\/?\s*/gi, '').trim() || 'ay';

                return (
                  <div key={service.id} className="card-slider-slide">
                    <article
                      className={`bot-card ${service.popular ? 'bot-card-popular' : ''}`}
                      id={`service-${service.id}`}
                    >
                      {/* Ambient Blue Flare on Popular / Featured Card */}
                      {service.popular && <div className="card-popular-glow" aria-hidden="true" />}

                      {/* Watermark Line-art Icon in Background */}
                      <div className="card-watermark-icon" aria-hidden="true">
                        {getServiceWatermark(service.id)}
                      </div>

                      {/* Top Badge (✨ EN ÇOK TERCİH EDİLEN or standard pill) */}
                      {service.popular ? (
                        <div className="card-top-badge">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                          </svg>
                          <span>{service.badge || (language === 'EN' ? 'MOST POPULAR' : 'EN ÇOK TERCİH EDİLEN')}</span>
                        </div>
                      ) : service.badge ? (
                        <div className="card-top-badge badge-regular">
                          <span>{service.badge}</span>
                        </div>
                      ) : (
                        <div className="card-top-badge badge-regular">
                          <span>{language === 'EN' ? 'ADDITIONAL SERVICE' : 'EK HİZMET'}</span>
                        </div>
                      )}

                      {/* Header Row: Square Icon Box + Title */}
                      <div className="card-header-row">
                        <div className="card-header-icon-box" aria-hidden="true">
                          {getServiceIcon(service.id)}
                        </div>
                        <h3 className="card-header-title">{service.name}</h3>
                      </div>

                      {/* Subtitle / Description */}
                      <p className="card-header-desc">{service.subtitle}</p>

                      {/* Price Block: Currency + Large Price + /frequency + subline */}
                      <div className="card-price-block">
                        <div className="card-price-main-line">
                          <span className="card-price-currency">₺</span>
                          <span className="card-price-val">{cleanPriceVal}</span>
                          <span className="card-price-freq">/{cleanFreq}</span>
                        </div>

                        <div className="card-price-subline">
                          <span>
                            {service.periodLabel.includes('Haftalık')
                              ? (language === 'EN' ? 'Weekly service' : 'Haftalık hizmet')
                              : (language === 'EN' ? 'Monthly subscription' : 'Aylık hizmet')}
                          </span>
                        </div>
                      </div>

                      {/* Action Button (Located immediately below price with arrow) */}
                      <div className="card-action-wrap">
                        <button
                          type="button"
                          disabled={true}
                          className="card-action-btn btn-standard-dark is-disabled"
                          aria-label={`${service.name} yakında`}
                        >
                          <span>{language === 'EN' ? 'Coming Soon' : 'Yakında'}</span>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </button>
                      </div>

                      {/* Divider: HİZMETE DAHİL ────────────── */}
                      <div className="card-features-divider">
                        <span className="card-divider-label">{language === 'EN' ? 'INCLUDED IN SERVICE' : 'HİZMETE DAHİL'}</span>
                        <span className="card-divider-line" />
                      </div>

                      {/* Features List with Thin Checkmarks */}
                      <ul className="card-features-list">
                        {service.features.map((feature, idx) => (
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

        {/* Mobile Swipe Hint */}
        <div className="card-slider-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span>{language === 'EN' ? 'Swipe left/right or use arrows to view all services' : 'Tüm ek hizmetleri görmek için sağa/sola kaydırın'}</span>
        </div>
      </div>
    </section>
  );
}
