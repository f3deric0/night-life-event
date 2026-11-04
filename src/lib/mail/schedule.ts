/** Calendar arithmetic takes place in the event's IANA zone, not UTC minus 48h. */
export function ticketDispatchAt(startsAt: string, timezone: string): Date {
  const start = new Date(startsAt);
  if (!Number.isFinite(start.getTime())) throw new Error("Invalid event timestamp");
  const format = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  const parts = (date: Date) => Object.fromEntries(format.formatToParts(date).filter(p => p.type !== "literal").map(p => [p.type, Number(p.value)]));
  const local = parts(start);
  const day = new Date(Date.UTC(local.year, local.month - 1, local.day - 2, 10));
  const target = day.getTime();
  let instant = target;
  for (let i = 0; i < 5; i++) {
    const p = parts(new Date(instant));
    const represented = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    const next = instant + target - represented;
    if (next === instant) break;
    instant = next;
  }
  const result = parts(new Date(instant));
  if (result.year !== day.getUTCFullYear() || result.month !== day.getUTCMonth() + 1 || result.day !== day.getUTCDate() || result.hour !== 10 || result.minute !== 0) throw new Error("Local dispatch time is not uniquely representable");
  // Reject ambiguous local times (unusual historical transitions); do not send at a guessed time.
  for (const delta of [-7200000, -3600000, 3600000, 7200000]) {
    const p = parts(new Date(instant + delta));
    if (p.year === result.year && p.month === result.month && p.day === result.day && p.hour === 10 && p.minute === 0) throw new Error("Ambiguous local dispatch time");
  }
  return new Date(instant);
}

export function shouldDispatch(now: Date, startsAt: string, timezone: string): boolean {
  if (!Number.isFinite(now.getTime())) throw new Error("Invalid current time");
  return now.getTime() >= ticketDispatchAt(startsAt, timezone).getTime() && now.getTime() < new Date(startsAt).getTime();
}
