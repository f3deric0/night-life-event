"use client";

import Link from "next/link";
import { useState } from "react";
import { GuestFlow } from "@/components/guest/GuestFlow";
import { LanguagePicker, Wordmark } from "@/components/guest/LanguagePicker";
import { useI18n } from "@/lib/i18n/context";

export function DesignReview() {
  const { t } = useI18n();
  const [view, setView] = useState<"menu" | "public" | "sample">("menu");
  if (view !== "menu") return <GuestFlow key={view} mode={view} />;
  const item = "flex min-h-14 w-full items-center justify-between rounded-2xl border border-border bg-card/60 px-5 text-left text-sm text-ivory hover:border-violet";
  return (
    <main className="nle-experience ambient shell flex flex-col">
      <header className="flex items-center justify-between gap-3"><Wordmark /><LanguagePicker /></header>
      <div className="step-enter mx-auto w-full max-w-md py-12">
        <h1 className="font-display text-5xl font-light text-ivory">{t.review.title}</h1>
        <p className="mt-4 rounded-xl border border-violet/50 p-4 text-sm text-violet">{t.review.note}</p>
        <div className="mt-8 space-y-3">
          <button type="button" className={item} onClick={() => setView("public")}>{t.review.publicFlow}<span aria-hidden>→</span></button>
          <button type="button" className={item} onClick={() => setView("sample")}>{t.review.sampleFlow}<span aria-hidden>→</span></button>
          <Link href="/design-review/backoffice" className={item}>{t.review.backoffice}<span aria-hidden>→</span></Link>
          <Link href="/staff/login" className={item}>{t.review.staffLogin}<span aria-hidden>→</span></Link>
        </div>
      </div>
    </main>
  );
}