#!/bin/sh

# Start xray in background
xray run -c /app/xray-config.json &
sleep 3

# Start serve in background
serve -s /app/dist -l 80 &

# Start bot in background with auto-restart
while true; do
  echo "[$(date)] Starting bot..."
  node /app/server/telegram-bot.mjs || echo "[$(date)] Bot crashed, restarting in 5s..."
  sleep 5
done
