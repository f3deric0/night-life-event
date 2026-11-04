import Link from "next/link";

export default function StaffLoginPlaceholder() {
  return (
    <main className="site-frame">
      <header className="site-nav"><Link href="/" className="brand">← Night Life Event</Link></header>
      <section className="hero">
        <span className="notice">ACCESSO NON CONFIGURATO</span>
        <h1>Area staff in preparazione.</h1>
        <p>
          La futura area riservata richiederà username e password,
          autenticazione server e autorizzazioni per ruolo ed evento.
          Non è disponibile alcun accesso dimostrativo.
        </p>
      </section>
    </main>
  );
}
