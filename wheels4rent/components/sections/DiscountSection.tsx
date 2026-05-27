'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Gift, UserPlus, Cake } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

const tierColors = [
  'from-zinc-700 to-zinc-600',
  'from-zinc-600 to-zinc-500',
  'from-zinc-400 to-zinc-300',
  'from-gold-600 to-gold-400',
  'from-gold-400 to-gold-300',
];

const specialIcons = [UserPlus, Cake];

export default function DiscountSection() {
  const { t } = useLanguage();
  const d = t.discounts;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="discounts" className="py-24 md:py-32 bg-[#0d0d0f] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/3 blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10" ref={ref}>
        <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">{d.tag}</div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <h2 className="text-4xl md:text-5xl font-black tracking-tightest text-white leading-none">
            {d.h2Line1}<br />
            <span className="text-zinc-500">{d.h2Line2}</span>
          </h2>
          <p className="text-zinc-400 text-sm max-w-[300px] md:text-right leading-relaxed">
            {d.subtitle}
          </p>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-white/5 rounded-2xl overflow-hidden mb-10">
          {d.tiers.map((tier, i) => (
            <motion.div
              key={tier.level}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-zinc-950 p-6 group hover:bg-zinc-900/60 transition-colors duration-200"
            >
              <div className={`h-0.5 w-10 rounded-full bg-gradient-to-r ${tierColors[i]} mb-5`} />
              <div className="text-2xl font-black text-white mb-1">{tier.pct}</div>
              <div className="text-sm font-bold text-zinc-300 mb-2">{tier.level}</div>
              <div className="text-xs text-zinc-600 leading-relaxed">{tier.desc}</div>
              <div className="absolute top-4 right-4 text-[10px] text-zinc-700 font-mono">0{i + 1}</div>
            </motion.div>
          ))}
        </div>

        {/* Specials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {d.specials.map((s, i) => {
            const Icon = specialIcons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.45 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-5 glass rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-gold-500" weight="fill" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-white text-base">{s.title}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-400 text-xs font-bold">−{s.pct}</span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 flex items-center gap-4"
        >
          <Gift size={18} className="text-gold-500" weight="fill" />
          <span className="text-sm text-zinc-400">
            {d.giftCta}{' '}
            <a href="/certificate" className="text-gold-400 hover:text-gold-300 underline underline-offset-2 transition-colors">
              {d.giftCtaLink}
            </a>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
