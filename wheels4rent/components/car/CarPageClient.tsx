'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  GasPump, Seat, Lightning, Gauge, CarSimple, Check,
  ArrowLeft, ArrowRight, PaperPlaneRight, CalendarBlank, Phone, User,
  ArrowUpRight
} from '@phosphor-icons/react';
import { cars as staticCars, type Car } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiCreateBooking, apiGetCars } from '@/lib/api';
import { carAllImages, carThumb } from '@/lib/carImages';

export default function CarPageClient({ slug, car: serverCar, similar: serverSimilar }: { slug: string; car: Car | null; similar: Car[] }) {
  const { t } = useLanguage();
  const cp = t.carPage;

  const [car, setCar] = useState<Car | null>(serverCar);
  const [similar, setSimilar] = useState<Car[]>(serverSimilar);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [delivery, setDelivery] = useState<'yes' | 'no'>('no');

  useEffect(() => {
    if (!serverCar) {
      apiGetCars().then((adminCars: Car[]) => {
        const found = adminCars.find((c) => c.slug === slug);
        if (found) {
          setCar(found);
          const all = [...staticCars, ...adminCars];
          setSimilar(all.filter((c) => c.categorySlug === found.categorySlug && c.id !== found.id).slice(0, 3));
        } else {
          setNotFound(true);
        }
      }).catch(() => setNotFound(true));
    }
  }, [slug, serverCar]);

  if (!car && !notFound) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-gold-500/30 border-t-gold-500 animate-spin" />
      </div>
    );
  }

  if (notFound || !car) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 text-center">
        <div className="text-zinc-700 text-6xl mb-4">—</div>
        <h1 className="text-2xl font-bold text-white mb-2">Автомобиль не найден</h1>
        <p className="text-zinc-500 text-sm mb-8">Возможно, он был удалён или ссылка устарела.</p>
        <Link href="/catalog" className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors">
          <ArrowLeft size={15} />
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const allImages = carAllImages(car);

  const specs = [
    { icon: GasPump, label: cp.specLabels.engine, value: car.engine },
    { icon: Lightning, label: cp.specLabels.power, value: car.power },
    { icon: Seat, label: cp.specLabels.seats, value: `${car.seats}` },
    { icon: Gauge, label: cp.specLabels.drive, value: car.drive },
    { icon: CarSimple, label: cp.specLabels.transmission, value: car.transmission },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
        <Link href="/" className="hover:text-zinc-300 transition-colors">{cp.breadHome}</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-zinc-300 transition-colors">{cp.breadCatalog}</Link>
        <span>/</span>
        <span className="text-zinc-300">{car.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
        {/* Left */}
        <div>
          <motion.div key={activeImg} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-zinc-900 mb-4">
            <img src={allImages[activeImg]} alt={car.name}
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
            <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full glass text-xs font-medium text-gold-400">
              {car.category}
            </div>
          </motion.div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {allImages.map((src, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`relative rounded-xl overflow-hidden aspect-[4/3] flex-1 border-2 transition-all duration-200 ${
                  i === activeImg ? 'border-gold-500' : 'border-transparent opacity-60 hover:opacity-100'
                }`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Specs */}
          <div className="mt-8 glass rounded-3xl p-7">
            <h2 className="text-lg font-bold text-white mb-5">{cp.specsTitle}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Icon size={13} className="text-gold-500" />
                    {label}
                  </div>
                  <div className="text-sm font-semibold text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mt-5 glass rounded-3xl p-7">
            <h2 className="text-lg font-bold text-white mb-4">{cp.aboutTitle}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-5">{car.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {car.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                  <Check size={14} className="text-gold-500 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Similar cars */}
          {similar.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">{cp.similarTitle}</h2>
                <Link href="/catalog" className="text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1">
                  {cp.similarAll} <ArrowUpRight size={12} weight="bold" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similar.map((s) => (
                  <Link key={s.id} href={`/cars/${s.slug}`}
                    className="group block bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-gold-500/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={carThumb(s)} alt={s.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <div className="font-semibold text-white text-sm mb-1">{s.name}</div>
                      <div className="text-gold-500 text-xs font-bold">{s.priceFrom}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sticky */}
        <div className="lg:sticky lg:top-24 lg:self-start flex flex-col gap-5">
          {/* Price card */}
          <div className="glass rounded-3xl p-7">
            <div className="text-xs text-zinc-500 mb-1">{cp.priceLabel}</div>
            <div className="text-4xl font-black text-white tracking-tight mb-1">{car.priceFrom}</div>
            <div className="text-sm text-zinc-500 mb-6">{cp.pricePerDay}</div>

            <div className="space-y-2.5 mb-6">
              {cp.pricePerks.map((perk) => (
                <div key={perk} className="flex items-center gap-2 text-sm text-zinc-400">
                  <Check size={13} className="text-gold-500 flex-shrink-0" />
                  {perk}
                </div>
              ))}
            </div>

            <a href="#booking" className="btn-primary w-full justify-center">
              {cp.bookNowBtn}
              <ArrowRight size={16} weight="bold" />
            </a>
          </div>

          {/* Booking form */}
          <div id="booking" className="glass rounded-3xl p-7">
            <h3 className="font-bold text-white text-base mb-5">{cp.formTitle}</h3>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gold-500/15 flex items-center justify-center mx-auto mb-4">
                  <PaperPlaneRight size={22} className="text-gold-500" weight="fill" />
                </div>
                <div className="text-white font-semibold mb-1">{cp.successTitle}</div>
                <div className="text-zinc-400 text-sm">{cp.successText}</div>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                  {cp.successResend}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                await apiCreateBooking({
                  carName: car.name,
                  name: fd.get('name') as string || '',
                  phone: fd.get('phone') as string || '',
                  dateStart: fd.get('dateStart') as string || '',
                  dateEnd: fd.get('dateEnd') as string || '',
                  delivery,
                  comment: '',
                });
                setSubmitted(true);
              }} className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">{cp.labelCar}</label>
                  <input type="text" value={car.name} readOnly
                    className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/5 rounded-xl text-sm text-zinc-400 cursor-default" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">{cp.labelName}</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="text" name="name" required placeholder="Alexander"
                      className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">{cp.labelPhone}</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="tel" name="phone" required placeholder="+7 000 000-00-00"
                      className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">{cp.labelDateStart}</label>
                    <div className="relative">
                      <CalendarBlank size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input type="date" name="dateStart" required
                        className="w-full pl-9 pr-2 py-2.5 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500/40 transition-colors appearance-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">{cp.labelDateEnd}</label>
                    <div className="relative">
                      <CalendarBlank size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input type="date" name="dateEnd" required
                        className="w-full pl-9 pr-2 py-2.5 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500/40 transition-colors appearance-none" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {(['yes', 'no'] as const).map((val) => (
                    <button key={val} type="button" onClick={() => setDelivery(val)}
                      className={`flex-1 py-2 px-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
                        delivery === val
                          ? 'bg-gold-500/10 border-gold-500/40 text-gold-400'
                          : 'border-white/8 text-zinc-500 hover:border-white/20'
                      }`}>
                      {val === 'yes' ? cp.deliveryYes : cp.deliveryNo}
                    </button>
                  ))}
                </div>

                <button type="submit" className="btn-primary w-full justify-center">
                  {cp.submitBtn}
                  <PaperPlaneRight size={15} weight="fill" />
                </button>

                <p className="text-[11px] text-zinc-600 text-center">
                  {cp.privacyText}{' '}
                  <Link href="#" className="underline underline-offset-2 hover:text-zinc-400">{cp.privacyLink}</Link>
                </p>
              </form>
            )}
          </div>

          <a href="tel:+79999207252"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-white/10 text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-all duration-200">
            <Phone size={16} weight="fill" className="text-gold-500" />
            +7 999 920-72-52
          </a>

          <Link href="/catalog" className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            <ArrowLeft size={14} />
            {cp.backBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
