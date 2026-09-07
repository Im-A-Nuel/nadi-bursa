'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Lang = 'en' | 'id';
type LangContext = { lang: Lang; toggle: () => void; t: (en: string, id: string) => string };

const Ctx = createContext<LangContext>({ lang: 'en', toggle: () => {}, t: (en) => en });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('id');
  const toggle = () => setLang(l => l === 'en' ? 'id' : 'en');
  const t = (en: string, id: string) => (lang === 'id' ? id : en);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return <Ctx.Provider value={{ lang, toggle, t }}>{children}</Ctx.Provider>;
}

export function useLang() { return useContext(Ctx); }
