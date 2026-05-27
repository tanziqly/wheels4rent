'use client';

import { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GasPump, Seat, Lightning, ArrowRight, Gauge } from '@phosphor-icons/react';
import Link from 'next/link';
import type { Car } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCars } from '@/lib/adminStore';
import { carThumb } from '@/lib/carImages';

const CarCard = forwardRef<HTMLDivElement, { car: Car }>(({ car }, ref) => {
  const { t } = useLanguage();
  const cs = t.catalogSection;
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-gold-500/20 transition-all duration-300 hover:-translate-y-1 flex flex-col"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-800">
        <img
          src={carThumb(car, '800/450')}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-zinc-950/70 backdrop-blur-sm text-xs font-semibold text-gold-400 border border-gold-500/20">
          {car.priceFrom}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-white text-base mb-3 leading-tight">{car.name}</h3>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <GasPump size={13} className="text-gold-500 flex-shrink-0" />
            {car.engine}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Seat size={13} className="text-gold-500 flex-shrink-0" />
            {cs.seats(car.seats)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Lightning size={13} className="text-gold-500 flex-shrink-0" />
            {car.power}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Gauge size={13} className="text-gold-500 flex-shrink-0" />
            {car.transmission}
          </div>
        </div>

        <div className="text-xs text-zinc-500 mb-4">{cs.driveLabel} {car.drive}</div>

        <div className="mt-auto flex gap-2">
          <Link
            href={`/cars/${car.slug}`}
            className="flex-1 py-2.5 text-xs font-medium text-zinc-300 border border-white/10 rounded-xl hover:border-white/20 hover:text-white transition-all duration-200 text-center"
          >
            {cs.btnDetails}
          </Link>
          <Link
            href={`/cars/${car.slug}#booking`}
            className="flex-1 py-2.5 text-xs font-semibold bg-gold-500 text-zinc-950 rounded-xl hover:bg-gold-300 transition-all duration-200 text-center active:scale-[0.98]"
          >
            {cs.btnRent}
          </Link>
        </div>
      </div>
    </motion.div>
  );
});
CarCard.displayName = 'CarCard';

export default function CatalogSection() {
  const { t } = useLanguage();
  const cs = t.catalogSection;
  const [activeSlug, setActiveSlug] = useState('new');
  const cars = useCars();

  const filtered = cars.filter((c) => c.categorySlug === activeSlug);

  return (
    <section id="catalog" className="py-24 md:py-32 bg-zinc-950">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3">{cs.tag}</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tightest text-white leading-none">
              {cs.h2Line1}<br />
              <span className="text-zinc-500">{cs.h2Line2}</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-[320px] md:text-right">
            {cs.subtitle}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {cs.tabs.map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setActiveSlug(tab.slug)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeSlug === tab.slug
                  ? 'bg-gold-500 text-zinc-950'
                  : 'text-zinc-400 border border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-10 flex justify-center">
          <Link href="/catalog" className="btn-outline">
            {cs.btnAllCatalog}
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
