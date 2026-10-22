'use client';

import { SITE_CONFIG } from '@/config/site';
import { useLanguage } from '@/context/LanguageContext';
import Globe3D from './Globe3D';
import HeroBackground from './HeroBackground';

export default function Hero() {
  const { t, language } = useLanguage();

  const mainWords = (t.hero.titleMain || '').split(' ');
  const suffixWords = (t.hero.titleSuffix || '').split(' ');

  return (
    <section className="hero" id="hero" key={language}>
      <HeroBackground />
      <div className="container">
        <div className="hero-grid">
          {/* Sol Sütun: Başlık ve Eylemler */}
          <div className="hero-content">
            <div className="section-tag hero-animate-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="hero-title hero-animate-title">
              <span className="hero-title-line hero-line-1">
                {mainWords.map((word, idx) => (
                  <span
                    key={`main-${idx}`}
                    className="hero-word"
                    style={{ animationDelay: `${0.12 + idx * 0.09}s` }}
                  >
                    {word}
                  </span>
                ))}
              </span>
              <span className="hero-title-line hero-line-2">
                <span
                  className="hero-word text-accent hero-accent-glow"
                  style={{ animationDelay: `${0.12 + mainWords.length * 0.09}s` }}
                >
                  {t.hero.titleAccent}
                </span>
                {suffixWords.map((word, idx) => (
                  <span
                    key={`suffix-${idx}`}
                    className="hero-word"
                    style={{ animationDelay: `${0.12 + (mainWords.length + 1 + idx) * 0.09}s` }}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h1>

            <p className="hero-desc hero-animate-desc">
              {t.hero.desc}
            </p>

            <div className="hero-cta-group hero-animate-cta">
              <a href="#botlar" className="btn btn-primary" id="hero-btn-explore">
                <span>{t.hero.exploreBots}</span>
                <svg className="icon-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </a>

              <a
                href={SITE_CONFIG.brand.discordUrl}
                className="btn btn-secondary"
                id="hero-btn-contact"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{t.hero.discussProject}</span>
              </a>
            </div>

            {/* Buton Altı Sade Etiketler */}
            <div className="hero-features-list hero-animate-pills">
              {t.hero.badges.map((badge, index) => (
                <div key={index} className="hero-feature-pill">
                  <span className="hero-feature-dot" aria-hidden="true" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ Sütun: İnteraktif 3D Dünya & Global Altyapı Ağı */}
          <Globe3D />
        </div>
      </div>
    </section>
  );
}
