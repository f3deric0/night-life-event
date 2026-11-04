// @ts-ignore Node strip-types tests require the explicit .ts extension; Next resolves it at build time.
import { hashTicketSecret } from "../tickets/token.ts";
import type { CheckinResult } from "../contracts/index.ts";

/** The adapter must authenticate, authorize the staff member and event, rate-limit,
 * and atomically check eligibility, revocation and unique entry in the database. */
export interface AtomicCheckinGateway {
  redeem(eventId: string, tokenHash: string): Promise<CheckinResult>;
}
export async function checkin(gateway: AtomicCheckinGateway, eventId: string, token: string): Promise<CheckinResult> {
  if (!eventId || eventId.length > 128) return { status: "denied", reason: "invalid_ticket" };
  let hash: string;
  try { hash = hashTicketSecret(token); } catch { return { status: "denied", reason: "invalid_ticket" }; }
  try { return await gateway.redeem(eventId, hash); }
  catch { return { status: "denied", reason: "temporarily_unavailable" }; }
}
