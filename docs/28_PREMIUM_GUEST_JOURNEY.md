# 28 — Premium nightclub guest entry (owner request, 2026-11-04)

**Owner-approved priority:** replace the current app-like technical preview with a **single mobile-first event entrance** that looks like a premium nightclub invitation. Detailed acceptance and agent assignments: [GitHub Issue #10](https://github.com/f3deric0/night-life-event/issues/10).

## Scope of the FIRST release slice

| Step | Guest-facing copy | Implementation / validation |
|---|---|---|
| 1. Event landing | "Vuoi accedere a questo evento?" and a prominent "Sì, accedi" | Elegant full-height page on iPhone, event title/date/location, one action, discreet staff access only in footer |
| 2. Gift code | "Codice regalo" and "Invia" | Transition on tap, code entry, graceful invalid/expired/used/quota responses; use real backend lookup or an unmistakably artificial preview-only demo mode |
| 3. Guest details | "Completa il tuo invito" | Nome, Cognome, Data di nascita, Indirizzo email, Telefono; server validation and privacy notice before collecting real guest data |
| 4. After submit | "Controlla la tua email" | Queue ownership verification email #1, no automatic RSVP. Email verification and RSVP are strictly separate; ticket email remains later |

**User confirmation:** fields date of birth and phone must appear in the requested registration UX. This does not itself validate the lawful basis to retain date of birth or define mandatory collection in production. Age policy, retention/privacy notice and phone purpose require owner/legal review before real PII collection. Use fake data for preview.

## Presentation direction

- *Nightclub premium*: nearly black background, restrained violet/silver accent, elegant readable typography, generous whitespace, refined contrast. No developer cards, dashboard calls to action, system implementation jargon or large decorative distractions in the guest journey.
- *Subtle movement*: 250–350 ms fade/slide between stages, tasteful button feedback, no mandatory waiting. `prefers-reduced-motion` respected.
- *iPhone-first*: test 360, 375, 390 px widths, safe areas and keyboard visible, no horizontal scrolling or iOS zoom (inputs ≥16px); touch targets ≥44px; correct input autocomplete, email/telephone keyboards and accessible labels.
- *Security*: only real backend can validate invitation codes and atomically allocate a provisional claim. UI validation alone is never authoritative. Store only code digest in database; high-entropy codes; server rate-limit; generic safe errors. No code or token in referral URLs, analytics or logs; no guest data on preview.
- *Fallback*: while Supabase API/email are not operational, demo stays **clearly labeled**, uses a fixed fictional demo code and no real persistence or emails. Never accept any input as a valid code.

## Non-negotiable stage separation

Submitting guest details ≠ verifying email ≠ accepting RSVP ≠ issuing ticket. The first email immediately verifies the address; after verification the guest separately chooses RSVP. Subsequent QR email follows scheduled policy and capacity/admission.

## Agent ownership

- Agent 2: UX/components/responsiveness and client adapter in its existing PR #2.
- Agent 1: real invitations API, admin-only issuance, DB schema and atomic claims in separate backend PR #9 or follow-up.
- Agent 4: pure helpers for code generation/digest where expressly delegated, tests only; no DB access.
- Agent 5: negative flows, accessibility and iPhone viewport tests.
- Agent 6: actual preview deployment of updated UI branch, no real data or paid service.

## Release gate
A verified visual Vercel preview is a *prototype*, not a working ticketing service. Functional check requires real Supabase staging schema, server-side code lookup/atomic registration, email job and negative/concurrency tests.
