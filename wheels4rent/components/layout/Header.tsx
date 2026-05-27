'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, X, Phone, TelegramLogo, WhatsappLogo, CarSimple } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: t.header.navCatalog, href: '#catalog' },
    { label: t.header.navConditions, href: '#conditions' },
    { label: t.header.navReviews, href: '#reviews' },
  ];

  const mobileLinks = [
    { label: t.header.navCatalog, href: '#catalog' },
    { label: t.header.navConditions, href: '#conditions' },
    { label: t.header.navReviews, href: '#reviews' },
    { label: t.header.mobileDiscounts, href: '#discounts' },
    { label: t.header.mobileUseCases, href: '#use-cases' },
    { label: t.header.mobileCertificate, href: '#certificate' },
    { label: t.header.mobilePlaces, href: '#places' },
  ];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const toggleLang = () => setLang(lang === 'RU' ? 'ENG' : 'RU');

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(9,9,11,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-18 py-4">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <CarSimple size={16} weight="fill" className="text-zinc-950" />
              </div>
              <span className="font-bold text-white tracking-tight text-lg">
                Wheels<span className="text-gold-500">4</span>Rent
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 tracking-wide"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-1">
                <a href="https://t.me/" target="_blank" rel="noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-gold-400 transition-colors duration-200">
                  <TelegramLogo size={18} weight="fill" />
                </a>
                <a href="https://wa.me/" target="_blank" rel="noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-gold-400 transition-colors duration-200">
                  <WhatsappLogo size={18} weight="fill" />
                </a>
              </div>

              <a href="tel:+79999207252"
                className="flex items-center gap-1.5 text-sm text-zinc-300 hover:text-white transition-colors duration-200">
                <Phone size={14} weight="bold" />
                <span className="font-medium">+7 999 920-72-52</span>
              </a>

              <a href="/rent-out" className="btn-primary text-xs px-5 py-2.5">
                {t.header.rentOut}
              </a>

              <button
                onClick={toggleLang}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors duration-200 font-medium tracking-widest"
              >
                {lang === 'RU' ? 'ENG' : 'RU'}
              </button>
            </div>

            {/* Burger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
              aria-label="Меню"
            >
              {menuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-zinc-950 flex flex-col pt-24 px-8 pb-12"
          >
            <nav className="flex flex-col gap-2 flex-1">
              {mobileLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-2xl font-semibold text-zinc-300 hover:text-gold-400 transition-colors duration-200 py-3 border-b border-white/5"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="flex flex-col gap-4 mt-8">
              <a href="tel:+79999207252"
                className="flex items-center gap-2 text-zinc-400">
                <Phone size={16} weight="bold" className="text-gold-500" />
                <span>+7 999 920-72-52</span>
              </a>
              <div className="flex items-center gap-3">
                <a href="https://t.me/" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-gold-400 transition-colors">
                  <TelegramLogo size={20} weight="fill" />
                  <span>Telegram</span>
                </a>
                <a href="https://wa.me/" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-gold-400 transition-colors">
                  <WhatsappLogo size={20} weight="fill" />
                  <span>WhatsApp</span>
                </a>
              </div>
              <div className="flex gap-3 mt-2">
                <a href="/rent-out" className="btn-primary flex-1 justify-center">{t.header.rentOut}</a>
                <button
                  onClick={toggleLang}
                  className="px-4 py-3 border border-white/10 rounded-full text-xs font-medium text-zinc-400"
                >
                  {lang === 'RU' ? 'ENG' : 'RU'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
