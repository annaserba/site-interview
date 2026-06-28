FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY server/telegram-bot-remote.mjs ./

CMD ["node", "telegram-bot-remote.mjs"]
