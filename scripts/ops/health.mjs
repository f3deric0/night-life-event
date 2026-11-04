// Reachability only: does not establish database, mail or check-in readiness.
const raw = process.argv[2];
try {
  if (!raw) throw new Error('missing URL');
  const url = new URL(raw);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) throw new Error('expected HTTPS URL without credentials, query or fragment');
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(10000), headers: { 'cache-control': 'no-cache' } });
  console.log(`HTTP ${response.status}: ${response.ok ? 'reachable' : 'unhealthy'}`);
  process.exitCode = response.ok ? 0 : 1;
} catch {
  console.error('Health check failed: use a reachable HTTPS URL without credentials, query or fragment.');
  process.exitCode = 1;
}
