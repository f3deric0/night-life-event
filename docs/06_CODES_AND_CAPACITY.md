# 06 — Invitation codes, claims, capacity and waitlist

## Two code categories — confirmed
**Personal code:** unique secret usable for exactly **one successful email-verified registration**. May be sent directly as a personalized URL. V1 can allow unbound personal codes; allow optional preassigned email binding when organizer has legitimately collected an invitee's address. Once consumed, cannot register another guest.

**Shared code:** same code/link can be shared with multiple guests. Organizer configures `max_redemptions` (e.g. 20, 100, unlimited-with-guardrail). Every successful guest registration creates a distinct registration and later a distinct **ticket QR**. Shared code ≠ shared QR.

## Code generation and distribution
- Cryptographically strong randomness. Recommended 10–16+ random characters from unambiguous alphabet with sufficient entropy and collision check; never sequential `EVENT-001` for real secrets.
- Support bulk generation, copy-to-clipboard, csv export. Metadata includes event, promoter/source label, expiry, usage quota, disabled/revoked flag.
- Optional link prefilled `https://domain/e/event-slug?code=...`. Since code is a bearer secret, never emit it to analytics/referrer; use no-store and referrer controls.
- When sending via WhatsApp manually, cannot know recipients or actual deliveries. Report generated/shared by organizer vs opened (if instrumented) vs registered without inventing delivery counts.

## Claiming versus consuming quota
A signup form can be abandoned or left unverified, so do not indefinitely burn shared-code quota on each anonymous form submission.
1. Server validates code and creates temporary **hold** attached to one registration (e.g. 30-minute default, configurable).
2. Under a DB transaction lock, check existing consumed claims + unexpired holds and enforce `<= max_redemptions`.
3. On email verification before hold expiry: convert hold to **consumed**; only then count as redeemed. If hold has expired, re-evaluate quota and allow success or notify guest if no space.
4. On email verification failure, no permanent quota consumption. Expired holds cleaned and excluded transactionally. Repeated registration attempts with same verified guest must not multiply claims.
5. Personal code one successful redemption; if held by abuse and expired, released. Concurrency tests must prove at most one consumption.

This claim implementation has edge cases, and can be simplified with DB-side stored procedures as long as atomicity and recovery rules remain correct. All rate limits apply even while holds are active.

## Event capacity vs code capacity
- Code quota = number of **eligible verified registrations** using that code; event capacity = admitted guests with RSVP YES and a reserved place.
- Code redemption does not guarantee admission if the event is full. The UI must say "registration allowed, admission subject to availability" or restrict codes according to organizer policy.
- On RSVP YES, atomically reserve one available place if under `events.capacity`; otherwise set waitlisted. RSVP NO releases place and revokes ticket. Promote oldest/priority waitlist guest by a documented deterministic policy.
- Invitations may be revoked; existing RSVPs may require explicit organizer policy on whether revocation cancels confirmed reservations. Default: revoking unused code blocks future signups, not already admitted guests; explicit admin cancellation revokes ticket.

## Proposed admin controls
Create code type, batch size, max uses, expiry, promoter/source label, optional guest email binding, preview/copy link; view verified redemption count, active holds, RSVPs, actual check-ins. Revoke code with confirmation. Filter and export codes without exposing secrets unintentionally.

## Abuse prevention
Rate-limit attempted codes by IP and session, use generic failure on guesses, CAPTCHA on spikes, constrain maximum generated/claimed quantities per event, anti-bot monitoring, auditable overrides. Avoid globally shared predictable codes in real deployments.

## Acceptance tests
- Personal code: first verified guest wins; second cannot register.
- Shared code quota 2: 3 concurrent verified guests => max 2 consumed.
- Unverified signup hold times out and frees capacity.
- RSVP YES competition at last place => exactly one admitted; rest waitlisted.
- RSVP NO releases seat and ticket becomes invalid.
- Changing event cap downward never silently revokes confirmed tickets without organizer decision.
