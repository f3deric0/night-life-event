"use client";

import { useState, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n/context";
import { formatDate } from "@/lib/i18n/dictionary";
import { LanguagePicker, Wordmark } from "@/components/guest/LanguagePicker";
import { SAMPLE_CODES, SAMPLE_EVENTS, SAMPLE_GUESTS, SAMPLE_STAFF, SAMPLE_STATS } from "./fixtures";

// Design-only back-office. All actions are disabled/announce "unavailable"; no data is ever saved.
type Section = "overview" | "events" | "codes" | "guests" | "team";
const SECTIONS: Section[] = ["overview", "events", "codes", "guests", "team"];
const ICONS: Record<Section, string> = { overview: "◐", events: "◇", codes: "#", guests: "◎", team: "☰" };

export function BackOffice() {
  const { t, locale } = useI18n();
  const [section, setSection] = useState<Section>("overview");
  const [eventId, setEventId] = useState<string>(SAMPLE_EVENTS[0].id);
  const [dialog, setDialog] = useState(false);
  const [notice, setNotice] = useState("");
  const unavailable = () => { setNotice(""); window.setTimeout(() => setNotice(t.common.unavailable), 10); };
  const s = t.staff;

  return (
    <div className="nle-experience ambient min-h-dvh md:flex">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border p-6 md:flex">
        <Wordmark />
        <nav className="mt-10 space-y-1" aria-label="Back-office">
          {SECTIONS.map((k) => (
            <button key={k} type="button" onClick={() => setSection(k)} aria-current={section === k ? "page" : undefined}
              className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm transition-colors ${section === k ? "bg-accent text-ivory" : "text-muted-foreground hover:text-ivory"}`}>
              <span aria-hidden className="w-4 text-violet">{ICONS[k]}</span>{s.nav[k]}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 px-4 pb-28 pt-[max(env(safe-area-inset-top),1rem)] md:px-10 md:pb-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="md:hidden"><Wordmark /></div>
          <span className="rounded-full border border-violet/60 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.25em] text-violet">{s.sampleData}</span>
          <LanguagePicker />
        </header>

        <div className="mt-6 flex flex-wrap items-end gap-3">
          <label className="min-w-0 flex-1">
            <span className="eyebrow block">{s.event}</span>
            <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="field bg-background font-display text-2xl">
              {SAMPLE_EVENTS.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </label>
          <Btn onClick={unavailable}>{s.scanner}</Btn>
          <Btn onClick={unavailable}>{s.export}</Btn>
        </div>
        <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-violet">{notice}</p>

        <h1 className="mt-4 font-display text-4xl font-light text-ivory">{s.nav[section]}</h1>
        <div key={section} className="step-enter mt-6 space-y-6">
          {section === "overview" && (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {(Object.keys(SAMPLE_STATS) as (keyof typeof SAMPLE_STATS)[]).map((k) => (
                <Card key={k}><p className="eyebrow">{s.stats[k]}</p><p className="mt-3 font-display text-4xl text-ivory">{SAMPLE_STATS[k]}</p></Card>
              ))}
            </div>
          )}
          {section === "events" && (
            <>
              <Btn primary onClick={() => setDialog(true)}>+ {s.newEvent}</Btn>
              <div className="grid gap-3 md:grid-cols-2">
                {SAMPLE_EVENTS.map((e) => (
                  <Card key={e.id}>
                    <p className="font-display text-2xl text-ivory">{e.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{e.venue}</p>
                    <p className="mt-3 text-xs tracking-[0.15em] text-muted-foreground">{formatDate(new Date(e.date), locale, true)} · {s.capacity} {e.capacity}</p>
                  </Card>
                ))}
              </div>
            </>
          )}
          {section === "codes" && (
            <>
              <Card>
                <p className="eyebrow">{s.generator}</p>
                <form onSubmit={(e) => { e.preventDefault(); unavailable(); }} className="mt-4 grid gap-4 sm:grid-cols-4">
                  <label><span className="eyebrow block">{s.type}</span>
                    <select className="field bg-background"><option>{s.personal}</option><option>{s.shared}</option></select></label>
                  <label><span className="eyebrow block">{s.quota}</span><input type="number" min={1} defaultValue={1} className="field" /></label>
                  <label><span className="eyebrow block">{s.expiry}</span><input type="date" className="field" /></label>
                  <div className="flex items-end"><button type="submit" className="btn-primary !min-h-11 text-xs">{s.generate}</button></div>
                </form>
              </Card>
              <Table head={[s.code, s.type, s.uses, s.expiry, s.status]}>
                {SAMPLE_CODES.map((c) => (
                  <tr key={c.code} className="border-t border-border">
                    <Td className="font-mono tracking-wider text-ivory">{c.code}</Td>
                    <Td>{c.type === "personal" ? s.personal : s.shared}</Td><Td>{c.uses}</Td>
                    <Td>{formatDate(new Date(c.expiry), locale)}</Td>
                    <Td><Pill tone={c.status === "active" ? "on" : c.status === "used" ? "mid" : "off"}>{s.statusLabels[c.status]}</Pill></Td>
                  </tr>
                ))}
              </Table>
            </>
          )}
          {section === "guests" && (
            <Table head={[s.name, s.email, s.stats.verified, s.rsvp, s.checkin]}>
              {SAMPLE_GUESTS.map((g) => (
                <tr key={g.email} className="border-t border-border">
                  <Td className="text-ivory">{g.name}</Td><Td>{g.email}</Td>
                  <Td><Pill tone={g.verified ? "on" : "mid"}>{g.verified ? s.guestLabels.verified : s.guestLabels.pending}</Pill></Td>
                  <Td><Pill tone={g.rsvp ? "on" : "off"}>{g.rsvp ? s.guestLabels.yes : s.guestLabels.no}</Pill></Td>
                  <Td>{g.checkedIn ? s.guestLabels.in : s.guestLabels.out}</Td>
                </tr>
              ))}
            </Table>
          )}
          {section === "team" && (
            <Table head={[s.name, s.email, s.role]}>
              {SAMPLE_STAFF.map((m) => (
                <tr key={m.email} className="border-t border-border">
                  <Td className="text-ivory">{m.name}</Td><Td>{m.email}</Td><Td><Pill tone="mid">{s.roles[m.role]}</Pill></Td>
                </tr>
              ))}
            </Table>
          )}
        </div>
      </div>

      <nav aria-label="Back-office" className="fixed inset-x-0 bottom-0 flex border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {SECTIONS.map((k) => (
          <button key={k} type="button" onClick={() => setSection(k)} aria-current={section === k ? "page" : undefined}
            className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[0.6rem] tracking-wide ${section === k ? "text-ivory" : "text-muted-foreground"}`}>
            <span aria-hidden className="text-violet">{ICONS[k]}</span>{s.nav[k]}
          </button>
        ))}
      </nav>

      {dialog && (
        <div role="dialog" aria-modal="true" aria-labelledby="ne-title" className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur sm:items-center"
          onKeyDown={(e) => e.key === "Escape" && setDialog(false)}>
          <form onSubmit={(e) => { e.preventDefault(); setDialog(false); unavailable(); }}
            className="step-enter w-full max-w-md space-y-5 rounded-t-2xl border border-border bg-card p-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] sm:rounded-2xl">
            <h2 id="ne-title" className="font-display text-3xl text-ivory">{s.newEvent}</h2>
            <label className="block"><span className="eyebrow block">{s.eventName}</span><input autoFocus className="field" /></label>
            <label className="block"><span className="eyebrow block">{s.venue}</span><input className="field" /></label>
            <label className="block"><span className="eyebrow block">{s.date}</span><input type="datetime-local" className="field" /></label>
            <label className="block"><span className="eyebrow block">{s.capacity}</span><input type="number" min={1} className="field" /></label>
            <div className="flex gap-3 pt-2">
              <Btn onClick={() => setDialog(false)}>{s.cancel}</Btn>
              <button type="submit" className="btn-primary !min-h-11 flex-1 text-xs">{s.save}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card/60 p-5">{children}</div>;
}
function Btn({ children, onClick, primary }: { children: ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button type="button" onClick={onClick}
      className={`min-h-11 rounded-full px-5 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${primary ? "bg-ivory text-primary-foreground" : "border border-border text-ivory hover:border-violet"}`}>
      {children}
    </button>
  );
}
function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card/60">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <thead><tr>{head.map((h) => <th key={h} scope="col" className="eyebrow px-4 py-3 font-normal">{h}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-muted-foreground ${className}`}>{children}</td>;
}
function Pill({ children, tone }: { children: ReactNode; tone: "on" | "mid" | "off" }) {
  const c = tone === "on" ? "border-violet/60 text-violet" : tone === "mid" ? "border-ivory/30 text-ivory" : "border-border text-muted-foreground";
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.15em] ${c}`}>{children}</span>;
}