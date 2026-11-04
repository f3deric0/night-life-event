# 18 — Multi-Agent Execution Contract (2026-11-04)

## Organizational model
- Coordinator: current ChatGPT conversation; receives summaries and pull request links. Does not assume that different Codex tasks see each other's uncommitted files. No fourth coding agent required.
- Agent 1 `agent/backend`: backend, schema, secured auth, API contracts, repository bootstrap and eventual integration support.
- Agent 2 `agent/frontend`: guest/public website, private admin dashboard and staff login pages, reusable UI and front-end API client.
- Agent 3 `agent/checkin`: email delivery/scheduling, ticket issuance/QR, check-in endpoint, smartphone scanner UI.
- Each agent uses Codex GPT-6.1 Terra Medium if available; model selection is a UI setting, not something a prompt can enforce.

## Bootstrap gate — DO NOT SKIP
Only Agent 1 launches before a working repository exists. Agent 1 does a short **bootstrap PR**: Next.js TypeScript app, lint/typecheck scripts, Tailwind, .gitignore, `.env.example`, initial routes/contracts in `src/lib/contracts/**`, rough database migration interfaces, and fake demo data only. Merge bootstrap to `main`. Then start 3 tasks from exactly that Git commit: Agent 1 backend implementation, Agent 2 frontend, Agent 3 email/QR/check-in. If an environment can't use branches/worktrees, use three Codex Cloud isolated tasks + independent GitHub PRs; do not share the same writable checkout.

## Exclusive ownership / file conflict policy
| Owner | WRITE permitted | READ anything | Avoid modifying |
|---|---|---|---|
| Agent 1 | `supabase/**`, `src/lib/db/**`, `src/lib/auth/**`, `src/lib/events/**`, `src/lib/invites/**`, `src/lib/registrations/**`, `src/lib/contracts/**`, `src/app/api/events/**`, `src/app/api/invites/**`, `src/app/api/registrations/**`, `src/app/api/staff-auth/**`, backend tests, `handoffs/agent-1/**` | yes | guest/admin UI, scanner, mail/ticket code |
| Agent 2 | `src/app/(public)/**`, `src/app/admin/**`, `src/app/staff/login/**`, `src/components/guest/**`, `src/components/admin/**`, `src/components/ui/**`, `src/lib/ui-client/**`, `src/app/globals.css`, `src/app/layout.tsx`, UI/E2E tests, `handoffs/agent-2/**` | yes | migrations, backend APIs, scanner, mail/ticket code |
| Agent 3 | `src/lib/mail/**`, `src/lib/tickets/**`, `src/lib/checkin/**`, `src/app/api/cron/**`, `src/app/api/email-webhooks/**`, `src/app/api/checkin/**`, `src/app/api/tickets/**`, `src/app/staff/scanner/**`, `src/components/scanner/**`, related tests, `handoffs/agent-3/**` | yes | auth, migrations, registration API, guest/admin UI |

Shared root files `package.json`, lockfile, TypeScript/Tailwind/ESLint configs, `AGENTS.md`, `README.md`, and `docs/15_DECISIONS_ASSUMPTIONS.md`: **Agent 1 owns writes** after bootstrap. For Agent 2/3 dependency needs, message Coordinator with exact package names; submit a small change request to Agent 1. Never overwrite another agent's files. If unavoidable, prepare a separate request, not a conflicting commit.

## Integration API contract, owned by Agent 1
Contract must be stabilized early in `src/lib/contracts/**` and `docs/24_API_CONTRACT_FREEZE.md`, including:
- `Event`, `InviteCode`, `Registration`, `Guest`, `Ticket`, `CheckinResult`, `DashboardMetrics` and state enums.
- Public endpoints: code validation; registration; email verification; RSVP; personal ticket status. Explicit auth errors.
- Private endpoints: staff login/logout/session; event management; invite code generation; guest list; metrics and export.
- Agent 3 check-in and mail endpoints call server-side services, do not duplicate authorization or schema.
- Full API semantics match `docs/16_API_AND_STATES.md`. Not invented by UI agent.
- Agents 2 and 3 can develop with mock adapters while waiting for backend functionality, but must later switch to the real contract. Mark stub endpoints clearly.

## Required delivery and handoff for EACH agent
Write `handoffs/agent-N/STATUS.md` with: branch, PR URL, commit SHA, last update, files changed, working features, tests actually executed with exact exit status, integration endpoints consumed/provided, missing credentials, blockers, known bugs, and requests to other agents. Update before PR is ready. Never mark mock functionality as production ready. All three report DONE / BLOCKED / NOT STARTED for each milestone.

## Collaboration protocol
1. No agent may merge its own PR without review/owner authorization.
2. No rewriting history of another branch, forced pushes, or unreviewed pushes to main.
3. If Agent 2 needs an API change, record it in its handoff and ask Agent 1. If Agent 3 needs DB RPC/check-in fields, ask Agent 1 to add schema migration/RPC; Agent 3 owns the caller/route, Agent 1 owns the database operation.
4. For the first end-to-end test, use **only fake identities** and test email inboxes with authorized control. Do not load real guest PII until a privacy review, access control and backups are ready.
5. Make small commits and check `git status` before and after changes; rebase/merge carefully from `main` when bootstrap/other approved PRs land.
6. Deploy staging first, then production after security/privacy/phone testing. No credit card or paid resource provisioning without owner approval.

## Success gate for a usable pilot
- Admin login with username+password; no staff self-signup; role and event scoping enforced server-side and by RLS where appropriate.
- Create event and limited shared/personal invitation; public guest registers; immediate verification email succeeds; then explicit RSVP yes; only admitted RSVP yes gets active ticket.
- Scheduled email two event-local calendar days before; late confirmations handled; idempotent retries.
- Real QR decoded from phone camera over HTTPS; server rejects second scan, expired/revoked/wrong-event ticket, without race conditions.
- Dashboard accurately separates registration, verified email, RSVP, tickets, check-ins, no-show after event; CSV export authorized.
- Tests executed, passed/failed logged, browser smoke test + two-device gate, no secrets in Git or Drive.
