/**
 * Night Life Event - shared type-only API/domain contracts.
 *
 * Phase 0: these definitions describe intended behavior. They are NOT an
 * authorization mechanism, database schema, token validator, or live API.
 * Consumers must validate untrusted data at server boundaries.
 */

export type ID = string;
export type ISODateTime = string;
export type IanaTimezone = string;

export const EVENT_STATUSES = ["draft", "open", "closed", "completed", "cancelled"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export const INVITE_CODE_KINDS = ["personal", "shared"] as const;
export type InviteCodeKind = (typeof INVITE_CODE_KINDS)[number];

export const EMAIL_VERIFICATION_STATUSES = ["unverified", "verified"] as const;
export type EmailVerificationStatus = (typeof EMAIL_VERIFICATION_STATUSES)[number];

export const RSVP_STATUSES = ["unanswered", "yes", "no"] as const;
export type RsvpStatus = (typeof RSVP_STATUSES)[number];

export const ADMISSION_STATUSES = ["pending", "admitted", "waitlisted", "cancelled", "rejected"] as const;
export type AdmissionStatus = (typeof ADMISSION_STATUSES)[number];

export const TICKET_STATUSES = ["absent", "issued", "queued", "emailed", "checked_in", "revoked"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const STAFF_ROLES = ["owner", "admin", "staff"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const CHECKIN_DENIAL_REASONS = [
  "already_checked_in",
  "wrong_event",
  "invalid_ticket",
  "revoked_ticket",
  "ineligible_registration",
  "event_not_open",
  "unauthorized",
  "temporarily_unavailable",
] as const;
export type CheckinDenialReason = (typeof CHECKIN_DENIAL_REASONS)[number];

export const API_ERROR_CODES = [
  "unauthenticated",
  "forbidden",
  "invalid_input",
  "not_found",
  "quota_exhausted",
  "rate_limited",
  "conflict",
  "temporarily_unavailable",
] as const;
export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export interface Event {
  id: ID;
  organizationId: ID;
  slug: string;
  title: string;
  venue: string;
  startsAt: ISODateTime;
  endsAt: ISODateTime | null;
  timezone: IanaTimezone;
  capacity: number | null;
  status: EventStatus;
}

export interface InviteCode {
  id: ID;
  organizationId: ID;
  eventId: ID;
  kind: InviteCodeKind;
  maxRedemptions: number;
  redeemedCount: number;
  expiresAt: ISODateTime | null;
  revokedAt: ISODateTime | null;
  // Raw code is an undisclosed bearer secret: deliberately omitted.
}

export interface Guest {
  id: ID;
  organizationId: ID;
  firstName: string;
  lastName: string;
  email: string;
  // This is a private server/admin shape; NEVER expose via public endpoints.
}

export interface Registration {
  id: ID;
  organizationId: ID;
  eventId: ID;
  guestId: ID;
  inviteCodeId: ID;
  emailVerification: EmailVerificationStatus;
  emailVerifiedAt: ISODateTime | null;
  rsvp: RsvpStatus;
  rsvpAt: ISODateTime | null;
  admission: AdmissionStatus;
  createdAt: ISODateTime;
}

export interface Ticket {
  id: ID;
  eventId: ID;
  registrationId: ID;
  status: TicketStatus;
  issuedAt: ISODateTime;
  emailedAt: ISODateTime | null;
  checkedInAt: ISODateTime | null;
  // Raw QR token and its stored hash are deliberately omitted.
}

export type CheckinResult =
  | { status: "accepted"; checkinId: ID; checkedInAt: ISODateTime }
  | { status: "denied"; reason: CheckinDenialReason };

export interface DashboardMetrics {
  eventId: ID;
  totalRegistrations: number;
  verifiedEmailCount: number;
  rsvpYesCount: number;
  rsvpNoCount: number;
  admittedCount: number;
  waitlistedCount: number;
  ticketsEmailedCount: number;
  checkedInCount: number;
  noShowCount: number | null; // null while event has not concluded.
}

export interface StaffSession {
  staffUserId: ID;
  role: StaffRole;
  organizationId: ID;
  assignedEventIds: ID[];
  expiresAt: ISODateTime;
  // Returned only by a protected session endpoint; server validates membership.
}

export type ApiResult<T> =
  | { ok: true; data: T; traceId?: string }
  | { ok: false; error: { code: ApiErrorCode; message: string; traceId?: string } };

export interface ValidateInviteRequest {
  eventSlug: string;
  code: string;
}
export interface ValidateInviteResponse {
  valid: boolean;
  available: boolean;
  // No code metadata or other guests' information is returned.
}

export interface RegisterRequest {
  eventSlug: string;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
}
export interface RegisterResponse {
  status: "accepted";
  next: "verify_email";
}

export interface VerifyEmailRequest {
  token: string;
}
export interface VerifyEmailResponse {
  status: "verified";
  next: "rsvp";
  // A separate guest-scoped continuation credential is delivered securely.
}

export interface RsvpRequest {
  response: "yes" | "no";
  // Guest continuation credential delivered via secure cookie or scoped token.
}
export interface RsvpResponse {
  rsvp: RsvpStatus;
  admission: AdmissionStatus;
}

export interface StaffLoginRequest {
  username: string;
  password: string;
}

export interface CheckinRequest {
  eventId: ID;
  qrToken: string;
}

export interface CreateEventRequest {
  slug: string;
  title: string;
  venue: string;
  startsAt: ISODateTime;
  endsAt: ISODateTime | null;
  timezone: IanaTimezone;
  capacity: number | null;
}

export interface CreateInviteCodesRequest {
  kind: InviteCodeKind;
  maxRedemptions: number;
  quantity: number;
  expiresAt?: ISODateTime | null;
}

export interface PageResult<T> {
  items: T[];
  nextCursor: string | null;
}

export const API_ROUTES = {
  public: {
    validateInvite: "/api/public/invite/validate",
    register: "/api/public/register",
    resendVerification: "/api/public/verification/resend",
    confirmVerification: "/api/public/verification/confirm",
    rsvp: "/api/public/rsvp",
    ticket: "/api/public/ticket",
  },
  staff: {
    login: "/api/staff/session",
    logout: "/api/staff/logout",
    session: "/api/staff/session",
    checkin: "/api/staff/checkin",
    manualCheckin: "/api/staff/manual-checkin",
  },
  admin: {
    events: "/api/admin/events",
    eventCodes: (eventId: ID) => `/api/admin/events/${encodeURIComponent(eventId)}/codes`,
    eventGuests: (eventId: ID) => `/api/admin/events/${encodeURIComponent(eventId)}/guests`,
    metrics: (eventId: ID) => `/api/admin/events/${encodeURIComponent(eventId)}/metrics`,
    export: "/api/admin/reports/export",
  },
  internal: {
    dispatchTickets: "/api/internal/dispatch-tickets",
    emailWebhook: "/api/webhooks/email",
  },
} as const;

/** A pure UI/helper predicate, not a server-side entitlement decision. */
export function isTicketEligible(registration: Pick<Registration, "emailVerification" | "rsvp" | "admission">): boolean {
  return (
    registration.emailVerification === "verified" &&
    registration.rsvp === "yes" &&
    registration.admission === "admitted"
  );
}
