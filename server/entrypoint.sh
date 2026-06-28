#!/bin/sh
set -e

echo "→ Waiting for PostgreSQL..."
until node -e "
  const pg = require('pg');
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
  c.connect().then(() => { c.end(); process.exit(0); }).catch(() => process.exit(1));
" 2>/dev/null; do
  sleep 1
done
echo "✓ PostgreSQL is ready"

echo "→ Running migrations..."
node server/db/migrate.mjs

echo "→ Seeding questions (if needed)..."
node server/db/seed.mjs

echo "→ Starting API server..."
exec node server/api.mjs
