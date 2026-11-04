# Agente 8 — API e integrazione

Aggiornamento: 2026-11-04. Branch `agent/api-integration`, base `69e6469b064d687b337a883835508bf2abf4d7f4`. PR e SHA: consultare la PR e l'HEAD; nessun merge. Stato: **BLOCKED / draft, non pronto per pilot**.

## Consegnato
- Confine HTTP con `ApiResult` di errore, trace ID, `Cache-Control: no-store`; controllo JSON, campi aggiuntivi, slug, codice, UTF-8 e dimensione effettiva massima 2 KiB su `POST /api/public/invite/validate`.
- `src/lib/api-integration/ports.ts`: interfacce di integrazione, non implementazioni: validazione, registrazione e accodamento atomici, conferma monouso e rate limiting persistente. Non è registrato alcun adapter e nessun input è registrato nei log.
- Rotte canoniche fail-closed: validate (400 per input invalido, altrimenti 503), register, verification resend/confirm, RSVP, ticket, session GET/POST, logout, eventi GET/POST, codici GET/POST, ospiti GET, metriche GET, export GET (tutte 503). Non esistono operazioni reali, autenticazione, autorizzazioni, protezione CSRF, idempotenza o throttling; non attivarle prima delle dipendenze e dei test di sicurezza. Il codice non simula successi. Non è implementata la revoca.
- Quattro rotte di Agent 3 non copiate né modificate: checkin, manual-checkin, dispatch-tickets e webhook email; la loro integrazione attende handoff coordinato e PR #3. Moduli di reporting PR #5 non integrati, né copiati. Nessuna modifica a schema, auth, frontend o contratti condivisi.
- File nuovi: `src/lib/api-integration/{http,ports}.ts`, route sotto `src/app/api/{public,staff,admin}` sopra elencate, `tests/api-integration.test.mjs` e questo file. Nessuna credenziale, nessun dato personale, nessuna migrazione o invio email.

## Test eseguiti localmente
- `npm test`: PASS, 7 test totali, 4 nuovi; verifica rifiuto input malformato/oversize, no successo in assenza di backend e struttura di errore. Nessun test HTTP E2E, DB, autenticazione, quota concorrente o invio.
- `npm ci --offline --no-audit --no-fund`: FAIL, cache npm incompleta (`zod-validation-error`). `npm run lint`, `npm run typecheck`, `npm run build`: BLOCKED, exit 127, dipendenze assenti. Richiedere CI sul commit della PR. La verifica di import e build dipende dalla CI.

## Dipendenze e prossimi passi
1. Agent 1: fornire schema approvato, RPC di quota/registrazione/outbox e conferma monouso atomiche, permessi server, auth staff e rate limiting condiviso; concordare contratti, idempotenza e protezione CSRF. Le interfacce non garantiscono da sole alcuna proprietà.
2. Agent 3: handoff formale di rotte e servizi, provider di verifica e outbox persistente; preservare verifica separata da RSVP. Agent 4: adapter dati autorizzato per reporting/esportazione.
3. Agent 2: contratti congelati non includono ancora DOB e telefono; concordare estensione e formato errori prima della connessione frontend. Privacy/legal e Agent 7: base giuridica, finalità, informativa e retention prima di PII reale.
4. Agent 5/7: test negativi e cross-tenant, race di quota e token, idempotenza, sicurezza, autenticazione e validazione end-to-end su staging isolato. Nessuna prova su Supabase reale; nessun piano a pagamento.
