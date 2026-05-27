'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, SortAscending, GasPump, Seat, Lightning, Gauge, ArrowUpRight, X } from '@phosphor-icons/react';
import type { Car } from '@/lib/data';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getAdminCars } from '@/lib/adminStore';
import { carThumb } from '@/lib/carImages';

type Category = { label: string; slug: string };
type SortKey = 'newest' | 'price_asc' | 'price_desc';

export default function CatalogPageClient({ cars: serverCars, categories }: { cars: Car[]; categories: Category[] }) {
  const { t } = useLanguage();
  const cp = t.catalogPage;

  const [adminCars, setAdminCars] = useState<Car[]>([]);
  useEffect(() => { getAdminCars().then(setAdminCars).catch(() => {}); }, []);
  const cars = useMemo(() => [...serverCars, ...adminCars], [serverCars, adminCars]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [driveKey, setDriveKey] = useState('all');
  const [sortBy, setSortBy] = useState<SortKey>('newest');

  const filtered = useMemo(() => {
    let result = [...cars];
    if (activeCategory !== 'all') result = result.filter((c) => c.categorySlug === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (driveKey !== 'all') result = result.filter((c) => c.drive === driveKey);
    if (sortBy === 'price_asc') result.sort((a, b) => a.priceNum - b.priceNum);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.priceNum - a.priceNum);
    return result;
  }, [cars, activeCategory, search, driveKey, sortBy]);

  const hasFilters = activeCategory !== 'all' || search || driveKey !== 'all' || sortBy !== 'newest';

  const reset = () => { setActiveCategory('all'); setSearch(''); setDriveKey('all'); setSortBy('newest'); };

  return (
    <div className="bg-zinc-950 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-10">
        {/* Filters */}
        <div className="flex flex-col gap-5 mb-10">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
              {categories.map((cat) => (
                <button key={cat.slug} onClick={() => setActiveCategory(cat.slug)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat.slug
                      ? 'bg-gold-500 text-zinc-950'
                      : 'text-zinc-400 border border-white/10 hover:border-white/20 hover:text-white'
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-shrink-0 w-full lg:w-64">
              <MagnifyingGlass size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="text" placeholder={cp.searchPlaceholder} value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors" />
            </div>
          </div>

          {/* Second row */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">{cp.driveLabel}</span>
              {cp.driveOptions.map((d) => (
                <button key={d.key} onClick={() => setDriveKey(d.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    driveKey === d.key ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}>
                  {d.label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-2">
                <SortAscending size={15} className="text-zinc-500" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="bg-zinc-900 border border-white/8 rounded-lg text-xs text-zinc-300 px-3 py-2 focus:outline-none focus:border-gold-500/40 appearance-none cursor-pointer">
                  <option value="newest">{cp.sortDefault}</option>
                  <option value="price_asc">{cp.sortPriceAsc}</option>
                  <option value="price_desc">{cp.sortPriceDesc}</option>
                </select>
              </div>
              {hasFilters && (
                <button onClick={reset} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                  <X size={13} />
                  {cp.resetBtn}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-zinc-500 mb-6">
          {cp.found(filtered.length).split(':')[0]}:{' '}
          <span className="text-white font-medium">{filtered.length}</span>
          {' '}{cp.found(filtered.length).split(' ').slice(1).join(' ')}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? filtered.map((car) => (
              <CarCard key={car.id} car={car} />
            )) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 text-center">
                <div className="text-zinc-700 text-5xl mb-4">—</div>
                <div className="text-zinc-500 text-sm">{cp.emptyTitle}</div>
                <button onClick={reset} className="mt-4 text-gold-400 text-sm hover:text-gold-300 transition-colors">{cp.emptyReset}</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function CarCard({ car }: { car: Car }) {
  const { t } = useLanguage();
  const cp = t.catalogPage;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-gold-500/20 transition-all duration-300 hover:-translate-y-1 flex flex-col"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-800">
        <img src={carThumb(car, '800/450')} alt={car.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-zinc-950/70 backdrop-blur-sm text-xs font-semibold text-gold-400 border border-gold-500/20">
          {car.priceFrom}
        </div>
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-zinc-900/80 text-[10px] text-zinc-400">
          {car.category}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-white text-base mb-3 leading-tight">{car.name}</h3>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <GasPump size={13} className="text-gold-500 flex-shrink-0" />{car.engine}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Seat size={13} className="text-gold-500 flex-shrink-0" />{cp.seats(car.seats)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Lightning size={13} className="text-gold-500 flex-shrink-0" />{car.power}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Gauge size={13} className="text-gold-500 flex-shrink-0" />{car.drive}
          </div>
        </div>

        <div className="mt-auto flex gap-2 pt-2">
          <Link href={`/cars/${car.slug}`}
            className="flex-1 py-2.5 text-xs font-medium text-zinc-300 border border-white/10 rounded-xl hover:border-white/20 hover:text-white transition-all duration-200 text-center flex items-center justify-center gap-1.5">
            {cp.btnDetails}
            <ArrowUpRight size={12} weight="bold" />
          </Link>
          <Link href={`/cars/${car.slug}#booking`}
            className="flex-1 py-2.5 text-xs font-semibold bg-gold-500 text-zinc-950 rounded-xl hover:bg-gold-300 transition-all duration-200 text-center active:scale-[0.98]">
            {cp.btnRent}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
