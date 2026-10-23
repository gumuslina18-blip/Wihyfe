import type { Metadata } from 'next';
import LegalPageLayout, { TocItem, SummaryCard } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Wihyfe',
  description: 'Wihyfe Discord bot yazılımları, bulut lisansları ve altyapı hizmetleri mesafeli satış sözleşmesi. 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve PayTR ödeme güvencesi hükümleri.',
};

const TOC: TocItem[] = [
  { id: 'sec-1', number: '01', title: 'Taraflar ve Tanımlar' },
  { id: 'sec-2', number: '02', title: 'Sözleşmenin Konusu ve Kapsamı' },
  { id: 'sec-3', number: '03', title: 'Hizmet Bedeli ve PayTR ile Ödeme' },
  { id: 'sec-4', number: '04', title: 'Dijital Teslimat ve İfa Şekli' },
  { id: 'sec-5', number: '05', title: 'Cayma Hakkı ve İstisnaları (Madde 15)' },
  { id: 'sec-6', number: '06', title: 'Tarafların Hak ve Yükümlülükleri' },
  { id: 'sec-7', number: '07', title: 'Uyuşmazlıkların Çözümü ve Yetkili Mahkeme' },
];

const SUMMARY_CARDS: SummaryCard[] = [
  {
    icon: '📜',
    title: '6502 Sayılı Kanun Uyumu',
    desc: 'Mesafeli Sözleşmeler Yönetmeliği uyarınca dijital ortamda sunulan yazılım ve bulut hizmetleri tam yasal güvencededir.',
  },
  {
    icon: '⚡',
    title: 'Anında Dijital Teslimat',
    desc: 'Ödeme onaylandığı anda bot ve lisans anahtarınız Discord hesabınıza ve sunucunuza derhal tahsis edilir.',
  },
  {
    icon: '🔒',
    title: 'PayTR 256-Bit SSL Koruma',
    desc: 'Tüm ödemeleriniz TCMB lisanslı PayTR altyapısıyla 3D Secure güvencesi altında şifrelenerek tahsil edilir.',
  },
];

export default function DistanceSalesContractPage() {
  return (
    <LegalPageLayout
      activeTab="distance-sales"
      badge="Yasal Dokümantasyon &amp; Sözleşme"
      title="Mesafeli Satış Sözleşmesi"
      description="İşbu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince Wihyfe üzerinden yapılan elektronik sipariş ve lisans alımları için düzenlenmiştir."
      lastUpdated="18 Ekim 2026"
      version="v1.4 (PayTR Uyumlu)"
      readingTime="~5 dk"
      summaryCards={SUMMARY_CARDS}
      tableOfContents={TOC}
    >
      {/* Section 1 */}
      <section id="sec-1" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">01</span>
          <span>Taraflar ve Tanımlar</span>
        </h2>
        <p className="legal-body-text">
          İşbu Mesafeli Satış Sözleşmesi (&ldquo;Sözleşme&rdquo;), aşağıda bilgileri yer alan <strong>SATICI</strong> ile wihyfe.com üzerinden sipariş oluşturan veya ödeme yapan <strong>ALICI</strong> arasında akdedilmiştir:
        </p>
        <div className="legal-highlight-box">
          <p className="legal-sub-heading">SATICI BİLGİLERİ:</p>
          <ul className="legal-bullet-list">
            <li><strong>Ticari Ünvan:</strong> Wihyfe Bilişim ve Yazılım Hizmetleri</li>
            <li><strong>Web Sitesi:</strong> <a href="https://wihyfe.com" target="_blank" rel="noopener noreferrer">https://wihyfe.com</a></li>
            <li><strong>İletişim &amp; Destek:</strong> support@wihyfe.com / https://discord.gg/SbrKk6Q87H</li>
            <li><strong>Hizmet Alanı:</strong> Discord Bot Altyapıları, Bulut Otomasyonu, Web Yazılımları</li>
          </ul>
          <p className="legal-sub-heading" style={{ marginTop: '1rem' }}>ALICI BİLGİLERİ:</p>
          <p className="legal-body-text">
            wihyfe.com üzerinden Discord OAuth ile giriş yapan, sipariş formunda belirtilen Discord ID, e-posta ve fatura/iletişim bilgilerinin sahibi olan gerçek veya tüzel kişidir.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section id="sec-2" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">02</span>
          <span>Sözleşmenin Konusu ve Kapsamı</span>
        </h2>
        <p className="legal-body-text">
          İşbu sözleşmenin konusu; ALICI&apos;nın SATICI&apos;ya ait wihyfe.com web sitesinden elektronik ortamda siparişini verdiği, nitelikleri ve satış fiyatı sipariş özetinde belirtilen Discord Bot Lisansları (Free, Plus, Plus+), Web Siteleri ve Dijital Altyapı Hizmetlerinin satışı, teslimi ve tarafların hak/yükümlülüklerinin 6502 sayılı Tüketicinin Korunması Hakkında Kanun gereğince belirlenmesidir.
        </p>
      </section>

      {/* Section 3 */}
      <section id="sec-3" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">03</span>
          <span>Hizmet Bedeli ve PayTR ile Ödeme</span>
        </h2>
        <p className="legal-body-text">
          Sipariş konusu dijital ürün veya aboneliklerin vergiler dahil satış bedeli, sipariş esnasında ALICI&apos;ya sunulan tutardır. Ödemeler Türkiye Cumhuriyet Merkez Bankası (TCMB) onaylı ödeme kuruluşu olan <strong>PayTR Ödeme ve Elektronik Para Kuruluşu A.Ş.</strong> altyapısı üzerinden 256-bit SSL ve 3D Secure korumasıyla tahsil edilir.
        </p>
        <p className="legal-body-text">
          ALICI&apos;nın kredi kartı veya banka kartı bilgileri hiçbir şekilde SATICI sunucularında tutulmaz veya saklanmaz.
        </p>
      </section>

      {/* Section 4 */}
      <section id="sec-4" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">04</span>
          <span>Dijital Teslimat ve İfa Şekli</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe tarafından sağlanan ürünler fiziksel kargo gerektirmeyen <strong>tamamen dijital ürün ve bulut lisanslarıdır</strong>. 
        </p>
        <ul className="legal-bullet-list">
          <li>Ödeme PayTR veya bakiye yöntemiyle onaylandığı anda ilgili lisans ve PIN kodu ALICI&apos;nın hesabına tanımlanır.</li>
          <li>Kullanıcı, teslim edilen bot lisansını Profil panelinden veya Lisans Aktivasyon menüsünden hedef Discord sunucusuna anında bağlayabilir.</li>
          <li>Fiziksel gönderi yapılmadığından kargo veya kurye ücreti tahakkuk ettirilmez.</li>
        </ul>
      </section>

      {/* Section 5 */}
      <section id="sec-5" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">05</span>
          <span>Cayma Hakkı ve İstisnaları (Yönetmelik Madde 15)</span>
        </h2>
        <p className="legal-body-text">
          Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. Maddesi (ğ) bendi uyarınca; <em>&ldquo;Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz.&rdquo;</em>
        </p>
        <p className="legal-body-text">
          Bununla birlikte SATICI, müşteri memnuniyetini esas alarak lisans aktivasyonu gerçekleşmemiş veya teknik kusuru SATICI tarafından 48 saat içerisinde giderilemeyen siparişlerde iade veya bakiye telafisi hakkı tanımaktadır.
        </p>
      </section>

      {/* Section 6 */}
      <section id="sec-6" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">06</span>
          <span>Tarafların Hak ve Yükümlülükleri</span>
        </h2>
        <p className="legal-body-text">
          ALICI, edindiği bot ve lisansları Discord Hizmet Şartları&apos;na (Discord ToS) ve Türkiye Cumhuriyeti kanunlarına aykırı faaliyetlerde (spam, DDoS, zararlı yazılım, yasadışı içerik barındırma vb.) kullanmayacağını taahhüt eder.
        </p>
        <p className="legal-body-text">
          SATICI, botların %99.5 Uptime oranıyla 7/24 kesintisiz çalışması için gerekli bulut altyapısını sağlamakla yükümlüdür.
        </p>
      </section>

      {/* Section 7 */}
      <section id="sec-7" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">07</span>
          <span>Uyuşmazlıkların Çözümü ve Yetkili Mahkeme</span>
        </h2>
        <p className="legal-body-text">
          İşbu sözleşmenin uygulanmasından doğabilecek her türlü uyuşmazlıklarda Ticaret Bakanlığı&apos;nca her yıl ilan edilen değere kadar Tüketici Hakem Heyetleri ile ALICI&apos;nın veya SATICI&apos;nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
        </p>
      </section>
    </LegalPageLayout>
  );
}
