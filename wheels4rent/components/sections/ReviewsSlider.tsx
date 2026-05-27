'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

const seeds = ['man-business-1', 'woman-elegant-2', 'man-casual-3', 'man-executive-4', 'woman-professional-5', 'man-young-6'];

export default function ReviewsSlider() {
  const { t } = useLanguage();
  const r = t.reviews;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const prev = () => { setDirection(-1); setCurrent((c) => (c === 0 ? r.items.length - 1 : c - 1)); };
  const next = () => { setDirection(1); setCurrent((c) => (c === r.items.length - 1 ? 0 : c + 1)); };

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r.items.length]);

  const review = r.items[current];

  return (
    <section id="reviews" className="py-24 md:py-32 bg-zinc-950 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">{r.tag}</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tightest text-white leading-none">
              {r.h2}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={prev} className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/25 transition-all duration-200 active:scale-95">
              <ArrowLeft size={17} weight="bold" />
            </button>
            <button onClick={next} className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/25 transition-all duration-200 active:scale-95">
              <ArrowRight size={17} weight="bold" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[220px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${current}-${r.tag}`}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 60 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-3xl p-8 md:p-12"
            >
              <div className="relative mb-6">
                <span className="absolute -top-2 -left-1 text-gold-500/25 text-6xl font-black leading-none select-none">&ldquo;</span>
                <p className="text-zinc-200 text-lg leading-relaxed font-medium pt-6">{review.text}</p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-white/8">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                  <img
                    src={`https://picsum.photos/seed/${seeds[current]}/200/200`}
                    alt={review.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white text-sm">{review.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{r.clientLabel}</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} weight="fill" className="text-gold-500" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2 mt-7">
          {r.items.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-1.5 bg-gold-500' : 'w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
