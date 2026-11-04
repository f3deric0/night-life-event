# Runbook del proprietario — staging e rilascio

Stato 4 novembre 2026: il bootstrap è una demo, non gestisce registrazioni, invii o ingressi reali. Non pubblicare la serata pilota fino al superamento dei controlli sotto. Nessun servizio è stato creato.

## 1. Preparare staging, una sola volta
1. Dopo integrazione e revisione delle PR, il proprietario sceglie hosting (es. Vercel), Supabase e provider email (Resend è proposto). Verificare piani, limiti e costi correnti prima di aderire: nessuna carta o servizio a pagamento è necessario per questa PR.
2. Creare **progetti distinti** per staging e produzione, database e credenziali inclusi. Per staging usare solo dati fittizi e caselle autorizzate. Non copiare dati reali di produzione. Proteggere l'accesso alla preview; verificarne l'effettiva protezione sul piano scelto.
3. Collegare il repository privato al progetto hosting di staging. Configurare il deployment da una branch di integrazione rivista: evitare che una preview di PR non fidata riceva segreti o faccia invii. Non collegare staging al database di produzione. Controllare che deploy automatici non espongano l'app prima dell'autorizzazione.
4. Nel pannello segreti dell'hosting inserire i valori staging indicati in `infra/staging.env.example`; verificare i nomi con gli agenti dopo l'integrazione. `NEXT_PUBLIC_*` sono visibili ai browser. Secret key Supabase, chiave email e segreto cron restano solo lato server, mai nei log o nei file. Account e secret separati tra ambienti; conservare i segreti in password manager. Configurare URL HTTPS staging esatto e mittente di test verificato.
5. Applicare le migrazioni approvate al solo DB staging seguendo `DATABASE_BACKUP.md`, poi creare una preview autorizzata. Controllare l'URL e la protezione effettiva; eseguire test sintetici completi da `docs/23_INTEGRATION_AND_RELEASE.md`. Registrare SHA, ambiente e risultati. Non attivare scheduler finché autenticazione, idempotenza e test con email controllate non sono pronti.

## 2. Aggiornare
1. Aprire la PR integrata su GitHub, leggere i controlli e attendere che passino. Un audit o un test rosso è un blocco da valutare, non aggirare. L'owner approva il merge; l'agente non effettua merge.
2. Annotare SHA versione corrente e nuova, risultati dei test, migrazioni e compatibilità. Salvare snapshot e verificare backup/ripristino secondo `DATABASE_BACKUP.md`.
3. Aggiornare staging prima; controllare accesso staff, invito, registrazione, verifica email e RSVP separati, invio QR e scansione su telefoni reali con dati fittizi. Verificare le modifiche al provider email e allo scheduler.
4. Solo dopo approvazione esplicita e checklist pilota completa il proprietario può scegliere il deploy produzione tramite dashboard hosting. Non promuovere una preview che contenga chiavi di staging: impostazioni e segreti produzione sono separati. Annotare versione, ora, operatore ed esito.

## 3. Se qualcosa non funziona
Fermare registrazioni o invii se necessario; avvisare il responsabile tramite i canali concordati. Da dashboard hosting identificare l'ultimo deployment funzionante e usare la funzione di ripristino del provider previa verifica che sia compatibile con lo schema DB corrente. Un rollback del codice non annulla migrazioni o dati. Per DB consultare `DATABASE_BACKUP.md`; non ripristinare automaticamente sopra produzione. Per scanner senza rete usare solo procedura manuale approvata dal responsabile, senza promettere funzionamento offline o ammettere accessi non verificabili. Registrare incidenti senza nomi, email, token o QR.

## 4. Checklist prima della prima serata
- [ ] Dominio e HTTPS validi, preview protetta, privacy/età e responsabilità approvate.
- [ ] Migrazioni verificate e backup cifrato ripristinato con successo in DB isolato; piano e contatti disponibili.
- [ ] Dominio mittente verificato (SPF/DKIM secondo provider); inbox di test autorizzate; verifica email e ticket ricevuti; webhook autenticato e cron protetto, orario locale e fuso/DST provati.
- [ ] Ruoli e RLS verificati; test RSVP, capacità, revoca, evento errato e scansioni concorrenti superati.
- [ ] Due telefoni reali con fotocamera e HTTPS, accessi staff, caricabatterie, rete primaria e alternativa provati; accordo operativo per guasti.
- [ ] Monitoraggio e soglie assegnati a una persona reperibile; contatti per hosting, DB e email disponibili; dati di test rimossi secondo policy.
- [ ] Responsabile approva espressamente la pubblicazione. Nessun blocco aperto.
