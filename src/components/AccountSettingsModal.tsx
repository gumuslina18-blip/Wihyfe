'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '@/context/StoreContext';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'integrations' | 'subscription';
  onOpenPlansModal?: () => void;
  onOpenTicketsModal?: () => void;
}

export default function AccountSettingsModal({
  isOpen,
  onClose,
  initialTab = 'profile',
  onOpenPlansModal,
  onOpenTicketsModal,
}: AccountSettingsModalProps) {
  const { user, updateUserProfile } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'subscription'>(initialTab);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [orderActivationOpen, setOrderActivationOpen] = useState(false);
  const [orderCodeInput, setOrderCodeInput] = useState('');
  const [orderActivationStatus, setOrderActivationStatus] = useState<{
    type: 'checking' | 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.username || '');
      setEmail(user.email || '');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const isEmailLocked = Boolean(user?.email && user.email.trim().length > 0);

  const handleCopyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    const updates: any = {
      username: displayName.trim(),
    };

    // Only allow setting email if it was never set before
    if (!isEmailLocked && email.trim()) {
      updates.email = email.trim();
    }

    updateUserProfile(updates);

    setSaveToast(
      !isEmailLocked && email.trim()
        ? 'E-posta adresiniz kaydedildi ve güvenlik gereği kilitlendi.'
        : 'Profil bilgileriniz başarıyla güncellendi.'
    );
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleActivateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCodeInput.trim()) return;

    setOrderActivationStatus({ type: 'checking', message: 'Lisans / sipariş kodu doğrulanıyor...' });
    try {
      const res = await fetch('/api/license/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: orderCodeInput.trim(),
          userId: user?.id,
          userName: user?.username,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrderActivationStatus({
          type: 'success',
          message: data.message || `✓ [${data.tier}] lisansı başarıyla hesabınıza tanımlandı!`,
        });
        if (data.tier) {
          updateUserProfile({
            tier: data.tier,
            role: data.role || (data.tier === 'Plus+' ? 'VIP' : data.tier === 'Plus' ? 'Plus' : 'Member'),
          });
        }
        setTimeout(() => {
          setOrderActivationStatus(null);
          setOrderActivationOpen(false);
          setOrderCodeInput('');
        }, 3500);
      } else {
        setOrderActivationStatus({
          type: 'error',
          message: data.error || 'Geçersiz veya süresi dolmuş lisans kodu!',
        });
      }
    } catch (err: any) {
      setOrderActivationStatus({
        type: 'error',
        message: 'Bağlantı hatası: ' + (err.message || 'Lütfen tekrar deneyiniz.'),
      });
    }
  };

  const userAvatar =
    user?.avatarUrl &&
    !user.avatarUrl.includes('spark-icon') &&
    !user.avatarUrl.includes('wisp-icon') &&
    !user.avatarUrl.includes('wihyfe-icon')
      ? user.avatarUrl
      : '/team/lunaalvine.jpg';

  const modalContent = (
    <div className="account-modal-overlay" onClick={onClose}>
      <div
        className="account-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-settings-title"
      >
        {/* Header */}
        <div className="account-modal-top-bar">
          <div>
            <h2 id="account-settings-title" className="account-modal-heading">
              Hesap ayarları
            </h2>
            <p className="account-modal-subheading">
              Profil, bağlantılar ve abonelik. Hepsi tek yerde.
            </p>
          </div>

          <button
            type="button"
            className="account-modal-close-btn"
            onClick={onClose}
            aria-label="Kapat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* User Card Banner */}
        <div className="account-user-card-banner">
          <div className="account-user-card-left">
            <div className="account-avatar-wrapper">
              <img
                src={userAvatar}
                alt={user?.username || 'Kullanıcı'}
                className="account-avatar-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                }}
              />
              <span className="account-avatar-online-dot" />
            </div>

            <div className="account-user-details">
              <div className="account-user-name-row">
                <span className="account-user-name-text">{user?.username || 'lunaalvine'}</span>
              </div>
              <div className="account-user-badges-row">
                <span className="account-badge-pill">{user?.tier || 'Free'}</span>
                <span className="account-badge-pill">{user?.role || 'Member'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="account-devices-trigger-btn"
            onClick={() => setShowDevicesModal(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>Cihazları yönet ↗</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="account-nav-tabs">
          <button
            type="button"
            className={`account-nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profil</span>
          </button>

          <button
            type="button"
            className={`account-nav-tab-btn ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span>Entegrasyonlar</span>
          </button>

          <button
            type="button"
            className={`account-nav-tab-btn ${activeTab === 'subscription' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscription')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <span>Abonelik</span>
          </button>
        </div>

        {/* Tab 1: Profil */}
        {activeTab === 'profile' && (
          <div className="account-tab-grid">
            {/* Left Box: Profil Bilgileri */}
            <div className="account-card-box">
              <div className="account-card-header">
                <div className="account-card-icon-square">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h3 className="account-card-title">Profil bilgileri</h3>
                  <p className="account-card-desc">Hesabınızda görünen bilgileri düzenleyin.</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="account-card-form">
                <div className="account-input-group">
                  <label className="account-input-label">Görünen İsim</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="account-text-input"
                    placeholder="lunaalvine"
                  />
                </div>

                <div className="account-input-group">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label className="account-input-label" style={{ margin: 0 }}>E-posta Adresi</label>
                    {isEmailLocked && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#fbbf24',
                        background: 'rgba(245, 158, 11, 0.14)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '999px',
                      }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span>Kilitli</span>
                      </span>
                    )}
                  </div>

                  <div className="account-input-with-action">
                    <input
                      type="email"
                      value={email}
                      readOnly={isEmailLocked}
                      onChange={(e) => {
                        if (!isEmailLocked) setEmail(e.target.value);
                      }}
                      className="account-text-input"
                      placeholder={isEmailLocked ? email : "kullanici@example.com (Bir kez eklendikten sonra kilitlenir)"}
                      style={isEmailLocked ? {
                        cursor: 'not-allowed',
                        opacity: 0.85,
                        background: 'rgba(15, 23, 42, 0.65)',
                        borderColor: 'rgba(245, 158, 11, 0.25)',
                      } : undefined}
                    />
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="account-input-action-btn"
                      title="E-postayı kopyala"
                    >
                      {isCopied ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {isEmailLocked ? (
                    <div style={{
                      marginTop: '0.45rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.22)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.65rem',
                      flexWrap: 'wrap',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#fbbf24', fontSize: '0.74rem', flex: 1, minWidth: '220px' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span>E-posta adresiniz güvenlik sebebiyle kilitlenmiştir. Değişiklik için yalnızca destek talebi açabilirsiniz, yetkililerimiz güncelleyecektir.</span>
                      </div>
                      {onOpenTicketsModal && (
                        <button
                          type="button"
                          onClick={onOpenTicketsModal}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            whiteSpace: 'nowrap',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '7px',
                            background: 'rgba(8, 120, 255, 0.2)',
                            border: '1px solid rgba(8, 120, 255, 0.5)',
                            color: '#60a5fa',
                            fontWeight: 700,
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                          }}
                        >
                          <span>Destek Talebi Aç</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>
                      ⚠️ E-posta adresinizi ekleyip kaydettikten sonra kilitlenecektir. Sonraki değişiklikler yalnızca yetkili destek ekibimiz tarafından yapılabilir.
                    </p>
                  )}
                </div>

                <div className="account-form-footer">
                  <p className="account-form-hint">
                    Bilgilerinizi düzenleyip değişiklikleri kaydedebilirsiniz.
                  </p>

                  <div className="account-form-buttons-row">
                    <button
                      type="button"
                      className="account-btn-secondary"
                      onClick={() => {
                        setDisplayName(user?.username || '');
                        setEmail(user?.email || '');
                      }}
                    >
                      Vazgeç
                    </button>
                    <button type="submit" className="account-btn-primary">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      <span>Değişiklikleri kaydet</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Box: Güvenlik & Gizlilik */}
            <div className="account-card-box">
              <div className="account-card-header">
                <div className="account-card-icon-square">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="account-card-title">Güvenlik &amp; Gizlilik</h3>
                  <p className="account-card-desc">Hesabınıza erişen cihazlar ve bağlı hesaplar.</p>
                </div>
              </div>

              <div className="account-security-sections">
                {/* Active Sessions */}
                <div className="account-security-item">
                  <div className="account-security-item-top">
                    <div className="account-security-item-info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                      <div>
                        <div className="account-security-name">Aktif Oturumlar</div>
                        <div className="account-security-sub">
                          Oturum açılmış cihazları inceleyin ve yönetin.
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="account-inline-btn"
                    onClick={() => setShowDevicesModal(true)}
                  >
                    <span>Cihazları yönet ↗</span>
                  </button>
                </div>

                {/* Discord Connection */}
                <div className="account-security-item">
                  <div className="account-security-item-top">
                    <div className="account-security-item-info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <div>
                        <div className="account-security-name">Discord</div>
                        <div className="account-security-connected">
                          <span className="account-status-dot-green" />
                          <span>Hesabınıza bağlı</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="account-inline-btn danger"
                    onClick={() => {
                      if (window.confirm('Discord bağlantınızı kaldırmak istediğinizden emin misiniz?')) {
                        updateUserProfile({ email: '' });
                      }
                    }}
                  >
                    <span>Bağlantıyı kaldır</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Abonelik */}
        {activeTab === 'subscription' && (
          <div className="account-tab-grid">
            {/* Left Box: Abonelik */}
            <div className="account-card-box">
              <div className="account-card-header">
                <div className="account-card-icon-square">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <div>
                  <h3 className="account-card-title">Abonelik</h3>
                  <p className="account-card-desc">Mevcut paketiniz ve abonelik işlemleri.</p>
                </div>
              </div>

              {/* Inner Subscription Display Card */}
              <div className="account-sub-inner-card">
                <div className="account-sub-inner-top">
                  <div>
                    <span className="account-sub-label">MEVCUT PAKET</span>
                    <h4 className="account-sub-tier-name">{user?.tier || 'Free'}</h4>
                  </div>
                  <div className="account-sub-shield-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                </div>

                <div className="account-sub-divider" />

                <div className="account-sub-role-row">
                  <span className="account-sub-role-label">Hesap rolü</span>
                  <span className="account-sub-role-value">{user?.role || 'Member'}</span>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="account-btn-primary"
                  onClick={() => {
                    onClose();
                    if (onOpenPlansModal) {
                      onOpenPlansModal();
                    } else {
                      const el = document.getElementById('paketler');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <span>Paketleri İncele ↗</span>
                </button>
              </div>
            </div>

            {/* Right Box: Siparişiniz var mı? */}
            <div className="account-card-box">
              <div className="account-card-header">
                <div>
                  <h3 className="account-card-title" style={{ fontSize: '1.05rem' }}>
                    Siparişiniz var mı?
                  </h3>
                  <p className="account-card-desc">Sipariş veya lisans numaranızla devam edin.</p>
                </div>
              </div>

              {!orderActivationOpen ? (
                <div style={{ marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="account-order-activate-btn"
                    onClick={() => setOrderActivationOpen(true)}
                  >
                    <span>Sipariş No ile Aktif Et</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleActivateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="Örn: #WSP-4821 veya Lisans Kodu"
                    value={orderCodeInput}
                    onChange={(e) => setOrderCodeInput(e.target.value.toUpperCase())}
                    className="account-text-input"
                    style={{ letterSpacing: '0.05em', fontWeight: 600 }}
                  />

                  {orderActivationStatus?.type === 'checking' && (
                    <div style={{ fontSize: '0.78rem', color: '#60a5fa' }}>
                      {orderActivationStatus.message}
                    </div>
                  )}

                  {orderActivationStatus?.type === 'success' && (
                    <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>
                      {orderActivationStatus.message}
                    </div>
                  )}

                  {orderActivationStatus?.type === 'error' && (
                    <div style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 600 }}>
                      ✕ {orderActivationStatus.message}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="account-btn-secondary"
                      onClick={() => setOrderActivationOpen(false)}
                      style={{ padding: '0.45rem 0.85rem' }}
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="account-btn-primary"
                      style={{ padding: '0.45rem 1rem' }}
                      disabled={orderActivationStatus?.type === 'checking'}
                    >
                      Onayla &amp; Bağla
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Entegrasyonlar */}
        {activeTab === 'integrations' && (
          <div className="account-tab-grid">
            <div className="account-card-box">
              <div className="account-card-header">
                <div className="account-card-icon-square">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <div>
                  <h3 className="account-card-title">Bağlı Hizmetler</h3>
                  <p className="account-card-desc">Bot ve müşteri paneliyle eşleşen servisler.</p>
                </div>
              </div>

              <div className="account-security-sections">
                <div className="account-security-item">
                  <div className="account-security-item-top">
                    <div className="account-security-item-info">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                      <div>
                        <div className="account-security-name">Discord OAuth2</div>
                        <div className="account-security-connected">
                          <span className="account-status-dot-green" />
                          <span>Yetkili Girişi &amp; Sunucu Rol Eşitleme Aktif</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="account-security-item">
                  <div className="account-security-item-top">
                    <div className="account-security-item-info">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                      <div>
                        <div className="account-security-name">Webhook Bildirimleri</div>
                        <div className="account-security-sub">
                          Sipariş teslimatı ve süre bitimi bildirimleri.
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="account-badge-pill" style={{ color: '#34d399' }}>Açık</span>
                </div>
              </div>
            </div>

            <div className="account-card-box">
              <div className="account-card-header">
                <div>
                  <h3 className="account-card-title">Müşteri API Token</h3>
                  <p className="account-card-desc">İstemci ve harici otomasyon bağlantı anahtarı.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="password"
                  readOnly
                  value="wisp_live_948201a88b49f02c77d29"
                  className="account-text-input"
                  style={{ letterSpacing: '0.1em', fontFamily: 'monospace', opacity: 0.8 }}
                />
                <button
                  type="button"
                  className="account-btn-secondary"
                  onClick={() => {
                    navigator.clipboard.writeText('wisp_live_948201a88b49f02c77d29');
                    alert('API Token panoya kopyalandı!');
                  }}
                  style={{ alignSelf: 'flex-start' }}
                >
                  Token Kopyala
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Toast Feedback */}
        {saveToast && (
          <div className="account-floating-toast">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{saveToast}</span>
          </div>
        )}

        {/* Nested Active Devices Modal */}
        {showDevicesModal && (
          <div className="account-devices-submodal-overlay" onClick={() => setShowDevicesModal(false)}>
            <div className="account-devices-submodal" onClick={(e) => e.stopPropagation()}>
              <div className="account-devices-submodal-header">
                <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 700 }}>
                  Aktif Cihazlar &amp; Oturumlar
                </h4>
                <button
                  type="button"
                  className="account-modal-close-btn"
                  onClick={() => setShowDevicesModal(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="account-devices-list">
                <div className="account-device-entry current">
                  <div className="account-device-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <div className="account-device-info">
                    <div className="account-device-title-row">
                      <span className="account-device-name">Windows PC (Chrome)</span>
                      <span className="account-device-current-badge">Bu Cihaz (Aktif)</span>
                    </div>
                    <div className="account-device-meta">
                      IP: 127.0.0.1 • Türkiye • Son işlem: Şimdi
                    </div>
                  </div>
                </div>

                <div className="account-device-entry">
                  <div className="account-device-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  </div>
                  <div className="account-device-info">
                    <div className="account-device-title-row">
                      <span className="account-device-name">Mobil Tarayıcı (Discord Web)</span>
                    </div>
                    <div className="account-device-meta">
                      IP: 176.218.xx.xx • 2 gün önce
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
                <button
                  type="button"
                  className="account-btn-secondary"
                  onClick={() => setShowDevicesModal(false)}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
