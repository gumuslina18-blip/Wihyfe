'use client';

import React, { useState } from 'react';
import TiltCard from '@/components/TiltCard';

interface WalletTitaniumCardProps {
  balanceFormatted?: string;
  userName?: string;
  className?: string;
}

export default function WalletTitaniumCard({
  balanceFormatted = '0,00 TL',
  userName = 'Wihyfe Member',
  className = '',
}: WalletTitaniumCardProps) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  return (
    <div className={`titanium-card-container ${className}`}>
      <TiltCard maxAngle={14} perspective={1100} scale={1.03} glare={true}>
        <div
          className={`titanium-card-3d ${isFlipped ? 'is-card-flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
          title="Kartın arkasını görmek için tıklayın"
        >
          {/* FRONT FACE */}
          <div className="titanium-face titanium-face-front">
            {/* Carbon / Brushed Texture Overlay */}
            <div className="titanium-texture" aria-hidden="true" />
            <div className="titanium-iridescent-film" aria-hidden="true" />

            {/* Top Row: Chip + Contactless Wave + Brand */}
            <div className="titanium-card-header">
              <div className="titanium-chip-box">
                <div className="emv-chip">
                  <span className="chip-line line-1" />
                  <span className="chip-line line-2" />
                  <span className="chip-line line-3" />
                  <span className="chip-circuit" />
                </div>
                {/* Contactless Wave Icon */}
                <svg className="contactless-wave" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                  <path d="M12 19a8.5 8.5 0 0 0 0-14" />
                  <path d="M15.5 21.5a12 12 0 0 0 0-19" />
                </svg>
              </div>

              <div className="titanium-brand-logo">
                <span className="brand-tier-label">TITANIUM BLACK</span>
                <strong className="brand-name">WIHYFE</strong>
              </div>
            </div>

            {/* Middle: Masked Card Number */}
            <div className="titanium-card-number">
              <span>5412</span>
              <span>••••</span>
              <span>••••</span>
              <span>9410</span>
            </div>

            {/* Bottom Row: Balance & User Name */}
            <div className="titanium-card-footer">
              <div className="titanium-holder-col">
                <span className="card-label">KART SAHİBİ</span>
                <span className="card-val holder-name">{userName}</span>
              </div>

              <div className="titanium-balance-col">
                <span className="card-label">CÜZDAN BAKİYESİ</span>
                <span className="card-val balance-val text-emerald">{balanceFormatted}</span>
              </div>
            </div>
          </div>

          {/* BACK FACE */}
          <div className="titanium-face titanium-face-back">
            <div className="titanium-texture" aria-hidden="true" />
            
            {/* Magnetic Stripe */}
            <div className="titanium-magstripe" />

            {/* CVV & Signature Area */}
            <div className="titanium-signature-row">
              <div className="titanium-signature-strip">
                <span>AUTHORIZED SIGNATURE // WIHYFE DIGITAL VAULT</span>
              </div>
              <div className="titanium-cvv-box">
                <span className="cvv-label">CVV</span>
                <strong className="cvv-val">941</strong>
              </div>
            </div>

            {/* Security Notice & Security Hologram */}
            <div className="titanium-back-footer">
              <div className="titanium-hologram-seal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>256-BIT SSL ENCRYPTED</span>
              </div>
              <span className="titanium-gateway-tag">PayTR Verified Gateway</span>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* Flip Prompt Button */}
      <button
        type="button"
        className="titanium-flip-hint-btn"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
        <span>{isFlipped ? 'Kartın Ön Yüzünü Göster' : '3D Kartı Çevir (Arka Yüz)'}</span>
      </button>
    </div>
  );
}
