# 23 — Integration protocol, checklist, and optional coordinator prompt

## Merge order and dependencies
1. Agent 1 bootstrap PR merged to `main`; contains stable types/routes. Agents 2/3 branch from this exact commit.
2. Agent 1 backend implementation PR: schema/auth/contracts; apply migrations to dedicated test DB if approved.
3. Agent 2 frontend PR: validate routes, auth redirects and contract compatibility; fix in its branch if mismatch.
4. Agent 3 mail/checkin PR: verify server adapter wiring, ticket creation, scheduled email and atomic check-in RPC; fix in its branch if mismatch.
5. After reviewing all changes, create integration branch for cross-cutting fixes; let Agent 1 own shared root changes. Do NOT force merge conflicts or bypass required tests to create a green CI.

## Required full-flow pilot
- Create fake event as admin and generate individual + limited shared codes.
- Register fake guest; fake inbox receives verification email; expired token fails and resend works; clicking verifies email only.
- RSVP YES separately, pass admission cap; RSVP NO never issues ticket; full capacity waitlist blocks ticket.
- At T-2 local days, job creates/sends personal ticket once; RSVP changed to NO cancels ticket; resend does not double-send.
- Log in as authorized staff on mobile; camera scans valid QR from another phone and first scan succeeds; repeat fails; wrong event and unassigned scanner fail. Two concurrent requests must permit only one first entry.
- Dashboard counts match DB; CSV export roles and filtering verified; no-shows computed after event end only.
- Browser: 360px phone width, iOS Safari and Android Chrome camera/HTTPS tests; network loss; email link open/click from mobile app.
- Security: authorization on private API; staff cannot access admin list; unauthenticated cannot query guests; RLS tests; abuse/rate limit; secrets grep and logs redaction.
- Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` (or equivalent documented scripts). Record outcomes, no fictional green status.

## Deployment gate
Deploy first to isolated staging HTTPS domain after owner enables and enters vendor credentials into secure secret store. Verify sender domain/SPF/DKIM and real test email, cron delivery, DB migration, scanner camera. Enable production only after GDPR/age policy review, security review, backup/restore test and real devices checked. Missing prerequisites must remain labeled BLOCKED.

## Integration prompt to reuse with Agent 1 after the PRs are available
```
You are the backend owner helping integrate Night Life Event. Read AGENTS.md,
docs/18_MULTI_AGENT_EXECUTION.md, docs/23_INTEGRATION_AND_RELEASE.md,
and all three handoffs. Compare the merged backend, frontend and mail/checkin
pull requests against the frozen contracts. Fix ONLY integration mismatches in
your owned files; for another owner's files write an exact fix request.
Run lint, typecheck, tests and build; execute or script the E2E fake-guest
workflow, two parallel check-in calls, permission-denied scenarios and CSV
export. Clearly mark absent credentials, missing tests or live-service checks
as BLOCKED rather than passed. Prepare a clean integration PR, plus a factual
release checklist and safe backup instructions. Do not deploy production or
spend money without my approval. Report the result in Italian.
```
