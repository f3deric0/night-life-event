# NIGHT LIFE EVENT — THREE-CODEX-AGENT LAUNCH GUIDE
Version: 2026-11-04 · Coordination owner: the human project owner, assisted by the coordinating ChatGPT chat.

## Immediate objective
Ship a thoroughly tested full-stack pilot as far as practical today. No promise that production launch or real-world email delivery can be completed without credentials, domain verification, deployment, and physical-device tests. Prioritize a complete vertical slice over many unfinished screens.

## Must-read source of truth
- `README.md`, `AGENTS.md`, `docs/15_DECISIONS_ASSUMPTIONS.md`, `docs/16_API_AND_STATES.md`.
- `docs/18_MULTI_AGENT_EXECUTION.md` is the updated coordination protocol and supersedes the old recommendation to run only Phase 0.
- Specific requirements reside in `docs/01`–`17`; prompts for 3 agents in `docs/19`, `docs/20`, `docs/21`.

## Order, in six actions
1. Create a **PRIVATE** repository `night-life-event` on GitHub. Upload/unzip all Markdown files so the root contains `AGENTS.md` and `README.md`, with all files under `docs/`. Do not upload the .zip itself as a substitute for extraction.
2. Connect GitHub to **Codex Cloud** or open the repository in **Codex desktop** (connect GitHub to ChatGPT separately only if you want this coordinating chat to read repo content). Select **GPT-6.1 Terra, Medium, Standard speed** for the three Codex coding chats, if available. Check Settings > Usage; 3 parallel tasks consume from the same allowance.
3. **Agent 1 FIRST**: paste `docs/19_AGENT_1_BACKEND_PROMPT.md`; request a lightweight baseline commit with a runnable Next.js shell and stable API/types/schema draft; merge that bootstrap PR into `main` before Agents 2/3 start implementing. Keep Agent 1 on `agent/backend` after rebranching against baseline.
4. Start **Agent 2** from the new `main` into isolated `agent/frontend` and paste `docs/20_AGENT_2_FRONTEND_PROMPT.md`. Start **Agent 3** from the same `main` into isolated `agent/checkin` and paste `docs/21_AGENT_3_CHECKIN_PROMPT.md`.
5. Let each agent implement, run checks and open a PR against `main` without auto-merging. Each writes `handoffs/agent-X/STATUS.md`. Review and integrate PRs in order: backend/schema → guest/frontend → email/QR/check-in, resolving interface mismatches with the responsible agent.
6. Run integration instructions from `docs/23_INTEGRATION_AND_RELEASE.md`, test on actual iPhone/Android, export safe code archive to Google Drive and record remaining blockers.

## Rule
One GitHub repository, one shared `main`, **three isolated branches/worktrees/tasks**, no simultaneous edits to the same shared working directory. GitHub is version control. Drive is independent backup of docs and code snapshots, **not** the operational database.

## Do not commit
`.env.local`, passwords, service role keys, Supabase DB credentials, Resend keys, real guest identity records, production dump, QR secrets or private domain keys.

## User actions requiring real-world accounts
Create accounts for GitHub, Supabase, Resend, Vercel; configure domain/sender; provide secrets *only through protected environment secret settings*; authorize deployment; test camera and email on real devices. Agents cannot assume these are done.
