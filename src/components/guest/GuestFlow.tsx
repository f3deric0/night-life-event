"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode, type FormEvent } from "react";
import { isSampleCode, SAMPLE_CODE, validateGuest, type GuestErrors, type GuestForm } from "@/lib/guest-flow/invite";
import { useI18n } from "@/lib/i18n/context";
import { LanguagePicker, Wordmark } from "./LanguagePicker";

/**
 * mode "public": no backend connected → code submission is refused with a translated notice.
 * mode "sample": design-review only; accepts SAMPLE_CODE locally, nothing is stored or sent.
 */
export type FlowMode = "public" | "sample";
type Step = "hero" | "code" | "form" | "done";
const EMPTY: GuestForm = { firstName: "", lastName: "", birthDate: "", email: "", prefix: "+32", phone: "", demoAck: false };
type HP = { headingRef: React.RefObject<HTMLHeadingElement | null> };

export function GuestFlow({ mode, initialStep = "hero" }: { mode: FlowMode; initialStep?: Step }) {
  const { t } = useI18n();
  const [step, setStep] = useState<Step>(initialStep);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  useEffect(() => {
    window.history.replaceState({ ...window.history.state, nleStep: initialStep }, "");
    const onPop = (e: PopStateEvent) => setStep((e.state?.nleStep as Step) ?? "hero");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [initialStep]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.scrollTo({ top: 0, behavior: "auto" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const go = (s: Step, replace = false) => {
    const st = { ...window.history.state, nleStep: s };
    if (replace) window.history.replaceState(st, ""); else window.history.pushState(st, "");
    setStep(s);
  };

  return (
    <main className="nle-experience ambient shell flex flex-col">
      <header className="flex items-center justify-between gap-3">
        <Wordmark />
        <LanguagePicker />
      </header>
      {mode === "sample" && (
        <p className="mx-auto mt-4 rounded-full border border-violet/50 px-3 py-1 text-center text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-violet">
          {t.common.previewOnly}
        </p>
      )}
      <div key={step} className="step-enter mx-auto flex w-full max-w-md flex-1 flex-col">
        {step === "hero" && <Hero headingRef={headingRef} onYes={() => go("code")} />}
        {step === "code" && <CodeStep mode={mode} headingRef={headingRef} onValid={() => go("form", true)} />}
        {step === "form" && mode === "sample" && <FormStep headingRef={headingRef} onDone={() => go("done", true)} />}
        {step === "done" && mode === "sample" && <Done headingRef={headingRef} onRestart={() => go("hero", true)} />}
      </div>
    </main>
  );
}

function Hero({ headingRef, onYes }: HP & { onYes: () => void }) {
  const { t } = useI18n();
  return (
    <>
      <section className="flex flex-1 flex-col items-center justify-center py-12 text-center">
        <p className="eyebrow">{t.hero.eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1} className="silver-text mt-6 font-display text-[clamp(3.5rem,18vw,6.5rem)] font-light leading-[0.9] tracking-[0.04em] outline-none">
          AFTER<br />DARK
        </h1>
        <p className="mt-6 text-xs tracking-[0.3em] text-muted-foreground">{t.hero.when}</p>
        <div className="my-10 h-px w-12 bg-violet/60" aria-hidden />
        <p className="font-display text-3xl font-light italic text-ivory">{t.hero.tagline}</p>
        <p className="mt-4 text-sm text-muted-foreground">{t.hero.question}</p>
      </section>
      <div className="pb-2">
        <button type="button" className="btn-primary" onClick={onYes}>{t.hero.cta}</button>
        <p className="mt-5 text-center text-[0.7rem] leading-relaxed text-muted-foreground">{t.hero.footnote}</p>
        <footer className="mt-6 text-center">
          <Link href="/staff/login" className="inline-flex min-h-11 items-center px-3 text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground/80 hover:text-ivory">
            {t.common.staffAccess}
          </Link>
        </footer>
      </div>
    </>
  );
}

function CodeStep({ mode, headingRef, onValid }: HP & { mode: FlowMode; onValid: () => void }) {
  const { t } = useI18n();
  const [code, setCode] = useState("");
  const [error, setError] = useState<"" | "invalid" | "notAvailable">("");
  const [busy, setBusy] = useState(false);
  const id = useId();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(""); setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      // Public site: no trusted validation endpoint yet → never accept any code.
      if (mode === "public") return setError("notAvailable");
      if (isSampleCode(code)) { setCode(""); onValid(); } else setError("invalid");
    }, 700);
  };
  return (
    <form onSubmit={submit} noValidate className="flex flex-1 flex-col justify-center py-12">
      <p className="eyebrow">{t.code.eyebrow}</p>
      <h1 ref={headingRef} tabIndex={-1} className="mt-4 font-display text-5xl font-light text-ivory outline-none">{t.code.title}</h1>
      <div className="mt-12">
        <label htmlFor={id} className="eyebrow block">{t.code.label}</label>
        <input id={id} value={code} onChange={(e) => setCode(e.target.value)} disabled={busy}
          autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder="XXXX-XXXX"
          aria-invalid={error === "invalid"} aria-describedby={`${id}-err`}
          className="field mt-2 text-lg tracking-[0.2em] uppercase" />
        <p id={`${id}-err`} role="status" aria-live="polite" className={`mt-3 min-h-5 text-sm ${error === "invalid" ? "text-destructive" : "text-violet"}`}>
          {error ? t.code[error] : ""}
        </p>
      </div>
      <div className="relative mt-6 overflow-hidden rounded-full">
        <button type="submit" className="btn-primary" disabled={busy} aria-busy={busy}>{busy ? t.code.checking : t.code.submit}</button>
        {busy && <span aria-hidden className="progress-bar pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-violet" />}
      </div>
      {mode === "sample" && <p className="mt-6 text-center text-xs text-muted-foreground">{t.code.sampleHint(SAMPLE_CODE)}</p>}
    </form>
  );
}

const PREFIXES = ["+32", "+33", "+31", "+39", "+49", "+352", "+34", "+44", "+41", "+1"];

function FormStep({ headingRef, onDone }: HP & { onDone: () => void }) {
  const { t } = useI18n();
  const [f, setF] = useState<GuestForm>(EMPTY);
  const [errors, setErrors] = useState<GuestErrors>({});
  const [tried, setTried] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const set = <K extends keyof GuestForm>(k: K, v: GuestForm[K]) => {
    const next = { ...f, [k]: v };
    setF(next);
    if (tried) setErrors(validateGuest(next));
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    const errs = validateGuest(f);
    setErrors(errs);
    const firstKey = Object.keys(errs)[0];
    if (firstKey) { formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus(); return; }
    setF(EMPTY); // preview: discard everything, nothing stored or sent
    onDone();
  };
  const today = new Date().toISOString().slice(0, 10);
  const errCount = Object.keys(errors).length;
  const msg = (k: keyof GuestForm) => (errors[k] ? t.errors[errors[k]!] : undefined);

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex flex-1 flex-col py-10">
      <p className="eyebrow">{t.form.eyebrow}</p>
      <h1 ref={headingRef} tabIndex={-1} className="mt-4 font-display text-[2.6rem] font-light leading-tight text-ivory outline-none">{t.form.title}</h1>
      <p aria-live="polite" className="sr-only">{tried && errCount ? t.form.errorCount(errCount) : ""}</p>
      <div className="mt-8 space-y-6">
        <Field name="firstName" label={t.form.firstName} error={msg("firstName")}>
          {(p) => <input {...p} autoComplete="given-name" value={f.firstName} onChange={(e) => set("firstName", e.target.value)} />}
        </Field>
        <Field name="lastName" label={t.form.lastName} error={msg("lastName")}>
          {(p) => <input {...p} autoComplete="family-name" value={f.lastName} onChange={(e) => set("lastName", e.target.value)} />}
        </Field>
        <Field name="birthDate" label={t.form.birthDate} error={msg("birthDate")}>
          {(p) => <input {...p} type="date" max={today} autoComplete="bday" value={f.birthDate} onChange={(e) => set("birthDate", e.target.value)} className={`${p.className} appearance-none`} />}
        </Field>
        <Field name="email" label={t.form.email} error={msg("email")}>
          {(p) => <input {...p} type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder={t.form.emailPlaceholder} value={f.email} onChange={(e) => set("email", e.target.value)} />}
        </Field>
        <Field name="phone" label={t.form.phone} error={msg("phone")}>
          {(p) => (
            <div className="flex gap-4">
              <select aria-label={t.form.prefix} value={f.prefix} onChange={(e) => set("prefix", e.target.value)} className="field w-20 shrink-0 bg-background">
                {PREFIXES.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
              <input {...p} type="tel" inputMode="tel" autoComplete="tel-national" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
          )}
        </Field>
        <div>
          <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-foreground">
            <input type="checkbox" name="demoAck" checked={f.demoAck} onChange={(e) => set("demoAck", e.target.checked)}
              aria-invalid={!!errors.demoAck} aria-describedby={errors.demoAck ? "demoAck-err" : undefined}
              className="mt-0.5 size-5 shrink-0 accent-violet" />
            <span>{t.form.ack}</span>
          </label>
          <p id="demoAck-err" aria-live="polite" className="mt-1 min-h-5 text-sm text-destructive">{msg("demoAck")}</p>
          <p className="mt-2 text-[0.7rem] text-muted-foreground/80">{t.form.privacy}</p>
        </div>
      </div>
      <div className="mt-10"><button type="submit" className="btn-primary">{t.form.submit}</button></div>
    </form>
  );
}

type FieldProps = { id: string; name: string; className: string; "aria-invalid": boolean; "aria-describedby"?: string | undefined; required: true };

function Field({ name, label, error, children }: { name: string; label: string; error?: string | undefined; children: (p: FieldProps) => ReactNode }) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">{label}</label>
      {children({ id, name, className: "field mt-1", "aria-invalid": !!error, "aria-describedby": error ? `${id}-err` : undefined, required: true })}
      <p id={`${id}-err`} aria-live="polite" className="mt-1 min-h-5 text-sm text-destructive">{error}</p>
    </div>
  );
}

function Done({ headingRef, onRestart }: HP & { onRestart: () => void }) {
  const { t } = useI18n();
  return (
    <section className="flex flex-1 flex-col items-center justify-center py-12 text-center">
      <span className="rounded-full border border-violet/50 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-violet">{t.done.badge}</span>
      <h1 ref={headingRef} tabIndex={-1} className="silver-text mt-10 font-display text-5xl font-light leading-tight outline-none">{t.done.title}</h1>
      <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">{t.done.body}</p>
      <ol className="mt-8 space-y-2 text-xs uppercase tracking-[0.2em]">
        <li className="text-ivory">{t.done.step1}</li>
        <li className="text-muted-foreground">{t.done.step2}</li>
      </ol>
      <button type="button" onClick={onRestart} className="mt-14 inline-flex min-h-11 items-center px-4 text-xs uppercase tracking-[0.3em] text-ivory underline decoration-violet/60 underline-offset-8 hover:decoration-violet">
        {t.done.restart}
      </button>
    </section>
  );
}