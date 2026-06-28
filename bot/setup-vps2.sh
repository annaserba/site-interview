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
DATA_URL=https://s3.twcstorage.ru/5f60ae52-8657-407e-a83b-00b9cae4a175/data
API_URLS=http://api:3001
RAG_API_KEY=
EOF
fi

# 4. Запуск
echo "→ Запуск локального JSON RAG API + Bot..."
docker compose up -d --build

echo ""
echo "✓ VPS 2 готов!"
echo "  Bot API URL: $(grep '^API_URLS=' .env | cut -d= -f2-)"
echo ""
echo "=== Следующие шаги ==="
echo "1. Проверь локальный JSON RAG API:"
echo "   docker compose exec -T api node -e \"fetch('http://127.0.0.1:3001/api/rag/health').then(r=>r.text()).then(console.log)\""
echo "2. Проверь бота в Telegram"
