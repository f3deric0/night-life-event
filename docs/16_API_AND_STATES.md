# 16 — States, API contracts, transactional boundaries and error handling

**Note:** API paths and payloads are proposed contracts, not deployed endpoints. Codex should validate them against current Next.js and Supabase APIs. Server is authoritative. Generic public errors prevent account/code enumeration.

## State model by dimension
```
email: unverified -> verified
rsvp: unanswered -> yes | no ; can change if policy allows
admission: pending -> admitted | waitlisted | cancelled | rejected
ticket: absent -> issued -> queued -> emailed -> checked_in ; may revoke or rotate
entry: not_entered -> entered  (one first entry in V1)
event: draft -> open -> closed/completed | cancelled
```
Orthogonal states are intentional: avoid huge single enum `verified_yes_ticket_sent_entered`. Eligibility is computed from cross-state checks, not UI badge.

## Proposed endpoints
| Route | Caller | Input / effect | Return |
|---|---|---|---|
| `POST /api/public/invite/validate` | public | code + event slug; throttled | minimal validity/availability, no guest PII |
| `POST /api/public/register` | public with code | identity fields, code; atomic provisional claim | generic accepted + next verification step |
| `POST /api/public/verification/resend` | public | scoped registration challenge, cooldown | generic accepted |
| `GET /verify?token=...` | token bearer | render safe human confirmation page only | page; **does not consume token** |
| `POST /api/public/verification/confirm` | token bearer | consume single-use email token, convert code claim | verified + scoped RSVP continuation |
| `POST /api/public/rsvp` | verified scoped bearer | YES/NO; atomic cap/admission/ticket revoke | current RSVP+admission |
| `GET /api/public/ticket` | scoped secure guest token | if eligible, return own ticket representation | current own ticket only |
| `POST /api/staff/session` | staff username/password | secure server-only username resolution + provider auth | session; generic login error |
| `POST /api/staff/logout` | authenticated | revoke/clear session | logged out |
| `GET /api/admin/events` | owner/admin | scoped event list | paginated |
| `POST /api/admin/events` | owner/admin | validated event details | created event |
| `POST /api/admin/events/[id]/codes` | owner/admin | code type/limit/batch | generated code secrets shown once to authorized user |
| `GET /api/admin/events/[id]/guests` | owner/admin | paging/filter/search | scoped guest rows |
| `POST /api/staff/checkin` | assigned staff/admin | event_id + raw QR token; server transaction | accepted/duplicate/invalid etc |
| `POST /api/staff/manual-checkin` | assigned authorized staff | scoped registration, confirmation, reason | checkin result, logged |
| `GET /api/admin/reports/export` | owner/admin | event/date/filter | CSV with safe columns and formula protection |
| `POST /api/internal/dispatch-tickets` | signed scheduler only | dequeue due jobs | controlled internal status |
| `POST /api/webhooks/email` | signed provider webhook | delivery status | idempotent acknowledge |

## Security envelope
- Validate inputs with schema library on server. Ignore client-supplied org_id, ticket eligibility or role unless independently authorized.
- Fetch organization membership from session every protected request; `/api/staff/checkin` verifies event assignment. No public service role key.
- Rate-limit login, code validation, register, resend, ticket scans and search; avoid leaking whether a username/email/code exists.
- Use stable synthetic error codes with server trace IDs; return user-facing generic messages; never return hashed tokens, auth secret or stack traces to clients.
- GET actions must not mutate verification state or check in a ticket. POST actions need CSRF/session protection as applicable; direct access from browser devtools must obey same checks.

## Idempotency and concurrency
- Registration duplicate: unique `(event_id, normalized_email)` prevents multiple counts, but public response remains generic.
- Shared quota and seat cap: serializable txn / locked row or DB function; no oversubscription under races.
- Ticket email: DB unique idempotency key by registration/ticket version/email purpose; provider idempotency key and retry handling; no duplicates on cron overlap.
- Check-in: unique(ticket_id) successful row + transaction. A second valid server request always reports duplicate; two devices cannot both receive accepted.
- Manual check-in uses same transaction and uniqueness as QR check-in.
- Admin rescheduling cancels obsolete jobs and rechecks ticket status; preserve audit.

## Example sanitized responses (illustrative, no PII)
```json
{"status":"ok","next":"verify_email"}
{"status":"verified","next":"rsvp"}
{"status":"accepted","rsvp":"yes","admission":"admitted"}
{"status":"accepted","rsvp":"yes","admission":"waitlisted"}
{"status":"denied","reason":"already_checked_in"}
{"status":"denied","reason":"wrong_event"}
```

## Error priorities
Permission failure -> 401/403; unknown/invalid secret -> generic 400/404; quota exhaustion -> 409/422 without revealing other guest; rate-limit -> 429; unexpected provider failure -> 503 with retry path and correlation id; never treat a network timeout as successful admission. For internal audit, preserve detailed reason securely.
