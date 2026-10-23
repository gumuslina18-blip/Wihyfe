'use client';

import { SITE_CONFIG, PartnerServer } from '@/config/site';
import { useLanguage } from '@/context/LanguageContext';

function PartnerMarqueeItem({ server }: { server: PartnerServer }) {
  const isContainLogo = server.iconType === 'cashv-roleplay';

  return (
    <a
      href={server.discordUrl || SITE_CONFIG.brand.discordUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="partner-marquee-item"
      title={`${server.name} Discord`}
    >
      <div className="partner-marquee-icon">
        {server.avatarUrl ? (
          <img
            src={server.avatarUrl}
            alt={server.name}
            className={`partner-marquee-img ${isContainLogo ? 'partner-marquee-img-contain' : ''}`}
            loading="lazy"
          />
        ) : (
          <div className="partner-marquee-monogram">
            <span>{server.iconLetter || server.name.slice(0, 2).toUpperCase()}</span>
          </div>
        )}
      </div>
      <span className="partner-marquee-name">{server.name}</span>
    </a>
  );
}

export default function PartnersSection() {
  const { t } = useLanguage();

  const servers = SITE_CONFIG.partnerServers || [];

  return (
    <section className="section partners-section" id="partnerler">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="partner-badge-wrapper">
            <span className="partner-badge-glow-dot" />
            <span className="section-tag partner-section-tag">{t.partners.badge}</span>
          </div>

          <h2 className="section-title">
            {t.partners.title} <span className="text-accent">{t.partners.titleAccent}</span>
          </h2>
          <p className="section-desc">
            {t.partners.desc}
          </p>
        </div>

        {/* Center Sliding Window (Sadece ortada kayar, kaybolur, sonra orta sağdan tekrar kayar) */}
        <div className="partners-marquee-container" aria-label="Partnerlerimiz">
          <div className="partners-center-track">
            {servers.map((server) => (
              <PartnerMarqueeItem key={server.id} server={server} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
