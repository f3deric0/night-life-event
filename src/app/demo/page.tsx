import Link from "next/link";

const timeline = [
  ["01", "Codice d'invito", "L'ospite apre il proprio invito o un codice condiviso valido."],
  ["02", "Registrazione", "Nome, cognome e indirizzo email sono registrati per l'evento."],
  ["03", "Verifica email", "L'ospite conferma che l'indirizzo email gli appartiene."],
  ["04", "RSVP esplicito", "Soltanto dopo la verifica può scegliere SÌ oppure NO."],
  ["05", "Biglietto individuale", "Solo un ospite ammesso con RSVP SÌ riceve il QR, al momento previsto."],
  ["06", "Ingresso verificato", "Lo staff effettua una sola registrazione valida dell'ingresso."],
];

export default function DemoPage() {
  return (
    <main className="site-frame">
      <header className="site-nav">
        <Link href="/" className="brand">← Night Life Event</Link>
        <span className="notice">DATI SINTETICI</span>
      </header>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <span className="eyebrow">Esempio di percorso · NON INTERATTIVO</span>
        <h1>Dal codice all&apos;ingresso.</h1>
        <p>
          Questo percorso illustra soltanto gli stati previsti. Non salva dati,
          non genera QR, non invia email e non costituisce una procedura di accesso.
        </p>
      </section>
      <section className="grid" aria-label="Passaggi del percorso ospite">
        {timeline.map(([number, title, description]) => (
          <article className="panel" key={number}>
            <span className="eyebrow">PASSAGGIO {number}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>
      <footer className="footer"><span className="subtle">Solo anteprima · Nessuna funzionalità di produzione</span></footer>
    </main>
  );
}
