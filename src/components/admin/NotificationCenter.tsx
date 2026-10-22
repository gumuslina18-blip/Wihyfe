'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { IconBell, IconCart, IconUser, IconKey, IconShield, IconActivity, IconCheck } from './AdminIcons';

const KIND_META: Record<string, { color: string; Icon: React.ComponentType<any> }> = {
  order: { color: '#0878FF', Icon: IconCart },
  user: { color: '#38bdf8', Icon: IconUser },
  pin: { color: '#34d399', Icon: IconKey },
  security: { color: '#f87171', Icon: IconShield },
  system: { color: '#fbbf24', Icon: IconActivity },
};

export default function NotificationCenter() {
  const { notifications, unreadCount, markAllNotificationsRead, clearNotifications, setActiveTab, canAccess } = useAdmin();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const goTo = (kind: string) => {
    const tab = kind === 'order' ? 'orders' : kind === 'user' ? 'users' : kind === 'pin' ? 'pins' : kind === 'security' ? 'security' : 'system';
    if (canAccess(tab)) setActiveTab(tab);
    setOpen(false);
  };

  return (
    <div className="admin-notif-wrap" ref={ref}>
      <button
        type="button"
        id="admin-notif-btn"
        className="admin-icon-btn"
        title="Bildirimler"
        aria-label="Bildirimler"
        onClick={() => {
          setOpen((o) => !o);
        }}
      >
        <IconBell size={16} />
        {unreadCount > 0 && <span className="admin-notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="admin-notif-panel" role="dialog" aria-label="Bildirim merkezi">
          <div className="admin-notif-head">
            <strong>Bildirim Merkezi</strong>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button type="button" className="admin-action-btn" onClick={markAllNotificationsRead} disabled={unreadCount === 0}>
                <IconCheck size={11} /> Okundu
              </button>
              <button type="button" className="admin-action-btn danger" onClick={clearNotifications} disabled={notifications.length === 0}>
                Temizle
              </button>
            </div>
          </div>

          <div className="admin-notif-list">
            {notifications.length === 0 ? (
              <div className="admin-notif-empty">
                Henüz bildirim yok. Yeni sipariş, PIN kullanımı, yeni kullanıcı ve kısıtlama olayları gerçekleştiğinde burada görünür.
              </div>
            ) : (
              notifications.map((n) => {
                const meta = KIND_META[n.kind] || KIND_META.system;
                return (
                  <button type="button" key={n.id} className={`admin-notif-item ${n.read ? '' : 'unread'}`} onClick={() => goTo(n.kind)}>
                    <span className="admin-notif-icon" style={{ color: meta.color, borderColor: `${meta.color}55` }}>
                      <meta.Icon size={14} />
                    </span>
                    <span className="admin-notif-body">
                      <span className="admin-notif-title">{n.title}</span>
                      <span className="admin-notif-msg">{n.message}</span>
                      <span className="admin-notif-time">{n.at}</span>
                    </span>
                    {!n.read && <span className="admin-notif-dot" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
