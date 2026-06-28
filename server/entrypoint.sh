#!/bin/sh
set -e

echo "→ Waiting for PostgreSQL..."
for i in $(seq 1 30); do
  if node -e "require('pg').Client && process.exit(0)" 2>/dev/null; then
    break
  fi
  sleep 1
done
echo "✓ PostgreSQL check done"

echo "→ Running migrations..."
node server/db/migrate.mjs

echo "→ Seeding questions (if needed)..."
node server/db/seed.mjs

echo "→ Starting API server..."
exec node server/api.mjs
