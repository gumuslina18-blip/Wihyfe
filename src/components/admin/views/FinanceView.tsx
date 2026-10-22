'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { IconWallet, IconPlus, IconMinus, IconZap, IconCart, IconCheck, IconX } from '../AdminIcons';

interface DepositRequestItem {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: string;
  createdAt: string;
  updatedAt?: string;
}

export default function FinanceView() {
  const {
    users,
    financeLogs,
    setIsBalanceModalOpen,
    setBalanceTargetUser,
    modifyUserBalance,
    showToast,
    currentStaff,
    refreshUsers,
  } = useAdmin();

  const [filterType, setFilterType] = useState<string>('all');
  const [depositRequests, setDepositRequests] = useState<DepositRequestItem[]>([]);
  const [isLoadingDeposits, setIsLoadingDeposits] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Fetch deposit requests from backend
  const fetchDeposits = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/deposits', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.depositRequests)) {
          setDepositRequests(data.depositRequests);
        }
      }
    } catch (e) {
      console.error('Failed to load deposit requests', e);
    }
  }, []);

  useEffect(() => {
    fetchDeposits();
    refreshUsers();
    const interval = setInterval(() => {
      fetchDeposits();
      refreshUsers();
    }, 8000);
    return () => clearInterval(interval);
  }, [fetchDeposits, refreshUsers]);

  // Total balance currently held by users
  const totalUserBalance = useMemo(() => {
    return users.reduce((acc, u) => acc + (Number(u.balance) || 0), 0);
  }, [users]);

  // Real total added balance (Approved PayTR deposits + manual additions)
  const totalDeposited = useMemo(() => {
    const approvedDepositsSum = depositRequests
      .filter((d) => d.status === 'approved')
      .reduce((acc, d) => acc + (Number(d.amount) || 0), 0);

    const manualAdditionsSum = financeLogs
      .filter((f) => f.type === 'add' && !f.reason?.toLowerCase().includes('paytr'))
      .reduce((acc, f) => {
        const val = Number(f.amount) || 0;
        return val > 0 && val < 50000000 ? acc + val : acc;
      }, 0);

    return approvedDepositsSum + manualAdditionsSum;
  }, [depositRequests, financeLogs]);

  // Pending deposit requests count & sum
  const pendingDeposits = useMemo(() => {
    return depositRequests.filter((d) => d.status === 'pending');
  }, [depositRequests]);

  const pendingDepositsTotal = useMemo(() => {
    return pendingDeposits.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
  }, [pendingDeposits]);

  // Total deducted / spent
  const totalDeducted = useMemo(() => {
    return financeLogs
      .filter((f) => f.type === 'deduct' || f.type === 'purchase')
      .reduce((acc, f) => {
        const val = Number(f.amount) || 0;
        return val > 0 && val < 50000000 ? acc + val : acc;
      }, 0);
  }, [financeLogs]);

  const filteredLogs = useMemo(() => {
    const validLogs = financeLogs
      .map((f) => ({
        ...f,
        amount: Number(f.amount) || 0,
        previousBalance: Number(f.previousBalance) || 0,
        newBalance: Number(f.newBalance) || 0,
      }))
      .filter((f) => f.amount > 0 && f.amount < 50000000);

    if (filterType === 'all') return validLogs;
    return validLogs.filter((f) => f.type === filterType);
  }, [financeLogs, filterType]);

  const handleOpenBalanceModal = () => {
    const target = users.find((u) => u.balance > 0) || users[0] || null;
    setBalanceTargetUser(target);
    setIsBalanceModalOpen(true);
  };

  // Approve a pending deposit request
  const handleApproveDeposit = async (req: DepositRequestItem) => {
    try {
      setActionInProgress(req.id);
      const res = await fetch('/api/admin/deposits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: req.id,
          action: 'approve',
          staffName: currentStaff.username,
        }),
      });

      if (res.ok) {
        await refreshUsers();
        await fetchDeposits();

        showToast(
          `${req.userName} kullanıcısının ₺${req.amount.toLocaleString('tr-TR')} tutarındaki bakiye talebi onaylandı ve bakiyesine eklendi!`,
          'success'
        );
      }
    } catch (e: any) {
      showToast('İşlem başarısız: ' + e.message, 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  // Reject a deposit request
  const handleRejectDeposit = async (req: DepositRequestItem) => {
    if (!confirm(`${req.userName} kullanıcısının ₺${req.amount.toLocaleString('tr-TR')} talebini reddetmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      setActionInProgress(req.id);
      const res = await fetch('/api/admin/deposits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: req.id,
          action: 'reject',
          staffName: currentStaff.username,
        }),
      });

      if (res.ok) {
        setDepositRequests((prev) =>
          prev.map((d) => (d.id === req.id ? { ...d, status: 'rejected' } : d))
        );
        showToast(`${req.userName} kullanıcısının talebi reddedildi.`, 'info');
      }
    } catch (e: any) {
      showToast('İşlem başarısız: ' + e.message, 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  // Delete a deposit request
  const handleDeleteDeposit = async (id: string) => {
    try {
      setActionInProgress(id);
      const res = await fetch('/api/admin/deposits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'delete' }),
      });
      if (res.ok) {
        setDepositRequests((prev) => prev.filter((d) => d.id !== id));
        showToast('Talep kaydı silindi.', 'info');
      }
    } catch (e: any) {
      showToast('Silinemedi: ' + e.message, 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="admin-view-body">
      {/* Top Financial KPI Metrics */}
      <div className="admin-metric-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">Kullanıcı Cüzdan Toplamı</span>
            <div className="admin-metric-icon" style={{ color: '#10b981' }}>
              <IconWallet size={16} />
            </div>
          </div>
          <div className="admin-metric-value">₺{totalUserBalance.toLocaleString('tr-TR')}</div>
          <div className="admin-metric-sub">{users.length} kayıtlı cüzdanda mevcut</div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">Bekleyen Bakiye Talepleri</span>
            <div className="admin-metric-icon" style={{ color: pendingDeposits.length > 0 ? '#f59e0b' : '#3b82f6' }}>
              <IconZap size={16} />
            </div>
          </div>
          <div className="admin-metric-value" style={{ color: pendingDeposits.length > 0 ? '#fbbf24' : '#60a5fa' }}>
            ₺{pendingDepositsTotal.toLocaleString('tr-TR')}
          </div>
          <div className="admin-metric-sub">
            {pendingDeposits.length > 0 ? (
              <strong style={{ color: '#fbbf24' }}>{pendingDeposits.length} onay bekleyen talep</strong>
            ) : (
              'Bekleyen talep yok'
            )}
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">Toplam Eklenen Bakiye</span>
            <div className="admin-metric-icon" style={{ color: '#3b82f6' }}>
              <IconPlus size={16} />
            </div>
          </div>
          <div className="admin-metric-value" style={{ color: '#60a5fa' }}>
            ₺{totalDeposited.toLocaleString('tr-TR')}
          </div>
          <div className="admin-metric-sub">Yetkili &amp; PayTR yüklemeleri</div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">Hızlı Kasa İşlemi</span>
            <div className="admin-metric-icon" style={{ color: '#c4b5fd' }}>
              <IconZap size={16} />
            </div>
          </div>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenBalanceModal}
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.2rem' }}
          >
            <IconPlus size={14} strokeWidth={2.5} />
            <span>Bakiye Ekle / Çıkar</span>
          </button>
        </div>
      </div>

      {/* NEW: Live Deposit Requests Section */}
      <div className="admin-card" style={{ border: pendingDeposits.length > 0 ? '1px solid rgba(245, 158, 11, 0.35)' : undefined }}>
        <div className="admin-card-header">
          <div className="admin-card-title-group">
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M7 15h0M2 10h20" />
              </svg>
              <span>Bakiye Yükleme Talepleri (PayTR 3D Secure / Bildirimler)</span>
              {pendingDeposits.length > 0 && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '999px',
                }}>
                  {pendingDeposits.length} BEKLEMEDE
                </span>
              )}
            </h2>
            <span className="admin-card-desc">
              Kullanıcıların site üzerinden oluşturduğu gerçek bakiye yükleme istekleri. Onaylandığı an kullanıcının bakiyesine işlenir.
            </span>
          </div>

          <button
            type="button"
            className="admin-btn-secondary"
            onClick={fetchDeposits}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            Yenile
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Talep ID</th>
                <th>Kullanıcı</th>
                <th>Yükleme Tutarı</th>
                <th>Ödeme Kanalı</th>
                <th>Durum</th>
                <th>Oluşturulma Tarihi</th>
                <th style={{ textAlign: 'right' }}>Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {depositRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--admin-text-dim)' }}>
                    Henüz kayıtlı bir bakiye yükleme talebi bulunmuyor.
                  </td>
                </tr>
              ) : (
                depositRequests.map((req) => {
                  const isPending = req.status === 'pending';
                  const isApproved = req.status === 'approved';
                  const isRejected = req.status === 'rejected';

                  return (
                    <tr key={req.id}>
                      <td>
                        <strong style={{ color: '#93c5fd', fontFamily: 'monospace' }}>#{req.id}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#fff', fontWeight: 600 }}>{req.userName}</span>
                          {req.userEmail && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-dim)' }}>{req.userEmail}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.95rem' }}>
                          ₺{req.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.72rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          background: 'rgba(88, 101, 242, 0.15)',
                          color: '#a5b4fc',
                          border: '1px solid rgba(88, 101, 242, 0.3)',
                          fontWeight: 600,
                        }}>
                          {req.paymentMethod}
                        </span>
                      </td>
                      <td>
                        {isPending && (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#fbbf24',
                            border: '1px solid rgba(245, 158, 11, 0.35)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}>
                            ⏳ Onay Bekliyor
                          </span>
                        )}
                        {isApproved && (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#34d399',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}>
                            ✓ Onaylandı &amp; Eklendi
                          </span>
                        )}
                        {isRejected && (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.35)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}>
                            ✕ Reddedildi
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{ color: 'var(--admin-text-dim)', fontSize: '0.74rem' }}>{req.createdAt}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isPending ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="admin-btn-primary"
                              disabled={actionInProgress === req.id}
                              onClick={() => handleApproveDeposit(req)}
                              style={{
                                fontSize: '0.72rem',
                                padding: '0.3rem 0.65rem',
                                background: '#10b981',
                                borderColor: '#059669',
                              }}
                              title="Talebi onayla ve kullanıcının cüzdanına bakiyeyi ekle"
                            >
                              <IconCheck size={12} strokeWidth={2.5} />
                              <span>Bakiyeyi Onayla</span>
                            </button>
                            <button
                              type="button"
                              className="admin-btn-secondary"
                              disabled={actionInProgress === req.id}
                              onClick={() => handleRejectDeposit(req)}
                              style={{
                                fontSize: '0.72rem',
                                padding: '0.3rem 0.55rem',
                                color: '#f87171',
                              }}
                              title="Talebi iptal et / reddet"
                            >
                              <IconX size={12} strokeWidth={2.5} />
                              <span>Reddet</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="admin-action-btn danger"
                            onClick={() => handleDeleteDeposit(req.id)}
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem' }}
                            title="Kaydı sil"
                          >
                            Sil
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Transactions Log Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title-group">
            <h2 className="admin-card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <span>Para &amp; Bakiye Hareketleri (Audit Logs)</span>
            </h2>
            <span className="admin-card-desc">
              Tüm bakiye ekleme, silme, iade ve alışveriş kayıtları kriptografik yetkili imzasıyla tutulur.
            </span>
          </div>

          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenBalanceModal}
          >
            + Yeni Bakiye Tanımla
          </button>
        </div>

        {/* Filter Pills */}
        <div className="admin-timeframe-pills" style={{ alignSelf: 'flex-start' }}>
          <button
            type="button"
            className={`admin-tf-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            Tüm İşlemler ({financeLogs.length})
          </button>
          <button
            type="button"
            className={`admin-tf-btn ${filterType === 'add' ? 'active' : ''}`}
            onClick={() => setFilterType('add')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <IconPlus size={12} /> Yüklenen / Eklenen
          </button>
          <button
            type="button"
            className={`admin-tf-btn ${filterType === 'deduct' ? 'active' : ''}`}
            onClick={() => setFilterType('deduct')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <IconMinus size={12} /> Kesilen / Silinen
          </button>
          <button
            type="button"
            className={`admin-tf-btn ${filterType === 'purchase' ? 'active' : ''}`}
            onClick={() => setFilterType('purchase')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <IconCart size={12} /> Sipariş Harcamaları
          </button>
        </div>

        {/* Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kullanıcı</th>
                <th>İşlem Türü</th>
                <th>Tutar</th>
                <th>Önceki → Yeni Bakiye</th>
                <th>İşlem Sebebi / Not</th>
                <th>İşlemi Yapan</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-dim)' }}>
                    Henüz bakiye işlemi veya harcama kaydı bulunmuyor. Bakiye yükleme/kesme işlemleri burada şeffaf bir şekilde listelenecektir.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{f.userName}</span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        background:
                          f.type === 'add'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : f.type === 'deduct'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : 'rgba(59, 130, 246, 0.2)',
                        color:
                          f.type === 'add'
                            ? '#6ee7b7'
                            : f.type === 'deduct'
                            ? '#fca5a5'
                            : '#93c5fd',
                      }}>
                        {f.type === 'add' ? (
                          '+ Bakiye Eklendi'
                        ) : f.type === 'deduct' ? (
                          '- Bakiye Silindi'
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <IconCart size={11} color="#93c5fd" />
                            <span>Sipariş Harcaması</span>
                          </span>
                        )}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        color: f.type === 'add' ? '#10b981' : '#f87171',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}>
                        {f.type === 'add' ? '+' : '-'}₺{f.amount.toLocaleString('tr-TR')}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--admin-text-dim)', fontSize: '0.75rem' }}>
                        ₺{f.previousBalance.toLocaleString('tr-TR')} →{' '}
                        <strong style={{ color: '#fff' }}>₺{f.newBalance.toLocaleString('tr-TR')}</strong>
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>{f.reason}</span>
                    </td>
                    <td>
                      <span style={{ color: '#c4b5fd', fontWeight: 600, fontSize: '0.75rem' }}>{f.staffName}</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--admin-text-dim)', fontSize: '0.74rem' }}>{f.timestamp}</span>
                    </td>
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
