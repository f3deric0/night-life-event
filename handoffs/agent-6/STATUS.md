# Agente 6 — stato

Aggiornato: 2026-11-04. Branch `agent/devops`, base `69e6469b064d687b337a883835508bf2abf4d7f4`. PR e SHA finali sono visibili nella pagina GitHub della PR; non si fa merge autonomo.

- FATTO: inventario configurazioni; template staging, script di release e reachability, workflow aggiuntivo PR, runbook proprietario, migrazioni/backup/rollback e monitoring. Nessun file root o workflow esistente modificato.
- CI: nuovo workflow proposto, esecuzione su GitHub da verificare nella PR. Controlli applicativi dipendono dal repository completo e dal registry npm; non considerarli superati senza risultato osservato.
- STAGING BLOCCATO: servizi, URL protetto, progetti DB separati, credenziali e integrazione non ancora verificati. Nessun deployment, account o costo creato.
- Dipendenze: Agent 1 confermi variabili, migrazioni, CI esistente e pipeline di integrazione; Agent 3 definisca scheduler, webhook, metriche e test mail/check-in. Coordinare ogni modifica futura a workflow esistenti o root con Agent 1.
- Successivo: integrare PR approvate, predisporre servizi solo dopo scelta dell'owner e verificare costi; prova staging sintetica; backup cifrato e restore isolato; checklist pilota in `docs/ops/RUNBOOK.md`. Produzione vietata senza approvazione.
- Rischi: demo non operativa; no test live, restore, scanner fisici, RLS o mail verificati; dipendenze e audit possono cambiare; il solo check HTTP non certifica la funzionalità. Backup, segreti e log non devono contenere dati sensibili nel repository.
- Verifiche locali eseguite (Node 24.22.1): `bash -n scripts/ops/check.sh` exit 0; `node --check scripts/ops/health.mjs` exit 0; health check con URL HTTP e con credenziali respinti entrambi exit 1 come previsto. Lint, typecheck, test, build e audit non eseguiti localmente: checkout completo e dipendenze non disponibili nel workspace. CI GitHub: consultare i controlli della PR.
