#!/bin/bash
set -Eeuo pipefail

cd /root/site-interview

echo "🔄 Pulling latest changes..."
git pull origin main

echo "🔨 Building images..."
docker compose build api web

echo "🚀 Starting JSON RAG API..."
docker compose up -d --no-deps api

echo "⏳ Waiting for API health..."
for i in {1..40}; do
  if docker compose exec -T api node -e "fetch('http://127.0.0.1:3001/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then
    break
  fi
  if [ "$i" -eq 40 ]; then
    echo "❌ API did not become healthy"
    docker compose ps
    docker compose logs --tail=120 api
    exit 1
  fi
  sleep 2
done

echo "🌐 Updating web..."
docker compose up -d --no-deps web

echo "✅ Deploy complete!"
