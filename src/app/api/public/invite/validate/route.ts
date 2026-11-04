import { parseInvite } from "../../../../../lib/api-integration/http";
export const runtime = "nodejs";
export async function POST(request: Request): Promise<Response> { return parseInvite(request); }
