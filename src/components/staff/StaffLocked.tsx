"use client";

import Link from "next/link";
import { LanguagePicker, Wordmark } from "@/components/guest/LanguagePicker";
import { useI18n } from "@/lib/i18n/context";

// No auth backend connected → never render a dashboard here.
export function StaffLocked() {
  const { t } = useI18n();
  return (
    <main className="nle-experience ambient shell flex flex-col">
      <header className="flex items-center justify-between gap-3"><Wordmark /><LanguagePicker /></header>
      <section className="step-enter mx-auto flex max-w-sm flex-1 flex-col items-center justify-center text-center">
        <h1 className="font-display text-5xl font-light text-ivory">{t.staff.lockedTitle}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{t.staff.lockedBody}</p>
        <Link href="/staff/login" className="btn-primary mt-10">{t.staff.goLogin}</Link>
      </section>
    </main>
  );
}