import { API_ROUTES, type ApiResult, type StaffLoginRequest, type StaffSession } from "@/lib/contracts";

/** Server authorization remains authoritative. Never persist credentials in the client. */
export async function staffLogin(credentials: StaffLoginRequest): Promise<ApiResult<StaffSession>> {
  try {
    const response = await fetch(API_ROUTES.staff.login, {
      method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) return { ok: false, error: { code: response.status === 429 ? "rate_limited" : "unauthenticated", message: "Accesso non riuscito o servizio non disponibile." } };
    const result: unknown = await response.json();
    if (typeof result === "object" && result !== null && "ok" in result && (result as { ok: unknown }).ok === true && "data" in result) {
      const data = (result as { data: unknown }).data;
      if (typeof data === "object" && data !== null && "role" in data && ["owner", "admin", "staff"].includes(String((data as { role: unknown }).role))) return result as ApiResult<StaffSession>;
    }
    return { ok: false, error: { code: "temporarily_unavailable", message: "Risposta del servizio non valida." } };
  } catch {
    return { ok: false, error: { code: "temporarily_unavailable", message: "Servizio non disponibile. Riprova più tardi." } };
  }
}
