'use client';

import React, { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { AdminProduct, ProductCategory } from '@/types/admin';
import {
  IconBox,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconCalendar,
  IconTag,
  IconCheck,
  IconClock,
} from '../AdminIcons';

type PeriodFilter = 'all' | 'monthly' | 'quarterly' | 'semi-annual' | 'annual';

export default function ProductsView() {
  const { products, deleteProduct, setEditingProduct, setIsProductModalOpen } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPeriodView, setSelectedPeriodView] = useState<PeriodFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleEdit = (prod: AdminProduct) => {
    setEditingProduct(prod);
    setIsProductModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const [productViewTab, setProductViewTab] = useState<'products' | 'coupons'>('products');
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponVal, setCouponVal] = useState('20');
  const [couponMin, setCouponMin] = useState('0');
  const [couponMax, setCouponMax] = useState('1000');
  const [couponDesc, setCouponDesc] = useState('');
  const [isSavingCoupon, setIsSavingCoupon] = useState(false);

  const fetchCoupons = React.useCallback(async () => {
    setIsLoadingCoupons(true);
    try {
      const res = await fetch('/api/coupons', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.coupons)) setCoupons(data.coupons);
      }
    } catch (e) {
      console.error('Failed to load coupons:', e);
    } finally {
      setIsLoadingCoupons(false);
    }
  }, []);

  React.useEffect(() => {
    if (productViewTab === 'coupons') {
      fetchCoupons();
    }
  }, [productViewTab, fetchCoupons]);

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      alert('Lütfen bir kupon kodu belirleyiniz.');
      return;
    }
    setIsSavingCoupon(true);
    try {
      const res = await fetch('/api/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase(),
          discountType: couponType,
          discountValue: Number(couponVal) || 10,
          minOrderAmount: Number(couponMin) || 0,
          maxUses: Number(couponMax) || 1000,
          description: couponDesc.trim() || 'Promosyon İndirim Kuponu',
          isActive: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.coupons) setCoupons(data.coupons);
        setIsCouponModalOpen(false);
        setCouponCode('');
        setCouponDesc('');
      } else {
        alert('Kupon kaydedilemedi.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingCoupon(false);
    }
  };

  const handleToggleCoupon = async (c: any) => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...c,
          isActive: !c.isActive,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.coupons) setCoupons(data.coupons);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!confirm(`"${code}" kuponunu silmek istediğinize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(code)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.coupons) setCoupons(data.coupons);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`"${name}" ürününü kalıcı olarak silmek istediğinizden emin misiniz?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="admin-view-body">
      {/* Top View Mode Switcher */}
      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setProductViewTab('products')}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: '10px',
            background: productViewTab === 'products' ? 'var(--admin-accent-purple, #8b5cf6)' : 'rgba(255, 255, 255, 0.05)',
            color: productViewTab === 'products' ? '#ffffff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: productViewTab === 'products' ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
          }}
        >
          <IconBox size={15} />
          <span>Ürün &amp; Paket Yönetimi ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setProductViewTab('coupons')}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: '10px',
            background: productViewTab === 'coupons' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.05)',
            color: productViewTab === 'coupons' ? '#ffffff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: productViewTab === 'coupons' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            boxShadow: productViewTab === 'coupons' ? '0 0 15px rgba(16, 185, 129, 0.35)' : 'none',
          }}
        >
          <IconTag size={15} />
          <span>🏷️ İndirim Kuponları &amp; Promosyonlar ({coupons.length})</span>
        </button>
      </div>

      {productViewTab === 'coupons' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title-group">
                <h2 className="admin-card-title">
                  <IconTag size={18} color="#10b981" />
                  <span>İndirim Kuponu &amp; Promosyon Yönetimi</span>
                </h2>
                <span className="admin-card-desc">
                  Müşterilerin sepet aşamasında kullanabileceği yüzdelik (%) ve sabit tutarlı (₺) indirim kuponlarını canlı yönetin.
                </span>
              </div>

              <button
                type="button"
                className="admin-btn-primary"
                onClick={() => setIsCouponModalOpen(true)}
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
              >
                <IconPlus size={14} strokeWidth={2.5} />
                <span>+ Yeni Kupon Oluştur</span>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Toplam Kupon Sayısı</span>
                <strong style={{ fontSize: '1.4rem', color: '#f8fafc' }}>{coupons.length}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Aktif Kuponlar</span>
                <strong style={{ fontSize: '1.4rem', color: '#10b981' }}>{coupons.filter((c) => c.isActive).length}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Toplam Kullanım Adedi</span>
                <strong style={{ fontSize: '1.4rem', color: '#38bdf8' }}>{coupons.reduce((acc, c) => acc + (c.usedCount || 0), 0)} Kez</strong>
              </div>
            </div>

            {/* Coupons Table */}
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Kupon Kodu</th>
                    <th>İndirim Tutarı</th>
                    <th>Minimum Sepet</th>
                    <th>Kullanım Durumu</th>
                    <th>Açıklama</th>
                    <th>Durum</th>
                    <th style={{ textAlign: 'right' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        Henüz tanımlanmış indirim kuponu bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    coupons.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px dashed #10b981', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                            <strong style={{ color: '#34d399', letterSpacing: '0.5px' }}>{c.code}</strong>
                          </div>
                        </td>
                        <td>
                          <strong style={{ color: '#f8fafc' }}>
                            {c.discountType === 'percentage' ? `%${c.discountValue} İndirim` : `₺${c.discountValue} İndirim`}
                          </strong>
                        </td>
                        <td>
                          <span style={{ color: '#cbd5e1' }}>
                            {c.minOrderAmount ? `₺${c.minOrderAmount.toLocaleString('tr-TR')}` : 'Yok (Limitsiz)'}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                            {c.usedCount || 0} / {c.maxUses || 'Limitsiz'}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{c.description || '-'}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleToggleCoupon(c)}
                            style={{
                              padding: '0.25rem 0.6rem',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              background: c.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: c.isActive ? '#34d399' : '#f87171',
                            }}
                          >
                            {c.isActive ? '✓ Aktif' : '✕ Pasif'}
                          </button>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="admin-action-btn danger"
                            onClick={() => handleDeleteCoupon(c.code)}
                            title="Kuponu Sil"
                          >
                            <IconTrash size={12} />
                            <span>Sil</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* New Coupon Modal */}
          {isCouponModalOpen && (
            <div className="admin-modal-overlay" onClick={() => setIsCouponModalOpen(false)}>
              <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                <div className="admin-modal-header">
                  <h3 className="admin-modal-title">🏷️ Yeni İndirim Kuponu Tanımla</h3>
                  <button type="button" className="admin-modal-close" onClick={() => setIsCouponModalOpen(false)}>✕</button>
                </div>
                <form onSubmit={handleSaveCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Kupon Kodu (Örn: WIHYFE20)</label>
                    <input
                      type="text"
                      required
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="WIHYFE20"
                      className="admin-input-field"
                      style={{ width: '100%', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>İndirim Tipi</label>
                      <select
                        value={couponType}
                        onChange={(e) => setCouponType(e.target.value as any)}
                        className="admin-input-field"
                        style={{ width: '100%' }}
                      >
                        <option value="percentage">Yüzdelik (%)</option>
                        <option value="fixed">Sabit Tutar (₺)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>İndirim Değeri ({couponType === 'percentage' ? '%' : '₺'})</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={couponVal}
                        onChange={(e) => setCouponVal(e.target.value)}
                        className="admin-input-field"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Min. Sepet Tutarı (₺)</label>
                      <input
                        type="number"
                        min="0"
                        value={couponMin}
                        onChange={(e) => setCouponMin(e.target.value)}
                        placeholder="0 (Limitsiz)"
                        className="admin-input-field"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Maks. Kullanım Adedi</label>
                      <input
                        type="number"
                        min="1"
                        value={couponMax}
                        onChange={(e) => setCouponMax(e.target.value)}
                        className="admin-input-field"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Açıklama / Kampanya Adı</label>
                    <input
                      type="text"
                      value={couponDesc}
                      onChange={(e) => setCouponDesc(e.target.value)}
                      placeholder="Örn: Hafta Sonu Özel İndirimi"
                      className="admin-input-field"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => setIsCouponModalOpen(false)}
                    >
                      Vazgeç
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingCoupon}
                      className="admin-btn-primary"
                      style={{ background: '#10b981', border: 'none' }}
                    >
                      {isSavingCoupon ? 'Kaydediliyor...' : '✓ Kuponu Yayınla'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title-group">
              <h2 className="admin-card-title">
                <IconBox size={18} color="var(--admin-accent-purple)" />
                <span>Ürün &amp; Hizmet Yönetimi</span>
              </h2>
              <span className="admin-card-desc">
                Sitede listelenen Discord botları, web siteleri ve paketlerin tüm dönem fiyatlarını (Aylık, 3 Aylık, 6 Aylık, Yıllık) düzenleyin. Değişiklikler anında sitede aktif olur.
              </span>
            </div>

            <button
              type="button"
              className="admin-btn-primary"
              onClick={handleAddNew}
            >
              <IconPlus size={14} strokeWidth={2.5} />
              <span>+ Yeni Ürün Ekle</span>
            </button>
          </div>

        {/* Filter and Search Bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Row 1: Categories and Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div className="admin-timeframe-pills">
              <button
                type="button"
                className={`admin-tf-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                Tümü ({products.length})
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${selectedCategory === 'bot' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('bot')}
              >
                Discord Botları
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${selectedCategory === 'website' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('website')}
              >
                Web Siteleri
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${selectedCategory === 'service' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('service')}
              >
                Ek Hizmetler
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${selectedCategory === 'software' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('software')}
              >
                Yazılım &amp; İstemciler
              </button>
            </div>

            <div style={{ minWidth: '240px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Ürün adı veya özellik ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-form-input"
                style={{ padding: '0.45rem 0.75rem', paddingLeft: '2rem' }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '0.7rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: 'var(--admin-text-dim)',
                }}
              >
                <IconSearch size={14} />
              </div>
            </div>
          </div>

          {/* Row 2: Billing Period Switcher Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.04)',
            }}
          >
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--admin-text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <IconCalendar size={13} color="var(--admin-accent-purple)" />
              <span>Dönem / Periyot Görünümü:</span>
            </span>

            <div className="admin-timeframe-pills" style={{ background: 'transparent', padding: 0 }}>
              <button
                type="button"
                className={`admin-tf-btn ${selectedPeriodView === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedPeriodView('all')}
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem' }}
              >
                Tüm Dönemler (Detaylı)
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${selectedPeriodView === 'monthly' ? 'active' : ''}`}
                onClick={() => setSelectedPeriodView('monthly')}
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem' }}
              >
                1 Aylık
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${selectedPeriodView === 'quarterly' ? 'active' : ''}`}
                onClick={() => setSelectedPeriodView('quarterly')}
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem' }}
              >
                3 Aylık
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${selectedPeriodView === 'semi-annual' ? 'active' : ''}`}
                onClick={() => setSelectedPeriodView('semi-annual')}
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem' }}
              >
                6 Aylık
              </button>
              <button
                type="button"
                className={`admin-tf-btn ${selectedPeriodView === 'annual' ? 'active' : ''}`}
                onClick={() => setSelectedPeriodView('annual')}
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem' }}
              >
                Yıllık (12 Ay)
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ürün Bilgisi</th>
                <th>Kategori</th>
                <th>
                  {selectedPeriodView === 'all'
                    ? 'Dönem Fiyatlandırması (Aylık / 3A / 6A / 12A)'
                    : `${
                        selectedPeriodView === 'monthly'
                          ? '1 Aylık'
                          : selectedPeriodView === 'quarterly'
                          ? '3 Aylık'
                          : selectedPeriodView === 'semi-annual'
                          ? '6 Aylık'
                          : 'Yıllık'
                      } Fiyatı`}
                </th>
                <th>Rozet</th>
                <th>Satış</th>
                <th>Durum</th>
                <th>Son Güncelleme</th>
                <th style={{ textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const hasPeriods = Boolean(p.periods && Object.keys(p.periods).length > 0);

                return (
                  <tr key={p.id}>
                    {/* Column 1: Ürün Bilgisi */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.86rem' }}>
                          {p.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--admin-text-dim)',
                            maxWidth: '280px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {p.description}
                        </span>
                      </div>
                    </td>

                    {/* Column 2: Kategori */}
                    <td>
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        {p.category === 'Bot'
                          ? 'Discord Botu'
                          : p.category === 'Website'
                          ? 'Web Sitesi'
                          : p.category === 'Service'
                          ? 'Ek Hizmet'
                          : 'Yazılım'}
                      </span>
                    </td>

                    {/* Column 3: Fiyatlandırma & Periyotlar */}
                    <td>
                      {hasPeriods && p.periods ? (
                        selectedPeriodView === 'all' ? (
                          /* Full Multi-Period Micro Breakdown */
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.25rem',
                              minWidth: '220px',
                              padding: '0.2rem 0',
                            }}
                          >
                            {/* Monthly */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.74rem',
                              }}
                            >
                              <span style={{ color: 'var(--admin-text-dim)', width: '42px' }}>
                                1 Ay:
                              </span>
                              <span style={{ color: '#fff', fontWeight: 700 }}>
                                ₺{Number(p.periods.monthly?.price || p.price).toLocaleString('tr-TR')}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.62rem',
                                  padding: '1px 5px',
                                  borderRadius: '3px',
                                  fontWeight: 600,
                                  background: 'rgba(16, 185, 129, 0.15)',
                                  color: '#34d399',
                                }}
                              >
                                Aktif
                              </span>
                            </div>

                            {/* 3 Months */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.74rem',
                              }}
                            >
                              <span style={{ color: 'var(--admin-text-dim)', width: '42px' }}>
                                3 Ay:
                              </span>
                              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>
                                ₺{Number(p.periods.quarterly?.price || 0).toLocaleString('tr-TR')}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.62rem',
                                  padding: '1px 5px',
                                  borderRadius: '3px',
                                  fontWeight: 600,
                                  background: p.periods.quarterly?.isAvailable
                                    ? 'rgba(16, 185, 129, 0.15)'
                                    : 'rgba(245, 158, 11, 0.15)',
                                  color: p.periods.quarterly?.isAvailable ? '#34d399' : '#fbbf24',
                                }}
                              >
                                {p.periods.quarterly?.isAvailable
                                  ? 'Aktif'
                                  : p.periods.quarterly?.statusBadge || 'Yakında'}
                              </span>
                            </div>

                            {/* 6 Months */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.74rem',
                              }}
                            >
                              <span style={{ color: 'var(--admin-text-dim)', width: '42px' }}>
                                6 Ay:
                              </span>
                              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>
                                ₺{Number(p.periods['semi-annual']?.price || 0).toLocaleString('tr-TR')}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.62rem',
                                  padding: '1px 5px',
                                  borderRadius: '3px',
                                  fontWeight: 600,
                                  background: p.periods['semi-annual']?.isAvailable
                                    ? 'rgba(16, 185, 129, 0.15)'
                                    : 'rgba(245, 158, 11, 0.15)',
                                  color: p.periods['semi-annual']?.isAvailable ? '#34d399' : '#fbbf24',
                                }}
                              >
                                {p.periods['semi-annual']?.isAvailable
                                  ? 'Aktif'
                                  : p.periods['semi-annual']?.statusBadge || 'Yakında'}
                              </span>
                            </div>

                            {/* 12 Months */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.74rem',
                              }}
                            >
                              <span style={{ color: 'var(--admin-text-dim)', width: '42px' }}>
                                12 Ay:
                              </span>
                              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>
                                ₺{Number(p.periods.annual?.price || 0).toLocaleString('tr-TR')}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.62rem',
                                  padding: '1px 5px',
                                  borderRadius: '3px',
                                  fontWeight: 600,
                                  background: p.periods.annual?.isAvailable
                                    ? 'rgba(16, 185, 129, 0.15)'
                                    : 'rgba(245, 158, 11, 0.15)',
                                  color: p.periods.annual?.isAvailable ? '#34d399' : '#fbbf24',
                                }}
                              >
                                {p.periods.annual?.isAvailable
                                  ? 'Aktif'
                                  : p.periods.annual?.statusBadge || 'Yakında'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          /* Filtered Single Period View for this multi-period product */
                          (() => {
                            const pItem = p.periods[selectedPeriodView];
                            if (!pItem) return <span>—</span>;
                            return (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                                    ₺{Number(pItem.price || 0).toLocaleString('tr-TR')}
                                  </span>
                                  {pItem.discountBadge && (
                                    <span
                                      style={{
                                        fontSize: '0.68rem',
                                        color: '#34d399',
                                        fontWeight: 600,
                                      }}
                                    >
                                      ({pItem.discountBadge})
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <span
                                    style={{
                                      fontSize: '0.65rem',
                                      padding: '1px 6px',
                                      borderRadius: '3px',
                                      fontWeight: 600,
                                      background: pItem.isAvailable
                                        ? 'rgba(16, 185, 129, 0.15)'
                                        : 'rgba(245, 158, 11, 0.15)',
                                      color: pItem.isAvailable ? '#34d399' : '#fbbf24',
                                    }}
                                  >
                                    {pItem.isAvailable ? 'Satışta' : pItem.statusBadge || 'Yakında'}
                                  </span>
                                </div>
                              </div>
                            );
                          })()
                        )
                      ) : (
                        /* Standalone / Single Period Product */
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                          <span style={{ color: '#fff', fontWeight: 700 }}>
                            ₺{Number(p.price || 0).toLocaleString('tr-TR')}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-dim)' }}>
                            {p.period ? `/ ${p.period}` : ''}
                          </span>
                          {p.discountPrice && (
                            <span
                              style={{
                                fontSize: '0.7rem',
                                color: '#10b981',
                                fontWeight: 600,
                              }}
                            >
                              (İnd: ₺{p.discountPrice})
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Column 4: Rozet */}
                    <td>
                      {p.badge ? (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '4px',
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#c4b5fd',
                            border: '1px solid rgba(139, 92, 246, 0.35)',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {p.badge}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--admin-text-dim)' }}>—</span>
                      )}
                    </td>

                    {/* Column 5: Satış */}
                    <td style={{ fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
                      {p.salesCount} adet
                    </td>

                    {/* Column 6: Durum */}
                    <td>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color:
                            p.status === 'Aktif'
                              ? '#10b981'
                              : p.status === 'Tükendi'
                              ? '#f59e0b'
                              : '#64748b',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <span
                            className="admin-status-dot"
                            style={{
                              display: 'inline-block',
                              position: 'static',
                              background:
                                p.status === 'Aktif'
                                  ? '#10b981'
                                  : p.status === 'Tükendi'
                                  ? '#f59e0b'
                                  : '#64748b',
                            }}
                          />
                          <span>{p.status}</span>
                        </span>
                      </span>
                    </td>

                    {/* Column 7: Son Güncelleme */}
                    <td
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--admin-text-dim)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {p.updatedAt}
                    </td>

                    {/* Column 8: İşlemler */}
                    <td style={{ textAlign: 'right' }}>
                      <div
                        className="admin-action-btn-group"
                        style={{ justifyContent: 'flex-end' }}
                      >
                        <button
                          type="button"
                          className="admin-action-btn primary"
                          onClick={() => handleEdit(p)}
                          title="Fiyat ve Dönemleri Düzenle"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <IconEdit size={12} />
                          <span>Düzenle</span>
                        </button>
                        <button
                          type="button"
                          className="admin-action-btn danger"
                          onClick={() => handleDelete(p.id, p.name)}
                          title="Ürünü Sil"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <IconTrash size={12} />
                          <span>Sil</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}
