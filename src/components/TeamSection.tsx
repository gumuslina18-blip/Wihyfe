'use client';

import { SITE_CONFIG, TeamMember } from '@/config/site';
import { useLanguage } from '@/context/LanguageContext';

export default function TeamSection() {
  const { t } = useLanguage();

  return (
    <section className="section team-section" id="ekibimiz">
      <div className="container">
        <div className="section-header text-center">
          <div className="section-tag">{t.team.badge}</div>
          <h2 className="section-title team-main-heading">
            {t.team.title} <span className="text-accent">{t.team.titleAccent}</span>
          </h2>
          <p className="section-desc">
            {t.team.desc}
          </p>
        </div>

        <div className="team-grid">
          {SITE_CONFIG.team.map((member: TeamMember) => (
            <div key={member.id} className="team-card">
              <div className="team-avatar-wrapper">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="team-avatar-img"
                  width={100}
                  height={100}
                  loading="lazy"
                />
                <div className={`team-avatar-glow role-glow-${member.roleColor}`} />
              </div>
              
              <h3 className="team-member-name">{member.name}</h3>
              
              <div className="team-role-wrapper">
                <span className={`team-role-text role-${member.roleColor}`}>
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
