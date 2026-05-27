import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DiscountSection from '@/components/sections/DiscountSection';
import BookingForm from '@/components/sections/BookingForm';
import SalePromos from '@/components/sections/SalePromos';

export const metadata: Metadata = {
  title: 'Акции и скидки — Wheels4Rent',
  description: 'Текущие акции на аренду премиальных автомобилей в Москве. Прогрессивная система скидок, бонусы за лояльность.',
};

export default function SalePage() {
  return (
    <>
      <Header />
      <main className="min-h-[100dvh] pt-20 bg-zinc-950">
        <div className="bg-zinc-950 border-b border-white/5 py-14 px-6 md:px-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3">Акции</div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tightest text-white leading-none">
              Лучшие предложения<br />
              <span className="text-zinc-500">этого месяца</span>
            </h1>
          </div>
        </div>

        <SalePromos />
        <div className="section-divider" />
        <DiscountSection />
        <div className="section-divider" />
        <BookingForm />
      </main>
      <Footer />
    </>
  );
}
