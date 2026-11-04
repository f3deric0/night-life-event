import { test } from 'node:test';
import assert from 'node:assert/strict';

// Only an explicitly started, isolated local test instance may be contacted.
function localOrigin(value) {
  const u = new URL(value);
  if (u.protocol !== 'http:' || u.hostname !== '127.0.0.1' || !u.port || u.username || u.password || u.pathname !== '/' || u.search || u.hash) throw new Error('Only http://127.0.0.1:<port>/ is permitted');
  return u.origin;
}
test('target guard rejects remote hosts, credentials and paths', () => {
  for (const x of ['https://example.com','http://localhost:3000','http://127.0.0.1:3000/a','http://u:p@127.0.0.1:3000','http://127.0.0.1:3000/?x=1']) assert.throws(() => localOrigin(x));
  assert.equal(localOrigin('http://127.0.0.1:3000/'), 'http://127.0.0.1:3000');
});
const configured = process.env.SECURITY_LOCAL_ORIGIN;
const cases = [
  ['GET','/api/admin/events'], ['GET','/api/admin/events/synthetic-event/guests'],
  ['GET','/api/admin/events/synthetic-event/metrics'], ['GET','/api/admin/reports/export'],
  ['POST','/api/staff/checkin'], ['POST','/api/staff/manual-checkin'],
  ['POST','/api/internal/dispatch-tickets'], ['POST','/api/webhooks/email'],
];
for (const [method,path] of cases) test(`anonymous ${method} ${path} denied`, {skip: !configured && 'Requires isolated integrated local server; 404/503 are not evidence of protection'}, async () => {
  const origin = localOrigin(configured);
  const response = await fetch(origin + path, {method, redirect:'manual', signal: AbortSignal.timeout(5000), ...(method === 'POST' ? {headers:{'content-type':'application/json'}, body:JSON.stringify({eventId:'synthetic-event',qrToken:'synthetic-invalid-token'})} : {})});
  const allowed = path === '/api/webhooks/email' ? [400,401,403] : [401,403];
  assert.ok(allowed.includes(response.status), `expected rejection ${allowed.join('/')}; received ${response.status}; missing or unavailable route does not pass`);
});
