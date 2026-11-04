# Checklist privacy e GO/NO-GO pilot

Tutti gli elementi sono **DA VERIFICARE**, salvo evidenza datata, commit/configurazione, responsabile e risultato registrati. Non è una valutazione legale né un'informativa approvata. Il titolare e, ove opportuno, un professionista qualificato decidono basi giuridiche, requisiti e testi prima dei dati reali.

| Controllo | Evidenza richiesta / responsabile |
|---|---|
| Minimizzazione | Inventario campi, finalità e necessità; dati scanner minimizzati; titolare + agente 1/2 |
| Finalità e basi giuridiche | Mappa per registrazione, accesso, sicurezza e marketing; valutazione documentata del titolare |
| Informativa | Identità e contatti titolare, finalità/basi, destinatari, trasferimenti, tempi, diritti e reclamo; versione collegata al form; validazione legale |
| Transazionale / marketing | Nessuna iscrizione implicita; scelta distinta e facoltativa se applicabile, prova e revoca gestibili; agente 1/2 |
| Diritti | Processo verificato di identità, accesso, rettifica, cancellazione applicabile e revoca; eccezioni e risposta registrate |
| Conservazione | Durate motivate per registrazioni, check-in, log, esportazioni e backup; cancellazione e verifica, eccezioni documentate |
| Età / DOB | Requisito legale e venue per luogo evento; confrontare dichiarazione età con DOB; niente documento/scansione di default |
| Staff | Profili nominativi, minima autorizzazione, revisione periodica, rimozione immediata e prova revoca/sessione |
| Responsabili / trasferimenti | Inventario hosting/database/email/analytics, accordi e subfornitori, ubicazioni e trasferimenti valutati |
| Backup / incidenti | Test restore isolato, cifratura e retention; responsabili, contatti, triage, comunicazione e valutazione obblighi breach |
| Log / export | Audit chi/quando/cosa senza token né dati non necessari, accesso ristretto, export minimo e cancellazione copie |
| Cookie / analytics | Inventario, necessità e valutazione consenso/ePrivacy, nessun token negli strumenti di analytics |

## Gate operativo
NO-GO se manca anche uno dei seguenti: revisione autorizzazione server/RLS e isolamento tenant con test negativi; sessioni e revoca; prova GET verifica senza consumo e POST single-use; emissione e revoca solo eleggibili; test concorrenza reale con esattamente un ingresso anche manuale vs QR; rete assente/timeout senza falsa accettazione; verifica webhook/cron e idempotenza; XSS/CSRF/CORS/redirect/CSV, secret/dependency scanning; privacy e retention approvate; restore, incident response e training; e2e sintetico, invio test controllato, due telefoni reali via HTTPS. Documentare risultati con versione/commit, ambiente, data, responsabile e problemi aperti. Il proprietario decide il pilot solo dopo chiusura dei blocchi; compilazione e test saltati non bastano.
