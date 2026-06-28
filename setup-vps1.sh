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
DB_PASSWORD=interview_secret_2024
YANDEX_CLIENT_ID=
YANDEX_CLIENT_SECRET=
EOF
fi

# 4. Запуск
echo "→ Запуск сервисов..."
docker compose up -d --build

echo ""
echo "✓ VPS 1 готов!"
echo "  Web: http://192.144.59.118"
echo "  API: http://192.144.59.118/api/health"
echo ""
echo "Следующий шаг: настройка VPS 2 (бот)"
