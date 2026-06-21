FROM node:20-alpine

RUN apk add --no-cache ca-certificates curl unzip

# Install xray
RUN curl -fsSL https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip -o /tmp/xray.zip \
    && unzip /tmp/xray.zip -d /usr/local/bin/ \
    && chmod +x /usr/local/bin/xray \
    && rm /tmp/xray.zip

# Install serve globally
RUN npm install -g serve

WORKDIR /app

COPY dist/ ./dist/
COPY server/ ./server/
COPY scripts/xray-config.json ./xray-config.json

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
