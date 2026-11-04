import test from 'node:test';
import assert from 'node:assert/strict';
import { newTicketSecret } from '../src/lib/tickets/token.ts';
import { checkin } from '../src/lib/checkin/service.ts';
import { ticketDispatchAt, shouldDispatch } from '../src/lib/mail/schedule.ts';
import { canSendTicket, MockMailProvider, verificationMessage } from '../src/lib/mail/service.ts';

test('calendar scheduling handles spring and autumn DST and late confirmations', () => {
  assert.equal(ticketDispatchAt('2026-03-29T19:00:00Z','Europe/Brussels').toISOString(), '2026-03-27T09:00:00.000Z');
  assert.equal(ticketDispatchAt('2026-10-25T20:00:00Z','Europe/Brussels').toISOString(), '2026-10-23T08:00:00.000Z');
  assert.equal(shouldDispatch(new Date('2026-03-28T12:00Z'), '2026-03-29T19:00Z', 'Europe/Brussels'), true);
  assert.equal(shouldDispatch(new Date('2026-03-30T12:00Z'), '2026-03-29T19:00Z', 'Europe/Brussels'), false);
  assert.throws(() => ticketDispatchAt('bad','Europe/Brussels'));
  assert.throws(() => ticketDispatchAt('2026-03-29T19:00Z','invalid/zone'));
});
test('only verified, yes, admitted and active registrations are eligible', () => {
  const s = { emailVerification:'verified', rsvp:'yes', admission:'admitted', eventStatus:'open', ticketStatus:'issued', startsAt:'2026-03-29T19:00Z', timezone:'Europe/Brussels' };
  const now = new Date('2026-03-28T12:00Z');
  assert.equal(canSendTicket(s,now),true);
  for (const change of [{emailVerification:'unverified'},{rsvp:'no'},{admission:'waitlisted'},{ticketStatus:'revoked'},{eventStatus:'cancelled'}]) assert.equal(canSendTicket({...s,...change},now),false);
});
test('mock provider deduplicates same key, verification link must use HTTPS', async () => {
  const provider = new MockMailProvider();
  const msg = verificationMessage('fake@example.test','Test','https://example.test/verify?token=mock', new Date('2026-11-04T15:00Z'), 'verification:1:1');
  await Promise.all([provider.send(msg),provider.send(msg)]);
  assert.equal(provider.sent.length,1);
  assert.throws(() => verificationMessage('fake@example.test','Test','http://example.test',new Date(), 'x'));
});
test('opaque unique tokens, invalid and revoked responses', async () => {
  const a=newTicketSecret(), b=newTicketSecret(); assert.notEqual(a.token,b.token); assert.equal(a.hash.length,64); assert.ok(!a.token.includes('@'));
  assert.deepEqual(await checkin({redeem: async()=>{throw Error();}},'event','bad'),{status:'denied',reason:'invalid_ticket'});
  assert.deepEqual(await checkin({redeem: async()=>({status:'denied',reason:'revoked_ticket'})},'event',a.token),{status:'denied',reason:'revoked_ticket'});
  assert.deepEqual(await checkin({redeem: async()=>{throw Error();}},'event',a.token),{status:'denied',reason:'temporarily_unavailable'});
});
test('concurrent check-ins are forwarded to the atomic backend; mock permits only one', async () => {
  let redeemed=false; const gateway={redeem:async()=>{if(redeemed)return {status:'denied',reason:'already_checked_in'}; redeemed=true; return {status:'accepted',checkinId:'x',checkedInAt:'2026-01-01T00:00:00Z'};}};
  const token=newTicketSecret().token;
  const results=await Promise.all([checkin(gateway,'event',token),checkin(gateway,'event',token)]);
  assert.deepEqual(results.map(x=>x.status).sort(),['accepted','denied']);
  assert.equal(results.find(x=>x.status==='denied').reason,'already_checked_in');
});
