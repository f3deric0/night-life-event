# Agent 1 — Backend & Security Phase 1a (2026-11-04)

- **Branch:** `agent/backend-phase1`; this is a separate draft migration PR based on merged bootstrap main `69e6469`.
- **Delivered:** initial PostgreSQL 17-table core schema, tenant/event composite foreign keys, normalized staff usernames and guest emails, invitation code hashes/quotas, check-in uniqueness, token hashes and indexes.
- **Security:** RLS enabled and direct grants revoked for `anon` and `authenticated` on every new table. No permissive policies; no service-role key exposed. Application server auth must be added before enabling API access.
- **Test plan:** disposable PostgreSQL 16 GitHub Actions job creates synthetic auth.users stub, executes migration and checks RLS/client grants/structural constraints.
- **Important:** SQL is NOT applied to Supabase yet; actual Supabase project/org, auth integration, concurrency tests, check-in RPC, email jobs, public/private endpoints and staff onboarding remain pending. Schema and constraints require review for production.
- **Agent 4 delegation:** `src/lib/invites/**` pure domain/crypto code is assigned to Agent 4; Agent 1 owns these migration tables, secure DB operations and auth/API paths. Do not duplicate.
- **State:** NOT READY FOR PILOT. No real data or credentials committed.
