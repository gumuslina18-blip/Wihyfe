'use client';

import React from 'react';
import { useAdmin } from '@/context/AdminContext';

// Sidebar & Header
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

// Views
import OverviewView from './views/OverviewView';
import AnalyticsView from './views/AnalyticsView';
import ProductsView from './views/ProductsView';
import OrdersView from './views/OrdersView';
import UsersView from './views/UsersView';
import SecurityView from './views/SecurityView';
import PinManagerView from './views/PinManagerView';
import FinanceView from './views/FinanceView';
import SystemView from './views/SystemView';
import AuditLogView from './views/AuditLogView';
import PermissionsView from './views/PermissionsView';
import TicketsView from './views/TicketsView';
import CommandPalette from './CommandPalette';

// Modals
import CreatePinModal from './modals/CreatePinModal';
import ProductModal from './modals/ProductModal';
import UserRoleModal from './modals/UserRoleModal';
import AddUserModal from './modals/AddUserModal';
import BalanceModal from './modals/BalanceModal';
import SecurityBanModal from './modals/SecurityBanModal';
import OrderDetailsModal from './modals/OrderDetailsModal';
import EndOfDayModal from './modals/EndOfDayModal';
import AdminLogin from './AdminLogin';
import { IconCheck, IconX, IconAlertTriangle, IconLock, IconEye } from './AdminIcons';

export default function AdminDashboard() {
  const {
    activeTab,
    toasts,
    removeToast,
    theme,
    sidebarCollapsed,
    canAccess,
    viewAsRole,
    setViewAsRole,
    isAuthenticated,
  } = useAdmin();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className={`admin-shell ${theme === 'light' ? 'theme-light' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* High-Tech Animated Cyber Atmosphere & Mesh */}
      <div className="admin-cyber-mesh" aria-hidden="true" />
      <div className="admin-hud-scanline" aria-hidden="true" />
      <div className="admin-cyber-glow-top" aria-hidden="true" />
      <div className="admin-cyber-glow-bottom" aria-hidden="true" />

      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Main View Area */}
      <main className="admin-main">
        {/* Top Greeting & Action Header */}
        <AdminHeader />

        {/* Rol önizleme şeridi */}
        {viewAsRole && (
          <div className="admin-preview-banner">
            <IconEye size={14} />
            <span>
              Önizleme modu: Panel <strong>{viewAsRole}</strong> rolünün yetkileriyle görüntüleniyor.
            </span>
            <button type="button" className="admin-action-btn" onClick={() => setViewAsRole(null)}>
              Önizlemeden Çık
            </button>
          </div>
        )}

        {/* Dynamic Views (yetki kontrolüyle) */}
        {!canAccess(activeTab) ? (
          <div className="admin-view-body">
            <div className="admin-card" style={{ alignItems: 'center', textAlign: 'center', padding: '3rem 1.5rem' }}>
              <IconLock size={34} color="#f87171" />
              <h2 className="admin-card-title" style={{ justifyContent: 'center' }}>Bu sayfaya erişim yetkiniz yok</h2>
              <span className="admin-card-desc">Rolünüz bu bölümü görüntülemek için yetkilendirilmemiş. Yetki matrisini Owner düzenleyebilir.</span>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'products' && <ProductsView />}
            {activeTab === 'orders' && <OrdersView />}
            {activeTab === 'tickets' && <TicketsView />}
            {activeTab === 'users' && <UsersView />}
            {activeTab === 'security' && <SecurityView />}
            {activeTab === 'pins' && <PinManagerView />}
            {activeTab === 'finance' && <FinanceView />}
            {activeTab === 'audit' && <AuditLogView />}
            {activeTab === 'permissions' && <PermissionsView />}
            {activeTab === 'system' && <SystemView />}
          </>
        )}
      </main>

      <CommandPalette />

      {/* Interactive Modals */}
      <CreatePinModal />
      <ProductModal />
      <UserRoleModal />
      <AddUserModal />
      <BalanceModal />
      <SecurityBanModal />
      <OrderDetailsModal />
      <EndOfDayModal />

      {/* Live Toast Notifications */}
      <div className="admin-toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`admin-toast ${t.type}`}
            onClick={() => removeToast(t.id)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              {t.type === 'success' && <IconCheck size={14} color="#10b981" />}
              {t.type === 'error' && <IconX size={14} color="#ef4444" />}
              {t.type === 'info' && <IconAlertTriangle size={14} color="#3b82f6" />}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
