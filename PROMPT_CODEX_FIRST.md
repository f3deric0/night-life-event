# Initial Codex Prompt — copy the text below into the first project task

Recommended selection (if available): **GPT-6.1 Sol / Medium reasoning / standard speed**. Use a repository-connected Codex task. Attach or copy the documentation files to the repository first; a Google Drive URL by itself is not a guarantee that Codex can read them.

---

You are the lead full-stack engineer for the **Night Life Event / NightList** project. The project files in this repository are the authoritative specification. The product owner is not a developer; explain actions briefly and plainly in Italian, but use English for code, identifiers and comments.

**First, read:** `AGENTS.md`, `README.md`, `docs/15_DECISIONS_ASSUMPTIONS.md`, `docs/01_PRODUCT_SCOPE.md`, `docs/03_UI_SCREEN_SPEC.md`, `docs/04_PRIVATE_ACCESS_SECURITY.md`, `docs/10_TECH_ARCHITECTURE.md`, and `docs/12_MILESTONES_AND_TESTS.md`. Read additional docs selectively only when needed for the work. If these files are missing, stop and tell me which files to add; do not improvise the spec.

**Work on PHASE 0 ONLY (repository foundation + mock UI), not the complete production app.** I want a high-quality, runnable, well-organized foundation, without wasting tokens or adding unrequested scope.

Tasks:
1. Inspect the repository. If it has no app, scaffold a modern **Next.js App Router + TypeScript + Tailwind CSS** application using compatible stable packages. Use one codebase and strict TypeScript.
2. Create public landing page for a sample nightlife event with a prominent invitation-code entry path and an elegant, mobile-first aesthetic. Add a *small, discreet but discoverable* `Staff Access` control in the footer (not a security mechanism).
3. Create navigable mock pages for: invite/registration, check-email, verify outcome, separate RSVP yes/no, confirmation, ticket preview, staff login, admin dashboard overview, event list/detail, invitations, guests, email monitoring, staff scanner. Use **only fake demo data** and mark nonfunctional mock actions. Ensure navigation is usable on mobile/desktop.
4. For private paths `/staff/login`, `/admin/*` and `/staff/scanner`, create route structure and safe **deny-by-default placeholders**. Do not fake security: mock dashboard/scanner may only be exposed under a clearly isolated dev-only demo mode, not through unrestricted production private routes. Implement real authentication in a later milestone after Supabase is configured.
5. Add reusable UI components, accessible forms, error/empty/loading state designs and consistent styles. Avoid heavy dependencies that are not needed.
6. Add `.env.example` with placeholders (no real keys), `.gitignore`, `README` for local run, and scripts for lint/typecheck/test. Keep existing project docs intact.
7. Create a short `IMPLEMENTATION_LOG.md` with files changed, rationale, commands run and results, assumptions, blockers and the next proposed task.
8. Run all available local checks and, if possible, launch the app and inspect landing/mobile and dashboard mock views. Fix failures you can reproduce.

Core behavioral requirements to preserve for later phases: **multi-event; personal and shared invitation codes; email ownership verification is separate from RSVP; immediate verification email; QR delivered two calendar days before event to admitted RSVP=YES guests; smartphone scan checks ticket atomically; organizer dashboard; username/password-only authorized staff entry; role-scoped access; PostgreSQL source of truth; optional export to Sheets/Excel**.

**Non-goals now:** no deployment, no live credential creation, no external emails, no real guest data, no production Supabase tables, no payment module, no WhatsApp API, no speculative SaaS billing, no third-party account signup. Do not imply the mock scanner is actually using a camera. Ask only for a blocking decision; otherwise use the documented defaults.

**Acceptance:** a working local UI scaffold with clear mocked screens, correctly segregated private route scaffolding, clean project structure and runnable checks. At the end report in Italian exactly what runs and what remains simulated.

---

## Suggested second prompt, after verifying Phase 0

> Proceed with **Phase 1: Supabase schema and server-side guest registration only**, following `docs/05_DATA_MODEL.md`, `docs/06_CODES_AND_CAPACITY.md` and `docs/16_API_AND_STATES.md`. Deliver migrations, RLS, server validation, atomic invitation-code reservation/redemption, synthetic fixtures and integration tests. Do not send live emails or build real scanning yet. Show commands/results and stop after Phase 1.

## Suggested third prompt, after Phase 1

> Implement Phase 2: secure staff/admin authentication using username + password and role-scoped protected routes. Follow `docs/04_PRIVATE_ACCESS_SECURITY.md`. Do not publicly expose dashboard or scanner. Include rate limiting, negative authorization tests and an owner-only bootstrap procedure; no self-registration for staff. Show tests and stop.
