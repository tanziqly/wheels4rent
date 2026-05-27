'use client';

import { CarSimple, TelegramLogo, WhatsappLogo, EnvelopeSimple, MapPin, Clock } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FooterClient() {
  const { t } = useLanguage();
  const fl = t.footer.links;

  const footerLinks = [
    { label: fl.catalog, href: '#catalog' },
    { label: fl.conditions, href: '#conditions' },
    { label: fl.reviews, href: '#reviews' },
    { label: fl.discounts, href: '#discounts' },
    { label: fl.useCases, href: '#use-cases' },
    { label: fl.certificate, href: '/certificate' },
    { label: fl.places, href: '#places' },
    { label: fl.rentOut, href: '/rent-out' },
    { label: fl.privacy, href: '#' },
  ];

  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center">
                <CarSimple size={16} weight="fill" className="text-zinc-950" />
              </div>
              <span className="font-bold text-white tracking-tight text-lg">
                Wheels<span className="text-gold-500">4</span>Rent
              </span>
            </a>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-[220px]">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="https://t.me/" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-gold-400 hover:border-gold-500/30 transition-all duration-200">
                <TelegramLogo size={16} weight="fill" />
              </a>
              <a href="https://wa.me/" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-gold-400 hover:border-gold-500/30 transition-all duration-200">
                <WhatsappLogo size={16} weight="fill" />
              </a>
              <a href="mailto:wheels4rent.ru@gmail.com"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-gold-400 hover:border-gold-500/30 transition-all duration-200">
                <EnvelopeSimple size={16} weight="fill" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-1">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-5">{t.footer.navTitle}</h4>
            <ul className="space-y-3">
              {footerLinks.slice(0, 5).map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-zinc-400 hover:text-gold-400 transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-5">{t.footer.sectionsTitle}</h4>
            <ul className="space-y-3">
              {footerLinks.slice(5).map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-zinc-400 hover:text-gold-400 transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div className="lg:col-span-1">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-5">{t.footer.contactsTitle}</h4>
            <div className="space-y-4">
              <a href="tel:+79999207252"
                className="flex items-start gap-3 text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                <span className="font-medium text-white">+7 999 920-72-52</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-zinc-400 leading-relaxed">
                  Comcity B1, Киевское шоссе, 22-й км, 6А стр. 1, Москва
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={15} className="text-gold-500 flex-shrink-0" />
                <span className="text-sm text-zinc-400">{t.contacts.contacts[3].value}</span>
              </div>
              <a href="mailto:wheels4rent.ru@gmail.com"
                className="flex items-center gap-3 text-sm text-zinc-400 hover:text-gold-400 transition-colors duration-200">
                <EnvelopeSimple size={15} className="text-gold-500 flex-shrink-0" />
                wheels4rent.ru@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Wheels4Rent. {t.footer.copyright}
          </p>
          <p className="text-xs text-zinc-700">
            {t.footer.madeBy}{' '}
            <span className="text-zinc-500 hover:text-zinc-400 transition-colors cursor-default">{t.footer.madeByStudio}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
