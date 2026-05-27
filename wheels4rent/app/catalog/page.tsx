import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CatalogPageClient from '@/components/catalog/CatalogPageClient';
import { cars, categories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Каталог автомобилей — Wheels4Rent',
  description: 'Полный каталог премиальных автомобилей в аренду в Москве. Седаны, внедорожники, спорткары, электрокары и кабриолеты.',
};

export default function CatalogPage() {
  return (
    <>
      <Header />
      <main className="min-h-[100dvh] pt-20">
        {/* Hero strip */}
        <div className="bg-zinc-950 border-b border-white/5 py-14 px-6 md:px-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3">Автопарк</div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tightest text-white leading-none">
              Каталог<br />
              <span className="text-zinc-500">автомобилей</span>
            </h1>
          </div>
        </div>

        <CatalogPageClient cars={cars} categories={categories} />
      </main>
      <Footer />
    </>
  );
}
