import type { Metadata } from 'next';
import DownloadSection from '@/components/DownloadSection';

export const metadata: Metadata = {
  title: 'İstemciyi İndir | Wihyfe',
  description: 'Wihyfe inceleme ve tarama istemcisini 6 haneli oturum PIN kodunuz ile güvenle doğrulayıp indirin.',
};

export default function DownloadPage() {
  return (
    <main className="download-page-wrapper">
      <DownloadSection isStandalonePage={true} />
    </main>
  );
}
