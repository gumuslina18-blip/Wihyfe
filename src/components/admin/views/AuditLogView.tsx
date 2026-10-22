'use client';

import React, { useMemo, useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { AuditCategory } from '@/types/admin';
import { downloadCsv } from '@/lib/adminUtils';
import { IconList, IconDownload, IconTrash } from '../AdminIcons';

const CATEGORIES: { id: 'all' | AuditCategory; label: string; color: string }[] = [
  { id: 'all', label: 'Tümü', color: '#93c5fd' },
  { id: 'sipariş', label: 'Sipariş', color: '#0878FF' },
  { id: 'ürün', label: 'Ürün', color: '#38bdf8' },
  { id: 'kullanıcı', label: 'Kullanıcı', color: '#34d399' },
  { id: 'yetki', label: 'Yetki', color: '#f59e0b' },
  { id: 'pin', label: 'PIN', color: '#10b981' },
  { id: 'güvenlik', label: 'Güvenlik', color: '#f87171' },
  { id: 'finans', label: 'Finans', color: '#fbbf24' },
  { id: 'sistem', label: 'Sistem', color: '#94a3b8' },
];

const colorOf = (c: string) => CATEGORIES.find((x) => x.id === c)?.color || '#94a3b8';

export default function AuditLogView() {
  const { auditLogs, clearAuditLogs, showToast } = useAdmin();
  const [category, setCategory] = useState<'all' | AuditCategory>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return auditLogs.filter((l) => {
      const okCat = category === 'all' || l.category === category;
      const okQ = !q || `${l.action} ${l.details} ${l.staff}`.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [auditLogs, category, query]);

  const exportCsv = () => {
    downloadCsv(
      `denetim-gunlugu-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Tarih', 'Yetkili', 'Kategori', 'İşlem', 'Detay'],
      filtered.map((l) => [l.at, l.staff, l.category, l.action, l.details])
    );
    showToast(`${filtered.length} kayıt CSV olarak indirildi.`, 'success');
  };

  return (
    <div className="admin-view-body">
      <div className="admin-card">
        <div className="admin-hud-corner admin-hud-corner-tl" aria-hidden="true" />
        <div className="admin-hud-corner admin-hud-corner-tr" aria-hidden="true" />
        <div className="admin-hud-corner admin-hud-corner-bl" aria-hidden="true" />
        <div className="admin-hud-corner admin-hud-corner-br" aria-hidden="true" />

        <div className="admin-card-header">
          <div className="admin-card-title-group">
            <h2 className="admin-card-title">
              <IconList size={18} color="var(--admin-accent-purple)" />
              <span>Denetim Günlüğü</span>
            </h2>
            <span className="admin-card-desc">
              Panelde yapılan her işlem (kim, ne zaman, ne yaptı) ve siteden gelen gerçek siparişler burada kayıtlanır. Kayıtlar bu tarayıcıda saklanır (son 500).
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="admin-btn-secondary" onClick={exportCsv} disabled={filtered.length === 0}>
              <IconDownload size={14} /> <span>CSV İndir</span>
            </button>
            <button
              type="button"
              className="admin-btn-secondary"
              disabled={auditLogs.length === 0}
              onClick={() => {
                if (window.confirm('Tüm denetim kayıtları silinsin mi? Bu işlem geri alınamaz.')) {
                  clearAuditLogs();
                  showToast('Denetim günlüğü temizlendi.', 'info');
                }
              }}
            >
              <IconTrash size={14} /> <span>Temizle</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="admin-timeframe-pills" style={{ flexWrap: 'wrap' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`admin-tf-btn ${category === c.id ? 'active' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div style={{ minWidth: '240px' }}>
            <input
              id="admin-audit-search"
              type="text"
              className="admin-form-input"
              style={{ padding: '0.45rem 0.75rem' }}
              placeholder="İşlem, detay veya yetkili ara…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Yetkili</th>
                <th>Kategori</th>
                <th>İşlem</th>
                <th>Detay</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--admin-text-dim)' }}>
                    {auditLogs.length === 0
                      ? 'Henüz kayıt yok. Ürün, sipariş, kullanıcı, PIN veya güvenlik alanında bir işlem yaptığınızda burada listelenir.'
                      : 'Filtreyle eşleşen kayıt bulunamadı.'}
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id}>
                    <td style={{ whiteSpace: 'nowrap', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.74rem' }}>{l.at}</td>
                    <td style={{ color: '#c4b5fd', fontWeight: 600 }}>{l.staff}</td>
                    <td>
                      <span
                        className="admin-chip"
                        style={{ color: colorOf(l.category), borderColor: `${colorOf(l.category)}55`, textTransform: 'capitalize' }}
                      >
                        {l.category}
                      </span>
                    </td>
                    <td style={{ color: '#fff', fontWeight: 600 }}>{l.action}</td>
                    <td style={{ maxWidth: '420px' }}>{l.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
