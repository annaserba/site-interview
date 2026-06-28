#!/bin/bash
set -e

SERVICE=${1:-""}

if [ -z "$SERVICE" ]; then
  echo "Usage: ./deploy.sh <service>"
  echo "Services: api, web, bot, db"
  exit 1
fi

echo "→ Pulling latest changes..."
git pull

echo "→ Deploying $SERVICE..."
docker compose up -d --build --no-deps "$SERVICE"

echo "✓ $SERVICE deployed"
echo ""
echo "Logs: docker logs -f interview-$SERVICE"
