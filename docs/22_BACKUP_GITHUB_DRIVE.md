# 22 — GitHub + Google Drive backup, and data recovery

## Non-negotiable backup distinction
- GitHub PRIVATE repo = authoritative source for source code and version history. Use branches/PRs/commits and protected main. GitHub alone is not an independent backup against compromised/deleted accounts.
- Google Drive `night life event` = copy of Markdown docs, approval logs, release ZIP and Git bundle archives (not a working live DB).
- Supabase PostgreSQL = live operational guest/event data. Real database backups, encryption and periodic restore tests are a **separate** track; do not upload raw personally identifiable guest data or secrets to shared Drive.

## Drive folder model
```
night life event/
  README.md
  AGENTS.md
  MULTI_AGENT_START_HERE.md
  docs/ (requirements, prompts, decisions)
  agent-1-backend-backup/
  agent-2-frontend-backup/
  agent-3-checkin-backup/
  releases/
  db-backups/ (ONLY encrypted, access-controlled backups if approved)
```
Create agent folders and `releases` folder. One status/handoff file per agent can be uploaded to its Drive folder after each PR. Do not attempt to live-sync every file on every keystroke.

## Snapshot protocol (after each integrated milestone and before launch)
1. Verify repository status and merged commit SHA on `main`. Do not back up an unreviewed branch as a final release.
2. Export code snapshot from GitHub (Download ZIP) or local Git archive. Tag a release, e.g. `pilot-v0.1`.
3. For comprehensive Git history use a Git bundle (requires local Git): `git bundle create night-life-event-YYYYMMDD.bundle --all`; verify with `git bundle verify night-life-event-YYYYMMDD.bundle`.
4. Upload archive and a `RELEASE_NOTES.md` with version, SHA, test results, remaining blockers into Google Drive `releases`.
5. To restore code, clone GitHub normally or `git clone night-life-event-YYYYMMDD.bundle recovered-night-life-event` from trusted archive.
6. Re-run dependency installation, lint, typecheck, tests and build. Restore secrets from a dedicated password manager/secret manager, **not** from Drive Markdown.

## Database backup policy
- Use Supabase's supported managed backups or a securely run `pg_dump`/restore flow, aligned to plan and RPO/RTO. Do not assume free tier includes automatic daily backups/PITR. Verify the current plan, size limits and actual restore support.
- Encrypt exported backups before offsite storage; restrict account access and audit restore permissions. A database dump might include guest names/email/DOB and must be protected under GDPR obligations.
- For pilot testing use synthetic records and seed scripts. A seeded demo DB is not a production backup.
- Test at least one restore into a separate protected test DB before the first real event. Document successful result; never blindly overwrite production.

## Scope of GitHub connector
Connecting GitHub to **ChatGPT** allows the coordinator to search/read authorized repository files in supported surfaces. That connection is separate from **Codex Cloud environment** repository permission and must not be assumed to make the environment ready. Check both configurations.
