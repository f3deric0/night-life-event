import { createHash, randomBytes } from "node:crypto";

// An opaque 256-bit bearer credential. Persist only the digest, never the token.
export function newTicketSecret(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashTicketSecret(token) };
}

export function hashTicketSecret(token: string): string {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw new Error("invalid ticket token");
  return createHash("sha256").update(token, "utf8").digest("hex");
}
