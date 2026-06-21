FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY public/data/ ./public/data/
COPY server/ ./server/

CMD ["node", "server/telegram-bot.mjs"]
