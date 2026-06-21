#!/bin/sh

serve -s /app/dist -l 8080 &

exec node /app/server/telegram-bot.mjs
