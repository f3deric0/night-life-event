/** Fail-closed HTTP boundary. Never logs request bodies or bearer secrets. */
const messages = {
  invalid_input: "Invalid request.",
  temporarily_unavailable: "Service temporarily unavailable.",
} as const;

type ErrorCode = keyof typeof messages;
function error(code: ErrorCode, status: number): Response {
  return Response.json(
    { ok: false, error: { code, message: messages[code], traceId: crypto.randomUUID() } },
    { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } },
  );
}
export function unavailable(): Response { return error("temporarily_unavailable", 503); }
export function invalid(): Response { return error("invalid_input", 400); }

/** Strict input checking is only a preparatory boundary; no backend is enabled. */
export function validateInvite(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const input = value as Record<string, unknown>;
  return Object.keys(input).every((key) => key === "eventSlug" || key === "code") &&
    typeof input.eventSlug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.eventSlug) && input.eventSlug.length <= 100 &&
    typeof input.code === "string" && input.code.length >= 1 && input.code.length <= 256 && ![...input.code].some((character) => { const n = character.charCodeAt(0); return n < 32 || n === 127; });
}

/** Consume at most 2 KiB, even when Content-Length is absent or dishonest. */
export async function parseInvite(request: Request): Promise<Response> {
  if (!/^application\/json(?:\s*;|\s*$)/i.test(request.headers.get("content-type") ?? "")) return invalid();
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > 2048)) return invalid();
  if (!request.body) return invalid();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2048) { void reader.cancel(); return invalid(); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const parsed: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    return validateInvite(parsed) ? unavailable() : invalid();
  } catch {
    return invalid();
  }
}
