import type { Dataset } from './index.ts';
/** Must be implemented in the server backend with session-derived identity, RLS and event scoping. */
export interface AuthorizedReportingRepository<Session> {
  loadForAdmin(session: Session, eventId: string): Promise<Dataset>;
}
/** Fail closed: no supplied repository means no production data access. */
export async function loadReporting<Session>(repository: AuthorizedReportingRepository<Session> | null, session: Session, eventId: string): Promise<Dataset> {
  if (!repository) throw new Error('Authorized reporting repository unavailable');
  const result = await repository.loadForAdmin(session, eventId);
  if (result.event.id !== eventId) throw new Error('Repository returned wrong event');
  return result;
}
