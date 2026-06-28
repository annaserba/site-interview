#!/bin/sh
set -e

echo "→ Waiting for PostgreSQL..."
until pg_isready -h db -U app -d site_interview -q 2>/dev/null; do
  sleep 1
done
echo "✓ PostgreSQL is ready"

echo "→ Running migrations..."
node server/db/migrate.mjs

echo "→ Seeding questions (if needed)..."
node server/db/seed.mjs

echo "→ Starting API server..."
exec node server/api.mjs
