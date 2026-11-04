# Agente 8 — API & System Integration

Aggiornato: 2026-11-04. Branch `agent/api-integration`, base `69e6469b064d687b337a883835508bf2abf4d7f4`. PR #14: https://github.com/f3deric0/night-life-event/pull/14 (draft). Stato: **DRAFT / NO-GO per pilot**.

## Consegnato
- Boundary HTTP reali e adapter-driven per guest journey, sessione staff, eventi, codici, ospiti, metriche/export, check-in/manuale, scheduler e webhook. In assenza del composition adapter approvato, tutte le richieste valide falliscono con `503`: nessun successo simulato.
- Validazione runtime senza nuova dipendenza: JSON/content type e limite corpo, campi esatti, slug/ID, nome, DOB non futura, email, telefono E.164, locale IT/EN/FR/NL, versione privacy, eventi e batch codici. Mutazioni sensibili richiedono origin esatto e, dove necessario, `Idempotency-Key`.
- Cookie ospite e staff `HttpOnly; Secure; SameSite=Lax`, token mai restituiti nel JSON; errori stabili `ApiResult`, trace ID, `no-store`, messaggi generici e mapping controllato delle eccezioni dell'adapter.
- Registrazione mantiene verifica email e RSVP separati. La porta richiede un'unica operazione atomica `registerAndEnqueueVerification`; la conferma restituisce solo una continuazione ospite protetta. Nessun token viene consumato via GET.
- Back office: lista/crea/modifica eventi; lista/crea/revoca codici; lista ospiti; metriche; CSV. Autorizzazione e tenant/event scope sono responsabilità obbligatoria dell'adapter Agente 1; le librerie reporting Agente 4 devono alimentare l'implementazione di `metrics`/`exportReport`.
- Handoff rotte Agente 3 recepito secondo Issue #13: handler HTTP di check-in, manuale, dispatch e webhook delegano esclusivamente alle porte; nessuna logica QR/email duplicata. Firma, replay, RPC atomica e provider restano nell'adapter/servizio proprietario.

## Endpoint
`POST /api/public/invite/validate`, `POST /api/public/register`, `POST /api/public/verification/resend`, `POST /api/public/verification/confirm`, `POST /api/public/rsvp`, `GET /api/public/ticket`; `GET|POST /api/staff/session`, `POST /api/staff/logout`, `POST /api/staff/checkin`, `POST /api/staff/manual-checkin`; `GET|POST /api/admin/events`, `PATCH /api/admin/events/:id`, `GET|POST /api/admin/events/:id/codes`, `DELETE /api/admin/events/:id/codes/:codeId`, `GET /api/admin/events/:id/guests`, `GET /api/admin/events/:id/metrics`, `GET /api/admin/reports/export`; `POST /api/internal/dispatch-tickets`, `POST /api/webhooks/email`.

## Test effettivamente eseguiti
- `node --experimental-strip-types --test tests/api-integration.test.mjs`: **PASS, 6/6**, exit 0. Copre risposta fail-closed, lettura JSON/content type/limite effettivo, campi extra e primitive malformate, idempotency key, controllo same-origin, cookie protetti ed errori generici. La compilazione degli handler e delle route è coperta da TypeScript/build CI; la semantica degli adapter richiede i test integrati indicati sotto.
- GitHub Actions `Bootstrap checks` run 41873642951 sul commit `350199b2197ccd23c35d7748cb291b7502888843`: **PASS**. Installazione, lint, TypeScript, unit test root e build completati con successo. Il comando aggregato resta non eseguibile nel checkout Work privo del repository/package.json; il risultato verificato è quello CI.
- NON TESTATO: Supabase/RLS/RPC, quota concorrente, token reale, SMTP, webhook firmato, scheduler, reporting integrato, due scanner, browser/E2E e staging.

## Dipendenze e richieste
1. Agente 1: implementare e fornire composition adapter server-only per `ApiBackend`, con auth e revoca sessione, scope org/evento, rate limit persistente, quota/registrazione/outbox e conferma token atomiche, RPC check-in, audit e RLS. Non applicare migrazioni senza approvazione.
2. Agente 3: collegare mail/ticket/check-in ai metodi delegati, definire firma scheduler/webhook e idempotenza; il client non decide mai l'ingresso. Agente 4: fornire repository autorizzato per KPI/CSV.
3. Agente 2: inviare telefono in E.164, `privacyNoticeVersion`, locale e idempotency key; usare i codici errore stabili. Il contratto condiviso V0 non include DOB/telefono: estensione locale in attesa di modifica coordinata Agente 1.
4. Agenti 5/7: test cross-tenant, CSRF, race quota/check-in, replay token/webhook, formula CSV e negative HTTP. Privacy/legal: finalità, base giuridica, età, notice e retention sono ancora blocchi per PII reale.

Nessun dato reale, segreto, migrazione, servizio a pagamento, email o merge effettuato.
