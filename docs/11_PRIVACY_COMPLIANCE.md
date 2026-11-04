# 11 — Privacy, GDPR and real-world operational safeguards

This is a **product implementation checklist, not legal advice**. Before gathering real guest data, the organizer/controller should validate applicable law in Belgium/EU and event location, lawful bases, notices, retention and data processor agreements with a qualified adviser.

## Data minimization
- Collect first name, surname, email and event participation only as needed for guest-list operation.
- Full birth date is **not automatic**: decide whether an age threshold declaration suffices, whether physical ID at door is needed and whether DOB retention is necessary for the specific venue. Do not collect ID scans by default.
- Promo/marketing subscription is **separate, optional and unchecked by default**, if ever used. Transactional confirmation emails do not authorize marketing emails.
- Only staff performing check-in should see the minimum fields necessary; organizers can access relevant guest data, with audit trail.
- QR encodes opaque token with no PII; do not share or store QR secrets in analytics tools.

## Transparent notice
Guest form should link to a clear privacy notice identifying the data controller, contact details, purposes, legal bases, recipient/processors, hosting regions/transfers, retention time, guest rights, complaint authority, security and any marketing choice. Avoid ambiguous "I agree to everything" checkboxes. Record notice version and any consent separately from transactional processing.

## Data lifecycle
- Define retention before launch (suggest **provisional policy**, pending legal review: retain check-in and registration detail only for event operations and legitimate short post-event reconciliation, then anonymize or delete; store non-identifying aggregate statistics for longer). No final period should be assumed without owner/legal decision.
- Provide procedures for access, rectification, erasure where applicable, complaints, exports and withdraw marketing consent. Some records may need lawful retention for legal claims: document exceptions.
- Backups and logs have their own retention; do not promise immediate erasure if backups persist temporarily.
- Reuse of past attendees for a new event must not silently enroll or email them marketing without a suitable lawful basis.

## Processor and system controls
- Sign/accept applicable DPA terms with hosting, Supabase, email service and analytics vendors; verify subprocessor regions and international transfers.
- Private data protected with TLS, authorization/RLS, encrypt-at-rest provided by host, credentials management, backups, access reviews and incident procedures.
- Define staff roles and revoke former staff access promptly; no shared passwords.
- Export only necessary columns and monitor downloaded copies. Delete exports after purpose; do not place identifiable guest data in broadly shared Drive folders by default.
- If cookies/analytics used beyond necessary service functions, assess cookie/ePrivacy requirements.

## Operational and safety considerations
- Age screening in app may not replace venue/legal ID check; venue sets entry policy.
- QR ticket is a bearer credential and may be shared prior to scanning; an identity check can mitigate, but it is a venue procedure.
- Staff phone can be lost; session timeout, remote account deactivation, minimal local caching and no stored QR secret history.
- Venue internet reliability test and manual fallback policy required; V1 does NOT auto-admit offline.

## Pre-launch checklist
- [ ] Controller identity and contact approved
- [ ] Data fields/lawful basis/privacy notice reviewed
- [ ] DOB necessity assessed; age policy confirmed
- [ ] Marketing checkbox separate or absent
- [ ] Processors and international transfers reviewed
- [ ] Retention/deletion requests process implemented
- [ ] RLS / role tests / staff revocation passed
- [ ] Live event restore/backups and incident procedure verified
- [ ] Staff trained to check name/ID when required
- [ ] Email domain authentication, abuse and unsubscribe expectations reviewed

## Official sources to verify
- EU GDPR text: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- EDPB: https://www.edpb.europa.eu/
- Belgium Data Protection Authority: https://www.dataprotectionauthority.be/
