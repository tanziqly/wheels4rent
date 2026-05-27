'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Tag, Clock, Car, UserPlus, Cake, Lightning } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

const icons = [Lightning, UserPlus, Cake, Clock, Car, Tag];
const hrefs = ['/catalog', '#booking', '#booking', '#discounts', '/catalog', '#booking'];

export default function SalePromos() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-16 md:py-24 bg-zinc-950">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10" ref={ref}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.salePromos.items.map((promo, i) => {
            const Icon = icons[i];
            const accent = i === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col glass rounded-3xl p-7 overflow-hidden ${accent ? 'border-gold-500/30' : ''}`}
              >
                {accent && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none" />
                )}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-gold-500/10 flex items-center justify-center">
                    <Icon size={20} className="text-gold-500" weight="fill" />
                  </div>
                  <span className="text-[11px] font-semibold text-gold-500 bg-gold-500/10 px-2.5 py-1 rounded-full">
                    {promo.badge}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base mb-1">{promo.title}</h3>
                <div className="text-xs text-gold-400 mb-3">{promo.subtitle}</div>
                <p className="text-sm text-zinc-400 leading-relaxed flex-1">{promo.desc}</p>
                <a
                  href={hrefs[i]}
                  className={`mt-5 inline-flex items-center text-sm font-medium transition-colors duration-200 ${
                    accent ? 'text-gold-400 hover:text-gold-300' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {promo.cta} →
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
