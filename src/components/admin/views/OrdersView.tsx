'use client';

import React, { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { DeliveryStatus } from '@/types/admin';
import ReceiptModal, { ReceiptData } from '@/components/ReceiptModal';

import { IconCart, IconClock, IconActivity, IconCheck, IconX, IconSearch } from '../AdminIcons';

export default function OrdersView() {
  const { orders, updateOrderStatus, addOrder, setSelectedOrder, setIsOrderModalOpen, showToast } = useAdmin();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === 'all' || o.status.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerDiscord.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.productName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleStatusChange = (orderId: string, newStatus: DeliveryStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleOpenDetails = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  // Status counts
  const countPending = orders.filter((o) => o.status === 'Beklemede').length;
  const countProcessing = orders.filter((o) => o.status === 'İşlemde').length;
  const countCompleted = orders.filter((o) => o.status === 'Tamamlandı').length;
  const countCancelled = orders.filter((o) => o.status === 'İptal Edildi').length;

  return (
    <div className="admin-view-body">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title-group">
            <h2 className="admin-card-title">
              <IconCart size={18} color="var(--admin-accent-purple)" />
              <span>Satın Alma Geçmişi &amp; Teslimat Takibi</span>
            </h2>
            <span className="admin-card-desc">
              Siteden ve PayTR üzerinden gelen siparişlerin teslimat süreçlerini yönetin: Beklemede, İşlemde, Tamamlandı veya İptal.
            </span>
          </div>
        </div>

        {/* Filter Pills and Search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="admin-timeframe-pills" style={{ flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`admin-tf-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              Tümü ({orders.length})
            </button>
            <button
              type="button"
              className={`admin-tf-btn ${statusFilter === 'beklemede' ? 'active' : ''}`}
              onClick={() => setStatusFilter('beklemede')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <IconClock size={12} color="#f59e0b" />
              <span>Beklemede ({countPending})</span>
            </button>
            <button
              type="button"
              className={`admin-tf-btn ${statusFilter === 'işlemde' ? 'active' : ''}`}
              onClick={() => setStatusFilter('işlemde')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <IconActivity size={12} color="#3b82f6" />
              <span>İşlemde ({countProcessing})</span>
            </button>
            <button
              type="button"
              className={`admin-tf-btn ${statusFilter === 'tamamlandı' ? 'active' : ''}`}
              onClick={() => setStatusFilter('tamamlandı')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <IconCheck size={12} color="#10b981" />
              <span>Tamamlandı ({countCompleted})</span>
            </button>
            <button
              type="button"
              className={`admin-tf-btn ${statusFilter === 'iptal edildi' ? 'active' : ''}`}
              onClick={() => setStatusFilter('iptal edildi')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <IconX size={12} color="#ef4444" />
              <span>İptal ({countCancelled})</span>
            </button>
          </div>

          <div style={{ minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Sipariş no, müşteri veya ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-form-input"
              style={{ padding: '0.45rem 0.75rem' }}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sipariş No</th>
                <th>Müşteri Bilgisi</th>
                <th>Satın Alınan Ürün</th>
                <th>Tutar &amp; Ödeme</th>
                <th>Teslimat Durumu</th>
                <th>Tarih</th>
                <th style={{ textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-dim)' }}>
                    Henüz kayıtlı bir sipariş bulunmuyor. Siteden verilen siparişler ve PayTR bildirimleri burada anında listelenecektir.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const isDeposit = o.id.startsWith('DEP-') || o.productName.toLowerCase().includes('bakiye');

                  return (
                    <tr key={o.id}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#fff' }}>{o.id}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#fff', fontWeight: 600 }}>{o.customerName}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>{o.customerDiscord}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span style={{ color: '#fff', fontWeight: 500 }}>{o.productName}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)' }}>{o.category}</span>
                            {isDeposit && (
                              <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 600 }}>
                                💰 Cüzdan Bakiye Yükleme
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#fff', fontWeight: 700 }}>₺{o.amount.toLocaleString('tr-TR')}</span>
                          <span style={{ fontSize: '0.7rem', color: '#93c5fd' }}>{o.paymentMethod}</span>
                        </div>
                      </td>
                      <td>
                        {/* Live interactive status dropdown */}
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as DeliveryStatus)}
                          className={`status-pill ${o.status.toLowerCase().replace(/\s+/g, '')}`}
                          style={{
                            cursor: 'pointer',
                            border: 'none',
                            outline: 'none',
                            background:
                              o.status === 'Beklemede'
                                ? 'rgba(245, 158, 11, 0.2)'
                                : o.status === 'İşlemde'
                                ? 'rgba(59, 130, 246, 0.2)'
                                : o.status === 'Tamamlandı'
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'rgba(239, 68, 68, 0.2)',
                          }}
                        >
                          <option value="Beklemede" style={{ background: '#111622', color: '#fcd34d' }}>Beklemede</option>
                          <option value="İşlemde" style={{ background: '#111622', color: '#93c5fd' }}>İşlemde</option>
                          <option value="Tamamlandı" style={{ background: '#111622', color: '#6ee7b7' }}>Tamamlandı</option>
                          <option value="İptal Edildi" style={{ background: '#111622', color: '#fca5a5' }}>İptal Edildi</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{o.createdAt}</span>
                          {o.deliveryTime && (
                            <span style={{ fontSize: '0.68rem', color: '#10b981' }}>Teslim: {o.deliveryTime}</span>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="admin-action-btn-group" style={{ justifyContent: 'flex-end', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {isDeposit && o.status === 'Beklemede' && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  handleStatusChange(o.id, 'Tamamlandı');
                                  showToast(`${o.customerName} kullanıcısının ₺${o.amount.toLocaleString('tr-TR')} bakiye talebi onaylandı ve bakiyesine eklendi!`, 'success');
                                }}
                                style={{
                                  background: '#10b981',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '0.32rem 0.65rem',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
                                }}
                                title="Bakiyeyi onayla ve müşterinin hesabına yükle"
                              >
                                <IconCheck size={12} strokeWidth={2.5} />
                                <span>Bakiyeyi Onayla</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`${o.customerName} kullanıcısının ₺${o.amount.toLocaleString('tr-TR')} bakiye talebini reddetmek istediğinize emin misiniz?`)) {
                                    handleStatusChange(o.id, 'İptal Edildi');
                                    showToast(`${o.customerName} kullanıcısının bakiye talebi reddedildi.`, 'info');
                                  }
                                }}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  color: '#f87171',
                                  border: '1px solid rgba(239, 68, 68, 0.35)',
                                  borderRadius: '6px',
                                  padding: '0.32rem 0.5rem',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                                title="Talebi reddet"
                              >
                                <IconX size={12} strokeWidth={2.5} />
                                <span>Reddet</span>
                              </button>
                            </>
                          )}
                          {isDeposit && o.status === 'Tamamlandı' && (
                            <span style={{ fontSize: '0.68rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.22rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.25)', fontWeight: 600 }}>
                              ✓ Bakiye Tanımlandı
                            </span>
                          )}
                          {isDeposit && o.status === 'İptal Edildi' && (
                            <span style={{ fontSize: '0.68rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', padding: '0.22rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.25)', fontWeight: 600 }}>
                              ✕ Talep Reddedildi
                            </span>
                          )}
                          <button
                            type="button"
                            className="admin-action-btn"
                            style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}
                            onClick={() => {
                              setSelectedReceipt({
                                orderId: o.id,
                                date: o.createdAt,
                                customerName: o.customerName || 'Müşteri',
                                customerDiscordId: o.customerDiscord,
                                serverName: o.notes || 'Discord Sunucusu',
                                paymentMethod: o.paymentMethod,
                                items: [
                                  {
                                    name: o.productName,
                                    periodLabel: 'Aylık',
                                    price: `₺${o.amount.toLocaleString('tr-TR')}`,
                                  },
                                ],
                                totalFormatted: o.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 }),
                                deliveryStatus: o.status,
                                notes: o.notes,
                              });
                            }}
                            title="Yazdırılabilir E-Fatura / E-Dekont Görüntüle"
                          >
                            📄 Dekont
                          </button>
                          <button
                            type="button"
                            className="admin-action-btn primary"
                            onClick={() => handleOpenDetails(o)}
                            title="Teslimat Detayları & Not"
                          >
                            Detaylar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <ReceiptModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
