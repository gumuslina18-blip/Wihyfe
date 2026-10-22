'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';

import { IconWallet, IconX, IconCheck } from '../AdminIcons';

export default function BalanceModal() {
  const {
    isBalanceModalOpen,
    setIsBalanceModalOpen,
    balanceTargetUser,
    setBalanceTargetUser,
    users,
    modifyUserBalance,
  } = useAdmin();

  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [actionType, setActionType] = useState<'add' | 'deduct'>('add');
  const [amount, setAmount] = useState<number>(500);
  const [reason, setReason] = useState('Manuel bakiye düzenlemesi / Yetkili işlemi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (balanceTargetUser && users.some((u) => u.id === balanceTargetUser.id)) {
      setSelectedUserId(balanceTargetUser.id);
    } else if (users.length > 0) {
      // Target active user with balance first (e.g. Luna), or first user
      const preferred = users.find((u) => (Number(u.balance) || 0) > 0) || users[0];
      setSelectedUserId(preferred.id);
      setBalanceTargetUser(preferred);
    }
  }, [balanceTargetUser, users, isBalanceModalOpen, setBalanceTargetUser]);

  if (!isBalanceModalOpen) return null;

  const currentSelectedUser = users.find((u) => u.id === selectedUserId) || balanceTargetUser;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Math.abs(Number(amount));
    if (!selectedUserId || isNaN(numAmount) || numAmount <= 0) return;

    setIsSubmitting(true);
    try {
      const ok = await modifyUserBalance(selectedUserId, numAmount, actionType, reason);
      if (ok) {
        setIsBalanceModalOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={() => setIsBalanceModalOpen(false)}>
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">
            <IconWallet size={18} color="var(--admin-accent-purple)" />
            <span>Kullanıcı Cüzdan / Bakiye İşlemi</span>
          </h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={() => setIsBalanceModalOpen(false)}
          >
            <IconX size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            {/* User Selector */}
            <div className="admin-form-group">
              <label className="admin-form-label">Hedef Kullanıcı</label>
              <select
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  const found = users.find((u) => u.id === e.target.value);
                  if (found) setBalanceTargetUser(found);
                }}
                className="admin-form-select"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}#{u.discriminator} ({u.role} • ₺{u.balance.toLocaleString('tr-TR')})
                  </option>
                ))}
              </select>
            </div>

            {currentSelectedUser && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--admin-text-muted)' }}>Mevcut Bakiye:</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>₺{currentSelectedUser.balance.toLocaleString('tr-TR')}</span>
              </div>
            )}

            {/* Action Type */}
            <div className="admin-form-group">
              <label className="admin-form-label">İşlem Türü</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <button
                  type="button"
                  className={`admin-action-btn ${actionType === 'add' ? 'primary' : ''}`}
                  onClick={() => setActionType('add')}
                  style={{ justifyContent: 'center', padding: '0.65rem' }}
                >
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>+ Bakiye Ekle</span>
                </button>
                <button
                  type="button"
                  className={`admin-action-btn ${actionType === 'deduct' ? 'danger' : ''}`}
                  onClick={() => setActionType('deduct')}
                  style={{ justifyContent: 'center', padding: '0.65rem' }}
                >
                  <span style={{ color: '#f87171', fontWeight: 700, fontSize: '0.9rem' }}>- Bakiye Sil / Kes</span>
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="admin-form-group">
              <label className="admin-form-label">Tutar (₺)</label>
              <input
                type="number"
                required
                min={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="admin-form-input"
                placeholder="500"
              />
            </div>

            {/* Reason */}
            <div className="admin-form-group">
              <label className="admin-form-label">İşlem Gerekçesi (Audit Log İçin)</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="admin-form-input"
                placeholder="Örn: Discord sunucu hediyesi / Destek telafisi / Hatalı bakiye iadesi"
              />
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setIsBalanceModalOpen(false)}
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="admin-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', opacity: isSubmitting ? 0.6 : 1 }}
            >
              <IconCheck size={14} /> {isSubmitting ? 'Kaydediliyor...' : 'Bakiyeyi Güncelle & Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
