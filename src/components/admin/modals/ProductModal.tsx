'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { ProductCategory, ProductPeriodItem } from '@/types/admin';
import {
  IconBox,
  IconX,
  IconCheck,
  IconCalendar,
  IconTag,
  IconLink,
  IconZap,
} from '../AdminIcons';

type PeriodKey = 'monthly' | 'quarterly' | 'semi-annual' | 'annual';

const PERIOD_CONFIG: Record<
  PeriodKey,
  { label: string; badgeDefault: string; defaultMultiplier: number; defaultDiscount: number }
> = {
  monthly: { label: '1 Aylık', badgeDefault: '', defaultMultiplier: 1, defaultDiscount: 0 },
  quarterly: { label: '3 Aylık', badgeDefault: '%10 İndirim', defaultMultiplier: 3, defaultDiscount: 0.1 },
  'semi-annual': { label: '6 Aylık', badgeDefault: '%20 İndirim', defaultMultiplier: 6, defaultDiscount: 0.2 },
  annual: { label: 'Yıllık (12 Ay)', badgeDefault: '%35 İndirim', defaultMultiplier: 12, defaultDiscount: 0.35 },
};

export default function ProductModal() {
  const { isProductModalOpen, setIsProductModalOpen, editingProduct, addProduct, updateProduct } =
    useAdmin();

  // Tab state inside modal: 'general' | 'pricing'
  const [activeModalTab, setActiveModalTab] = useState<'general' | 'pricing'>('general');

  // General fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Bot');
  const [status, setStatus] = useState<'Aktif' | 'Tükendi' | 'Gizli'>('Aktif');
  const [badge, setBadge] = useState('');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');

  // Single-price fallback fields (for standalone items)
  const [singlePrice, setSinglePrice] = useState<number>(1500);
  const [discountPrice, setDiscountPrice] = useState<string>('');
  const [singlePeriod, setSinglePeriod] = useState<string>('Aylık');
  const [singlePaytrUrl, setSinglePaytrUrl] = useState<string>('');

  // Multi-period enabled toggle
  const [hasMultiPeriods, setHasMultiPeriods] = useState<boolean>(true);

  // Active period editor tab: 'monthly' | 'quarterly' | 'semi-annual' | 'annual'
  const [selectedPeriodTab, setSelectedPeriodTab] = useState<PeriodKey>('monthly');

  // Multi-period state
  const [periods, setPeriods] = useState<Record<PeriodKey, ProductPeriodItem>>({
    monthly: { price: 1300, periodLabel: 'Aylık', isAvailable: true, paytrUrl: '' },
    quarterly: {
      price: 3510,
      periodLabel: '3 Aylık',
      originalPrice: '₺3.900',
      discountBadge: '%10 İndirim',
      isAvailable: false,
      statusBadge: 'Yakında',
      paytrUrl: '',
    },
    'semi-annual': {
      price: 6240,
      periodLabel: '6 Aylık',
      originalPrice: '₺7.800',
      discountBadge: '%20 İndirim',
      isAvailable: false,
      statusBadge: 'Yakında',
      paytrUrl: '',
    },
    annual: {
      price: 10140,
      periodLabel: 'Yıllık',
      originalPrice: '₺15.600',
      discountBadge: '%35 İndirim',
      isAvailable: false,
      statusBadge: 'Yakında',
      paytrUrl: '',
    },
  });

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setStatus(editingProduct.status);
      setBadge(editingProduct.badge || '');
      setDescription(editingProduct.description || '');
      setFeaturesText(editingProduct.features ? editingProduct.features.join('\n') : '');
      setSinglePrice(editingProduct.price || 0);
      setDiscountPrice(editingProduct.discountPrice ? String(editingProduct.discountPrice) : '');
      setSinglePeriod(editingProduct.period || 'Aylık');
      setSinglePaytrUrl(editingProduct.paytrUrl || '');

      const hasPeriods = Boolean(
        editingProduct.periods && Object.keys(editingProduct.periods).length > 0
      );
      setHasMultiPeriods(hasPeriods || editingProduct.category === 'Bot' || editingProduct.category === 'Website');

      if (hasPeriods && editingProduct.periods) {
        setPeriods({
          monthly: {
            price: editingProduct.periods.monthly?.price ?? editingProduct.price,
            periodLabel: editingProduct.periods.monthly?.periodLabel || 'Aylık',
            isAvailable: editingProduct.periods.monthly?.isAvailable ?? true,
            statusBadge: editingProduct.periods.monthly?.statusBadge || '',
            discountBadge: editingProduct.periods.monthly?.discountBadge || '',
            originalPrice: editingProduct.periods.monthly?.originalPrice || '',
            paytrUrl: editingProduct.periods.monthly?.paytrUrl || '',
          },
          quarterly: {
            price:
              editingProduct.periods.quarterly?.price ??
              Math.round(editingProduct.price * 3 * 0.9),
            periodLabel: editingProduct.periods.quarterly?.periodLabel || '3 Aylık',
            isAvailable: editingProduct.periods.quarterly?.isAvailable ?? false,
            statusBadge: editingProduct.periods.quarterly?.statusBadge || 'Yakında',
            discountBadge: editingProduct.periods.quarterly?.discountBadge || '%10 İndirim',
            originalPrice:
              editingProduct.periods.quarterly?.originalPrice ||
              `₺${(editingProduct.price * 3).toLocaleString('tr-TR')}`,
            paytrUrl: editingProduct.periods.quarterly?.paytrUrl || '',
          },
          'semi-annual': {
            price:
              editingProduct.periods['semi-annual']?.price ??
              Math.round(editingProduct.price * 6 * 0.8),
            periodLabel: editingProduct.periods['semi-annual']?.periodLabel || '6 Aylık',
            isAvailable: editingProduct.periods['semi-annual']?.isAvailable ?? false,
            statusBadge: editingProduct.periods['semi-annual']?.statusBadge || 'Yakında',
            discountBadge: editingProduct.periods['semi-annual']?.discountBadge || '%20 İndirim',
            originalPrice:
              editingProduct.periods['semi-annual']?.originalPrice ||
              `₺${(editingProduct.price * 6).toLocaleString('tr-TR')}`,
            paytrUrl: editingProduct.periods['semi-annual']?.paytrUrl || '',
          },
          annual: {
            price:
              editingProduct.periods.annual?.price ??
              Math.round(editingProduct.price * 12 * 0.65),
            periodLabel: editingProduct.periods.annual?.periodLabel || 'Yıllık',
            isAvailable: editingProduct.periods.annual?.isAvailable ?? false,
            statusBadge: editingProduct.periods.annual?.statusBadge || 'Yakında',
            discountBadge: editingProduct.periods.annual?.discountBadge || '%35 İndirim',
            originalPrice:
              editingProduct.periods.annual?.originalPrice ||
              `₺${(editingProduct.price * 12).toLocaleString('tr-TR')}`,
            paytrUrl: editingProduct.periods.annual?.paytrUrl || '',
          },
        });
      } else {
        // Compute default periods based on single price
        const base = editingProduct.price || 1000;
        setPeriods({
          monthly: { price: base, periodLabel: 'Aylık', isAvailable: true, paytrUrl: '' },
          quarterly: {
            price: Math.round(base * 3 * 0.9),
            periodLabel: '3 Aylık',
            originalPrice: `₺${(base * 3).toLocaleString('tr-TR')}`,
            discountBadge: '%10 İndirim',
            isAvailable: false,
            statusBadge: 'Yakında',
            paytrUrl: '',
          },
          'semi-annual': {
            price: Math.round(base * 6 * 0.8),
            periodLabel: '6 Aylık',
            originalPrice: `₺${(base * 6).toLocaleString('tr-TR')}`,
            discountBadge: '%20 İndirim',
            isAvailable: false,
            statusBadge: 'Yakında',
            paytrUrl: '',
          },
          annual: {
            price: Math.round(base * 12 * 0.65),
            periodLabel: 'Yıllık',
            originalPrice: `₺${(base * 12).toLocaleString('tr-TR')}`,
            discountBadge: '%35 İndirim',
            isAvailable: false,
            statusBadge: 'Yakında',
            paytrUrl: '',
          },
        });
      }
    } else {
      // New product defaults
      setName('');
      setCategory('Bot');
      setStatus('Aktif');
      setBadge('');
      setDescription('');
      setFeaturesText('');
      setSinglePrice(1300);
      setDiscountPrice('');
      setSinglePeriod('Aylık');
      setSinglePaytrUrl('');
      setHasMultiPeriods(true);
      setPeriods({
        monthly: { price: 1300, periodLabel: 'Aylık', isAvailable: true, paytrUrl: '' },
        quarterly: {
          price: 3510,
          periodLabel: '3 Aylık',
          originalPrice: '₺3.900',
          discountBadge: '%10 İndirim',
          isAvailable: false,
          statusBadge: 'Yakında',
          paytrUrl: '',
        },
        'semi-annual': {
          price: 6240,
          periodLabel: '6 Aylık',
          originalPrice: '₺7.800',
          discountBadge: '%20 İndirim',
          isAvailable: false,
          statusBadge: 'Yakında',
          paytrUrl: '',
        },
        annual: {
          price: 10140,
          periodLabel: 'Yıllık',
          originalPrice: '₺15.600',
          discountBadge: '%35 İndirim',
          isAvailable: false,
          statusBadge: 'Yakında',
          paytrUrl: '',
        },
      });
    }
    setActiveModalTab('general');
    setSelectedPeriodTab('monthly');
  }, [editingProduct, isProductModalOpen]);

  if (!isProductModalOpen) return null;

  const updateSelectedPeriodField = (key: PeriodKey, field: keyof ProductPeriodItem, val: any) => {
    setPeriods((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: val,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const featuresArray = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const numericDiscount = discountPrice ? Number(discountPrice) : undefined;

    // If multi periods enabled, base price comes from monthly price
    const finalPrice = hasMultiPeriods ? Number(periods.monthly.price) || 0 : singlePrice;
    const finalPeriods = hasMultiPeriods ? periods : undefined;
    const finalPeriod = hasMultiPeriods ? 'Aylık' : singlePeriod;
    const finalPaytrUrl = hasMultiPeriods ? periods.monthly.paytrUrl : singlePaytrUrl;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        category,
        price: finalPrice,
        discountPrice: numericDiscount,
        badge: badge.trim() || undefined,
        description,
        features: featuresArray,
        status,
        period: finalPeriod,
        paytrUrl: finalPaytrUrl,
        periods: finalPeriods,
      });
    } else {
      addProduct({
        name,
        category,
        price: finalPrice,
        discountPrice: numericDiscount,
        badge: badge.trim() || undefined,
        description,
        features: featuresArray,
        status,
        period: finalPeriod,
        paytrUrl: finalPaytrUrl,
        periods: finalPeriods,
      });
    }

    setIsProductModalOpen(false);
  };

  return (
    <div className="admin-modal-overlay" onClick={() => setIsProductModalOpen(false)}>
      <div
        className="admin-modal-box"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="admin-modal-header">
          <div className="admin-modal-title">
            <IconBox size={18} color="var(--admin-accent-purple)" />
            <span>{editingProduct ? 'Ürün Bilgilerini Düzenle' : 'Yeni Ürün / Paket Ekle'}</span>
          </div>
          <button
            type="button"
            className="admin-modal-close"
            onClick={() => setIsProductModalOpen(false)}
          >
            <IconX size={15} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--admin-border)',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '0.4rem 1.65rem 0',
            gap: '0.5rem',
          }}
        >
          <button
            type="button"
            className={`admin-tf-btn ${activeModalTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveModalTab('general')}
            style={{ borderRadius: '6px 6px 0 0', padding: '0.55rem 1.1rem' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <IconBox size={14} /> Genel Bilgiler
            </span>
          </button>

          <button
            type="button"
            className={`admin-tf-btn ${activeModalTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveModalTab('pricing')}
            style={{ borderRadius: '6px 6px 0 0', padding: '0.55rem 1.1rem' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <IconCalendar size={14} /> Periyotlar &amp; Fiyatlandırma
              {hasMultiPeriods && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    background: 'rgba(168, 85, 247, 0.25)',
                    color: '#c4b5fd',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}
                >
                  4 Dönem
                </span>
              )}
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* TAB 1: GENEL BİLGİLER */}
            {activeModalTab === 'general' && (
              <>
                <div className="admin-form-group">
                  <label className="admin-form-label">Ürün / Paket Adı</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="admin-form-input"
                    placeholder="Örn: Discord Full Pack, Garry's Mod Botu"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProductCategory)}
                      className="admin-form-select"
                    >
                      <option value="Bot">Discord Botu</option>
                      <option value="Website">Web Sitesi</option>
                      <option value="Service">Ek Hizmet / Kurulum</option>
                      <option value="Software">Masaüstü Yazılım / İstemci</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Stok / Satış Durumu</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'Aktif' | 'Tükendi' | 'Gizli')}
                      className="admin-form-select"
                    >
                      <option value="Aktif">● Aktif (Satışta)</option>
                      <option value="Tükendi">● Tükendi (Stok Yok)</option>
                      <option value="Gizli">● Gizli (Yayında Değil)</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Öne Çıkan Rozet (Badge)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="admin-form-input"
                    placeholder="Örn: En Popüler, Çok Satan, Standart, Özel"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Açıklama</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="admin-form-textarea"
                    placeholder="Ürünün sitede görüntülenecek kısa açıklaması..."
                    rows={2}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">
                    Özellik Maddeleri (Her satıra bir özellik girin)
                  </label>
                  <textarea
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    className="admin-form-textarea"
                    placeholder="Gelişmiş RCON ve FiveM Entegrasyonu&#10;7/24 Kesintisiz Uptime Garantisi&#10;Otomatik Rol ve Kayıt Sistemi&#10;Kapsamlı Loglama &amp; Güvenlik"
                    rows={4}
                  />
                </div>
              </>
            )}

            {/* TAB 2: PERİYOTLAR & FİYATLANDIRMA */}
            {activeModalTab === 'pricing' && (
              <>
                {/* Multi-period Toggle Banner */}
                <div
                  style={{
                    background: 'rgba(168, 85, 247, 0.08)',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.86rem' }}>
                      Çoklu Dönem / Periyot Fiyatlandırması
                    </div>
                    <div style={{ color: 'var(--admin-text-dim)', fontSize: '0.74rem' }}>
                      Aylık, 3 Aylık, 6 Aylık ve Yıllık seçeneklerini sitede aktif edin veya fiyatlandırın.
                    </div>
                  </div>

                  <label
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={hasMultiPeriods}
                      onChange={(e) => setHasMultiPeriods(e.target.checked)}
                      style={{ display: 'none' }}
                    />
                    <div
                      style={{
                        width: '42px',
                        height: '24px',
                        borderRadius: '12px',
                        background: hasMultiPeriods
                          ? 'var(--admin-accent-purple)'
                          : 'rgba(255, 255, 255, 0.15)',
                        transition: 'background 0.2s',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: '#fff',
                          position: 'absolute',
                          top: '3px',
                          left: hasMultiPeriods ? '21px' : '3px',
                          transition: 'left 0.2s',
                        }}
                      />
                    </div>
                  </label>
                </div>

                {hasMultiPeriods ? (
                  <div>
                    {/* Period Switcher Pills */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '0.4rem',
                        marginTop: '0.85rem',
                        marginBottom: '1rem',
                      }}
                    >
                      {(['monthly', 'quarterly', 'semi-annual', 'annual'] as PeriodKey[]).map(
                        (pKey) => {
                          const pData = periods[pKey];
                          const isActive = selectedPeriodTab === pKey;
                          return (
                            <button
                              key={pKey}
                              type="button"
                              onClick={() => setSelectedPeriodTab(pKey)}
                              style={{
                                padding: '0.6rem 0.4rem',
                                borderRadius: '8px',
                                border: isActive
                                  ? '1px solid var(--admin-accent-purple)'
                                  : '1px solid var(--admin-border)',
                                background: isActive
                                  ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(99, 102, 241, 0.15))'
                                  : 'rgba(0, 0, 0, 0.35)',
                                color: isActive ? '#fff' : 'var(--admin-text-muted)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.15s',
                              }}
                            >
                              <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                                {PERIOD_CONFIG[pKey].label}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  color: isActive ? '#0878FF' : '#94a3b8',
                                  marginTop: '2px',
                                }}
                              >
                                ₺{Number(pData.price || 0).toLocaleString('tr-TR')}
                              </div>
                              <div style={{ marginTop: '3px' }}>
                                <span
                                  style={{
                                    fontSize: '0.62rem',
                                    padding: '0.1rem 0.35rem',
                                    borderRadius: '3px',
                                    fontWeight: 600,
                                    background: pData.isAvailable
                                      ? 'rgba(16, 185, 129, 0.2)'
                                      : 'rgba(245, 158, 11, 0.2)',
                                    color: pData.isAvailable ? '#34d399' : '#fbbf24',
                                  }}
                                >
                                  {pData.isAvailable ? 'Satışta' : pData.statusBadge || 'Yakında'}
                                </span>
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>

                    {/* Active Period Detail Editor */}
                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '10px',
                        padding: '1.1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                          paddingBottom: '0.6rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <IconCalendar size={15} color="var(--admin-accent-purple)" />
                          <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                            {PERIOD_CONFIG[selectedPeriodTab].label} Ayarları
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-dim)' }}>
                            Sitede Satış Durumu:
                          </span>
                          <select
                            value={
                              periods[selectedPeriodTab].isAvailable
                                ? 'active'
                                : periods[selectedPeriodTab].statusBadge || 'Yakında'
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'active') {
                                updateSelectedPeriodField(selectedPeriodTab, 'isAvailable', true);
                                updateSelectedPeriodField(selectedPeriodTab, 'statusBadge', '');
                              } else {
                                updateSelectedPeriodField(selectedPeriodTab, 'isAvailable', false);
                                updateSelectedPeriodField(selectedPeriodTab, 'statusBadge', val);
                              }
                            }}
                            className="admin-form-select"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.74rem', width: 'auto' }}
                          >
                            <option value="active">● Aktif (Satış Açık)</option>
                            <option value="Yakında">● Yakında (Kilitli)</option>
                            <option value="Ön Sipariş">● Ön Sipariş</option>
                            <option value="Tükendi">● Tükendi</option>
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '0.75rem',
                        }}
                      >
                        <div className="admin-form-group">
                          <label className="admin-form-label">
                            {PERIOD_CONFIG[selectedPeriodTab].label} Fiyatı (₺)
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={periods[selectedPeriodTab].price}
                            onChange={(e) =>
                              updateSelectedPeriodField(
                                selectedPeriodTab,
                                'price',
                                Number(e.target.value)
                              )
                            }
                            className="admin-form-input"
                            placeholder="1300"
                          />
                        </div>

                        <div className="admin-form-group">
                          <label className="admin-form-label">İndirim Rozeti (Opsiyonel)</label>
                          <input
                            type="text"
                            value={periods[selectedPeriodTab].discountBadge || ''}
                            onChange={(e) =>
                              updateSelectedPeriodField(
                                selectedPeriodTab,
                                'discountBadge',
                                e.target.value
                              )
                            }
                            className="admin-form-input"
                            placeholder="Örn: %10 İndirim, %20 İndirim"
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '0.75rem',
                        }}
                      >
                        <div className="admin-form-group">
                          <label className="admin-form-label">
                            Üstü Çizili Orijinal Fiyat (Görsel)
                          </label>
                          <input
                            type="text"
                            value={periods[selectedPeriodTab].originalPrice || ''}
                            onChange={(e) =>
                              updateSelectedPeriodField(
                                selectedPeriodTab,
                                'originalPrice',
                                e.target.value
                              )
                            }
                            className="admin-form-input"
                            placeholder="Örn: ₺3.900"
                          />
                        </div>

                        <div className="admin-form-group">
                          <label className="admin-form-label">
                            PayTR Doğrudan Ödeme Linki (Opsiyonel)
                          </label>
                          <input
                            type="text"
                            value={periods[selectedPeriodTab].paytrUrl || ''}
                            onChange={(e) =>
                              updateSelectedPeriodField(
                                selectedPeriodTab,
                                'paytrUrl',
                                e.target.value
                              )
                            }
                            className="admin-form-input"
                            placeholder="https://www.paytr.com/link/..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Summary Matrix of All 4 Periods */}
                    <div
                      style={{
                        marginTop: '0.85rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        fontSize: '0.74rem',
                      }}
                    >
                      <div
                        style={{
                          color: 'var(--admin-text-dim)',
                          marginBottom: '0.4rem',
                          fontWeight: 600,
                        }}
                      >
                        Sitede Gözükecek Dönem Fiyat Özeti:
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '0.4rem',
                        }}
                      >
                        <div>
                          <span style={{ color: 'var(--admin-text-dim)' }}>1 Ay: </span>
                          <span style={{ color: '#fff', fontWeight: 700 }}>
                            ₺{Number(periods.monthly.price).toLocaleString('tr-TR')}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--admin-text-dim)' }}>3 Ay: </span>
                          <span style={{ color: '#fff', fontWeight: 700 }}>
                            ₺{Number(periods.quarterly.price).toLocaleString('tr-TR')}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--admin-text-dim)' }}>6 Ay: </span>
                          <span style={{ color: '#fff', fontWeight: 700 }}>
                            ₺{Number(periods['semi-annual'].price).toLocaleString('tr-TR')}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--admin-text-dim)' }}>12 Ay: </span>
                          <span style={{ color: '#fff', fontWeight: 700 }}>
                            ₺{Number(periods.annual.price).toLocaleString('tr-TR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Single Period / Standalone Product Pricing */
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid var(--admin-border)',
                      borderRadius: '10px',
                      padding: '1.1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                      marginTop: '0.85rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                      }}
                    >
                      <div className="admin-form-group">
                        <label className="admin-form-label">Fiyat (₺)</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={singlePrice}
                          onChange={(e) => setSinglePrice(Number(e.target.value))}
                          className="admin-form-input"
                          placeholder="1500"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">İndirimli Fiyat (Opsiyonel ₺)</label>
                        <input
                          type="number"
                          min={0}
                          value={discountPrice}
                          onChange={(e) => setDiscountPrice(e.target.value)}
                          className="admin-form-input"
                          placeholder="1200"
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                      }}
                    >
                      <div className="admin-form-group">
                        <label className="admin-form-label">Dönem / Periyot Etiketi</label>
                        <input
                          type="text"
                          value={singlePeriod}
                          onChange={(e) => setSinglePeriod(e.target.value)}
                          className="admin-form-input"
                          placeholder="Örn: Tek Seferlik, / Ay, Yıllık, Ömür Boyu"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">
                          PayTR Doğrudan Link (Opsiyonel)
                        </label>
                        <input
                          type="text"
                          value={singlePaytrUrl}
                          onChange={(e) => setSinglePaytrUrl(e.target.value)}
                          className="admin-form-input"
                          placeholder="https://www.paytr.com/link/..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setIsProductModalOpen(false)}
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="admin-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <IconCheck size={14} />
              <span>{editingProduct ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
