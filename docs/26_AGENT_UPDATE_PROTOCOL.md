# 26 — Agent updates, GitHub handoffs and integration rules
**Effective:** 2026-11-04 · **Coordinator:** ChatGPT project Night Life Event.
**Source of truth:** GitHub repository `f3deric0/night-life-event`.
This protocol supplements, without overriding, `AGENTS.md`, `docs/18_MULTI_AGENT_EXECUTION.md`, and confirmed owner decisions.

## Required short Work chat reply (every agent, every milestone)
A Work chat reply must be **very short**, with no transcript or long technical explanation.
- If completed: **Fatto.** followed by one sentence OR at most three short bullets on actual delivered work, the PR URL and a concise blocker if applicable.
- If blocked: **Bloccato.** followed by one short reason and the actionable next step.
- Never write **Fatto** for unexecuted code, unverified integrations, or simulated functionality presented as live.

**Example:**
> Fatto. PR #12: filtri dashboard e CSV implementati; CI verde. Backend DB ancora da collegare. Dettagli: `handoffs/agent-4/STATUS.md`.

## Required detailed GitHub handoff (same milestone, before short chat reply)
Each agent MUST update **`handoffs/agent-N/STATUS.md` on its own branch** and commit it along with code.
Include:
- Date, agent name, branch, PR URL, full head SHA and baseline commit.
- Files changed and owned responsibilities.
- Done, partially done, mocked/stubbed, not done — explicitly distinguished.
- Exact tests actually run, commands and exit status (or CI run URLs), NOT RUN/BLOCKED checks.
- Contracts provided/required, API paths, migrations, changes needed from other agents.
- Security/privacy risks, remaining blockers, next small actionable milestone.
- A 3–6 line summary for the coordinator, including requested decisions and whether PR is ready to merge.
Never place credentials, secret tokens or real guest data in handoff documents.

## Working and merging
- An agent works ONLY on its allocated branch/paths and does not self-merge.
- Prefer updating an existing PR and handoff to opening redundant PRs.
- Coordinate shared package, types, routes, lockfile, migrations and configs with Agent 1 / coordinator before editing.
- PR draft status means **not ready**. Green CI does not imply production readiness.
- Coordinator verifies all checks, conflicts, negative tests and contract consistency; user authorizes merges per the agreed workflow.
- Development/staging uses synthetic data until security and privacy release gates are satisfied.
- Do not deploy a real event workflow, send real emails, or turn on a paid plan without explicit owner approval.

## Area ownership beyond original three agents
- Agent 4: `src/lib/reporting/**`, `tests/reporting/**`, `docs/reporting/**`, `handoffs/agent-4/**`.
- Agent 5: `tests/e2e/**`, `tests/integration/**`, `tests/fixtures/**`, `qa/**`, `handoffs/agent-5/**`.
- Agent 6: `infra/**`, `scripts/ops/**`, `docs/ops/**`, `handoffs/agent-6/**`. Workflow additions require shared-CI review.
- Agent 7: `tests/security/**`, `audit/**`, `docs/security/**`, `handoffs/agent-7/**`.
- Agent 1 keeps ownership of backend APIs/schema/contracts and root config; Agent 2 owns guest/admin UI; Agent 3 owns mail, ticket/scanner services.
- Contract and data access changes must be cross-reviewed, not implemented in parallel independently.

## Near-term dependency and delivery priority
1. Preview UI: review Agent 2 PR #2, connect **preview-only** Vercel project when user installs Vercel connector or authorizes Git import; no real guest data.
2. Agent 3 PR #3: fix CI lint before merging; adapter stubs may continue to return 503 until backend exists.
3. Agent 1: real schema + RLS + secure invitation codes / registration, verification and RSVP; atomic DB RPC contract for Agent 3.
4. Agent 4: reporting query integration with authorized DB access.
5. Agent 5: extend test invocation and integration suite with synthetic fixtures, concurrency and permission gates.
6. Agent 6: staging environment/runbook; no production deployment until gated.
7. Agent 7: adversarial review, GDPR checklist, GO/NO-GO.
