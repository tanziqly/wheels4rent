'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Clock, EnvelopeSimple,
  TelegramLogo, WhatsappLogo, PaperPlaneRight
} from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

const contactIcons = [Phone, EnvelopeSimple, MapPin, Clock];
const contactHrefs = ['tel:+79999207252', 'mailto:wheels4rent.ru@gmail.com', 'https://maps.yandex.ru', null];
const messengers = [
  { icon: TelegramLogo, label: 'Telegram', href: 'https://t.me/' },
  { icon: WhatsappLogo, label: 'WhatsApp', href: 'https://wa.me/' },
];

export default function ContactsPage() {
  const { t } = useLanguage();
  const c = t.contacts;
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-14">
      <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">{c.tag}</div>
      <h1 className="text-4xl md:text-6xl font-black tracking-tightest text-white leading-none mb-16">
        {c.h1Line1}<br />
        <span className="text-zinc-500">{c.h1Line2}</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 items-start">
        {/* Left */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {c.contacts.map((contact, i) => {
              const Icon = contactIcons[i];
              const href = contactHrefs[i];
              const inner = (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4 glass rounded-2xl p-5 hover:border-gold-500/20 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 transition-colors">
                    <Icon size={18} className="text-gold-500" weight="fill" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">{contact.label}</div>
                    <div className="text-sm font-medium text-white leading-snug">{contact.value}</div>
                  </div>
                </motion.div>
              );
              return href ? (
                <a key={i} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{inner}</a>
              ) : (
                <div key={i}>{inner}</div>
              );
            })}
          </div>

          {/* Messengers */}
          <div className="mb-10">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-4">{c.messengersLabel}</div>
            <div className="flex gap-3">
              {messengers.map((m) => {
                const Icon = m.icon;
                return (
                  <a key={m.label} href={m.href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2.5 px-5 py-3 glass rounded-xl hover:border-gold-500/20 transition-all duration-200 group">
                    <Icon size={18} className="text-gold-500 group-hover:scale-110 transition-transform" weight="fill" />
                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{m.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Map */}
          <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/5" style={{ height: '280px' }}>
            <img src="https://picsum.photos/seed/moscow-map-aerial/1000/500" alt="Карта" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center shadow-lg">
                <MapPin size={20} weight="fill" className="text-zinc-950" />
              </div>
              <div className="text-center">
                <div className="text-white font-semibold text-sm">{c.mapAddress}</div>
                <div className="text-zinc-400 text-xs">{c.mapStreet}</div>
              </div>
              <a href="https://maps.yandex.ru" target="_blank" rel="noreferrer"
                className="text-xs text-gold-400 hover:text-gold-300 transition-colors underline underline-offset-2">
                {c.mapLink}
              </a>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">{c.formTitle}</h2>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-gold-500/15 flex items-center justify-center mx-auto mb-4">
                <PaperPlaneRight size={24} className="text-gold-500" weight="fill" />
              </div>
              <div className="text-white font-bold text-lg mb-2">{c.successTitle}</div>
              <div className="text-zinc-400 text-sm">{c.successText}</div>
            </motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">{c.labelName}</label>
                <input type="text" required placeholder={c.placeholderName}
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">{c.labelPhone}</label>
                <input type="tel" required placeholder="+7 000 000-00-00"
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">{c.labelTopic}</label>
                <select className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-gold-500/40 transition-colors appearance-none cursor-pointer">
                  {c.topicOptions.map((opt) => <option key={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">{c.labelMessage}</label>
                <textarea rows={4} required placeholder={c.placeholderMessage}
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full justify-center">
                {c.submit}
                <PaperPlaneRight size={16} weight="fill" />
              </button>
              <p className="text-[11px] text-zinc-600 text-center">{c.replyNote}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
