"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { staffLogin } from "@/lib/ui-client/api";

export default function StaffLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const result = await staffLogin({ username: username.trim(), password });
    setPassword(""); setPending(false);
    if (!result.ok) { setError(result.error.message); return; }
    window.location.assign(result.data.role === "staff" ? "/staff/scanner" : "/admin");
  }
  return <main className="site-frame"><header className="site-nav"><Link className="brand" href="/">← Night Life Event</Link></header>
    <section className="hero" style={{maxWidth: 520, paddingTop: 50}}><span className="eyebrow">Area riservata</span><h1>Staff access.</h1>
    <p>Accedi con le credenziali fornite dall’organizzatore. Il servizio è in preparazione.</p>
    <form onSubmit={submit} className="panel form-stack">
      <label htmlFor="username">Username</label><input id="username" autoComplete="username" required maxLength={128} value={username} onChange={e => setUsername(e.target.value)} />
      <label htmlFor="password">Password</label><input id="password" type={visible ? "text" : "password"} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
      <label className="check"><input type="checkbox" checked={visible} onChange={e => setVisible(e.target.checked)} /> Mostra password</label>
      {error && <p role="alert" className="form-error">{error}</p>}
      <button className="primary-link" disabled={pending}>{pending ? "Accesso in corso…" : "Accedi"}</button>
      <p className="subtle">Hai dimenticato la password? Contatta l’organizzatore.</p>
    </form></section></main>;
}
