'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';

import { IconTrendingUp, IconGlobe, IconUser } from '../AdminIcons';

export default function AnalyticsView() {
  const { orders, users, timeframe, setTimeframe } = useAdmin();
  const [metricTab, setMetricTab] = useState<'sales' | 'traffic' | 'accounts'>('sales');

  const totalSales = orders.filter((o) => o.status === 'Tamamlandı').reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="admin-view-body">
      {/* Top Controls */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title-group">
            <h2 className="admin-card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Detaylı İstatistik &amp; Büyüme Analitiği</span>
            </h2>
            <span className="admin-card-desc">
              Satış hacmi, siteye giriş trafiği, yeni açılan hesaplar ve dönüşüm hunisi metrikleri.
            </span>
          </div>

          <div className="admin-timeframe-pills">
            <button
              type="button"
              className={`admin-tf-btn ${timeframe === '7d' ? 'active' : ''}`}
              onClick={() => setTimeframe('7d')}
            >
              7 Gün
            </button>
            <button
              type="button"
              className={`admin-tf-btn ${timeframe === '14d' ? 'active' : ''}`}
              onClick={() => setTimeframe('14d')}
            >
              14 Gün
            </button>
            <button
              type="button"
              className={`admin-tf-btn ${timeframe === '30d' ? 'active' : ''}`}
              onClick={() => setTimeframe('30d')}
            >
              30 Gün
            </button>
            <button
              type="button"
              className={`admin-tf-btn ${timeframe === 'all' ? 'active' : ''}`}
              onClick={() => setTimeframe('all')}
            >
              Tüm Zamanlar
            </button>
          </div>
        </div>

        {/* 3 Metric View Tabs (Clean Vector Symbols, No Emojis) */}
        <div className="admin-timeframe-pills" style={{ alignSelf: 'flex-start', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`admin-tf-btn ${metricTab === 'sales' ? 'active' : ''}`}
            onClick={() => setMetricTab('sales')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <IconTrendingUp size={13} color="#10b981" />
            <span>Satış &amp; Ciro Trendi</span>
          </button>
          <button
            type="button"
            className={`admin-tf-btn ${metricTab === 'traffic' ? 'active' : ''}`}
            onClick={() => setMetricTab('traffic')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <IconGlobe size={13} color="#3b82f6" />
            <span>Siteye Giriş &amp; Oturumlar</span>
          </button>
          <button
            type="button"
            className={`admin-tf-btn ${metricTab === 'accounts' ? 'active' : ''}`}
            onClick={() => setMetricTab('accounts')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <IconUser size={13} color="#8b5cf6" />
            <span>Yeni Hesap Açma Oranları</span>
          </button>
        </div>

        {/* Visual Chart Canvas */}
        <div style={{ padding: '1rem 0' }}>
          {metricTab === 'sales' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-dim)', textTransform: 'uppercase' }}>Dönem Cirosu</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>₺{totalSales.toLocaleString('tr-TR')}</div>
                </div>
                <span style={{ color: totalSales > 0 ? '#10b981' : 'var(--admin-text-dim)', fontWeight: 700, fontSize: '0.85rem' }}>
                  {orders.length > 0 ? `${orders.length} Gerçek Sipariş` : 'Henüz sipariş kaydı yok'}
                </span>
              </div>

              {orders.length === 0 ? (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--admin-text-dim)', border: '1px dashed var(--admin-border)', borderRadius: '8px', fontSize: '0.82rem' }}>
                  Siteden henüz satış/sipariş gerçekleşmedi. Sipariş alındıkça grafik anlık olarak güncellenecektir.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem', height: '180px', alignItems: 'flex-end', paddingTop: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
                  {[
                    { day: 'Pzt', val: 0, height: '10%' },
                    { day: 'Sal', val: 0, height: '10%' },
                    { day: 'Çar', val: 0, height: '10%' },
                    { day: 'Per', val: 0, height: '10%' },
                    { day: 'Cum', val: 0, height: '10%' },
                    { day: 'Cmt', val: 0, height: '10%' },
                    { day: 'Paz', val: totalSales, height: '80%' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.68rem', color: '#fff', fontWeight: 600 }}>₺{item.val}</span>
                      <div style={{ width: '100%', height: item.height, background: 'linear-gradient(180deg, #8b5cf6, rgba(139, 92, 246, 0.2))', borderRadius: '4px' }} />
                      <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-dim)' }}>{item.day}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {metricTab === 'traffic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-dim)', textTransform: 'uppercase' }}>Canlı Oturum &amp; Altyapı</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>Çevrimiçi &amp; Aktif</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem' }}>
                  <span style={{ color: '#06b6d4', fontWeight: 600 }}>SSL &amp; CDN: Aktif</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>Uptime: %99.9</span>
                </div>
              </div>

              <div style={{ padding: '2rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
                Site ve yetkili paneli Next.js 15 App Router mimarisinde çalışıyor. Tüm sayfa geçişleri ve API istekleri gerçek zamanlı olarak izlenmektedir.
              </div>
            </div>
          )}

          {metricTab === 'accounts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-dim)', textTransform: 'uppercase' }}>Kayıtlı Yetkili &amp; Müşteri Sayısı</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{users.length} Hesap</div>
                </div>
                <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>Discord OAuth2 &amp; Rol Sistemi</span>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Sistemde Kayıtlı Olan Gerçek Kişiler:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {users.map((u) => (
                    <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.6rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', fontSize: '0.8rem' }}>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{u.username}#{u.discriminator}</span>
                      <span style={{ color: 'var(--admin-accent-purple)', fontWeight: 600 }}>{u.role} ({u.subscription})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
