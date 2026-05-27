'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, type Lang, type Translations } from '@/lib/i18n';

const LS_KEY = 'w4r_lang';

function getSavedLang(): Lang {
  if (typeof window === 'undefined') return 'RU';
  const v = localStorage.getItem(LS_KEY);
  return v === 'ENG' ? 'ENG' : 'RU';
}

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'RU',
  setLang: () => {},
  t: translations.RU,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('RU');

  useEffect(() => {
    setLangState(getSavedLang());
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(LS_KEY, l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
