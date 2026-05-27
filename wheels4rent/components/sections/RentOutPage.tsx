'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CarSimple,
  CurrencyCircleDollar,
  ShieldCheck,
  Wrench,
  ClipboardText,
  PhoneCall,
  FileText,
  Key,
  Check,
  PaperPlaneRight,
  TrendUp,
  Clock,
  Star,
} from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiCreateRentOut } from '@/lib/api';

const benefitIcons = [CurrencyCircleDollar, ShieldCheck, Wrench, TrendUp, Clock, Star];
const stepIcons = [PhoneCall, FileText, Key];
const stepNums = ['01', '02', '03'];

export default function RentOutPage() {
  const { t } = useLanguage();
  const ro = t.rentOut;
  const [submitted, setSubmitted] = useState(false);
  const [carType, setCarType] = useState<string>(ro.carTypes[0]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-14">
      <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">{ro.tag}</div>
      <h1 className="text-4xl md:text-6xl font-black tracking-tightest text-white leading-none mb-4">
        {ro.h1Line1}<br />
        <span className="text-zinc-500">{ro.h1Line2}</span>
      </h1>
      <p className="text-zinc-400 text-base leading-relaxed max-w-[540px] mb-16">{ro.subtitle}</p>

      {/* Benefits grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {ro.benefits.map((b, i) => {
          const Icon = benefitIcons[i];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-2xl p-6 hover:border-gold-500/20 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                <Icon size={20} className="text-gold-500" weight="fill" />
              </div>
              <div className="text-white font-semibold text-sm mb-2">{b.title}</div>
              <div className="text-zinc-500 text-sm leading-relaxed">{b.desc}</div>
            </motion.div>
          );
        })}
      </div>

      {/* How it works */}
      <div className="mb-20">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-8">{ro.howItWorksLabel}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ro.steps.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative glass rounded-2xl p-7"
              >
                <div className="absolute top-5 right-6 text-5xl font-black text-white/4 leading-none select-none">{stepNums[i]}</div>
                <div className="w-11 h-11 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-gold-500" weight="fill" />
                </div>
                <div className="text-white font-bold text-base mb-2">{s.title}</div>
                <div className="text-zinc-500 text-sm leading-relaxed">{s.desc}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Requirements + form */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 items-start">
        <div>
          {/* Requirements */}
          <div className="glass rounded-3xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <ClipboardText size={20} className="text-gold-500" weight="fill" />
              </div>
              <h2 className="text-lg font-bold text-white">{ro.requirementsTitle}</h2>
            </div>
            <ul className="space-y-3">
              {ro.requirements.map((r, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold-500/15 flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-gold-500" weight="bold" />
                  </div>
                  <span className="text-sm text-zinc-300">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Income example */}
          <div className="rounded-3xl overflow-hidden p-8"
            style={{
              background: 'linear-gradient(135deg, #1a1a1e 0%, #111113 100%)',
              border: '1px solid rgba(201,168,76,0.15)',
              boxShadow: '0 0 40px rgba(201,168,76,0.05)',
            }}
          >
            <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">{ro.incomeTag}</div>
            <div className="grid grid-cols-3 gap-4">
              {ro.incomeItems.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-2xl font-black text-white mb-1">{item.amount}</div>
                  <div className="text-xs text-zinc-500">{item.label} / мес</div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-white/5">
              <div className="flex items-center gap-2">
                <CarSimple size={14} className="text-gold-500" weight="fill" />
                <span className="text-xs text-zinc-500">{ro.incomeNote}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">{ro.formTitle}</h2>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-gold-500/15 flex items-center justify-center mx-auto mb-4">
                <CarSimple size={26} className="text-gold-500" weight="fill" />
              </div>
              <div className="text-white font-bold text-lg mb-2">{ro.successTitle}</div>
              <div className="text-zinc-400 text-sm">{ro.successText}</div>
            </motion.div>
          ) : (
            <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                await apiCreateRentOut({
                  name: fd.get('name') as string || '',
                  phone: fd.get('phone') as string || '',
                  carType,
                  model: fd.get('model') as string || '',
                  year: fd.get('year') as string || '',
                  mileage: fd.get('mileage') as string || '',
                  comment: fd.get('comment') as string || '',
                });
                setSubmitted(true);
              }} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">{ro.labelName}</label>
                <input type="text" name="name" required placeholder={ro.placeholderName}
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors" />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">{ro.labelPhone}</label>
                <input type="tel" name="phone" required placeholder="+7 000 000-00-00"
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors" />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-2">{ro.labelCarType}</label>
                <div className="grid grid-cols-2 gap-2">
                  {ro.carTypes.map((type) => (
                    <button key={type} type="button" onClick={() => setCarType(type)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all duration-200 ${
                        carType === type
                          ? 'border-gold-500/50 bg-gold-500/8 text-gold-400'
                          : 'border-white/8 text-zinc-400 hover:border-white/20 hover:text-zinc-300'
                      }`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">{ro.labelModel}</label>
                <input type="text" name="model" required placeholder={ro.placeholderModel}
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">{ro.labelYear}</label>
                  <input type="number" name="year" required placeholder={ro.placeholderYear} min={2019} max={2026}
                    className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">{ro.labelMileage}</label>
                  <input type="number" name="mileage" required placeholder={ro.placeholderMileage}
                    className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">{ro.labelComment}</label>
                <textarea name="comment" rows={3} placeholder={ro.placeholderComment}
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors resize-none" />
              </div>

              <button type="submit" className="btn-primary w-full justify-center">
                {ro.submit}
                <PaperPlaneRight size={16} weight="fill" />
              </button>

              <div className="flex items-start gap-2 pt-1">
                <Check size={13} className="text-gold-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-zinc-600">{ro.privacyNote}</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
