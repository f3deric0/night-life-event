# 09 — Dashboard, analytic definitions and reporting

## Views
**Global owner dashboard:** next/recent events, registrations, email deliveries, waitlists, attendee conversion by event and promoter; alerts on mail failure/near capacity. **Event dashboard:** funnel, key statuses, arrivals over time, ticket delivery, guest table and last check-ins. **Staff scanner dashboard:** only authorized event, recent scans and accepted count for current shift.

## Status dimensions — never collapse into one
- `email_verified`: yes/no.
- `rsvp`: unanswered/yes/no.
- `admission`: pending/admitted/waitlisted/cancelled.
- `ticket`: absent/issued/queued/sent/revoked.
- `check_in`: not_yet/entered. Determine no-show **only after event completes**.

## Exact KPIs and denominators
| KPI | Definition / caution |
|---|---|
| `codes_created` | count issued invite codes; not number of people invited for shared codes |
| `registrations_started` | only if instrumented with appropriate privacy-safe event; otherwise unavailable |
| `registrations_submitted` | number of event registrations recorded (unique per normalized email as policy) |
| `email_verified_count` | count registrations with valid `email_verified_at` |
| `verification_rate` | verified / submitted; define zero denominator as N/A |
| `rsvp_yes_count` | verified registrations with current YES regardless of waitlist, separated by admission |
| `rsvp_no_count` | verified registrations with NO |
| `rsvp_unanswered_count` | verified registrations without RSVP |
| `rsvp_yes_rate` | verified YES / verified registrations; if useful also display response rate `(YES+NO)/verified` |
| `admitted_count` | current YES with reserved place |
| `ticket_emailed_count` | email job actually sent for current active ticket, separately track delivered and bounces |
| `checked_in_count` | distinct successful checkin rows (not total scan attempts) |
| `arrival_rate` | checked-in / admitted YES, while event active |
| `no_show_rate` | after completion: (admitted YES without checkin) / admitted YES, note exclusions/cancellations |
| `shared_code_performance` | verified redemptions, YES, admitted and checkins by code source |
| `promoter_performance` | attributed registration/verified/YES/checkins where promoter label present |

## Counts are not all observable
- You cannot claim "invites sent" from codes copied into WhatsApp unless actual deliveries are tracked by an integration.
- Website events or email-open pixels are imperfect and potentially privacy-invasive; do not make "opened" a required ground-truth KPI.
- Tickets "sent" do not mean inbox "delivered". Email provider webhooks provide distinct statuses.
- Do not call guests "did not attend" while event is still in progress.

## Filters
Global: event/date range, venue, status, promoter, code type. Per-event: email status, RSVP, admission, ticket, checkin time and search. Charts should include timestamp of last refresh, clear local timezone, consistent units.

## Guest table
Name, surname, masked email when possible, registration timestamp, code source, email verified, RSVP, admission, ticket status, checkin, last activity. Actions (admin only) for resend/record corrections/audited cancellation/approved export; no data shown to anonymous visitors. Support pagination and efficient search indexes.

## Export to Excel / Google Sheets
V1: export a filtered **CSV** (Excel-compatible) plus option for XLSX later when needed; do not assume a CSV is an `.xlsx`. Protect against spreadsheet formula injection. Event-scoped download with current user authorization and export logging. V1+ optional read-only Google Sheets automatic sync of selected fields; use service account or OAuth securely, never editable as source-of-truth. Never send raw ticket or verification tokens to Sheets.

## Example funnel (illustrative only)
300 unique codes created, 220 registration submissions, 196 email verified, 174 YES, 170 admitted, 131 physically entered. These values are dummy data, not live statistics. The total number of recipients for shared codes may be unknown.
