'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';

const memberSeeds = ['driver-man-1', 'manager-man-2'];

export default function TeamSection() {
  const { t } = useLanguage();
  const tm = t.team;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="team" className="py-24 md:py-32 bg-zinc-950 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10" ref={ref}>
        <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-4">{tm.tag}</div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tightest text-white leading-none mb-14">
          {tm.h2Line1}<br />
          <span className="text-zinc-500">{tm.h2Line2}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tm.members.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-6 glass rounded-3xl p-7"
            >
              <div className="flex-shrink-0">
                <div className="w-20 h-24 rounded-2xl overflow-hidden bg-zinc-800">
                  <img
                    src={`https://picsum.photos/seed/${memberSeeds[i]}/200/240`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <div className="font-bold text-white text-base">{member.name}</div>
                  <div className="text-gold-500 text-xs font-semibold tracking-wide mt-0.5 mb-3">{member.role}</div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{member.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {member.traits.map((trait) => (
                    <span key={trait} className="flex items-center gap-1 text-[11px] text-zinc-500 bg-white/4 px-2.5 py-1 rounded-full">
                      <Star size={10} className="text-gold-500/60" weight="fill" />
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Service quality block */}
        <div className="mt-12 glass rounded-3xl p-8 md:p-10">
          <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-5">{tm.serviceTag}</div>
          <h3 className="text-2xl font-bold text-white mb-8">{tm.serviceH3}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tm.serviceItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white mb-1">{item.t}</div>
                  <div className="text-xs text-zinc-500 leading-relaxed">{item.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-start">
            <a href="#catalog" className="btn-primary">{tm.ctaBtn}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
