#!/bin/bash
set -e

cd /root/site-interview

echo "🔄 Pulling latest changes..."
git pull origin main

echo "🔨 Rebuilding Docker..."
docker compose down
docker compose build --no-cache
docker compose up -d

echo "✅ Deploy complete!"
