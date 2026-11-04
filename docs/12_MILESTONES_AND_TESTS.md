# 12 — Build milestones, deliverables and quality gates

## Workflow principle
Use one **small Codex task per verified milestone**. End each with code diff, tests run, `IMPLEMENTATION_LOG.md` update, screenshots/manual test notes and next action. No silent production deployment.

## Phase 0 — Scaffold & design preview (first Codex task)
Deliverables: Next.js TS/Tailwind app, mobile-first public landing + registration/check-email/RSVP/ticket mock, admin UI mock, scanner UI mock, discreet footer `Staff Access`, safe protected route placeholders or *explicit dev-only* mock access, sample fictitious data, lint/typecheck and build. **No real auth, no email, no camera, no DB** in this phase. Do not fake protection in production.

**Gate:** app starts locally; mocked flows clearly marked; private production routes deny by default; tests/checks run successfully; owner reviews visuals on phone and desktop.

## Phase 1 — Database and invitation rules
Deliverables: Supabase migrations, RLS deny-by-default, organizations/events/codes/guests/registrations/claims, synthetic seeds, server validation for code quota and uniqueness, concurrency tests.

**Gate:** 100 parallel claims never exceed quota; cross-org RLS denies reads; no client service-role key; migrations run on empty DB.

## Phase 2 — Private username/password access
Deliverables: secure username mapping + Supabase Auth login, session cookies, admin/staff memberships, role/event-scoped APIs, logout and protected pages, negative tests, owner bootstrap with no public staff signup.

**Gate:** anonymous access and staff-to-admin escalation impossible across app/API; disabled user rejected; auth rate-limit demonstrated.

## Phase 3 — Guest verification and separate RSVP
Deliverables: functional guest code registration, email verification token handling (provider sandbox or adapter), safe token landing+POST, RSVP yes/no, admission/waitlist, ticket eligibility states, integration tests.

**Gate:** unverified cannot RSVP, RSVP NO cannot produce active ticket, cap never exceeded, duplicate email safe.

## Phase 4 — Automated emails and tickets
Deliverables: real email adapter and verified domain setup (when owner provides), email jobs + scheduler, resend & webhook tracking, ticket QR generation, cancellation/change logic.

**Gate:** tests for 2-calendar-day scheduling incl DST and late signup; no duplicate tickets/jobs; no ticket email for waitlist or NO; safe failed provider retry.

## Phase 5 — Door scanner
Deliverables: authenticated camera scanner, event selection, API atomic check-in, duplicate/invalid/other-event feedback, manual search/override audit, phone validation.

**Gate:** two concurrent scans yield exactly one success; staff can't scan unassigned event; offline shows error, never green.

## Phase 6 — Reporting and export
Deliverables: KPI views, live or polling check-in counts, code/promoter conversions, CSV export protected against injection, optional Sheets sync.

**Gate:** dashboard counts match DB and sample fixtures; no-show only after event; exports match filters and role permissions.

## Phase 7 — Staging, privacy/security, controlled pilot
Deliverables: HTTPS staging, email auth domain, backup+restore procedure, monitoring, privacy documents, test event with synthetic/consenting testers, bug fixes, deployment plan and operational runbook.

**Gate:** product owner approves actual door rehearsal and privacy/security checklist; then production event pilot with staff training. Production depends on successful tests, not a fixed date.

## Sample end-to-end test matrix
| ID | Condition | Expected |
|---|---|---|
| T01 | Personal code valid, one verified signup | 1 redemption and 1 registration |
| T02 | Personal code reused | rejected; does not disclose original guest |
| T03 | Shared code 2 uses, 3 simultaneous verified claims | 2 succeed max |
| T04 | Guest registration unverified | no RSVP/ticket |
| T05 | GET email link by prefetcher | token not consumed |
| T06 | Email verified, unanswered RSVP | no ticket |
| T07 | RSVP NO | no ticket / any old ticket revoked |
| T08 | RSVP YES and event full | waitlisted, no ticket |
| T09 | RSVP YES eligible on event-2 day | one ticket email at configured local time |
| T10 | RSVP YES eligible after send cutoff | ticket delivered promptly |
| T11 | Same ticket scanned on 2 phones concurrently | 1 success only |
| T12 | Re-scan used ticket | duplicate warning |
| T13 | Scanner staff assigned to other event | unauthorized |
| T14 | Anonymous direct GET `/admin`, API call | unauthorized, no data leak |
| T15 | Wrong username/password repeated | generic failure and rate-limited |
| T16 | Event cancellation | pending jobs cancelled, ticket denied |
| T17 | CSV contains `=SUM(...)` in guest name | escaped as plain text on export |
| T18 | Event timezone DST boundary | correct local calendar dispatch |
| T19 | Lost internet at entrance | no false green acceptance |
| T20 | Analytics on completed event | no-show reconciles with checkins |

## Priority/bug policy
P0: data leak, staff auth bypass, duplicate QR entry, oversubscribed capacity, secret leak. P1: email not delivered, incorrect event data, wrong KPI. P2: design polish / secondary filter. Stop release for P0 and unresolved P1 in core journey.

## Artifacts Codex must write
`IMPLEMENTATION_LOG.md` for work done and exact test commands/results; optional `docs/KNOWN_ISSUES.md` only if issues found. Update source docs when decisions change. Do not scatter state across unconnected chat histories.
