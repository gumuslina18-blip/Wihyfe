'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { RoleType, SubscriptionTier } from '@/types/admin';

import { IconUser, IconX, IconCheck } from '../AdminIcons';

export default function AddUserModal() {
  const { isAddUserModalOpen, setIsAddUserModalOpen, addUser } = useAdmin();

  const [username, setUsername] = useState('');
  const [discriminator, setDiscriminator] = useState('0001');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleType>('Müşteri');
  const [subscription, setSubscription] = useState<SubscriptionTier>('Free');
  const [balance, setBalance] = useState<number>(0);
  const [panelAccess, setPanelAccess] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  if (!isAddUserModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    if (panelAccess && !password.trim()) {
      alert('Yetkili paneli erişimi verilen kullanıcılar için giriş şifresi belirlenmesi zorunludur!');
      return;
    }

    addUser({
      username: username.trim(),
      discriminator: discriminator.trim() || '0001',
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
      email: email.trim() || `${username.toLowerCase()}@discord.user`,
      role,
      subscription,
      balance,
      status: 'Aktif',
      ipAddress: '127.0.0.1 (Kayıtlı)',
      panelAccess,
      password: panelAccess ? password.trim() : undefined,
    });

    setIsAddUserModalOpen(false);
    setUsername('');
    setEmail('');
    setBalance(0);
    setPanelAccess(false);
    setPassword('');
  };

  return (
    <div className="admin-modal-overlay" onClick={() => setIsAddUserModalOpen(false)}>
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">
            <IconUser size={18} color="var(--admin-accent-purple)" />
            <span>Yeni Kullanıcı / Müşteri Ekle</span>
          </h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={() => setIsAddUserModalOpen(false)}
          >
            <IconX size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.65rem' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Discord Kullanıcı Adı</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="admin-form-input"
                  placeholder="Örn: AhmetDev"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Tag (#)</label>
                <input
                  type="text"
                  value={discriminator}
                  onChange={(e) => setDiscriminator(e.target.value)}
                  className="admin-form-input"
                  placeholder="0001"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">E-Posta Adresi (Opsiyonel)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-form-input"
                placeholder="ahmet@gmail.com"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Sistem Rolü (6 Rol)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as RoleType)}
                  className="admin-form-select"
                >
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="Master">Master</option>
                  <option value="VIP">VIP</option>
                  <option value="Müşteri">Müşteri</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Abonelik (3 Plan)</label>
                <select
                  value={subscription}
                  onChange={(e) => setSubscription(e.target.value as SubscriptionTier)}
                  className="admin-form-select"
                >
                  <option value="Free">Free</option>
                  <option value="Plus">Plus</option>
                  <option value="Plus+">Plus+</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Başlangıç Bakiyesi (₺)</label>
              <input
                type="number"
                min={0}
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="admin-form-input"
                placeholder="0"
              />
            </div>

            {/* Yetkili Paneli Giriş Yetkisi & Şifre */}
            <div style={{ padding: '0.85rem', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.25)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={panelAccess}
                  onChange={(e) => setPanelAccess(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--admin-accent-purple)' }}
                />
                <span>Bu kullanıcıya Yetkili Paneli Giriş İzni Ver</span>
              </label>

              {panelAccess && (
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label className="admin-form-label">Panel Giriş Şifresi</label>
                  <input
                    type="text"
                    required={panelAccess}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="admin-form-input"
                    placeholder="Güçlü bir panel şifresi belirleyin"
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>
                    Kullanıcı, panele girerken kullanıcı adı ve bu şifreyi kullanarak kimliğini doğrulayacaktır.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setIsAddUserModalOpen(false)}
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="admin-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <IconCheck size={14} /> Kullanıcıyı Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
