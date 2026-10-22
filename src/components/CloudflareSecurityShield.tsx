'use client';

import React, { useState, useEffect } from 'react';

export default function CloudflareSecurityShield() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [rayId, setRayId] = useState('');

  useEffect(() => {
    // Generate an authentic random Ray ID
    const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    setRayId(randomHex);

    // Bypass security shield completely if inside iframe demo or on showcase routes
    try {
      if (typeof window !== 'undefined' && (window.self !== window.top || window.location.pathname.startsWith('/showcase'))) {
        setIsVisible(false);
        return;
      }
    } catch {
      // Ignore security errors
    }

    // Check if previously verified in this session
    try {
      const hasVerified = sessionStorage.getItem('wihyfe_cf_verified');
      const urlParams = new URLSearchParams(window.location.search);
      const forceCheck = urlParams.has('verify') || urlParams.has('shield');

      if (hasVerified && !forceCheck) {
        setIsVisible(false);
        return;
      }
    } catch {
      // Ignore storage errors in restricted iframes
    }

    // Prevent body scroll during verification
    document.body.style.overflow = 'hidden';

    // Step 1: Verification spinner runs for 1.6s
    const verifyTimer = setTimeout(() => {
      setIsVerified(true);

      // Step 2: Show green checkmark for 500ms, then start smooth fade-out
      const fadeTimer = setTimeout(() => {
        setIsFading(true);

        try {
          sessionStorage.setItem('wihyfe_cf_verified', 'true');
        } catch {
          // ignore
        }

        // Step 3: Remove from DOM after fade animation completes
        const removeTimer = setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = '';
        }, 500);

        return () => clearTimeout(removeTimer);
      }, 550);

      return () => clearTimeout(fadeTimer);
    }, 1600);

    return () => {
      clearTimeout(verifyTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`cf-shield-overlay ${isFading ? 'cf-shield-fadeout' : ''}`}
      id="cloudflare-security-shield"
      role="dialog"
      aria-modal="true"
      aria-label="Güvenlik doğrulaması"
    >
      <div className="cf-shield-container">
        {/* Domain Title */}
        <h1 className="cf-shield-domain">wihyfe.com</h1>

        {/* Status Heading */}
        <h2 className="cf-shield-title">Güvenlik doğrulaması yapılıyor</h2>

        {/* Subtitle Description */}
        <p className="cf-shield-desc">
          Bu web sitesi, kötü niyetli botlara karşı korunmak için bir güvenlik hizmeti kullanıyor.
          Web sitesi bir bot olmadığınızı doğrularken bu sayfa görüntülenir.
        </p>

        {/* Cloudflare Turnstile Verification Box */}
        <div className="cf-turnstile-box">
          <div className="cf-turnstile-left">
            {!isVerified ? (
              <div className="cf-turnstile-spinner-wrap">
                <div className="cf-dots-spinner">
                  <span className="dot dot-1" />
                  <span className="dot dot-2" />
                  <span className="dot dot-3" />
                  <span className="dot dot-4" />
                  <span className="dot dot-5" />
                  <span className="dot dot-6" />
                  <span className="dot dot-7" />
                  <span className="dot dot-8" />
                </div>
                <span className="cf-verifying-text">Doğrulanıyor...</span>
              </div>
            ) : (
              <div className="cf-turnstile-success-wrap">
                <div className="cf-success-circle">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="cf-success-text">Başarılı</span>
              </div>
            )}
          </div>

          <div className="cf-turnstile-right">
            {/* Cloudflare Orange Cloud Logo */}
            <div className="cf-brand-logo-row">
              <svg
                className="cf-cloud-icon"
                width="28"
                height="19"
                viewBox="0 0 64 42"
                fill="none"
              >
                <path
                  d="M48.7 17.2C46.8 9.9 40.2 4.6 32.4 4.6c-6.8 0-12.8 4-15.3 10.1C13.2 15.3 10 18.7 10 23c0 4.8 3.9 8.7 8.7 8.7h29.8c5.2 0 9.5-4.3 9.5-9.5 0-4.6-3.3-8.4-7.8-9.3l-1.5-.7z"
                  fill="#F48120"
                />
                <path
                  d="M48.5 31.7H18.7C13.9 31.7 10 27.8 10 23c0-4.3 3.2-7.7 7.1-8.3.4 0 .7-.3.8-.7 2.5-6.1 8.5-10.1 15.3-10.1 7.8 0 14.4 5.3 16.3 12.6.1.4.5.7.9.7 4.5.9 7.8 4.7 7.8 9.3 0 5.2-4.3 9.2-9.7 9.2z"
                  fill="#F6821F"
                />
              </svg>
              <span className="cf-brand-name">CLOUDFLARE</span>
            </div>
            <div className="cf-sublinks">
              <span className="cf-link">Gizlilik</span>
              <span className="cf-separator">•</span>
              <span className="cf-link">Yardım</span>
            </div>
          </div>
        </div>

        {/* Footer info metadata */}
        <div className="cf-shield-footer">
          <p className="cf-footer-ray">
            Ray ID: <code>{rayId || '8f2b309e4a179c'}</code>
          </p>
          <p className="cf-footer-disclaimer">
            Performans ve güvenlik Cloudflare tarafından sağlanmaktadır
          </p>
        </div>
      </div>
    </div>
  );
}
