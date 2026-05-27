'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, MapTrifold, Car, Wrench, Crown, Camera } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

const icons = [Briefcase, MapTrifold, Car, Wrench, Crown, Camera];
const nums = ['01', '02', '03', '04', '05', '06'];

export default function UseCasesSection() {
  const { t } = useLanguage();
  const u = t.useCases;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="use-cases" className="py-24 md:py-32 bg-[#0d0d0f] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10" ref={ref}>
        <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">{u.tag}</div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <h2 className="text-4xl md:text-5xl font-black tracking-tightest text-white leading-none">
            {u.h2Line1}<br />
            <span className="text-zinc-500">{u.h2Line2}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden">
          {u.items.map((c, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-zinc-950 p-8 group hover:bg-zinc-900/50 transition-colors duration-300 overflow-hidden"
              >
                <div className="absolute top-5 right-5 text-4xl font-black text-zinc-900 select-none group-hover:text-zinc-800 transition-colors duration-300">
                  {nums[i]}
                </div>
                <div className="w-11 h-11 rounded-2xl bg-gold-500/8 flex items-center justify-center mb-5 group-hover:bg-gold-500/15 transition-colors duration-200">
                  <Icon size={20} className="text-gold-500" weight="fill" />
                </div>
                <h3 className="font-bold text-white text-base mb-2.5">{c.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-[280px]">{c.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
