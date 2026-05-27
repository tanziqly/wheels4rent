'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PaperPlaneRight, FileText, Key, CheckCircle } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

const icons = [PaperPlaneRight, FileText, Key, CheckCircle];
const nums = ['01', '02', '03', '04'];

export default function HowItWorks() {
  const { t } = useLanguage();
  const hw = t.howItWorks;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[#0d0d0f] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10" ref={ref}>
        <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">{hw.tag}</div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tightest text-white leading-none mb-16">
          {hw.h2Line1}<br />
          <span className="text-zinc-500">{hw.h2Line2}</span>
        </h2>

        <div className="relative">
          <div className="hidden md:block absolute top-10 left-[calc(12.5%)] right-[calc(12.5%)] h-[1px] bg-gradient-to-r from-gold-500/20 via-gold-500/40 to-gold-500/20" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {hw.steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 28 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full glass flex items-center justify-center border border-gold-500/20">
                      <Icon size={26} className="text-gold-500" weight="fill" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center">
                      <span className="text-[9px] font-black text-zinc-950">{nums[i]}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
