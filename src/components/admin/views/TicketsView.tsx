'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { AdminTicket } from '@/config/admin';
import {
  IconSearch,
  IconCheck,
  IconX,
  IconActivity,
  IconClock,
  IconZap,
  IconUser,
} from '../AdminIcons';

const QUICK_TEMPLATES = [
  'Merhaba! Talebiniz yetkili ekibimiz tarafından incelemeye alınmıştır, en kısa sürede çözülecektir.',
  'Bot kurulumunuz ve sunucu yetkilendirmesi tamamlanmıştır. Lütfen sunucunuzda kontrol ediniz.',
  'Ödeme ve bakiye işleminiz incelenmiş ve sistemde onaylanmıştır.',
  'Bildirdiğiniz teknik aksaklık giderilmiştir. Başka bir sorunuz olursa lütfen bize yazınız.',
];

export default function TicketsView() {
  const {
    tickets,
    replyTicket,
    updateTicketStatus,
    deleteTicket,
    refreshTickets,
    currentStaff,
  } = useAdmin();

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto select first ticket if none selected or if selected was deleted
  useEffect(() => {
    if (tickets.length > 0 && (!selectedTicketId || !tickets.some((t) => t.id === selectedTicketId))) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  // Scroll to bottom when thread updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicketId, tickets]);

  const selectedTicket = useMemo(() => {
    return tickets.find((t) => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  // Filtered tickets list
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'open' && t.status === 'open') ||
        (statusFilter === 'in_progress' && t.status === 'in_progress') ||
        (statusFilter === 'resolved' && (t.status === 'resolved' || t.status === 'closed'));

      const q = searchQuery.toLowerCase();
      const matchSearch =
        t.id.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);

      return matchStatus && matchSearch;
    });
  }, [tickets, statusFilter, searchQuery]);

  // KPI Metrics
  const countOpen = tickets.filter((t) => t.status === 'open').length;
  const countInProgress = tickets.filter((t) => t.status === 'in_progress').length;
  const countResolved = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    const ok = await replyTicket(selectedTicket.id, replyText);
    if (ok) {
      setReplyText('');
    }
    setIsSubmittingReply(false);
  };

  const handleApplyTemplate = (tpl: string) => {
    setReplyText((prev) => (prev ? `${prev} ${tpl}` : tpl));
  };

  return (
    <div className="admin-view-body">
      {/* Top Financial / Ticket KPI Metrics */}
      <div className="admin-metric-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">Toplam Destek Talebi</span>
            <div className="admin-metric-icon" style={{ color: '#60a5fa' }}>
              <IconActivity size={16} />
            </div>
          </div>
          <div className="admin-metric-value">{tickets.length}</div>
          <div className="admin-metric-sub">Site içi aktif ticket veritabanı</div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">Bekleyen / Açık Talepler</span>
            <div className="admin-metric-icon" style={{ color: countOpen > 0 ? '#f59e0b' : '#34d399' }}>
              <IconClock size={16} />
            </div>
          </div>
          <div className="admin-metric-value" style={{ color: countOpen > 0 ? '#fbbf24' : '#34d399' }}>
            {countOpen}
          </div>
          <div className="admin-metric-sub">
            {countOpen > 0 ? (
              <strong style={{ color: '#fbbf24' }}>Yetkili yanıtı bekleyen talepler</strong>
            ) : (
              'Tüm açık talepler yanıtlandı'
            )}
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">İşlemde Olanlar</span>
            <div className="admin-metric-icon" style={{ color: '#38bdf8' }}>
              <IconZap size={16} />
            </div>
          </div>
          <div className="admin-metric-value" style={{ color: '#38bdf8' }}>
            {countInProgress}
          </div>
          <div className="admin-metric-sub">Görüşme ve inceleme sürüyor</div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span className="admin-metric-title">Çözülen Talepler</span>
            <div className="admin-metric-icon" style={{ color: '#10b981' }}>
              <IconCheck size={16} />
            </div>
          </div>
          <div className="admin-metric-value" style={{ color: '#10b981' }}>
            {countResolved}
          </div>
          <div className="admin-metric-sub">Başarıyla tamamlanan talepler</div>
        </div>
      </div>

      {/* Main Split Layout: Tickets List (Left) + Ticket Chat (Right) */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          minHeight: '680px',
          maxHeight: '780px',
        }}>
          {/* LEFT COLUMN: TICKET LIST */}
          <div style={{
            borderRight: '1px solid var(--admin-border)',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(5, 10, 20, 0.4)',
          }}>
            {/* Search & Header */}
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span>Destek Talepleri</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(8, 120, 255, 0.2)', color: '#93c5fd' }}>
                    {filteredTickets.length}
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={refreshTickets}
                  className="admin-btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                >
                  Yenile
                </button>
              </div>

              {/* Search Bar */}
              <div className="admin-search-wrap" style={{ width: '100%' }}>
                <IconSearch size={14} className="admin-search-icon" />
                <input
                  type="text"
                  placeholder="ID, müşteri veya konu ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-search-input"
                  style={{ width: '100%', fontSize: '0.78rem' }}
                />
              </div>

              {/* Status Filter Pills */}
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
                <button
                  type="button"
                  className={`admin-tf-btn ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                >
                  Tümü ({tickets.length})
                </button>
                <button
                  type="button"
                  className={`admin-tf-btn ${statusFilter === 'open' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('open')}
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                >
                  Açık ({countOpen})
                </button>
                <button
                  type="button"
                  className={`admin-tf-btn ${statusFilter === 'in_progress' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('in_progress')}
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                >
                  İşlemde ({countInProgress})
                </button>
                <button
                  type="button"
                  className={`admin-tf-btn ${statusFilter === 'resolved' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('resolved')}
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                >
                  Çözüldü ({countResolved})
                </button>
              </div>
            </div>

            {/* Tickets Scroll List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.65rem' }}>
              {filteredTickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-dim)', fontSize: '0.82rem' }}>
                  Arama veya filtre kriterine uygun destek talebi bulunamadı.
                </div>
              ) : (
                filteredTickets.map((t) => {
                  const isSelected = t.id === selectedTicketId;
                  const isOpen = t.status === 'open';
                  const isInProgress = t.status === 'in_progress';
                  const isResolved = t.status === 'resolved' || t.status === 'closed';

                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      style={{
                        padding: '0.85rem',
                        marginBottom: '0.5rem',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(8, 120, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid rgba(8, 120, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.06)',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace', color: '#93c5fd' }}>
                          #{t.id}
                        </span>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.12rem 0.45rem',
                          borderRadius: '999px',
                          background: isOpen ? 'rgba(245, 158, 11, 0.18)' : isInProgress ? 'rgba(56, 189, 248, 0.18)' : 'rgba(16, 185, 129, 0.18)',
                          color: isOpen ? '#fbbf24' : isInProgress ? '#38bdf8' : '#34d399',
                          border: `1px solid ${isOpen ? 'rgba(245, 158, 11, 0.4)' : isInProgress ? 'rgba(56, 189, 248, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                        }}>
                          {isOpen ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fbbf24' }} />
                              <span>Açık</span>
                            </span>
                          ) : isInProgress ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#38bdf8' }} />
                              <span>İşlemde</span>
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399' }} />
                              <span>Çözüldü</span>
                            </span>
                          )}
                        </span>
                      </div>

                      <h4 style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: isSelected ? '#fff' : '#e2e8f0',
                        margin: '0 0 0.35rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {t.subject}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--admin-text-dim)' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{t.customerName}</span>
                        <span>{t.createdAt.split(' ')[0]}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE TICKET THREAD & RESPONSE */}
          {selectedTicket ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(8, 14, 28, 0.6)' }}>
              {/* Thread Header */}
              <div style={{
                padding: '1.15rem 1.35rem',
                borderBottom: '1px solid var(--admin-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.85rem',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'monospace', color: '#60a5fa' }}>
                      #{selectedTicket.id}
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.12rem 0.5rem',
                      borderRadius: '4px',
                      background: 'rgba(168, 85, 247, 0.15)',
                      color: '#c084fc',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                    }}>
                      {selectedTicket.category}
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.12rem 0.5rem',
                      borderRadius: '4px',
                      background: selectedTicket.priority === 'high' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                      color: selectedTicket.priority === 'high' ? '#f87171' : '#93c5fd',
                    }}>
                      Öncelik: {selectedTicket.priority === 'high' ? 'Yüksek' : selectedTicket.priority === 'medium' ? 'Normal' : 'Düşük'}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0 0 0.2rem' }}>
                    {selectedTicket.subject}
                  </h2>
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)' }}>
                    Müşteri: <strong style={{ color: '#fff' }}>{selectedTicket.customerName}</strong> • Oluşturulma: {selectedTicket.createdAt}
                  </div>
                </div>

                {/* Quick Status Control Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  {selectedTicket.status !== 'in_progress' && (
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => updateTicketStatus(selectedTicket.id, 'in_progress')}
                      style={{ fontSize: '0.72rem', padding: '0.35rem 0.65rem' }}
                      title="Talebi işlemde durumuna al"
                    >
                      İşlemde Yap
                    </button>
                  )}
                  {selectedTicket.status !== 'resolved' && (
                    <button
                      type="button"
                      className="admin-btn-primary"
                      onClick={() => updateTicketStatus(selectedTicket.id, 'resolved')}
                      style={{ fontSize: '0.72rem', padding: '0.35rem 0.65rem', background: '#10b981', borderColor: '#059669' }}
                      title="Talebi çözüldü olarak kapat"
                    >
                      <IconCheck size={12} strokeWidth={2.5} />
                      <span>Çözüldü</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="admin-action-btn danger"
                    onClick={() => {
                      if (confirm('Bu destek talebini silmek istediğinize emin misiniz?')) {
                        deleteTicket(selectedTicket.id);
                      }
                    }}
                    style={{ fontSize: '0.72rem', padding: '0.35rem 0.55rem' }}
                    title="Talebi kalıcı olarak sil"
                  >
                    Sil
                  </button>
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                {selectedTicket.messages.map((m, idx) => {
                  const isStaff = m.isStaff;

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isStaff ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        alignSelf: isStaff ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        marginBottom: '0.3rem',
                        fontSize: '0.72rem',
                        color: 'var(--admin-text-dim)',
                      }}>
                        <strong style={{ color: isStaff ? '#93c5fd' : '#f1f5f9' }}>{m.sender}</strong>
                        {isStaff && (
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            padding: '0.08rem 0.4rem',
                            borderRadius: '999px',
                            background: 'rgba(8, 120, 255, 0.25)',
                            color: '#60a5fa',
                            border: '1px solid rgba(8, 120, 255, 0.4)',
                          }}>
                            YETKİLİ
                          </span>
                        )}
                        <span>• {m.timestamp}</span>
                      </div>

                      <div style={{
                        padding: '0.85rem 1.15rem',
                        borderRadius: isStaff ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        background: isStaff ? 'rgba(8, 120, 255, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                        border: isStaff ? '1px solid rgba(8, 120, 255, 0.45)' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#f8fafc',
                        fontSize: '0.85rem',
                        lineHeight: 1.55,
                        whiteSpace: 'pre-wrap',
                        boxShadow: isStaff ? '0 4px 16px rgba(8, 120, 255, 0.15)' : 'none',
                      }}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Templates Bar */}
              <div style={{
                padding: '0.5rem 1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'rgba(5, 10, 20, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                overflowX: 'auto',
              }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-dim)', whiteSpace: 'nowrap' }}>
                  Hızlı Şablonlar:
                </span>
                {QUICK_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="admin-login-hint-pill"
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', whiteSpace: 'nowrap' }}
                    title={tpl}
                  >
                    {tpl.slice(0, 32)}...
                  </button>
                ))}
              </div>

              {/* Staff Reply Box */}
              <form onSubmit={handleSendReply} style={{
                padding: '0.85rem 1.25rem 1.15rem',
                borderTop: '1px solid var(--admin-border)',
                background: 'rgba(5, 10, 20, 0.5)',
                display: 'flex',
                gap: '0.65rem',
                alignItems: 'flex-end',
              }}>
                <textarea
                  rows={2}
                  placeholder={`Yetkili (${currentStaff.username}) olarak yanıtınızı yazın...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(11, 20, 36, 0.85)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    color: '#fff',
                    fontSize: '0.82rem',
                    resize: 'none',
                    outline: 'none',
                    lineHeight: 1.45,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || isSubmittingReply}
                  className="admin-btn-primary"
                  style={{
                    height: '52px',
                    padding: '0 1.25rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    opacity: !replyText.trim() || isSubmittingReply ? 0.5 : 1,
                  }}
                >
                  <span>Yanıtla</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-dim)', fontSize: '0.85rem', padding: '2rem' }}>
              Görüntülemek için soldaki listeden bir destek talebi seçiniz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
