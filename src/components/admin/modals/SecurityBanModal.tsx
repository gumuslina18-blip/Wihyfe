'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { IconBan, IconX, IconGlobe, IconUser } from '../AdminIcons';

export default function SecurityBanModal() {
  const { isBanModalOpen, setIsBanModalOpen, banTarget, addBan, users } = useAdmin();

  const [targetType, setTargetType] = useState<'ip' | 'user'>('ip');
  const [targetValue, setTargetValue] = useState('');
  const [targetName, setTargetName] = useState('');
  const [reason, setReason] = useState('Yetkisiz erişim ve sistem güvenlik kuralı ihlali');
  const [duration, setDuration] = useState<'1 saat' | '24 saat' | '7 gün' | 'Kalıcı'>('24 saat');

  useEffect(() => {
    if (banTarget) {
      setTargetType(banTarget.type);
      setTargetValue(banTarget.value);
      setTargetName(banTarget.name || banTarget.value);
    } else {
      setTargetType('ip');
      setTargetValue('');
      setTargetName('');
      setReason('Yetkisiz erişim ve sistem güvenlik kuralı ihlali');
      setDuration('24 saat');
    }
  }, [banTarget, isBanModalOpen]);

  if (!isBanModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetValue.trim()) return;

    addBan(targetType, targetValue.trim(), targetName.trim() || targetValue.trim(), reason.trim(), duration);
    setIsBanModalOpen(false);
  };

  return (
    <div className="admin-modal-overlay" onClick={() => setIsBanModalOpen(false)}>
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">
            <IconBan size={18} color="var(--admin-accent-rose)" />
            <span>Güvenlik Kısıtlaması &amp; Ban Ekle</span>
          </h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={() => setIsBanModalOpen(false)}
          >
            <IconX size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            {/* Target Type Selector */}
            <div className="admin-form-group">
              <label className="admin-form-label">Kısıtlama Türü</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <button
                  type="button"
                  className={`admin-action-btn ${targetType === 'ip' ? 'primary' : ''}`}
                  onClick={() => setTargetType('ip')}
                  style={{ justifyContent: 'center', padding: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <IconGlobe size={13} />
                  <span>IP Adresi Banla</span>
                </button>
                <button
                  type="button"
                  className={`admin-action-btn ${targetType === 'user' ? 'danger' : ''}`}
                  onClick={() => setTargetType('user')}
                  style={{ justifyContent: 'center', padding: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <IconUser size={13} />
                  <span>Kullanıcı Hesabı Kısıtla</span>
                </button>
              </div>
            </div>

            {targetType === 'user' ? (
              <div className="admin-form-group">
                <label className="admin-form-label">Kısıtlanacak Kullanıcıyı Seçin</label>
                <select
                  value={targetValue}
                  onChange={(e) => {
                    setTargetValue(e.target.value);
                    const u = users.find((usr) => usr.id === e.target.value);
                    if (u) setTargetName(`${u.username}#${u.discriminator}`);
                  }}
                  className="admin-form-select"
                >
                  <option value="">Kullanıcı seçin...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username}#{u.discriminator} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="admin-form-group">
                <label className="admin-form-label">Yasaklanacak IP veya CIDR Subnet</label>
                <input
                  type="text"
                  required
                  value={targetValue}
                  onChange={(e) => {
                    setTargetValue(e.target.value);
                    setTargetName(e.target.value);
                  }}
                  className="admin-form-input"
                  placeholder="Örn: 194.26.29.14 veya 185.190.0.0/16"
                />
              </div>
            )}

            {/* Duration */}
            <div className="admin-form-group">
              <label className="admin-form-label">Kısıtlama Süresi</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as any)}
                className="admin-form-select"
              >
                <option value="1 saat">1 Saat (Geçici Güvenlik Tedbiri)</option>
                <option value="24 saat">24 Saat (Şüpheli İstek Engeli)</option>
                <option value="7 gün">7 Gün (Kural İhlali &amp; Spam)</option>
                <option value="Kalıcı">Kalıcı (Perma Ban - Süresiz Yasaklama)</option>
              </select>
            </div>

            {/* Reason */}
            <div className="admin-form-group">
              <label className="admin-form-label">Yasaklama Gerekçesi</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="admin-form-input"
                placeholder="Örn: DDoS saldırı kaynağı, sahte sipariş denemesi, bot spamı"
              />
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setIsBanModalOpen(false)}
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="admin-btn-primary"
              style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <IconBan size={15} /> Kısıtlamayı Uygula &amp; Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
