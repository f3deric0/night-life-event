# 13 — Owner's step-by-step setup (non-developer guide)

**Goal:** give Codex the files and a place to work. You don't need Bloomberg, Docker, paid API access or a professional scanner to start a **mock prototype**. Do **not** put actual passwords or provider keys in Google Drive or in Codex chat.

## Step A — Preserve the documentation
1. Open Google Drive folder `night life event` and inspect this documentation bundle.
2. Keep this Drive folder as the project's human-readable archive; **code must live in Git**, not scattered among editable Drive copies.
3. Download the accompanying ZIP archive if convenient (all files inside are Markdown); unzip to your Windows workspace.

## Step B — Decide local versus cloud workflow
**Recommended for beginner:** create a private GitHub repository and use Codex connected to it, either in the Codex desktop app or Codex Cloud. This preserves version history and makes future sessions coherent.

**Option 1: Codex app + local folder** (if supported on your device):
1. Install/open an official Codex app compatible with Windows, sign in to your ChatGPT account.
2. Create a Windows folder e.g. `Documents\\Projects\\night-life-event`, unzip the Markdown bundle into it.
3. Initialize Git repository in that folder, create private GitHub remote and push; easiest using GitHub Desktop or IDE Git integration.
4. Open this folder as the Codex project. Verify `README.md` and `AGENTS.md` appear at repository root.
5. Choose a model, paste `PROMPT_CODEX_FIRST.md` content and let Codex implement **Phase 0 only**.

**Option 2: Codex Cloud / browser:**
1. Create a **private** repository named `night-life-event` in GitHub; upload markdown root files and `docs/` preserving paths. No `.env.local`, `.git` credentials or personal data.
2. In Codex (e.g. via ChatGPT/Codex entry), sign in, connect GitHub and allow access specifically to that repo.
3. Set up and publish a Codex Cloud environment for the repository if prompted; choose Node.js-compatible setup, with npm install/build scripts defined after Phase 0.
4. Create a task for that repository and paste the first prompt. Ask to make changes on a branch or reviewable changeset.
5. Inspect diff, tests and run/preview. Apply or merge changes only after review. Continue next milestone on updated main branch.

**If a menu or model isn't visible:** availability varies with account/rollout. See official Codex setup docs. Don't buy credits before checking included usage or ask Codex to create an account for you.

## Step C — How to make the GitHub repository
1. Go to https://github.com/ and sign in or create an account.
2. Click **New repository**; name `night-life-event`; select **Private**.
3. If uploading files manually, place `AGENTS.md`, `README.md`, `PROMPT_CODEX_FIRST.md` at root and all `docs/` docs in its folder. GitHub UI may not preserve folder hierarchy on single-file upload; easiest with GitHub Desktop, VS Code or `git` CLI.
4. Confirm you can view `AGENTS.md` and `docs/04_PRIVATE_ACCESS_SECURITY.md` through repository browser.
5. Never upload real data, .env.local or API secrets.

## Step D — Codex first use
1. Open the project/repo; select **GPT-6.1 Sol, Medium reasoning, standard speed** if available.
2. Paste **exact prompt** in `PROMPT_CODEX_FIRST.md` (English instructions but it asks reports in Italian).
3. Review generated local working app. You should see elegant guest screens + small Staff Access control + protected admin/scanner placeholders or isolated demo preview. These are not yet connected to real credentials, email or camera.
4. Ask for a screen-by-screen quality and accessibility pass (same phase if needed), but don't repeat the full initial prompt.
5. Save/commit changes. Advance to next phase only after checks run.

## Step E — Later: create provider accounts (not needed for first mock)
- Supabase https://supabase.com/ — new **development** project; store connection values **only** in private environment config. Separate development and production projects before real data.
- Resend https://resend.com/ — register, verify sender domain and configure transactional email for testing. A verified sending domain improves reliability; send tests only to permitted addresses.
- Hosting e.g. Vercel https://vercel.com/ — connect GitHub project, set environment variables in dashboard, use staging/preview before production.
- Domain/DNS provider (when public launch planned) — choose brand/domain only after name/trademark checks.
- Google Sheets export: no credential required for manual CSV; automatic Sheets sync requires an authorized Google account/service identity and selected destination, not user-wide access by default.

## Step F — Your first real rehearsal
1. Create one fake event for 20 test guests (consenting test emails only) and 2 staff accounts with different roles.
2. Generate one personal code and a shared code with 3 redemptions.
3. Complete signup->email verify->RSVP YES->QR send using test event date/time or safe email-job override.
4. Open scanner on two real smartphones using HTTPS, try simultaneous scan, verify exactly one success.
5. Test cancelled ticket, wrong event, unassigned staff, lost connection and manual override.
6. Review dashboard counters and exported CSV, check privacy notice and backup plan.

## Command snippets (if comfortable with terminal)
```bash
# After Node.js LTS and Git are installed, within the local repo:
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```
Exact scripts depend on what Codex creates; don't blindly run commands until the project `package.json` exists. VS Code can be used to inspect code but is not strictly required if Codex Cloud/repo workflow works.

## What the owner should **not** do
- Do not share passwords in chat or a .md file.
- Do not publish repository as public with guest personal data.
- Do not use an unprotected secret admin URL as the only protection.
- Do not connect real email lists before privacy/compliance tests.
- Do not assume a beautiful mock dashboard means the underlying signup, QR and scanner are operational.
