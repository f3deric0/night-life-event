import type { Metadata } from "next";
import "./globals.css";
import "./nightclub.css";

export const metadata: Metadata = {
  title: "Night Life Event — Anteprima",
  description: "Piattaforma multi-evento per inviti, RSVP e ingressi. Anteprima tecnica non operativa.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
