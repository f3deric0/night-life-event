"use client";

import { useState, type FormEvent } from "react";
import { staffLogin } from "@/lib/ui-client/api";
import { useI18n } from "@/lib/i18n/context";
import { LanguagePicker, Wordmark } from "@/components/guest/LanguagePicker";

// Visual only: no auth backend is connected, so submission always reports "unavailable".
export function StaffLogin() {
  const { t } = useI18n();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<{ u?: boolean; p?: boolean }>({});
  const [notice, setNotice] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next = { u: !u.trim(), p: !p };
    setErr(next);
    setNotice(false);
    if (next.u) return document.getElementById("s-user")?.focus();
    if (next.p) return document.getElementById("s-pass")?.focus();
    setPending(true);
    try {
      const result = await staffLogin({ username: u.trim(), password: p });
      setP(""); // never persist credentials after an attempt
      if (!result.ok) { setNotice(true); return; }
      window.location.assign(result.data.role === "staff" ? "/staff/scanner" : "/admin");
    } catch {
      setP("");
      setNotice(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="nle-experience ambient shell flex flex-col">
      <header className="flex items-center justify-between gap-3"><Wordmark /><LanguagePicker /></header>
      <form onSubmit={submit} noValidate className="step-enter mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
        <p className="eyebrow">{t.staff.loginEyebrow}</p>
        <h1 className="mt-4 font-display text-5xl font-light text-ivory">{t.staff.loginTitle}</h1>
        <div className="mt-10 space-y-6 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
          <div>
            <label htmlFor="s-user" className="eyebrow block">{t.staff.username}</label>
            <input id="s-user" value={u} onChange={(e) => setU(e.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false}
              aria-invalid={!!err.u} aria-describedby={err.u ? "s-user-err" : undefined} className="field mt-1" />
            <p id="s-user-err" aria-live="polite" className="mt-1 min-h-5 text-sm text-destructive">{err.u ? t.staff.usernameRequired : ""}</p>
          </div>
          <div>
            <label htmlFor="s-pass" className="eyebrow block">{t.staff.password}</label>
            <div className="relative">
              <input id="s-pass" type={show ? "text" : "password"} value={p} onChange={(e) => setP(e.target.value)} autoComplete="current-password"
                aria-invalid={!!err.p} aria-describedby={err.p ? "s-pass-err" : undefined} className="field mt-1 pr-14" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-pressed={show} aria-label={show ? t.staff.hide : t.staff.show}
                className="absolute right-0 top-1 flex min-h-11 min-w-11 items-center justify-center text-muted-foreground hover:text-ivory">
                <EyeIcon off={show} />
              </button>
            </div>
            <p id="s-pass-err" aria-live="polite" className="mt-1 min-h-5 text-sm text-destructive">{err.p ? t.staff.passwordRequired : ""}</p>
          </div>
          <button type="submit" disabled={pending} className="btn-primary">{pending ? "…" : t.staff.signIn}</button>
          <p role="status" aria-live="polite" className="min-h-5 text-center text-sm text-violet">{notice ? t.staff.loginUnavailable : ""}</p>
        </div>
      </form>
    </main>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />
      {off && <path d="M3 3l18 18" />}
    </svg>
  );
}