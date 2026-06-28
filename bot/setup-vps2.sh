#!/bin/bash
set -e

echo "=== Настройка VPS 2 (144.124.255.55) ==="

# 1. Установка Docker
if ! command -v docker &> /dev/null; then
  echo "→ Установка Docker..."
  curl -fsSL https://get.docker.com | sh
fi

# 2. Клонирование репо
if [ ! -d "site-interview" ]; then
  echo "→ Клонирование репозитория..."
  git clone https://github.com/annaserba/site-interview.git
fi

cd site-interview/bot

# 3. Создание .env
if [ ! -f ".env" ]; then
  echo "→ Создание .env файла..."
  read -p "Введите BOT_TOKEN: " BOT_TOKEN
  cat > .env << EOF
BOT_TOKEN=$BOT_TOKEN
API_URL=http://10.0.0.1:3001
EOF
fi

# 4. Запуск
echo "→ Запуск WireGuard + Bot..."
docker compose up -d --build

echo ""
echo "✓ VPS 2 готов!"
echo "  WireGuard: 144.124.255.55:51820/udp"
echo ""
echo "=== Следующие шаги ==="
echo "1. Подключись к WireGuard на VPS 1:"
echo "   docker exec wireguard cat /config/peer1/peer1.conf"
echo "   (или отсканируй QR-код)"
echo ""
echo "2. Проверь隧道:"
echo "   docker exec wireguard ping 10.0.0.1"
echo ""
echo "3. Проверь бота в Telegram"
