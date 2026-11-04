# 14 — Codex model choice, credit saving and development protocol

**Checked:** 2026-11-04. Model picker, subscription limits and exact costs can vary by product/account/rollout. API token pricing is **not** the same as ChatGPT subscription usage. Check current info in ChatGPT **Settings → Usage** or Codex usage/billing screens.

## Recommendation
- **Default:** GPT-6.1 **Sol**, **Medium** reasoning, **standard speed**. Balance of coding quality and usage for multi-file Next.js/Supabase work; this is the official recommended coding family for cost-aware projects.
- **Small scoped edits** (copy, UI tweaks, one file): **Luna** or **Terra**, Low/Medium if supported.
- **Complex bugs, security architecture, race conditions**: Sol High/Extra High, or a *targeted* second-pass review with **Astra**. Do not spend strongest model allowance on all tasks by default.
- Model options and reasoning knobs may differ inside Codex. Use nearest available model; don't block project merely because exact label is missing.

## How not to waste credits
1. Give Codex **a Git repo with persistent specs** (`AGENTS.md` + docs) and ask it to read only relevant files.
2. One *vertical slice* per task: Phase 0 mock UI, then database, then private auth, then verification/RSVP, then ticket email, scanner, reporting. Avoid "build entire product in one go".
3. State measurable acceptance criteria and required tests up front, including non-goals.
4. Ask for one plan and one implementation; no repeated 10-paragraph instructions. Fix errors by sending actual terminal output/diff rather than rewriting the entire story.
5. Use mocked adapters and synthetic fixtures before spending provider credits on email/hosting.
6. Commit after each phase; branch/PR reviews are useful. Read summaries and file diffs instead of manually replaying the entire prior conversation.
7. Reuse existing task for small follow-ups; start a new task when its scope genuinely differs. Ensure changes are committed/pushed before switching workspaces.
8. Don't use excessive thinking/ultrafast blindly. Compare test pass rate and time spent correcting bugs before optimizing on perceived model price.
9. Keep `AGENTS.md` **short and operational** (avoid stuffing many duplicative rules); docs own the detailed specs.
10. Track deployment/cloud/provider costs separately from Codex usage.

## Practical sequence (the first four commands/prompts)
- Prompt 1: `PROMPT_CODEX_FIRST.md` -> Phase 0 working UI scaffold (mock only).
- Prompt 2: `Phase 1, schema/claims/RLS only, tests first; read docs 05,06,16. No email.`
- Prompt 3: `Phase 2, username/password staff login and role restrictions, read doc 04; no public data exposure.`
- Prompt 4: `Phase 3, actual guest registration + email verification + separate RSVP, read docs 02,07,16; mocked sender allowed.`

## Source-backed current guidance
- OpenAI code generation: https://developers.openai.com/api/docs/guides/code-generation
- OpenAI model selection: https://developers.openai.com/api/docs/guides/model-selection
- Codex ChatGPT plan: https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan
- Usage limits: https://help.openai.com/en/articles/20001625-understanding-chatgpt-and-codex-usage-limits
- Codex Cloud: https://help.openai.com/en/articles/20001545-using-codex-cloud
- Iterative workflow/AGENTS.md: https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex

## Subscription and provider cost notes
A low-traffic mock can often begin without paid backend tiers, but **free tier ≠ production guarantee**. Provider charges and service limits can change, and volume/quotas matter. Plan separate categories for domain, hosting, DB/backups, email sends, monitoring, and optional tools; verify pricing directly before launch.

## Security-minded review budget
A cheaper coding model can save usage on UI but a security mistake can cost more than premium review. Allocate a stronger model/code review to authentication, RLS, email verification tokens, quota races, ticket redemption, GDPR-related exposure and deployment settings. Tests still required; AI review is not a security certification.
