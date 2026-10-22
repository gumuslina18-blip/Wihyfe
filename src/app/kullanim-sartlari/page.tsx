import type { Metadata } from 'next';
import LegalPageLayout, { TocItem, SummaryCard } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Kullanım Şartları & Hizmet Sözleşmesi | Wihyfe',
  description: 'Wihyfe Discord bot ve altyapı hizmetleri kullanım şartları, yazılım lisanslama koşulları, PayTR ödeme güvencesi ve cayma hakkı rehberi.',
};

const TOC: TocItem[] = [
  { id: 'sec-1', number: '01', title: 'Taraflar ve Genel Hükümler' },
  { id: 'sec-2', number: '02', title: 'Hizmet Tanımı & Lisans Kapsamı' },
  { id: 'sec-3', number: '03', title: 'Müşteri Sorumlulukları & Discord Uyumu' },
  { id: 'sec-4', number: '04', title: 'Kabul Edilebilir Kullanım (AUP)' },
  { id: 'sec-5', number: '05', title: 'Ödeme, Fatura & PayTR Güvenliği' },
  { id: 'sec-6', number: '06', title: 'Cayma Hakkı & İade Koşulları' },
  { id: 'sec-7', number: '07', title: 'Hizmet Seviyesi (SLA) & Kesintiler' },
  { id: 'sec-8', number: '08', title: 'Fikri Mülkiyet & Telif Hakları' },
  { id: 'sec-9', number: '09', title: 'Sözleşme Değişiklikleri & Fesih' },
  { id: 'sec-10', number: '10', title: 'Uyuşmazlıkların Çözümü & Yetki' },
];

const SUMMARY_CARDS: SummaryCard[] = [
  {
    icon: '⚡',
    title: 'Anında Bulut Aktivasyonu',
    desc: 'Satın alınan tüm Wihyfe bot lisansları, hedef Discord sunucunuza münhasır olarak dakikalar içinde canlıya alınır.',
  },
  {
    icon: '🛡️',
    title: 'PayTR 256-Bit SSL Güvencesi',
    desc: 'Ödemeleriniz TCMB lisanslı PayTR güvencesiyle tahsil edilir. Kredi kartı verileriniz sunucularımızda asla tutulmaz.',
  },
  {
    icon: '⚖️',
    title: '6502 Sayılı Kanun Uyumu',
    desc: 'Elektronik ortamda anında ifa edilen dijital ürünlerde cayma hakkı ve 48 saatlik teknik telafi garantisi açıkça tanımlanmıştır.',
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      activeTab="terms"
      badge="Yasal Dokümantasyon &amp; Sözleşme"
      title="Kullanım Şartları &amp; Hizmet Sözleşmesi"
      description="Wihyfe altyapısını, web sitesini (wihyfe.com) ve bot lisanslarını kullanarak aşağıdaki hizmet şartlarını ve bağlayıcı kuralları kabul etmiş sayılırsınız. Lütfen dikkatlice inceleyiniz."
      lastUpdated="17 Ekim 2026"
      version="v2.8 (Güncel)"
      readingTime="~6 dk"
      summaryCards={SUMMARY_CARDS}
      tableOfContents={TOC}
    >
      {/* Section 1 */}
      <section id="sec-1" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">01</span>
          <span>Taraflar, Tanımlar ve Genel Hükümler</span>
        </h2>
        <p className="legal-body-text">
          İşbu Kullanım Şartları ve Hizmet Sözleşmesi (&ldquo;Sözleşme&rdquo;); merkezi Türkiye Cumhuriyeti sınırları içerisinde bulunan <strong>Wihyfe Bilişim Hizmetleri</strong> (&ldquo;Wihyfe&rdquo;, &ldquo;Hizmet Sağlayıcı&rdquo; veya &ldquo;Biz&rdquo;) ile web sitemizi (wihyfe.com), müşteri yönetim panelini, yetkili arayüzlerini ve bulut tabanlı Discord bot yazılımlarını kullanan, sipariş veren veya lisans edinen gerçek ya da tüzel kişi (&ldquo;Müşteri&rdquo;, &ldquo;Kullanıcı&rdquo; veya &ldquo;Siz&rdquo;) arasında elektronik ortamda onaylandığı tarihte yürürlüğe girmiştir.
        </p>
        <p className="legal-body-text">
          Sitemize giriş yapmanız, Discord OAuth2 yetkilendirmesiyle oturum açmanız, herhangi bir ürün veya hizmet siparişi vermeniz durumunda; bu belgede yer alan tüm şartları eksiksiz okuduğunuzu, anladığınızı ve gayrikabili rücu kabul ettiğinizi beyan ve taahhüt etmiş sayılırsınız.
        </p>
      </section>

      {/* Section 2 */}
      <section id="sec-2" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">02</span>
          <span>Hizmetin Tanımı, Bulut Altyapısı ve Lisans Kapsamı</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe; Discord toplulukları, kurumsal sunucular, oyun organizasyonları ve dijital ekipler için yüksek performanslı moderasyon, güvenlik (Guard), gelişmiş bilet/destek (Ticket), kayıt/otomasyon sistemleri ve özel web panelleri sağlayan bağımsız bir bulut yazılım platformudur.
        </p>
        <ul className="legal-styled-list">
          <li>
            <strong>Sunucuya Özgü Münhasır Lisans:</strong> Müşteri tarafından satın alma sırasında beyan edilen Discord Sunucu Kimliğine (Guild Snowflake ID) özel lisans tahsis edilir. Lisans, aksi Wihyfe tarafından onaylanmadıkça başka sunuculara devredilemez.
          </li>
          <li>
            <strong>7/24 Bulut Barındırma (Host Edilen Hizmet):</strong> Tüm Wihyfe botları ve veri tabanları Wihyfe&apos;nin yüksek hızlı Tier-3 bulut sunucu altyapısında barındırılır. Müşterinin kendi sunucusunda veya bilgisayarında barındırma yapmasına gerek yoktur.
          </li>
          <li>
            <strong>Müşteri Kontrol Paneli:</strong> Aktif lisansa sahip kullanıcılar, web sitemiz üzerindeki canlı panelden bot prefix&apos;i, yetkili rolleri, log kanalları ve güvenlik modüllerini diledikleri zaman yönetebilirler.
          </li>
          <li>
            <strong>Yazılım Güncellemeleri:</strong> Wihyfe, sistem stabilitesini artırmak ve yeni Discord API standartlarına uyum sağlamak adına bot yazılımlarını düzenli olarak günceller. Güncellemeler aktif lisans süresi boyunca müşteriye ücretsiz olarak yansıtılır.
          </li>
        </ul>
      </section>

      {/* Section 3 */}
      <section id="sec-3" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">03</span>
          <span>Müşteri Hakları, Sorumlulukları ve Discord API Uyumu</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe botlarını kullanan her Müşteri, aşağıdaki temel sorumlulukları kabul ve taahhüt eder:
        </p>
        <ul className="legal-styled-list">
          <li>
            <strong>Discord Resmi Şartlarına Bağlılık:</strong> Müşteri, botu kullandığı sunucuda Discord Resmi Hizmet Şartları&apos;na (Discord Terms of Service) ve Topluluk Kuralları&apos;na (Community Guidelines) harfiyen uymakla yükümlüdür.
          </li>
          <li>
            <strong>Sunucu İçi Yetkilendirme:</strong> Botun işlevlerini eksiksiz yerine getirebilmesi için Discord sunucusunda gerekli kanal okuma, mesaj gönderme, rol yönetme veya yönetici izinlerinin Müşteri tarafından doğru yapılandırılması gerekmektedir.
          </li>
          <li>
            <strong>Hesap ve Giriş Güvenliği:</strong> Müşteri, Discord hesabı ve paneli üzerinden yapılan tüm işlemlerden bizzat sorumludur. Hesabın üçüncü kişilere kullandırılması yasaktır.
          </li>
        </ul>
      </section>

      {/* Section 4 */}
      <section id="sec-4" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">04</span>
          <span>Kabul Edilebilir Kullanım Politikası (AUP) ve Yasaklı Faaliyetler</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe altyapısı ve bot yazılımları kesinlikle yasa dışı veya etik dışı amaçlarla kullanılamaz. Aşağıdaki eylemlerin tespiti halinde derhal işlem yapılır:
        </p>
        <ul className="legal-styled-list">
          <li>Botlar aracılığıyla Discord kullanıcılarına toplu spam, istenmeyen DM, izinsiz davet veya reklam iletisi göndermek,</li>
          <li>Sunucu baskını (raid), token çalma (token grabbing), phishing (oltalama) veya kötü amaçlı yazılım yaymak amacıyla bot özelliklerini istismar etmek,</li>
          <li>T.C. Anayasası ve yürürlükteki kanunlara göre suç teşkil eden nefret söylemi, terör propagandası, yasa dışı bahis, çocuk istismarı veya telif ihlali barındıran sunucularda Wihyfe yazılımlarını kullanmak,</li>
          <li>Wihyfe API&apos;lerine, sunucu altyapısına veya gateway bağlantılarına yönelik DDoS saldırısı, tersine mühendislik veya yetkisiz sızma girişimlerinde bulunmak.</li>
        </ul>

        <div className="legal-callout-box callout-warning">
          <div className="callout-icon">⚠️</div>
          <div className="callout-content">
            <div className="callout-title">İstismar Durumunda Lisans İptali</div>
            <p className="callout-desc">
              Kabul Edilebilir Kullanım Politikası&apos;nın ihlal edildiğinin tespiti durumunda Wihyfe; ilgili sunucu lisansını tek taraflı olarak derhal feshetme, botu sunucudan tahliye etme, Müşteri hesabını askıya alma ve hiçbir ücret iadesi yapmama hakkına sahiptir.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 */}
      <section id="sec-5" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">05</span>
          <span>Ödeme Yöntemleri, PayTR Güvencesi ve Lisans Aktivasyonu</span>
        </h2>
        <p className="legal-body-text">
          Web sitemiz üzerinden yapılan tüm finansal işlemler, Türkiye Cumhuriyet Merkez Bankası (TCMB) lisanslı ve BDDK denetimli resmi ödeme kuruluşu olan <strong>PayTR Ödeme ve Elektronik Para Kuruluşu A.Ş.</strong> altyapısı ile gerçekleştirilir.
        </p>
        <ul className="legal-styled-list">
          <li>
            <strong>256-Bit SSL ve 3D Secure Doğrulama:</strong> Kredi kartı ve banka kartı ödemeleri bankanızın 3D Secure SMS doğrulama kodu ile tamamlanır.
          </li>
          <li>
            <strong>Kart Bilgisi Saklanmaz:</strong> Kredi kartı numaranız, son kullanma tarihiniz ve CVV kodunuz Wihyfe sunucularında asla saklanmaz, işlenmez ve personellerimiz tarafından görülemez.
          </li>
          <li>
            <strong>Otomatik Lisans Tanımlama:</strong> PayTR onayının ardından sipariş sistemimiz tarafından ilgili Discord sunucu ID&apos;sine lisans tanımlaması dakikalar içinde tamamlanır.
          </li>
          <li>
            <strong>Periyodik Süre Takibi:</strong> Satın alınan paket süresi (1 Aylık, 3 Aylık vb.) dolduğunda hizmet askıya alınır. Müşteri süresi dolmadan önce panelden süreyi uzatabilir.
          </li>
        </ul>

        <div className="legal-callout-box callout-info">
          <div className="callout-icon">🛡️</div>
          <div className="callout-content">
            <div className="callout-title">Fatura ve Sipariş Dekontu</div>
            <p className="callout-desc">
              Sipariş tamamlandığında PayTR onay dekontu ve dijital sipariş özeti ödeme formunda belirttiğiniz e-posta adresinize anında otomatik olarak iletilir.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6 */}
      <section id="sec-6" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">06</span>
          <span>Cayma Hakkı İstisnası (6502 Sayılı Kanun) ve Teknik İade Telafisi</span>
        </h2>
        <p className="legal-body-text">
          6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesinin 1. fıkrasının (ğ) bendi uyarınca:
        </p>
        <div className="legal-callout-box callout-info">
          <div className="callout-icon">⚖️</div>
          <div className="callout-content">
            <div className="callout-title">Elektronik Ortamda Anında Teslim Edilen Gayrimaddi Mallar</div>
            <p className="callout-desc">
              &ldquo;Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz.&rdquo;
            </p>
          </div>
        </div>
        <p className="legal-body-text">
          Bot lisansı üretildiği ve hedef Discord sunucusuna tanımlandığı andan itibaren dijital ürün eksiksiz teslim edilmiş sayılır. Bu sebeple keyfi, sunucu kapatma veya kullanıcı kaynaklı cayma/iade talepleri mevzuat gereği kabul edilmez.
        </p>
        <p className="legal-body-text">
          <strong>Teknik Telafi ve Arıza Garantisi:</strong> Wihyfe sunucu altyapısından veya bot kaynak kodundan kaynaklanan, teknik destek ekibimize bildirildikten sonra 48 saat içerisinde çözülemeyen sürekli işlev kayıplarında; Müşteri&apos;ye kalan lisans süresinin bedeli iade edilir ya da arıza süresi kadar ücretsiz ek kullanım süresi tanımlanır.
        </p>
      </section>

      {/* Section 7 */}
      <section id="sec-7" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">07</span>
          <span>Hizmet Seviyesi Taahhüdü (SLA), Planlı Bakım ve Kesintiler</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe, sistem mimarisini yıllık bazda %99.9 çalışma süresi (Uptime) hedefiyle yönetmektedir. Ancak aşağıdaki durumlardan kaynaklanan kesintilerde Wihyfe sorumlu tutulamaz:
        </p>
        <ul className="legal-styled-list">
          <li>Discord Inc. kaynaklı global Gateway, API, Cloudflare veya Cloud sunucu arızaları ve bakım dönemleri,</li>
          <li>Müşteri veya sunucu yöneticilerinin bot izinlerini kaldırması, botu sunucudan atması veya yanlış rol hiyerarşisi oluşturması,</li>
          <li>Önceden Discord topluluk sunucumuzdan duyurusu yapılan planlı veritabanı optimizasyonu ve donanım yükseltmeleri,</li>
          <li>Mücbir sebepler (doğal afetler, uluslararası internet omurga kopmaları, yangın, siber savaş vb.).</li>
        </ul>
      </section>

      {/* Section 8 */}
      <section id="sec-8" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">08</span>
          <span>Fikri ve Sınai Mülkiyet Hakları</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe markası, logosu, web sitesi arayüzü, bot yazılım kodları, algoritmaları, panel tasarımları ve veritabanı şemaları üzerindeki tüm fikri ve sınai mülkiyet hakları münhasıran <strong>Wihyfe Bilişim Hizmetleri</strong>&apos;ne aittir.
        </p>
        <p className="legal-body-text">
          Müşteriye sağlanan hak yalnızca lisans süresi boyunca ilgili Discord sunucusunda bot hizmetinden yararlanma hakkı (Kullanım Lisansı) olup; yazılımın kaynak kodunu kopyalamak, tersine mühendislik (reverse engineering) uygulamak, kaynak kodları decompile etmek veya üçüncü şahıslara ticari olarak satmak kanunen kesinlikle yasaktır.
        </p>
      </section>

      {/* Section 9 */}
      <section id="sec-9" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">09</span>
          <span>Sözleşme Değişiklikleri, Bildirimler ve Fesih</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe, gelişen yasal düzenlemeler, yeni Discord politikaları veya hizmet güncellemeleri doğrultusunda bu sözleşme maddelerinde dilediği zaman değişiklik yapma hakkını saklı tutar. Güncellenen sözleşme web sitemizde yayımlandığı tarihten itibaren geçerlilik kazanır.
        </p>
        <p className="legal-body-text">
          Önemli sözleşme güncellemeleri web sitemizin yasal duyuru alanında ve resmi Discord sunucumuzda ilan edilir. Kullanıcılarımızın hizmeti kullanmaya devam etmesi güncellenen şartları kabul ettiği anlamına gelir.
        </p>
      </section>

      {/* Section 10 */}
      <section id="sec-10" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">10</span>
          <span>Uyuşmazlıkların Çözümü ve Yetkili Yargı Mercileri</span>
        </h2>
        <p className="legal-body-text">
          İşbu Sözleşme&apos;nin uygulanmasından, yorumlanmasından veya maddelerinin ihlalinden doğabilecek her türlü hukuki ve cezai uyuşmazlığın çözümünde <strong>Türkiye Cumhuriyeti Kanunları</strong> münhasıran uygulanır. Uyuşmazlık halinde <strong>İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri</strong> münhasır yetkilidir.
        </p>
        <p className="legal-body-text">
          Tüketici sıfatını haiz kullanıcılar, uyuşmazlık durumunda yasal parasal sınırlar dahilinde Tüketici Hakem Heyetlerine veya Tüketici Mahkemelerine başvurma hakkına sahiptir.
        </p>
      </section>
    </LegalPageLayout>
  );
}
