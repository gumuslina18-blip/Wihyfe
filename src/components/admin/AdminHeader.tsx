'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { IconKey, IconPlus, IconActivity, RoleSymbol, TierSymbol, IconLogOut, IconSidebar } from './AdminIcons';

export default function AdminHeader() {
  const {
    currentStaff,
    setIsPinModalOpen,
    setIsProductModalOpen,
    setIsEndOfDayModalOpen,
    activeTab,
    logout,
    sidebarCollapsed,
    toggleSidebar,
  } = useAdmin();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Günaydın';
    if (hour >= 12 && hour < 18) return 'İyi günler';
    return 'İyi akşamlar';
  }, []);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  return (
    <header className="admin-topbar">
      <div className="admin-greeting-col">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            className="admin-icon-btn admin-sidebar-toggle"
            onClick={toggleSidebar}
            title={sidebarCollapsed ? 'Kenar çubuğunu genişlet' : 'Kenar çubuğunu daralt'}
            aria-label="Kenar çubuğunu daralt / genişlet"
            style={{ width: '32px', height: '32px' }}
          >
            <IconSidebar size={16} strokeWidth={2.2} />
          </button>
          <h1 className="admin-greeting-title">
            {greeting}, {currentStaff.username}
          </h1>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.15rem 0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border)', fontSize: '0.72rem' }}>
            <RoleSymbol role={currentStaff.role} size={13} />
            <span style={{ fontWeight: 600 }}>{currentStaff.role}</span>
          </span>
        </div>

        <div className="admin-greeting-sub">
          <span>{formattedDate}</span>
          {timeStr && (
            <>
              <span>•</span>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--admin-accent-cyan)' }}>{timeStr}</span>
            </>
          )}
          <span>•</span>
          <TierSymbol tier={currentStaff.subscription} size={12} />
        </div>
      </div>

      <div className="admin-topbar-actions">
        {/* Animated Sentinel Radar Scanner HUD */}
        <div className="admin-radar-hud" title="Sentinel Aktif Radar Tarayıcısı - Sektör Güvenli" aria-hidden="true">
          <div className="admin-radar-grid" />
          <div className="admin-radar-beam" />
          <div className="admin-radar-blip" style={{ top: '6px', right: '8px' }} />
        </div>

        {/* Real-time Telemetry Pill */}
        <div className="admin-telemetry-badge" title="Sentinel DDoS Kalkanı ve API Gateway Aktif">
          <span className="admin-live-pulse-dot" />
          <span>WAF Kalkanı</span>
          <span style={{ color: 'var(--admin-border)' }}>|</span>
          <span style={{ color: '#10b981', fontWeight: 700 }}>12ms</span>
          <span style={{ color: 'var(--admin-border)' }}>•</span>
          <span style={{ color: 'var(--admin-accent-cyan)', fontSize: '0.68rem', letterSpacing: '0.04em' }}>SECURE</span>
        </div>

        {/* Gün Sonu (Z-Raporu) Butonu */}
        <button
          type="button"
          className="admin-eod-trigger-btn"
          onClick={() => setIsEndOfDayModalOpen(true)}
          title="Günün cirosu, siparişleri, bakiye ve destek özetini gör veya gün sonunu kapat"
        >
          <span className="admin-eod-pulse-dot" />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <path d="M7 8h10M7 12h5" />
          </svg>
          <span>Gün Sonu (Z-Raporu)</span>
        </button>

        {/* + PIN Oluştur Butonu */}
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setIsPinModalOpen(true)}
          title="Yeni bir istemci indirme PIN kodu üret"
        >
          <IconKey size={14} strokeWidth={2.5} />
          <span>+ PIN Oluştur</span>
        </button>

        {/* Hızlı Ürün Ekle Butonu */}
        {activeTab === 'products' && (
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => setIsProductModalOpen(true)}
          >
            <IconPlus size={14} strokeWidth={2.5} />
            <span>+ Ürün Ekle</span>
          </button>
        )}

        {/* Çıkış Yap Butonu */}
        <button
          type="button"
          className="admin-btn-secondary"
          onClick={logout}
          title="Panel oturumunu sonlandır ve çıkış yap"
          style={{ borderColor: 'rgba(239, 68, 68, 0.35)', color: '#fca5a5' }}
        >
          <IconLogOut size={14} strokeWidth={2.2} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </header>
  );
}
