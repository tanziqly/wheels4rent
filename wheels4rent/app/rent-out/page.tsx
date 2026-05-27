import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RentOutPage from '@/components/sections/RentOutPage';

export const metadata: Metadata = {
  title: 'Сдать авто — Wheels4Rent',
  description: 'Передайте автомобиль в управление Wheels4Rent и получайте стабильный доход. Полная страховка, обслуживание за наш счёт, прозрачные выплаты.',
};

export default function RentOut() {
  return (
    <>
      <Header />
      <main className="min-h-[100dvh] pt-20 bg-zinc-950">
        <RentOutPage />
      </main>
      <Footer />
    </>
  );
}
