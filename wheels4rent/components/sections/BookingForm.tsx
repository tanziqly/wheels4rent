'use client';

import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PaperPlaneRight, CalendarBlank, User, Phone } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiCreateBooking } from '@/lib/api';

export default function BookingForm() {
  const { t } = useLanguage();
  const b = t.booking;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [delivery, setDelivery] = useState<'yes' | 'no'>('no');
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="booking" className="py-24 md:py-32 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">{b.tag}</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tightest text-white leading-none mb-6">
              {b.h2Line1}<br />
              <span className="text-zinc-500">{b.h2Line2}</span>
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed mb-10 max-w-[420px]">
              {b.subtitle}
            </p>

            <div className="space-y-5">
              {b.steps.map((step) => (
                <div key={step.n} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-gold-500">{step.n}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-0.5">{step.t}</div>
                    <div className="text-xs text-zinc-500">{step.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-3xl p-10 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-gold-500/15 flex items-center justify-center mx-auto mb-5">
                  <PaperPlaneRight size={24} className="text-gold-500" weight="fill" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{b.successTitle}</h3>
                <p className="text-zinc-400 text-sm">{b.successText}</p>
              </motion.div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                await apiCreateBooking({
                  carName: '',
                  name: fd.get('name') as string || '',
                  phone: fd.get('phone') as string || '',
                  dateStart: fd.get('dateStart') as string || '',
                  dateEnd: fd.get('dateEnd') as string || '',
                  delivery,
                  comment: fd.get('comment') as string || '',
                });
                setSubmitted(true);
              }} className="glass rounded-3xl p-8 md:p-10 space-y-5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">{b.labelName}</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="text" name="name" placeholder={b.placeholderName} required
                      className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors duration-200" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">{b.labelPhone}</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="tel" name="phone" placeholder="+7 000 000-00-00" required
                      className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors duration-200" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">{b.labelDateStart}</label>
                    <div className="relative">
                      <CalendarBlank size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input type="date" name="dateStart" required
                        className="w-full pl-10 pr-3 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500/40 transition-colors duration-200 appearance-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">{b.labelDateEnd}</label>
                    <div className="relative">
                      <CalendarBlank size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input type="date" name="dateEnd" required
                        className="w-full pl-10 pr-3 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500/40 transition-colors duration-200 appearance-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">{b.labelComment}</label>
                  <textarea name="comment" rows={3} placeholder={b.placeholderComment}
                    className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors duration-200 resize-none" />
                </div>

                <div>
                  <div className="text-xs font-medium text-zinc-400 mb-3">{b.deliveryLabel}</div>
                  <div className="flex gap-3">
                    {([['yes', b.deliveryYes], ['no', b.deliveryNo]] as const).map(([val, label]) => (
                      <button type="button" key={val} onClick={() => setDelivery(val)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium border transition-all duration-200 ${
                          delivery === val
                            ? 'bg-gold-500/10 border-gold-500/40 text-gold-400'
                            : 'border-white/8 text-zinc-500 hover:border-white/20 hover:text-zinc-300'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full justify-center">
                  {b.submit}
                  <PaperPlaneRight size={16} weight="fill" />
                </button>

                <p className="text-[11px] text-zinc-600 text-center">
                  {b.privacyText}{' '}
                  <a href="#" className="text-zinc-500 hover:text-zinc-400 underline underline-offset-2">{b.privacyLink}</a>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
