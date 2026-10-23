'use client';

import { useState, useRef, useEffect } from 'react';
import { SITE_CONFIG, AdditionalService } from '@/config/site';
import { useLanguage } from '@/context/LanguageContext';

function getAdIcon(id: string) {
  if (id.includes('haftalik')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 11 18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    );
  }
  if (id.includes('aylik')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m10 15 5-3-5-3v6z" />
      </svg>
    );
  }
  if (id.includes('sponsor')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect width="20" height="5" x="2" y="7" />
      <line x1="12" x2="12" y1="22" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

export default function AdvertisementsSection() {
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const ads = (SITE_CONFIG as any).advertisements || [];
  const totalAds = ads.length;

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

  const totalPages = Math.max(1, Math.ceil(totalAds / itemsPerPage));

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

  if (totalAds === 0) return null;

  return (
    <section id="ilanlar" className="services-section section-padding" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag" style={{ color: '#ec4899', borderColor: 'rgba(236, 72, 153, 0.3)' }}>
            {language === 'EN' ? 'COMMUNITY LISTINGS & ADS' : 'REKLAM VE TANITIM İLANLARI'}
          </div>
          <h2 className="section-title services-main-heading">
            {language === 'EN' ? 'Community & Promotion' : 'Topluluk & Reklam'}{' '}
            <span className="text-accent" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {language === 'EN' ? 'Listings' : 'İlanları'}
            </span>
          </h2>
          <p className="section-desc">
            {language === 'EN'
              ? 'Promote your FiveM server, Discord community, or software to thousands of engaged members across the Wihyfe ecosystem.'
              : 'Wihyfe Discord topluluğunda ve ekosisteminde projenizi, FiveM sunucunuzu veya botunuzu binlerce aktif üyeye duyurun.'}
          </p>
        </div>

        {/* Slider Controls Bar */}
        <div className="card-slider-header-bar">
          <div className="card-slider-telemetry">
            <span className="card-slider-pulse-dot" style={{ backgroundColor: '#ec4899', boxShadow: '0 0 10px #ec4899' }} />
            <span>
              {language === 'EN'
                ? `Page ${currentPage + 1} / ${totalPages} • ${totalAds} Active Listings`
                : `Sayfa ${currentPage + 1} / ${totalPages} • ${totalAds} Aktif İlan Paketi`}
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
            <div className="card-slider-counter">
              <span>{currentPage + 1}</span>
              <span className="divider">/</span>
              <span>{totalPages}</span>
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

        {/* Slider Carousel Window */}
        <div
          className="card-slider-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
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
              id="advertisements-container"
            >
              {ads.map((ad: AdditionalService) => {
                const cleanPriceVal = ad.price.replace(/\s*TL\s*/gi, '').trim();
                const cleanFreq = ad.periodLabel.replace(/TL\s*\/?\s*/gi, '').trim() || 'hafta';

                return (
                  <div key={ad.id} className="card-slider-slide">
                    <article
                      className={`bot-card ${ad.popular ? 'bot-card-popular' : ''}`}
                      id={`ad-${ad.id}`}
                    >
                      {ad.popular && <div className="card-popular-glow" aria-hidden="true" />}

                      {ad.popular ? (
                        <div className="card-top-badge">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                          </svg>
                          <span>{ad.badge || (language === 'EN' ? 'FEATURED AD' : 'ÖNE ÇIKAN İLAN')}</span>
                        </div>
                      ) : (
                        <div className="card-top-badge badge-regular">
                          <span>{ad.badge || (language === 'EN' ? 'COMMUNITY AD' : 'TOPLULUK İLANI')}</span>
                        </div>
                      )}

                      <div className="card-header-row">
                        <div className="card-header-icon-box" aria-hidden="true" style={{ background: 'rgba(236, 72, 153, 0.15)', borderColor: 'rgba(236, 72, 153, 0.3)', color: '#ec4899' }}>
                          {getAdIcon(ad.id)}
                        </div>
                        <h3 className="card-header-title">{ad.name}</h3>
                      </div>

                      <p className="card-header-desc">{ad.subtitle}</p>

                      <div className="card-price-block">
                        <div className="card-price-main-line">
                          <span className="card-price-currency">₺</span>
                          <span className="card-price-val">{cleanPriceVal}</span>
                          <span className="card-price-freq">/{cleanFreq}</span>
                        </div>

                        <div className="card-price-subline">
                          <span>{language === 'EN' ? 'Community promotion' : 'Topluluk tanıtım ilanı'}</span>
                        </div>
                      </div>

                      <div className="card-cta-row">
                        <button
                          type="button"
                          className="btn btn-secondary btn-full-width"
                          disabled
                          style={{
                            opacity: 0.65,
                            cursor: 'not-allowed',
                            borderColor: 'rgba(236, 72, 153, 0.3)',
                            background: 'rgba(255, 255, 255, 0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <span>{ad.buttonText || (language === 'EN' ? 'Coming Soon' : 'Yakında')}</span>
                          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>🕒</span>
                        </button>
                      </div>

                      <div className="card-feature-divider" />

                      <div className="card-feature-section">
                        <div className="card-feature-label">
                          {language === 'EN' ? 'INCLUDED IN LISTING' : 'İLANA DAHİL HİZMETLER'}
                        </div>
                        <ul className="card-feature-list">
                          {ad.features.map((feature, fIdx) => (
                            <li key={fIdx} className="card-feature-item">
                              <span className="card-feature-check" style={{ color: '#ec4899' }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </span>
                              <span className="card-feature-text">{feature}</span>
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

        {/* Carousel Dots */}
        {totalPages > 1 && (
          <div className="card-slider-dots">
            {Array.from({ length: totalPages }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                className={`card-slider-dot ${currentPage === dotIdx ? 'active' : ''}`}
                onClick={() => setCurrentPage(dotIdx)}
                aria-label={`Sayfa ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
