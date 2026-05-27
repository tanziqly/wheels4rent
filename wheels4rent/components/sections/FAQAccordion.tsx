'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/6 last:border-0">
      <button onClick={onToggle} className="w-full flex items-start justify-between gap-4 py-5 text-left group">
        <span className={`text-sm font-semibold leading-relaxed transition-colors duration-200 ${isOpen ? 'text-gold-400' : 'text-white group-hover:text-zinc-200'}`}>
          {q}
        </span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 mt-0.5 ${
          isOpen ? 'bg-gold-500/15 text-gold-400' : 'bg-white/5 text-zinc-500 group-hover:bg-white/10'
        }`}>
          {isOpen ? <Minus size={12} weight="bold" /> : <Plus size={12} weight="bold" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm text-zinc-400 leading-relaxed max-w-[680px]">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQAccordion() {
  const { t } = useLanguage();
  const f = t.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 bg-zinc-950">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-16 items-start">
          <div>
            <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">{f.tag}</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tightest text-white leading-none mb-6">
              {f.h2Line1}<br />{f.h2Line2}<br />
              <span className="text-zinc-500">{f.h2Line3}</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{f.subtitle}</p>
            <div className="mt-8">
              <a href="#booking" className="btn-outline text-sm">{f.cta}</a>
            </div>
          </div>

          <div className="glass rounded-3xl px-8 py-4">
            {f.items.map((faq, i) => (
              <FAQItem
                key={`${i}-${f.tag}`}
                q={faq.q}
                a={faq.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
