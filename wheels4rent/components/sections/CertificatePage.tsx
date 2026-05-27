'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Check, PaperPlaneRight, CarSimple, Star, Lightning } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

const benefitIcons = [CarSimple, Star, Lightning, Gift];

export default function CertificatePage() {
  const { t } = useLanguage();
  const c = t.certificate;
  const [selected, setSelected] = useState<string>(c.denominations[1].value);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-14">
      <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">{c.tag}</div>
      <h1 className="text-4xl md:text-6xl font-black tracking-tightest text-white leading-none mb-4">
        {c.h1Line1}<br />
        <span className="text-zinc-500">{c.h1Line2}</span>
      </h1>
      <p className="text-zinc-400 text-base leading-relaxed max-w-[520px] mb-16">{c.subtitle}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Visual card */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden aspect-[16/10] mb-8"
            style={{
              background: 'linear-gradient(135deg, #1a1a1e 0%, #111113 50%, #0d0d10 100%)',
              border: '1px solid rgba(201,168,76,0.2)',
              boxShadow: '0 0 60px rgba(201,168,76,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gold-500/5 blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-gold-500/3 blur-2xl -translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center">
                    <CarSimple size={15} weight="fill" className="text-zinc-950" />
                  </div>
                  <span className="font-bold text-white text-base">Wheels<span className="text-gold-500">4</span>Rent</span>
                </div>
                <span className="text-xs text-zinc-500 tracking-widest uppercase">{c.giftCardLabel}</span>
              </div>

              <div>
                <div className="text-xs text-zinc-500 mb-1 uppercase tracking-widest">{c.nominalLabel}</div>
                <div className="text-4xl font-black text-white tracking-tight">{selected}</div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-zinc-600 mb-0.5">{c.recipientLabel}</div>
                  <div className="text-sm text-zinc-300 font-medium">{c.recipientPlaceholder}</div>
                </div>
                <div className="text-xs text-zinc-700 font-mono tracking-widest">XXXX · XXXX</div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {c.benefits.map((b, i) => {
              const Icon = benefitIcons[i];
              return (
                <div key={i} className="flex items-center gap-3 glass rounded-2xl px-4 py-3">
                  <Icon size={16} className="text-gold-500 flex-shrink-0" weight="fill" />
                  <span className="text-xs text-zinc-300">{b}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order form */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">{c.formTitle}</h2>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-gold-500/15 flex items-center justify-center mx-auto mb-4">
                <Gift size={26} className="text-gold-500" weight="fill" />
              </div>
              <div className="text-white font-bold text-lg mb-2">{c.successTitle}</div>
              <div className="text-zinc-400 text-sm">{c.successText}</div>
            </motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
              <div>
                <label className="block text-xs text-zinc-400 mb-3">{c.selectDenomination}</label>
                <div className="grid grid-cols-2 gap-2">
                  {c.denominations.map((d) => (
                    <button key={d.value} type="button" onClick={() => setSelected(d.value)}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                        selected === d.value ? 'border-gold-500/50 bg-gold-500/8' : 'border-white/8 hover:border-white/20'
                      }`}>
                      <div className={`text-sm font-bold mb-0.5 ${selected === d.value ? 'text-gold-400' : 'text-white'}`}>{d.value}</div>
                      <div className="text-xs text-zinc-500">{d.desc}</div>
                    </button>
                  ))}
                </div>
                {selected === c.denominations[3].value && (
                  <input type="number" placeholder={c.customAmountPlaceholder} min={1000}
                    className="mt-3 w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors" />
                )}
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">{c.labelSenderName}</label>
                <input type="text" required placeholder={c.placeholderSender}
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors" />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">{c.labelRecipientName}</label>
                <input type="text" required placeholder={c.placeholderRecipient}
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors" />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">{c.labelPhone}</label>
                <input type="tel" required placeholder="+7 000 000-00-00"
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors" />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-3">{c.labelFormat}</label>
                <div className="flex gap-2">
                  {c.formats.map((fmt) => (
                    <label key={fmt} className="flex-1 flex items-center gap-2 p-3 rounded-xl border border-white/8 cursor-pointer hover:border-white/20 transition-colors">
                      <input type="radio" name="format" className="accent-yellow-400" defaultChecked={fmt === c.formats[0]} />
                      <span className="text-xs text-zinc-300">{fmt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">{c.labelWish}</label>
                <textarea rows={2} placeholder={c.placeholderWish}
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors resize-none" />
              </div>

              <button type="submit" className="btn-primary w-full justify-center">
                {c.submit}
                <PaperPlaneRight size={16} weight="fill" />
              </button>

              <div className="flex items-start gap-2 pt-1">
                <Check size={13} className="text-gold-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-zinc-600">{c.paymentNote}</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
