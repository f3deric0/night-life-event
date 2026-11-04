# AGENTS.md — Night Life Event / NightList

Codex: read `README.md`, `docs/15_DECISIONS_ASSUMPTIONS.md`, and the document(s) relevant to your task before changing code. Do not reread all docs verbatim unless necessary. Keep this file concise.

## Goal
Implement a mobile-first **multi-event nightclub guest-list web platform** with personal/shared invitation codes, guest registration, immediate email verification, **separate explicit RSVP**, QR tickets issued/sent two calendar days before an event, atomic smartphone check-in, organizer dashboard, and read-only export to CSV/Excel or Sheets.

## Essential product decisions
- Public area has a **discreet Staff Access** control (e.g., small footer link) but **security must not depend on obscurity**.
- Admin and staff login with **username + password**. No public staff signup. Implement authenticated, role- and organization/event-scoped server access to every private page/API. Admin can manage events, invitations, guests, emails, reporting and scanner; staff can scan and search for assigned events only.
- Email verification and RSVP are **separate states/actions**. Unverified email must not RSVP. RSVP=NO or waitlisted must not have an active QR.
- Send **Email 1 immediately** upon registration: ownership verification. Send **Email 2 at 10:00 event-local time two calendar days before event** if admitted RSVP=YES, or promptly after later positive RSVP/admission. Follow `docs/07_EMAILS_SCHEDULING.md` for change/cancellation handling.
- Invitation codes are not tickets. A shared invite code can generate many unique, one-entry QR tickets within its configured quota.
- Operational source of truth is PostgreSQL, **never Google Sheets**. Exports must not expose unneeded personal data.

## Engineering standards
- Prefer Next.js App Router, TypeScript strict, Tailwind, Supabase PostgreSQL/Auth, server-side email provider adapter, schema migrations and automated tests.
- Keep external service calls behind adapters so local tests run without credentials.
- Use small vertical slices, update changelog and document decisions; do not implement speculative extras.
- Secure by default: server-side authorization on every protected action, Supabase RLS, rate limits, normalized username/email, hashed one-time verification tokens and QR token secrets, random high-entropy code generation, CSRF protections where needed, secure session cookies, input validation, no credentials in repo.
- No unauthenticated data-list endpoints; no admin writes via client-side service-role key. Treat invitation code, email token and ticket token as sensitive bearer credentials. Use server transactions/unique constraints for code quota and ticket check-in concurrency.
- No real user data in seeds, screenshots, code, examples or tests.
- Test: typecheck, lint, unit, integration, security negatives, mobile viewport and 2-device concurrent scanning when the relevant phase is implemented. Never claim tests passed unless they ran.

## Scope discipline and reporting
Before changes: give a compact plan and list files likely to change. After changes: summarize **what changed, commands run/results, blockers, next minimal task**. Stop at the requested phase; do not silently deploy, provision paid resources, email real people or commit secrets. If integration credentials are absent, use `.env.example` and mocks and say what cannot be tested.

## Documentation
When functionality changes, update relevant `docs/*.md` and `docs/15_DECISIONS_ASSUMPTIONS.md` if the change modifies a decision or assumption. Preserve the core product requirements unless the product owner explicitly changes them.
