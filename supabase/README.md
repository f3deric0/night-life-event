# Supabase foundation (Phase 1 pending)

No database schema, RLS policies or auth services are installed by this Phase 0 bootstrap.
Agent 1 owns this directory after the bootstrap PR is merged.

Implementation must cover:
- Organization/event scoping and explicit deny-by-default RLS.
- Privileged staff username mapping through server-only Supabase Auth integration.
- Transactional redemption quotas, verification and separate RSVP.
- Atomic one-time check-in RPC consumed by Agent 3.

Never insert service-role keys or real guest PII into Git.
