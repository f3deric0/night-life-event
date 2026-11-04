"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type FormEvent } from "react";
import { isDemoCodeValid, validateGuest, type GuestErrors, type GuestForm } from "@/lib/guest-demo/invite";

type Step = "hero" | "code" | "form" | "done";

const EMPTY: GuestForm = { firstName: "", lastName: "", birthDate: "", email: "", prefix: "+32", phone: "", demoAck: false };

export function NightclubGuestExperience() {
  const [step, setStep] = useState<Step>("hero");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  useEffect(() => {
    window.history.replaceState({ ...window.history.state, nleStep: "hero" }, "");
    const onPop = (e: PopStateEvent) => setStep((e.state?.nleStep as Step) ?? "hero");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.scrollTo({ top: 0, behavior: "auto" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const go = (s: Step, replace = false) => {
    const st = { ...window.history.state, nleStep: s };
    if (replace) window.history.replaceState(st, "");
    else window.history.pushState(st, "");
    setStep(s);
  };

  return (
    <main className="nle-lovable-port ambient shell flex flex-col">
      <header className="flex items-center justify-between">
        <Wordmark />
        <span className="eyebrow rounded-full border border-border px-3 py-1 text-[0.625rem] tracking-[0.25em]">Demo</span>
      </header>
      <div key={step} className="step-enter mx-auto flex w-full max-w-md flex-1 flex-col">
        {step === "hero" && <Hero headingRef={headingRef} onYes={() => go("code")} />}
        {step === "code" && <CodeStep headingRef={headingRef} onValid={() => go("form", true)} />}
        {step === "form" && <FormStep headingRef={headingRef} onDone={() => go("done", true)} />}
        {step === "done" && <Done headingRef={headingRef} onRestart={() => go("hero", true)} />}
      </div>
    </main>
  );
}

function Wordmark() {
  return (
    <div className="leading-none" aria-label="Night Life Event">
      <div className="font-display text-xl tracking-[0.28em] text-ivory">NIGHT&nbsp;LIFE</div>
      <div className="mt-1 text-[0.55rem] tracking-[0.6em] text-muted-foreground">EVENT</div>
    </div>
  );
}

type HP = { headingRef: React.RefObject<HTMLHeadingElement | null> };

function Hero({ headingRef, onYes }: HP & { onYes: () => void }) {
  return (
    <>
      <section className="flex flex-1 flex-col items-center justify-center py-12 text-center">
        <p className="eyebrow">Evento dimostrativo</p>
        <h1 ref={headingRef} tabIndex={-1} className="silver-text mt-6 font-display text-[clamp(3.5rem,18vw,6.5rem)] font-light leading-[0.9] tracking-[0.04em] outline-none">
          AFTER<br />DARK
        </h1>
        <p className="mt-6 text-xs tracking-[0.3em] text-muted-foreground">BRUXELLES · SABATO, ORE 23:00</p>
        <div className="my-10 h-px w-12 bg-violet/60" aria-hidden />
        <p className="font-display text-3xl font-light italic text-ivory">Una notte. Un invito.</p>
        <p className="mt-4 text-sm text-muted-foreground">Vuoi accedere a questo evento?</p>
      </section>
      <div className="pb-2">
        <button type="button" className="btn-primary" onClick={onYes}>Sì, accedi</button>
        <p className="mt-5 text-center text-[0.7rem] leading-relaxed text-muted-foreground">
          DEMO — questo invito non dà accesso a nessun evento reale.
        </p>
        <footer className="mt-6 text-center">
          <a href="/staff/login"
             className="inline-flex min-h-11 items-center px-3 text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground/80 hover:text-ivory">
            Staff Access
          </a>
        </footer>
      </div>
    </>
  );
}

function CodeStep({ headingRef, onValid }: HP & { onValid: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const id = useId();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    window.setTimeout(() => {
      if (isDemoCodeValid(code)) { setCode(""); onValid(); }
      else { setBusy(false); setError("Codice non valido. Controlla e riprova."); }
    }, 300);
  };
  return (
    <form onSubmit={submit} noValidate className="flex flex-1 flex-col justify-center py-12">
      <p className="eyebrow">After Dark · Accesso</p>
      <h1 ref={headingRef} tabIndex={-1} className="mt-4 font-display text-5xl font-light text-ivory outline-none">Il tuo codice</h1>
      <div className="mt-12">
        <label htmlFor={id} className="eyebrow block">Codice regalo</label>
        <input id={id} value={code} onChange={(e) => setCode(e.target.value)} disabled={busy}
          autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder="XXXX-XXXX-00"
          aria-invalid={!!error} aria-describedby={`${id}-err ${id}-hint`}
          className="field mt-2 text-lg tracking-[0.2em] uppercase" />
        <p id={`${id}-err`} aria-live="polite" className="mt-3 min-h-5 text-sm text-destructive">{error}</p>
      </div>
      <div className="relative mt-6 overflow-hidden rounded-full">
        <button type="submit" className="btn-primary" disabled={busy} aria-busy={busy}>{busy ? "Verifica…" : "Invia"}</button>
        {busy && <span aria-hidden className="progress-bar pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-violet" />}
      </div>
      <p id={`${id}-hint`} className="mt-6 text-center text-xs text-muted-foreground">
        Per provare la demo, usa <span className="font-semibold tracking-wider text-ivory">NOTTE-DEMO-26</span>
      </p>
    </form>
  );
}

const PREFIXES = ["+32", "+33", "+31", "+39", "+49", "+352", "+34", "+44", "+41", "+1"];

function FormStep({ headingRef, onDone }: HP & { onDone: () => void }) {
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
    if (firstKey) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }
    setF(EMPTY); // discard data — nothing is stored or sent
    onDone();
  };
  const today = new Date().toISOString().slice(0, 10);
  const errCount = Object.keys(errors).length;

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex flex-1 flex-col py-10">
      <p className="eyebrow">After Dark · Invito</p>
      <h1 ref={headingRef} tabIndex={-1} className="mt-4 font-display text-[2.6rem] font-light leading-tight text-ivory outline-none">Completa il tuo invito</h1>
      <p aria-live="polite" className="sr-only">{tried && errCount ? `${errCount} campi da correggere.` : ""}</p>

      <div className="mt-8 space-y-6">
        <Field name="firstName" label="Nome" error={errors.firstName}>
          {(p) => <input {...p} autoComplete="given-name" value={f.firstName} onChange={(e) => set("firstName", e.target.value)} />}
        </Field>
        <Field name="lastName" label="Cognome" error={errors.lastName}>
          {(p) => <input {...p} autoComplete="family-name" value={f.lastName} onChange={(e) => set("lastName", e.target.value)} />}
        </Field>
        <Field name="birthDate" label="Data di nascita" error={errors.birthDate}>
          {(p) => <input {...p} type="date" max={today} autoComplete="bday" value={f.birthDate} onChange={(e) => set("birthDate", e.target.value)} className={`${p.className} appearance-none`} />}
        </Field>
        <Field name="email" label="Indirizzo email" error={errors.email}>
          {(p) => <input {...p} type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="nome@esempio.com" value={f.email} onChange={(e) => set("email", e.target.value)} />}
        </Field>
        <Field name="phone" label="Telefono" error={errors.phone}>
          {(p) => (
            <div className="flex gap-4">
              <select aria-label="Prefisso internazionale" value={f.prefix} onChange={(e) => set("prefix", e.target.value)} className="field w-20 shrink-0 bg-background">
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
            <span>Questa è una simulazione. I dati inseriti non saranno salvati né inviati.</span>
          </label>
          <p id="demoAck-err" aria-live="polite" className="mt-1 min-h-5 text-sm text-destructive">{errors.demoAck}</p>
          <p className="mt-2 text-[0.7rem] text-muted-foreground/80">Informativa privacy da predisporre prima del lancio reale.</p>
        </div>
      </div>

      <div className="mt-10">
        <button type="submit" className="btn-primary">Continua</button>
      </div>
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
  return (
    <section className="flex flex-1 flex-col items-center justify-center py-12 text-center">
      <span className="rounded-full border border-violet/50 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-violet">
        DEMO — Nessuna email inviata
      </span>
      <h1 ref={headingRef} tabIndex={-1} className="silver-text mt-10 font-display text-5xl font-light leading-tight outline-none">Controlla la tua email</h1>
      <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Nella versione finale riceverai un&apos;email per verificare il tuo indirizzo.
      </p>
      <button type="button" onClick={onRestart} className="mt-14 inline-flex min-h-11 items-center px-4 text-xs uppercase tracking-[0.3em] text-ivory underline decoration-violet/60 underline-offset-8 hover:decoration-violet">
        Ricomincia la demo
      </button>
    </section>
  );
}