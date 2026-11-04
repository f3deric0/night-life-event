# Threat model e risultati iniziali — 2026-11-04

Baseline esaminata: main 69e6469b064d687b337a883835508bf2abf4d7f4; contratti V0, documenti 04/05/08/11/12/18/23/24 e handoff bootstrap. Il contratto descrive rotte pianificate; non è enforcement. Stato: NO-GO per evento reale.

## Confini e minacce
| Superficie / attore | Rischio | Controllo richiesto / verifica |
|---|---|---|
| Login anonimo → sessione staff | guessing, enumerazione, signup, sessione dopo revoca | errori uniformi, limiti distribuiti IP+username, session cookie Secure/HttpOnly/SameSite, rotazione, scadenza, revoca server e test account disabilitato |
| Staff → eventi / organizzazioni | IDOR, escalation, esportazione massiva | controllo server su ogni richiesta e RLS deny-by-default; test matrice anonimo/staff/admin × org/evento; niente service role sul client |
| Registrazione / invito | token condiviso o indovinato, quota concorrente | segreti casuali hashati, TTL/revoca, limiti, quote transazionali; test concorrenti e disclosure minima |
| Email / RSVP | scanner di posta consuma GET, replay, token rubato nei log o Referer | GET senza mutazioni, POST esplicito con protezione CSRF e token single-use atomico, TTL e scope, Referrer-Policy, redazione log, test GET/replay/scadenza |
| Ticket / scanner | QR riutilizzato, evento errato, race, offline verde | eligibility e appartenenza verificati server in transazione con vincolo unico; revoca, autorizzazione, due richieste concorrenti e manuale vs QR; timeout stato incerto, mai accettazione offline |
| Callback / cron | chiamate contraffatte, replay | verifica firma su raw body, timestamp/replay window dove supportato, idempotenza e protezione endpoint worker; test negativi |
| Browser / esportazione | XSS, CSRF, redirect aperto, CORS, formula CSV | escaping contestuale e CSP, query parametrizzate, origin/CSRF su mutazioni, redirect allowlist, CORS restrittivo; protezione formule anche whitespace/tab/CR e delimitatori; test su programma spreadsheet |
| Operazioni / fornitori | secret leakage, accesso non revocato, backup indisponibili | niente segreti nei log/client, accessi minimi, audit senza bearer/PII inutili, secret scan senza stampare valori, dependency audit e ripristino testato |

## Riscontri e classificazione
- **H-01, verificato — controllo assente nella baseline:** `src/lib/contracts/index.ts` specifica che è solo contratto; `docs/24_API_CONTRACT_FREEZE.md` dichiara endpoint non implementati; handoff agente 1 conferma login/DB non funzionanti. Questo è un blocco di readiness, non una prova di bypass sfruttabile. Proprietario: agente 1; implementare auth, RLS e API con test negativi prima di esporre dati reali.
- **H-02, verificato — check-in atomico non dimostrato:** baseline priva di DB/check-in operativo; handoff agente 1. Rischio di doppio ingresso in qualsiasi integrazione non atomica, non vulnerabilità dimostrata. Agente 1: RPC transazionale con vincolo unico; agente 3: usare esclusivamente RPC, verificare eleggibilità attuale e gestire timeout senza green. Test due client contro DB isolato, QR vs manuale.
- **H-03, verificato — test security non inclusi nella CI bootstrap:** `package.json` usa `tests/*.test.mjs`, escludendo sottocartelle. Anche test QA/reporting comunicano la stessa limitazione nelle PR #4/#5. Coordinatore/agente 1: includere esplicitamente test security e integrare negative tests nel gate; non considerare skip un pass di sicurezza.
- **M-01, potenziale — token in URL:** `docs/24` descrive `/verify?token=...`; possibile leakage a log, history e Referer. Agenti 1/2: redigere query in tutte le pipeline, referrer policy `no-referrer`, evitare terze parti, pulire URL solo dopo trasferimento sicuro al form; GET non consuma. Verificare log sintetici e navigazione.
- **M-02, potenziale — anteprima scambiata per prodotto:** README descrive demo non operativa; PR #2 e #3 sono in bozza. Agenti 2/3: etichettare chiaramente e fail closed; controllare route pubblicate e dati solo sintetici.
- **Critical:** nessuna vulnerabilità sfruttabile confermata dalla sola baseline. **Low:** nessuna verificata. Priorità rivalutabili dopo integrazione. Nessuna verifica di RLS, dipendenze, segreti, XSS, CSRF o CORS è stata completata: non dedurre assenza di vulnerabilità.

## Regression backlog per owner
1. Agente 1: test login/lockout/disabled/logout e revoca membership; matrice RLS CRUD per due organizzazioni e due eventi, inclusi anon e direct Supabase; tenant mismatch e service role protetta; POST conferma con replay/TTL/GET prefetch; CSRF e redirect; quote simultanee e audit redatto.
2. Agente 2: proteggere rendering e redirect; nessun effetto di GET verifica; stato offline/timeout scanner mai successo; test mobile e Referrer-Policy con agente 1.
3. Agente 3: firma webhook, cron, idempotenza outbox, server eligibility, revoca, doppio scan e QR contro manuale con DB; nessun token/PII nei log.
4. Agente 4: autorizzazione e filtro export a monte; test formula injection con prefissi `= + - @`, whitespace e separatori, citazioni e newline su import reali CSV/Excel.
5. Agente 5/6: CI includa esplicitamente sottocartelle, negative e dependency/secret scanning; staging isolato, backup e restore, prove sui dispositivi. Coordinatore collega evidenze ai commit integrati.
