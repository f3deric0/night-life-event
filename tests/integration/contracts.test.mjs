import test from 'node:test';
import assert from 'node:assert/strict';
import { isTicketEligible, EMAIL_VERIFICATION_STATUSES, RSVP_STATUSES, ADMISSION_STATUSES, API_ROUTES } from '../../src/lib/contracts/index.ts';
import { eligible, events, guest } from '../fixtures/synthetic.mjs';

test('display eligibility rejects every combination except verified + yes + admitted', () => {
  let accepted = 0;
  for (const emailVerification of EMAIL_VERIFICATION_STATUSES)
    for (const rsvp of RSVP_STATUSES)
      for (const admission of ADMISSION_STATUSES) {
        const expected = emailVerification === 'verified' && rsvp === 'yes' && admission === 'admitted';
        assert.equal(isTicketEligible({ emailVerification, rsvp, admission }), expected, JSON.stringify({ emailVerification, rsvp, admission }));
        accepted += Number(expected);
      }
  assert.equal(accepted, 1);
  assert.equal(isTicketEligible(eligible), true);
});

test('admin event paths encode identifiers as one path segment', () => {
  const id = 'other/event?x=1#part';
  for (const route of [API_ROUTES.admin.eventCodes, API_ROUTES.admin.eventGuests, API_ROUTES.admin.metrics]) {
    const path = route(id);
    assert.ok(path.includes(encodeURIComponent(id)));
    assert.ok(!path.includes(id));
  }
});

test('fixtures are synthetic and events isolated by identifier', () => {
  assert.notEqual(events.a.id, events.b.id);
  assert.notEqual(guest(1).email, guest(2).email);
  assert.match(guest(1).email, /@example\.invalid$/);
});
