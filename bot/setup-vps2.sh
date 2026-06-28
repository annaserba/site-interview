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
API_URL=http://10.0.0.1
RAG_API_KEY=
EOF
fi

# 4. Запуск
echo "→ Запуск Bot..."
docker compose up -d --build

echo ""
echo "✓ VPS 2 готов!"
echo "  Bot API URL: $(grep '^API_URL=' .env | cut -d= -f2-)"
echo ""
echo "=== Следующие шаги ==="
echo "1. Проверь, что с VPS 2 открывается JSON RAG API:"
echo "   curl http://10.0.0.1/api/rag/health"
echo "2. Проверь бота в Telegram"
