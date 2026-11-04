import type { Metadata } from "next";
import { GuestFlow } from "@/components/guest/GuestFlow";

export const metadata: Metadata = {
  title: "After Dark — Night Life Event",
  description: "Una notte. Un invito. Accesso privato agli eventi Night Life Event.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <GuestFlow mode="public" />;
}
