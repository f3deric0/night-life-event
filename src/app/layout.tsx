import type { Metadata } from "next";
import "./globals.css";
import "./nightclub.css";
import { I18nProvider } from "@/lib/i18n/context";

export const metadata: Metadata = {
  title: "Night Life Event",
  description: "Esperienza privata per eventi, inviti e ingressi.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body><I18nProvider>{children}</I18nProvider></body>
    </html>
  );
}
