# 24 — Shared API and domain contract freeze, bootstrap v0

**Status:** proposed V0 typed contract; implementation NOT LIVE.
**Owner:** Agent 1 (Backend & Security). Downstream agents must not independently invent endpoints or change these shared types.

## Source of truth
`src/lib/contracts/index.ts` contains shared domain enums, serializable interfaces, request/response payloads and canonical route strings. This document explains the constraints rather than duplicating type definitions.

## Contract dimensions
- Event status: `draft | open | closed | completed | cancelled`.
- Email ownership: `unverified | verified` (independent from RSVP).
- RSVP: `unanswered | yes | no` (only verified guests can change this in actual backend).
- Admission: `pending | admitted | waitlisted | cancelled | rejected`.
- Ticket: `absent | issued | queued | emailed | checked_in | revoked`.
- Roles: `owner | admin | staff`; all protected endpoints verify role, organization and event assignment on the server.
- Invite codes: `personal | shared`, with transactional quota and revocation. Invite codes **are not tickets**.
- Check-in: discriminated result `accepted | denied`, stable denial reasons. It must be decided atomically by a database transaction, never the client or shared helper.

## Planned HTTP endpoints (not implemented by the bootstrap)
| Method | Route | Owner | Notes |
|---|---|---|---|
| POST | `/api/public/invite/validate` | Agent 1 | throttled, minimal yes/no |
| POST | `/api/public/register` | Agent 1 | generic receipt; atomic quota |
| POST | `/api/public/verification/resend` | Agent 1 | cooldown; generic result |
| GET | `/verify?token=...` | Agent 2 | display only, NEVER consumes token |
| POST | `/api/public/verification/confirm` | Agent 1 | single-use token, server POST |
| POST | `/api/public/rsvp` | Agent 1 | separate from verification |
| GET | `/api/public/ticket` | Agent 1 + Agent 3 contract | scoped guest only |
| POST | `/api/staff/session` | Agent 1 | username/password login |
| POST | `/api/staff/logout` | Agent 1 | invalidate session |
| GET/POST | `/api/admin/events` | Agent 1 | scoped admin |
| POST | `/api/admin/events/:id/codes` | Agent 1 | authorized code creation |
| GET | `/api/admin/events/:id/guests` | Agent 1 | scoped, paginated |
| GET | `/api/admin/events/:id/metrics` | Agent 1 | scoped dashboard |
| GET | `/api/admin/reports/export` | Agent 1 | authorized safe CSV |
| POST | `/api/staff/checkin` | Agent 3 | Agent 1 provides atomic DB RPC |
| POST | `/api/staff/manual-checkin` | Agent 3 | authorization and audit |
| POST | `/api/internal/dispatch-tickets` | Agent 3 | signed cron/worker |
| POST | `/api/webhooks/email` | Agent 3 | verified signature, idempotent |

**Ownership exception clarified:** Agent 3 owns the check-in HTTP handlers under `src/app/api/staff/checkin/**` and `src/app/api/staff/manual-checkin/**`; Agent 1 owns DB authorization primitives and RPC. Do not independently implement conflicting `/api/checkin` routes.

## Error and authorization policy
- Use `ApiResult<T>` for normalized JSON response shapes; HTTP status remains authoritative.
- 401 unauthenticated; 403 unauthorized; 400 invalid input; 404 no resource; 409 conflict/quota; 429 throttled; 503 temporary provider outage. Avoid enumeration.
- Public endpoints must NOT expose lists of guests or QR token secrets.
- Guest verification link GET is read-only. Verification is committed by POST.
- Server is authoritative; input types alone provide NO runtime validation or protection.
- Ticket eligibility helper in shared contracts is intended for display/tests only. Check state again inside server transactions.

## Coordination
- Agents 2 and 3 may create local fake adapters for UI tests; label as mocks.
- Ask coordinator before changing shared types/routes; Agent 1 owns approved changes.
- Full security and state specifications: `docs/04_PRIVATE_ACCESS_SECURITY.md`, `docs/05_DATA_MODEL.md`, `docs/16_API_AND_STATES.md`.
- API may evolve after first integrated backend review; "freeze" means a change-review boundary, **not** a claim of production stability.
