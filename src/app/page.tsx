import type { Metadata } from "next";
import { NightclubGuestExperience } from "@/components/guest/NightclubGuestExperience";

export const metadata: Metadata = {
  title: "After Dark — Night Life Event | Anteprima",
  description: "Una notte. Un invito. Esperienza ospite dimostrativa Night Life Event.",
  robots: { index: false, follow: false },
};

export default function HomePage() {
  return <NightclubGuestExperience />;
}
