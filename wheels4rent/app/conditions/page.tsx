import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ConditionsSection from '@/components/sections/ConditionsSection';
import FAQAccordion from '@/components/sections/FAQAccordion';
import HowItWorks from '@/components/sections/HowItWorks';

export const metadata: Metadata = {
  title: 'Условия аренды — Wheels4Rent',
  description: 'Условия аренды автомобилей в Москве: документы, возраст, залог, доставка. Полный FAQ по вопросам аренды.',
};

export default function ConditionsPage() {
  return (
    <>
      <Header />
      <main className="min-h-[100dvh] pt-20 bg-zinc-950">
        {/* Hero */}
        <div className="bg-zinc-950 border-b border-white/5 py-14 px-6 md:px-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3">Правила</div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tightest text-white leading-none">
              Условия<br />
              <span className="text-zinc-500">аренды</span>
            </h1>
          </div>
        </div>

        <ConditionsSection />
        <div className="section-divider" />
        <HowItWorks />
        <div className="section-divider" />
        <FAQAccordion />
      </main>
      <Footer />
    </>
  );
}
