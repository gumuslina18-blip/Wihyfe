'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { EndOfDayReport } from '@/lib/serverStore';
import { IconCheck, IconX, IconCart, IconActivity, IconClock, IconSearch } from '../AdminIcons';

// Animated Count-Up Hook
function useCountUp(target: number, duration: number = 900): number {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = 0;
    const endVal = target;

    if (endVal === 0) {
      setCount(0);
      return;
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-out cubic formula
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startVal + (endVal - startVal) * easeOut));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(endVal);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [target, duration]);

  return count;
}

export default function EndOfDayModal() {
  const { isEndOfDayModalOpen, setIsEndOfDayModalOpen, triggerEndOfDay, currentStaff } = useAdmin();

  const [activeTab, setActiveTab] = useState<'live' | 'archive' | 'slip'>('live');
  const [isLoading, setIsLoading] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);
  const [reports, setReports] = useState<EndOfDayReport[]>([]);
  const [lastClosedAt, setLastClosedAt] = useState<string | null>(null);

  // Closing confirmation state
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);
  const [closeNotes, setCloseNotes] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [selectedArchivedReport, setSelectedArchivedReport] = useState<EndOfDayReport | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const fetchEndOfDayData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/end-of-day', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setLiveData(data.live);
          setReports(data.reports || []);
          setLastClosedAt(data.lastClosedAt);
        }
      }
    } catch (err) {
      console.error('Failed to fetch end of day data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isEndOfDayModalOpen) {
      fetchEndOfDayData();
      setIsConfirmingClose(false);
      setShowCelebration(false);
    }
  }, [isEndOfDayModalOpen, fetchEndOfDayData]);

  // Animated counters
  const animatedRevenue = useCountUp(liveData?.totalRevenue || 0);
  const animatedOrders = useCountUp(liveData?.ordersCount || 0);
  const animatedDeposits = useCountUp(liveData?.depositsTotal || 0);
  const animatedTickets = useCountUp(liveData?.ticketsOpened || 0);

  const handleCloseModal = () => {
    setIsEndOfDayModalOpen(false);
    setIsConfirmingClose(false);
    setShowCelebration(false);
  };

  const handleFinalizeEndOfDay = async () => {
    setIsClosing(true);
    try {
      const res = await triggerEndOfDay(closeNotes);
      if (res.success && res.report) {
        setShowCelebration(true);
        setSelectedArchivedReport(res.report);
        // Refresh live data which will now be reset to 0!
        await fetchEndOfDayData();
        setTimeout(() => {
          setIsConfirmingClose(false);
          setActiveTab('slip');
        }, 1200);
      }
    } finally {
      setIsClosing(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  if (!isEndOfDayModalOpen) return null;

  const currentReportForSlip = selectedArchivedReport || reports[0] || null;

  return (
    <div className="admin-modal-overlay" onClick={handleCloseModal}>
      <div
        className="admin-modal-box end-of-day-modal-box"
        style={{ maxWidth: '980px', width: '95vw', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration Particle Effect */}
        {showCelebration && (
          <div className="eod-celebration-overlay">
            <div className="eod-celebration-badge">
              <span style={{ fontSize: '2rem' }}>🎉</span>
              <h3>Gün Sonu Başarıyla Alındı!</h3>
              <p>Z-Raporu arşivlendi ve yeni gün sayaçları sıfırlandı.</p>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="admin-modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="eod-icon-chip">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <path d="M7 8h10M7 12h5" />
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 className="admin-modal-title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  Gün Sonu &amp; Z-Raporu Sistemi
                </h2>
                <span className="eod-live-tag">
                  <span className="admin-live-pulse-dot" style={{ background: '#10b981' }} />
                  CANLI RAPOR
                </span>
              </div>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                Günün tüm ciro, sipariş, bakiye ve destek taleplerini özetler. Gün sonu alındığında sayaçlar otomatik olarak sıfırlanır.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="admin-action-btn"
              onClick={fetchEndOfDayData}
              title="Verileri Yenile"
              disabled={isLoading}
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
            >
              <span className={isLoading ? 'admin-spin' : ''}>🔄</span> Yenile
            </button>
            <button
              type="button"
              className="admin-modal-close"
              onClick={handleCloseModal}
              aria-label="Kapat"
            >
              <IconX size={16} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="eod-tab-bar">
          <button
            type="button"
            className={`eod-tab-btn ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => { setActiveTab('live'); setSelectedArchivedReport(null); }}
          >
            <span>🌟 Bugünkü Gün Sonu (Canlı)</span>
          </button>
          <button
            type="button"
            className={`eod-tab-btn ${activeTab === 'archive' ? 'active' : ''}`}
            onClick={() => setActiveTab('archive')}
          >
            <span>📜 Geçmiş Z-Raporları ({reports.length})</span>
          </button>
          {currentReportForSlip && (
            <button
              type="button"
              className={`eod-tab-btn ${activeTab === 'slip' ? 'active' : ''}`}
              onClick={() => setActiveTab('slip')}
            >
              <span>🖨️ Z-Raporu Fişi / Yazdır</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="admin-modal-body" style={{ padding: '1.25rem 0' }}>
          {activeTab === 'live' && (
            <div className="eod-live-view">
              {/* Period & Status HUD */}
              <div className="eod-period-hud">
                <div className="eod-hud-item">
                  <span className="eod-hud-label">Raporlama Dönemi:</span>
                  <strong className="eod-hud-val">{liveData?.periodStart || 'Bugün 00:00'} ➔ Şimdi</strong>
                </div>
                <div className="eod-hud-divider" />
                <div className="eod-hud-item">
                  <span className="eod-hud-label">Son Gün Sonu Kapanışı:</span>
                  <span style={{ color: lastClosedAt ? '#34d399' : '#fcd34d', fontWeight: 600 }}>
                    {lastClosedAt ? `✓ ${lastClosedAt}` : 'Henüz gün sonu alınmadı (İlk Dönem)'}
                  </span>
                </div>
                <div className="eod-hud-divider" />
                <div className="eod-hud-item">
                  <span className="eod-hud-label">Yetkili Yönetici:</span>
                  <strong style={{ color: '#60a5fa' }}>{currentStaff.username} ({currentStaff.role})</strong>
                </div>
              </div>

              {/* 4 Animated Metric Cards */}
              <div className="eod-metrics-grid">
                {/* 1. Revenue Card */}
                <div className="eod-stat-card is-revenue">
                  <div className="eod-stat-header">
                    <span className="eod-stat-title">Bugünkü Toplam Ciro</span>
                    <div className="eod-stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                      ₺
                    </div>
                  </div>
                  <div className="eod-stat-value" style={{ color: '#34d399' }}>
                    ₺{animatedRevenue.toLocaleString('tr-TR')}
                  </div>
                  <div className="eod-stat-sub">
                    <span>Tamamlanan {liveData?.completedOrdersCount || 0} sipariş geliri</span>
                  </div>
                </div>

                {/* 2. Orders Card */}
                <div className="eod-stat-card is-orders">
                  <div className="eod-stat-header">
                    <span className="eod-stat-title">İşlenen Siparişler</span>
                    <div className="eod-stat-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                      <IconCart size={16} />
                    </div>
                  </div>
                  <div className="eod-stat-value" style={{ color: '#38bdf8' }}>
                    {animatedOrders} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Adet</span>
                  </div>
                  <div className="eod-stat-sub">
                    <span style={{ color: '#34d399' }}>✓ {liveData?.completedOrdersCount || 0} Teslim</span>
                    <span>•</span>
                    <span style={{ color: '#fbbf24' }}>⏳ {liveData?.pendingOrdersCount || 0} Bekleyen</span>
                  </div>
                </div>

                {/* 3. Deposits Card */}
                <div className="eod-stat-card is-deposits">
                  <div className="eod-stat-header">
                    <span className="eod-stat-title">Cüzdan Yüklemeleri</span>
                    <div className="eod-stat-icon-wrap" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                      💳
                    </div>
                  </div>
                  <div className="eod-stat-value" style={{ color: '#c084fc' }}>
                    ₺{animatedDeposits.toLocaleString('tr-TR')}
                  </div>
                  <div className="eod-stat-sub">
                    <span>{liveData?.depositsCount || 0} Bakiye yükleme talebi</span>
                  </div>
                </div>

                {/* 4. Tickets Card */}
                <div className="eod-stat-card is-tickets">
                  <div className="eod-stat-header">
                    <span className="eod-stat-title">Destek Talepleri</span>
                    <div className="eod-stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                      🎫
                    </div>
                  </div>
                  <div className="eod-stat-value" style={{ color: '#fbbf24' }}>
                    {animatedTickets} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Talep</span>
                  </div>
                  <div className="eod-stat-sub">
                    <span style={{ color: '#34d399' }}>✓ {liveData?.ticketsResolved || 0} Çözüldü</span>
                    <span>•</span>
                    <span>{liveData?.ticketsOpened ? Math.round(((liveData?.ticketsResolved || 0) / liveData.ticketsOpened) * 100) : 100}% Başarı</span>
                  </div>
                </div>
              </div>

              {/* Highlights & Top Insights */}
              <div className="eod-insights-box">
                <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  📊 Günün Öne Çıkanları &amp; İstatistik Özeti
                </h4>
                <div className="eod-insights-grid">
                  <div className="eod-insight-item">
                    <span className="eod-insight-lbl">Günün Yıldız Ürünü</span>
                    <strong className="eod-insight-val" style={{ color: '#38bdf8' }}>
                      {liveData?.highlights?.topProduct || 'Yok'}
                    </strong>
                  </div>
                  <div className="eod-insight-item">
                    <span className="eod-insight-lbl">En Çok Harcayan Müşteri</span>
                    <strong className="eod-insight-val" style={{ color: '#fcd34d' }}>
                      {liveData?.highlights?.topCustomer || 'Yok'}
                    </strong>
                  </div>
                  <div className="eod-insight-item">
                    <span className="eod-insight-lbl">En Yüksek Tekil Satış</span>
                    <strong className="eod-insight-val" style={{ color: '#34d399' }}>
                      ₺{(liveData?.highlights?.largestOrderAmount || 0).toLocaleString('tr-TR')}
                    </strong>
                  </div>
                  <div className="eod-insight-item">
                    <span className="eod-insight-lbl">Yeni Müşteri &amp; Lisans</span>
                    <strong className="eod-insight-val" style={{ color: '#a78bfa' }}>
                      {liveData?.newUsersCount || 0} Müşteri • {liveData?.newPinsCount || 0} PIN
                    </strong>
                  </div>
                </div>
              </div>

              {/* Recent Events Log in this window */}
              <div className="eod-events-box">
                <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
                  🕒 Bu Dönemdeki İşlem Kayıtları ({liveData?.windowLogs?.length || 0})
                </h4>
                {(!liveData?.windowLogs || liveData.windowLogs.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.82rem' }}>
                    Bu döneme ait henüz bir işlem kaydı bulunmuyor.
                  </div>
                ) : (
                  <div className="eod-events-list">
                    {liveData.windowLogs.map((log: any, idx: number) => (
                      <div key={idx} className="eod-event-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="eod-event-dot" />
                          <strong style={{ color: '#fff', fontSize: '0.8rem' }}>{log.action}</strong>
                        </div>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{log.details}</span>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', fontFamily: 'monospace' }}>{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Closing Action Footer Card */}
              {!isConfirmingClose ? (
                <div className="eod-close-banner">
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fef08a', marginBottom: '0.2rem' }}>
                      ⚠️ Günü Kapatmak ve Z-Raporunu Arşivlemek Hazır mısınız?
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                      Gün sonu işlemi yapıldığında tüm bugünkü metrikler kalıcı Z-Raporuna kaydedilir, sayaçlar <strong>0</strong> olarak sıfırlanır ve yeni gün başlatılır.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="eod-btn-close-day"
                    onClick={() => setIsConfirmingClose(true)}
                  >
                    <span>🔒 Günü Kapat &amp; Gün Sonunu Al</span>
                  </button>
                </div>
              ) : (
                <div className="eod-confirm-box">
                  <h4 style={{ color: '#f87171', fontSize: '1rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                    🚨 Gün Sonu Kapanışını Onaylayın
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#e2e8f0', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                    <strong>{liveData?.date}</strong> tarihli gün sonu kapanışı gerçekleştirilecek. Bu işlem geri alınamaz. 
                    Mevcut ciro ve siparişler Z-Raporu olarak mühürlenecek ve sayaçlar sıfırdan başlayacaktır.
                  </p>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                      Kapanış Notu / Ek Açıklama (İsteğe bağlı):
                    </label>
                    <textarea
                      value={closeNotes}
                      onChange={(e) => setCloseNotes(e.target.value)}
                      placeholder="Örn: Gün sorunsuz tamamlandı, tüm PayTR ödemeleri mutabakatı sağlandı."
                      className="admin-form-textarea"
                      rows={2}
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.65rem' }}>
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => setIsConfirmingClose(false)}
                      disabled={isClosing}
                    >
                      Vazgeç
                    </button>
                    <button
                      type="button"
                      className="admin-btn-primary"
                      style={{ background: '#dc2626', borderColor: '#b91c1c', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      onClick={handleFinalizeEndOfDay}
                      disabled={isClosing}
                    >
                      {isClosing ? (
                        <>
                          <span className="admin-spin">⏳</span>
                          <span>Gün Sonu Alınıyor...</span>
                        </>
                      ) : (
                        <>
                          <IconCheck size={14} strokeWidth={2.5} />
                          <span>Evet, Gün Sonunu Al ve Sıfırla</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Archive */}
          {activeTab === 'archive' && (
            <div className="eod-archive-view">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                  Geçmiş Z-Raporları Arşivi
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Toplam {reports.length} Gün Sonu Kapanışı
                </span>
              </div>

              {reports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', color: '#64748b' }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📂</span>
                  Henüz arşivlenmiş bir Z-Raporu bulunmuyor. Bugünkü günü kapatarak ilk Z-Raporunuzu oluşturabilirsiniz.
                </div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Z-NO</th>
                        <th>TARİH &amp; SAAT</th>
                        <th>KAPATAN YETKİLİ</th>
                        <th>TOPLAM CİRO</th>
                        <th>SİPARİŞLER</th>
                        <th>BAKİYE YÜKLEME</th>
                        <th>İŞLEM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((r) => (
                        <tr key={r.id}>
                          <td>
                            <strong style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{r.id}</strong>
                          </td>
                          <td>
                            <div>
                              <div style={{ color: '#fff', fontWeight: 600 }}>{r.date}</div>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{r.closedAt}</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>{r.closedBy}</span>
                          </td>
                          <td>
                            <strong style={{ color: '#34d399', fontSize: '0.88rem' }}>
                              ₺{r.metrics.totalRevenue.toLocaleString('tr-TR')}
                            </strong>
                          </td>
                          <td>
                            <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
                              {r.metrics.ordersCount} Sipariş ({r.metrics.completedOrdersCount} Teslim)
                            </span>
                          </td>
                          <td>
                            <span style={{ color: '#c084fc', fontSize: '0.8rem' }}>
                              ₺{r.metrics.depositsTotal.toLocaleString('tr-TR')}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="admin-action-btn primary"
                              onClick={() => {
                                setSelectedArchivedReport(r);
                                setActiveTab('slip');
                              }}
                              style={{ padding: '0.28rem 0.6rem', fontSize: '0.72rem' }}
                            >
                              Fişi Gör &amp; Yazdır
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Z-Report Thermal Slip View */}
          {activeTab === 'slip' && (
            <div className="eod-slip-view">
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  className="admin-btn-primary"
                  onClick={handlePrintSlip}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 1rem' }}
                >
                  <span>🖨️ Z-Raporunu Yazdır / PDF</span>
                </button>
              </div>

              {/* Thermal Slip Container */}
              <div className="eod-thermal-slip" id="printable-z-report">
                <div className="slip-header">
                  <h2 className="slip-brand">WIHYFE &amp; WISPBOT</h2>
                  <div className="slip-sub">GÜNLÜK MALİ KAPANIŞ &amp; Z-RAPORU</div>
                  <div className="slip-line" />
                </div>

                <div className="slip-meta">
                  <div className="slip-row">
                    <span>RAPOR NO:</span>
                    <strong>{currentReportForSlip?.id || '#Z-LIVE'}</strong>
                  </div>
                  <div className="slip-row">
                    <span>TARİH:</span>
                    <span>{currentReportForSlip?.date || liveData?.date}</span>
                  </div>
                  <div className="slip-row">
                    <span>DÖNEM BAŞLANGIÇ:</span>
                    <span>{currentReportForSlip?.periodStart || liveData?.periodStart}</span>
                  </div>
                  <div className="slip-row">
                    <span>KAPANIŞ SAATİ:</span>
                    <span>{currentReportForSlip?.closedAt || liveData?.currentTime}</span>
                  </div>
                  <div className="slip-row">
                    <span>DÜZENLEYEN:</span>
                    <span>{currentReportForSlip?.closedBy || currentStaff.username}</span>
                  </div>
                  <div className="slip-line" />
                </div>

                {/* Slip Metrics Table */}
                <div className="slip-body">
                  <div className="slip-section-title">--- SATIŞ &amp; GELİR ÖZETİ ---</div>
                  <div className="slip-row">
                    <span>TOPLAM CİRO (BRÜT):</span>
                    <strong style={{ fontSize: '1.05rem' }}>
                      ₺{(currentReportForSlip?.metrics?.totalRevenue ?? liveData?.totalRevenue ?? 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <div className="slip-row">
                    <span>PAYTR 3D SECURE:</span>
                    <span>
                      ₺{(currentReportForSlip?.metrics?.totalRevenue ?? liveData?.totalRevenue ?? 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="slip-row">
                    <span>YÜKLENEN BAKİYE:</span>
                    <span>
                      ₺{(currentReportForSlip?.metrics?.depositsTotal ?? liveData?.depositsTotal ?? 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="slip-line" />
                  <div className="slip-section-title">--- İŞLEM HACMİ ---</div>
                  <div className="slip-row">
                    <span>TOPLAM SİPARİŞ:</span>
                    <strong>{currentReportForSlip?.metrics?.ordersCount ?? liveData?.ordersCount ?? 0} Adet</strong>
                  </div>
                  <div className="slip-row">
                    <span>TAMAMLANAN TESLİMAT:</span>
                    <span>{currentReportForSlip?.metrics?.completedOrdersCount ?? liveData?.completedOrdersCount ?? 0} Adet</span>
                  </div>
                  <div className="slip-row">
                    <span>BEKLEYEN SİPARİŞ:</span>
                    <span>{currentReportForSlip?.metrics?.pendingOrdersCount ?? liveData?.pendingOrdersCount ?? 0} Adet</span>
                  </div>
                  <div className="slip-row">
                    <span>İPTAL / İADE:</span>
                    <span>{currentReportForSlip?.metrics?.cancelledOrdersCount ?? liveData?.cancelledOrdersCount ?? 0} Adet</span>
                  </div>

                  <div className="slip-line" />
                  <div className="slip-section-title">--- MÜŞTERİ &amp; DESTEK ---</div>
                  <div className="slip-row">
                    <span>ÇÖZÜLEN TİCKETLAR:</span>
                    <span>{currentReportForSlip?.metrics?.ticketsResolved ?? liveData?.ticketsResolved ?? 0} / {currentReportForSlip?.metrics?.ticketsOpened ?? liveData?.ticketsOpened ?? 0}</span>
                  </div>
                  <div className="slip-row">
                    <span>YILDIZ ÜRÜN:</span>
                    <span>{currentReportForSlip?.highlights?.topProduct ?? liveData?.highlights?.topProduct ?? 'Yok'}</span>
                  </div>
                  <div className="slip-row">
                    <span>EN BÜYÜK SİPARİŞ:</span>
                    <span>₺{(currentReportForSlip?.highlights?.largestOrderAmount ?? liveData?.highlights?.largestOrderAmount ?? 0).toLocaleString('tr-TR')}</span>
                  </div>

                  {currentReportForSlip?.notes && (
                    <>
                      <div className="slip-line" />
                      <div className="slip-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.7rem', color: '#666' }}>YETKİLİ NOTU:</span>
                        <span style={{ fontStyle: 'italic', marginTop: '0.2rem' }}>{currentReportForSlip.notes}</span>
                      </div>
                    </>
                  )}

                  <div className="slip-line" />
                  <div className="slip-footer">
                    <div style={{ fontWeight: 700, letterSpacing: '0.1em' }}>*** MALİ DEĞERİ YOKTUR ***</div>
                    <div style={{ fontSize: '0.68rem', color: '#777', marginTop: '0.2rem' }}>
                      Wihyfe Discord Bot Sistemleri • Otomatik Gün Sonu Kaydı
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="admin-modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.85rem' }}>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={handleCloseModal}
          >
            Pencereyi Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
