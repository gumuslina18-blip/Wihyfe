import type { Metadata } from 'next';
import LegalPageLayout, { TocItem, SummaryCard } from '@/components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'İptal, İade & Teslimat Koşulları | Wihyfe',
  description: 'Wihyfe Discord bot yazılımları, lisans aktivasyonları ve bulut abonelikleri için iptal, iade ve dijital teslimat politikası.',
};

const TOC: TocItem[] = [
  { id: 'sec-1', number: '01', title: 'Genel İlkeler & Teslimat Kapsamı' },
  { id: 'sec-2', number: '02', title: 'Dijital Teslimat Süreci & Süreleri' },
  { id: 'sec-3', number: '03', title: 'İptal ve İade Koşulları' },
  { id: 'sec-4', number: '04', title: 'Cayma Hakkı İstisnaları (Mevzuat Uyarınca)' },
  { id: 'sec-5', number: '05', title: 'Hatalı / Kusurlu Hizmet Durumu & Telafi' },
  { id: 'sec-6', number: '06', title: 'İade Başvuru Prosedürü' },
];

const SUMMARY_CARDS: SummaryCard[] = [
  {
    icon: '🚀',
    title: 'Anında Otomatik Teslimat',
    desc: 'PayTR veya bakiye ile ödeme tamamlandığı an lisans kodunuz anında aktif edilir ve profilinize eklenir.',
  },
  {
    icon: '🛠️',
    title: '48 Saat Teknik Güvence',
    desc: 'Bizden kaynaklı çözülemeyen teknik aksaklıklarda bakiye iadesi veya yeni lisans telafisi garantisi sunulur.',
  },
  {
    icon: '💳',
    title: 'Şeffaf Bakiye & Kart İadesi',
    desc: 'Onaylanan iadeler PayTR üzerinden doğrudan ödemenin yapıldığı karta veya site içi cüzdana aktarılır.',
  },
];

export default function RefundAndDeliveryPolicyPage() {
  return (
    <LegalPageLayout
      activeTab="refund-delivery"
      badge="Müşteri Hakları &amp; Teslimat"
      title="İptal, İade ve Dijital Teslimat Koşulları"
      description="Wihyfe üzerinden satın aldığınız Discord bot paketleri, lisans anahtarları ve ek hizmetlerin teslimat mekanizması, sipariş iptali ve iade şartlarına ilişkin bilgilendirme metnidir."
      lastUpdated="18 Ekim 2026"
      version="v1.3 (Güncel)"
      readingTime="~4 dk"
      summaryCards={SUMMARY_CARDS}
      tableOfContents={TOC}
    >
      {/* Section 1 */}
      <section id="sec-1" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">01</span>
          <span>Genel İlkeler &amp; Teslimat Kapsamı</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe (wihyfe.com) tarafından sunulan tüm hizmetler <strong>tamamen elektronik ortamda anında ifa edilen gayrimaddi ürün ve yazılım lisanslarıdır</strong>. Şirketimiz fiziksel kargo veya basılı materyal gönderimi yapmamaktadır.
        </p>
      </section>

      {/* Section 2 */}
      <section id="sec-2" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">02</span>
          <span>Dijital Teslimat Süreci &amp; Süreleri</span>
        </h2>
        <ul className="legal-bullet-list">
          <li><strong>Hazır Bot Paketleri &amp; Lisanslar (Free, Plus, Plus+):</strong> PayTR 3D Secure ödemesi veya site içi bakiye düşümü gerçekleştikten sonra sistem tarafından <strong>en geç 5 dakika içerisinde</strong> otomatik olarak kullanıcı profiline atanır.</li>
          <li><strong>PIN Kodları &amp; İstemci İndirme:</strong> Satın alınan veya tahsis edilen 6 haneli oturum PIN kodları /indir sayfasında girildiği an istemci indirme akışı anında başlar.</li>
          <li><strong>Özel Bot &amp; Web Tasarım Hizmetleri:</strong> Müşteriyle mutabık kalınan teknik şartname doğrultusunda tahmini teslim süresi (genellikle 1 ila 5 iş günü) sipariş onayında belirtilir.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section id="sec-3" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">03</span>
          <span>İptal ve İade Koşulları</span>
        </h2>
        <p className="legal-body-text">
          ALICI, satın aldığı ürün veya abonelik henüz aktive edilmemişse (lisans kodu kullanılmamış ve Discord sunucusuna bağlanmamışsa) <strong>sipariş anından itibaren 24 saat içerisinde</strong> Destek Talebi (Ticket) açarak koşulsuz sipariş iptali ve tam iade talebinde bulunabilir.
        </p>
        <p className="legal-body-text">
          Lisansı aktive edilmiş ve sunucuya kurulmuş botlarda iade talepleri teknik incelemeye tabidir.
        </p>
      </section>

      {/* Section 4 */}
      <section id="sec-4" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">04</span>
          <span>Cayma Hakkı İstisnaları (Mevzuat Uyarınca)</span>
        </h2>
        <p className="legal-body-text">
          6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesinin birinci fıkrasının (ğ) bendi uyarınca; <em>&ldquo;Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmelerde tüketici cayma hakkını kullanamaz.&rdquo;</em>
        </p>
        <p className="legal-body-text">
          Aktivasyonu tamamlanmış ve Discord üzerinde çalışmaya başlamış botlarda, altyapı maliyetleri ve sunucu tahsisi anında gerçekleştirdiğinden keyfi gerekçelerle (fikir değiştirme, sunucu kapatılması vb.) cayma hakkı bulunmamaktadır.
        </p>
      </section>

      {/* Section 5 */}
      <section id="sec-5" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">05</span>
          <span>Hatalı / Kusurlu Hizmet Durumu &amp; Telafi</span>
        </h2>
        <p className="legal-body-text">
          Wihyfe tarafından sağlanan bot yazılımında müşterinin hatasından kaynaklanmayan (Discord API arızaları ve bakım dönemleri hariç) sürekli ve düzeltilemeyen bir teknik kusur meydana gelirse:
        </p>
        <ul className="legal-bullet-list">
          <li>Öncelikle teknik destek ekibimiz 48 saat içerisinde sorunu gidermekle yükümlüdür.</li>
          <li>Sorun giderilemezse, müşteriye kalan abonelik süresi oranında para iadesi veya eşdeğer paket tanımlaması yapılır.</li>
        </ul>
      </section>

      {/* Section 6 */}
      <section id="sec-6" className="legal-section-block">
        <h2 className="legal-section-heading">
          <span className="legal-sec-num">06</span>
          <span>İade Başvuru Prosedürü</span>
        </h2>
        <p className="legal-body-text">
          İade veya iptal taleplerinizi wihyfe.com üzerindeki <strong>Destek Taleplerim</strong> panelinden veya resmi Discord sunucumuz üzerinden sipariş numaranızı belirterek iletebilirsiniz. Onaylanan iadeler, bankanıza bağlı olarak 3 ila 7 iş günü içerisinde ödeme yaptığınız kredi kartınıza veya site içi bakiye hesabınıza yansıtılır.
        </p>
      </section>
    </LegalPageLayout>
  );
}
