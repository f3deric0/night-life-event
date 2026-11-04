// Demo-only, client-side checks. Real validation will happen server-side later.
export const DEMO_CODE = "NOTTE-DEMO-26";

export function isDemoCodeValid(input: string): boolean {
  return input.trim().toUpperCase() === DEMO_CODE;
}

export type GuestForm = {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  prefix: string;
  phone: string;
  demoAck: boolean;
};

export type GuestErrors = Partial<Record<keyof GuestForm, string>>;

export function validateGuest(f: GuestForm, today = new Date()): GuestErrors {
  const e: GuestErrors = {};
  if (!f.firstName.trim()) e.firstName = "Inserisci il tuo nome.";
  if (!f.lastName.trim()) e.lastName = "Inserisci il tuo cognome.";
  if (!f.birthDate) e.birthDate = "Inserisci la data di nascita.";
  else {
    const d = new Date(f.birthDate + "T00:00:00");
    if (isNaN(d.getTime())) e.birthDate = "Data non valida.";
    else if (d > today) e.birthDate = "La data non può essere nel futuro.";
  }
  if (!f.email.trim()) e.email = "Inserisci il tuo indirizzo email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()))
    e.email = "Indirizzo email non valido.";
  const digits = f.phone.replace(/[\s\-().]/g, "");
  if (!digits) e.phone = "Inserisci il numero di telefono.";
  else if (!/^\d{6,14}$/.test(digits)) e.phone = "Numero di telefono non plausibile.";
  if (!f.demoAck) e.demoAck = "Conferma di aver letto la nota sulla simulazione.";
  return e;
}