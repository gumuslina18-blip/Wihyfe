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

  const [targetApp, setTargetApp] = useState<string>('Discord Full Pack - 1 Aylık');
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

            {/* Lisans Paketi / Satın Alınan Plan Tagı */}
            <div className="admin-form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="admin-form-label" style={{ margin: 0 }}>Satın Alınan İlan / Lisans Planı</label>
                <span style={{ fontSize: '0.68rem', color: '#c084fc', fontWeight: 600 }}>Özel Müşteri Paneli Açılır</span>
              </div>
              <select
                value={targetApp}
                onChange={(e) => setTargetApp(e.target.value)}
                className="admin-form-select"
              >
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

                <optgroup label="Standart Lisanslar">
                  <option value="Free">Free Lisansı</option>
                  <option value="Plus">Plus Lisansı</option>
                  <option value="Plus+">Plus+ Lisansı</option>
                </optgroup>
              </select>

              <div style={{ marginTop: '0.45rem' }}>
                <input
                  type="text"
                  placeholder="Veya özel plan tagı girin (Örn: Discord Full Pack - 1 Aylık)..."
                  value={targetApp}
                  onChange={(e) => setTargetApp(e.target.value)}
                  className="admin-form-input"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                />
              </div>
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
