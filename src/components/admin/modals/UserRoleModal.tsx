'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { RoleType, SubscriptionTier } from '@/types/admin';

import { IconShield, IconX, IconCheck, IconTag } from '../AdminIcons';
import { PRODUCT_PLAN_TAGS } from '@/config/planTags';

export default function UserRoleModal() {
  const { isRoleModalOpen, setIsRoleModalOpen, editingUser, updateUserRoleAndSubscription } = useAdmin();

  const [role, setRole] = useState<RoleType>('Müşteri');
  const [subscription, setSubscription] = useState<SubscriptionTier>('Free');
  const [status, setStatus] = useState<'Aktif' | 'Kısıtlı' | 'Yasaklı'>('Aktif');
  const [restrictionsNote, setRestrictionsNote] = useState('');
  const [panelAccess, setPanelAccess] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (editingUser) {
      setRole(editingUser.role);
      setSubscription(editingUser.subscription);
      setStatus(editingUser.status);
      setRestrictionsNote(editingUser.restrictionsNote || '');
      setPanelAccess(editingUser.panelAccess ?? false);
      setPassword(editingUser.password || '');
      setEmail(editingUser.email || '');
    }
  }, [editingUser, isRoleModalOpen]);

  if (!isRoleModalOpen || !editingUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (panelAccess && !password.trim()) {
      alert('Yetkili paneli erişimi verilen kullanıcılar için giriş şifresi belirlenmesi zorunludur!');
      return;
    }
    updateUserRoleAndSubscription(
      editingUser.id,
      role,
      subscription,
      status,
      restrictionsNote.trim() || undefined,
      panelAccess,
      panelAccess ? password.trim() : undefined,
      email.trim() || undefined
    );
    setIsRoleModalOpen(false);
  };

  return (
    <div className="admin-modal-overlay" onClick={() => setIsRoleModalOpen(false)}>
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">
            <IconShield size={18} color="var(--admin-accent-purple)" />
            <span>Kullanıcı Rolü &amp; Bilgilerini Düzenle</span>
          </h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={() => setIsRoleModalOpen(false)}
          >
            <IconX size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            {/* User Meta Card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
              <img src={editingUser.avatarUrl} alt={editingUser.username} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
              <div>
                <div style={{ color: '#fff', fontWeight: 700 }}>
                  {editingUser.username}#{editingUser.discriminator}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-dim)' }}>
                  ID: {editingUser.id} • {editingUser.email}
                </div>
              </div>
            </div>

            {/* E-posta Adresi Düzenleme (Destek Talebi İle Yetkili Değişikliği) */}
            <div className="admin-form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="admin-form-label" style={{ margin: 0 }}>E-posta Adresi (Yetkili Tarafından Güncelleme)</label>
                <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700 }}>🛡️ Ticket İle Değişiklik</span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-form-input"
                placeholder="kullanici@example.com"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>
                Kullanıcı destek talebi açtığında doğrulanmış yeni e-postasını bu alandan güvenle değiştirebilirsiniz.
              </span>
            </div>

            {/* 6 Roles Selector */}
            <div className="admin-form-group">
              <label className="admin-form-label">Yetki Rolü (6 Rol Hiyerarşisi)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as RoleType)}
                className="admin-form-select"
              >
                <option value="Owner">Owner (Kurucu - Tam Yetki &amp; Konsol Erişimi)</option>
                <option value="Admin">Admin (Yönetici - Sistem &amp; Fiyat Düzenleme)</option>
                <option value="Staff">Staff (Destek &amp; Teslimat Yetkilisi)</option>
                <option value="Master">Master (Usta Geliştirici &amp; Bot Mimarı)</option>
                <option value="VIP">VIP (Özel Ayrıcalıklı Müşteri)</option>
                <option value="Müşteri">Müşteri (Standart Kullanıcı)</option>
              </select>
            </div>

            {/* Kişiye Özel Satın Alınan İlan / Plan Tagı Selector */}
            <div className="admin-form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="admin-form-label" style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <IconTag size={13} color="var(--admin-accent-purple)" />
                  <span>Kişiye Özel İlan / Satın Alınan Plan Tagı</span>
                </label>
                <span style={{ fontSize: '0.68rem', color: '#c084fc', fontWeight: 600 }}>Tüm İlanlar &amp; Süreler</span>
              </div>
              <select
                value={subscription}
                onChange={(e) => setSubscription(e.target.value as SubscriptionTier)}
                className="admin-form-select"
              >
                <option value="Free">⚪ Free / Standart (Satın Alım Yok)</option>
                <option value="Plus">⭐ Plus (Genel Standart Paket)</option>
                <option value="Plus+">⚡ Plus+ (Genel VIP Paket)</option>

                <optgroup label="🤖 Discord Bot Paketleri">
                  <option value="Discord Full Pack - 1 Aylık">Discord Full Pack - 1 Aylık</option>
                  <option value="Discord Full Pack - 3 Aylık">Discord Full Pack - 3 Aylık</option>
                  <option value="Discord Full Pack - 6 Aylık">Discord Full Pack - 6 Aylık</option>
                  <option value="Discord Full Pack - 1 Yıllık">Discord Full Pack - 1 Yıllık</option>
                  <option value="Moderasyon Botu - 1 Aylık">Moderasyon Botu - 1 Aylık</option>
                  <option value="Guard Botu - 1 Aylık">Guard Botu - 1 Aylık</option>
                  <option value="Ticket Botu - 1 Aylık">Ticket Botu - 1 Aylık</option>
                  <option value="Ekip Sistemi Botu - 1 Aylık">Ekip Sistemi Botu - 1 Aylık</option>
                </optgroup>

                <optgroup label="🎮 FiveM Paket &amp; Panelleri">
                  <option value="Fivem Full Pack - 1 Aylık">Fivem Full Pack - 1 Aylık</option>
                  <option value="Fivem Full Pack - 3 Aylık">Fivem Full Pack - 3 Aylık</option>
                  <option value="Fivem Full Pack - 6 Aylık">Fivem Full Pack - 6 Aylık</option>
                  <option value="Fivem Full Pack - 1 Yıllık">Fivem Full Pack - 1 Yıllık</option>
                  <option value="FiveM Oyun İçi Admin Paneli - 1 Aylık">FiveM Oyun İçi Admin Paneli - 1 Aylık</option>
                  <option value="FiveM Oyun İçi Admin Paneli - 3 Aylık">FiveM Oyun İçi Admin Paneli - 3 Aylık</option>
                  <option value="FiveM Oyun İçi Admin Paneli - 6 Aylık">FiveM Oyun İçi Admin Paneli - 6 Aylık</option>
                  <option value="FiveM Oyun İçi Admin Paneli - 1 Yıllık">FiveM Oyun İçi Admin Paneli - 1 Yıllık</option>
                </optgroup>

                <optgroup label="💻 Yönetim Web Panelleri">
                  <option value="Discord Web Yönetim Paneli - 1 Aylık">Discord Web Yönetim Paneli - 1 Aylık</option>
                  <option value="Discord Web Yönetim Paneli - 3 Aylık">Discord Web Yönetim Paneli - 3 Aylık</option>
                  <option value="Discord Web Yönetim Paneli - 6 Aylık">Discord Web Yönetim Paneli - 6 Aylık</option>
                  <option value="Discord Web Yönetim Paneli - 1 Yıllık">Discord Web Yönetim Paneli - 1 Yıllık</option>
                </optgroup>

                <optgroup label="⚡ Kişiye Özel Yazılım &amp; Uygulama">
                  <option value="Kişiye Özel Uygulama - 1 Aylık">Kişiye Özel Uygulama - 1 Aylık</option>
                  <option value="Kişiye Özel Uygulama - 3 Aylık">Kişiye Özel Uygulama - 3 Aylık</option>
                  <option value="Kişiye Özel Uygulama - 6 Aylık">Kişiye Özel Uygulama - 6 Aylık</option>
                  <option value="Kişiye Özel Uygulama - 1 Yıllık">Kişiye Özel Uygulama - 1 Yıllık</option>
                  <option value="Tüm Yazılım Çözümleri - 1 Aylık">Tüm Yazılım Çözümleri - 1 Aylık</option>
                  <option value="Tüm Yazılım Çözümleri - 1 Yıllık">Tüm Yazılım Çözümleri - 1 Yıllık</option>
                </optgroup>

                <optgroup label="🌐 Web Siteleri">
                  <option value="Website - Donate - 1 Aylık">Website - Donate - 1 Aylık</option>
                  <option value="Website - Donate - 1 Yıllık">Website - Donate - 1 Yıllık</option>
                  <option value="Website - Community - 1 Aylık">Website - Community - 1 Aylık</option>
                  <option value="Website - XM Studio - 1 Aylık">Website - XM Studio - 1 Aylık</option>
                  <option value="Website - Legal - 1 Aylık">Website - Legal - 1 Aylık</option>
                </optgroup>
              </select>

              {/* Custom Tag Override Field */}
              <div style={{ marginTop: '0.45rem' }}>
                <input
                  type="text"
                  placeholder="Veya özel ilan tagı yazın (Örn: Discord Full Pack - 3 Aylık)..."
                  value={subscription}
                  onChange={(e) => setSubscription(e.target.value as SubscriptionTier)}
                  className="admin-form-input"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                />
              </div>
            </div>

            {/* Hesap Durumu & Kısıtlama */}
            <div className="admin-form-group">
              <label className="admin-form-label">Hesap Erişim Durumu</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Aktif' | 'Kısıtlı' | 'Yasaklı')}
                className="admin-form-select"
              >
                <option value="Aktif">● Aktif (Herhangi bir kısıtlama yok)</option>
                <option value="Kısıtlı">● Kısıtlı (Spam veya şüpheli aktivite uyarısı)</option>
                <option value="Yasaklı">● Yasaklı (Giriş ve satın alma tamamen engellendi)</option>
              </select>
            </div>

            {status !== 'Aktif' && (
              <div className="admin-form-group">
                <label className="admin-form-label">Kısıtlama / Ceza Sebebi</label>
                <input
                  type="text"
                  required
                  value={restrictionsNote}
                  onChange={(e) => setRestrictionsNote(e.target.value)}
                  className="admin-form-input"
                  placeholder="Örn: Bot spamı ve şüpheli API istekleri"
                />
              </div>
            )}

            {/* Yetkili Paneli Giriş Yetkisi & Şifre Düzenleme */}
            <div style={{ padding: '0.85rem', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.25)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={panelAccess}
                  onChange={(e) => setPanelAccess(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--admin-accent-purple)' }}
                />
                <span>Yetkili Paneline Giriş İzni (Aktif/Pasif)</span>
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
                    placeholder="Panel şifresini güncelleyin veya yeni şifre belirleyin"
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>
                    Bu yetkili, panele giriş ekranında kullanıcı adı ({editingUser.username}) ve buradaki şifreyi yazarak girecektir.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setIsRoleModalOpen(false)}
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="admin-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <IconCheck size={14} /> Yetkileri Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
