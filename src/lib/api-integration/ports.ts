/** Contracts to agree with the owners before any production adapter is enabled.
 * No implementation is registered by this branch. Operations involving quotas,
 * single-use tokens or delivery must be atomic and durable, never in-memory.
 */
export interface GuestRegistrationInput {
  eventSlug: string;
  code: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  locale: 'it' | 'en' | 'fr' | 'nl';
}
export interface GuestJourneyPort {
  /** Check open event, digest, expiry, revocation and quota, returning no PII. */
  validateInvite(input: { eventSlug: string; code: string }): Promise<{ valid: boolean; available: boolean }>;
  /** Atomically revalidate and reserve quota, create registration and durable verification job. */
  registerAndEnqueueVerification(input: GuestRegistrationInput, idempotencyKey: string): Promise<void>;
  /** Consume one-use hashed token; leave RSVP unchanged, provide scoped continuation. */
  confirmVerification(token: string): Promise<void>;
}
export interface SecurityPort {
  /** Shared, durable and fail-closed throttling; identity must come from trusted infrastructure. */
  checkRateLimit(scope: string, trustedIdentity: string): Promise<'allow' | 'deny'>;
}
