// Opt-in against a locally running, disposable integrated app only.
import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.QA_BASE_URL;
const enabled = process.env.QA_HTTP === '1';
function localUrl() {
  const url = new URL(base || 'http://127.0.0.1:3000');
  if (!['http:', 'https:'].includes(url.protocol) || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('QA_BASE_URL must be a loopback origin');
  return url;
}
for (const path of ['/api/admin/events', '/api/admin/reports/export', '/api/admin/events/qa-event-a/guests', '/api/admin/events/qa-event-a/metrics']) {
  test(`anonymous private API is denied without leaking data: ${path}`, { skip: !enabled && 'Set QA_HTTP=1 only for a local disposable integrated app' }, async () => {
    const res = await fetch(new URL(path, localUrl()), { redirect: 'manual', signal: AbortSignal.timeout(5000) });
    assert.ok([401, 403].includes(res.status), `expected 401/403, got ${res.status}; 404/503 is not proof of authorization`);
    const body = await res.text();
    assert.doesNotMatch(body, /guest\d+@example\.invalid|"items"\s*:/i);
  });
}
