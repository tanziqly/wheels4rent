import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CertificatePage from '@/components/sections/CertificatePage';

export const metadata: Metadata = {
  title: 'Подарочный сертификат — Wheels4Rent',
  description: 'Подарочный сертификат на аренду премиального автомобиля в Москве. Оригинальный подарок для близких.',
};

export default function Certificate() {
  return (
    <>
      <Header />
      <main className="min-h-[100dvh] pt-20 bg-zinc-950">
        <CertificatePage />
      </main>
      <Footer />
    </>
  );
}
