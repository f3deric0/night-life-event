# Supabase — Phase 1a schema (not deployed)

Core DDL: `migrations/20261104170000_core_schema.sql`. Disposable PostgreSQL verification: `tests/core_schema_smoke.sql`.

- **No live database has been modified.** Review schema, tenancy and RLS against approved docs and actual Supabase settings before applying to an owner-controlled development project.
- Every business table has RLS enabled and direct client grants revoked by default; no broad authenticated/anon policies are present.
- Any application service role operations must be server-side and explicitly authorize caller role, organization and event.
- Staff password verification belongs to Supabase Auth; do not store passwords here.
- Later migrations must implement atomic personal/shared code claiming, event capacity, one-time verification token consumption, RSVP, and check-in RPC. Concurrency tests and negative auth tests must pass on real Supabase before pilot.
- Agent 4 owns independent `src/lib/invites/**` code generation service logic; Agent 1 owns database migrations and APIs.
