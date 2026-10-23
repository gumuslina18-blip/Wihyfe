import type { Metadata } from 'next';
import DownloadSection from '@/components/DownloadSection';

export const metadata: Metadata = {
  title: 'İstemciyi İndir | Wihyfe',
  description: 'Wihyfe Client masaüstü uygulamasını 6 haneli oturum PIN kodunuz ile indirin; sunucu ve yönetim panellerinize tek noktadan erişin.',
};

export default function DownloadPage() {
  return (
    <main className="download-page-wrapper">
      <DownloadSection isStandalonePage={true} />
    </main>
  );
}
