import type { AdmissionStatus, DashboardMetrics, EmailVerificationStatus, Event, InviteCodeKind, RsvpStatus, TicketStatus } from '../contracts/index.ts';

/** A server-supplied, token-free projection. IDs are internal, not invite secrets. */
export interface ReportingCode { id: string; eventId: string; kind: InviteCodeKind; createdAt: string; promoterId: string | null }
export interface ReportingRegistration {
  id: string; eventId: string; codeId: string; createdAt: string;
  emailVerification: EmailVerificationStatus; rsvp: RsvpStatus; admission: AdmissionStatus;
  ticketStatus: TicketStatus; ticketSent: boolean; checkedInAt: string | null;
}
export interface Dataset { event: Event; codes: ReportingCode[]; registrations: ReportingRegistration[] }
export interface Filter { codeId?: string; kind?: InviteCodeKind; promoterId?: string; from?: string; to?: string }
export interface Metrics {
  codesCreated: number; registrationsStarted: null; registrations: number; verified: number;
  yes: number; no: number; unanswered: number; admitted: number; waitlisted: number;
  ticketsIssued: number; ticketsEmailed: number; checkedIn: number; noShows: number | null;
  verificationRate: number | null; yesRate: number | null; responseRate: number | null;
  arrivalRate: number | null; noShowRate: number | null;
}
const rate = (n: number, d: number): number | null => d === 0 ? null : n / d;
function instant(value: string): number {
  if (!/(?:Z|[+-]\d\d:\d\d)$/i.test(value)) throw new Error('Timestamp must include an offset');
  const n = Date.parse(value); if (!Number.isFinite(n)) throw new Error('Invalid timestamp'); return n;
}
function bounds(f: Filter): [number, number] {
  const from = f.from ? instant(f.from) : -Infinity, to = f.to ? instant(f.to) : Infinity;
  if (from >= to) throw new Error('Invalid date range'); return [from, to];
}
/** Date range is [from,to); codes use creation time, registrations use submission time. */
export function select(data: Dataset, f: Filter = {}): Dataset {
  const [from, to] = bounds(f);
  const codes = data.codes.filter(c => c.eventId === data.event.id && (!f.codeId || c.id === f.codeId) && (!f.kind || c.kind === f.kind) && (!f.promoterId || c.promoterId === f.promoterId));
  const ids = new Set(codes.map(c => c.id));
  const inRange = (s: string) => { const t = instant(s); return t >= from && t < to; };
  return { event: data.event, codes: codes.filter(c => inRange(c.createdAt)), registrations: data.registrations.filter(r => r.eventId === data.event.id && ids.has(r.codeId) && inRange(r.createdAt)) };
}
export function calculate(data: Dataset, now: string, f: Filter = {}): Metrics {
  const d = select(data, f); const rows = d.registrations;
  if (new Set(rows.map(r => r.id)).size !== rows.length || new Set(d.codes.map(c => c.id)).size !== d.codes.length) throw new Error('Duplicate reporting IDs');
  const verified = rows.filter(r => r.emailVerification === 'verified');
  const yes = verified.filter(r => r.rsvp === 'yes'); const no = verified.filter(r => r.rsvp === 'no');
  const admitted = yes.filter(r => r.admission === 'admitted');
  const checked = rows.filter(r => r.checkedInAt !== null);
  const eligibleChecked = admitted.filter(r => r.checkedInAt !== null);
  const ended = data.event.status === 'completed' && data.event.endsAt !== null && instant(now) >= instant(data.event.endsAt);
  const noShows = ended ? admitted.length - eligibleChecked.length : null;
  return {
    codesCreated: d.codes.length, registrationsStarted: null, registrations: rows.length, verified: verified.length,
    yes: yes.length, no: no.length, unanswered: verified.filter(r => r.rsvp === 'unanswered').length,
    admitted: admitted.length, waitlisted: yes.filter(r => r.admission === 'waitlisted').length,
    ticketsIssued: rows.filter(r => !['absent', 'revoked'].includes(r.ticketStatus)).length,
    ticketsEmailed: rows.filter(r => r.ticketSent && !['absent', 'revoked'].includes(r.ticketStatus)).length,
    checkedIn: checked.length, noShows,
    verificationRate: rate(verified.length, rows.length), yesRate: rate(yes.length, verified.length),
    responseRate: rate(yes.length + no.length, verified.length), arrivalRate: rate(eligibleChecked.length, admitted.length),
    noShowRate: noShows === null ? null : rate(noShows, admitted.length),
  };
}
export function dashboardMetrics(eventId: string, m: Metrics): DashboardMetrics {
  return { eventId, totalRegistrations: m.registrations, verifiedEmailCount: m.verified, rsvpYesCount: m.yes,
    rsvpNoCount: m.no, admittedCount: m.admitted, waitlistedCount: m.waitlisted, ticketsEmailedCount: m.ticketsEmailed,
    checkedInCount: m.checkedIn, noShowCount: m.noShows };
}
/** Local calendar days, not 24-hour UTC intervals, so DST is handled by Intl. */
export function dailySeries(data: Dataset, metric: 'registrations' | 'checkins', f: Filter = {}): { date: string; count: number }[] {
  const selected = select(data, f); const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: data.event.timezone, year: 'numeric', month: '2-digit', day: '2-digit' });
  const counts = new Map<string, number>();
  for (const r of selected.registrations) {
    const timestamp = metric === 'registrations' ? r.createdAt : r.checkedInAt;
    if (timestamp === null) continue;
    const parts = formatter.formatToParts(new Date(instant(timestamp))); const part = (name: string) => parts.find(p => p.type === name)?.value;
    const day = `${part('year')}-${part('month')}-${part('day')}`; counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  return [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count }));
}
export function byCode(data: Dataset, now: string, f: Filter = {}) {
  return data.codes.filter(c => c.eventId === data.event.id && (!f.codeId || c.id === f.codeId) && (!f.kind || c.kind === f.kind) && (!f.promoterId || c.promoterId === f.promoterId)).map(c => ({ codeId: c.id, kind: c.kind, metrics: calculate(data, now, { ...f, codeId: c.id }) }));
}
/** Null attribution is never treated as an identified promoter. */
export function byPromoter(data: Dataset, now: string, f: Filter = {}) {
  const ids = [...new Set(data.codes.filter(c => c.eventId === data.event.id && c.promoterId !== null).map(c => c.promoterId as string))];
  return ids.filter(id => !f.promoterId || id === f.promoterId).map(promoterId => ({ promoterId, metrics: calculate(data, now, { ...f, promoterId }) }));
}

/** Explicit allowlist prevents accidental token/PII export. Authorization must occur server-side first. */
export type ExportColumn = 'registrationId' | 'eventId' | 'codeId' | 'createdAt' | 'emailVerification' | 'rsvp' | 'admission' | 'ticketStatus' | 'checkedInAt';
const allowed: readonly ExportColumn[] = ['registrationId', 'eventId', 'codeId', 'createdAt', 'emailVerification', 'rsvp', 'admission', 'ticketStatus', 'checkedInAt'];
function cell(value: unknown): string {
  let s = String(value ?? '');
  // Leading control characters and whitespace can hide formula prefixes in spreadsheets.
  if (/^[\u0000-\u0020\u007f\u00a0]*[=+@\-\t\r\n]/u.test(s) || /^[\t\r\n]/u.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}
export function exportCsv(data: Dataset, columns: readonly ExportColumn[], filter: Filter = {}): string {
  if (!columns.length || columns.some(c => !allowed.includes(c)) || new Set(columns).size !== columns.length) throw new Error('Invalid export columns');
  const rows = select(data, filter).registrations.map(r => ({ registrationId: r.id, eventId: r.eventId, codeId: r.codeId, createdAt: r.createdAt, emailVerification: r.emailVerification, rsvp: r.rsvp, admission: r.admission, ticketStatus: r.ticketStatus, checkedInAt: r.checkedInAt }));
  return '\ufeff' + [columns.map(cell).join(','), ...rows.map(r => columns.map(c => cell(r[c])).join(','))].join('\r\n') + '\r\n';
}
