# Agent 3 — STATUS

Ultimo aggiornamento: 2026-11-04. Branch: `agent/checkin`. Base: `69e6469b064d687b337a883835508bf2abf4d7f4`. PR: draft verso main, link nella pagina GitHub del branch. Commit: vedere HEAD del branch (un file non può contenere il proprio SHA).

## Stato
- DONE — primitive isolate: token casuali 256 bit e hash SHA-256; calcolo di due date di calendario alle 10:00 nel fuso IANA, controllo di eleggibilità e scadenza, messaggio di verifica HTTPS; provider esclusivamente mock con deduplica in memoria.
- DONE — interfaccia gateway check-in: hash prima dell'invio e risposta di errore sicura; scanner con sessione, scelta evento, fotocamera tramite BarcodeDetector nativo se supportato, verifica server e messaggi di errore/offline. Rotte canoniche POST presenti ma rispondono sempre 503.
- BLOCKED — invio email effettivo, provider reale e webhook firmato; integrazione registrazione/reinvio e verifica monouso; outbox persistente, retry e idempotenza durevole, generazione/visualizzazione QR, revoca e annullamento; nessun invio reale.
- BLOCKED — check-in e ricerca manuale operativi: non esistono sessione, autorizzazioni, RPC, storage e contratto ricerca. La schermata manuale è una richiesta non funzionante e non una ricerca ospiti. Nessun ingresso viene confermato dalle rotte stub. Il supporto BarcodeDetector dipende dal browser; non è ancora stato predisposto un decoder di fallback.
- NOT STARTED — verifica fisica su telefoni, test di concorrenza su database reale, integrazione e invio staging, deploy. Non pronto per pilot.

## Verifiche locali
- `npm test`: exit 0, 8 test passati inclusi 5 di Agent 3; la concorrenza e la deduplica usano solo mock in memoria, nessuna prova di atomicità o idempotenza distribuita.
- `npm ci --offline --no-audit --no-fund`: exit 1, cache incompleta (`zod-validation-error` non presente).
- `npm run lint`, `npm run typecheck`, `npm run build`: exit 127, dipendenze non installate (eslint, tsc e next non presenti). CI GitHub da verificare.
- Nessun test camera fisica; nessun test E2E; nessuna credenziale email o database.

## Richieste precise all'Agente 1
1. Sessione autenticata `GET /api/staff/session` con `ApiResult<StaffSession>`, assegnazioni attive verificate su ogni richiesta, protezione CSRF/origin e rate limit.
2. RPC transazionale per check-in tramite hash, org/event/staff, che verifichi evento, ammissione, RSVP, email, revoca, finestra temporale e vincolo unico ingresso; ritorni `CheckinResult` canonico. Anche ingresso manuale deve usare la stessa guardia atomica, con audit di attore e motivo. Impedire letture cross-event.
3. Ricerca limitata e autorizzata per evento, con contratto condiviso e sole informazioni necessarie; definire schema richiesta manual-checkin e autorizzazione per eccezioni.
4. Registrazione, resend e conferma: token casuale monouso con hash, expiry, cooldown, risposta generica e outbox transazionale; GET non modifica lo stato. La verifica non imposta RSVP.
5. Persistenza di ticket individuali per registrazione, hash, versioni e revoca atomica al cambio RSVP/ammissione o evento; enqueue e claim con lease, chiave unica purpose/registration/ticket-version, retry con riconciliazione dei timeout e cancellazione jobs. Recheck atomico immediatamente prima dell'invio.
6. Approvare provider e dipendenze, decidere segreti/firme scheduler e webhook; chiedere all'Agente 1 eventuali modifiche a package/lock. Le rotte 503 non vanno abilitate senza queste garanzie.

## Endpoint
Consuma `GET /api/staff/session`; predispone `POST /api/staff/checkin`, `/api/staff/manual-checkin`, `/api/internal/dispatch-tickets`, `/api/webhooks/email`: tutti stub 503. Nessuna rotta aggiuntiva inventata per ricerca manuale.
