# 27 — Early online preview and free-tier setup

**Goal:** Show Night Life Event online early, using **synthetic sample data**, before privileged sessions or guest registration is operational. An online preview is NOT a production venue system.

## Technology roles and stages
1. **Vercel:** HTTPS Next.js UI preview. Import the private GitHub repository `f3deric0/night-life-event` into a project the owner controls, deploy a safe branch/commit. Configure production branch only after owner approves a tested integration; a PR preview can be used first. Do not put Supabase service-role keys in public variables.
2. **Supabase:** create a free *development/test* PostgreSQL project in a suitable region; apply reviewed Agent 1 migrations with denial-by-default policies and only synthetic guests. Do not provision a production database without separate approval. Staging application must not accidentally connect to production.
3. **Resend:** later, free-tier transactional email provider for a verified sender domain. Only controlled test recipients until provider keys, sender DNS, policies and owner permission are configured. Email #1 verifies address; separate explicit RSVP; email #2 QR two local calendar days before event.
4. **Hosting domain:** generated `*.vercel.app` is sufficient for demo. A custom domain is optional and may cost money. Never invent a live URL.

## Zero-cost constraints (verify again at time of account setup)
- Vercel Hobby's terms restrict it to personal/noncommercial use. A private prototype preview may fit; do not assume a live revenue-generating service qualifies.
- Supabase Free imposes database/project/compute limits and may pause inactive projects; verify backup provisions before real users.
- Resend Free has send quotas. Check current quotas before real event volumes.
- Do not activate pay-as-you-go, upgrade plans, purchase domains, or enable real sending without explicit owner consent.

## Owner / coordinator action sequence
1. Connect Vercel and Supabase accounts to ChatGPT when supported, via their official authorization prompts. This is the only account permission step requiring user action. Do not paste passwords, API keys or privileged URLs into chat or GitHub.
2. Coordinator/Agent 6 imports the private repo and deploys a **preview-only** Next.js commit. Confirm unique deployment URL from provider, then test on phone and desktop.
3. Prepare Agent 1 schema with migrations and RLS; apply to development Supabase only after code review; server-side secret values reside in Vercel environment settings, not in repo.
4. Wire backend register/verify/RSVP. Ag 3 wires test-only Resend and check-in RPC; Ag 4 reports live authorized metrics.
5. Agent 5 runs E2E synthetic guest journey; Agent 7 checks auth/RLS/abuse/privacy gates. Only then propose controlled production pilot.

## Release safety
- No customer PII in demo screenshots, seeds or logs.
- The current bootstrap Staff Access page is a **placeholder**, not a secure login; preview only until Agent 1 completes server auth.
- Do not allow guest registration or staff admission against simulated data as if real.
- Backup GitHub history and DB separately; review actual privacy retention.
