# 20 — COPY/PASTE INTO CODEX CHAT 2 (GPT-6.1 TERRA, MEDIUM)

You are AGENT 2, frontend and product UI owner for Night Life Event / NightList. Read `AGENTS.md`, `README.md`, `docs/18_MULTI_AGENT_EXECUTION.md`, `docs/03_UI_SCREEN_SPEC.md`, `docs/02_GUEST_JOURNEY.md`, `docs/09_DASHBOARD_METRICS.md`, `docs/15_DECISIONS_ASSUMPTIONS.md` and the Agent 1 type/API contracts under `src/lib/contracts/**` / `docs/24_API_CONTRACT_FREEZE.md`.

Start only AFTER Agent 1 bootstrap has landed on `main`. Work in your own isolated worktree/cloud task on `agent/frontend`, based on the updated main. Never change Agent 1 schema/auth/API folders or Agent 3 mail/scanner folders. Your job is a polished, **functional, responsive, accessible** public site and organizer dashboard, built against the agreed contracts. Use reusable client adapters/mocks only until real backend is ready; replace mocks during integration, explicitly identify remaining stubs.

Build:
1. Public branded event landing: event name, accurate date/time/zone, location, shareable/personal invite-code entry, eligibility/quota errors. A small, discreet 'Staff Access' link in the footer. This link's obscurity does NOT provide security; its target requires proper session and permission checks from Agent 1.
2. Guest registration: first name, last name, email, optional date of birth only when event policy requires, validation, GDPR notice, registration-submitted state.
3. Verification state screen: 'check your email', resend controls with cooldown, invalid/expired message, verified confirmation.
4. **Separate RSVP step** after verified email, YES and NO, change response, waitlist/admission state, confirmation; guest ticket status. Never issue the ticket in frontend code.
5. Organizer admin layouts: overview across events, event details, create/edit event form, guest lists with filters, invite codes generation controls, email send state, staff role view, real KPI cards/trends and CSV download link. Label sample data honestly when not live.
6. Staff login page with **username + password** fields and links to authorized scanner/dashboard based on real backend session. No public staff signup. Staff scanner page belongs to Agent 3: only provide navigation to it.
7. Clean responsive UI with a coherent premium nightlife aesthetic (not excessive animations), accessible labels, keyboard focus, loading/empty/error states, phone-first guest journey, desktop-friendly back office. Optional bilingual-friendly i18n-ready copy structure; do not invent translations as requirements.
8. Reusable `src/lib/ui-client/**` adapting the typed backend endpoints; avoid direct Supabase admin credentials in browser.

WRITE OWNERSHIP: `src/app/(public)/**`, `src/app/admin/**`, `src/app/staff/login/**`, `src/components/guest/**`, `src/components/admin/**`, `src/components/ui/**`, `src/lib/ui-client/**`, `src/app/globals.css`, `src/app/layout.tsx`, UI and Playwright tests, `handoffs/agent-2/**`. Don't touch shared package files; request dependencies via handoff to Agent 1. No shared docs edits except your handoff.

Test: lint/typecheck/build, interaction/form tests, 360px mobile/desktop screenshots where possible, route error states, unauthorized route redirects. Document what is real vs mock. Create a PR (never merge yourself) and `handoffs/agent-2/STATUS.md`: branch, PR, changed files, route coverage, tests and failures, API contracts needed, blockers and suggested integration steps. Report in Italian.
