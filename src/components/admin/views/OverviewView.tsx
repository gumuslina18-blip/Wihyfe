'use client';

import React, { useMemo, useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import {
  IconWallet,
  IconUser,
  IconShield,
  IconKey,
  IconActivity,
  IconServer,
  IconCheck,
  IconClock,
  DeliveryStatusBadge,
  RoleSymbol,
  TierSymbol,
} from '../AdminIcons';

export default function OverviewView() {
  const {
    orders,
    users,
    threats,
    pins,
    currentStaff,
    setActiveTab,
    setIsPinModalOpen,
    setIsRoleModalOpen,
    setEditingUser,
    setIsEndOfDayModalOpen,
  } = useAdmin();

  const [chartTimeframe, setChartTimeframe] = useState<'7d' | '14d'>('7d');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Aggregated live KPIs
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status === 'Tamamlandı')
      .reduce((sum, o) => sum + o.amount, 0);
  }, [orders]);

  const activePinsCount = useMemo(() => {
    return pins.filter((p) => p.status === 'Aktif').length;
  }, [pins]);

  const blockedThreatsCount = useMemo(() => {
    return threats.filter((t) => t.status === 'Engellendi').length;
  }, [threats]);

  // Donut breakdown calculation
  const completedOrders = orders.filter((o) => o.status === 'Tamamlandı').length;
  const pendingOrders = orders.filter((o) => o.status === 'Beklemede' || o.status === 'İşlemde').length;
  const cancelledOrders = orders.filter((o) => o.status === 'İptal Edildi').length;
  const totalOrdersCount = orders.length || 1;

  const pctCompleted = Math.round((completedOrders / totalOrdersCount) * 100);
  const pctPending = Math.round((pendingOrders / totalOrdersCount) * 100);
  const pctCancelled = 100 - pctCompleted - pctPending;

  // Chart points for 7d vs 14d
  const chartPoints = chartTimeframe === '7d'
    ? [
        { label: '11 Eki', val: 4 },
        { label: '12 Eki', val: 7 },
        { label: '13 Eki', val: 6 },
        { label: '14 Eki', val: 11 },
        { label: '15 Eki', val: 9 },
        { label: '16 Eki', val: 14 },
        { label: '17 Eki', val: 18 },
      ]
    : [
        { label: '4 Eki', val: 3 },
        { label: '6 Eki', val: 5 },
        { label: '8 Eki', val: 4 },
        { label: '10 Eki', val: 9 },
        { label: '12 Eki', val: 8 },
        { label: '14 Eki', val: 12 },
        { label: '17 Eki', val: 18 },
      ];

  const maxChartVal = 20;

  return (
    <div className="admin-view-body">
      {/* Gün Sonu (Z-Raporu) Hızlı Takip Bannerı */}
      <div className="admin-overview-eod-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="admin-overview-eod-icon">
            📊
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>
                Gün Sonu Takibi (Canlı Dönem)
              </h3>
              <span className="admin-overview-eod-tag">
                <span className="admin-live-pulse-dot" style={{ background: '#10b981' }} />
                Dönem Açık
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.15rem 0 0' }}>
              Günün satış, teslimat, bakiye ve destek özetini canlı görün ve tek tıkla Z-Raporu alarak günü kapatın.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setIsEndOfDayModalOpen(true)}
          style={{ padding: '0.45rem 1rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', boxShadow: '0 0 15px rgba(56, 189, 248, 0.25)' }}
        >
          <span>📊 Gün Sonu Paneli &amp; Z-Raporu</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* 4 Metric Cards (Clean Vector Icons, No Emojis) */}
      <div className="admin-metric-grid">
        {/* Card 1: Toplam Satış / Ciro */}
        <div className="admin-metric-card">
          <div className="admin-hud-corner admin-hud-corner-tl" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-tr" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-bl" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-br" aria-hidden="true" />

          {/* Mini Vector Sparkline */}
          <div className="admin-metric-sparkline" aria-hidden="true">
            <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 0,34 Q 25,10 50,24 T 100,8"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px rgba(8, 120, 255, 0.7))' }}
              />
            </svg>
          </div>

          <div className="admin-metric-header">
            <span className="admin-metric-title">
              <IconWallet size={15} color="var(--admin-accent-purple)" />
              <span>Toplam Ciro &amp; Satış</span>
            </span>
            <div className="admin-metric-icon" style={{ color: 'var(--admin-accent-purple)' }}>
              <IconWallet size={16} />
            </div>
          </div>
          <div className="admin-metric-value">
            ₺{totalRevenue.toLocaleString('tr-TR')}
          </div>
          <div className="admin-metric-sub">
            <span style={{ color: totalRevenue > 0 ? 'var(--admin-accent-emerald)' : 'var(--admin-text-dim)', fontWeight: 600 }}>
              {orders.length > 0 ? `${orders.length} sipariş` : '0 Sipariş'}
            </span>
            <span>Tüm zamanlardaki ciro</span>
          </div>
        </div>

        {/* Card 2: Ziyaretçi & Hesap Girişleri */}
        <div className="admin-metric-card">
          <div className="admin-hud-corner admin-hud-corner-tl" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-tr" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-bl" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-br" aria-hidden="true" />

          {/* Mini Vector Sparkline */}
          <div className="admin-metric-sparkline" aria-hidden="true">
            <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 0,30 Q 30,5 60,22 T 100,10"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.7))' }}
              />
            </svg>
          </div>

          <div className="admin-metric-header">
            <span className="admin-metric-title">
              <IconUser size={15} color="var(--admin-accent-cyan)" />
              <span>Kayıtlı Kullanıcı &amp; Ekip</span>
            </span>
            <div className="admin-metric-icon" style={{ color: 'var(--admin-accent-cyan)' }}>
              <IconUser size={16} />
            </div>
          </div>
          <div className="admin-metric-value">{users.length}</div>
          <div className="admin-metric-sub">
            <span style={{ color: 'var(--admin-accent-cyan)', fontWeight: 600 }}>{users.filter(u => u.status === 'Aktif').length} Aktif</span>
            <span>Sitede kayıtlı hesap</span>
          </div>
        </div>

        {/* Card 3: Şüpheli Tehditler / Saldırılar */}
        <div className="admin-metric-card">
          <div className="admin-hud-corner admin-hud-corner-tl" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-tr" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-bl" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-br" aria-hidden="true" />

          {/* Mini Vector Sparkline */}
          <div className="admin-metric-sparkline" aria-hidden="true">
            <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 0,22 Q 25,32 50,14 T 100,26"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.7))' }}
              />
            </svg>
          </div>

          <div className="admin-metric-header">
            <span className="admin-metric-title">
              <IconShield size={15} color="var(--admin-accent-amber)" />
              <span>Güvenlik &amp; Tehditler</span>
            </span>
            <div className="admin-metric-icon" style={{ color: 'var(--admin-accent-amber)' }}>
              <IconShield size={16} />
            </div>
          </div>
          <div className="admin-metric-value">{threats.length}</div>
          <div className="admin-metric-sub">
            <span style={{ color: threats.length === 0 ? 'var(--admin-accent-emerald)' : '#fca5a5', fontWeight: 600 }}>
              {threats.length === 0 ? '0 Tehdit' : `${blockedThreatsCount} Engellendi`}
            </span>
            <span>WAF &amp; Sentinel devrede</span>
          </div>
        </div>

        {/* Card 4: Toplam PIN */}
        <div className="admin-metric-card">
          <div className="admin-hud-corner admin-hud-corner-tl" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-tr" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-bl" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-br" aria-hidden="true" />

          {/* Mini Vector Sparkline */}
          <div className="admin-metric-sparkline" aria-hidden="true">
            <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 0,32 Q 25,24 50,12 T 100,6"
                fill="none"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.7))' }}
              />
            </svg>
          </div>

          <div className="admin-metric-header">
            <span className="admin-metric-title">
              <IconKey size={15} color="var(--admin-accent-emerald)" />
              <span>Toplam PIN</span>
            </span>
            <div className="admin-metric-icon" style={{ color: 'var(--admin-accent-emerald)' }}>
              <IconKey size={16} />
            </div>
          </div>
          <div className="admin-metric-value">{pins.length}</div>
          <div className="admin-metric-sub">
            <span style={{ color: 'var(--admin-accent-emerald)', fontWeight: 600 }}>{activePinsCount} Aktif</span>
            <span>Tüm zamanlardaki PIN'ler</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Activity Timeline Chart + Donut Result Breakdown */}
      <div className="admin-chart-row">
        {/* Left: Aktivite Çizgi Grafiği */}
        <div className="admin-card">
          <div className="admin-hud-corner admin-hud-corner-tl" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-tr" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-bl" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-br" aria-hidden="true" />

          <div className="admin-card-header">
            <div className="admin-card-title-group">
              <h2 className="admin-card-title">
                <span>Tarama &amp; Sipariş Aktivitesi</span>
              </h2>
              <span className="admin-card-desc">Günlük tamamlanan işlemler &amp; teslimatlar</span>
            </div>

            <div className="admin-timeframe-pills">
              <button
                type="button"
                className={`admin-tf-btn ${chartTimeframe === '7d' ? 'active' : ''}`}
                onClick={() => setChartTimeframe('7d')}
              >
                7 gün
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${chartTimeframe === '14d' ? 'active' : ''}`}
                onClick={() => setChartTimeframe('14d')}
              >
                14 gün
              </button>
            </div>
          </div>

          {/* SVG Visual Timeline Curve with Cyber Glow */}
          <div className="admin-chart-canvas">
            {/* Animated Laser Crosshair Scanline */}
            <div className="admin-chart-scanline" aria-hidden="true" />

            <svg viewBox="0 0 600 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0878FF" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#0878FF" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#0878FF" stopOpacity="0.0" />
                </linearGradient>
                <filter id="neonCurveGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

              {/* Polygon Fill */}
              {(() => {
                const stepX = 600 / (chartPoints.length - 1);
                const pointsSvg = chartPoints
                  .map((p, idx) => {
                    const x = idx * stepX;
                    const y = 160 - (p.val / maxChartVal) * 140;
                    return `${x},${y}`;
                  })
                  .join(' ');

                return (
                  <>
                    <polygon
                      points={`0,160 ${pointsSvg} 600,160`}
                      fill="url(#chartGradient)"
                    />
                    <polyline
                      points={pointsSvg}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#neonCurveGlow)"
                    />
                    {chartPoints.map((p, idx) => {
                      const x = idx * stepX;
                      const y = 160 - (p.val / maxChartVal) * 140;
                      const isHovered = hoveredPoint === idx;

                      return (
                        <g
                          key={idx}
                          onMouseEnter={() => setHoveredPoint(idx)}
                          onMouseLeave={() => setHoveredPoint(null)}
                          style={{ cursor: 'pointer' }}
                        >
                          <circle
                            cx={x}
                            cy={y}
                            r={isHovered ? 6 : 4}
                            fill="#0B1424"
                            stroke={isHovered ? '#00D2FF' : '#60a5fa'}
                            strokeWidth={isHovered ? 3 : 2}
                            style={{ transition: 'all 0.2s ease' }}
                          />
                          {isHovered && (
                            <g>
                              <rect
                                x={x - 30}
                                y={y - 28}
                                width="60"
                                height="20"
                                rx="5"
                                fill="#0B1424"
                                stroke="#0878FF"
                                strokeWidth="1"
                              />
                              <text
                                x={x}
                                y={y - 14}
                                fill="#ffffff"
                                fontSize="11"
                                fontWeight="700"
                                textAnchor="middle"
                              >
                                {p.val} İşlem
                              </text>
                            </g>
                          )}
                          <text
                            x={x}
                            y={175}
                            fill={isHovered ? '#fff' : '#64748b'}
                            fontSize="10"
                            fontWeight={isHovered ? '700' : '500'}
                            textAnchor="middle"
                            style={{ transition: 'fill 0.2s ease' }}
                          >
                            {p.label}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--admin-text-dim)', paddingTop: '0.4rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="admin-status-dot" style={{ display: 'inline-block' }} />
              <span>Aktivite: Düzenli artış trendinde</span>
            </span>
            <span>En yüksek günlük işlem: 18</span>
          </div>
        </div>

        {/* Right: Sonuç Dağılımı Donut Chart */}
        <div className="admin-card">
          <div className="admin-hud-corner admin-hud-corner-tl" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-tr" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-bl" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-br" aria-hidden="true" />

          <div className="admin-card-header">
            <div className="admin-card-title-group">
              <h2 className="admin-card-title">Sonuç Dağılımı</h2>
              <span className="admin-card-desc">Tüm teslimat ve incelemeler</span>
            </div>
          </div>

          <div className="admin-donut-wrapper">
            {/* Outer Rotating Sci-Fi Tech Calibration Ring */}
            <div className="admin-donut-tech-ring" aria-hidden="true" />

            <svg width="144" height="144" viewBox="0 0 140 140" style={{ overflow: 'visible' }}>
              <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
              {/* Green Segment (Completed) */}
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="#10b981"
                strokeWidth="12"
                strokeDasharray={`${(pctCompleted / 100) * 339} 339`}
                strokeDashoffset="0"
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))' }}
              />
              {/* Amber Segment (Pending) */}
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="12"
                strokeDasharray={`${(pctPending / 100) * 339} 339`}
                strokeDashoffset={`-${(pctCompleted / 100) * 339}`}
                transform="rotate(-90 70 70)"
                style={{ filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))' }}
              />
            </svg>
            <div className="admin-donut-center">
              <span className="admin-donut-val">{orders.length}</span>
              <span className="admin-donut-label">Toplam İşlem</span>
            </div>
          </div>

          {/* Legend */}
          <div className="admin-donut-legend">
            <div className="admin-legend-item">
              <div className="admin-legend-marker">
                <span className="admin-legend-dot" style={{ backgroundColor: '#10b981' }} />
                <span>Tamamlandı</span>
              </div>
              <span style={{ fontWeight: 600, color: '#fff' }}>{completedOrders} (%{pctCompleted})</span>
            </div>
            <div className="admin-legend-item">
              <div className="admin-legend-marker">
                <span className="admin-legend-dot" style={{ backgroundColor: '#f59e0b' }} />
                <span>Beklemede / İşlemde</span>
              </div>
              <span style={{ fontWeight: 600, color: '#fff' }}>{pendingOrders} (%{pctPending})</span>
            </div>
            <div className="admin-legend-item">
              <div className="admin-legend-marker">
                <span className="admin-legend-dot" style={{ backgroundColor: '#ef4444' }} />
                <span>İptal Edildi</span>
              </div>
              <span style={{ fontWeight: 600, color: '#fff' }}>{cancelledOrders} (%{pctCancelled})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Orders Table + Membership Status + System Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        {/* Son Siparişler / İncelemeler */}
        <div className="admin-card">
          <div className="admin-hud-corner admin-hud-corner-tl" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-tr" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-bl" aria-hidden="true" />
          <div className="admin-hud-corner admin-hud-corner-br" aria-hidden="true" />

          <div className="admin-card-header">
            <div className="admin-card-title-group">
              <h2 className="admin-card-title">Son Sipariş &amp; Teslimat Süreçleri</h2>
              <span className="admin-card-desc">Gerçek zamanlı müşteri talepleri</span>
            </div>
            <button
              type="button"
              className="admin-btn-secondary"
              style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
              onClick={() => setActiveTab('orders')}
            >
              Tümünü Gör →
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sipariş No</th>
                  <th>Müşteri</th>
                  <th>Ürün</th>
                  <th>Tutar</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--admin-text-dim)' }}>
                      Henüz verilmiş bir sipariş bulunmuyor. Siteden sepet veya PayTR üzerinden verilen siparişler burada anında gerçek zamanlı listelenecektir.
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 4).map((o) => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 700, color: '#fff' }}>{o.id}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#fff', fontWeight: 600 }}>{o.customerName}</span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-dim)' }}>{o.customerDiscord}</span>
                        </div>
                      </td>
                      <td>{o.productName}</td>
                      <td style={{ fontWeight: 600, color: '#fff' }}>₺{o.amount.toLocaleString('tr-TR')}</td>
                      <td>
                        <DeliveryStatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Membership & System Status Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Üyelik / Yetki Durumu */}
          <div className="admin-card" style={{ flex: 1 }}>
            <div className="admin-hud-corner admin-hud-corner-tl" aria-hidden="true" />
            <div className="admin-hud-corner admin-hud-corner-tr" aria-hidden="true" />
            <div className="admin-hud-corner admin-hud-corner-bl" aria-hidden="true" />
            <div className="admin-hud-corner admin-hud-corner-br" aria-hidden="true" />

            <div className="admin-card-header">
              <div className="admin-card-title-group">
                <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Aktif Yetki &amp; Plan
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <RoleSymbol role={currentStaff.role} size={18} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                    {currentStaff.role}
                  </h3>
                  <span style={{ color: 'var(--admin-border)' }}>•</span>
                  <TierSymbol tier={currentStaff.subscription} size={14} />
                </div>
              </div>
              <button
                type="button"
                className="admin-btn-secondary"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                onClick={() => {
                  setEditingUser(currentStaff);
                  setIsRoleModalOpen(true);
                }}
              >
                Düzenle
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--admin-text-muted)' }}>
                <span>Yönetici Kasa Bakiyesi:</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>₺{currentStaff.balance.toLocaleString('tr-TR')}</span>
              </div>
              {/* Progress Bar */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)' }} />
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>
                Sınırsız yetki erişimi ve tüm yönetim hakları aktif.
              </span>
            </div>
          </div>

          {/* Sistem Durumu */}
          <div className="admin-card" style={{ flex: 1 }}>
            <div className="admin-hud-corner admin-hud-corner-tl" aria-hidden="true" />
            <div className="admin-hud-corner admin-hud-corner-tr" aria-hidden="true" />
            <div className="admin-hud-corner admin-hud-corner-bl" aria-hidden="true" />
            <div className="admin-hud-corner admin-hud-corner-br" aria-hidden="true" />

            <div className="admin-card-header">
              <h3 className="admin-card-title" style={{ fontSize: '0.85rem' }}>
                <IconActivity size={14} color="#10b981" />
                <span>Sistem &amp; Altyapı Durumu</span>
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.74rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--admin-text-muted)' }}>Next.js App Server:</span>
                <span style={{ color: '#10b981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="admin-status-dot" style={{ display: 'inline-block', position: 'static' }} /> Çevrimiçi
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--admin-text-muted)' }}>PIN Doğrulama API:</span>
                <span style={{ color: '#10b981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="admin-status-dot" style={{ display: 'inline-block', position: 'static' }} /> Aktif (İndirme Korunuyor)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--admin-text-muted)' }}>PayTR Entegrasyonu:</span>
                <span style={{ color: '#10b981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="admin-status-dot" style={{ display: 'inline-block', position: 'static' }} /> 6 Paket Hazır
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--admin-text-muted)' }}>Güvenlik Duvarı (WAF):</span>
                <span style={{ color: '#10b981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="admin-status-dot" style={{ display: 'inline-block', position: 'static' }} /> 0 Tehdit İhlali
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
