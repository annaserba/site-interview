#!/bin/sh

# Start xray in background (if it fails, continue anyway)
xray run -c /app/xray-config.json &
XRAY_PID=$!

# Wait for xray to be ready
sleep 3

# Start serve in background
serve -s /app/dist -l 80 &
SERVE_PID=$!

# Start bot in foreground (keeps container alive)
exec node /app/server/telegram-bot.mjs
