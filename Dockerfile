FROM node:20-alpine

RUN apk add --no-cache ca-certificates curl unzip

# Pin xray to v1.8.23 (last version with H2 support)
RUN curl -fsSL https://github.com/XTLS/Xray-core/releases/download/v1.8.23/Xray-linux-64.zip -o /tmp/xray.zip \
    && unzip /tmp/xray.zip -d /usr/local/bin/ \
    && chmod +x /usr/local/bin/xray \
    && rm /tmp/xray.zip

# Install serve globally
RUN npm install -g serve

WORKDIR /app

# Install undici for proxy support
RUN npm init -y && npm install undici

COPY dist/ ./dist/
COPY server/ ./server/
COPY scripts/xray-config.json ./xray-config.json

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
