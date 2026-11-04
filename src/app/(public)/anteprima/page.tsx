import Link from "next/link";
import { GuestPreview } from "@/components/guest/GuestPreview";

export default function Preview() {
  return <main className="site-frame"><header className="site-nav"><Link className="brand" href="/">← Night Life Event</Link><span className="notice">ANTEPRIMA</span></header>
    <GuestPreview /><p><Link className="secondary-link" href="/anteprima/dashboard">Esplora la dashboard dimostrativa</Link></p><footer className="footer"><span>Evento e dati di esempio · Nessun invio o prenotazione</span><Link href="/staff/login">Staff Access</Link></footer></main>;
}
