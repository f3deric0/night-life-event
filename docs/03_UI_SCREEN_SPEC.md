# 03 — Page-by-page UI/UX specification

## Visual direction
Premium nightlife without excessive neon: dark/navy or charcoal backgrounds, restrained warm accent, high contrast and legible typography. Mobile-first, clean hierarchy, clear status chips, restrained transitions. Guest pages should feel like a polished invitation, not a corporate form. Dashboard favors high-density clarity and accessibility over decorative charts. Mock brand "NightList" is provisional.

## Public guest routes
| Route (illustrative) | Purpose | Main elements | Edge/empty states |
|---|---|---|---|
| `/` | Landing / event introduction | featured event(s), invitation-code input, discreet footer `Staff Access` | invalid code |
| `/e/[slug]` | Event landing | poster, title, date, location, policies, invite code or prefilled link | closed/cancelled/full |
| `/e/[slug]/register` | Registration | first/last name, email, optional age fields, consent notice, continue | quota reached, duplicate, bad input, error retry |
| `/check-email` | Waiting | resend link (cooldown), change address workflow | provider outage, expired link |
| `/verify` | Verify email | explicit verification button; POST verification | expired / reused token, success |
| `/rsvp` | Separate participation decision | YES/NO, event details, admission outcome | waitlisted, expired access link, cutoff reached |
| `/status` | Guest status | verified, RSVP, admitted/waitlisted, ticket dispatch info | no login/secure access token |
| `/ticket` | Ticket after issuance | QR, guest summary, venue/time/instructions | not issued, revoked, event changed |

Navigation must not expose another guest's data. Status/ticket deep links use single-purpose server-validated credentials. Sensitive data must not be in URLs except securely generated bearer tokens, which require leakage mitigation (e.g. Referrer-Policy, no third-party scripts on token routes, token expiry/rotation).

## Private staff login
- **Small footer link** `Staff Access` (`/staff/login`) with low visual prominence but accessible label and focus state. Link optionally omitted from social/marketing navigation.
- Login screen fields: **username**, **password**; password visibility toggle; error with no username/account enumeration; forgot-password assisted recovery (secure provider email procedure), link back to public site.
- After authentication, server checks membership + organization + role; admin redirected to `/admin`, scanner staff redirected to `/staff/scanner`.
- Private routes must show neither data nor mock data to unauthenticated users in production. Every API enforces same access rules; route hiding is cosmetic only.

## Admin routes
| Route | Main UI & actions |
|---|---|
| `/admin` | Organization dashboard: summary cards, list of upcoming events, comparative event KPIs, alerts (mail failures, waitlists, nearing cap) |
| `/admin/events` | list with draft/open/closed/cancelled state; create, duplicate, sort, filter |
| `/admin/events/[id]` | event overview, settings, capacity, timeline, funnel, progress, editable date/timezone with warnings |
| `/admin/events/[id]/guests` | searchable/filterable table, email verification, RSVP, admission, ticket, check-in, timestamps, authorized admin corrections |
| `/admin/events/[id]/invites` | generate personal/shared codes, quantity, quotas, expiration, promoter/source tagging, copy/csv download, revoke |
| `/admin/events/[id]/emails` | email 1/2 counters, queued/sent/delivered/bounced/failed, retry actions, template preview |
| `/admin/events/[id]/checkins` | live gate summary and scan attempts, manual audit, possibly link to scanner |
| `/admin/reports` | multi-event comparisons, conversion and exports |
| `/admin/staff` | invite/deactivate staff, event assignment, roles, sessions/audit summaries |
| `/admin/settings` | organization, logo, message templates, privacy links, default timezone |

Admin header has event selector, filters and profile/logout. Charts must have accessible text/table equivalents; distinguish 0, null, pending and no data. Every destructive or event-affecting action requires confirmation and appropriate authorization.

## Scanner route `/staff/scanner`
- Role checked at server. Event selector shows **only authorized events**, highlights gate window.
- Big camera view with permission and HTTPS guidance; scan aim frame; torch option if supported; optional sound and vibration.
- Large colored result area (not color-only), guest display name, valid/duplicate/revoked/other, relevant timestamp, action to dismiss/scan next.
- Prevent accidental rapid repeat submissions; backend transaction still protects against duplicates.
- Manual search fallback by name/email (limited result set), requires ID check and explicit reason/confirmation; logs actor, timestamp, reason.
- Offline state: obvious "Connessione assente — non validare" warning in V1; no local pass-through.

## Responsive behavior
- 320px+ mobile layouts; avoid horizontal scrolling on guest forms.
- Touch targets sufficiently large for doorway use; scanner must work in low-light use and slow mobile networks.
- Keyboard navigation, visible focus, inputs with labels, error summary, proper contrast, locale/timezone formats.

## Copy examples (Italian)
- "Controlla la tua casella email per verificare il tuo indirizzo." 
- "La tua email è verificata. Confermi che parteciperai?" 
- "Sei in lista d'attesa: non hai ancora un biglietto valido." 
- "Il tuo biglietto arriverà il [data] alle 10:00." 
- "Biglietto già utilizzato alle [ora]. Non autorizzare un secondo ingresso."

## Instrumentation needed
Record user-visible stage transitions without placing name, email, DOB, token or precise address in general-purpose analytics. Compare the event funnel from database business events, not intrusive web trackers.
