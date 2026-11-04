# Reporting module integration (prototype)

The functions in `src/lib/reporting` are pure calculations over a server-provided, token-free projection. They are not an authorization boundary and do not connect to PostgreSQL. Agent 1 must implement `AuthorizedReportingRepository` using authenticated server sessions, current owner/admin organization membership and event authorization, RLS, parameterized event-scoped queries and export audit logging. Never accept organization, role or access claims from the client. Staff and anonymous access must be denied. Use a consistent database snapshot and validate uniqueness and source integrity before calling these functions. There are no HTTP handlers here.

## Projection and semantics

Supply one event, its invitation codes and one current row per registration. A code's `promoterId` must be an independently verified attribution; otherwise use null. `checkedInAt` comes only from the first successful check-in, not attempted scans. `ticketSent` must come from a successful email send for the current active ticket. The issued count represents current non-revoked tickets; it is not a historical issuance total. Never include raw codes, verification tokens, QR secrets or their hashes. `registrationsStarted` is null until instrumented. Empty denominators return null. No-show requires both `completed` and a known elapsed `endsAt`; it counts current admitted verified YES without a successful entry. Cancellations are excluded. All timestamps require explicit offsets. Counts and percentages describe current states of a registration cohort, not historical state at a selected date.

Date filters are `[from,to)` instants: codes are counted by their creation instant, registrations by submission instant. Code lookup for registrations includes codes created outside the range. Check-in charts for a date-filtered cohort use submission dates for selection and group their successful entry timestamps in the event's IANA timezone. This is not a filter on the check-in timestamp. Daily series are sparse and contain no fabricated zero days. Invitation-code breakdown includes codes outside the date range with zero codes created in that period. `byPromoter` excludes null attribution.

`dashboardMetrics` maps the supported subset to the frozen `DashboardMetrics` contract without editing it. Additional KPI fields require backend/dashboard integration agreement. The CSV generator supports only the explicit non-secret column allowlist, optional cohort filters, UTF-8 BOM, CRLF, quote escaping and spreadsheet formula neutralization. It is CSV, not XLSX. Column choices and filters must be authorized by the server; log exports without storing sensitive contents. The apostrophe used to neutralize dangerous cells changes the exported display value.

## Remaining integration

- PostgreSQL schema and source queries depend on Agent 1; no database adapter can be verified until the schema and authorization primitives exist.
- Agent 1 must implement the canonical metrics/export routes and negative tests across organizations, roles and event assignments, plus an audited export. This library cannot prove the supplied projection is authorized or truthful.
- Agent 2 can consume the typed dashboard mapping and additional metrics after agreeing on server response shapes, unavailable states, timezone labels and refresh timestamp.
- Email-delivery/bounce metrics and historical states are unavailable without authoritative sources. Real database, RLS, export route, email delivery and live UI tests were not performed.
- Repository `npm test` currently discovers only `tests/*.test.mjs`, not this scoped directory. Until Agent 1 updates shared test discovery, run `node --experimental-strip-types --test tests/reporting/*.test.mjs` explicitly in CI.
