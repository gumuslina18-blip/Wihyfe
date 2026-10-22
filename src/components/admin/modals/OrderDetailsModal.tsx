'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { DeliveryStatus } from '@/types/admin';
import { IconBox, IconX, IconCheck } from '../AdminIcons';

export default function OrderDetailsModal() {
  const { isOrderModalOpen, setIsOrderModalOpen, selectedOrder, updateOrderStatus } = useAdmin();

  const [status, setStatus] = useState<DeliveryStatus>('Beklemede');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedOrder) {
      setStatus(selectedOrder.status);
      setNotes(selectedOrder.notes || '');
    }
  }, [selectedOrder, isOrderModalOpen]);

  if (!isOrderModalOpen || !selectedOrder) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrderStatus(selectedOrder.id, status, notes.trim());
    setIsOrderModalOpen(false);
  };

  return (
    <div className="admin-modal-overlay" onClick={() => setIsOrderModalOpen(false)}>
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">
            <IconBox size={18} color="var(--admin-accent-purple)" />
            <span>Sipariş &amp; Teslimat Detayları ({selectedOrder.id})</span>
          </h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={() => setIsOrderModalOpen(false)}
          >
            <IconX size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            {/* Order Summary Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0.85rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '0.78rem' }}>
              <div>
                <span style={{ color: 'var(--admin-text-dim)' }}>Müşteri:</span>
                <div style={{ color: '#fff', fontWeight: 600 }}>{selectedOrder.customerName}</div>
                <div style={{ color: 'var(--admin-text-dim)', fontSize: '0.7rem' }}>{selectedOrder.customerDiscord}</div>
              </div>
              <div>
                <span style={{ color: 'var(--admin-text-dim)' }}>Tutar &amp; Yöntem:</span>
                <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.95rem' }}>
                  ₺{selectedOrder.amount.toLocaleString('tr-TR')}
                </div>
                <div style={{ color: '#93c5fd', fontSize: '0.7rem' }}>{selectedOrder.paymentMethod}</div>
              </div>
              <div>
                <span style={{ color: 'var(--admin-text-dim)' }}>Ürün:</span>
                <div style={{ color: '#fff', fontWeight: 600 }}>{selectedOrder.productName}</div>
              </div>
              <div>
                <span style={{ color: 'var(--admin-text-dim)' }}>Sipariş Tarihi:</span>
                <div style={{ color: '#fff' }}>{selectedOrder.createdAt}</div>
              </div>
            </div>

            {/* Deposit Info Notice */}
            {(selectedOrder.id.startsWith('DEP-') || selectedOrder.productName.toLowerCase().includes('bakiye')) && (
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '0.75rem', marginTop: '0.75rem', fontSize: '0.78rem', color: '#bae6fd' }}>
                <strong style={{ color: '#38bdf8' }}>💰 Cüzdan Bakiye Yükleme Siparişi:</strong>
                <p style={{ marginTop: '0.25rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  Bu siparişi <strong>&quot;Tamamlandı&quot;</strong> yaptığınızda <strong>₺{selectedOrder.amount.toLocaleString('tr-TR')}</strong> müşterinin ({selectedOrder.customerName}) cüzdan bakiyesine anında eklenecektir.
                </p>
              </div>
            )}

            {/* Delivery Status Selector */}
            <div className="admin-form-group">
              <label className="admin-form-label">Teslimat Aşaması</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DeliveryStatus)}
                className="admin-form-select"
              >
                <option value="Beklemede">Beklemede (Ödeme kontrol ediliyor / onay sırası)</option>
                <option value="İşlemde">İşlemde (İşlem gerçekleştiriliyor)</option>
                <option value="Tamamlandı">
                  {(selectedOrder.id.startsWith('DEP-') || selectedOrder.productName.toLowerCase().includes('bakiye'))
                    ? 'Tamamlandı (Bakiyeyi Onayla ve Cüzdana Yükle)'
                    : 'Tamamlandı (Bot/web sitesi müşteriye teslim edildi)'}
                </option>
                <option value="İptal Edildi">
                  {(selectedOrder.id.startsWith('DEP-') || selectedOrder.productName.toLowerCase().includes('bakiye'))
                    ? 'İptal Edildi (Bakiye Yükleme Talebini Reddet)'
                    : 'İptal Edildi (Sipariş iade edildi veya kapatıldı)'}
                </option>
              </select>
            </div>

            {/* Delivery Notes */}
            <div className="admin-form-group">
              <label className="admin-form-label">Teslimat Notu &amp; Lisans Bilgileri</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="admin-form-textarea"
                placeholder="Örn: Bot tokeni müşterinin Discord sunucusuna kuruldu. Whitelist onaylandı."
                rows={3}
              />
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setIsOrderModalOpen(false)}
            >
              Kapat
            </button>
            <button
              type="submit"
              className="admin-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <IconCheck size={14} /> Teslimat Durumunu Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
