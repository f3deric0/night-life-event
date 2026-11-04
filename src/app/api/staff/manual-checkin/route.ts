import { unavailable } from "../../../../lib/checkin/unavailable";
export const dynamic = "force-dynamic";
// Fail closed: no authentication, scheduler signature or transactional RPC exists yet.
export async function POST(): Promise<Response> { return unavailable(); }
