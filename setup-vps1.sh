#!/bin/bash
set -e

echo "=== Настройка VPS 1 (192.144.59.118) ==="

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

cd site-interview

# 3. Создание .env
if [ ! -f ".env" ]; then
  echo "→ Создание .env файла..."
  cat > .env << 'EOF'
DATA_URL=https://s3.twcstorage.ru/5f60ae52-8657-407e-a83b-00b9cae4a175/data
DB_PASSWORD=change_me_strong_password
FRONTEND_URL=http://192.144.59.118
YANDEX_CLIENT_ID=
YANDEX_CLIENT_SECRET=
YANDEX_REDIRECT_URI=http://192.144.59.118/api/auth/yandex/callback
RAG_API_KEY=
EOF
fi

# 4. Запуск
echo "→ Запуск сайта, PostgreSQL и JSON RAG API..."
./scripts/deploy.sh

echo ""
echo "✓ VPS 1 готов!"
echo "  Web: http://192.144.59.118"
echo "  API: http://192.144.59.118/api/health"
echo ""
echo "Следующий шаг: настройка VPS 2 (бот)"
