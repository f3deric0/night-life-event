# 07 — Two transactional emails, verification, RSVP and scheduled ticket

## Owner's normal email timeline
**Email 1 immediately after registration:** verify ownership of email. This is **not RSVP**. No QR attached.  
**Email 2 two calendar days prior to event:** actual personal QR ticket, only for email-verified, RSVP=YES, `admitted` registrations.  
Optional operational exceptions: cancellation/change, email delivery failure resolution, password reset for staff; not part of the normal two-email signup cadence.

## Email 1 — verification
- Trigger: valid registration (or secure resend after cooldown). Delivery via transactional provider (Resend proposed).
- Subject suggestion: `Conferma la tua email — [Evento]`.
- Body: greeting, event details, explicit "Verifica email" CTA, expiration info, support text; no RSVP wording that implies confirmation.
- Token: random, purpose `verify_email`, registration-bound, short expiration (proposed 30 min), stored hashed; one-use, rate-limited. **Do not consume by merely opening a GET link** (antivirus/email prefetch can open URLs): GET shows a landing page, explicit POST/button completes verification.
- Once verified, redirect to a separate RSVP screen; record `email_verified_at`. Verification success does not issue an immediate ticket if event is more than 2 days away.
- Bounced/failed sends appear on dashboard. Recovery must not leak another person's registration.

## RSVP screen — not an email verification
- Explicit `YES` or `NO` decision, recorded with timestamp. Verified guest accesses through secure, scoped, expiring link/session continuation; no account needed.
- YES: check admission/capacity; YES + waitlisted isn't a ticket-eligible state.
- NO: mark declined; revoke any prior active ticket and release capacity. Manage late changes via secure recovery/resend path.

## Email 2 — QR ticket
- Eligibility gate at **send execution time**: verified email, RSVP YES, admitted, event open/not cancelled, ticket active, scheduled time reached.
- Default scheduled time: **10:00 in event's own timezone, two calendar dates before the event date**. Example: Saturday event => Thursday 10:00 local, NOT a universal UTC 48h subtraction.
- If a registration reaches eligibility **after** this timestamp (late signup, late YES, promotion from waitlist): queue email promptly.
- Subject suggestion: `Il tuo ingresso per [Evento] — QR code personale`.
- Include name/event/date/venue, QR code as compatible image or a secure ticket view link, and a short human-readable support/reference code that is **not** a way to bypass validation.
- QR contains only opaque random ticket identifier/token, no PII and no predictable sequence. QR visible in email may be screenshotted and shared: staff should verify display name/ID as venue policy allows.

## Scheduler architecture
1. Event created with timezone and local start date/time, plus `ticket_dispatch_local_time=10:00` default.
2. Periodic server scheduler/cron looks for sendable events/registrations and inserts an `email_jobs` record with a unique idempotency key.
3. Worker claims pending jobs with locking/lease, recomputes eligibility, sends with provider idempotency key if supported, stores provider reference; handles retry backoff and max attempts.
4. Webhook handler authenticates provider signature, upserts delivery events idempotently, updates status delivered/bounced/complained. Do not treat `sent` as `delivered` or `opened`.
5. If event rescheduled/cancelled: cancel or invalidate pending ticket jobs and re-evaluate timing; owner notified. Already delivered tickets may require additional update and server validity change.

## Failure & idempotency
- Distinguish `queued`, `processing`, `sent`, `delivered`, `bounced`, `failed`, `cancelled`. Make each job unique per intended ticket/email purpose/version.
- Provider timeouts can mean unknown delivery: store request idempotency key and reconcile status before retry.
- Retry transient errors with backoff; don't retry permanent bounces endlessly. Surface alert and allow scoped admin action.
- Resend link protection: per email/IP cooldown and counts; no unbounded anonymous outbound emails.
- Marketing opt-in not implied by verification or ticket email.
- Email service daily/monthly limits and domain authentication must be verified against current provider plan, not assumed.

## Sample email texts (not final branded copy)
**Email 1:**
> Oggetto: Verifica il tuo indirizzo email — [Evento]  
> Ciao [Nome], abbiamo ricevuto la tua registrazione. Per verificare l'indirizzo email, clicca su **Verifica email**. Dopo la verifica potrai scegliere separatamente se partecipare. Questo link scade il [data/ora].

**Email 2:**
> Oggetto: Il tuo QR code per [Evento]  
> Ciao [Nome], la tua partecipazione è stata confermata e il posto assegnato. Ecco il tuo QR code personale per l'ingresso il [data/ora] presso [location]. Mostralo allo staff; è valido per un solo primo ingresso. Non condividerlo.

## Test cases
Immediate verification request, expired token, GET prefetch safety, resend cooldown, no ticket for NO/unverified/waitlisted, event time-zone DST transition, 10:00 dispatch correctness, 3am late admission, provider 429/500, double scheduler run, cancellation after ticket sent, QR revoke on RSVP NO.
