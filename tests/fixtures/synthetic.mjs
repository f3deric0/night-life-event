// Reserved .invalid domain and deterministic values; never use for real delivery.
export const events = Object.freeze({
  a: { id: 'event-a', slug: 'qa-event-a', capacity: 2, timezone: 'Europe/Brussels' },
  b: { id: 'event-b', slug: 'qa-event-b', capacity: 1, timezone: 'America/New_York' },
});
export const guest = (n) => ({ firstName: 'Synthetic', lastName: `Guest${n}`, email: `guest${n}@example.invalid` });
export const eligible = Object.freeze({ emailVerification: 'verified', rsvp: 'yes', admission: 'admitted' });
