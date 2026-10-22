'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';

import { IconShield, IconBan, IconZap, IconPlus, IconGlobe, IconUser } from '../AdminIcons';

export default function SecurityView() {
  const { threats, bans, removeBan, setIsBanModalOpen, setBanTarget, showToast } = useAdmin();
  const [activeTabSub, setActiveTabSub] = useState<'threats' | 'bans'>('threats');

  const handleAddNewBan = () => {
    setBanTarget(null);
    setIsBanModalOpen(true);
  };

  const handleSimulateAttack = () => {
    showToast('Sentinel L7 Koruması: Şüpheli trafik engellendi.', 'info');
  };

  return (
    <div className="admin-view-body">
      {/* Top Security Overview Stats */}
      <div className="admin-metric-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">WAF Saldırı Kalkanı</span>
            <span className="admin-status-dot" />
          </div>
          <div className="admin-metric-value" style={{ color: '#10b981' }}>AKTİF</div>
          <div className="admin-metric-sub">Layer 7 DDoS &amp; Brute-Force Koruması</div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">Engellenen Olaylar</span>
            <div className="admin-metric-icon" style={{ color: '#ef4444' }}>
              <IconShield size={16} />
            </div>
          </div>
          <div className="admin-metric-value">{threats.length}</div>
          <div className="admin-metric-sub">Kritik tehditler düşürüldü</div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">Aktif IP &amp; Hesap Kısıtları</span>
            <div className="admin-metric-icon" style={{ color: '#f59e0b' }}>
              <IconBan size={16} />
            </div>
          </div>
          <div className="admin-metric-value">{bans.length}</div>
          <div className="admin-metric-sub">Yasaklı IP &amp; Spam Kullanıcıları</div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">PIN Brute-Force Koruma</span>
            <div className="admin-metric-icon" style={{ color: '#06b6d4' }}>
              <IconZap size={16} />
            </div>
          </div>
          <div className="admin-metric-value" style={{ color: '#06b6d4' }}>5 Deneme / IP</div>
          <div className="admin-metric-sub">İndirme API'si katı koruma altında</div>
        </div>
      </div>

      {/* Main Security Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title-group">
            <h2 className="admin-card-title">
              <IconShield size={18} color="var(--admin-accent-purple)" />
              <span>Güvenlik Duvarı, Tehditler &amp; Kısıtlamalar</span>
            </h2>
            <span className="admin-card-desc">
              Saldırı engelleme kayıtları, şüpheli IP adresleri ve hesap kısıtlama kurallarını anlık inceleyin.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              className="admin-btn-primary"
              onClick={handleAddNewBan}
            >
              <IconPlus size={14} strokeWidth={2.5} />
              <span>+ Manuel Kısıt / Ban Ekle</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="admin-timeframe-pills" style={{ alignSelf: 'flex-start', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`admin-tf-btn ${activeTabSub === 'threats' ? 'active' : ''}`}
            onClick={() => setActiveTabSub('threats')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <IconShield size={12} color="#10b981" />
            <span>Tespit Edilen &amp; Engellenen Saldırılar ({threats.length})</span>
          </button>
          <button
            type="button"
            className={`admin-tf-btn ${activeTabSub === 'bans' ? 'active' : ''}`}
            onClick={() => setActiveTabSub('bans')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <IconBan size={12} color="#f59e0b" />
            <span>Aktif IP &amp; Hesap Kısıtlamaları ({bans.length})</span>
          </button>
        </div>

        {/* Tab 1: Threats Table */}
        {activeTabSub === 'threats' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tehdit Türü</th>
                  <th>Kaynak IP / Hedef</th>
                  <th>Önem Derecesi</th>
                  <th>Durum</th>
                  <th>Zaman Damgası</th>
                  <th>Uygulanan Savunma (Mitigation)</th>
                </tr>
              </thead>
              <tbody>
                {threats.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--admin-text-dim)' }}>
                      Aktif tehdit veya saldırı bulunmuyor. Cloudflare ve WAF güvenlik kalkanı devrede, sistem güvenli.
                    </td>
                  </tr>
                ) : (
                  threats.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <span style={{ color: '#fff', fontWeight: 700 }}>{t.type}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: '0.78rem' }}>{t.sourceIp}</span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-dim)' }}>Hedef: {t.targetPath}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: t.severity === 'Kritik' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: t.severity === 'Kritik' ? '#fca5a5' : '#fcd34d',
                          border: t.severity === 'Kritik' ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
                        }}>
                          {t.severity}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.75rem' }}>
                          ● {t.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.74rem', color: 'var(--admin-text-muted)' }}>{t.timestamp}</td>
                      <td style={{ fontSize: '0.74rem', color: 'var(--admin-text-muted)', maxWidth: '320px' }}>
                        {t.mitigation}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Bans Table */}
        {activeTabSub === 'bans' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Kısıt Türü</th>
                  <th>Hedef Değer / İsim</th>
                  <th>Kısıtlama Sebebi</th>
                  <th>Yetkili</th>
                  <th>Süre &amp; Bitiş</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {bans.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--admin-text-dim)' }}>
                      Şu anda kısıtlanan herhangi bir IP veya kullanıcı hesabı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  bans.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: b.targetType === 'ip' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: b.targetType === 'ip' ? '#93c5fd' : '#fca5a5',
                          textTransform: 'uppercase'
                        }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            {b.targetType === 'ip' ? <IconGlobe size={11} /> : <IconUser size={11} />}
                            <span>{b.targetType === 'ip' ? 'IP Ban' : 'Hesap Ban'}</span>
                          </span>
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#fff', fontWeight: 600 }}>{b.targetName || b.targetValue}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)', fontFamily: 'monospace' }}>{b.targetValue}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', maxWidth: '300px' }}>
                        {b.reason}
                      </td>
                      <td>
                        <span style={{ color: '#c4b5fd', fontWeight: 500, fontSize: '0.74rem' }}>{b.bannedBy}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#fff', fontWeight: 600 }}>{b.duration}</span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-dim)' }}>{b.expiresAt}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="admin-action-btn primary"
                          onClick={() => removeBan(b.id)}
                        >
                          Kısıtlamayı Kaldır
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
