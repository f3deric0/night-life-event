# Matrice QA — 2026-11-04

Base esaminata: main `69e6469b064d687b337a883835508bf2abf4d7f4`. PASS significa solo scenario concretamente eseguito sul componente indicato. BLOCKED: manca implementazione o infrastruttura; NOT RUN: verifica non ancora eseguita. Nessun PASS sui flussi applicativi, sul server o sul database è implicito nei test del contratto.

| ID | Scenario e risultato atteso | Stato | Dipendenza / evidenza |
|---|---|---|---|
| C01 | Matrice completa helper UI: solo verified + yes + admitted è eleggibile | PASS | 30 combinazioni; `contracts.test.mjs`; non autorizza emissione sul server |
| C02 | Identificativi nei path admin codificati come segmento | PASS | `contracts.test.mjs`; non prova autorizzazione |
| C03 | Fixture sintetiche distinte, dominio riservato `.invalid` | PASS | `contracts.test.mjs` |
| I01 | Codice personale valido, scaduto, revocato e riutilizzato | BLOCKED | Agent 1: API, persistenza e orologio controllabile |
| I02 | Quota codice condiviso, 100 claim paralleli e nessun superamento | BLOCKED | Agent 1: DB reale isolato e transazioni |
| I03 | Codice e registrazione di evento/organizzazione differenti | BLOCKED | Agent 1: backend e RLS |
| R01 | Dati obbligatori, email invalida, duplicata e normalizzata | BLOCKED | Agent 1: registrazione + DB |
| V01 | Verifica token valido, scaduto, usato, GET non consuma, POST una volta | BLOCKED | Agent 1: verifica e token persistenti |
| V02 | Reinvio generico, cooldown, vecchio token e indisponibilità email | BLOCKED | Agents 1/3: resend, outbox e provider finto controllabile |
| S01 | Verifica e RSVP distinti; non verificato non può rispondere | BLOCKED | Agent 1: verifica e RSVP reali |
| S02 | RSVP NO o waitlist impedisce ticket; cambio NO revoca | BLOCKED | Agents 1/3: transazioni ticket e revoca |
| S03 | Richieste RSVP concorrenti: ammessi <= capienza | BLOCKED | Agent 1: DB reale isolato |
| T01 | Ticket duplicato, revocato, scaduto, evento errato o cancellato respinto | BLOCKED | Agents 1/3: ticket, stato e check-in server |
| T02 | Due scanner in parallelo: esattamente un ingresso accettato e uno duplicato | BLOCKED | Agents 1/3: RPC atomica e DB reale; poi due telefoni HTTPS |
| A01 | API admin anonime negano accesso senza dati | BLOCKED | `http-security.test.mjs` predisposto; server integrato non disponibile, 4 test saltati |
| A02 | Staff non legge admin o eventi/organizzazioni non assegnati; sessioni disabilitate rifiutate | BLOCKED | Agent 1: auth, assegnazioni e RLS |
| A03 | Login errato generico, rate limit e protezione CSRF | BLOCKED | Agent 1: sessioni e rate limiting |
| D01 | Contatori, filtri, paginazione, CSV e dati DB riconciliati; CSV formula-safe | BLOCKED | Agents 1/2/4: metriche, dashboard, export e DB |
| E01 | Invito → registrazione → verifica → RSVP → ticket → check-in | BLOCKED | Tutti i componenti integrati, DB e finta inbox |
| U01 | Browser 360px e desktop: navigazione, accessibilità, layout e screenshot | NOT RUN | Browser/app eseguibile e frontend integrato; test mobile fisico resta BLOCKED |
| U02 | Fotocamera iOS/Android su HTTPS e due telefoni | BLOCKED | Staging HTTPS e dispositivi fisici |
| N01 | Offline/timeout scanner non indica ingresso accettato | BLOCKED | Agent 3: scanner integrato e browser |
| N02 | Email indisponibile/retry e richieste duplicate non inviano doppioni | BLOCKED | Agents 1/3: outbox persistente e adapter simulato |
| Z01 | Invio due giorni locali prima alle 10:00, DST e RSVP tardivo | BLOCKED | Agent 3: scheduler integrato e clock controllabile |

## Pilot: blocchi critici
Non risultano bug P0 riprodotti in questa esecuzione. Tuttavia l'assenza di autenticazione/RLS verificata, limiti transazionali, ticket/check-in atomico e flusso completo impedisce il pilot: sono funzionalità non disponibili o non verificate, non bug dichiarati riprodotti. Il branch check-in dichiara esplicitamente endpoint 503 e integrazione incompleta. Nessun test con persone, dati reali, email esterne o servizi a pagamento.

## Richieste agli agenti
- Agent 1: server integrato con database PostgreSQL isolato, fixture/seed sintetici, credenziali test separate, login staff/organizzazione e strumenti per orologio e test paralleli; indicare come ispezionare lo stato DB senza esporre segreti.
- Agent 3: adapter email finto ispezionabile e controllabile, clock configurabile, ticket e RPC scanner reali; indicare procedura di pulizia.
- Agent 2/4: dashboard e CSV integrati con dataset noto e istruzioni di avvio.
- Coordinatore/owner dei file condivisi: aggiungere esecuzione `node --experimental-strip-types --test tests/integration/*.test.mjs` allo script test/CI; proporre Playwright e browser installati in CI per visual/E2E. Nessuna dipendenza aggiunta da questa PR.
