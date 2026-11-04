# 08 — Unique QR ticket, authenticated scanner and safe check-in

## QR: invitation code vs entry credential
Invite codes authorize registration (may be one-person or shared). They are **not** entry QR codes. Each admitted YES registration gets one distinct active ticket with a cryptographically random bearer credential. The QR encodes a minimal URL/token, not name, surname, email or DOB. Server stores token hash (e.g. SHA-256 of high-entropy random secret). Possession of QR is equivalent to presenting a ticket; organizer may also require name/ID verification.

## Ticket lifecycle
`not_issued -> issued -> queued_for_email -> emailed -> checked_in` or `revoked`. Waitlisted/NO/unverified registrations stay `not_issued`. Event cancellation, RSVP NO, or explicit admin invalidation revokes ticket. If ticket is reissued, revoke previous active token first. Ticket validity always evaluated live against current registration/event state.

## Scanner hardware/software
- Use existing smartphone Android/iPhone camera through authorized browser page `/staff/scanner`; no separate handheld scanner or native app required.
- Works over HTTPS with browser permission and active internet connection; iOS Safari/Chrome permissions may vary.
- Can use maintained QR decoding library (`html5-qrcode` or equivalent after current compatibility checks) in client; decoding in browser, verification **always server-side**.
- Staff signs in via **username + password** and is assigned to selected event. Scanner shows only event name, camera target and concise result; no mass guest export.

## Backend check-in transaction (single atomic operation)
1. Validate authenticated session and active `staff`/`admin` membership for specific event.
2. Rate-limit scan attempts to prevent brute-force; normalize token input and derive hash; look up active ticket by token hash in scoped event.
3. Verify event not cancelled, scanning time window open, registration email verified + RSVP YES + admission admitted, ticket not revoked.
4. Inside a transaction, insert into `checkins(ticket_id,event_id,staff_id,...)` under `UNIQUE(ticket_id)` constraint; on constraint conflict, return `already_checked_in` with authorized minimal info. This must be atomic despite simultaneous scanners.
5. Log result in `scan_attempts` (avoid storing raw secret). Return code `allowed`, `duplicate`, `invalid`, `wrong_event`, `revoked`, `not_admitted`, `outside_window`, `offline/error` as applicable, with user-safe human text.
6. Frontend shows green accept or red deny plus non-color icons/text, optional vibration and sound (venue environment compatible). A repeated local camera frame should not send dozens of requests, though DB handles retries.

## Manual lookup/override
- Staff searches **within assigned event** by partial name/email with limited results and server authorization; no public lookup.
- Show name, RSVP/admission/checkin status and minimal reference. Staff verifies physical ID according to venue policy (not automatically proof of age by platform).
- If missing QR, authorized staff may explicitly `manual check-in` after confirmation and reason field. It must use the same atomic uniqueness guard, log actor/reason and appear in audit report. Overrides for invalid/waitlisted guests should be admin-only or disallowed by default; never silently permit.
- If guest needs a second entry after leaving, the V1 rule is **no automatic re-entry**. Future version can add explicit exit/re-entry workflow with separate constraints.

## Common rejection messages
- GREEN `Ingresso autorizzato` / `Accepted` — include guest display name.
- RED `Biglietto già utilizzato` — show first check-in time (staff-only).
- RED `Biglietto non valido per questo evento`.
- RED `Biglietto revocato o registrazione non confermata`.
- GREY `Connessione assente — non autorizzare l'ingresso tramite questo sistema`.

## Security caveats
- A screenshot of a valid QR can be shared: the first person presenting it might enter. The system prevents duplicates but does not by itself prevent sharing before first entry; staff identity/name check is a policy decision.
- Do not use predictable QR IDs or Base64-encoded guest data. No local "scan success" offline mode in V1; coordinate Wi-Fi/mobile coverage.
- Scanner must not cache guest lists unencrypted or permanently on a shared staff phone. Session timeout and logout are required.

## Critical tests
- Two concurrent scans (two browsers, same ticket) -> exactly 1 success; the other duplicate.
- Other event's QR rejected even if valid there.
- Unverified / RSVP NO / waitlisted / revoked / cancelled event rejected.
- Staff assigned to Event A cannot scan Event B.
- Duplicate QR after successful manual check-in rejected; double-click on manual button has no duplicate effect.
- Network timeout must not show green if server success is unknown; offer explicit status recheck.
