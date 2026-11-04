import type { ErrorKey } from "../i18n/dictionary";

// Sample code accepted ONLY on /design-review. Never grants real access.
export const SAMPLE_CODE = "SAMPLE-0000";

export function isSampleCode(input: string): boolean {
  return input.trim().toUpperCase() === SAMPLE_CODE;
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

export type GuestErrors = Partial<Record<keyof GuestForm, ErrorKey>>;

export function validateGuest(f: GuestForm, today = new Date()): GuestErrors {
  const e: GuestErrors = {};
  if (!f.firstName.trim()) e.firstName = "firstNameRequired";
  if (!f.lastName.trim()) e.lastName = "lastNameRequired";
  if (!f.birthDate) e.birthDate = "birthDateRequired";
  else {
    const d = new Date(f.birthDate + "T00:00:00");
    if (isNaN(d.getTime())) e.birthDate = "birthDateInvalid";
    else if (d > today) e.birthDate = "birthDateFuture";
  }
  if (!f.email.trim()) e.email = "emailRequired";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "emailInvalid";
  const digits = f.phone.replace(/[\s\-().]/g, "");
  if (!digits) e.phone = "phoneRequired";
  else if (!/^\d{6,14}$/.test(digits)) e.phone = "phoneInvalid";
  if (!f.demoAck) e.demoAck = "ackRequired";
  return e;
}