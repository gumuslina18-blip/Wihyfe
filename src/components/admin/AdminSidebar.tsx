'use client';

import React from 'react';
import Link from 'next/link';
import { useAdmin, AdminTab } from '@/context/AdminContext';
import { RoleSymbol, IconSidebar, IconLogOut } from './AdminIcons';

interface NavDef {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
}

const svg = (children: React.ReactNode) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const ICONS: Record<AdminTab, React.ReactNode> = {
  overview: svg(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>),
  analytics: svg(<><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>),
  products: svg(<><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></>),
  orders: svg(<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />),
  tickets: svg(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />),
  users: svg(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
  pins: svg(<><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>),
  security: svg(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />),
  finance: svg(<><rect x="2" y="4" width="20" height="16" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>),
  audit: svg(<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />),
  permissions: svg(<><rect x="3" y="11" width="18" height="11" rx="2" /><circle cx="12" cy="16" r="1.5" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>),
  system: svg(<><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></>),
};

const GROUPS: { title: string; items: { id: AdminTab; label: string }[] }[] = [
  {
    title: 'Genel',
    items: [
      { id: 'overview', label: 'Genel Bakış' },
      { id: 'analytics', label: 'İstatistik & Trafik' },
    ],
  },
  {
    title: 'Yönetim Panelleri',
    items: [
      { id: 'products', label: 'Ürün & Paketler' },
      { id: 'orders', label: 'Sipariş & Teslimat' },
      { id: 'tickets', label: 'Destek Talepleri' },
      { id: 'users', label: 'Kullanıcılar & Roller' },
      { id: 'pins', label: 'PIN & Lisans Oluştur' },
    ],
  },
  {
    title: 'Güvenlik & Kasa',
    items: [
      { id: 'security', label: 'Güvenlik & Saldırılar' },
      { id: 'finance', label: 'Para & Bakiye Yönetimi' },
      { id: 'audit', label: 'Denetim Günlüğü' },
      { id: 'permissions', label: 'Yetki Matrisi' },
      { id: 'system', label: 'Sistem & API Ayarları' },
    ],
  },
];

function formatUptime(sec: number): string {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (d > 0) return `${d}g ${h}s`;
  if (h > 0) return `${h}s ${m}dk`;
  return `${m}dk`;
}

export default function AdminSidebar() {
  const {
    activeTab,
    setActiveTab,
    currentStaff,
    orders,
    threats,
    pins,
    tickets,
    health,
    canAccess,
    viewAsRole,
    sidebarCollapsed,
    toggleSidebar,
    logout,
  } = useAdmin();

  const pendingOrders = orders.filter((o) => o.status === 'Beklemede').length;
  const criticalThreats = threats.filter((t) => t.severity === 'Kritik').length;
  const activePinsCount = pins.filter((p) => p.status === 'Aktif').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length;

  const badgeFor = (id: AdminTab): string | number | undefined => {
    if (id === 'orders') return pendingOrders > 0 ? pendingOrders : undefined;
    if (id === 'tickets') return openTicketsCount > 0 ? openTicketsCount : undefined;
    if (id === 'pins') return activePinsCount;
    if (id === 'security') return criticalThreats > 0 ? `${criticalThreats} Tehdit` : undefined;
    return undefined;
  };

  const effectiveRole = viewAsRole ?? currentStaff.role;

  // Gecikme geçmişinden osiloskop çubukları (gerçek ölçümler)
  const hist = health?.latencyHistory ?? [];
  const maxLat = Math.max(1, ...hist);
  const bars = Array.from({ length: 12 }, (_, i) => {
    const v = hist[hist.length - 12 + i];
    return v === undefined ? 0 : Math.max(2, Math.round((v / maxLat) * 16));
  });

  const cpu = health?.cpuPercent ?? 0;
  const ram = health?.memUsedPercent ?? 0;

  return (
    <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Brand & System Title */}
      <div className="admin-sidebar-header">
        <Link href="/" className="admin-brand">
          <div className="admin-brand-icon">
            <div className="admin-reactor-ring" aria-hidden="true" />
            <img src="/wihyfe-icon.png" alt="Wihyfe Logo" width={22} height={22} />
          </div>
          <div className="admin-brand-title">
            <span>wihyfe</span>
            <span className="admin-brand-badge">OS</span>
          </div>
        </Link>
        <button
          type="button"
          id="admin-sidebar-toggle"
          className="admin-icon-btn admin-sidebar-toggle"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Kenar çubuğunu genişlet' : 'Kenar çubuğunu daralt'}
          aria-label="Kenar çubuğunu daralt / genişlet"
        >
          <IconSidebar size={17} strokeWidth={2.2} />
        </button>
      </div>

      {/* Workspace Indicator Pill */}
      <div className="admin-workspace-pill">
        <div className="admin-workspace-info">
          <span className="admin-workspace-label">Çalışma Alanı</span>
          <span className="admin-workspace-name" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <RoleSymbol role={effectiveRole} size={13} />
            <span>{effectiveRole}</span>
            <span style={{ color: 'var(--admin-accent-blue)', fontSize: '0.75rem' }}>• {currentStaff.subscription}</span>
          </span>
        </div>
        <span className="admin-status-dot" title={health?.ok ? 'Sunucu çevrimiçi' : 'Sunucu ölçümü bekleniyor'} />
      </div>

      {/* Nav Menu */}
      <div className="admin-nav-scroll">
        {GROUPS.map((group) => {
          const visible = group.items.filter((it) => canAccess(it.id));
          if (visible.length === 0) return null;
          return (
            <div className="admin-nav-group" key={group.title}>
              <span className="admin-nav-group-title">{group.title}</span>
              {visible.map((it) => {
                const badge = badgeFor(it.id);
                return (
                  <button
                    key={it.id}
                    type="button"
                    id={`admin-nav-${it.id}`}
                    className={`admin-nav-item ${activeTab === it.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(it.id)}
                    title={it.label}
                  >
                    <span className="admin-nav-item-icon">{ICONS[it.id]}</span>
                    <span className="admin-nav-label">{it.label}</span>
                    {badge !== undefined && <span className="admin-nav-badge">{badge}</span>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Gerçek sunucu telemetrisi */}
      <div className="admin-cockpit-widget">
        <div className="admin-cockpit-header">
          <span>Sunucu Telemetrisi</span>
          <span style={{ color: health?.ok ? '#10b981' : '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span className="admin-status-dot" style={{ width: '6px', height: '6px', background: health?.ok ? undefined : '#f59e0b' }} />
            {health ? (health.ok ? 'Canlı' : 'Kesildi') : 'Ölçülüyor'}
          </span>
        </div>

        <div className="admin-cockpit-bar-row">
          <div className="admin-cockpit-bar-meta">
            <span>CPU</span>
            <span style={{ color: 'var(--admin-accent-cyan)' }}>{health ? `${cpu}%` : '—'}</span>
          </div>
          <div className="admin-cockpit-bar-track">
            <div className="admin-cockpit-bar-fill" style={{ width: `${cpu}%`, background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' }} />
          </div>
        </div>

        <div className="admin-cockpit-bar-row">
          <div className="admin-cockpit-bar-meta">
            <span>RAM</span>
            <span style={{ color: 'var(--admin-accent-purple)' }}>
              {health ? `${ram}% · ${(health.memUsedMb / 1024).toFixed(1)}/${(health.memTotalMb / 1024).toFixed(0)} GB` : '—'}
            </span>
          </div>
          <div className="admin-cockpit-bar-track">
            <div className="admin-cockpit-bar-fill" style={{ width: `${ram}%`, background: 'linear-gradient(90deg, #0878FF, #00D2FF)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--admin-text-dim)' }}>
            <span>API Gecikmesi</span>
            <span style={{ color: '#10b981' }}>
              {health ? `${health.latencyMs} ms` : '—'}
              {health ? ` · çalışma ${formatUptime(health.uptimeSec)}` : ''}
            </span>
          </div>
          <div className="admin-oscilloscope" aria-hidden="true">
            {bars.map((h, i) => (
              <span key={i} className="admin-osc-bar live" style={{ height: `${h || 2}px`, opacity: h ? 0.9 : 0.2 }} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Profile & Exit */}
      <div className="admin-sidebar-footer">
        <div className="admin-staff-profile-card">
          <div className="admin-avatar-container">
            <div className="admin-avatar-reticle" aria-hidden="true" />
            <img src={currentStaff.avatarUrl} alt={currentStaff.username} className="admin-staff-avatar" />
          </div>
          <div className="admin-staff-meta">
            <span className="admin-staff-name">{currentStaff.username}</span>
            <span className="admin-staff-role">
              <span className={`role-badge ${currentStaff.role.toLowerCase()}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <RoleSymbol role={currentStaff.role} size={11} />
                <span>{currentStaff.role}</span>
              </span>
            </span>
          </div>
        </div>

        <button
          type="button"
          className="admin-back-btn"
          onClick={logout}
          title="Panel oturumunu sonlandır ve çıkış yap"
          style={{ borderColor: 'rgba(239, 68, 68, 0.25)', color: '#fca5a5', background: 'rgba(239, 68, 68, 0.05)' }}
        >
          <IconLogOut size={14} />
          <span className="admin-nav-label">Oturumu Kapat</span>
        </button>

        <Link href="/" className="admin-back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="admin-nav-label">Siteye Geri Dön</span>
        </Link>
      </div>
    </aside>
  );
}
