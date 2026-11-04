#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
command -v npm >/dev/null || { echo 'npm non disponibile' >&2; exit 1; }
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=high
