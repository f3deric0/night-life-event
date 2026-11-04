# Night Life Event — approved four-language design port

- **Date:** 2026-11-04. **Source:** Lovable prototype 8399a039-78e7-4432-a920-70b46fb32529 at 4cb5118942f6aaaadb863bfc389da7dfce75607e.
- **Branch:** `integration/lovable-guest`, PR #11 against `agent/frontend`; don't merge without owner approval.
- **Public:** new iPhone-first Next.js homepage with IT/EN/FR/NL language switch. No demo banner or provider advertising. Server code verification NOT yet connected: invitation submit returns localized unavailable state, never fake success or leaks PII.
- **Design review:** `/design-review` and `/design-review/backoffice` are separate, unlinked, noindex sample-only routes, with local fake codes and synthetic guests/staff. These routes must remain safe for public preview; do not use real personal data.
- **Staff:** `/staff/login` redesigned in approved visual style, preserves actual `staffLogin` API integration and never grants a false session. `/staff/overview` locked until server auth. Event/guest/code back-office design under `/design-review/backoffice` only, with disabled actions.
- **Shared code:** `src/lib/i18n/dictionary.ts` & `context.tsx`, source `src/lib/guest-flow/invite.ts`, new guest and staff UI components; no imported Lovable SDK or generated boilerplate. Original demo-only component removed.
- **Nonfunctional:** full public registration, code validation, email verification, admin CRUD, Supabase, QR/check-in; owner appointed Agent 8 as exclusive HTTP/API integration owner (Issue #13). Agent 1 keeps DB/RLS/RPC.
- **Review:** Check GitHub CI lint/typecheck/test/build for this commit, plus Vercel deployment branch and iPhone visual QA. No unauthorised merge or real guest data.
