import type { Metadata } from 'next';
import LegalPageLayout, { TocItem, SummaryCard } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Çerez (Cookie) Politikası | Wihyfe',
  description: 'Wihyfe web sitesinde kullanılan çerez türleri, oturum güvenliği çerezleri, PayTR ödeme güvenliği ve tarayıcı çerez yönetimi rehberi.',
};

const TOC: TocItem[] = [
  { id: 'sec-1', number: '01', title: 'Çerez (Cookie) Nedir?' },
  { id: 'sec-2', number: '02', title: 'Kullanılan Çerez Kategorileri' },
  { id: 'sec-3', number: '03', title: 'Detaylı Çerez Envanteri Tablosu' },
  { id: 'sec-4', number: '04', title: 'Üçüncü Taraf Çerezleri & Entegrasyonlar' },
  { id: 'sec-5', number: '05', title: 'Çerezlerin Hukuki Sebepleri & Amaçları' },
  { id: 'sec-6', number: '06', title: 'Tarayıcıda Çerez Yönetimi & Silme Rehberi' },
  { id: 'sec-7', number: '07', title: 'Çerezleri Kapatmanın Sisteme Etkisi' },
  { id: 'sec-8', number: '08', title: 'Politika Güncellemeleri & İletişim' },
];

const SUMMARY_CARDS: SummaryCard[] = [
  {
    icon: '🍪',
    title: 'Sadece Zorunlu & İşlevsel',
    desc: 'Wihyfe, izinsiz üçüncü taraf reklam takip çerezleri yerine yalnızca sistem güvenliği ve sepet işlemleri için zorunlu çerezleri kullanır.',
  },
  {
    icon: '🛡️',
    title: 'HTTP-Only Güvenli Oturum',
    desc: 'Discord oturum çerezleriniz (wihyfe_session) XSS saldırılarına karşı HTTP-Only ve SameSite=Lax bayraklarıyla korunur.',
  },
  {
    icon: '⚙️',
    title: 'Tam Kullanıcı Denetimi',
    desc: 'Tarayıcı ayarlarınız üzerinden dilediğiniz zaman çerezleri silebilir, engelleyebilir veya kullanım tercihlerini değiştirebilirsiniz.',
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      activeTab="cookies"
      badge="Çerez &amp; Tarayıcı Şeffaflığı"
      title="Çerez (Cookie) Politikası"
      description="Wihyfe platformunun sorunsuz çalışması, Discord ile güvenli oturum açabilmeniz ve sepet/lisans siparişlerinizi yönetebilmeniz için çerezlerden nasıl yararlandığımızı açıklıyoruz."
      lastUpdated="17 Ekim 2026"
      version="v2.8 (Güncel)"
      readingTime="~4 dk"
      summaryCards={SUMMARY_CARDS}
      tableOfContents={TOC}
    >
      {/* Section 1 */}
      <section id="sec-1" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">01</span>
          <span>Çerez (Cookie) Nedir ve Nasıl Çalışır?</span>
        </h2>
        <p className="legal-body-text">
          Çerezler (Cookies), bir web sitesini ziyaret ettiğinizde tarayıcınız (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge vb.) aracılığıyla bilgisayarınıza, tabletinize veya akıllı telefonunuza kaydedilen küçük metin ve veri dosyalarıdır.
        </p>
        <p className="legal-body-text">
          Çerezler, web sitelerinin sizi tanımasını, oturumunuzun açık kalmasını, sepetinize eklediğiniz paketlerin hatırlanmasını ve güvenli bir gezinme deneyimi yaşamanızı sağlamak amacıyla modern internetin temel yapı taşları arasında yer alır.
        </p>
        <p className="legal-body-text">
          <strong>Wihyfe</strong> olarak kullanıcı gizliliğine azami saygı duyuyoruz. Platformumuzda kullanıcıların rızası dışında veri toplayan casus yazılımlar veya istismara açık harici reklam/hedefleme çerezleri <strong>asla kullanılmaz</strong>.
        </p>
      </section>

      {/* Section 2 */}
      <section id="sec-2" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">02</span>
          <span>Wihyfe Platformunda Kullanılan Çerez Kategorileri</span>
        </h2>
        <p className="legal-body-text">
          Sitemizde kullanılan çerezler işlevlerine ve kullanım amaçlarına göre üç ana kategoriye ayrılmaktadır:
        </p>
        <ul className="legal-styled-list">
          <li>
            <strong>1. Kesinlikle Zorunlu Çerezler:</strong> Web sitesinin temel fonksiyonlarını yerine getirebilmesi, Discord OAuth2 ile oturum açılabilmesi, güvenliğin sağlanması ve sayfalar arası gezinme için vazgeçilmez olan teknik çerezlerdir.
          </li>
          <li>
            <strong>2. İşlevsel ve Tercih Çerezleri:</strong> Seçtiğiniz dil tercihini (TR / EN), sepetinizde bulunan bot paketlerini ve sayfa tercihlerini hatırlayarak kullanım deneyiminizi kişiselleştiren çerezlerdir.
          </li>
          <li>
            <strong>3. Güvenlik ve Performans Çerezleri:</strong> Sitemize yönelik kötü amaçlı bot saldırılarını, spam girişimlerini ve DDoS tehditlerini engellemek için Cloudflare ve sunucu katmanımız tarafından kullanılan güvenlik çerezleridir.
          </li>
        </ul>
      </section>

      {/* Section 3 */}
      <section id="sec-3" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">03</span>
          <span>Detaylı Çerez Envanteri Tablosu</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe web sitesinde ve yönetim panellerinde kullanılan başlıca çerezlerin adı, amacı ve saklama süresi aşağıda şeffaf şekilde listelenmiştir:
        </p>

        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Çerez Adı</th>
                <th>Kategori</th>
                <th>Kullanım Amacı</th>
                <th>Saklama Süresi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>wihyfe_session</code></td>
                <td>Zorunlu / Güvenlik</td>
                <td>Discord OAuth2 ile giriş yaptığınızda oturumunuzun ve yetkilerinizin güvenliğini sağlar (HTTP-Only, Secure).</td>
                <td>7 Gün</td>
              </tr>
              <tr>
                <td><code>wihyfe_admin_token</code></td>
                <td>Zorunlu / Güvenlik</td>
                <td>Yetkili panelinde (`/admin`) yöneticilerin güvenli kimlik doğrulamasını sağlar (HTTP-Only, SameSite=Strict).</td>
                <td>3 Gün</td>
              </tr>
              <tr>
                <td><code>wihyfe_cart</code> / LocalStorage</td>
                <td>İşlevsel / Sepet</td>
                <td>Sepetinize eklediğiniz bot paketlerini ve seçilen fatura periyodunu sayfa yenilendiğinde korur.</td>
                <td>Kullanıcı Temizleyene Kadar</td>
              </tr>
              <tr>
                <td><code>wihyfe_cookie_consent</code></td>
                <td>İşlevsel / Tercih</td>
                <td>Çerez bilgilendirme onay durumunuzu ve tercihlerinizi hatırlar.</td>
                <td>1 Yıl</td>
              </tr>
              <tr>
                <td><code>wihyfe_lang</code></td>
                <td>İşlevsel / Tercih</td>
                <td>Sitede seçtiğiniz dil tercihini (Türkçe / İngilizce) hatırlar.</td>
                <td>6 Ay</td>
              </tr>
              <tr>
                <td><code>__cf_bm</code>, <code>cf_clearance</code></td>
                <td>Güvenlik (Cloudflare)</td>
                <td>Sitemize yönelik DDoS, bot saldırısı ve otomatik spam girişimlerini filtreler.</td>
                <td>30 Dakika - 1 Yıl</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4 */}
      <section id="sec-4" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">04</span>
          <span>Üçüncü Taraf Çerezleri ve Entegrasyonlar</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe, altyapı güvenliği ve ödeme tahsilatı için sektör standardı üçüncü taraf sağlayıcılarla entegre çalışır:
        </p>
        <ul className="legal-styled-list">
          <li>
            <strong>Discord Inc.:</strong> Discord hesabınızla güvenli oturum açılması (OAuth2) esnasında Discord kendi çerezlerini kullanabilir. Detaylar için Discord Gizlilik Politikası geçerlidir.
          </li>
          <li>
            <strong>PayTR Ödeme Kuruluşu A.Ş.:</strong> Checkout ekranında 3D Secure doğrulaması ve dolandırıcılık önleme amacıyla PayTR güvenli ödeme penceresinde kendi oturum çerezlerini işleyebilir.
          </li>
          <li>
            <strong>Cloudflare Inc.:</strong> Web sitesi trafiğini zararlı isteklerden korumak ve güvenli TLS bağlantısını yönetmek için güvenlik çerezleri yerleştirebilir.
          </li>
        </ul>
      </section>

      {/* Section 5 */}
      <section id="sec-5" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">05</span>
          <span>Çerezlerin Toplanma Hukuki Sebepleri ve Amaçları</span>
        </h2>
        <p className="legal-body-text">
          Zorunlu çerezler, 6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun 5. maddesinin 2. fıkrasının (c) bendi uyarınca &ldquo;Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması&rdquo; ve (f) bendi uyarınca &ldquo;Meşru menfaatlerimiz için veri işlenmesinin zorunlu olması&rdquo; hukuki gerekçelerine dayalı olarak otomatik yollarla işlenmektedir.
        </p>
        <p className="legal-body-text">
          İşlevsel çerezler ise sitemizi daha verimli, hızlı ve kişiselleştirilmiş şekilde kullanabilmeniz amacıyla işlenir.
        </p>
      </section>

      {/* Section 6 */}
      <section id="sec-6" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">06</span>
          <span>Tarayıcınızda Çerez Yönetimi ve Silme Rehberi</span>
        </h2>
        <p className="legal-body-text">
          Tarayıcınızın ayarlarını değiştirerek çerezleri dilediğiniz zaman silebilir, mevcut çerezleri görüntüleyebilir veya yeni çerez kaydedilmesini engelleyebilirsiniz:
        </p>
        <ul className="legal-styled-list">
          <li>
            <strong>Google Chrome:</strong> Ayarlar &gt; Gizlilik ve Güvenlik &gt; Üçüncü taraf çerezleri &gt; &ldquo;Tüm çerezleri engelle&rdquo; veya &ldquo;Site verilerini temizle&rdquo;.
          </li>
          <li>
            <strong>Mozilla Firefox:</strong> Seçenekler &gt; Gizlilik ve Güvenlik &gt; Çerezler ve Site Verileri &gt; &ldquo;Verileri Temizle&rdquo;.
          </li>
          <li>
            <strong>Apple Safari:</strong> Tercihler &gt; Gizlilik &gt; &ldquo;Tüm çerezleri engelle&rdquo; veya &ldquo;Web Sitesi Verilerini Yönet&rdquo;.
          </li>
          <li>
            <strong>Microsoft Edge:</strong> Ayarlar &gt; Çerezler ve site izinleri &gt; &ldquo;Çerezleri ve site verilerini yönet ve sil&rdquo;.
          </li>
        </ul>
      </section>

      {/* Section 7 */}
      <section id="sec-7" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">07</span>
          <span>Çerezleri Kapatmanın Sistem Fonksiyonlarına Etkisi</span>
        </h2>
        <div className="legal-callout-box callout-warning">
          <div className="callout-icon">⚠️</div>
          <div className="callout-content">
            <div className="callout-title">Zorunlu Çerezlerin Devre Dışı Bırakılması</div>
            <p className="callout-desc">
              Tarayıcınız üzerinden zorunlu teknik çerezleri (örneğin <code>wihyfe_session</code>) tamamen engellemeniz durumunda; sitemizde Discord ile oturum açamayabilir, müşteri panelinizdeki bot ayarlarını kaydedemeyebilir veya sepet üzerinden lisans satın alma işlemlerini tamamlayamayabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Section 8 */}
      <section id="sec-8" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">08</span>
          <span>Politika Güncellemeleri ve İletişim</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe, teknolojik gelişmeler, mevzuat değişiklikleri veya yeni hizmet modülleri doğrultusunda bu Çerez Politikası metnini dilediği zaman güncelleme hakkını saklı tutar.
        </p>
        <p className="legal-body-text">
          Çerez uygulamalarımız hakkında sorularınız, görüşleriniz veya veri talepleriniz için resmi Discord Destek Masamız üzerinden 7/24 bizimle iletişime geçebilirsiniz.
        </p>
      </section>
    </LegalPageLayout>
  );
}
