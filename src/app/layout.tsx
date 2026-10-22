import type { Metadata, Viewport } from 'next';
import './variables.css';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import DepositModal from '@/components/DepositModal';
import LoginModal from '@/components/LoginModal';
import SiteBackground from '@/components/SiteBackground';
import CloudflareSecurityShield from '@/components/CloudflareSecurityShield';
import AntiInspectionGuard from '@/components/AntiInspectionGuard';
import { StoreProvider } from '@/context/StoreContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.wihyfe.com'),
  title: SITE_CONFIG.brand.title,
  description: SITE_CONFIG.brand.description,
  keywords: [
    'Discord bot',
    'Wihyfe',
    'Discord moderasyon botu',
    'Discord ticket botu',
    'özel discord botu',
    'sunucu yönetimi',
  ],
  authors: [{ name: 'Wihyfe' }],
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '128x128', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    url: SITE_CONFIG.brand.discordUrl,
    title: SITE_CONFIG.brand.title,
    description: SITE_CONFIG.brand.description,
    images: ['/wihyfe-logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.brand.title,
    description: SITE_CONFIG.brand.description,
    images: ['/wihyfe-logo.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#14243A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <CloudflareSecurityShield />
        <AntiInspectionGuard />
        <SiteBackground />
        <LanguageProvider>
          <StoreProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <CheckoutModal />
            <DepositModal />
            <LoginModal />
          </StoreProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
