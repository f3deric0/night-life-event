import type { Metadata } from "next";
import { StaffLogin } from "@/components/staff/StaffLogin";

export const metadata: Metadata = { title: "Staff Access | Night Life Event", robots: { index: false, follow: false } };

export default function Page() { return <StaffLogin />; }
