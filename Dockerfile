FROM node:20-alpine

RUN apk add --no-cache ca-certificates curl

# Install xray
RUN curl -fsSL https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip -o /tmp/xray.zip \
    && unzip /tmp/xray.zip -d /usr/local/bin/ \
    && chmod +x /usr/local/bin/xray \
    && rm /tmp/xray.zip

WORKDIR /app

COPY dist/ ./dist/
COPY server/ ./server/
COPY scripts/xray-config.json ./xray-config.json

CMD ["sh", "-c", "xray run -c /app/xray-config.json & sleep 2 && npx -y serve -s /app/dist -l 80 & exec node /app/server/telegram-bot.mjs"]
