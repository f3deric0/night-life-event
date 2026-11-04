"use client";
import { useEffect, useRef, useState } from "react";
import { API_ROUTES } from "../../lib/contracts";
import type { ApiResult, CheckinResult, StaffSession } from "../../lib/contracts";

type Detector = { detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]> };
type DetectorConstructor = new (options: { formats: string[] }) => Detector;
const labels: Record<string, string> = { already_checked_in: "Biglietto già utilizzato", wrong_event: "Biglietto di un altro evento", invalid_ticket: "Biglietto non valido", revoked_ticket: "Biglietto revocato", ineligible_registration: "Registrazione non ammessa", event_not_open: "Evento non aperto", unauthorized: "Accesso non autorizzato", temporarily_unavailable: "Servizio non disponibile: non autorizzare l'ingresso" };

export default function Scanner() {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const active = useRef(false);
  const busy = useRef(false);
  const [session, setSession] = useState<StaffSession | null>(null);
  const [eventId, setEventId] = useState("");
  const [message, setMessage] = useState("Verifica accesso in corso…");
  const [camera, setCamera] = useState(false);
  const [ticket, setTicket] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [reason, setReason] = useState("");
  const stop = () => { active.current = false; stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; setCamera(false); };
  useEffect(() => {
    let mounted = true;
    fetch(API_ROUTES.staff.session, { cache: "no-store", credentials: "same-origin" }).then(async r => {
      if (!r.ok) throw new Error();
      const result = await r.json() as ApiResult<StaffSession>;
      if (!result.ok || !Array.isArray(result.data.assignedEventIds)) throw new Error();
      if (mounted) { setSession(result.data); setMessage("Seleziona un evento assegnato."); }
    }).catch(() => { if (mounted) setMessage("Accesso non disponibile: effettua il login o riprova quando il servizio è attivo."); });
    return () => { mounted = false; active.current = false; stream.current?.getTracks().forEach(t => t.stop()); };
  }, []);
  async function submit(url: string, body: object) {
    if (busy.current || !session || !session.assignedEventIds.includes(eventId)) return;
    busy.current = true; stop(); setMessage("Verifica in corso…");
    try {
      const response = await fetch(url, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json() as ApiResult<CheckinResult>;
      if (!response.ok || !result.ok) { setMessage("Servizio non disponibile o accesso negato. Non autorizzare l'ingresso."); return; }
      if (result.data.status === "accepted") setMessage(`Ingresso autorizzato — ${result.data.checkedInAt}`);
      else setMessage(labels[result.data.reason] ?? "Ingresso negato");
    } catch { setMessage("Connessione assente o risposta incerta. Non autorizzare l'ingresso; verificare lo stato prima di riprovare."); }
    finally { busy.current = false; }
  }
  async function start() {
    if (!session || !session.assignedEventIds.includes(eventId)) return;
    const Ctor = (window as unknown as { BarcodeDetector?: DetectorConstructor }).BarcodeDetector;
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) { setMessage("La fotocamera richiede HTTPS e permesso del browser."); return; }
    if (!Ctor) { setMessage("Lettura QR non supportata da questo browser. Usa un dispositivo compatibile."); return; }
    try {
      const detector = new Ctor({ formats: ["qr_code"] });
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      if (!video.current) { stop(); return; }
      video.current.srcObject = stream.current; await video.current.play(); active.current = true; setCamera(true); setMessage("Inquadra il QR.");
      const scan = async () => {
        if (!active.current || !video.current) return;
        try { const hits = await detector.detect(video.current); if (hits[0]?.rawValue) { await submit(API_ROUTES.staff.checkin, { eventId, qrToken: hits[0].rawValue }); return; } }
        catch { stop(); setMessage("Lettura QR non disponibile. Riprova."); return; }
        if (active.current) window.setTimeout(scan, 300);
      };
      void scan();
    } catch { stop(); setMessage("Fotocamera non disponibile o permesso negato."); }
  }
  return <section style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem" }}>
    <h1>Scanner ingressi</h1><p role="status" aria-live="polite">{message}</p>
    {session && <><label>Evento assegnato <select value={eventId} onChange={e => { stop(); setEventId(e.target.value); }}><option value="">Seleziona</option>{session.assignedEventIds.map(id => <option key={id} value={id}>{id}</option>)}</select></label>
      <div><video ref={video} playsInline muted style={{ width: "100%", display: camera ? "block" : "none" }} /></div>
      <button type="button" disabled={!eventId || camera} onClick={() => void start()}>Apri fotocamera</button>{" "}<button type="button" onClick={stop}>Chiudi fotocamera</button>
      <form onSubmit={e => { e.preventDefault(); void submit(API_ROUTES.staff.checkin, { eventId, qrToken: ticket }); setTicket(""); }}><label>Token biglietto <input value={ticket} onChange={e => setTicket(e.target.value)} autoComplete="off" /></label><button disabled={!eventId || !ticket}>Verifica</button></form>
      <form onSubmit={e => { e.preventDefault(); void submit(API_ROUTES.staff.manualCheckin, { eventId, registrationId, reason }); }}><p>Ingresso manuale: ricerca ospite non ancora disponibile. Solo personale autorizzato.</p><label>ID registrazione <input value={registrationId} onChange={e => setRegistrationId(e.target.value)} /></label><label>Motivo <input value={reason} onChange={e => setReason(e.target.value)} /></label><button disabled={!eventId || !registrationId || !reason}>Richiedi ingresso manuale</button></form>
    </>}
  </section>;
}
