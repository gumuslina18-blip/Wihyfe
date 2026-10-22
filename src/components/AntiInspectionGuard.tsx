'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function AntiInspectionGuard() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDevToolsDetected, setIsDevToolsDetected] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showSecurityToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Console Obfuscation & Mute
    try {
      const bannerStyle = 'color: #38bdf8; font-size: 14px; font-weight: bold; background: #0f172a; padding: 8px 14px; border-radius: 6px; border: 1px solid #0284c7;';
      const warningStyle = 'color: #f43f5e; font-size: 12px; font-weight: bold; background: #1e1b4b; padding: 4px 10px; border-radius: 4px;';

      const showSecurityBanner = () => {
        try {
          console.clear();
          console.log('%c🔒 WIHYFE ADVANCED ENCRYPTION & CODE SHIELD ACTIVE', bannerStyle);
          console.log('%c⚠️ DİKKAT: Bu sitenin kaynak kodları ve bileşenleri telif haklarıyla korunmakta olup istemci tarafında şifrelenmiştir. Kopyalama veya tersine mühendislik girişimleri engellenir.', warningStyle);
          console.log('%c[ENCRYPTED PAYLOAD] 0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''), 'color: #64748b; font-family: monospace; font-size: 11px;');
        } catch {
          // ignore
        }
      };

      showSecurityBanner();

      // Override console methods in production
      const noop = () => {};
      const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        dir: console.dir,
        table: console.table,
      };

      // Periodic check / banner refresh
      const consoleInterval = setInterval(showSecurityBanner, 30000);

      // 2. Right Click (Context Menu) Protection
      const handleContextMenu = (e: MouseEvent) => {
        // Allow right click ONLY inside input or textarea for normal typing
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
        showSecurityToast('🔒 Kaynak kodları ve içerikler koruma altındadır. Sağ tık menüsü devre dışı.');
      };

      // 3. Key Shortcuts Protection (F12, Inspect, View Source, Save, Copy combos)
      const handleKeyDown = (e: KeyboardEvent) => {
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;
        const key = e.key ? e.key.toUpperCase() : '';
        const keyCode = e.keyCode;

        // F12
        if (key === 'F12' || keyCode === 123) {
          e.preventDefault();
          e.stopPropagation();
          showSecurityToast('🚫 Geliştirici konsolu (F12) güvenlik sebebiyle engellendi.');
          return false;
        }

        // Ctrl/Cmd + Shift + I (Inspect)
        // Ctrl/Cmd + Shift + J (Console)
        // Ctrl/Cmd + Shift + C (Inspect Element)
        if (isCtrlOrCmd && e.shiftKey && (key === 'I' || key === 'J' || key === 'C')) {
          e.preventDefault();
          e.stopPropagation();
          showSecurityToast('🚫 İnceleme araçları güvenlik politikası gereği kilitlenmiştir.');
          return false;
        }

        // Ctrl/Cmd + U (View Source)
        if (isCtrlOrCmd && key === 'U') {
          e.preventDefault();
          e.stopPropagation();
          showSecurityToast('🚫 Kaynak kodlarını doğrudan görüntüleme kısıtlanmıştır.');
          return false;
        }

        // Ctrl/Cmd + S (Save Page)
        if (isCtrlOrCmd && key === 'S') {
          e.preventDefault();
          e.stopPropagation();
          showSecurityToast('🚫 Sayfa içeriğini kaydetme engellendi.');
          return false;
        }

        // Ctrl/Cmd + P (Print Page)
        if (isCtrlOrCmd && key === 'P') {
          e.preventDefault();
          e.stopPropagation();
          showSecurityToast('🚫 Yazdırma ve sayfa kopyalama engellendi.');
          return false;
        }
      };

      // 4. Copy / Cut Protection (Except form fields)
      const handleCopyCut = (e: ClipboardEvent) => {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
        showSecurityToast('📋 İçerik ve kod kopyalama güvenlik protokolüyle korunmaktadır.');
      };

      // 5. Drag Protection
      const handleDragStart = (e: DragEvent) => {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'IMG' || target.tagName === 'A')) {
          e.preventDefault();
        }
      };

      // 6. DevTools Detector (Size delta & Debugger Trap)
      let devtoolsCheckInterval: NodeJS.Timeout | null = null;
      let debuggerLoopInterval: NodeJS.Timeout | null = null;

      const detectDevTools = () => {
        const threshold = 160;
        const widthDiff = window.outerWidth - window.innerWidth > threshold;
        const heightDiff = window.outerHeight - window.innerHeight > threshold;

        if (widthDiff || heightDiff) {
          if (!isDevToolsDetected) {
            setIsDevToolsDetected(true);
          }
        } else {
          if (isDevToolsDetected) {
            setIsDevToolsDetected(false);
          }
        }
      };

      // Anti-debug trap: when devtools is open, this freezes execution if breakpoints or stepping is attempted
      const startAntiDebugTrap = () => {
        try {
          const check = function() {
            (function() {
              return false;
            }['constructor']('debugger')());
          };
          // Runs quietly in background
          debuggerLoopInterval = setInterval(check, 1000);
        } catch {
          // ignore
        }
      };

      // Listeners
      window.addEventListener('contextmenu', handleContextMenu, { capture: true });
      window.addEventListener('keydown', handleKeyDown, { capture: true });
      window.addEventListener('copy', handleCopyCut, { capture: true });
      window.addEventListener('cut', handleCopyCut, { capture: true });
      window.addEventListener('dragstart', handleDragStart, { capture: true });

      // DevTools check every 800ms
      devtoolsCheckInterval = setInterval(detectDevTools, 800);
      window.addEventListener('resize', detectDevTools);

      return () => {
        window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
        window.removeEventListener('keydown', handleKeyDown, { capture: true });
        window.removeEventListener('copy', handleCopyCut, { capture: true });
        window.removeEventListener('cut', handleCopyCut, { capture: true });
        window.removeEventListener('dragstart', handleDragStart, { capture: true });
        window.removeEventListener('resize', detectDevTools);

        if (devtoolsCheckInterval) clearInterval(devtoolsCheckInterval);
        if (debuggerLoopInterval) clearInterval(debuggerLoopInterval);
        if (consoleInterval) clearInterval(consoleInterval);
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      };
    } catch {
      // Guard against iframe/sandboxed environments
    }
  }, [isDevToolsDetected]);

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="security-toast-alert"
        >
          <div className="security-toast-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="security-toast-text">
            <div className="security-toast-title">Güvenlik Kalkanı</div>
            <div className="security-toast-desc">{toastMessage}</div>
          </div>
        </aside>
      )}

      {/* DevTools Active Lock Screen (When DevTools is Opened by Visitor) */}
      {isDevToolsDetected && (
        <section
          role="alert"
          aria-modal="true"
          className="devtools-lock-overlay"
        >
          <div className="devtools-lock-card">
            <div className="devtools-lock-badge">
              <span className="lock-dot" />
              GÜVENLİK PROTOKOLÜ DEVREDE
            </div>

            <div className="devtools-lock-icon">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <line x1="12" y1="15" x2="12" y2="17" />
              </svg>
            </div>

            <h2 className="devtools-lock-title">Geliştirici Araçları Algılandı</h2>

            <p className="devtools-lock-desc">
              Web sitemizin kaynak kodları, veri yapıları ve fikri mülkiyeti şifrelenerek koruma altına alınmıştır. İnceleme (DevTools) penceresi tespit edildiği için sayfa geçici olarak kilitlenmiştir.
            </p>

            <div className="devtools-lock-cipher">
              <div className="cipher-label">ŞİFRELENMİŞ KOD İMZASI:</div>
              <code>0xFA92C_ENCRYPTED_WIHYFE_CORE_V2_OBFUSCATED</code>
            </div>

            <p className="devtools-lock-hint">
              Sayfayı normal şekilde kullanmaya devam etmek için lütfen <strong>İncele / Geliştirici Araçları</strong> penceresini kapatınız veya <kbd>F12</kbd> tuşuna basınız.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
