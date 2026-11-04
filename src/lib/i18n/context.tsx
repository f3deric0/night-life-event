"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, DICTIONARY, detectLocale, type Dict, type Locale } from "./dictionary";

type Ctx = { locale: Locale; t: Dict; setLocale: (l: Locale) => void };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  useEffect(() => {
    let active = true;
    // Defer browser-locale detection until after hydration to preserve SSR markup.
    queueMicrotask(() => {
      if (active) setLocale(detectLocale(navigator.languages ?? [navigator.language]));
    });
    return () => { active = false; };
  }, []);
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  return <I18nContext.Provider value={{ locale, t: DICTIONARY[locale], setLocale }}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const c = useContext(I18nContext);
  if (!c) throw new Error("useI18n must be used inside I18nProvider");
  return c;
}