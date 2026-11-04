/** Fail closed until Agent 1 provides authentication and a transactional backend. */
export function unavailable(): Response {
  return Response.json({ ok: false, error: { code: "temporarily_unavailable", message: "Servizio non disponibile. Non autorizzare l'ingresso." } }, { status: 503, headers: { "Cache-Control": "no-store" } });
}
