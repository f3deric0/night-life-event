# 28 — Coordinated seven-agent sprint (2026-11-04)

**Active sprint goal:** an online **demo-only** preview as soon as possible, then an integrated multi-event pilot with verified guest signup → email ownership → explicit RSVP → ticket → atomic check-in → dashboard, all behind secure roles.

**Main baseline:** `69e6469b064d687b337a883835508bf2abf4d7f4` (bootstrap PR #1 merged).
**Currently open:** PR #2 frontend, #3 mail/checkin, #4 QA, #5 reporting, #6 operations, #7 security, #8 coordination.
**Do not assume any of those six feature PRs is merged.** PR #3 currently has a CI lint failure; repair before integration.

## Highest leverage assignments — exclusive code ownership

| Agent / Work chat | Immediate task | Write ownership | Current PR |
|---|---|---|---|
| **1 Coordinator/backend** | PostgreSQL model and deny-by-default RLS; verified guest registration + RSVP; server-only staff username auth; **atomic check-in RPC**; stable DB/API integration | `supabase/**`, `src/lib/db/**`, `src/lib/auth/**`, `src/lib/registrations/**`, `src/lib/events/**`, `src/lib/contracts/**`, root config and auth/registration/events APIs. **Delegates `src/lib/invites/**` to Agent 4 for the sprint.** | new backend Phase 1 PR |
| **2 Frontend** | Turn preview into interactive polished guest + admin screens and secure API adapter; link Vercel preview; test phone/desktop | original Agent 2 UI paths; no server authorization/data | #2 |
| **3 Email / QR / Scanner** | **Fix PR #3 lint now**; safe server-only mail adapter, ticket/QR and phone scanner UX; keep check-in 503 until atomic backend RPC integrated | original Agent 3 paths | #3 |
| **4 Invitations + reporting** | Finish/freeze current pure KPI/CSV PR #5; **new isolated PR for actual personal/shared invite code generation and quota-service contract**. No DB migrations/API auth edits. | `src/lib/reporting/**`, `tests/reporting/**` for PR #5; **delegated `src/lib/invites/**`, `tests/invites/**`, `handoffs/agent-4/**`** for new invitation PR. | #5 plus `agent/invitations` new PR |
| **5 QA** | End-to-end synthetic journey, missing tests and CI test discovery, negative / two-scanner concurrency tests. Ask Agent 1 to change root test script. | `tests/e2e/**`, `tests/integration/**`, `tests/fixtures/**`, `qa/**` | #4 |
| **6 DevOps / preview** | **Deploy preview of PR #2 on Vercel with fake data**, verify true URL; connect a separate Supabase Free dev project in owner's account when connector works. Never apply unreviewed SQL. Then stage integration. | `infra/**`, `scripts/ops/**`, `docs/ops/**`, approved CI additions | #6 |
| **7 Security + compliance** | Review changed PRs and forthcoming backend; write actionable security regression tests; privacy notice placeholder and GO/NO-GO. Independently review SQL RLS/auth/code quotas; do not implement what you review. | `tests/security/**`, `audit/**`, `docs/security/**` | #7 |

**Important temporary delegation:** Agent 4 now writes the invite-code service domain `src/lib/invites/**`; Agent 1 writes migrations and atomic database functions, shared contracts, auth, and API routes. Agent 4's code **must** call Agent 1 server-provided secured DB functions/typed interfaces, not make independent direct DB mutations. No agent edits another's files. Owner requested active redistribution for speed; Agent 1 avoids duplicate work.

## Immediate dependency sequence
1. **Vercel preview PR #2**: allowed before database, explicitly demo-only. Vercel Hobby use must comply with *personal/noncommercial* restrictions. Do not deploy live commercial guest platform on Hobby by assumption.
2. **Development Supabase**: confirm project identity/region/free tier with user, create if connector supports it, no credentials in repo. Agent 1 prepares migrations and controlled SQL validation; Agent 6 handles project/hosting config.
3. **Security-critical core backend**: event/org schema + RLS, staff server auth, personal/shared code claims and verified guest state, admission cap, atomic check-in.
4. **Integration**: frontend uses real endpoints only when available; email adapter only when authorized test domain/sender; scanner never accepts offline or mock success as actual entry.
5. **Regression and audit**: all relevant tests PASS, including 2-scanner DB concurrency and role isolation, before any real event.
6. **Owner pilot gate**: privacy, backup/restore, HTTPS on real phones, domain/email provider, and owner go/no-go.

## Shared protocol for each Work agent
See `docs/26_AGENT_UPDATE_PROTOCOL.md`. Chat reply: **"Fatto."** + one sentence or at most 3 short bullets, or **"Bloccato."** + one blocker. All technical details, tests, PR, SHA and requests MUST be committed to `handoffs/agent-N/STATUS.md` on that agent's branch before replying.

**Agents cannot be triggered by a GitHub comment alone.** User must send the activation message to the specific Work chat. The agent must then read this board (on the `coordination/agent-protocol` branch until PR #8 is merged) and its PR comments and work autonomously without asking for minor approvals.

## No-go policies
- No self-merges, overwrites/force-pushes, secrets or live personal data.
- No payment or upgrading plans, no production deployment without owner approval.
- CI green verifies build/tests actually run, not live authentication, database atomicity, emails or physical camera.
