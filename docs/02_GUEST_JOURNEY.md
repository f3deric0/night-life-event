# 02 — Guest journey and confirmation mechanics

## Happy path
1. Guest receives a **unique personal invitation** (`?code=...`) or a **shared code** via WhatsApp/email/QR from organizer. Codes only authorize *signup*, they are not entry tickets.
2. Public page displays event name, venue, local date/time, 18+ notice if applicable, registration deadlines and code input (deep link pre-fills the code). Guest sees availability status without enumerating other people.
3. Guest enters name, surname, email and only legally necessary extra fields. Checkbox for having read privacy notice; optional, separately unchecked marketing consent if introduced later. Email is normalized and rate-limited. The system checks quota and registers a temporary claim.
4. Site displays "Check your email". **Email 1** immediately sends a confirmation link/token. Registration remains `email_unverified` until guest actively confirms. A prefetched GET request must not consume token: show an intermediate page and require explicit POST/confirm button.
5. After successful verification, guest lands on **separate RSVP** screen: "Parteciperò" or "Non parteciperò". Choices are explicit and timestamped.
6. RSVP=YES and enough capacity => `admitted`. RSVP=YES but sold out => `waitlisted`; UI must not falsely claim a confirmed place. RSVP=NO => declined, no ticket. Guests may change RSVP from a secure link until organizer closes RSVP; adjustments are audited.
7. If admitted and YES: ticket is issued with a **unique, high-entropy QR token** (distinct from invitation code), initially queued for delivery. Email 2 sends at event-local 10:00 **two calendar days before** event (default) or promptly if eligibility occurs later.
8. Guest presents QR at venue. Staff scans; backend verifies valid event, no revocation, YES + admitted, ticket not redeemed and venue scanning window open. On success, atomic check-in recorded; UI shows green success. Subsequent scans show red duplicate with time.

## Alternative and failure paths
- Wrong/expired code: generic, clear message; do not reveal arbitrary code details. Rate limit guesses.
- Reused personal code: display `Code no longer available` (do not reveal identity of prior guest).
- Shared code at quota: clear "No more registrations via this invitation" and optional contact organizer.
- Email in use for this event: offer recovery/resend email without leaking registration existence. One registered email per event in MVP unless owner authorizes merge.
- Email bounce: log delivery failure; offer change-address / organizer support via verified workflow; do not issue a valid QR until verified.
- Expired verification: guest may request a fresh email after cooldown; old tokens invalidated.
- Verified but RSVP unanswered: no active ticket; dashboard counts separately. A reminder is an optional feature and never treated as RSVP.
- RSVP NO then YES: check capacity again and reissue/revalidate ticket appropriately; revocation on NO.
- Waitlisted guest: gets an explicit waitlist state. Promotion to admitted triggers ticket send if after scheduled send time. Do not oversubscribe on concurrent promotions.
- Ticket lost: resend only after appropriate guest authentication/verification or admin assisted support; same active ticket or rotated replacement according to security policy; mark old token revoked when replaced.
- Event moved/cancelled: recalculate jobs, invalidate old event-specific tickets if policy requires, communicate necessary changes (additional operational email may be required beyond the two normal emails).
- Guest arrives before scheduled delivery due to incorrect time configuration: organizer can regenerate/resend ticket, audited.

## Minors and DOB
Do not assume full birth date is always necessary. Start with **age eligibility declaration**, if needed; collect DOB only where required for legitimate venue policy and documented lawful basis. Staff may still need to verify ID at the door. An email-verified guest is not automatically legally age-verified.

## Rules for two emails
Normal flow has two emails from the platform: first verification and second ticket. For errors/event changes, additional transactional communications may be essential; treat as a documented exception, not as a guarantee that exactly two will ever be sent.

## Input validation
Sanitize display strings; strict email syntax + normalized matching; max lengths on fields and code; server-side validation; do not trust frontend age checks; CAPTCHA/rate limit if abuse; accessibility for error focus; no plaintext secrets in browser logs.
