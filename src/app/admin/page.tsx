import Link from "next/link";

/** Fail closed until Agent 1 supplies server-side session and role enforcement. */
export default function AdminUnavailable() {
  return <main className="site-frame"><header className="site-nav"><Link className="brand" href="/">← Night Life Event</Link></header><section className="hero"><span className="notice">AREA NON DISPONIBILE</span><h1>Dashboard in preparazione.</h1><p>L’accesso ai dati degli eventi richiederà una sessione verificata e autorizzazioni controllate dal server. Nessun dato reale è disponibile qui.</p><Link className="secondary-link" href="/staff/login">Staff Access</Link></section></main>;
}
