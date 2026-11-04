# Night Life Event — compact continuation brief

**Coordinator:** this ChatGPT project/chat. **Repository:** `f3deric0/night-life-event` (private). **Primary documentation:** `AGENTS.md`, `README.md`, `docs/01..24` and Google Drive `night life event`.
**Date:** 2026-11-04.

## Owner-confirmed, preserve
Multi-event system; personal/shared invitation codes; email #1 immediate ownership verification, followed by **separate explicit RSVP**; email #2 with individual QR two calendar days before event; valid admitted YES only; atomic single check-in; discreet staff-access link, actual username/password and scoped permissions; PostgreSQL operational store; CSV/Excel export. Never treat mock UI as functional security.

## Operational constraints
The owner is using a corporate computer without ability to install apps or access GitHub normally. Codex Cloud checkout failed against an unavailable proxy (port 8080). A phone-created GitHub Codespace was stopped to avoid charges. GitHub's connected plugin is functioning in this ChatGPT conversation; write code via isolated branches and PRs. No secrets or paid provisioning. Work agents 2 and 3 may be started in parallel **after** bootstrap PR is reviewed/merged onto main, not on the docs-only initial commit.

## Delivery roles
- **Agent 1 / coordinator bootstrap:** root Next.js TypeScript Tailwind setup, shared contracts, `docs/24_API_CONTRACT_FREEZE.md`, then backend/schema/auth/invites after bootstrap gate.
- **Agent 2 / frontend:** `docs/20_AGENT_2_FRONTEND_PROMPT.md`; guest/admin UX and dashboard, no schema/API ownership.
- **Agent 3 / email+check-in:** `docs/21_AGENT_3_CHECKIN_PROMPT.md`; mail scheduling, QR/ticket and scanning UI/handlers, not DB schema/auth.
- Agent branches must remain isolated. Agent 1 owns root config. No direct merge without owner consent.

## Status
Repository documentation is complete. Initial coordinator work is the **bootstrap PR** implementing an app shell and typed contracts; no live DB/auth/mail/scanning exists yet.
Changes, checks and outstanding blockers are recorded in `IMPLEMENTATION_LOG.md` and `handoffs/agent-1/STATUS.md`. A new chat can continue by reading this file plus the affected area docs, rather than replaying the conversation.

## Next gates
1. Review/merge bootstrap PR into main **only after owner approval**.
2. Start Agent 2 and Agent 3 from that same merged main commit; Agent 1 can then take backend/schema phase. Agent 3 uses Agent 1's atomic check-in RPC, Agent 2 uses shared contracts.
3. Validate installation, lint, TypeScript, test, build in an environment with npm access; track CI. Later stage with synthetic data and real security tests before any event.
