'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, ArrowUpRight } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

const seeds = ['turquoise-lake-hills', 'lake-park-nature', 'art-park-sculptures', 'husky-village-snow', 'ethno-village-colorful'];

export default function PlacesSection() {
  const { t } = useLanguage();
  const p = t.places;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="places" className="py-24 md:py-32 bg-zinc-950 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10" ref={ref}>
        <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">{p.tag}</div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tightest text-white leading-none">
            {p.h2Line1}<br />
            <span className="text-zinc-500">{p.h2Line2}</span>
          </h2>
          <p className="text-zinc-400 text-sm max-w-[300px] leading-relaxed md:text-right">{p.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
          {/* Featured card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden group cursor-pointer row-span-2"
            style={{ minHeight: '420px' }}
          >
            <img
              src={`https://picsum.photos/seed/${seeds[0]}/800/900`}
              alt={p.items[0].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-1.5 text-xs text-gold-400 mb-2">
                <MapPin size={12} weight="fill" />
                {p.items[0].region} · {p.items[0].dist}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{p.items[0].title}</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">{p.items[0].desc}</p>
            </div>
            <div className="absolute top-5 right-5 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
              <ArrowUpRight size={15} className="text-white" weight="bold" />
            </div>
          </motion.div>

          {/* Right grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {p.items.slice(1).map((place, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: (i + 1) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-2xl overflow-hidden group cursor-pointer"
                style={{ minHeight: '200px' }}
              >
                <img
                  src={`https://picsum.photos/seed/${seeds[i + 1]}/600/400`}
                  alt={place.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-1 text-[10px] text-gold-400/80 mb-1.5">
                    <MapPin size={10} weight="fill" />
                    {place.region}
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">{place.title}</h3>
                  <div className="text-[11px] text-zinc-400 mt-1">{place.dist}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
