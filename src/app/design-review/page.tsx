import type { Metadata } from "next";
import { DesignReview } from "@/components/guest/DesignReview";

export const metadata: Metadata = { title: "Design review | Night Life Event", robots: { index: false, follow: false } };

export default function Page() { return <DesignReview />; }
