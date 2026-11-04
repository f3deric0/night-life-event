import type { Metadata } from "next";
import { StaffLocked } from "@/components/staff/StaffLocked";

export const metadata: Metadata = { title: "Staff overview | Night Life Event", robots: { index: false, follow: false } };

export default function Page() { return <StaffLocked />; }
