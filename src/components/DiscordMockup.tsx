'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

type ChannelType = 'destek' | 'guard' | 'kayit';

export default function DiscordMockup() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isTilting, setIsTilting] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Interactive Mockup States
  const [activeChannel, setActiveChannel] = useState<ChannelType>('destek');
  const [ping, setPing] = useState(14);
  const [isTicketClosed, setIsTicketClosed] = useState(false);
  const [logTaken, setLogTaken] = useState(false);
  const [spamGuardActive, setSpamGuardActive] = useState(true);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(true);

  // Live fluctuating ping
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 5) + 11); // 11ms - 15ms
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Notification auto-dismiss
  const showNotification = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => {
      setActiveNotification(null);
    }, 3800);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current || !cardRef.current) return;

    const wrapper = wrapperRef.current;
    const card = cardRef.current;
    const rect = wrapper.getBoundingClientRect();

    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    const maxTilt = 10;
    const tiltX = -percentY * maxTilt;
    const tiltY = percentX * maxTilt;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
      card.style.setProperty('--tilt-scale', '1.02');
      card.style.setProperty('--glare-x', `${glareX.toFixed(2)}%`);
      card.style.setProperty('--glare-y', `${glareY.toFixed(2)}%`);
      card.style.setProperty('--glare-opacity', '1');
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsTilting(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsTilting(false);

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    if (!cardRef.current) return;
    const card = cardRef.current;

    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
    card.style.setProperty('--tilt-scale', '1');
    card.style.setProperty('--glare-opacity', '0');
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="hero-mockup-wrapper"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className={`discord-mockup ${isTilting ? 'is-tilting' : ''}`}
        aria-label="Wihyfe Discord Arayüzü Canlı İnteraktif Simülatörü"
      >
        {/* Dynamic 3D Glare Reflection */}
        <div className="mockup-glare" aria-hidden="true" />

        {/* Mockup Topbar with Channels & Live Status */}
        <div className="mockup-header">
          <div className="mockup-channels-bar">
            <button
              type="button"
              className={`mockup-tab-pill ${activeChannel === 'destek' ? 'active' : ''}`}
              onClick={() => setActiveChannel('destek')}
            >
              <span className="mockup-hash">#</span>
              <span>destek-talepleri</span>
            </button>
            <button
              type="button"
              className={`mockup-tab-pill ${activeChannel === 'guard' ? 'active' : ''}`}
              onClick={() => setActiveChannel('guard')}
            >
              <span className="mockup-hash">#</span>
              <span>guvenlik-guard</span>
            </button>
            <button
              type="button"
              className={`mockup-tab-pill ${activeChannel === 'kayit' ? 'active' : ''}`}
              onClick={() => setActiveChannel('kayit')}
            >
              <span className="mockup-hash">#</span>
              <span>otomatik-kayit</span>
            </button>
          </div>

          <div className="mockup-status-live">
            <span className="mockup-live-dot" />
            <span className="mockup-ping-text">{ping}ms</span>
            <span className="mockup-tag">İNTERAKTİF</span>
          </div>
        </div>

        {/* Inline Interactive Toast Notification */}
        {activeNotification && (
          <div className="mockup-inline-alert" role="status">
            <span className="alert-icon">⚡</span>
            <span>{activeNotification}</span>
          </div>
        )}

        {/* Mockup Chat Stream */}
        <div className="mockup-body">
          {/* TAB 1: DESTEK TALEPLERİ */}
          {activeChannel === 'destek' && (
            <>
              {/* Message 1 */}
              <div className="mockup-entry">
                <div className="mockup-user-cmd">
                  <span>Komut:</span>
                  <span className="cmd-badge">/ticket oluştur</span>
                </div>

                <div className="mockup-message">
                  <div className="mockup-avatar" aria-hidden="true">
                    <img src="/wihyfe-icon.png" alt="Wihyfe" className="mockup-avatar-img" width={24} height={24} />
                  </div>
                  <div className="mockup-msg-content">
                    <div className="mockup-author-row">
                      <span className="bot-author-name">Wihyfe</span>
                      <span className="discord-badge">BOT</span>
                      <span className="msg-timestamp">Bugün 14:20</span>
                    </div>

                    <div className={`mockup-embed ${isTicketClosed ? 'embed-muted' : ''}`}>
                      <div className="embed-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0878FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 14 14" />
                        </svg>
                        <span>{isTicketClosed ? 'Destek Talebi #0482 Kapatıldı (Arşivlendi)' : 'Destek Talebi #0482 Açıldı'}</span>
                      </div>
                      <p className="embed-desc">
                        {isTicketClosed
                          ? 'Bu destek talebi yetkili tarafından sonlandırıldı. Konuşma dökümü transcript sunucusuna iletildi.'
                          : 'Destek kanalın hazır. Yetkili ekibimiz talebinizle en kısa sürede ilgilenecektir.'}
                      </p>
                      <div className="embed-buttons-row">
                        <button
                          type="button"
                          className={`discord-button-ui ${isTicketClosed ? 'btn-danger' : ''}`}
                          onClick={() => {
                            const nextState = !isTicketClosed;
                            setIsTicketClosed(nextState);
                            showNotification(
                              nextState
                                ? '✓ Talep #0482 başarıyla kapatıldı ve transcript kaydedildi.'
                                : '✓ Destek talebi yeniden aktif hale getirildi.'
                            );
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          <span>{isTicketClosed ? 'Talebi Tekrar Aç' : 'Talebi Kapat'}</span>
                        </button>

                        <button
                          type="button"
                          className="discord-button-ui"
                          onClick={() => {
                            setLogTaken(true);
                            showNotification('📄 ticket-0482-transcript.html (148 KB) hazırlandı!');
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span>{logTaken ? 'Log İndirildi ✓' : 'Log Al'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message 2 */}
              <div className="mockup-entry">
                <div className="mockup-user-cmd">
                  <span>Komut:</span>
                  <span className="cmd-badge">/moderasyon</span>
                </div>

                <div className="mockup-message">
                  <div className="mockup-avatar" aria-hidden="true">
                    <img src="/wihyfe-icon.png" alt="Wihyfe" className="mockup-avatar-img" width={24} height={24} />
                  </div>
                  <div className="mockup-msg-content">
                    <div className="mockup-author-row">
                      <span className="bot-author-name">Wihyfe</span>
                      <span className="discord-badge">BOT</span>
                      <span className="msg-timestamp">Bugün 14:21</span>
                    </div>

                    <div className="mockup-embed">
                      <div className="embed-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0878FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span>Sunucu Yönetim Paneli</span>
                      </div>
                      <p className="embed-desc">
                        Sunucu yönetimi tek noktada. Aktif koruma filtreleri devrede.
                      </p>
                      <div className="mockup-stats-row">
                        <button
                          type="button"
                          className="mockup-stat-pill clickable"
                          onClick={() => {
                            setSpamGuardActive((prev) => !prev);
                            showNotification(
                              !spamGuardActive
                                ? '🛡️ Spam Koruması: Yüksek Hassasiyet moduna alındı!'
                                : '⚠️ Spam Koruması: Standart moda alındı.'
                            );
                          }}
                          title="Tıkla ve modu değiştir"
                        >
                          Spam Koruması: <strong>{spamGuardActive ? 'Aktif' : 'Standart'}</strong>
                        </button>
                        <div className="mockup-stat-pill">Kayıt Kanalı: <strong>#mod-log</strong></div>
                        <div className="mockup-stat-pill highlight">Gecikme: <strong>{ping}ms</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: GÜVENLİK GUARD */}
          {activeChannel === 'guard' && (
            <div className="mockup-entry">
              <div className="mockup-user-cmd">
                <span>Komut:</span>
                <span className="cmd-badge">/guard durum</span>
              </div>

              <div className="mockup-message">
                <div className="mockup-avatar" aria-hidden="true">
                  <img src="/wihyfe-icon.png" alt="Wihyfe" className="mockup-avatar-img" width={24} height={24} />
                </div>
                <div className="mockup-msg-content">
                  <div className="mockup-author-row">
                    <span className="bot-author-name">Wihyfe Guard</span>
                    <span className="discord-badge">BOT</span>
                    <span className="msg-timestamp">Şimdi</span>
                  </div>

                  <div className="mockup-embed">
                    <div className="embed-title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span>Wihyfe Ultra Güvenlik Kalkanı</span>
                    </div>
                    <p className="embed-desc">
                      Sunucu rol, kanal, webhook ve yetkili izinleri 7/24 anlık senkronizasyonla korunmaktadır.
                    </p>
                    <div className="mockup-stats-row">
                      <div className="mockup-stat-pill">Rol Koruması: <strong style={{ color: '#10B981' }}>Devrede</strong></div>
                      <div className="mockup-stat-pill">Kanal Yedekleme: <strong style={{ color: '#10B981' }}>Alındı</strong></div>
                      <div className="mockup-stat-pill">BlackList Kontrol: <strong>Aktif</strong></div>
                    </div>
                    <div className="embed-buttons-row">
                      <button
                        type="button"
                        className="discord-button-ui"
                        onClick={() => showNotification('✓ Sunucunun tam anlık yedeği buluta kaydedildi (Snapshot #829)')}
                      >
                        <span>Anlık Backup Al</span>
                      </button>
                      <button
                        type="button"
                        className="discord-button-ui"
                        onClick={() => showNotification('🛡️ İzin sıfırlama protokolü hazır.')}
                      >
                        <span>Yetki Sıfırla</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OTOMATİK KAYIT */}
          {activeChannel === 'kayit' && (
            <div className="mockup-entry">
              <div className="mockup-user-cmd">
                <span>Komut:</span>
                <span className="cmd-badge">/kayit @Kullanıcı [İsim] [Yaş]</span>
              </div>

              <div className="mockup-message">
                <div className="mockup-avatar" aria-hidden="true">
                  <img src="/wihyfe-icon.png" alt="Wihyfe" className="mockup-avatar-img" width={24} height={24} />
                </div>
                <div className="mockup-msg-content">
                  <div className="mockup-author-row">
                    <span className="bot-author-name">Wihyfe Kayıt</span>
                    <span className="discord-badge">BOT</span>
                    <span className="msg-timestamp">Şimdi</span>
                  </div>

                  <div className="mockup-embed">
                    <div className="embed-title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0878FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <polyline points="16 11 18 13 22 9" />
                      </svg>
                      <span>Kayıt İşlemi Başarılı</span>
                    </div>
                    <p className="embed-desc">
                      Kullanıcıya <strong>@Üye</strong> rolü tanımlandı, kayıtsız rolü alındı. Yetkili puanı güncellendi (+1).
                    </p>
                    <div className="mockup-stats-row">
                      <div className="mockup-stat-pill">Kayıt Eden: <strong>Yetkili Ekibi</strong></div>
                      <div className="mockup-stat-pill">Oto-İsim: <strong>Aktif</strong></div>
                      <div className="mockup-stat-pill">Veritabanı: <strong>Senkron</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Animated Discord Typing Indicator */}
          <div className="mockup-typing-indicator" aria-hidden="true">
            <div className="typing-dots">
              <span />
              <span />
              <span />
            </div>
            <span className="typing-text">
              <strong>Wihyfe</strong> etkileşime hazır, komut bekleniyor...
            </span>
          </div>
        </div>

        {/* Mockup Bottom Quick Command Bar */}
        <div className="mockup-quick-actions">
          <span className="quick-action-label">Örnek Komutlar:</span>
          <button
            type="button"
            className="quick-chip"
            onClick={() => {
              setActiveChannel('destek');
              showNotification('Kanal değiştirildi: #destek-talepleri (/ticket oluştur)');
            }}
          >
            /ticket oluştur
          </button>
          <button
            type="button"
            className="quick-chip"
            onClick={() => {
              setActiveChannel('guard');
              showNotification('Kanal değiştirildi: #guvenlik-guard (/guard durum)');
            }}
          >
            /guard durum
          </button>
          <button
            type="button"
            className="quick-chip"
            onClick={() => {
              setActiveChannel('kayit');
              showNotification('Kanal değiştirildi: #otomatik-kayit (/kayit)');
            }}
          >
            /kayit
          </button>
        </div>
      </div>
    </div>
  );
}
