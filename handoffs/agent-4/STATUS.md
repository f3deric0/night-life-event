# Agent 4 — Reporting handoff

- Branch: `agent/reporting`; base main `69e6469b064d687b337a883835508bf2abf4d7f4`. Commit di implementazione: `d2fb6a555e1a9cecbcccc6dd0932b53a73a7bfc6` (questo aggiornamento di stato è successivo). PR: https://github.com/f3deric0/night-life-event/pull/5 (draft).
- Scope: `src/lib/reporting`, `tests/reporting`, `docs/reporting`, this handoff. Shared contracts, HTTP routes, database and UI untouched.
- Implemented: current-state KPI and funnel, event/code/type/verified promoter cohort filters, local-day series, frozen dashboard mapping, CSV with allowlist/BOM/CRLF/formula protection, fail-closed repository interface.
- Tests actually run: `node --experimental-strip-types --test tests/reporting/*.test.mjs` on Node 24; 7 passed. Typecheck, lint, build and repository-wide CI were not run in this environment. Existing npm test script does not discover the nested tests; run them explicitly. No actual database, RLS, browser, endpoint, credentials or live data tested.
- Supported output: typed aggregates, sparse daily series, Excel-compatible CSV; no XLSX. Synthetic fixtures only, no real guest data.
- Agent 1: implement secure PostgreSQL server adapter, session-derived org/role/event authorization, event scoped queries, audit logging and canonical HTTP routes; wire reporting tests into CI. Agent 2: integrate dashboard mapping, presentation of null rates/no-shows, timezone and refresh time. Coordinate any changes to shared contracts.
- Incomplete: production DB adapter and authorization, real delivery/bounce status, export audit and end-to-end testing. Promoter requires verified attribution; no event conclusion without completed status and elapsed known end. See `docs/reporting/INTEGRATION.md` for semantics and limits.
