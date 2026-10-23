'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface FaqItemData {
  id: string;
  num: string;
  category: string;
  questionTR: string;
  questionEN: string;
  answerTR: string;
  answerEN: string;
  badgeTR: string;
  badgeEN: string;
  badgeColor: string;
  icon: React.ReactNode;
}

export default function FaqAccordion() {
  const { t, language } = useLanguage();
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBotAdvice, setSelectedBotAdvice] = useState<number>(0);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'yes' | 'no'>>({});

  const isTR = language !== 'EN';

  const faqItems: FaqItemData[] = useMemo(
    () => [
      {
        id: 'faq-1',
        num: '01',
        category: 'custom',
        questionTR: 'Sunucuma özel bot yaptırabilir miyim?',
        questionEN: 'Can I get a custom bot made for my server?',
        answerTR:
          'Evet! İstediğiniz tüm komutları, veritabanı kurgularını ve işleyişi bize ileterek tamamen sıfırdan sunucunuza özel bot projesi talep edebilirsiniz. Uzman yazılımcı kadromuz mimarinizi çıkarır ve anında yayına hazırlar.',
        answerEN:
          'Yes! You can share your custom commands, database architecture, and requirements to request a fully custom-engineered Discord bot. Our core development team handles everything from design to 24/7 deployment.',
        badgeTR: 'Özel Geliştirme',
        badgeEN: 'Custom Development',
        badgeColor: '#38BDF8',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        ),
      },
      {
        id: 'faq-2',
        num: '02',
        category: 'packages',
        questionTR: 'Hangi botu seçmeliyim?',
        questionEN: 'Which bot package should I choose?',
        answerTR:
          'Sunucunuzun büyüklüğüne ve önceliklerine göre seçim yapabilirsiniz. Temel koruma ve moderasyon için "Discord Pack", tam kapsamlı guard, yedekleme ve log denetimi için ise en çok tercih edilen "Discord Full Pack" paketimizi öneriyoruz.',
        answerEN:
          'Choose based on your community size and priorities. For standard moderation and security, "Discord Pack" is ideal; for complete guard, automated backups, and audit logs, we recommend our most popular "Discord Full Pack".',
        badgeTR: 'Paket Tavsiyesi',
        badgeEN: 'Package Advice',
        badgeColor: '#0878FF',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        ),
      },
      {
        id: 'faq-3',
        num: '03',
        category: 'pricing',
        questionTR: 'Fiyatı nasıl öğrenebilirim?',
        questionEN: 'How can I learn about pricing & payment?',
        answerTR:
          'Web sitemizdeki tüm fiyatlar şeffaf ve sabittir. Paketler bölümünden dilediğiniz periyodu (Aylık, 3 Aylık, Yıllık %35 indirimli) seçebilir, PayTR 3D Secure kredi kartı veya hesap bakiyesi ile anında güvenle sipariş oluşturabilirsiniz.',
        answerEN:
          'All our rates are completely transparent and fixed. Pick your preferred billing term (Monthly, Quarterly, or Annual with up to 35% savings) and checkout securely with PayTR 3D Secure or your wallet balance.',
        badgeTR: 'Şeffaf Fiyat',
        badgeEN: 'Transparent Pricing',
        badgeColor: '#10B981',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        ),
      },
      {
        id: 'faq-4',
        num: '04',
        category: 'setup',
        questionTR: 'Kurulum süreci nasıl ilerliyor?',
        questionEN: 'How does the setup and deployment process work?',
        answerTR:
          'Siparişiniz onaylandığı anda botunuz bulut altyapımızda oluşturulur. Tek tıkla Discord sunucunuza davet edip yönetici yetkisi vermeniz yeterlidir. Hazır şablonlar ile tüm roller, kanallar ve güvenlik kalkanı 5 dakikadan kısa sürede aktif olur.',
        answerEN:
          'As soon as your order is confirmed, your bot container spins up in our cloud matrix. Simply invite it to your Discord guild with admin permissions. Pre-configured templates deploy all roles and security rules in under 5 minutes.',
        badgeTR: 'Otomatik & Hızlı',
        badgeEN: 'Fast & Automated',
        badgeColor: '#818CF8',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        ),
      },
    ],
    []
  );

  const categories = [
    { id: 'all', labelTR: 'Tümü', labelEN: 'All Questions', count: faqItems.length },
    { id: 'custom', labelTR: 'Özel Geliştirme', labelEN: 'Custom Bot', count: 1 },
    { id: 'packages', labelTR: 'Paket Tavsiyesi', labelEN: 'Packages', count: 1 },
    { id: 'pricing', labelTR: 'Şeffaf Fiyat', labelEN: 'Pricing', count: 1 },
    { id: 'setup', labelTR: 'Kurulum & Hız', labelEN: 'Setup', count: 1 },
  ];

  const filteredItems = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const q = isTR ? item.questionTR.toLowerCase() : item.questionEN.toLowerCase();
      const a = isTR ? item.answerTR.toLowerCase() : item.answerEN.toLowerCase();
      const b = isTR ? item.badgeTR.toLowerCase() : item.badgeEN.toLowerCase();

      return matchesCategory && (q.includes(query) || a.includes(query) || b.includes(query));
    });
  }, [faqItems, selectedCategory, searchQuery, isTR]);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleFeedback = (id: string, value: 'yes' | 'no') => {
    setFeedbackGiven((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <section className="section faq-modern-section" id="sss">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="section-tag">{t.faq.badge}</div>
          <h2 className="section-title">
            {t.faq.title} <span className="text-accent">{t.faq.titleAccent}</span>
          </h2>
          <p className="section-desc">
            {t.faq.desc}
          </p>
        </div>

        {/* Enhanced Controls Bar: Category Filter Tabs & Quick Search */}
        <div className="faq-controls-bar">
          {/* Horizontal Category Switcher Tabs */}
          <div className="faq-category-tabs" role="tablist" aria-label="Soru Kategorileri">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`faq-cat-tab-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (cat.id !== 'all') {
                      const match = faqItems.find((i) => i.category === cat.id);
                      if (match) setOpenId(match.id);
                    }
                  }}
                >
                  <span className="cat-tab-text">{isTR ? cat.labelTR : cat.labelEN}</span>
                  <span className="cat-tab-count">{cat.count}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Realtime Filter Search Bar */}
          <div className="faq-quick-search-box">
            <svg
              className="faq-search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isTR ? 'Sorularda hızlı ara...' : 'Search questions...'}
              className="faq-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="faq-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Aramayı Temizle"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ====================================================================
            THE UPGRADED ACCORDION TABS LIST
            ==================================================================== */}
        <div className="faq-wrapper" role="region" aria-label="Sık Sorulan Sorular Akordeonu">
          {filteredItems.length === 0 ? (
            <div className="faq-empty-state">
              <div className="empty-icon">🔍</div>
              <h4>{isTR ? 'Eşleşen soru bulunamadı' : 'No matching questions found'}</h4>
              <p>{isTR ? 'Arama teriminizi değiştirerek tekrar deneyebilirsiniz.' : 'Try adjusting your search terms.'}</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                {isTR ? 'Tüm Soruları Göster' : 'Show All Questions'}
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isOpen = openId === item.id;
              const question = isTR ? item.questionTR : item.questionEN;
              const answer = isTR ? item.answerTR : item.answerEN;
              const badge = isTR ? item.badgeTR : item.badgeEN;

              return (
                <div
                  key={item.id}
                  className={`faq-item faq-modern-item ${isOpen ? 'is-open' : ''}`}
                  style={{ '--ch-accent': item.badgeColor } as React.CSSProperties}
                >
                  {/* Active Illuminated Left Bar */}
                  <div className="faq-active-bar" aria-hidden="true" />

                  {/* Header Trigger Button */}
                  <button
                    className="faq-trigger"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                    id={`faq-question-${item.id}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="faq-trigger-left">
                      {/* Step Number in Monospace */}
                      <span className="faq-item-num">{item.num}</span>

                      {/* 3D Glass Icon Container with Dual Glow */}
                      <div className="faq-item-icon-box" aria-hidden="true">
                        <span className="icon-glow-ring" />
                        {item.icon}
                      </div>

                      {/* Question Text */}
                      <span className="faq-question-text">{question}</span>

                      {/* Upgraded Cyber Badge Capsule with Glowing Pulsing Dot */}
                      <span className="faq-item-pill-badge" style={{ borderColor: `${item.badgeColor}40`, color: item.badgeColor }}>
                        <span className="badge-pulse-dot" style={{ backgroundColor: item.badgeColor, boxShadow: `0 0 8px ${item.badgeColor}` }} />
                        <span>{badge}</span>
                      </span>
                    </div>

                    {/* Right Toggle Action Button with Morphing Icon */}
                    <div className="faq-trigger-right">
                      <span className="faq-action-hint">
                        {isOpen ? (isTR ? 'Kapat' : 'Close') : (isTR ? 'Cevabı Gör' : 'View Answer')}
                      </span>
                      <div className="faq-chevron-circle">
                        <svg
                          className="faq-icon-arrow"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Collapsible Answer Drawer */}
                  <div
                    className="faq-content"
                    id={`faq-answer-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${item.id}`}
                  >
                    <div className="faq-answer-inner">
                      {/* Typographic Answer Statement */}
                      <div className="faq-text-card">
                        <div className="faq-text-quote-bar" />
                        <p className="faq-text">{answer}</p>
                      </div>

                      {/* Interactive Visual Demonstration Card */}
                      {item.id === 'faq-1' && (
                        <div className="faq-visual-card faq-terminal-preview">
                          <div className="faq-terminal-top">
                            <div className="faq-terminal-dots">
                              <span className="dot dot-red" />
                              <span className="dot dot-yellow" />
                              <span className="dot dot-green" />
                            </div>
                            <span className="faq-terminal-title">wihyfe-custom-bot.config.ts</span>
                            <span className="faq-terminal-badge">7/24 Kesintisiz</span>
                          </div>
                          <div className="faq-terminal-body">
                            <div className="faq-code-line">
                              <span className="code-kw">import</span> {'{ WihyfeCustomEngine }'} <span className="code-kw">from</span> <span className="code-str">&apos;@wihyfe/core&apos;</span>;
                            </div>
                            <div className="faq-code-line">
                              <span className="code-comment">// İstediğin tüm modülleri sıfırdan inşa ediyoruz</span>
                            </div>
                            <div className="faq-code-line">
                              <span className="code-kw">const</span> bot = <span className="code-fn">createCustomBot</span>({'{'}
                            </div>
                            <div className="faq-code-line indent">
                              server: <span className="code-str">&apos;Senin Sunucun&apos;</span>,
                            </div>
                            <div className="faq-code-line indent">
                              features: [<span className="code-str">&apos;Guard&apos;</span>, <span className="code-str">&apos;Ticket&apos;</span>, <span className="code-str">&apos;Ekip-Sistemi&apos;</span>, <span className="code-str">&apos;Özel API&apos;</span>],
                            </div>
                            <div className="faq-code-line indent">
                              highPerformance: <span className="code-bool">true</span>, ping: <span className="code-str">&apos;12ms&apos;</span>
                            </div>
                            <div className="faq-code-line">{'}'});</div>
                            <div className="faq-terminal-status">
                              <span className="status-indicator-dot" />
                              <span>✓ Özel bot projeniz anında yayına hazırlanır</span>
                            </div>
                          </div>
                          <div className="faq-visual-footer">
                            <a
                              href="https://discord.gg/SbrKk6Q87H"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="faq-cta-btn"
                            >
                              <span>{isTR ? 'Özel Teklif İste' : 'Request Custom Quote'}</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      )}

                      {item.id === 'faq-2' && (
                        <div className="faq-visual-card faq-choice-preview">
                          <div className="faq-choice-grid">
                            {[
                              {
                                title: 'Discord Full Pack',
                                badge: 'En Popüler',
                                bestFor: 'Büyük & Büyüyen Sunucular',
                                desc: 'Moderasyon, Guard, Backup ve BlackList hepsi bir arada.',
                                price: '1.300 TL / ay',
                              },
                              {
                                title: 'Discord Pack',
                                badge: 'Standart',
                                bestFor: 'Topluluk Sunucuları',
                                desc: 'Temel gelişmiş moderasyon, guard ve yedekleme koruması.',
                                price: '850 TL / ay',
                              },
                              {
                                title: 'Özel Çözüm',
                                badge: 'Esnek',
                                bestFor: 'FiveM & Özel Projeler',
                                desc: 'Mesai, başvuru, hızlı giriş ve özel sunucu entegrasyonu.',
                                price: 'Özel Fiyat',
                              },
                            ].map((box, idx) => (
                              <div
                                key={box.title}
                                className={`faq-choice-item ${selectedBotAdvice === idx ? 'selected' : ''}`}
                                onClick={() => setSelectedBotAdvice(idx)}
                              >
                                <div className="faq-choice-top">
                                  <span className="faq-choice-badge">{box.badge}</span>
                                  <span className="faq-choice-price">{box.price}</span>
                                </div>
                                <div className="faq-choice-title">{box.title}</div>
                                <div className="faq-choice-best">{box.bestFor}</div>
                                <div className="faq-choice-desc">{box.desc}</div>
                              </div>
                            ))}
                          </div>
                          <div className="faq-visual-footer">
                            <a href="#paketler" className="faq-cta-btn">
                              <span>{isTR ? 'Tüm Paketleri İncele' : 'View All Packages'}</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      )}

                      {item.id === 'faq-3' && (
                        <div className="faq-visual-card faq-pricing-features">
                          <div className="faq-pills-matrix">
                            <div className="faq-feature-pill">
                              <span className="pill-icon-dot cyan" />
                              <div>
                                <strong>PayTR &amp; Kredi Kartı:</strong>
                                <span>3D Güvenli ödeme ve taksit imkanı</span>
                              </div>
                            </div>
                            <div className="faq-feature-pill">
                              <span className="pill-icon-dot blue" />
                              <div>
                                <strong>Cüzdan &amp; Bakiye:</strong>
                                <span>Hesabınıza bakiye yükleyip 1 tıkla anında alışveriş</span>
                              </div>
                            </div>
                            <div className="faq-feature-pill">
                              <span className="pill-icon-dot green" />
                              <div>
                                <strong>Gizli Ücret Yok:</strong>
                                <span>Belirtilen fiyat dışında sürpriz ek masraf çıkarılmaz</span>
                              </div>
                            </div>
                            <div className="faq-feature-pill">
                              <span className="pill-icon-dot purple" />
                              <div>
                                <strong>İndirimli Periyotlar:</strong>
                                <span>3, 6 ve 12 aylık alımlarda %35’e varan indirimler</span>
                              </div>
                            </div>
                          </div>
                          <div className="faq-visual-footer">
                            <a href="#paketler" className="faq-cta-btn">
                              <span>{isTR ? 'Fiyatlandırmaya Git' : 'Go to Pricing'}</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      )}

                      {item.id === 'faq-4' && (
                        <div className="faq-visual-card faq-steps-preview">
                          <div className="faq-steps-track">
                            <div className="faq-step-node active">
                              <div className="step-circle">1</div>
                              <div className="step-info">
                                <span className="step-label">Sipariş Ver</span>
                                <span className="step-sub">Paketini seç &amp; anında tamamla</span>
                              </div>
                            </div>
                            <div className="step-connector" />
                            <div className="faq-step-node active">
                              <div className="step-circle">2</div>
                              <div className="step-info">
                                <span className="step-label">Sunucuya Ekle</span>
                                <span className="step-sub">Tek tıkla botu yetkilendir</span>
                              </div>
                            </div>
                            <div className="step-connector" />
                            <div className="faq-step-node active pulse">
                              <div className="step-circle">3</div>
                              <div className="step-info">
                                <span className="step-label">7/24 Aktif</span>
                                <span className="step-sub">Yönetim panelinden dilediğince yönet</span>
                              </div>
                            </div>
                          </div>
                          <div className="faq-uptime-badge">
                            <span className="status-live-dot" />
                            <span>Ortalama aktivasyon süresi: &lt; 5 Dakika</span>
                          </div>
                        </div>
                      )}

                      {/* Helpful Feedback & Direct Contact Bar */}
                      <div className="faq-item-feedback-bar">
                        <div className="feedback-prompt">
                          <span>{isTR ? 'Bu yanıt faydalı oldu mu?' : 'Was this answer helpful?'}</span>
                          <button
                            type="button"
                            className={`feedback-btn ${feedbackGiven[item.id] === 'yes' ? 'is-selected' : ''}`}
                            onClick={() => handleFeedback(item.id, 'yes')}
                          >
                            👍 {feedbackGiven[item.id] === 'yes' ? (isTR ? 'Teşekkürler' : 'Thanks') : (isTR ? 'Evet' : 'Yes')}
                          </button>
                          <button
                            type="button"
                            className={`feedback-btn ${feedbackGiven[item.id] === 'no' ? 'is-selected' : ''}`}
                            onClick={() => handleFeedback(item.id, 'no')}
                          >
                            👎 {isTR ? 'Hayır' : 'No'}
                          </button>
                        </div>

                        <a
                          href="https://discord.gg/SbrKk6Q87H"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="faq-ask-discord-link"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                          </svg>
                          <span>{isTR ? 'Sorun çözülmedi mi? Discord\'dan Yazın' : 'Need more help? Ask on Discord'}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
