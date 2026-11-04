import Link from "next/link";

const pillars = [
  {
    title: "Inviti personali e condivisi",
    description: "Ogni evento avrà codici d'invito, limiti configurabili e registrazioni indipendenti.",
  },
  {
    title: "Email verificata, poi RSVP",
    description: "La verifica dell'indirizzo email e la conferma della presenza saranno due azioni distinte.",
  },
  {
    title: "Biglietti QR e ingresso",
    description: "Ogni ospite ammesso riceverà un biglietto individuale; un solo ingresso sarà registrato.",
  },
];

export default function HomePage() {
  return (
    <>
      <header className="site-frame site-nav">
        <span className="brand">Night Life Event</span>
        <span className="notice">ANTEPRIMA TECNICA</span>
      </header>
      <main className="site-frame">
        <section className="hero">
          <span className="eyebrow">Piattaforma multi-evento</span>
          <h1>Una guest list più semplice. Ogni evento, sotto controllo.</h1>
          <p>
            Inviti, registrazioni, conferme e ingressi in un unico percorso.
            Questa è una schermata di sviluppo: nessuna registrazione, email o scansione è ancora attiva.
          </p>
          <div className="actions">
            <Link className="primary-link" href="/demo">Esplora il flusso dimostrativo</Link>
            <a className="secondary-link" href="https://github.com/f3deric0/night-life-event" target="_blank" rel="noreferrer">
              Documentazione del progetto
            </a>
          </div>
        </section>
        <section aria-label="Funzioni previste" className="grid">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="panel">
              <span className="eyebrow">MVP previsto</span>
              <h2>{pillar.title}</h2>
              <p>{pillar.description}</p>
            </article>
          ))}
        </section>
      </main>
      <footer className="site-frame footer">
        <span className="subtle">Night Life Event · Bootstrap dimostrativo · Nessun dato reale</span>
        <Link href="/staff/login">Staff Access</Link>
      </footer>
    </>
  );
}
