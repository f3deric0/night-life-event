# 04 — Discreet private entrance, authentication and authorization

## Owner decision
The public site should display a **small, low-profile `Staff Access` button/link** (e.g. footer icon/text). On click, show **username + password**. Once logged in, users enter admin dashboard (authorized admin) or smartphone scanner (authorized door staff). This is not a publicly listed "Admin" menu.

## Security principle
**Not linking to `/admin` does not protect it.** All server routes, API handlers, database reads/writes and storage objects must enforce authentication/authorization irrespective of URL, browser UI state or button visibility. Never ship `/admin` or `/staff/scanner` with unconditional demo data in production.

## Suggested identity implementation
Supabase Auth natively signs in with **email + password** rather than arbitrary username + password. To satisfy the owner-facing username UX without building a weak custom password database:
1. Provision staff account through an **admin-controlled** flow, with unique normalized `login_username`, private auth email and role membership. Disable public staff signup.
2. Staff submits username and password over TLS to a **server-side** login endpoint. Server resolves username to auth identity/email using *server-only* privileged lookup, with username/IP rate limiting, account lockout/delay policy and uniform generic failure response. Never expose the username→email mapping endpoint publicly.
3. Server submits email/password to Supabase Auth using supported secure SSR/session APIs. Supabase Auth verifies the password and manages identity/session; app never stores plaintext or recoverable password.
4. After session creation, server loads active membership and allowed organization/event scope. Use validated session cookies (HttpOnly, Secure, SameSite as applicable), revalidate permissions server-side, authorize all operations and redirect by role.
5. Prefer staff MFA (especially admin) once configured and tested. Document fallback/recovery and password reset processes.

Avoid designs that expose a public username lookup or use a single shared staff account. Test how Supabase's current SSR APIs support cookie/session propagation before coding. If custom mapping introduces undue complexity, report trade-offs but **do not silently change the required visible username field**.

## Roles and principle of least privilege
| Role | Authorized | Forbidden |
|---|---|---|
| `owner`/`admin` | organization dashboard; CRUD events, codes, guests, staff, communications; scanner; reports | access another organization's records |
| `staff` | event-assigned scanner, limited guest lookup, recorded manual override | cross-event lookup, bulk guest export, staff management, event edits, invite-code generation |
| anonymous/guest | public registration and token-scoped own guest actions | staff routes, organization PII, admin APIs, scanner APIs |

Use organization_id and event_id on sensitive tables. Check membership on *every* mutation. Enable RLS; service-role/secret credentials remain **server-only** and privileged routes still explicitly verify user permissions.

## Security controls
- TLS; environment variables in provider dashboard, no secrets in Git/Drive, log redaction.
- Store auth passwords with managed provider, never roll your own hashing; block weak passwords, reset with verified email and expiring tokens.
- Brute-force and credential stuffing protection: per-IP/username rate limits, generic errors, monitoring; CAPTCHA or challenge on abusive public code entry.
- Authorization tests for guessed URLs, direct fetch to every protected API, staff trying admin operations, staff accessing unassigned events, owner accessing other organizations.
- Application auth sessions expire; implement logout, user disable, membership revocation effective promptly, no open redirect.
- Prevent CSRF where cookies authorize mutations; validate origin and CSRF strategy, use POST for mutations; add secure headers.
- Regular audit log for admin changes, account operations, manual check-ins, code revocations and export actions; no logging of passwords/tokens.
- Avoid HTML/SQL injection via schema validation, parameterized queries, template escaping and CSP where practical.
- QR and email verification tokens: cryptographically random; hash in DB; do not embed PII; single-purpose and event-bound.
- Safe error screens must not leak guest identity or valid private usernames.

## Security acceptance gate
Do not label product "ready for an event" until automated negative authorization tests, scanner concurrency tests, credential/session tests and an actual phone + HTTPS test have passed. Keep a staging environment using fake data.
