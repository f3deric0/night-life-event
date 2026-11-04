import type { Metadata } from "next";
import { BackOffice } from "@/components/staff/BackOffice";

export const metadata: Metadata = { title: "Back office design | Night Life Event", robots: { index: false, follow: false } };

export default function Page() { return <BackOffice />; }
