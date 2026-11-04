"use client";

import { LOCALES, DICTIONARY } from "@/lib/i18n/dictionary";
import { useI18n } from "@/lib/i18n/context";

export function LanguagePicker() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div role="group" aria-label={t.common.languageLabel} className="flex rounded-full border border-border p-0.5">
      {LOCALES.map((l) => (
        <button key={l} type="button" lang={l} aria-pressed={l === locale} aria-label={DICTIONARY[l].langName}
          onClick={() => setLocale(l)}
          className={`min-h-11 min-w-9 rounded-full px-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ${
            l === locale ? "bg-ivory text-primary-foreground" : "text-muted-foreground hover:text-ivory"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

export function Wordmark() {
  return (
    <div className="leading-none" aria-label="Night Life Event">
      <div className="font-display text-lg tracking-[0.28em] text-ivory sm:text-xl">NIGHT&nbsp;LIFE</div>
      <div className="mt-1 text-[0.55rem] tracking-[0.6em] text-muted-foreground">EVENT</div>
    </div>
  );
}