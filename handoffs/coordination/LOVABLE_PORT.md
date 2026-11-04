# Night Life Event — Lovable guest UI port

**Date:** 2026-11-04

**Official GitHub repository:** `f3deric0/night-life-event`. Integration branch `integration/lovable-guest`, forked from `agent/frontend` head `4229cd10b2fed72c35345ed7190bb9a292963582`. **Do not self-merge.**
**Design source:** Lovable project `8399a039-78e7-4432-a920-70b46fb32529`, reviewed commit `f01ab065631e022230be27416f22d87cfbfedd73`, using only the finished guest-flow React/CSS/validation logic.

## Implemented
- Next.js official homepage now uses a ported, responsive nightclub guest experience: entry → gift code → registration → explanatory email screen.
- The original `/anteprima`, staff login and dashboard modules from Agent 2 are preserved. Backend APIs and database remain untouched.
- Demo accepts ONLY fictional gift code `NOTTE-DEMO-26`; no arbitrary codes, real submissions, email dispatch or QR admission. PII form state cleared after demo submit; no localStorage, cookies, logs or server calls for form content.
- Registration design includes name, surname, birth date, email, country-code + phone, and demo privacy statement. Birth date/phone need a lawful basis and retention policy before collecting real PII.
- Source contains **no Lovable advertising, generated boilerplate, analytics SDK, Lovable branding/logo, sponsored link or third-party runtime code**. Fonts use iOS/system font stacks rather than Google Fonts remote requests.
- The staff footer links to the existing `/staff/login` page, whose security is exclusively enforced by Agent 1's server implementation.
- Added 4 pure validation tests under `tests/guest-demo.test.mjs`. Run GitHub CI on the integration branch before any merge.

## Outstanding
- Source originated from a TanStack Start standalone app; this is a manual adaptation to Next.js and must be visually compared to the Lovable preview on iPhone.
- Actual invite validation and registration must be wired to Agent 1 server endpoints; demo must not be mistaken for a live event.
- Agent 2 must approve/review and integrate this into its PR #2. Agent 6 may deploy the isolated branch to Vercel Preview before any merge.
- Real production must still pass auth/RLS, email, privacy and check-in gates.
