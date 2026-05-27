'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Lightning, Star } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

const stats = [
  { value: '247', key: 'statCars' as const },
  { value: '4.9', key: 'statRating' as const },
  { value: '6+', key: 'statYears' as const },
];

export default function HeroSection() {
  const { t } = useLanguage();
  const h = t.hero;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex overflow-hidden bg-zinc-950">
      {/* Left content — 55% */}
      <div className="relative z-10 flex flex-col justify-center w-full md:w-[55%] px-6 md:pl-14 lg:pl-20 pt-28 pb-16 md:pt-0">
        <motion.div style={{ y: textY }} className="flex flex-col gap-7 max-w-[580px]">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full glass text-xs font-medium text-gold-400"
          >
            <Lightning size={12} weight="fill" />
            {h.badge}
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-[5.25rem] font-black tracking-tightest leading-[0.92] text-white"
          >
            {h.h1Line1}<br />
            <span className="text-gold-500">{h.h1Line2}</span><br />
            {h.h1Line3}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-400 text-base leading-relaxed max-w-[460px]"
          >
            {h.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <a href="#catalog" className="btn-primary">
              {h.ctaPrimary}
              <ArrowRight size={16} weight="bold" />
            </a>
            <a href="#booking" className="btn-outline">
              {h.ctaSecondary}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-8 pt-2"
          >
            {stats.map((s) => (
              <div key={s.key} className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight">{s.value}</span>
                <span className="text-xs text-zinc-500 mt-0.5">{h[s.key]}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Sale badge */}
        <motion.a
          href="#discounts"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-8 left-6 md:left-14 lg:left-20 flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-medium hover:bg-gold-500/15 transition-colors duration-200"
        >
          <Star size={12} weight="fill" />
          {h.saleBadge}
          <ArrowRight size={12} weight="bold" />
        </motion.a>
      </div>

      {/* Right side — image, 45% */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[48%] overflow-hidden">
        <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1400&q=85&auto=format"
            alt="Премиальный автомобиль"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-zinc-950/40" />
        </motion.div>

        {/* Floating card */}
        <motion.div
          initial={{ opacity: 0, y: 30, x: 30 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-14 right-10 glass rounded-2xl p-5 w-52"
          style={{ animation: 'float 7s ease-in-out infinite' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
            <span className="text-xs text-zinc-400">{h.floatAvailable}</span>
          </div>
          <div className="text-white font-semibold text-sm mb-1">{h.floatCategory}</div>
          <div className="text-gold-500 font-black text-xl">{h.floatFrom}</div>
          <div className="text-zinc-500 text-xs mt-0.5">{h.floatPerDay}</div>
        </motion.div>
      </div>

      {/* Vertical text decoration */}
      <div className="hidden lg:flex absolute right-[46%] top-1/2 -translate-y-1/2 flex-col items-center gap-2 z-20">
        <div className="h-16 w-[1px] bg-gradient-to-b from-transparent to-gold-500/40" />
        <span className="text-[10px] text-zinc-600 tracking-[0.3em] uppercase font-medium"
          style={{ writingMode: 'vertical-rl' }}>
          Moscow Premium
        </span>
        <div className="h-16 w-[1px] bg-gradient-to-t from-transparent to-gold-500/40" />
      </div>
    </section>
  );
}
