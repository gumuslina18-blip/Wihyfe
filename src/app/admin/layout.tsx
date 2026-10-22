import type { Metadata } from 'next';
import './admin.css';
import { AdminProvider } from '@/context/AdminContext';

export const metadata: Metadata = {
  title: 'Wihyfe OS • Yetkili & Yönetim Paneli',
  description: 'Wihyfe Discord altyapı yönetim paneli. Ürünler, teslimat süreçleri, 6 rol hiyerarşisi, PIN oluşturma ve güvenlik kalkanı.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProvider>{children}</AdminProvider>;
}
