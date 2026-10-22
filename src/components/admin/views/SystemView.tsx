'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { IconKey, IconTerminal } from '../AdminIcons';

export default function SystemView() {
  const { showToast } = useAdmin();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [downloadGating, setDownloadGating] = useState(true);

  const handleToggleMaintenance = () => {
    const next = !maintenanceMode;
    setMaintenanceMode(next);
    showToast(next ? 'Bakım modu AÇILDI. Site ziyaretçilere bakım ekranı gösterecek.' : 'Bakım modu KAPATILDI. Site normal yayında.', next ? 'error' : 'success');
  };

  const handleToggleGating = () => {
    const next = !downloadGating;
    setDownloadGating(next);
    showToast(next ? 'PIN Zorunluluğu AKTİF: Sadece PIN ile indirme yapılabilir.' : 'PIN Zorunluluğu Pasif: Herkes indirebilir.', 'info');
  };

  return (
    <div className="admin-view-body">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title-group">
            <h2 className="admin-card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Sistem &amp; API Entegrasyon Yapılandırması</span>
            </h2>
            <span className="admin-card-desc">
              Sunucu ayarları, indirme PIN politikaları, webhook adresleri ve güvenlik kalkanı parametreleri.
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          {/* Card 1: İndirme ve PIN Politikası */}
          <div className="admin-card" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#fff', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <IconKey size={14} color="#38bdf8" />
              <span>İstemci İndirme PIN Güvenlik Politikası</span>
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
              Kullanıcıların masaüstü uygulamasını indirebilmesi için yetkili panelinden oluşturulmuş 6 haneli aktif bir PIN girmesi zorunludur.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--admin-border)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>PIN Zorunluluğu (Gating):</span>
              <button
                type="button"
                className={`admin-action-btn ${downloadGating ? 'primary' : ''}`}
                onClick={handleToggleGating}
              >
                {downloadGating ? 'KORUMALI (Zorunlu)' : 'SERBEST (Açık)'}
              </button>
            </div>
          </div>

          {/* Card 2: Bakım Modu */}
          <div className="admin-card" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#fff', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <IconTerminal size={14} color="#f59e0b" />
              <span>Bakım Modu (Maintenance)</span>
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
              Site genelinde bakım modu açıldığında, sadece yetkili rolündeki kullanıcılar erişebilir; normal ziyaretçilere bakım ekranı verilir.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--admin-border)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>Bakım Durumu:</span>
              <button
                type="button"
                className={`admin-action-btn ${maintenanceMode ? 'danger' : ''}`}
                onClick={handleToggleMaintenance}
              >
                {maintenanceMode ? 'BAKIM DEVREDE' : 'Çevrimiçi Yayında'}
              </button>
            </div>
          </div>
        </div>

        {/* API Services Status Box */}
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', margin: '0 0 0.75rem 0' }}>
            Canlı Uç Noktalar &amp; Webhook Bağlantıları
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--admin-text-muted)' }}>İndirme Doğrulama Uç Noktası (POST):</span>
              <code style={{ color: '#06b6d4', background: 'rgba(6,182,212,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>/api/download</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--admin-text-muted)' }}>PIN Yönetim Servisi (GET, POST, DELETE):</span>
              <code style={{ color: '#c4b5fd', background: 'rgba(139,92,246,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>/api/admin/pins</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--admin-text-muted)' }}>PayTR Bildirim Webhook (Hazır):</span>
              <code style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>/api/orders (Webhook Dinleniyor)</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
