# QA — istruzioni

I test sono indipendenti da pacchetti aggiuntivi e richiedono Node >=22 con supporto `--experimental-strip-types`. Dalla root:

```sh
node --experimental-strip-types --test tests/integration/*.test.mjs
```

I tre test di contratto usano il codice effettivo in `src/lib/contracts/index.ts`; riguardano solamente helper, rotte e fixture, non la sicurezza server. I quattro test HTTP sono saltati per default. Per provarli **solo su un server integrato locale e usa-e-getta**:

```sh
QA_HTTP=1 QA_BASE_URL=http://127.0.0.1:3000 node --experimental-strip-types --test tests/integration/http-security.test.mjs
```

Usare un ambiente isolato, senza dati reali e senza provider live. Il test consente solo origini loopback e richiede 401/403: 404 o 503 falliscono, perché non dimostrano protezione. Non modifica dati. Il comando non avvia server o database. Il test runner principale `npm test` nel bootstrap non include le sottocartelle; eseguire il comando esplicito fino alla modifica coordinata della CI. Il test HTTP è un controllo negativo limitato, non un audit di autorizzazione.

La matrice `SCENARIOS.md` traccia prerequisiti e stato reale. Quando le API saranno disponibili, aggiungere test di integrazione con seed deterministici, controlli nel DB e cleanup; le corse devono usare connessioni indipendenti verso un DB reale, non semplici mock. Conservare log e screenshot sintetici, senza token o dati personali.
