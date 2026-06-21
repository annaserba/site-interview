FROM node:20-alpine

WORKDIR /app

COPY dist/ ./dist/
COPY server/ ./server/

EXPOSE 8080

CMD ["sh", "-c", "npx -y serve -s /app/dist -l 8080 & exec node /app/server/telegram-bot.mjs"]
