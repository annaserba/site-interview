#!/bin/bash
set -Eeuo pipefail

SERVICE=${1:-""}

if [ -z "$SERVICE" ]; then
  echo "Usage: ./deploy.sh <service>"
  echo "Services: api, web, db, all"
  exit 1
fi

echo "→ Pulling latest changes..."
git pull

wait_for_db() {
  echo "→ Waiting for db..."
  for i in {1..30}; do
    if docker compose exec -T db pg_isready -U app -d site_interview >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done
  docker compose logs --tail=80 db
  return 1
}

wait_for_api() {
  echo "→ Waiting for api..."
  for i in {1..40}; do
    if docker compose exec -T api node -e "fetch('http://127.0.0.1:3001/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done
  docker compose ps
  docker compose logs --tail=120 api
  return 1
}

if [ "$SERVICE" = "all" ]; then
  echo "→ Deploying full stack without docker compose down..."
  docker compose build api web
  docker compose up -d --no-deps api
  wait_for_api
  docker compose up -d --no-deps web
elif [ "$SERVICE" = "api" ]; then
  echo "→ Deploying JSON RAG api..."
  docker compose build api
  docker compose up -d --no-deps api
  wait_for_api
elif [ "$SERVICE" = "db" ]; then
  echo "→ Starting optional database..."
  docker compose --profile db up -d db
  wait_for_db
  echo "→ Applying optional database migrations and seed..."
  docker compose run --rm -e DATABASE_URL="postgresql://app:${DB_PASSWORD:-interview_secret_2024}@db:5432/site_interview" api node server/db/migrate.mjs
  docker compose run --rm -e DATABASE_URL="postgresql://app:${DB_PASSWORD:-interview_secret_2024}@db:5432/site_interview" api node server/db/seed.mjs
else
  echo "→ Deploying $SERVICE..."
  docker compose up -d --build --no-deps "$SERVICE"
fi

echo "✓ $SERVICE deployed"
echo ""
echo "Logs: docker compose logs -f $SERVICE"
