'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import {
  IconLock,
  IconUser,
  IconEye,
  IconEyeOff,
  IconShield,
  IconAlertTriangle,
  IconLogIn,
} from './AdminIcons';

export default function AdminLogin() {
  const { login } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Lütfen kullanıcı adınızı girin.');
      return;
    }
    if (!password.trim()) {
      setError('Lütfen şifrenizi girin.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(username, password);
      setIsLoading(false);
      if (!result.success) {
        setError(result.error || 'Giriş başarısız oldu.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError('Bağlantı hatası oluştu: ' + (err.message || ''));
    }
  };


  return (
    <div className="admin-login-shell">
      {/* Background Animated Cyber Mesh & HUD scanline */}
      <div className="admin-cyber-mesh" aria-hidden="true" />
      <div className="admin-hud-scanline" aria-hidden="true" />
      <div className="admin-cyber-glow-top" aria-hidden="true" />
      <div className="admin-cyber-glow-bottom" aria-hidden="true" />

      <div className="admin-login-container">
        {/* Brand Reactor Header */}
        <div className="admin-login-brand">
          <div className="admin-login-reactor">
            <div className="admin-reactor-ring" aria-hidden="true" />
            <img src="/wihyfe-icon.png" alt="Wihyfe Logo" width={38} height={38} />
          </div>
          <div className="admin-login-brand-meta">
            <div className="admin-login-brand-title">
              <span>wihyfe</span>
              <span className="admin-brand-badge">SECURE DECK</span>
            </div>
            <span className="admin-login-brand-sub">Yetkili Yönetim Konsolu &amp; Kimlik Doğrulama</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="admin-login-card">
          <div className="admin-login-card-header">
            <div className="admin-login-shield-badge">
              <IconShield size={16} color="var(--admin-accent-cyan)" />
              <span>256-Bit Şifreli Oturum Denetimi</span>
            </div>
            <h1 className="admin-login-title">Yetkili Girişi</h1>
            <p className="admin-login-desc">
              Panele erişmek için yetkilendirilmiş kullanıcı adınızı ve şifrenizi girin.
            </p>
          </div>

          {error && (
            <div className="admin-login-error-alert" role="alert">
              <IconAlertTriangle size={16} color="#f87171" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="admin-login-username">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <IconUser size={13} color="var(--admin-accent-cyan)" />
                  <span>Kullanıcı Adı veya E-Posta</span>
                </span>
              </label>
              <div className="admin-login-input-wrap">
                <input
                  id="admin-login-username"
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="admin-form-input admin-login-input"
                  placeholder="Örn: lunaalvine veya Gumus"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="admin-login-password">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <IconLock size={13} color="var(--admin-accent-blue)" />
                  <span>Yetkili Şifresi</span>
                </span>
              </label>
              <div className="admin-login-input-wrap" style={{ position: 'relative' }}>
                <input
                  id="admin-login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-form-input admin-login-input"
                  placeholder="••••••••"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  className="admin-login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {showPassword ? (
                    <IconEyeOff size={15} color="var(--admin-text-dim)" />
                  ) : (
                    <IconEye size={15} color="var(--admin-text-dim)" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="admin-login-submit-btn"
            >
              {isLoading ? (
                <>
                  <span className="admin-status-dot" style={{ width: '8px', height: '8px' }} />
                  <span>Kimlik Doğrulanıyor...</span>
                </>
              ) : (
                <>
                  <IconLogIn size={16} strokeWidth={2.5} />
                  <span>Panele Giriş Yap</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <Link href="/" className="admin-login-back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
