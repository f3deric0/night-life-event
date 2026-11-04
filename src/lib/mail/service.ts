import type { AdmissionStatus, EmailVerificationStatus, EventStatus, RsvpStatus } from "../contracts/index.ts";
// @ts-ignore Node strip-types tests require the explicit .ts extension; Next resolves it at build time.
import { shouldDispatch } from "./schedule.ts";

export type TicketEligibility = { emailVerification: EmailVerificationStatus; rsvp: RsvpStatus; admission: AdmissionStatus; eventStatus: EventStatus; ticketStatus: "issued" | "queued" | "emailed" | "checked_in" | "revoked"; startsAt: string; timezone: string };
export function canSendTicket(s: TicketEligibility, now: Date): boolean {
  return s.emailVerification === "verified" && s.rsvp === "yes" && s.admission === "admitted" && s.eventStatus === "open" && (s.ticketStatus === "issued" || s.ticketStatus === "queued") && shouldDispatch(now, s.startsAt, s.timezone);
}

export interface Message { to: string; subject: string; text: string; idempotencyKey: string }
export interface MailProvider { send(message: Message): Promise<{ providerId: string }> }
// Development/test adapter only. It never sends externally.
export class MockMailProvider implements MailProvider {
  readonly sent: Message[] = [];
  private readonly ids = new Map<string, string>();
  async send(message: Message): Promise<{ providerId: string }> {
    const old = this.ids.get(message.idempotencyKey);
    if (old) return { providerId: old };
    const providerId = `mock-${this.ids.size + 1}`;
    this.ids.set(message.idempotencyKey, providerId);
    this.sent.push(message);
    return { providerId };
  }
}
/** Agent 1 must implement this with durable leases, transaction-time eligibility,
 * unique purpose/registration/version keys and provider timeout reconciliation. */
export interface DurableOutbox {
  enqueueUnique(input: { purpose: "verification" | "ticket"; registrationId: string; version: number; scheduledAt: Date }): Promise<"queued" | "duplicate">;
  cancelPending(registrationId: string): Promise<void>;
}
export function verificationMessage(to: string, eventTitle: string, verificationUrl: string, expiresAt: Date, idempotencyKey: string): Message {
  const url = new URL(verificationUrl);
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("Verification URL must use HTTPS");
  if (!Number.isFinite(expiresAt.getTime())) throw new Error("Invalid expiry");
  return { to, idempotencyKey, subject: `Verifica il tuo indirizzo email — ${eventTitle}`, text: `Verifica il tuo indirizzo: ${url.href}\nIl link scade il ${expiresAt.toISOString()}. Dopo la verifica potrai scegliere separatamente se partecipare.` };
}
