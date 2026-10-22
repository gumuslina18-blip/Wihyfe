'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { IconKey, IconX, IconRefresh, IconCheck } from '../AdminIcons';

export default function CreatePinModal() {
  const { isPinModalOpen, setIsPinModalOpen, createPin } = useAdmin();

  const [pin, setPin] = useState(() => {
    // Generate random 6-character alphanumeric code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'WHF';
    for (let i = 0; i < 3; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  });

  const [targetApp, setTargetApp] = useState<'Free' | 'Plus' | 'Plus+'>('Plus+');
  const [maxUses, setMaxUses] = useState(1);
  const [expiresAt, setExpiresAt] = useState('31.12.2026');
  const [assignedUser, setAssignedUser] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isPinModalOpen) return null;

  const handleRandomize = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'W';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPin(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setIsSubmitting(true);
    const res = await createPin({
      pin,
      targetApp,
      maxUses,
      expiresAt,
      assignedUser: assignedUser.trim() || undefined,
      note: note.trim() || undefined,
    });

    setIsSubmitting(false);
    if (res.success) {
      setIsPinModalOpen(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={() => setIsPinModalOpen(false)}>
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">
            <IconKey size={18} color="var(--admin-accent-purple)" />
            <span>Yeni İndirme PIN Kodu Oluştur</span>
          </h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={() => setIsPinModalOpen(false)}
          >
            <IconX size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            {/* PIN Kodu Input + Rastgele Üret Butonu */}
            <div className="admin-form-group">
              <label className="admin-form-label">PIN Kodu (6 Haneli)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  required
                  maxLength={8}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.toUpperCase())}
                  className="admin-form-input"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                  placeholder="WHF892"
                />
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={handleRandomize}
                  style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  title="Yeni rastgele PIN kodu üret"
                >
                  <IconRefresh size={13} />
                  <span>Rastgele Kod</span>
                </button>
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-dim)' }}>
                Kullanıcı bu PIN kodunu /indir sayfasında girerek masaüstü uygulamasını indirebilir.
              </span>
            </div>

            {/* Lisans Paketi / Plan Türü */}
            <div className="admin-form-group">
              <label className="admin-form-label">Lisans Paketi / Plan Türü</label>
              <select
                value={targetApp}
                onChange={(e) => setTargetApp(e.target.value as 'Free' | 'Plus' | 'Plus+')}
                className="admin-form-select"
              >
                <option value="Free">Free Lisansı</option>
                <option value="Plus">Plus Lisansı</option>
                <option value="Plus+">Plus+ Lisansı</option>
              </select>
            </div>

            {/* Kullanım Sınırı */}
            <div className="admin-form-group">
              <label className="admin-form-label">Maksimum Kullanım Limiti</label>
              <select
                value={maxUses}
                onChange={(e) => setMaxUses(Number(e.target.value))}
                className="admin-form-select"
              >
                <option value={1}>1 Kullanım (Tek Seferlik - Önerilen)</option>
                <option value={5}>5 Kullanım (Grup / Ekip)</option>
                <option value={10}>10 Kullanım (Büyük Sunucu)</option>
                <option value={999}>Sınırsız Kullanım (Genel Dağıtım)</option>
              </select>
            </div>

            {/* Son Geçerlilik Tarihi */}
            <div className="admin-form-group">
              <label className="admin-form-label">Son Geçerlilik Tarihi</label>
              <input
                type="text"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="admin-form-input"
                placeholder="31.12.2026"
              />
            </div>

            {/* Atanan Kullanıcı / Discord */}
            <div className="admin-form-group">
              <label className="admin-form-label">Atanan Müşteri (Opsiyonel)</label>
              <input
                type="text"
                value={assignedUser}
                onChange={(e) => setAssignedUser(e.target.value)}
                className="admin-form-input"
                placeholder="Örn: lunaalvine veya Gumus"
              />
            </div>

            {/* Not */}
            <div className="admin-form-group">
              <label className="admin-form-label">Açıklama / Yetkili Notu</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="admin-form-input"
                placeholder="Örn: Discord üzerinden satın alan müşteriye özel"
              />
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setIsPinModalOpen(false)}
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="admin-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {isSubmitting ? (
                'Oluşturuluyor...'
              ) : (
                <>
                  <IconCheck size={14} /> PIN Kodunu Kaydet &amp; Aktifleştir
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
