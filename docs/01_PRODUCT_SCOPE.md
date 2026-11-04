# 01 — Product vision, scope and personas

## Problem
Nightlife organizers currently manage invites across chats, spreadsheets and door lists. This produces duplicate entries, incomplete attendee information, unverified addresses, uncertainty about RSVP vs attendance, and fragmented reports across multiple nights. The product should give a single auditable flow from issued invitation to real door check-in.

## Product promise
A responsive guest experience and a protected event-management console that supports repeated events. Not a public ticket marketplace, payment system or CRM in the initial release.

## People and access
- **Guest:** sees public event details, enters invitation code, registers, validates email, explicitly RSVP=YES/NO, accesses ticket once issued. No password/account required for guests in V1.
- **Organizer/admin:** username/password login; owns all event settings, invitations, guest management, email status, exports, staff assignment, and scanner access for its organization.
- **Door staff:** username/password login; event-scoped ticket scanner, limited guest lookup and documented manual override. Cannot export whole database, view unrelated events or edit email templates.
- **Promoter (later or restricted V1 metadata):** owns invite-code attribution; does not need a separate login in MVP. Per-promoter reports can be shown to admin.

## Confirmed requirements
Multi-event; personal/shared invitation codes; two distinct confirmations; verification email immediately; ticket email two calendar days before event; smartphone scanner; distinct RSVP/verified/admitted/check-in states; discreet private-access button; username/password for all staff; Google Sheets or Excel usable as export; admin dashboard with statistics; prevention of duplicate scan.

## MVP / V1
1. Create/edit/cancel events and capacities.
2. Issue personal one-use and shared N-use invite codes; collect invited guests through a public mobile form.
3. Verify email address through single-use short-lived email action; do not conflate it with RSVP.
4. RSVP YES/NO as separate explicit action, with time-stamped history.
5. Issue unique ticket for admitted YES response; email it two calendar days before at 10:00 local time (or promptly if eligibility occurs later).
6. Scan at door through authenticated staff web app; one successful first entry per ticket; manual search/override with audit.
7. Organizer-only dashboard of event funnel, arrival progress, promoter/code contribution and downloadable CSV/Excel. Multi-event overview.
8. Configure roles, environment variables, email delivery monitoring and basic privacy/security procedures.

## Intentionally postponed
Payments, card processing, table bookings, VIP pricing, live WhatsApp bulk sending, NFC, offline scanner mode, full promoter portal, native iOS/Android apps, anti-fraud facial identification, ticket resale, advanced marketing automation or cross-event profiling.

## Design goals
- Guest completes signup in ~60–90 seconds excluding time spent checking email (aspiration, not a guaranteed benchmark).
- User-facing interface elegant, readable, low-friction on phones, accessible by keyboard and screen reader where possible.
- Staff gets immediate, unmistakable accepted/already-used/invalid feedback and can operate with several devices at the same time.
- All numbers in dashboard have explicit denominators and can be reconciled with event records.

## Success criteria
- No QR issued for unverified, RSVP=NO, revoked or waitlisted registration.
- Valid eligible ticket can successfully check in **once**, including races between devices.
- Owner can identify a guest state and track each email send or failed attempt.
- Export results match database filtered records and respect access roles.
- No guest can reach private attendee lists by knowing a hidden URL or guessing an ID.

## Language & geography
Product docs in Italian, code and engineering instructions in English. UI text configurable; initial V1 can be Italian-first. Each event stores an IANA timezone (default configurable, do not assume UTC). Applicable local age and venue policies must be confirmed per event/venue before production use.
