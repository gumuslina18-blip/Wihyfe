'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { SITE_CONFIG } from '@/config/site';
import { AdminTicket } from '@/config/admin';
import AccountSettingsModal from './AccountSettingsModal';
import SubscriptionPlansModal from './SubscriptionPlansModal';
import ReceiptModal, { ReceiptData } from './ReceiptModal';

interface ProfileMenuProps {
  hideTriggerWhenLoggedOut?: boolean;
}

export default function ProfileMenu({ hideTriggerWhenLoggedOut = false }: ProfileMenuProps) {
  const {
    user,
    isLoggedIn,
    loginWithDiscord,
    logout,
    orders,
    deleteOrder,
    clearOrders,
    isLoginModalOpen,
    setIsLoginModalOpen,
    balanceFormatted,
    setIsDepositModalOpen,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'servers' | 'orders' | 'tickets' | 'referrals' | null>(null);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [accountSettingsTab, setAccountSettingsTab] = useState<'profile' | 'integrations' | 'subscription'>('profile');
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // E-Receipt / Invoice Modal State
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<ReceiptData | null>(null);

  // Referral / Invite & Earn System State
  const [referralData, setReferralData] = useState<{
    code: string;
    link: string;
    referredUsersCount: number;
    totalEarned: number;
    commissionRate: number;
    history: Array<{ id: string; date: string; userName: string; commissionAmount: number; orderAmount: number }>;
  } | null>(null);
  const [isCopiedRef, setIsCopiedRef] = useState(false);
  const [isLoadingRef, setIsLoadingRef] = useState(false);

  const fetchReferralData = useCallback(async () => {
    if (!user?.id && !user?.username) return;
    setIsLoadingRef(true);
    try {
      const res = await fetch(`/api/referral?userId=${user?.id || user?.username}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.referral) {
          setReferralData(data.referral);
        }
      }
    } catch (e) {
      console.error('Failed to load referral stats:', e);
    } finally {
      setIsLoadingRef(false);
    }
  }, [user?.id, user?.username]);

  useEffect(() => {
    if (activeModalTab === 'referrals') {
      fetchReferralData();
    }
  }, [activeModalTab, fetchReferralData]);

  // On-Site Support Tickets State
  const [userTickets, setUserTickets] = useState<AdminTicket[]>([]);
  const [selectedUserTicketId, setSelectedUserTicketId] = useState<string | null>(null);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'Beklemede' | 'İşlemde' | 'Tamamlandı' | 'İptal Edildi'>('all');

  // Delivery status normalizer for orders
  const getOrderDeliveryStatus = useCallback((order: any): 'Beklemede' | 'İşlemde' | 'Tamamlandı' | 'İptal Edildi' => {
    const raw = String(order?.deliveryStatus || order?.status || 'Beklemede').trim().toLowerCase();
    if (raw.includes('işlem') || raw.includes('islem') || raw.includes('progress')) {
      return 'İşlemde';
    }
    if (raw.includes('tamam') || raw.includes('aktif') || raw.includes('onay') || raw.includes('active')) {
      return 'Tamamlandı';
    }
    if (raw.includes('iptal') || raw.includes('cancel')) {
      return 'İptal Edildi';
    }
    return 'Beklemede';
  }, []);

  const filteredClientOrders = useMemo(() => {
    if (orderStatusFilter === 'all') return orders;
    return orders.filter((o) => getOrderDeliveryStatus(o) === orderStatusFilter);
  }, [orders, orderStatusFilter, getOrderDeliveryStatus]);

  // New Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<AdminTicket['category']>('Kurulum Destek');
  const [ticketPriority, setTicketPriority] = useState<AdminTicket['priority']>('medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketFeedback, setTicketFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Thread Reply State
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const ticketThreadEndRef = useRef<HTMLDivElement>(null);

  // Fetch User Tickets
  const fetchUserTickets = useCallback(async () => {
    try {
      const qParams = new URLSearchParams();
      if (user?.id) qParams.append('userId', user.id);
      if (user?.username) qParams.append('userName', user.username);

      const res = await fetch(`/api/tickets?${qParams.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.tickets)) {
          setUserTickets(data.tickets);
        }
      }
    } catch (e) {
      console.error('Failed to fetch user tickets:', e);
    }
  }, [user?.id, user?.username]);

  // Background polling for live support ticket notifications
  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;
    fetchUserTickets();
    const interval = setInterval(fetchUserTickets, 10000);
    return () => clearInterval(interval);
  }, [isLoggedIn, user?.id, fetchUserTickets]);

  // Read status tracker
  const [readTicketsMap, setReadTicketsMap] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wisp_read_tickets');
        return stored ? JSON.parse(stored) : {};
      } catch {}
    }
    return {};
  });

  const markTicketAsRead = useCallback((ticketId: string) => {
    const ticket = userTickets.find((t) => t.id === ticketId);
    if (!ticket) return;
    const msgs = ticket.messages || [];
    const lastMsg = msgs[msgs.length - 1];
    if (lastMsg) {
      setReadTicketsMap((prev) => {
        const updated = { ...prev, [ticketId]: lastMsg.timestamp };
        try {
          localStorage.setItem('wisp_read_tickets', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  }, [userTickets]);

  // When selected ticket changes, mark as read
  useEffect(() => {
    if (selectedUserTicketId) {
      markTicketAsRead(selectedUserTicketId);
    }
  }, [selectedUserTicketId, markTicketAsRead]);

  // Total unread staff replies count
  const unreadTicketCount = useMemo(() => {
    if (!userTickets || userTickets.length === 0) return 0;
    let count = 0;
    userTickets.forEach((ticket) => {
      if (ticket.status === 'closed') return;
      const msgs = ticket.messages || [];
      const lastMsg = msgs[msgs.length - 1];
      if (lastMsg && lastMsg.isStaff) {
        const lastRead = readTicketsMap[ticket.id];
        if (!lastRead || lastRead !== lastMsg.timestamp) {
          count++;
        }
      }
    });
    return count;
  }, [userTickets, readTicketsMap]);

  // Sync tickets whenever tickets tab is opened
  useEffect(() => {
    if (activeModalTab === 'tickets') {
      fetchUserTickets();
      const interval = setInterval(fetchUserTickets, 5000);
      return () => clearInterval(interval);
    }
  }, [activeModalTab, fetchUserTickets]);

  // Scroll to bottom of thread when selected ticket or userTickets update
  useEffect(() => {
    if (selectedUserTicketId && ticketThreadEndRef.current) {
      ticketThreadEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedUserTicketId, userTickets]);

  // Selected Ticket computation
  const selectedUserTicket = useMemo(() => {
    return userTickets.find((t) => t.id === selectedUserTicketId) || null;
  }, [userTickets, selectedUserTicketId]);

  // Filtered Client Tickets
  const filteredClientTickets = useMemo(() => {
    if (ticketStatusFilter === 'open') {
      return userTickets.filter((t) => t.status === 'open' || t.status === 'in_progress');
    }
    if (ticketStatusFilter === 'resolved') {
      return userTickets.filter((t) => t.status === 'resolved' || t.status === 'closed');
    }
    return userTickets;
  }, [userTickets, ticketStatusFilter]);

  // Handle Create Ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      setTicketFeedback({ type: 'error', text: 'Lütfen konu başlığı ve mesajınızı eksiksiz doldurunuz.' });
      return;
    }
    setIsSubmittingTicket(true);
    setTicketFeedback(null);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: ticketSubject.trim(),
          category: ticketCategory,
          priority: ticketPriority,
          message: ticketMessage.trim(),
          customerName: user?.username || 'Kullanıcı',
          customerDiscordId: user?.id || '',
          customerEmail: user?.email || '',
        }),
      });
      const data = await res.json();
      if (data.success && data.ticket) {
        setUserTickets((prev) => [data.ticket, ...prev]);
        setSelectedUserTicketId(data.ticket.id);
        setIsCreatingTicket(false);
        setTicketSubject('');
        setTicketMessage('');
      } else {
        setTicketFeedback({ type: 'error', text: data.error || 'Talep oluşturulurken bir hata oluştu.' });
      }
    } catch (e: any) {
      setTicketFeedback({ type: 'error', text: 'Bağlantı hatası: ' + (e.message || 'Lütfen tekrar deneyiniz.') });
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  // Handle Reply Ticket
  const handleReplyTicket = async (ticketId: string) => {
    if (!ticketReplyText.trim() || isSubmittingReply) return;
    setIsSubmittingReply(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          action: 'reply',
          text: ticketReplyText.trim(),
          sender: user?.username || 'Kullanıcı',
          isStaff: false,
        }),
      });
      const data = await res.json();
      if (data.success && data.ticket) {
        setUserTickets((prev) => prev.map((t) => (t.id === ticketId ? data.ticket : t)));
        setTicketReplyText('');
      }
    } catch (e) {
      console.error('Failed to reply ticket:', e);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Handle Resolve Ticket
  const handleResolveTicket = async (ticketId: string) => {
    try {
      const res = await fetch('/api/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          action: 'status',
          status: 'resolved',
          staffName: user?.username || 'Kullanıcı',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUserTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status: 'resolved' } : t)));
      }
    } catch (e) {
      console.error('Failed to resolve ticket:', e);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="profile-menu-container" ref={dropdownRef}>
      {/* If NOT logged in */}
      {!isLoggedIn && !hideTriggerWhenLoggedOut && (
        <button
          type="button"
          className="header-profile-btn"
          onClick={() => setIsLoginModalOpen(true)}
          aria-label="Discord ile Giriş Yap"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          <span className="profile-btn-text">Giriş Yap</span>
        </button>
      )}

      {/* If logged in */}
      {isLoggedIn && (
        <div className="header-user-wrapper">
          <button
            type="button"
            className="header-user-trigger"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-label="Kullanıcı Menüsü"
          >
            <div className="user-avatar-box">
              {user?.avatarUrl && !user.avatarUrl.includes('spark-icon') && !user.avatarUrl.includes('wisp-icon') && !user.avatarUrl.includes('wihyfe-icon') ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="user-avatar-img"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="user-avatar-initial">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'W'}
                </span>
              )}
              <span className="user-status-online" title="Çevrimiçi"></span>
            </div>
            <span className="user-trigger-name">{user?.username}</span>
            {unreadTicketCount > 0 && (
              <span className="user-ticket-badge-pill" title={`${unreadTicketCount} yeni yetkili yanıtı!`}>
                {unreadTicketCount}
              </span>
            )}
            <svg
              className={`user-chevron ${isDropdownOpen ? 'rotate' : ''}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen && (
            <div className="profile-dropdown-card">
              <div
                className="dropdown-user-header"
                style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                onClick={() => {
                  setAccountSettingsTab('profile');
                  setIsAccountSettingsOpen(true);
                  setIsDropdownOpen(false);
                }}
                title="Hesap Ayarlarını Düzenle"
              >
                <div className="dropdown-user-avatar">
                  {user?.avatarUrl && !user.avatarUrl.includes('spark-icon') && !user.avatarUrl.includes('wisp-icon') && !user.avatarUrl.includes('wihyfe-icon') ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="user-avatar-img"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{user?.username ? user.username.charAt(0).toUpperCase() : 'W'}</span>
                  )}
                </div>
                <div className="dropdown-user-info">
                  <div className="dropdown-user-name">
                    {user?.username}
                    <span className="dropdown-user-tag">{user?.discriminator}</span>
                  </div>
                  <div className="dropdown-user-email">{user?.email}</div>
                </div>
                <div style={{ marginLeft: 'auto', color: 'var(--accent)', opacity: 0.85 }} title="Hesap Ayarları">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
              </div>

              <div className="dropdown-user-stats">
                <div className="stat-pill">
                  <span className="stat-num">{user?.serversCount ?? 0}</span>
                  <span className="stat-lbl">Sunucu</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-num">{user?.activeBotsCount ?? 0}</span>
                  <span className="stat-lbl">Aktif Bot</span>
                </div>
              </div>

              {/* Balance Box */}
              <div className="dropdown-balance-card">
                <div className="dropdown-balance-meta">
                  <span className="dropdown-balance-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px', color: 'var(--accent)' }}>
                      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                      <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
                      <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                    </svg>
                    Mevcut Bakiye
                  </span>
                  <span className="dropdown-balance-amount">{balanceFormatted}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-xs btn-primary dropdown-deposit-btn"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsDepositModalOpen(true);
                  }}
                >
                  <span>+ Yükle</span>
                </button>
              </div>

              <div className="dropdown-menu-list">
                <button
                  type="button"
                  className="dropdown-menu-item dropdown-account-item"
                  onClick={() => {
                    setAccountSettingsTab('profile');
                    setIsAccountSettingsOpen(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Hesap Ayarları</span>
                  <span className="dropdown-panel-badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>Profil</span>
                </button>

                <button
                  type="button"
                  className="dropdown-menu-item dropdown-plans-item"
                  onClick={() => {
                    setIsPlansModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>Planlar &amp; Abonelik</span>
                  <span
                    className="dropdown-panel-badge"
                    style={{
                      background: user?.tier && user.tier !== 'Free' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                      color: user?.tier && user.tier !== 'Free' ? '#34d399' : '#c4b5fd',
                    }}
                  >
                    {user?.tier && user.tier !== 'Free' ? user.tier : 'Yükselt'}
                  </span>
                </button>

                <Link
                  href="/panel"
                  className="dropdown-menu-item dropdown-customer-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span>Müşteri Paneli</span>
                </Link>

                <button
                  type="button"
                  className="dropdown-menu-item"
                  onClick={() => {
                    setActiveModalTab('servers');
                    setIsDropdownOpen(false);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                  </svg>
                  <span>Sunucularım</span>
                </button>

                <button
                  type="button"
                  className="dropdown-menu-item"
                  onClick={() => {
                    setActiveModalTab('orders');
                    setIsDropdownOpen(false);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <span>Sipariş & Lisans Geçmişim</span>
                </button>

                <button
                  type="button"
                  className="dropdown-menu-item"
                  onClick={() => {
                    setActiveModalTab('tickets');
                    setIsDropdownOpen(false);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Destek Taleplerim (Ticket)</span>
                  {unreadTicketCount > 0 ? (
                    <span className="dropdown-panel-badge is-unread-badge">
                      {unreadTicketCount} Yeni Yanıt
                    </span>
                  ) : (
                    <span className="dropdown-panel-badge">{userTickets.length}</span>
                  )}
                </button>

                <button
                  type="button"
                  className="dropdown-menu-item"
                  onClick={() => {
                    setActiveModalTab('referrals');
                    setIsDropdownOpen(false);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  <span>Davet Et &amp; Kazan (Referans)</span>
                  <span className="dropdown-panel-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                    %10 Komisyon
                  </span>
                </button>

                <a
                  href={SITE_CONFIG.brand.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dropdown-menu-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Discord Sunucumuz</span>
                </a>

                <Link
                  href="/admin"
                  className="dropdown-menu-item dropdown-admin-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Yetkili Paneli</span>
                  <span className="dropdown-admin-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>Admin</span>
                </Link>
              </div>

              <div className="dropdown-footer">
                <button
                  type="button"
                  className="dropdown-logout-btn"
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL FOR SERVERS / ORDERS / TICKETS */}
      {mounted && activeModalTab && createPortal(
        <div className="checkout-overlay" onClick={() => setActiveModalTab(null)}>
          <div className={`checkout-modal profile-info-modal ${activeModalTab === 'tickets' ? 'ticket-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="checkout-header">
              <div className="checkout-header-left">
                <h3 className="checkout-title">
                  {activeModalTab === 'servers' && 'Sunucularım'}
                  {activeModalTab === 'orders' && 'Sipariş ve Lisans Geçmişi'}
                  {activeModalTab === 'tickets' && 'Destek Taleplerim (Ticket)'}
                  {activeModalTab === 'referrals' && 'Davet Et & Kazan (Referans Ortaklığı)'}
                </h3>
              </div>
              <button
                type="button"
                className="cart-close-btn"
                onClick={() => setActiveModalTab(null)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="profile-modal-body">
              {activeModalTab === 'servers' && (
                user?.guilds && user.guilds.length > 0 ? (
                  <div className="panel-list">
                    <div className="panel-intro-note">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                      </svg>
                      <span>Yönetici olduğunuz {user.serversCount} Discord sunucusu listeleniyor.</span>
                    </div>
                    {user.guilds.map((guild) => (
                      <div className="panel-item-card" key={guild.id}>
                        <div className="panel-item-header">
                          <div className="panel-item-title-wrap">
                            {guild.icon ? (
                              <img src={guild.icon} alt={guild.name} className="server-avatar-img" />
                            ) : (
                              <span className="server-avatar-badge">{guild.name.charAt(0).toUpperCase()}</span>
                            )}
                            <div>
                              <h4 className="panel-item-title">{guild.name}</h4>
                              <span className="panel-item-id">ID: {guild.id}</span>
                            </div>
                          </div>
                          <span className={`server-role-badge ${guild.owner ? 'is-owner' : 'is-admin'}`}>
                            {guild.owner ? '👑 Sunucu Sahibi' : '🛡️ Yönetici'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-panel-state">
                    <div className="empty-panel-icon">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                        <line x1="6" y1="6" x2="6.01" y2="6" />
                        <line x1="6" y1="18" x2="6.01" y2="18" />
                      </svg>
                    </div>
                    <h4 className="empty-panel-title">Sunucu Bulunamadı</h4>
                    <p className="empty-panel-desc">
                      Discord hesabınızda yönetici yetkisine sahip olduğunuz bir sunucu bulunamadı.
                    </p>
                  </div>
                )
              )}

              {activeModalTab === 'orders' && (
                orders.length === 0 ? (
                  <div className="empty-panel-state">
                    <div className="empty-panel-icon">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    </div>
                    <h4 className="empty-panel-title">Kayıtlı Siparişiniz Bulunmuyor</h4>
                    <p className="empty-panel-desc">
                      Satın aldığınız tüm paket ve bot lisansları, faturalarınız ile birlikte burada listelenecektir.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setActiveModalTab(null);
                        const el = document.getElementById('paketler');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <span>Paketleri İncele</span>
                    </button>
                  </div>
                ) : (
                  <div className="panel-list">
                    <div className="panel-list-header-row" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                      <div className="client-ticket-tabs" style={{ margin: 0 }}>
                        <button
                          type="button"
                          className={`client-ticket-tab-btn ${orderStatusFilter === 'all' ? 'active' : ''}`}
                          onClick={() => setOrderStatusFilter('all')}
                        >
                          Tümü ({orders.length})
                        </button>
                        <button
                          type="button"
                          className={`client-ticket-tab-btn ${orderStatusFilter === 'Beklemede' ? 'active' : ''}`}
                          onClick={() => setOrderStatusFilter('Beklemede')}
                        >
                          ⏳ Beklemede ({orders.filter((o) => getOrderDeliveryStatus(o) === 'Beklemede').length})
                        </button>
                        <button
                          type="button"
                          className={`client-ticket-tab-btn ${orderStatusFilter === 'İşlemde' ? 'active' : ''}`}
                          onClick={() => setOrderStatusFilter('İşlemde')}
                        >
                          ⚡ İşlemde ({orders.filter((o) => getOrderDeliveryStatus(o) === 'İşlemde').length})
                        </button>
                        <button
                          type="button"
                          className={`client-ticket-tab-btn ${orderStatusFilter === 'Tamamlandı' ? 'active' : ''}`}
                          onClick={() => setOrderStatusFilter('Tamamlandı')}
                        >
                          ✓ Tamamlandı ({orders.filter((o) => getOrderDeliveryStatus(o) === 'Tamamlandı').length})
                        </button>
                        <button
                          type="button"
                          className={`client-ticket-tab-btn ${orderStatusFilter === 'İptal Edildi' ? 'active' : ''}`}
                          onClick={() => setOrderStatusFilter('İptal Edildi')}
                        >
                          ✕ İptal ({orders.filter((o) => getOrderDeliveryStatus(o) === 'İptal Edildi').length})
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={clearOrders}
                        className="panel-clear-history-btn"
                        title="Tüm sipariş geçmişini temizle"
                        style={{ marginLeft: 'auto' }}
                      >
                        Geçmişi Temizle
                      </button>
                    </div>

                    {filteredClientOrders.length === 0 ? (
                      <div className="client-ticket-empty-box" style={{ padding: '2rem 1rem' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Bu teslimat durumuna ait bir sipariş bulunamadı.</p>
                      </div>
                    ) : (
                      filteredClientOrders.map((order) => {
                        const matchedGuild = user?.guilds?.find((g) => g.id === order.serverId);
                        const serverDisplayName = matchedGuild ? matchedGuild.name : (order.serverName || order.serverId);
                        const delivery = getOrderDeliveryStatus(order);
                        const deliverySlug = delivery === 'Beklemede' ? 'beklemede' : delivery === 'İşlemde' ? 'islemde' : delivery === 'Tamamlandı' ? 'tamamlandi' : 'iptal-edildi';
                        const isPending = delivery === 'Beklemede';
                        const isCancelled = delivery === 'İptal Edildi';

                        return (
                          <div className={`panel-item-card order-card-delivery is-delivery-${deliverySlug}`} key={order.orderId}>
                            <div className="panel-item-header">
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  <h4 className="panel-item-title">Sipariş #{order.orderId}</h4>
                                  <span className={`order-delivery-badge is-${deliverySlug}`}>
                                    {delivery === 'Beklemede' && '⏳ Beklemede'}
                                    {delivery === 'İşlemde' && '⚡ İşlemde (Hazırlanıyor)'}
                                    {delivery === 'Tamamlandı' && '✓ Tamamlandı (Teslim Edildi)'}
                                    {delivery === 'İptal Edildi' && '✕ İptal Edildi'}
                                  </span>
                                </div>
                                <span className="panel-item-id" style={{ marginTop: '0.2rem', display: 'block' }}>
                                  Tarih: {order.date} • Sunucu: <strong style={{ color: 'var(--text-secondary)' }}>{serverDisplayName}</strong>
                                </span>
                              </div>

                              <button
                                type="button"
                                className="panel-order-delete-btn"
                                onClick={() => deleteOrder(order.orderId)}
                                title="Siparişi Geçmişten Sil"
                                aria-label="Siparişi Sil"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>

                            {/* Delivery Progress Stepper */}
                            <div className="order-delivery-stepper-wrap">
                              <div className="order-delivery-stepper">
                                <div className={`delivery-step-item ${delivery === 'Beklemede' ? 'is-pending' : delivery === 'İşlemde' || delivery === 'Tamamlandı' ? 'is-done' : ''}`}>
                                  <div className="delivery-step-circle">1</div>
                                  <span className="delivery-step-label">Beklemede</span>
                                </div>
                                <div className={`delivery-step-bar ${delivery === 'İşlemde' || delivery === 'Tamamlandı' ? 'is-active' : ''}`} />
                                <div className={`delivery-step-item ${delivery === 'İşlemde' ? 'is-current' : delivery === 'Tamamlandı' ? 'is-done' : ''}`}>
                                  <div className="delivery-step-circle">2</div>
                                  <span className="delivery-step-label">İşlemde</span>
                                </div>
                                <div className={`delivery-step-bar ${delivery === 'Tamamlandı' ? 'is-active' : ''}`} />
                                <div className={`delivery-step-item ${delivery === 'Tamamlandı' ? 'is-done' : ''}`}>
                                  <div className="delivery-step-circle">3</div>
                                  <span className="delivery-step-label">Tamamlandı</span>
                                </div>
                              </div>

                              <div className="order-delivery-desc-text">
                                {delivery === 'Beklemede' && (
                                  <span>⏳ <strong>Siparişiniz Alındı:</strong> Yetkili ekibimiz siparişinizi onay ve hazırlık sırasına aldı.</span>
                                )}
                                {delivery === 'İşlemde' && (
                                  <span>⚡ <strong>Bot Kuruluyor:</strong> Bot altyapınız ve lisans anahtarlarınız Discord sunucunuza entegre ediliyor.</span>
                                )}
                                {delivery === 'Tamamlandı' && (
                                  <span>✓ <strong>Hizmet Teslim Edildi:</strong> Bot sunucunuzda aktif ve 7/24 kesintisiz çalışmaya hazır durumda.</span>
                                )}
                                {delivery === 'İptal Edildi' && (
                                  <span style={{ color: '#f87171' }}>✕ <strong>İptal Edildi:</strong> Bu sipariş iptal edilmiş veya iadesi yapılmıştır.</span>
                                )}
                                {order.notes && (
                                  <div style={{ marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.06)', color: '#38bdf8' }}>
                                    <strong>Yetkili Notu:</strong> {order.notes}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="panel-item-details-list">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="panel-item-details">
                                  <span>{item.name} ({item.periodLabel})</span>
                                  <strong className="text-accent">{item.price}</strong>
                                </div>
                              ))}
                            </div>

                            <div className="panel-item-total-row">
                              <span>Toplam Tutar:</span>
                              <strong>{order.totalFormatted} TL</strong>
                            </div>

                            <div className="panel-item-actions-row" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                              <button
                                type="button"
                                className="panel-order-receipt-btn"
                                onClick={() => {
                                  setSelectedReceiptOrder({
                                    orderId: order.orderId,
                                    date: order.date,
                                    customerName: user?.username || 'Değerli Müşterimiz',
                                    customerDiscordId: user?.id,
                                    customerEmail: user?.email,
                                    serverName: serverDisplayName,
                                    paymentMethod: order.paymentMethod,
                                    items: order.items.map((it) => ({
                                      name: it.name,
                                      periodLabel: it.periodLabel,
                                      price: it.price,
                                    })),
                                    totalFormatted: order.totalFormatted,
                                    deliveryStatus: delivery,
                                    notes: order.notes,
                                  });
                                }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                  <line x1="16" y1="13" x2="8" y2="13" />
                                  <line x1="16" y1="17" x2="8" y2="17" />
                                  <polyline points="10 9 9 9 8 9" />
                                </svg>
                                <span>📄 E-Dekont &amp; Fatura Yazdır</span>
                              </button>

                              {order.paytrUrl && isPending && (
                                <a
                                  href={order.paytrUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="panel-paytr-reopen-btn"
                                >
                                  <span>PayTR ile Öde / Faturayı Aç</span>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )
              )}

              {activeModalTab === 'tickets' && (
                <div className="client-tickets-container">
                  {/* Subview 1: CREATE TICKET FORM */}
                  {isCreatingTicket ? (
                    <form className="client-create-ticket-form" onSubmit={handleCreateTicket}>
                      <div className="client-thread-nav">
                        <button
                          type="button"
                          className="client-thread-back-btn"
                          onClick={() => {
                            setIsCreatingTicket(false);
                            setTicketFeedback(null);
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6" />
                          </svg>
                          <span>Taleplerime Dön</span>
                        </button>
                        <span className="client-ticket-id-tag">Yeni Destek Talebi</span>
                      </div>

                      <div className="client-form-field">
                        <label className="client-form-label">Destek Kategorisi</label>
                        <div className="client-pill-group">
                          {(['Kurulum Destek', 'Ödeme & Fatura', 'Özel Bot Talebi', 'Teknik Sorun'] as const).map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              className={`client-pill-btn ${ticketCategory === cat ? 'active' : ''}`}
                              onClick={() => setTicketCategory(cat)}
                            >
                              {cat === 'Kurulum Destek' && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                  </svg>
                                  <span>Kurulum Destek</span>
                                </span>
                              )}
                              {cat === 'Ödeme & Fatura' && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                    <line x1="1" y1="10" x2="23" y2="10" />
                                  </svg>
                                  <span>Ödeme &amp; Fatura</span>
                                </span>
                              )}
                              {cat === 'Özel Bot Talebi' && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="10" rx="2" />
                                    <circle cx="12" cy="5" r="2" />
                                    <path d="M12 7v4" />
                                    <line x1="8" y1="16" x2="8" y2="16" />
                                    <line x1="16" y1="16" x2="16" y2="16" />
                                  </svg>
                                  <span>Özel Bot Talebi</span>
                                </span>
                              )}
                              {cat === 'Teknik Sorun' && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                  </svg>
                                  <span>Teknik Sorun</span>
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="client-form-field">
                        <label className="client-form-label">Öncelik Derecesi</label>
                        <div className="client-pill-group">
                          {(['low', 'medium', 'high'] as const).map((p) => (
                            <button
                              key={p}
                              type="button"
                              className={`client-pill-btn ${ticketPriority === p ? 'active' : ''}`}
                              onClick={() => setTicketPriority(p)}
                            >
                              {p === 'low' && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8' }} />
                                  <span>Düşük</span>
                                </span>
                              )}
                              {p === 'medium' && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
                                  <span>Normal</span>
                                </span>
                              )}
                              {p === 'high' && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                  </svg>
                                  <span style={{ color: '#fca5a5' }}>Yüksek / Acil</span>
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="client-form-field">
                        <label className="client-form-label">Konu Başlığı</label>
                        <input
                          type="text"
                          className="client-form-input"
                          placeholder="Örn: Discord bot yetkilendirme ve rol dağıtımı"
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          required
                        />
                      </div>

                      <div className="client-form-field">
                        <label className="client-form-label">Detaylı Mesajınız</label>
                        <textarea
                          className="client-form-textarea"
                          placeholder="Lütfen sorununuzu, hata kodlarını veya talebinizi detaylı olarak açıklayınız..."
                          value={ticketMessage}
                          onChange={(e) => setTicketMessage(e.target.value)}
                          required
                        />
                      </div>

                      {ticketFeedback && (
                        <div
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            background: ticketFeedback.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            border: `1px solid ${ticketFeedback.type === 'error' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
                            color: ticketFeedback.type === 'error' ? '#f87171' : '#34d399',
                          }}
                        >
                          {ticketFeedback.text}
                        </div>
                      )}

                      <div className="client-form-actions">
                        <button
                          type="button"
                          className="client-thread-back-btn"
                          onClick={() => {
                            setIsCreatingTicket(false);
                            setTicketFeedback(null);
                          }}
                        >
                          Vazgeç
                        </button>
                        <button
                          type="submit"
                          className="client-new-ticket-btn"
                          disabled={isSubmittingTicket}
                        >
                          {isSubmittingTicket ? 'Oluşturuluyor...' : 'Talebi İlet'}
                        </button>
                      </div>
                    </form>
                  ) : selectedUserTicket ? (
                    /* Subview 2: TICKET CHAT THREAD */
                    <div className="client-thread-wrapper">
                      <div className="client-thread-nav">
                        <button
                          type="button"
                          className="client-thread-back-btn"
                          onClick={() => setSelectedUserTicketId(null)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6" />
                          </svg>
                          <span>Taleplerime Dön</span>
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span className="client-ticket-id-tag">#{selectedUserTicket.id}</span>
                          <span className={`client-ticket-status-pill ${selectedUserTicket.status}`}>
                            {selectedUserTicket.status === 'open' && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span>Yanıt Bekliyor</span>
                              </span>
                            )}
                            {selectedUserTicket.status === 'in_progress' && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>Yetkili Yanıtladı</span>
                              </span>
                            )}
                            {(selectedUserTicket.status === 'resolved' || selectedUserTicket.status === 'closed') && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Çözüldü</span>
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div style={{ padding: '0.65rem 0 0.4rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <h4 className="client-thread-header-title">{selectedUserTicket.subject}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.72rem', color: '#94a3b8' }}>
                          <span className="client-ticket-category-tag">{selectedUserTicket.category}</span>
                          <span>•</span>
                          <span>Oluşturulma: {selectedUserTicket.createdAt}</span>
                        </div>
                      </div>

                      <div className="client-thread-messages-box">
                        {selectedUserTicket.messages.map((m, idx) => (
                          <div
                            key={idx}
                            className={`client-msg-bubble-wrap ${m.isStaff ? 'from-staff' : 'from-user'}`}
                          >
                            <div className="client-msg-meta">
                              <span className="author-name">{m.sender}</span>
                              {m.isStaff && (
                                <span className="client-msg-staff-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                  </svg>
                                  <span>Yetkili Ekip</span>
                                </span>
                              )}
                              <span className="client-msg-timestamp">{m.timestamp}</span>
                            </div>
                            <div className="client-msg-bubble">
                              {m.text}
                            </div>
                          </div>
                        ))}
                        <div ref={ticketThreadEndRef} />
                      </div>

                      <div className="client-thread-reply-area">
                        {selectedUserTicket.status === 'resolved' && (
                          <div style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '8px',
                            background: 'rgba(16, 185, 129, 0.12)',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            color: '#6ee7b7',
                            fontSize: '0.74rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}>
                            <span>✓ Bu talep çözümlendi. Yeni bir mesaj göndererek talebi yeniden işleme açabilirsiniz.</span>
                          </div>
                        )}
                        <textarea
                          className="client-thread-reply-input"
                          placeholder="Mesajınızı veya cevabınızı buraya yazınız..."
                          value={ticketReplyText}
                          onChange={(e) => setTicketReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleReplyTicket(selectedUserTicket.id);
                            }
                          }}
                        />
                        <div className="client-thread-reply-bar-bottom">
                          {selectedUserTicket.status !== 'resolved' ? (
                            <button
                              type="button"
                              className="client-thread-resolve-btn"
                              onClick={() => handleResolveTicket(selectedUserTicket.id)}
                            >
                              ✓ Talebi Çözüldü Olarak Kapat
                            </button>
                          ) : <span />}
                          <button
                            type="button"
                            className="client-thread-send-btn"
                            disabled={!ticketReplyText.trim() || isSubmittingReply}
                            onClick={() => handleReplyTicket(selectedUserTicket.id)}
                          >
                            {isSubmittingReply ? 'Gönderiliyor...' : 'Yanıtı Gönder'}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="22" y1="2" x2="11" y2="13" />
                              <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Subview 3: TICKET OVERVIEW LIST */
                    <>
                      <div className="client-tickets-header-actions">
                        <div className="client-ticket-tabs">
                          <button
                            type="button"
                            className={`client-ticket-tab-btn ${ticketStatusFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setTicketStatusFilter('all')}
                          >
                            Tümü ({userTickets.length})
                          </button>
                          <button
                            type="button"
                            className={`client-ticket-tab-btn ${ticketStatusFilter === 'open' ? 'active' : ''}`}
                            onClick={() => setTicketStatusFilter('open')}
                          >
                            Aktif ({userTickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed').length})
                          </button>
                          <button
                            type="button"
                            className={`client-ticket-tab-btn ${ticketStatusFilter === 'resolved' ? 'active' : ''}`}
                            onClick={() => setTicketStatusFilter('resolved')}
                          >
                            Çözülen ({userTickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length})
                          </button>
                        </div>

                        <button
                          type="button"
                          className="client-new-ticket-btn"
                          onClick={() => {
                            setIsCreatingTicket(true);
                            setTicketFeedback(null);
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          <span>Yeni Talep Aç</span>
                        </button>
                      </div>

                      {filteredClientTickets.length === 0 ? (
                        <div className="client-ticket-empty-box">
                          <div className="client-ticket-empty-icon">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                          </div>
                          <h4 className="client-ticket-empty-title">
                            {ticketStatusFilter === 'all' ? 'Aktif Destek Talebiniz Yok' : 'Bu Filtrede Talep Bulunamadı'}
                          </h4>
                          <p className="client-ticket-empty-desc">
                            Bot kurulumları, teknik sorularınız ve faturalandırma işlemleriniz için buradan doğrudan yetkili ekibimize talep iletebilirsiniz.
                          </p>
                          <button
                            type="button"
                            className="client-new-ticket-btn"
                            onClick={() => {
                              setIsCreatingTicket(true);
                              setTicketFeedback(null);
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>İlk Destek Talebini Oluştur</span>
                          </button>
                        </div>
                      ) : (
                        <div className="client-ticket-list">
                          {filteredClientTickets.map((t) => {
                            const lastMsg = t.messages && t.messages.length > 0 ? t.messages[t.messages.length - 1] : null;
                            const isUnread = Boolean(lastMsg && lastMsg.isStaff && (!readTicketsMap[t.id] || readTicketsMap[t.id] !== lastMsg.timestamp));
                            return (
                              <div
                                key={t.id}
                                className={`client-ticket-card is-${t.status.replace('_', '')} ${isUnread ? 'has-unread-reply' : ''}`}
                                onClick={() => {
                                  setSelectedUserTicketId(t.id);
                                  markTicketAsRead(t.id);
                                }}
                              >
                                <div className="client-ticket-card-header">
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                    <span className="client-ticket-id-tag">#{t.id}</span>
                                    <span className="client-ticket-category-tag">{t.category}</span>
                                    {isUnread && (
                                      <span className="unread-reply-pulse-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                        </svg>
                                        <span>Yeni Yanıt</span>
                                      </span>
                                    )}
                                  </div>
                                  <span className={`client-ticket-status-pill ${t.status}`}>
                                    {t.status === 'open' && (
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                          <circle cx="12" cy="12" r="10" />
                                          <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <span>Yanıt Bekliyor</span>
                                      </span>
                                    )}
                                    {t.status === 'in_progress' && (
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                        <span>Yetkili Yanıtladı</span>
                                      </span>
                                    )}
                                    {(t.status === 'resolved' || t.status === 'closed') && (
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                          <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>Çözüldü</span>
                                      </span>
                                    )}
                                  </span>
                                </div>

                                <h4 className="client-ticket-card-title">{t.subject}</h4>

                                {lastMsg && (
                                  <p className="client-ticket-card-snippet">
                                    <strong style={{ color: lastMsg.isStaff ? '#38bdf8' : '#e2e8f0' }}>
                                      {lastMsg.sender}:
                                    </strong>{' '}
                                    {lastMsg.text}
                                  </p>
                                )}

                                <div className="client-ticket-card-footer">
                                  <span>Son Güncelleme: {t.updatedAt || t.createdAt}</span>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#38bdf8', fontWeight: 600 }}>
                                    <span>Görüntüle</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                      <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeModalTab === 'referrals' && (
                <div className="referral-dashboard-wrap">
                  {/* Referral Hero Banner */}
                  <div className="referral-hero-banner">
                    <div className="referral-hero-content">
                      <span className="referral-badge-pill">🎁 Davet Et &amp; Kazan Programı</span>
                      <h4 className="referral-hero-title">Wihyfe İle Birlikte Kazanın</h4>
                      <p className="referral-hero-desc">
                        Özel davet bağlantınızı arkadaşlarınızla veya Discord sunucunuzda paylaşın; bağlantınız üzerinden yapılan <strong>her alışverişten anında %10 nakit bakiye</strong> kazanın!
                      </p>
                    </div>
                  </div>

                  {/* Share Link Box */}
                  <div className="referral-link-card">
                    <span className="referral-link-title">Özel Davet Bağlantınız</span>
                    <div className="referral-input-group">
                      <input
                        type="text"
                        readOnly
                        value={referralData?.link || (typeof window !== 'undefined' ? `${window.location.origin}?ref=${user?.username?.toLowerCase() || 'wihyfe'}` : '')}
                        className="referral-link-input"
                      />
                      <button
                        type="button"
                        className="referral-copy-btn"
                        onClick={() => {
                          const link = referralData?.link || `${window.location.origin}?ref=${user?.username?.toLowerCase() || 'wihyfe'}`;
                          navigator.clipboard.writeText(link);
                          setIsCopiedRef(true);
                          setTimeout(() => setIsCopiedRef(false), 2500);
                        }}
                      >
                        {isCopiedRef ? (
                          <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Kopyalandı!</span>
                          </>
                        ) : (
                          <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <span>Linki Kopyala</span>
                          </>
                        )}
                      </button>
                    </div>
                    <span className="referral-code-label">
                      Referans Kodunuz: <strong>{referralData?.code || user?.username?.toLowerCase()}</strong>
                    </span>
                  </div>

                  {/* 4 Stat Cards */}
                  <div className="referral-stats-grid">
                    <div className="ref-stat-card">
                      <span className="ref-stat-label">Toplam Kazanılan</span>
                      <strong className="ref-stat-val text-emerald">
                        ₺{Number(referralData?.totalEarned || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </strong>
                      <span className="ref-stat-sub">Hesabınıza yatan bakiye</span>
                    </div>

                    <div className="ref-stat-card">
                      <span className="ref-stat-label">Davet Edilen Müşteri</span>
                      <strong className="ref-stat-val text-blue">
                        {referralData?.referredUsersCount || 0} Kişi
                      </strong>
                      <span className="ref-stat-sub">Bağlantınızla kayıt olan</span>
                    </div>

                    <div className="ref-stat-card">
                      <span className="ref-stat-label">Komisyon Oranı</span>
                      <strong className="ref-stat-val text-purple">
                        %{referralData?.commissionRate || 10}
                      </strong>
                      <span className="ref-stat-sub">Her sipariş tutarından</span>
                    </div>

                    <div className="ref-stat-card">
                      <span className="ref-stat-label">Ortaklık Durumu</span>
                      <strong className="ref-stat-val text-amber">
                        Aktif Ortak
                      </strong>
                      <span className="ref-stat-sub">Limitsiz kazanç açık</span>
                    </div>
                  </div>

                  {/* 3 Step Visual Guide */}
                  <div className="referral-guide-box">
                    <h5 className="referral-guide-title">Sistem Nasıl Çalışır?</h5>
                    <div className="referral-steps-grid">
                      <div className="ref-step-item">
                        <div className="ref-step-num">1</div>
                        <h6 className="ref-step-heading">Bağlantını Paylaş</h6>
                        <p className="ref-step-desc">Özel referans linkini Discord sunucularında veya sosyal medyada arkadaşlarınla paylaş.</p>
                      </div>
                      <div className="ref-step-item">
                        <div className="ref-step-num">2</div>
                        <h6 className="ref-step-heading">Alışveriş Yapılsın</h6>
                        <p className="ref-step-desc">Davet ettiğin kullanıcı bağlantınla siteye gelsin ve dilediği bot paketini satın alsın.</p>
                      </div>
                      <div className="ref-step-item">
                        <div className="ref-step-num">3</div>
                        <h6 className="ref-step-heading">%10 Bakiye Kazan</h6>
                        <p className="ref-step-desc">Sipariş tamamlandığı saniyede %10 nakit komisyon tutarı anında cüzdan bakiyene yüklensin!</p>
                      </div>
                    </div>
                  </div>

                  {/* Earnings History Table */}
                  <div className="referral-history-box">
                    <h5 className="referral-history-title">Son Referans Kazançları</h5>
                    {referralData?.history && referralData.history.length > 0 ? (
                      <div className="referral-table-wrap">
                        <table className="referral-table">
                          <thead>
                            <tr>
                              <th>Tarih</th>
                              <th>Müşteri</th>
                              <th>Sipariş Tutarı</th>
                              <th>Kazanılan Komisyon</th>
                            </tr>
                          </thead>
                          <tbody>
                            {referralData.history.map((h, i) => (
                              <tr key={h.id || i}>
                                <td>{h.date}</td>
                                <td><strong>{h.userName}</strong></td>
                                <td>₺{Number(h.orderAmount).toLocaleString('tr-TR')}</td>
                                <td className="text-emerald"><strong>+₺{Number(h.commissionAmount).toLocaleString('tr-TR')}</strong></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="referral-empty-state">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <p>Henüz bir referans kazancınız bulunmuyor. Linkinizi paylaşarak kazanmaya hemen başlayın!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ACCOUNT SETTINGS MODAL (Image 2 & Image 3) */}
      <AccountSettingsModal
        isOpen={isAccountSettingsOpen}
        onClose={() => setIsAccountSettingsOpen(false)}
        initialTab={accountSettingsTab}
        onOpenPlansModal={() => setIsPlansModalOpen(true)}
        onOpenTicketsModal={() => {
          setIsAccountSettingsOpen(false);
          setActiveModalTab('tickets');
          setIsCreatingTicket(true);
          setTicketCategory('Teknik Sorun');
          setTicketSubject('E-posta Adresi Değişiklik Talebi');
        }}
      />

      {/* SUBSCRIPTION PLANS MODAL (Free, Plus, Plus+) */}
      <SubscriptionPlansModal
        isOpen={isPlansModalOpen}
        onClose={() => setIsPlansModalOpen(false)}
      />

      {/* PRINTABLE E-RECEIPT & ORDER INVOICE MODAL */}
      <ReceiptModal
        receipt={selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
      />
    </div>
  );
}
