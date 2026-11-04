# 05 — Relational data model and database integrity

**System of record:** PostgreSQL in Supabase. Sheets is a report/export target, not a transactional store. Never store auth passwords, raw QR bearer secrets, or raw email-verification secrets in application tables. Use migration files and seed fake data only.

## High-level relationships
`organizations (1) -> (N) events; organizations (1) -> (N) staff_memberships; events (1) -> (N) invite_codes; guests (1) -> (N) registrations; events (1) -> (N) registrations; registrations (1) -> (N) rsvp_history; registrations (1) -> (N) tickets (max one active at a time); tickets (1) -> (N) scan_attempts (max one successful first entry); events (1) -> (N) email_jobs.`

## Proposed tables and primary columns

| Table | Essential columns and notes |
|---|---|
| `organizations` | id UUID PK, name, slug unique, default_timezone, created_at |
| `staff_profiles` | auth_user_id PK FK auth.users, login_username unique normalized, display_name, active, created_at; username-to-auth lookup private |
| `staff_memberships` | id, organization_id, auth_user_id, role enum (owner/admin/staff), active, created_at; unique(org,user) |
| `staff_event_assignments` | id, organization_id, staff_membership_id, event_id, active; unique(membership,event); admins may have org-wide access |
| `events` | id, organization_id, slug, title, venue, local_starts_at/timestamp with tz, local_ends_at, timezone IANA, capacity, status (draft/open/closed/cancelled/completed), registration_deadline, send_tickets_local_time, created_at |
| `invite_codes` | id, organization_id, event_id, code_hash/lookup fingerprint, kind (personal/shared), max_redemptions, redeemed_count, expires_at, revoked_at, promoter_label/source_label, optional bound_invitee_email_hash, created_by, created_at |
| `code_claims` | id, code_id, registration_id, status (held/consumed/released), held_until, consumed_at; controls concurrent quota and limited use |
| `guests` | id, organization_id, first_name, last_name, normalized_email (protected), optional required age info, marketing_consent fields **separate**, created_at |
| `registrations` | id, organization_id, event_id, guest_id, code_id, email_verified_at, rsvp_status (unanswered/yes/no), rsvp_at, admission_status (pending/admitted/waitlisted/rejected/cancelled), created_at, updated_at; UNIQUE(event_id, normalized_email or organization-level unique guest identity strategy) |
| `guest_verification_tokens` | id, registration_id, token_hash, expires_at, consumed_at, created_at, kind (verify/recover/guest_access), scope and attempts |
| `rsvp_history` | id, registration_id, old_status, new_status, acted_at, source/actor, metadata without PII |
| `tickets` | id, registration_id, event_id, token_hash UNIQUE, status (issued/sent/revoked/checked_in), issued_at, sent_at, revoked_at, rotation_number; at most one active ticket per registration |
| `checkins` | id, event_id, ticket_id, registration_id, staff_user_id, checked_in_at, method (qr/manual), reason nullable; **unique(ticket_id)** for successful first entry; create atomically |
| `scan_attempts` | id, event_id, ticket_id nullable, staff_user_id, attempted_at, result enum, device_id optional (no fingerprinting), reason; log successes and duplicates/errors appropriately |
| `email_jobs` | id, organization_id, event_id, registration_id, kind (verify/ticket/operational), scheduled_at, status (pending/processing/sent/failed/cancelled), idempotency_key UNIQUE, attempt_count, provider_message_id, last_error_code, created_at |
| `email_delivery_events` | id, email_job_id, provider_event_id UNIQUE, event_type (delivered/bounced/complained/etc), received_at, provider_payload_reduced; process provider webhooks with authenticity checks |
| `audit_logs` | id, organization_id, actor_user_id nullable, actor_kind, action, resource_type/id, event_id nullable, occurred_at, structured safe details |

Some of these tables can be combined for the first milestone if constraints stay correct. Model enums/check constraints consistently; don't put every mutable business state in one `status` field.

## Crucial constraints
- `events.organization_id`, `invite_codes.event_id`, `registrations.event_id`, `tickets.event_id`, etc. must match parent organization/event. Prevent cross-tenant links through composite constraints or server checks and policies.
- Email uniqueness per event: implement with a normalized-email fingerprint or normalized guest relation, taking account of a guest's multiple events and GDPR. On a collision, respond generically to avoid enumeration.
- Code quota: update/claim code with a **single server transaction** that guards `used + active_holds < max_redemptions`. Expired holds are released safely. Never read count and update in unrelated client requests.
- Active ticket: partial unique index on `tickets(registration_id)` WHERE status in active variants, or explicit active pointer guarded by transaction; retries must not issue multiple active secrets.
- First entry: `UNIQUE(checkins.ticket_id)` on successful check-in row plus a transaction that validates ticket/RVSP/admission/event and inserts checkin as one atomic action.
- Email scheduling: unique idempotency key e.g. `event_id:registration_id:ticket_rev:ticket:scheduled_version` to prevent duplicate queue entries.
- If ticket must be rotated, old token revoked in same transaction as new ticket creation.
- All records carry `created_at`; critical changes carry actor/time. Prefer UTC database timestamps with event display based on IANA timezone.

## Security and data access
- RLS enabled on tenant tables, defaults deny. Admin sees own org, staff sees assigned check-in subset; anonymous users cannot enumerate guests, codes, tickets or audit records.
- Public registration/verification/RSVP exposed through **server endpoints** that validate code/guest tokens and rate limits; never grant broad `anon` SELECT on guest data to simplify development.
- Sensitive email and date-of-birth fields should be strictly accessed and masked in exports. Limit accidental exposure in analytics dashboards.
- Keep Supabase secret/service-role keys server-side only; service role bypasses RLS and therefore requires explicit membership checks before use.

## Indexes / performance
`events(organization_id, starts_at)`; `registrations(event_id, email_verified_at)`; `registrations(event_id, rsvp_status, admission_status)`; `invite_codes(event_id, active)`; `tickets(token_hash)`; `checkins(event_id, checked_in_at)`; `email_jobs(status, scheduled_at)`; `staff_event_assignments(staff_membership_id,event_id)`.

## Exports
CSV/Excel headers: event_id, event_title, guest_name, guest_email (only authorized), registration_time, code_type, promoter/source, email_verified, rsvp, admission, ticket_sent, checked_in, checkin_time. DOB and token secrets excluded by default. Protect against CSV formula injection (escape values starting `=`, `+`, `-`, `@`); record export action in audit log.

## Migration workflow
One migration per meaningful schema change; seed synthetic test dataset (two organizations, two events per org, codes, guest states, multiple staff roles). Migrations must be rerunnable in clean staging and tested for RLS. No production data deletion without explicit approval and recovery plan.
