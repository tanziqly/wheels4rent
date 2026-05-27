'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { IdentificationCard, Car, CalendarCheck } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

const icons = [CalendarCheck, Car, IdentificationCard];
const nums = ['01', '02', '03'];

export default function ConditionsSection() {
  const { t } = useLanguage();
  const c = t.conditions;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="conditions" className="py-24 md:py-32 bg-[#0d0d0f]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10" ref={ref}>
        <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">{c.tag}</div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <h2 className="text-4xl md:text-5xl font-black tracking-tightest text-white leading-none">
            {c.h2Line1}<br />
            <span className="text-zinc-500">{c.h2Line2}</span>
          </h2>
          <p className="text-zinc-400 text-sm max-w-[280px] leading-relaxed md:text-right">
            {c.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {c.items.map((cond, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative glass rounded-3xl p-8 overflow-hidden"
              >
                <div className="absolute top-6 right-6 text-5xl font-black text-zinc-900 select-none">{nums[i]}</div>
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-6">
                  <Icon size={22} className="text-gold-500" weight="fill" />
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{cond.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{cond.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
