'use client';

import { useMemo } from 'react';
import { SITE_CONFIG, PartnerServer } from '@/config/site';
import { useLanguage } from '@/context/LanguageContext';

/* Vector Emblem / Icon for each partner server */
function ServerIcon({ server }: { server: PartnerServer }) {
  if (server.avatarUrl || server.iconType === 'red-roleplay' || server.id === 'server-red-roleplay') {
    return (
      <img
        src={server.avatarUrl || '/red-roleplay.png'}
        alt={server.name}
        className="partner-avatar-img"
      />
    );
  }

  const type = server.iconType || server.id;

  if (type === 'letra' || type === 'server-letra') {
    return (
      <svg viewBox="0 0 80 80" width="46" height="46" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="letraGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="letraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r="28" fill="url(#letraGlow)" opacity="0.35" />
        <ellipse cx="40" cy="40" rx="32" ry="11" stroke="#38bdf8" strokeWidth="1.6" strokeOpacity="0.8" transform="rotate(-25 40 40)" />
        <path d="M40 12 L44 34 L66 40 L44 46 L40 68 L36 46 L14 40 L36 34 Z" fill="url(#letraGrad)" />
        <polygon points="40,24 43,37 56,40 43,43 40,56 37,43 24,40 37,37" fill="#FFFFFF" opacity="0.9" />
      </svg>
    );
  }

  // Generic stylish monogram badge for other servers
  return (
    <div className={`partner-monogram-inner partner-mono-${server.color}`}>
      <span>{server.iconLetter}</span>
    </div>
  );
}

import TiltCard from '@/components/TiltCard';

function PartnerMinimalItem({ server, index = 0 }: { server: PartnerServer; index?: number }) {
  const isPurple = server.color === 'purple' || server.id.includes('cashv');

  return (
    <TiltCard maxAngle={12} scale={1.06} glare={false}>
      <a
        href={server.discordUrl || SITE_CONFIG.brand.discordUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`partner-minimal-item ${
          isPurple ? 'partner-spotlight-amethyst' : 'partner-spotlight-ruby'
        } partner-animated-card-${index}`}
        title={`${server.name} Discord`}
      >
        <div
          className={`partner-minimal-logo partner-logo-${server.color} ${
            isPurple ? 'purple-crystal-sheen-box' : 'red-crystal-sheen-box'
          }`}
        >
          <ServerIcon server={server} />

          {/* Laser Light Sweep Beam across the crystal */}
          <div
            className={isPurple ? 'purple-crystal-sweep-ray' : 'red-crystal-sweep-ray'}
            aria-hidden="true"
          />

          {/* Twinkling crystal sparkle flares */}
          <span className={`crystal-sparkle ${isPurple ? 'purple-sparkle-1' : 'sparkle-1'}`} aria-hidden="true" />
          <span className={`crystal-sparkle ${isPurple ? 'purple-sparkle-2' : 'sparkle-2'}`} aria-hidden="true" />
          <span className={`crystal-sparkle ${isPurple ? 'purple-sparkle-3' : 'sparkle-3'}`} aria-hidden="true" />

          {/* Verified Check Badge */}
          <span
            className={isPurple ? 'partner-verified-purple-badge' : 'partner-verified-ruby-badge'}
            title="Doğrulanmış Resmi Partner"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        </div>

        <div className="partner-name-wrapper">
          <span className="partner-minimal-name">{server.name}</span>
          <span className={`partner-official-pill ${isPurple ? 'partner-pill-purple' : 'partner-pill-rose'}`}>
            FiveM RP • Resmi Partner
          </span>
        </div>
      </a>
    </TiltCard>
  );
}

export default function PartnersSection() {
  const { t } = useLanguage();

  const servers = SITE_CONFIG.partnerServers || [];

  return (
    <section className="section partners-section" id="partnerler">
      <div className="partners-ambient-beam" aria-hidden="true" />

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

          {/* Quick Metrics Bar - Misleading info removed */}
          <div className="partners-metrics-bar">
            <div className="partner-metric-chip">
              <span className="partner-metric-indicator" />
              <span>{t.partners.statServers}</span>
            </div>
            <div className="partner-metric-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>{t.partners.statSecurity}</span>
            </div>
            <div className="partner-metric-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <span>{t.partners.statUptime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Partner Showcase */}
      <div className="partners-minimal-container partners-single-container" aria-label="Partnerlerimiz">
        <div className="partners-single-center">
          {servers.map((server, idx) => (
            <PartnerMinimalItem key={server.id} server={server} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
