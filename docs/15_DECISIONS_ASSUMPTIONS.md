# 15 — Decision register, assumptions, open questions and change log

**Updated:** 2026-11-04  
**Product owner-confirmed decisions** are not to be changed by implementation agents without consent. Proposed defaults can be modified after validation, provided the change is recorded here.

## Confirmed by product owner
| ID | Decision | Status |
|---|---|---|
| D01 | Multi-event platform for repeated nightclub events | CONFIRMED |
| D02 | Personal and shared invitation codes | CONFIRMED |
| D03 | Guest provides name/surname/email and potentially DOB / event-specific info | CONFIRMED IN PRINCIPLE; exact fields minimize |
| D04 | First email immediately after signup, to confirm email address | CONFIRMED |
| D05 | RSVP is **separate and explicit** from email verification | CONFIRMED |
| D06 | Second email **two days before** event includes personal QR | CONFIRMED |
| D07 | QR scanned to record real entrance, dashboard distinguishes entrants and non-entrants | CONFIRMED |
| D08 | Private area accessible via discreet button, **username + password**, with dashboard and scanner access for appropriate roles | CONFIRMED |
| D09 | Admin backend and statistics, easy Excel/Google Sheets access | CONFIRMED |
| D10 | Clear Markdown documentation in dedicated Google Drive folder and Codex initial prompt + low-credit workflow | CONFIRMED |

## Proposed implementation defaults (not yet explicitly approved)
| ID | Default | Why |
|---|---|---|
| A01 | Project codename `NightList` | working name only |
| A02 | Event-local ticket send = 10:00 exactly two calendar days before event date | deterministic schedule |
| A03 | Late RSVP/admission after send time -> ticket email soon after | does not exclude late guests |
| A04 | Guest accountless flow, token verified; no guest password | less friction; separate staff auth |
| A05 | Staff login user-facing username/password, Supabase Auth behind secure mapping | protects passwords without reinventing auth |
| A06 | Personal codes one successful verified registration; shared codes configurable quota | simple expected semantics |
| A07 | 30-min provisional code hold during email verification | prevents abuse and indefinite locks |
| A08 | Waitlist when event at capacity | no oversubscription |
| A09 | One first successful check-in per ticket, **no automatic reentry** | anti-duplicate default |
| A10 | Online HTTPS scanner; no offline acceptance in V1 | safety and consistency |
| A11 | CSV event export in V1; optional Google Sheets sync later | faster, accurate source-of-truth |
| A12 | Build on Next.js, Supabase, Resend, hosting e.g. Vercel | practical TypeScript stack |
| A13 | Start with one owner/org but multi-org-safe schema | future scalability |
| A14 | Fake events/sample identities only in development | privacy protection |

## Questions requiring owner/business/legal confirmation before production
1. Actual event location, legal minimum age and whether DOB needs to be collected or merely age declaration/physical ID check.
2. Brand name and domain; Italian/English/French UI needs; logo/colors.
3. Whether each code is bound to a specific email or transferable before verification.
4. Code-sharing limit defaults, staff roles and promoter reporting needs.
5. Should a cancelled RSVP release a place instantly? Proposed yes. How should waitlist priorities work?
6. Is changing event time/location allowed after ticket mail? Who approves re-notification?
7. Timing cutoff for guest check-in and RSVP closing; venue re-entry policy.
8. Data retention period and controller/processor info; approval of privacy policy and potential marketing activities.
9. Maximum anticipated registrations, event frequency, concurrent scanners, preferred domain/email provider and monthly budget.
10. Who can manually override at entrance and what evidence/reasons are required?
11. What is the precise relationship between promoter invitation count and compensation, if any? Not in MVP.

## Change log
- **2026-11-04 v1.0:** created structured project specification, code/QR distinction, private username/password role segregation, two-email system, consent/privacy checklist and phased Codex build plan. No application implementation or provider credentials provisioned.

## Decision protocol
A new Codex chat should read this file and preserve CONFIRMED decisions. If product owner changes behavior, append a dated row with the old/new decision and update affected docs, code tests, and `IMPLEMENTATION_LOG.md`. Do not silently reinterpret a YES RSVP as email confirmation.
