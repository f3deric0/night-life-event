import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseInvite, validateInvite, unavailable } from '../src/lib/api-integration/http.ts';

const request = (body, headers = { 'content-type': 'application/json' }) => new Request('https://example.test/api/public/invite/validate', { method: 'POST', headers, body });
test('valid input never reports invite validity while backend is unavailable', async () => {
  const res = await parseInvite(request(JSON.stringify({ eventSlug: 'party-1', code: 'synthetic' })));
  assert.equal(res.status, 503);
  const data = await res.json();
  assert.equal(data.error.code, 'temporarily_unavailable');
  assert.equal(data.ok, false);
  assert.equal(res.headers.get('cache-control'), 'no-store');
});
test('malformed, excessive and unexpected input is rejected', async () => {
  for (const body of ['{', '[]', JSON.stringify({eventSlug: '../secret', code:'x'}), JSON.stringify({eventSlug:'party', code:'x', role:'admin'}), 'x'.repeat(2050)]) {
    assert.equal((await parseInvite(request(body))).status, 400);
  }
  assert.equal((await parseInvite(request('{}', {'content-type':'text/plain'}))).status, 400);
  assert.equal(validateInvite({eventSlug: 'party', code: 'x\u0000'}), false);
});
test('declared or streamed oversized body cannot reach a backend', async () => {
  assert.equal((await parseInvite(request('{}', {'content-type':'application/json','content-length':'9999'}))).status, 400);
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(2049)); controller.close(); } });
  const res = await parseInvite(new Request('https://example.test', {method:'POST', headers:{'content-type':'application/json'}, body:stream, duplex:'half'}));
  assert.equal(res.status, 400);
});
test('unavailable response contains no secrets', async () => {
  const res = unavailable();
  assert.equal(res.status, 503);
  assert.equal((await res.json()).ok, false);
});
