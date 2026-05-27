'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, CurrencyCircleDollar, Infinity, ArrowsOut, VideoCamera, Lightning } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

const icons = [MapPin, CurrencyCircleDollar, Infinity, ArrowsOut, VideoCamera, Lightning];

export default function BenefitsSection() {
  const { t } = useLanguage();
  const b = t.benefits;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="benefits" className="py-24 md:py-32 bg-[#0d0d0f] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">{b.tag}</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tightest text-white leading-none mb-6">
              {b.h2Line1}<br />
              <span className="text-zinc-500">{b.h2Line2}</span>
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed max-w-[400px] mb-10">
              {b.subtitle}
            </p>

            <div className="relative overflow-hidden h-8 rounded-full glass">
              <div className="absolute inset-0 flex items-center">
                <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
                  {[...Array(3)].map((_, i) =>
                    b.marqueeItems.map((text, j) => (
                      <span key={`${i}-${j}`} className="text-xs text-zinc-500 font-medium inline-flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-gold-500/60 inline-block" />
                        {text}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden">
            {b.items.map((item, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-zinc-950/80 p-6 hover:bg-zinc-900/60 transition-colors duration-200 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors duration-200">
                    <Icon size={18} className="text-gold-500" weight="fill" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
