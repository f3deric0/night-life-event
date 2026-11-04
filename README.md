# NIGHT LIFE EVENT — Project Master Index

**Working product name:** NightList (not approved as a final brand)  
**Project folder in Google Drive:** `night life event`  
**Document version:** 1.0 · **Date:** 2026-11-04  
**Language:** Italian for product decisions; English where useful for Codex, code/API terminology.  
**Status:** Detailed planning/specification complete; implementation, credentials, provider setup, real email and scanning **not yet performed**.

## 1. Mission
Build a multi-event nightlife invitation and guest-management web platform. Guests receive a personal or shared invitation code; register; confirm ownership of their email via the first transactional email; explicitly choose an RSVP response in a separate step; and, if RSVP=YES and admitted, receive an individual QR ticket two calendar days before the event (or promptly if confirmation happens after that moment). At the door, staff scan the ticket using a smartphone web interface; the system blocks duplicate check-ins. Organizers see dashboards, invitation funnels, attendee status, staff permissions, event history and exportable data.

## 2. Non-negotiable choices (confirmed by product owner)
1. **Multi-event** product, with separate event dashboards and overview.
2. **Both** individual codes and shareable codes with configurable redemption limits.
3. **Separate email verification and RSVP** (neither implies the other).
4. **Immediate first email** to verify address after registration.
5. **Second email with individual QR ticket** two days prior to the event for admitted RSVP=YES guests.
6. **A discreet Staff Access control** on public site; entering private areas always requires **username and password**. Admin has dashboard + scanner; staff has authorized scanner/search only.
7. **Google Sheets/Excel export** is important. PostgreSQL should be the canonical operational database, not a Sheet.
8. Keep guest UX simple and mobile-first; organize the implementation in cost-efficient Codex phases.

## 3. Repository and document map

| Document | Why read it |
|---|---|
| `AGENTS.md` | Persistent concise engineering instructions for Codex; copy to **repository root** |
| `PROMPT_CODEX_FIRST.md` | First prompt to paste into Codex after repo setup |
| `docs/01_PRODUCT_SCOPE.md` | Goals, stakeholders, MVP vs later, glossary, success criteria |
| `docs/02_GUEST_JOURNEY.md` | Full UX flow, email verify, RSVP, special cases |
| `docs/03_UI_SCREEN_SPEC.md` | Every guest/admin/staff screen, interaction and empty state |
| `docs/04_PRIVATE_ACCESS_SECURITY.md` | Hidden link vs real access control, usernames, roles, attacks |
| `docs/05_DATA_MODEL.md` | Tables, relations, constraints, retention and SQL design guidance |
| `docs/06_CODES_AND_CAPACITY.md` | Invite-code semantics, quota, concurrency, waitlists |
| `docs/07_EMAILS_SCHEDULING.md` | Two-email design, templates, scheduling, retries |
| `docs/08_TICKETS_CHECKIN.md` | QR security, scanner, anti-duplicates, manual door flow |
| `docs/09_DASHBOARD_METRICS.md` | KPI definitions, filters, exports and limitations |
| `docs/10_TECH_ARCHITECTURE.md` | Stack, application modules, endpoints, architecture |
| `docs/11_PRIVACY_COMPLIANCE.md` | GDPR and data protection product checklist; not legal advice |
| `docs/12_MILESTONES_AND_TESTS.md` | Delivery phases, acceptance gates, test matrix |
| `docs/13_OWNER_SETUP_GUIDE.md` | Exactly what founder must create / configure |
| `docs/14_CODEX_COST_AND_WORKFLOW.md` | Model & effort recommendations; how to save usage |
| `docs/15_DECISIONS_ASSUMPTIONS.md` | Confirmed, proposed defaults and open decisions |
| `docs/16_API_AND_STATES.md` | Contracts, state machine, idempotency and errors |
| `docs/17_SOURCES.md` | Official documentation and verification references |

## 4. Proposed technology (subject to implementation verification)
- App: **Next.js App Router + TypeScript + Tailwind CSS**, accessible mobile-first web UI.
- Database: **Supabase PostgreSQL**, schema migrations, strict RLS/role enforcement.
- Staff/admin authentication: **Supabase Auth** with securely mapped **username + password** login; never store plaintext passwords in application tables.
- Guests: accountless registration + short-lived, single-use email verification flow implemented server-side, followed by a separate RSVP action. Do not confuse guest verification with privileged staff authentication.
- Email: **Resend** (or validated equivalent), transactional templates and webhook events.
- QR: opaque randomly generated secrets, stored as hashes, never exposed guest PII, atomic redemption on backend.
- Hosting: e.g. **Vercel** for Next.js; HTTPS and environment secrets.
- Reporting: CSV/Excel export initially; read-only Google Sheets sync optional milestone.

## 5. What is ready and what is NOT
READY: scope, UX rules, roles, schema design, implementation sequence, Codex prompt and tests.  
NOT READY: app source repository, live Supabase project, credentials, domain, mail domain verification, GDPR documents adopted by the business, deployed app, physical phone tests.

## 6. Working method
- **Git repository = source of truth for code.** Put this entire documentation bundle into repository root; Google Drive = project archive and collaboration/readable copy.
- Record feature decisions in `docs/15_DECISIONS_ASSUMPTIONS.md`. Codex updates docs whenever behavior changes.
- Use phased delivery. Avoid one massive 'build everything' Codex request.
- Maintain `.env.example` with placeholders; keep `.env.local` and secrets out of Git, Google Drive and conversations.
- Demonstrate flows using synthetic guests before collecting real data.

## 7. First next action
1. Read `docs/13_OWNER_SETUP_GUIDE.md`.
2. Create a **private** GitHub repository `night-life-event`.
3. Put these Markdown documents (including root `AGENTS.md`) in that repository.
4. Open Codex connected to repo, prefer **GPT-6.1 Sol / Medium** if available.
5. Paste `PROMPT_CODEX_FIRST.md` and request **Phase 0** only.

> This bundle describes the product and the build plan; uploading the Markdown files does not deploy a working website.
