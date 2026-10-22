'use client';

import React from 'react';

export function VisaLogo() {
  return (
    <div className="footer-payment-card" title="Visa Kredi & Banka Kartları">
      <svg viewBox="0 0 48 32" width="46" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="5" fill="#ffffff" />
        <path
          d="M19.4 21.6h-2.9l1.8-11.2h2.9l-1.8 11.2zm11.7-11c-.6-.2-1.5-.4-2.7-.4-3 0-5.1 1.6-5.1 3.9 0 1.7 1.5 2.6 2.7 3.2 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.2-1.9 1.2-1.3 0-2-.2-3.1-.7l-.4-.2-.4 2.6c.7.3 2 .6 3.4.6 3.2 0 5.3-1.6 5.3-4 0-1.3-.8-2.3-2.6-3.2-1.1-.5-1.7-.9-1.7-1.5 0-.5.6-1.1 1.8-1.1 1 0 1.8.2 2.3.5l.3.1.8-2.6zm7.2 0h-2.3c-.7 0-1.2.2-1.5 1l-4.3 10.2h3.1l.6-1.7h3.8l.4 1.7h2.7l-2.5-11.2zm-3.6 7l1.6-4.3.9 4.3h-2.5zM15.5 10.6l-2.8 7.6-.3-1.5c-.5-1.8-2.1-3.7-3.9-4.7l2.5 9.8h3.1l4.7-11.2h-3.3z"
          fill="#1434CB"
        />
        <path d="M10.8 10.6H6.1l-.1.4c3.6.9 6 3.1 7 5.8l-1-5c-.2-.7-.7-1-1.2-1.2z" fill="#F7B600" />
      </svg>
    </div>
  );
}

export function MastercardLogo() {
  return (
    <div className="footer-payment-card" title="Mastercard Kredi & Banka Kartları">
      <svg viewBox="0 0 48 32" width="46" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="5" fill="#ffffff" />
        <circle cx="18" cy="16" r="9" fill="#EB001B" />
        <circle cx="30" cy="16" r="9" fill="#F79E1B" />
        <path
          d="M24 9.8a8.96 8.96 0 0 1 3.6 6.2 8.96 8.96 0 0 1-3.6 6.2 8.96 8.96 0 0 1-3.6-6.2c0-2.4 1-4.6 2.5-6.2h1.1z"
          fill="#FF5F00"
        />
      </svg>
    </div>
  );
}

export function TroyLogo() {
  return (
    <div className="footer-payment-card" title="TROY Kartlar">
      <svg viewBox="0 0 48 32" width="46" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="5" fill="#ffffff" />
        <path d="M8 10.5h11v3.2H15v8.5h-3.6v-8.5H8v-3.2z" fill="#0c2340" />
        <path
          d="M19.5 10.5h4.6c2.6 0 4.2 1.4 4.2 3.4 0 1.5-.9 2.6-2.2 3.1l2.7 5.2h-3.9l-2.2-4.4h-1.1v4.4h-3.4v-11.7h1.3zm3.6 4.6c1 0 1.6-.4 1.6-1.2 0-.8-.6-1.2-1.6-1.2h-1.4v2.4h1.4z"
          fill="#0c2340"
        />
        <path
          d="M27.5 16.3c0-3.6 2.4-6 5.8-6s5.8 2.4 5.8 6-2.4 6-5.8 6-5.8-2.4-5.8-6zm8.2 0c0-1.8-.9-3.1-2.4-3.1s-2.4 1.3-2.4 3.1.9 3.1 2.4 3.1 2.4-1.3 2.4-3.1z"
          fill="#0c2340"
        />
        <path
          d="M34 7.5c-4.2 0-7.3 2.4-8.5 5.8 1.1-1.7 3.3-3 6.4-3 3.6 0 6.1 2 6.8 5.2.4-4.5-1.4-8-4.7-8z"
          fill="#00A3E0"
        />
      </svg>
    </div>
  );
}

export function AmexLogo() {
  return (
    <div className="footer-payment-card" title="American Express">
      <svg viewBox="0 0 48 32" width="46" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="5" fill="#006FCF" />
        <rect x="2" y="2" width="44" height="28" rx="3.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
        <text
          x="24"
          y="19"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="9"
          fill="#ffffff"
          textAnchor="middle"
          letterSpacing="0.8"
        >
          AMEX
        </text>
      </svg>
    </div>
  );
}

export function UnionPayLogo() {
  return (
    <div className="footer-payment-card" title="UnionPay">
      <svg viewBox="0 0 48 32" width="46" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="5" fill="#ffffff" />
        <g transform="translate(6, 6)">
          <path d="M0 3c0-1.7 1.3-3 3-3h8l-3 20H0V3z" fill="#C21A22" />
          <path d="M10 0h8l-3 20H7l3-20z" fill="#004A80" />
          <path d="M17 0h8c1.7 0 3 1.3 3 3v14c0 1.7-1.3 3-3 3h-5l-3-20z" fill="#007B65" />
          <text
            x="17"
            y="13"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="6.5"
            fill="#ffffff"
            textAnchor="middle"
            fontStyle="italic"
          >
            Union
          </text>
          <text
            x="18"
            y="18.5"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="5"
            fill="#ffffff"
            textAnchor="middle"
          >
            Pay
          </text>
        </g>
      </svg>
    </div>
  );
}

export function PrepaidCardLogo() {
  return (
    <div className="footer-payment-card" title="Ön Ödemeli Kartlar (İninal, Papara, Paycell vb.)">
      <svg viewBox="0 0 48 32" width="46" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="5" fill="#182234" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        {/* EMV Chip */}
        <rect x="5.5" y="8" width="8" height="6.5" rx="1.5" fill="#F59E0B" stroke="#D97706" strokeWidth="0.5" />
        <line x1="9.5" y1="8" x2="9.5" y2="14.5" stroke="#92400E" strokeWidth="0.5" />
        <line x1="5.5" y1="11" x2="13.5" y2="11" stroke="#92400E" strokeWidth="0.5" />
        {/* Contactless Waves */}
        <path d="M16.5 9a3.5 3.5 0 0 1 0 4.5" stroke="#94A3B8" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M18.5 7.5a6 6 0 0 1 0 7.5" stroke="#94A3B8" strokeWidth="0.8" strokeLinecap="round" />
        {/* Label */}
        <text
          x="5"
          y="23.5"
          fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
          fontWeight="800"
          fontSize="4.8"
          fill="#38BDF8"
          letterSpacing="0.2"
        >
          ÖN ÖDEMELİ
        </text>
      </svg>
    </div>
  );
}

export function BkmExpressLogo() {
  return (
    <div className="footer-payment-card" title="Linkle Ödeme’de BKM Express">
      <svg viewBox="0 0 48 32" width="46" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="5" fill="#ffffff" />
        <rect x="4" y="6.5" width="16" height="19" rx="3.5" fill="#D31336" />
        <text
          x="12"
          y="18.5"
          fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
          fontWeight="900"
          fontSize="7"
          fill="#ffffff"
          textAnchor="middle"
        >
          BKM
        </text>
        <text
          x="23"
          y="14.5"
          fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
          fontWeight="900"
          fontSize="6"
          fill="#D31336"
        >
          EXPRESS
        </text>
        <path d="M23 18h20" stroke="#52525B" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function ToslaLogo() {
  return (
    <div className="footer-payment-card" title="Linkle Ödeme’de Tosla">
      <svg viewBox="0 0 48 32" width="46" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="5" fill="#FFDE00" />
        <circle cx="12" cy="16" r="4.8" fill="#000000" />
        <circle cx="12" cy="16" r="2" fill="#FFDE00" />
        <text
          x="28.5"
          y="20"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="11"
          fill="#000000"
          letterSpacing="-0.5"
        >
          tosla
        </text>
      </svg>
    </div>
  );
}

export default function PaymentMethodsBar() {
  return (
    <div className="footer-payments-bar">
      <div className="footer-payments-left">
        <div className="footer-payments-header">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>Güvenli Ödeme Yöntemleri</span>
          <span className="footer-payments-shield-badge">PayTR 3D Secure • 256-Bit SSL</span>
        </div>

        <div className="footer-payment-logos" aria-label="Kabul Edilen Ödeme Yöntemleri">
          <VisaLogo />
          <MastercardLogo />
          <TroyLogo />
          <AmexLogo />
          <UnionPayLogo />
          <PrepaidCardLogo />
          <BkmExpressLogo />
          <ToslaLogo />
        </div>

        <p className="footer-payments-description">
          Visa ve Mastercard kredi/banka kartları, TROY kartlar, American Express, UnionPay, Ön ödemeli kartlar; Linkle Ödeme’de ayrıca BKM Express ve Tosla ile 3D Secure korumalı güvenli ödeme.
        </p>
      </div>
    </div>
  );
}
