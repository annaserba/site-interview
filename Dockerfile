FROM node:20-alpine

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY dist/ ./dist/
COPY server/ ./server/

CMD ["sh", "-c", "npx -y serve -s /app/dist -l 80 & exec node /app/server/telegram-bot.mjs"]
