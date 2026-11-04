# Agente 2 — handoff frontend

- Stato: IN CORSO / BOZZA. Base `69e6469b064d687b337a883835508bf2abf4d7f4`; branch `agent/frontend`.
- PR: https://github.com/f3deric0/night-life-event/pull/2 (bozza). Commit applicativo `2b118924ec4f003c9119a380259914d83ad12c8c`. Nessun merge.
- Completato: prima sezione verticale interattiva su `/anteprima`, etichettata simulazione, con codice, form, verifica e RSVP separati, cambio risposta, messaggi e accessibilità di base. La simulazione non salva né invia dati e non produce prenotazioni o biglietti.
- Login staff usa il contratto `API_ROUTES.staff.login`, senza login fittizio o credenziali persistite; destinazione basata sul ruolo restituito dal server. Dashboard sintetica di sola lettura su `/anteprima/dashboard`; non è un’area privata. La pagina `/admin` è deliberatamente bloccata in attesa di autorizzazione server.
- File: `src/app/(public)/anteprima/page.tsx`, `src/app/(public)/anteprima/dashboard/page.tsx`, `src/components/guest/GuestPreview.tsx`, `src/lib/ui-client/api.ts`, `src/app/staff/login/page.tsx`, `src/app/admin/page.tsx`, `src/app/globals.css`, questo handoff.
- Mancano: pagina evento e flusso ospite reali, verifica/reinvio e RSVP via API, dashboard multi-evento, gestione eventi e codici, filtri, metriche e CSV; login e sessione reali dipendono dall'Agente 1. Preview non include un'autenticazione dimostrativa e non è adatta a eventi.
- Integrazione richiesta all'Agente 1: implementare gli endpoint condivisi e un controllo di sessione/ruolo lato server per tutte le rotte admin; definire meccanismo di proseguimento ospite, scadenza e resend. Per modifica evento, serie temporali e dettagli dashboard concordare i contratti non ancora definiti. Agente 3: stato biglietto e scanner.
- Nessuna credenziale o dato personale utilizzato. Nessuna dipendenza aggiunta.
- Test: `npm run lint` locale terminato con exit 127: eslint non installato. Typecheck, test e build non eseguiti localmente. CI della PR richiesta, esito non ancora disponibile. Test visuali mobile/desktop e accessibilità non ancora eseguiti.
