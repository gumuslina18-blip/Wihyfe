import type { Metadata } from 'next';
import LegalPageLayout, { TocItem, SummaryCard } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası & KVKK Aydınlatma Metni | Wihyfe',
  description: 'Wihyfe kişisel verilerin korunması politikası, 6698 sayılı KVKK uyumu, Discord OAuth2 veri güvenliği, PayTR ödeme gizliliği ve veri sahibi hakları.',
};

const TOC: TocItem[] = [
  { id: 'sec-1', number: '01', title: 'Veri Sorumlusunun Kimliği' },
  { id: 'sec-2', number: '02', title: 'İşlenen Kişisel Veri Kategorileri' },
  { id: 'sec-3', number: '03', title: 'Veri İşleme Amaçları & Hukuki Sebepler' },
  { id: 'sec-4', number: '04', title: 'Finansal Veri Güvenliği & PCI-DSS' },
  { id: 'sec-5', number: '05', title: 'Kişisel Verilerin Aktarıldığı Taraflar' },
  { id: 'sec-6', number: '06', title: 'Saklama Süreleri & İmha Politikası' },
  { id: 'sec-7', number: '07', title: 'Alınan Teknik & İdari Güvenlik Tedbirleri' },
  { id: 'sec-8', number: '08', title: 'Veri Sahibinin Hakları (KVKK Md. 11)' },
  { id: 'sec-9', number: '09', title: 'Başvuru Usulü & İletişim Kanalları' },
];

const SUMMARY_CARDS: SummaryCard[] = [
  {
    icon: '🔒',
    title: 'KVKK & GDPR Standartları',
    desc: 'Verileriniz 6698 sayılı Kişisel Verilerin Korunması Kanunu ve uluslararası siber güvenlik ilkelerine tam uyumlu olarak korunur.',
  },
  {
    icon: '💳',
    title: 'Sıfır Kart Bilgisi Depolama',
    desc: 'Kredi kartı bilgileriniz Wihyfe sistemlerinde asla tutulmaz; tüm işlemler doğrudan PayTR PCI-DSS Level 1 altyapısında işlenir.',
  },
  {
    icon: '🛡️',
    title: 'Şeffaf & Sınırlı Veri İşleme',
    desc: 'Yalnızca Discord bot hizmetinin sunulması, lisans kontrolü ve hesap güvenliği için zorunlu olan asgari veri toplanır.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      activeTab="privacy"
      badge="KVKK &amp; Veri Güvenliği Aydınlatma Metni"
      title="Gizlilik Politikası &amp; KVKK Metni"
      description="6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) kapsamında Wihyfe olarak gizliliğinizi, hesap ve sunucu verilerinizi korumak en yüksek önceliğimizdir."
      lastUpdated="17 Ekim 2026"
      version="v2.8 (Güncel)"
      readingTime="~5 dk"
      summaryCards={SUMMARY_CARDS}
      tableOfContents={TOC}
    >
      {/* Section 1 */}
      <section id="sec-1" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">01</span>
          <span>Veri Sorumlusunun Kimliği</span>
        </h2>
        <p className="legal-body-text">
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) uyarınca, <strong>Wihyfe Bilişim Hizmetleri</strong> (&ldquo;Wihyfe&rdquo;, &ldquo;Veri Sorumlusu&rdquo; veya &ldquo;Platform&rdquo;) olarak, web sitemizi (wihyfe.com) ziyaret eden, müşteri panelimizi kullanan ve Discord bot lisansı satın alan tüm kullanıcılarımızın kişisel verilerini yasal mevzuata uygun, şeffaf, ölçülü ve güvenli bir şekilde işlemekteyiz.
        </p>
        <p className="legal-body-text">
          Bu aydınlatma metni; hangi verilerin hangi yöntemlerle toplandığını, ne amaçla işlendiğini, kimlerle paylaşılabileceğini ve veri sahibi olarak sahip olduğunuz yasal hakları açıklamaktadır.
        </p>
      </section>

      {/* Section 2 */}
      <section id="sec-2" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">02</span>
          <span>İşlenen Kişisel Veri Kategorileri</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe, yalnızca sunduğu bot hizmetlerinin teknik olarak yerine getirilmesi, lisans doğrulaması ve kullanıcı güvenliğinin sağlanması amacıyla zorunlu olan asgari düzeyde veri işler:
        </p>
        <ul className="legal-styled-list">
          <li>
            <strong>Discord Kimlik ve Profil Verileri (OAuth2):</strong> Discord ile oturum açtığınızda Discord API üzerinden sağlanan benzersiz kullanıcı numaranız (Snowflake User ID), kullanıcı adınız (username), profil avatar adresiniz ve yönetici yetkisine sahip olduğunuz sunucuların kimlik listesi (`guilds`).
          </li>
          <li>
            <strong>Sipariş ve Lisans Verileri:</strong> Satın alma sırasında belirtilen hedef Discord Sunucu ID&apos;si, sunucu adı, sipariş takip numarası (`#WIH-XXXXXX`), faturalandırma iletişim e-posta adresi, seçilen paket ve lisans periyodu.
          </li>
          <li>
            <strong>Bot Yapılandırma ve Konfigürasyon Verileri:</strong> Wihyfe müşteri paneli üzerinden sunucunuz için tanımladığınız bot prefix&apos;i, karşılama mesajı şablonları, moderasyon log kanalı ID&apos;leri, yetkili rol ID&apos;leri ve koruma filtresi seviyeleri.
          </li>
          <li>
            <strong>Destek Masası İletişim Verileri:</strong> Discord veya web üzerinden destek personellerimize ilettiğiniz talep mesajları, hata ekran görüntüleri ve teknik bildirimler.
          </li>
          <li>
            <strong>İşlem Güvenliği ve Teknik Loglar:</strong> IP adresi, tarayıcı bilgisi, oturum güvenlik belirteçleri (`wihyfe_session`), Cloudflare güvenlik süzgeç kayıtları ve yetkisiz işlem deneme kayıtları.
          </li>
        </ul>

        <div className="legal-callout-box callout-success">
          <div className="callout-icon">🔒</div>
          <div className="callout-content">
            <div className="callout-title">Finansal Verilerinizin Dokunulmazlığı</div>
            <p className="callout-desc">
              Wihyfe veritabanlarında kredi kartı veya banka kartı numarası, son kullanma tarihi ya da CVV güvenlik kodu <strong>kesinlikle saklanmaz, işlenmez ve personellerimiz tarafından erişilemez</strong>. Tüm ödeme süreçleri BDDK ve TCMB lisanslı <strong>PayTR Ödeme Kuruluşu A.Ş.</strong>&apos;nin PCI-DSS Level 1 sertifikalı güvenli sistemleri üzerinden yürütülür.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section id="sec-3" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">03</span>
          <span>Kişisel Veri İşlemenin Hukuki Sebepleri ve Amaçları</span>
        </h2>
        <p className="legal-body-text">
          Kişisel verileriniz, KVKK&apos;nın 5. maddesinde belirtilen &ldquo;Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması&rdquo;, &ldquo;Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi&rdquo; ve &ldquo;İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması&rdquo; hukuki sebeplerine dayalı olarak işlenmektedir.
        </p>
        <p className="legal-body-text">Verileriniz şu amaçlarla kullanılır:</p>
        <ul className="legal-styled-list">
          <li>Satın aldığınız bot lisansının doğru Discord sunucusuna anında ve hatasız bağlanması,</li>
          <li>Müşteri paneli (`/panel`) üzerinden yaptığınız ayarların Discord sunucunuza gerçek zamanlı aktarılması,</li>
          <li>Sipariş teyitlerinin, lisans süre bitimi uyarılarının ve PayTR ödeme dekontlarının e-posta ile iletilmesi,</li>
          <li>Teknik destek biletlerinin yanıtlanması ve sunucu kurulum desteğinin verilmesi,</li>
          <li>Yetkisiz girişlerin tespiti, dolandırıcılığın önlenmesi ve siber güvenliğin temini.</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section id="sec-4" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">04</span>
          <span>Finansal Veri Güvenliği ve PCI-DSS Standartları</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe, kullanıcılarının ödeme güvenliğini en üst standartlarda korumak amacıyla TCMB lisanslı resmi ödeme kuruluşu <strong>PayTR</strong> ile çalışmaktadır.
        </p>
        <p className="legal-body-text">
          Ödeme esnasında girdiğiniz kart bilgileri, tarayıcınızdan doğrudan PayTR&apos;ın banka entegrasyonu sunucularına 256-Bit SSL şifreleme ile iletilir. Bankanız tarafından telefonunuza gönderilen 3D Secure onay SMS kodu doğrulandıktan sonra tahsilat tamamlanır. Wihyfe sistemleri yalnızca &ldquo;Ödeme Başarılı / Başarısız&rdquo; sinyalini ve sipariş referans kodunu alır.
        </p>
      </section>

      {/* Section 5 */}
      <section id="sec-5" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">05</span>
          <span>Kişisel Verilerin Aktarıldığı Taraflar ve Aktarım Amaçları</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe, topladığı verileri kesinlikle üçüncü kişilere reklam, pazarlama, profil çıkarma veya ticari kazanç amacıyla satmaz, kiralamaz veya devretmez. Veriler yalnızca hizmetin zorunlu gereksinimleri doğrultusunda şu taraflara aktarılabilir:
        </p>
        <ul className="legal-styled-list">
          <li>
            <strong>Discord Inc. (ABD):</strong> Botun sunucunuzda çalışması, komutların yürütülmesi ve OAuth2 kimlik doğrulamasının tamamlanması amacıyla Discord API altyapısına.
          </li>
          <li>
            <strong>PayTR Ödeme ve Elektronik Para Kuruluşu A.Ş.:</strong> Yasal ödeme işlemlerinin gerçekleştirilmesi, faturalandırma ve tahsilat doğrulaması amacıyla.
          </li>
          <li>
            <strong>Cloudflare Inc.:</strong> Web sitesi ve bot API uç noktalarının DDoS saldırılarından korunması ve SSL şifreleme altyapısının işletilmesi amacıyla.
          </li>
          <li>
            <strong>Yetkili Adli ve İdari Merciler:</strong> Mahkemeler, savcılıklar veya kolluk kuvvetleri tarafından usulüne uygun yasal bir talep iletilmesi halinde kanuni zorunluluk gereği.
          </li>
        </ul>
      </section>

      {/* Section 6 */}
      <section id="sec-6" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">06</span>
          <span>Verilerin Saklanma Süreleri ve İmha Politikası</span>
        </h2>
        <p className="legal-body-text">
          Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve yasal mevzuatta öngörülen zamanaşımı süreleri saklı kalmak kaydıyla muhafaza edilir:
        </p>
        <ul className="legal-styled-list">
          <li>
            <strong>Aktif Lisans Verileri:</strong> Lisansınız devam ettiği sürece botun çalışması için sistemde tutulur. Lisansın sona ermesi veya botun sunucudan çıkarılması halinde sunucu yapılandırma verileri 30 gün içinde arşivlenerek güvenli şekilde silinir.
          </li>
          <li>
            <strong>Mali ve Muhasebe Kayıtları:</strong> Türk Ticaret Kanunu ve Vergi Usul Kanunu gereğince fatura ve sipariş kayıtları yasal zorunluluk olan 10 yıl süreyle arşivlenir.
          </li>
          <li>
            <strong>Teknik Güvenlik Logları:</strong> IP ve erişim kayıtları 5651 sayılı Kanun uyarınca azami 2 yıl süreyle saklanır ve süre sonunda otomatik imha edilir.
          </li>
        </ul>
      </section>

      {/* Section 7 */}
      <section id="sec-7" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">07</span>
          <span>Alınan Teknik ve İdari Güvenlik Tedbirleri</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe, kişisel verilerinizin hukuka aykırı olarak işlenmesini, erişilmesini ve sızdırılmasını önlemek amacıyla en güncel siber güvenlik protokollerini uygulamaktadır:
        </p>
        <ul className="legal-styled-list">
          <li>Tüm veri trafiği uçtan uca modern 256-Bit TLS/SSL sertifikalarıyla şifrelenir.</li>
          <li>Veritabanı bağlantıları izole ağlar (VPC) arkasında tutulur; dışarıdan doğrudan port erişimine kapalıdır.</li>
          <li>Yönetici ve yetkili personeller için İki Aşamalı Doğrulama (2FA) ve Rol Tabanlı Erişim Denetimi (RBAC) zorunludur.</li>
          <li>Cloudflare Web Application Firewall (WAF) ile otomatik DDoS, SQL Injection ve Brute-Force koruması sağlanır.</li>
        </ul>
      </section>

      {/* Section 8 */}
      <section id="sec-8" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">08</span>
          <span>Veri Sahibinin Yasal Hakları (KVKK Madde 11)</span>
        </h2>
        <p className="legal-body-text">
          KVKK&apos;nın 11. maddesi uyarınca veri sahibi olarak Wihyfe&apos;ye başvurarak şu haklarınızı kullanabilirsiniz:
        </p>
        <ul className="legal-styled-list">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
          <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
          <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
          <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
          <li>KVKK 7. maddede öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme,</li>
          <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme.</li>
        </ul>
      </section>

      {/* Section 9 */}
      <section id="sec-9" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">09</span>
          <span>Başvuru Usulü ve İletişim Kanalları</span>
        </h2>
        <p className="legal-body-text">
          Yukarıda sıralanan haklarınıza ilişkin taleplerinizi, kimliğinizi teyit eden Discord kullanıcı kimliğiniz ve sipariş bilgilerinizle birlikte resmi Discord Destek Masamız üzerinden veya web sitemizin iletişim kanallarından Wihyfe Veri Sorumlusu birimine iletebilirsiniz.
        </p>
        <p className="legal-body-text">
          Talepleriniz niteliğine göre en kısa sürede ve en geç <strong>30 (otuz) gün</strong> içerisinde ücretsiz olarak incelenip yazılı olarak sonuçlandırılacaktır.
        </p>
      </section>
    </LegalPageLayout>
  );
}
