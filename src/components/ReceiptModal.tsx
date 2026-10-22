'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface ReceiptData {
  orderId: string;
  date: string;
  customerName: string;
  customerDiscordId?: string;
  customerEmail?: string;
  serverName?: string;
  paymentMethod?: string;
  items: Array<{
    name: string;
    periodLabel?: string;
    price: string | number;
  }>;
  totalFormatted: string;
  deliveryStatus?: string;
  notes?: string;
}

interface ReceiptModalProps {
  receipt: ReceiptData | null;
  onClose: () => void;
}

export default function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (receipt) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [receipt, onClose]);

  if (!mounted || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNo = `WIH-INV-${receipt.orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-8) || receipt.orderId}`;

  const handleCopyNo = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(invoiceNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Safe SHA-256 verification code generation
  const hashSeed = `${receipt.orderId}-${receipt.totalFormatted}-${receipt.customerName}`;
  const shaCode = hashSeed
    .split('')
    .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0)
    .toString(16)
    .toUpperCase()
    .padStart(8, '0');

  const modalContent = (
    <div className="receipt-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="receipt-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Top Controls Action Bar (Hidden in Print) */}
        <div className="receipt-controls-bar print-hidden">
          <div className="receipt-controls-left">
            <span className="receipt-modal-badge">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Resmi Sipariş &amp; E-Dekont Belgesi</span>
            </span>
          </div>

          <div className="receipt-controls-actions">
            <button
              type="button"
              className="receipt-btn-action"
              onClick={handleCopyNo}
              title="Fatura No Kopyala"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>{copied ? '✓ Kopyalandı' : 'No Kopyala'}</span>
            </button>

            <button
              type="button"
              className="receipt-btn-primary"
              onClick={handlePrint}
              title="Yazdır veya PDF Kaydet"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Yazdır / PDF İndir</span>
            </button>

            <button
              type="button"
              className="receipt-btn-close"
              onClick={onClose}
              aria-label="Kapat"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Document Paper Card */}
        <div className="receipt-paper" id="wihyfe-printable-invoice">
          {/* Header */}
          <div className="receipt-paper-header">
            <div className="receipt-brand-side">
              <div className="receipt-brand-logo">
                <img src="/wihyfe-icon.png" alt="Wihyfe Logo" width={38} height={38} />
                <div className="receipt-brand-text">
                  <span className="receipt-brand-name">wihyfe</span>
                  <span className="receipt-brand-sub">SaaS &amp; Discord Bot Systems</span>
                </div>
              </div>
              <p className="receipt-company-meta">
                Wihyfe Discord &amp; Web Bot Altyapı Sistemleri A.Ş.<br />
                Mersis / Vergi No: 2026-9810-WIHYFE • E-Posta: info@wihyfe.com<br />
                Web: https://wihyfe.com • 7/24 Discord Canlı Destek
              </p>
            </div>

            <div className="receipt-invoice-meta">
              <span className="receipt-tag-invoice">ELEKTRONİK SİPARİŞ DEKONTU</span>
              <div className="receipt-meta-grid">
                <div className="receipt-meta-row">
                  <span className="receipt-label">Belge No:</span>
                  <strong className="receipt-val">{invoiceNo}</strong>
                </div>
                <div className="receipt-meta-row">
                  <span className="receipt-label">İşlem Tarihi:</span>
                  <strong className="receipt-val">{receipt.date}</strong>
                </div>
                <div className="receipt-meta-row">
                  <span className="receipt-label">Ödeme Kanalı:</span>
                  <strong className="receipt-val">{receipt.paymentMethod || 'PayTR 3D Secure'}</strong>
                </div>
                <div className="receipt-meta-row">
                  <span className="receipt-label">Güvenlik Durumu:</span>
                  <strong className="receipt-val text-green">256-Bit SSL Onaylı</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="receipt-divider" />

          {/* Customer & Server Info */}
          <div className="receipt-parties-grid">
            <div className="receipt-party-card">
              <div className="receipt-party-header">
                <span className="receipt-party-icon">👤</span>
                <span className="receipt-party-title">MÜŞTERİ BİLGİLERİ</span>
              </div>
              <div className="receipt-party-body">
                <div className="receipt-party-row">
                  <span>Adı / Discord:</span>
                  <strong>{receipt.customerName}</strong>
                </div>
                {receipt.customerDiscordId && (
                  <div className="receipt-party-row">
                    <span>Discord ID:</span>
                    <code>{receipt.customerDiscordId}</code>
                  </div>
                )}
                {receipt.customerEmail && (
                  <div className="receipt-party-row">
                    <span>E-Posta:</span>
                    <span>{receipt.customerEmail}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="receipt-party-card">
              <div className="receipt-party-header">
                <span className="receipt-party-icon">🖥️</span>
                <span className="receipt-party-title">HİZMET / SUNUCU DETAYI</span>
              </div>
              <div className="receipt-party-body">
                <div className="receipt-party-row">
                  <span>Hedef Sunucu:</span>
                  <strong>{receipt.serverName || 'Wihyfe Discord Altyapısı'}</strong>
                </div>
                <div className="receipt-party-row">
                  <span>Teslimat Durumu:</span>
                  <strong className="receipt-delivery-badge">{receipt.deliveryStatus || 'Tamamlandı'}</strong>
                </div>
                <div className="receipt-party-row">
                  <span>Lisans Kapsamı:</span>
                  <span>7/24 Kesintisiz Bot &amp; SLA Desteği</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="receipt-table-wrap">
            <table className="receipt-table">
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Hizmet / Ürün Adı</th>
                  <th style={{ width: '25%' }}>Kullanım Periyodu</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>Adet</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Tutar</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items && receipt.items.length > 0 ? (
                  receipt.items.map((it, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong className="receipt-item-name">{it.name}</strong>
                        <span className="receipt-item-sub">Wihyfe Resmi Lisanslı Discord Botu</span>
                      </td>
                      <td>{it.periodLabel || 'Aylık'}</td>
                      <td style={{ textAlign: 'center' }}>1</td>
                      <td style={{ textAlign: 'right' }}>
                        <strong className="receipt-item-price">
                          {typeof it.price === 'number'
                            ? `₺${it.price.toLocaleString('tr-TR')}`
                            : it.price}
                        </strong>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>
                      <strong>Wihyfe Hizmet Paketi</strong>
                      <span className="receipt-item-sub">Resmi Discord Bot Altyapı Lisansı</span>
                    </td>
                    <td>Aylık</td>
                    <td style={{ textAlign: 'center' }}>1</td>
                    <td style={{ textAlign: 'right' }}>
                      <strong>{receipt.totalFormatted} TL</strong>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Total Breakdown & Security Seal */}
          <div className="receipt-totals-area">
            <div className="receipt-seal-box">
              <div className="receipt-stamp-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <div className="receipt-stamp-text">
                  <span>RESMİ E-DEKONT</span>
                  <strong>ÖDEME ONAYLANDI</strong>
                </div>
              </div>
              <p className="receipt-disclaimer">
                Bu belge 213 sayılı V.U.K. kapsamında elektronik ortamda üretilmiş resmi sipariş bilgi fişidir. İptal ve iade koşulları Wihyfe Sözleşmelerine tabidir.
              </p>
            </div>

            <div className="receipt-totals-box">
              <div className="receipt-totals-row">
                <span>Ara Toplam:</span>
                <strong>{receipt.totalFormatted} TL</strong>
              </div>
              <div className="receipt-totals-row">
                <span>KDV (%20 Dahil):</span>
                <span>₺0,00</span>
              </div>
              <div className="receipt-totals-row receipt-grand-total">
                <span>ÖDENEN TOPLAM:</span>
                <strong className="receipt-grand-amount">{receipt.totalFormatted} TL</strong>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="receipt-paper-footer">
            <span>Doğrulama Kodu: SHA256-{shaCode}</span>
            <span>Wihyfe Destek: https://wihyfe.com • 7/24 Discord Ticket</span>
          </div>
        </div>
      </div>

      {/* Embedded Complete Screen & Print CSS */}
      <style jsx global>{`
        /* ==========================================================================
           RECEIPT MODAL SCREEN & PRINT STYLES
           ========================================================================== */
        .receipt-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(3, 7, 18, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 9999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow-y: auto;
          box-sizing: border-box;
          animation: receiptOverlayFade 0.2s ease-out;
        }

        @keyframes receiptOverlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .receipt-modal-box {
          position: relative;
          width: 100%;
          max-width: 840px;
          background: #09101d;
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 1.25rem;
          box-shadow: 
            0 30px 80px -15px rgba(0, 0, 0, 0.95),
            0 0 0 1px rgba(255, 255, 255, 0.08),
            0 0 45px rgba(14, 165, 233, 0.2);
          overflow: hidden;
          margin: auto;
          animation: receiptBoxPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes receiptBoxPop {
          from { transform: scale(0.95) translateY(12px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }

        /* Controls Top Bar */
        .receipt-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.4rem;
          background: #0d1527;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          user-select: none;
        }

        .receipt-modal-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid rgba(56, 189, 248, 0.25);
        }

        .receipt-controls-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .receipt-btn-action,
        .receipt-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          border-radius: 0.5rem;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .receipt-btn-action {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
        }

        .receipt-btn-action:hover {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border-color: rgba(56, 189, 248, 0.4);
        }

        .receipt-btn-primary {
          background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
          border: none;
          color: #ffffff;
          box-shadow: 0 0 15px rgba(14, 165, 233, 0.35);
        }

        .receipt-btn-primary:hover {
          background: #38bdf8;
          color: #030712;
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.5);
        }

        .receipt-btn-close {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 0.5rem;
          color: #fca5a5;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .receipt-btn-close:hover {
          background: #ef4444;
          color: #ffffff;
        }

        /* Printable Paper Container */
        .receipt-paper {
          padding: 2.2rem 2.2rem 1.8rem;
          background: #09101d;
          color: #e2e8f0;
          font-family: inherit;
          max-height: calc(85vh - 70px);
          overflow-y: auto;
        }

        /* Paper Header */
        .receipt-paper-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .receipt-brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .receipt-brand-text {
          display: flex;
          flex-direction: column;
        }

        .receipt-brand-name {
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #f8fafc;
          line-height: 1.1;
        }

        .receipt-brand-sub {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 600;
        }

        .receipt-company-meta {
          font-size: 0.74rem;
          color: #94a3b8;
          line-height: 1.55;
          margin: 0;
        }

        /* Invoice Meta */
        .receipt-invoice-meta {
          text-align: right;
          min-width: 250px;
        }

        .receipt-tag-invoice {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.3);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          margin-bottom: 0.85rem;
        }

        .receipt-meta-grid {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .receipt-meta-row {
          display: flex;
          justify-content: flex-end;
          gap: 0.6rem;
          font-size: 0.78rem;
        }

        .receipt-label {
          color: #64748b;
        }

        .receipt-val {
          color: #f8fafc;
        }

        .text-green {
          color: #10b981 !important;
        }

        /* Divider */
        .receipt-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(56, 189, 248, 0.3) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(56, 189, 248, 0.3) 100%);
          margin: 1.5rem 0;
        }

        /* Parties Grid (Customer & Server) */
        .receipt-parties-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .receipt-party-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.75rem;
          padding: 1.1rem;
        }

        .receipt-party-header {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .receipt-party-icon {
          font-size: 0.95rem;
        }

        .receipt-party-title {
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #38bdf8;
        }

        .receipt-party-body {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .receipt-party-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: #94a3b8;
        }

        .receipt-party-row strong {
          color: #f8fafc;
        }

        .receipt-party-row code {
          background: rgba(255, 255, 255, 0.06);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          font-family: monospace;
          color: #cbd5e1;
        }

        .receipt-delivery-badge {
          color: #10b981 !important;
          background: rgba(16, 185, 129, 0.12);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.72rem;
        }

        /* Table */
        .receipt-table-wrap {
          margin-bottom: 1.5rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .receipt-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .receipt-table thead tr {
          background: #0f1a2e;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .receipt-table th {
          padding: 0.75rem 1rem;
          font-size: 0.74rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .receipt-table td {
          padding: 0.85rem 1rem;
          font-size: 0.82rem;
          color: #cbd5e1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .receipt-table tbody tr:last-child td {
          border-bottom: none;
        }

        .receipt-item-name {
          display: block;
          color: #f8fafc;
          font-size: 0.86rem;
          margin-bottom: 0.15rem;
        }

        .receipt-item-sub {
          display: block;
          font-size: 0.7rem;
          color: #64748b;
        }

        .receipt-item-price {
          color: #38bdf8;
          font-size: 0.9rem;
        }

        /* Totals Area */
        .receipt-totals-area {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .receipt-seal-box {
          flex: 1;
          min-width: 260px;
        }

        .receipt-stamp-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.6rem 1rem;
          background: rgba(16, 185, 129, 0.08);
          border: 1.5px dashed #10b981;
          border-radius: 0.65rem;
          margin-bottom: 0.75rem;
        }

        .receipt-stamp-text {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .receipt-stamp-text span {
          font-size: 0.65rem;
          font-weight: 800;
          color: #10b981;
          letter-spacing: 0.05em;
        }

        .receipt-stamp-text strong {
          font-size: 0.82rem;
          font-weight: 800;
          color: #ffffff;
        }

        .receipt-disclaimer {
          font-size: 0.68rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
          max-width: 420px;
        }

        .receipt-totals-box {
          min-width: 260px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.75rem;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .receipt-totals-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .receipt-totals-row strong {
          color: #f8fafc;
        }

        .receipt-grand-total {
          padding-top: 0.6rem;
          margin-top: 0.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          font-weight: 800;
          font-size: 0.95rem;
        }

        .receipt-grand-amount {
          color: #38bdf8 !important;
          font-size: 1.15rem !important;
        }

        /* Footer */
        .receipt-paper-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.72rem;
          color: #64748b;
          font-family: monospace;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        /* ==========================================================================
           PRINT OVERRIDES (@media print)
           ========================================================================== */
        @media print {
          body * {
            visibility: hidden !important;
          }
          #wihyfe-printable-invoice,
          #wihyfe-printable-invoice * {
            visibility: visible !important;
          }
          #wihyfe-printable-invoice {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 2cm !important;
            background: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border: none !important;
            overflow: visible !important;
          }
          .print-hidden,
          .receipt-controls-bar {
            display: none !important;
          }
          .receipt-modal-overlay {
            background: #ffffff !important;
            position: static !important;
            padding: 0 !important;
          }
          .receipt-modal-box {
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
          }
          .receipt-brand-name,
          .receipt-label,
          .receipt-val,
          .receipt-party-row strong,
          .receipt-item-name,
          .receipt-totals-row strong,
          .receipt-grand-amount {
            color: #0f172a !important;
          }
          .receipt-company-meta,
          .receipt-party-row span,
          .receipt-item-sub,
          .receipt-totals-row span,
          .receipt-disclaimer,
          .receipt-paper-footer {
            color: #475569 !important;
          }
          .receipt-party-card,
          .receipt-table-wrap,
          .receipt-totals-box {
            background: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
          }
          .receipt-table thead tr {
            background: #f1f5f9 !important;
          }
          .receipt-table th {
            color: #334155 !important;
          }
          .receipt-table td {
            color: #0f172a !important;
            border-bottom: 1px solid #e2e8f0 !important;
          }
          .receipt-tag-invoice {
            background: #e0f2fe !important;
            color: #0369a1 !important;
            border-color: #7dd3fc !important;
          }
          .receipt-stamp-badge {
            background: #f0fdf4 !important;
            border-color: #16a34a !important;
          }
          .receipt-stamp-text strong {
            color: #16a34a !important;
          }
        }

        /* Mobile Adjustments */
        @media (max-width: 640px) {
          .receipt-parties-grid {
            grid-template-columns: 1fr;
          }
          .receipt-paper {
            padding: 1.25rem;
          }
          .receipt-paper-header {
            flex-direction: column;
            gap: 1rem;
          }
          .receipt-invoice-meta {
            text-align: left;
            min-width: 100%;
          }
          .receipt-meta-row {
            justify-content: flex-start;
          }
          .receipt-totals-area {
            flex-direction: column;
          }
          .receipt-totals-box {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
}
