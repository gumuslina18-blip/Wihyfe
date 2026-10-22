import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { IconKey, IconCheck, IconX, IconCopy, IconTrash, IconPlus } from '../AdminIcons';

export default function PinManagerView() {
  const { pins, deletePin, setIsPinModalOpen, validatePinSimulator, showToast } = useAdmin();
  const [testPinInput, setTestPinInput] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedPin, setCopiedPin] = useState<string | null>(null);

  const handleCopy = (pinCode: string) => {
    navigator.clipboard.writeText(pinCode);
    setCopiedPin(pinCode);
    showToast(`PIN "${pinCode}" panoya kopyalandı!`, 'success');
    setTimeout(() => setCopiedPin(null), 2500);
  };

  const handleTestPin = () => {
    if (!testPinInput.trim()) return;
    const res = validatePinSimulator(testPinInput);
    setTestResult(res);
  };

  return (
    <div className="admin-view-body">
      {/* Top Info Banner */}
      <div className="admin-card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.05))', borderColor: 'rgba(139, 92, 246, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IconKey size={18} color="var(--admin-accent-purple)" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                İstemci İndirme PIN Yetkilendirme Sistemi
              </h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', margin: 0, maxWidth: '750px' }}>
              Masaüstü uygulamamızı / tarama istemcimizi yalnızca bu panelden oluşturulan geçerli ve aktif PIN koduna sahip kullanıcılar indirebilir. Oluşturulmamış veya kullanım kotası dolmuş hiçbir PIN ile indirme yapılamaz.
            </p>
          </div>

          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => setIsPinModalOpen(true)}
          >
            <IconPlus size={14} strokeWidth={2.5} />
            <span>+ Yeni PIN Oluştur</span>
          </button>
        </div>
      </div>

      {/* PIN Verification Live Simulator */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title-group">
            <h3 className="admin-card-title" style={{ fontSize: '0.9rem' }}>
              <span>Canlı PIN İndirme Doğrulama Testi</span>
            </h3>
            <span className="admin-card-desc">
              Kullanıcının indirme sayfasında gireceği PIN kodunun indirme yetkisini anında simüle edin.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', maxWidth: '520px' }}>
          <input
            type="text"
            placeholder="Test edilecek PIN (örn: VOID64, WHF892)..."
            value={testPinInput}
            onChange={(e) => {
              setTestPinInput(e.target.value.toUpperCase());
              setTestResult(null);
            }}
            className="admin-form-input"
            style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}
          />
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={handleTestPin}
            style={{ whiteSpace: 'nowrap' }}
          >
            Doğrula &amp; Kontrol Et
          </button>
        </div>

        {testResult && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: testResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: testResult.success ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
              color: testResult.success ? '#6ee7b7' : '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>{testResult.success ? <IconCheck size={14} color="#10b981" /> : <IconX size={14} color="#ef4444" />}</span>
            <span>{testResult.message}</span>
          </div>
        )}
      </div>

      {/* PINs List Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title-group">
            <h3 className="admin-card-title">Oluşturulan İndirme PIN Kodları</h3>
            <span className="admin-card-desc">Sistemde kayıtlı toplam {pins.length} PIN kodu</span>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>PIN Kodu</th>
                <th>Lisans Paketi / Plan</th>
                <th>Kullanım Limiti</th>
                <th>Durum</th>
                <th>Atanan Kişi / Not</th>
                <th>Oluşturan Yetkili</th>
                <th>Son Geçerlilik</th>
                <th style={{ textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {pins.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        color: '#c4b5fd',
                        background: 'rgba(139, 92, 246, 0.15)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '5px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}>
                        {p.pin}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(p.pin)}
                        className="admin-action-btn"
                        title="PIN Kodunu Kopyala"
                        style={{ padding: '0.2rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        {copiedPin === p.pin ? (
                          <>
                            <IconCheck size={12} color="#10b981" /> Kopyalandı
                          </>
                        ) : (
                          <>
                            <IconCopy size={12} /> Kopyala
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: '#fff', fontWeight: 500, fontSize: '0.8rem' }}>
                      {p.targetApp}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ color: '#fff', fontWeight: 700 }}>{p.currentUses}</span>
                      <span style={{ color: 'var(--admin-text-dim)' }}>/</span>
                      <span style={{ color: 'var(--admin-text-muted)' }}>{p.maxUses >= 999 ? '∞' : p.maxUses}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background:
                        p.status === 'Aktif'
                          ? 'rgba(16, 185, 129, 0.2)'
                          : p.status === 'Kullanıldı'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(239, 68, 68, 0.2)',
                      color:
                        p.status === 'Aktif'
                          ? '#6ee7b7'
                          : p.status === 'Kullanıldı'
                          ? '#93c5fd'
                          : '#fca5a5',
                    }}>
                      ● {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#fff', fontSize: '0.78rem' }}>{p.assignedUser || 'Genel Dağıtım'}</span>
                      {p.note && (
                        <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-dim)' }}>{p.note}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{ color: '#c4b5fd', fontSize: '0.75rem', fontWeight: 500 }}>
                      {p.createdBy}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.74rem', color: 'var(--admin-text-dim)' }}>
                    {p.expiresAt}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="admin-action-btn danger"
                      onClick={() => {
                        if (window.confirm(`"${p.pin}" PIN kodunu silmek istediğinizden emin misiniz?`)) {
                          deletePin(p.id);
                        }
                      }}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
