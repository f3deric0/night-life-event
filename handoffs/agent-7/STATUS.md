# Agente 7 — audit sicurezza e privacy

Aggiornato: 2026-11-04. Branch `agent/security-audit`; PR: https://github.com/f3deric0/night-life-event/pull/7 (bozza); base `69e6469b064d687b337a883835508bf2abf4d7f4`. Stato **NO-GO**. File: `audit/THREAT_MODEL.md`, `docs/security/PILOT_PRIVACY_GATE.md`, `tests/security/security.test.mjs`, questo handoff.

## Rischi
- Critical: nessuna vulnerabilità sfruttabile confermata; verifiche non sufficienti a escluderle.
- High: H-01 assenza implementazione auth/DB nella baseline; H-02 atomicità check-in non dimostrata; H-03 test in sottocartella non scoperti da npm test. Sono blocchi verificati di readiness, non bypass dimostrati.
- Medium: possibile leakage token in URL; rischio confusione demo/prodotto. Ipotesi, non exploit verificati.
- Low: nessuna verificata.

## Evidenze e test
Lettura documentazione richiesta, decision register, contratto, package.json e handoff bootstrap; PR #2–#5 in bozza controllate tramite descrizione, non audit completo dei relativi commit. `node --test tests/security/security.test.mjs`: guardia indirizzo locale testata; otto test HTTP esplicitamente saltati senza server integrato. Risultati dettagliati nella PR. Lo script non usa servizi esterni, rifiuta redirect e non considera 404/503 un risultato positivo. Per esecuzione contro test server locale isolato: `SECURITY_LOCAL_ORIGIN=http://127.0.0.1:3000 node --test tests/security/security.test.mjs`. Il test presuppone fixture sintetiche, niente dati reali; non avvia né accede a servizi esterni. Esso verifica solo risposta HTTP anonima, non RLS o ruoli. `npm test` non scopre questo percorso: eseguire comando esplicito fino a correzione CI.

## Richieste
Agente 1: auth, revoca, RLS e test multi-tenant, RPC transazionale, conferma POST e CSRF; agente 2: GET non mutante, anti-XSS e UX fail closed; agente 3: scanner e webhook autenticati, idempotenza e concorrenza reale; agente 4: export autorizzato e formula injection; agenti 5/6: integrazione CI, staging, restore e test reali. Dettagli in threat model.

## GDPR e pilot
Checklist completa e criteri GO/NO-GO in `docs/security/PILOT_PRIVACY_GATE.md`; tutti i punti restano da verificare. Nessuna conformità legale dichiarata. Non sono stati eseguiti test DB/RLS, autenticati, dipendenze, secret scan, provider, restore, browser o due dispositivi. Riesaminare i branch degli altri agenti dopo integrazione, con commit precisi, prima del pilot.
