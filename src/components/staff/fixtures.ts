// Purely synthetic fixtures for the design preview. No real people.
export const SAMPLE_EVENTS = [
  { id: "e1", name: "After Dark", venue: "Sample Venue · Bruxelles", date: "2026-11-21T23:00:00+01:00", capacity: 400 },
  { id: "e2", name: "Velvet Hour", venue: "Sample Loft · Antwerpen", date: "2026-12-05T22:00:00+01:00", capacity: 250 },
] as const;

export const SAMPLE_STATS = { invited: 312, verified: 241, rsvp: 198, checkedIn: 0 };

export type CodeStatus = "active" | "used" | "expired" | "revoked";
export const SAMPLE_CODES: { code: string; type: "personal" | "shared"; uses: string; expiry: string; status: CodeStatus }[] = [
  { code: "SMPL-7KQ2", type: "personal", uses: "1/1", expiry: "2026-11-20T23:59:00+01:00", status: "used" },
  { code: "SMPL-R4X9", type: "personal", uses: "0/1", expiry: "2026-11-20T23:59:00+01:00", status: "active" },
  { code: "SMPL-GRP1", type: "shared", uses: "18/40", expiry: "2026-11-18T23:59:00+01:00", status: "active" },
  { code: "SMPL-OLD3", type: "personal", uses: "0/1", expiry: "2026-10-01T23:59:00+02:00", status: "expired" },
  { code: "SMPL-X0X0", type: "shared", uses: "2/10", expiry: "2026-11-20T23:59:00+01:00", status: "revoked" },
];

export const SAMPLE_GUESTS = [
  { name: "Guest Alpha", email: "alpha@example.test", verified: true, rsvp: true, checkedIn: false },
  { name: "Guest Bravo", email: "bravo@example.test", verified: true, rsvp: false, checkedIn: false },
  { name: "Guest Charlie", email: "charlie@example.test", verified: false, rsvp: false, checkedIn: false },
  { name: "Guest Delta", email: "delta@example.test", verified: true, rsvp: true, checkedIn: false },
];

export const SAMPLE_STAFF = [
  { name: "Staff One", email: "one@example.test", role: "owner" as const },
  { name: "Staff Two", email: "two@example.test", role: "manager" as const },
  { name: "Staff Three", email: "three@example.test", role: "door" as const },
];