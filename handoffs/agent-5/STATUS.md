# Agent 5 — QA & integration handoff

Ultimo aggiornamento: 2026-11-04. Branch `agent/qa`; base `69e6469b064d687b337a883835508bf2abf4d7f4`. PR e SHA: vedere intestazione della PR/HEAD (il file non può contenere il proprio SHA). Nessun merge effettuato.

## Risultato
- DONE: fixture sintetiche, test eseguibili dell'helper di contratto su tutte le 30 combinazioni, encoding percorsi e integrità fixture; test HTTP anonimi predisposti, disabilitati per default e vincolati a loopback.
- DONE: matrice con stati e dipendenze in `qa/SCENARIOS.md`; istruzioni in `qa/README.md`.
- BLOCKED: test applicativi reali su inviti, registrazione, verifica, RSVP, capienza, ticket, scanner, auth, dashboard, CSV, errori di rete e invio. Main è bootstrap; PR frontend/check-in non sono integrate. Nessun database, server o inbox finta integrati disponibili.
- NOT RUN: browser mobile/desktop, screenshot e test su dispositivi fisici. HTTPS e due telefoni richiesti per gate finale.

## Test effettivamente eseguiti
`node --experimental-strip-types --test tests/integration/*.test.mjs`: exit 0 su Node v24.22.1, 3 pass, 0 fail, 4 skipped. I quattro skipped sono test HTTP su server non disponibile; non sono PASS di sicurezza. `npm test`, lint, typecheck e build non eseguiti: checkout completo e dipendenze non disponibili localmente. CI bootstrap preesistente non è verifica di questo branch.

## Confini e integrazione
File aggiunti: `tests/fixtures/synthetic.mjs`, `tests/integration/contracts.test.mjs`, `tests/integration/http-security.test.mjs`, `qa/README.md`, `qa/SCENARIOS.md`, questo file. Nessuna modifica a produzione, package o CI. Test HTTP consumano gli endpoint canonici admin; nessun endpoint fornito. Nessuna credenziale usata. Per prerequisiti, limiti e richieste agli agenti consultare matrice. Nessun bug P0 riprodotto; pilot bloccato dalla mancata integrazione e dai gate non verificati. Prossimo passo: su branch integrato predisporre DB isolato + fake inbox, attivare test HTTP e implementare prove reali di concorrenza e E2E.
