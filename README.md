# in.depth — Подготовка к IT-интервью

Сайт с **1000+ реальными вопросами** от ведущих российских IT-компаний: Яндекс, Т-Банк, Ozon, VK, Avito, Okko, Wildberries, Сбер, Гознак, IT One, Usetech, Rutube и др.

## Возможности

- **1000+ вопросов** с примерами ответов, кодом и чек-листами
- **Фильтрация** по компаниям, ролям, темам, типам вопросов
- **Мок-интервью** — тренировка на случайных вопросах с таймером
- **Личный кабинет** — сохраняйте свои ответы на вопросы
- **Экспорт** — скачивание ответов в PDF и Markdown
- **AI-помощник** (RAG) — задайте вопрос и получите ответ из базы знаний
- **Авторизация** через Яндекс OAuth
- **Адаптивный дизайн** — работает на мобильных и десктопе
- **Деплой через Docker** на любой VPS

## Архитектура

```
┌──────────────────────────────────────────────────────┐
│                   Frontend (React)                    │
│  App.tsx → QuestionsPage / QuestionDetail / Profile  │
│  MockInterview / ChatBot                             │
└──────────────────────┬───────────────────────────────┘
                       │ fetch /api/*
┌──────────────────────┴───────────────────────────────┐
│                   API Server (Node.js)                │
│  server/api.mjs — REST API + JSON RAG                │
└──────────┬───────────────────────┬───────────────────┘
           │                       │
    ┌──────┴──────┐         ┌──────┴──────┐
    │ Optional DB │         │  RAG Engine │
    │ users,      │         │ rag-core.mjs│
    │ sessions,   │         │ JSON/S3     │
    │ favorites   │         │ questions   │
    └─────────────┘         └──────┬──────┘
                                   │
                         ┌─────────┴─────────┐
                         │ Telegram bot VPS  │
                         │ calls /api/rag/ask│
                         └───────────────────┘
```

## Структура проекта

```
├── src/
│   ├── App.tsx                 # Главная, роутинг, навигация
│   ├── QuestionsPage.tsx       # Страница всех вопросов с фильтрами
│   ├── QuestionDetail.tsx      # Детализация вопроса + свой ответ
│   ├── MockInterview.tsx       # Мок-интервью (тренировка)
│   ├── ProfilePage.tsx         # Личный кабинет + экспорт
│   ├── ChatBot.tsx             # AI-помощник (RAG)
│   ├── FilterDropdown.tsx      # Выпадающий фильтр
│   ├── api.ts                  # Клиентские API-вызовы
│   ├── filters.ts              # Определения фильтров
│   └── types.ts                # TypeScript типы
├── server/
│   ├── api.mjs                 # REST API сервер
│   ├── rag-core.mjs            # RAG: retrieval + answer
│   └── db/
│       ├── migrate.mjs         # Миграции PostgreSQL
│       └── seed.mjs            # Заполнение БД вопросами
├── docker-compose.yml          # api + web, db опционально через profile
├── Dockerfile                  # Frontend (nginx)
├── Dockerfile.api              # API сервер (Node.js)
└── nginx.conf                  # Проксирование /api → api:3001
```

## Стек технологий

| Компонент | Технология |
|-----------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Стили | CSS Modules, Mobile-first |
| API | Node.js, vanilla HTTP |
| Данные вопросов | JSON/S3 |
| БД | PostgreSQL 16, опционально для auth/user state |
| Авторизация | Yandex OAuth 2.0 |
| RAG | Local (SHA-256 векторы, cosine similarity) |
| Деплой | Docker Compose, nginx |

## Страница вопроса

```
┌─────────────────────────────┐
│  [Hero: компания, заголовок]│
├─────────────────────────────┤
│  01  Что от вас хотят       │
│  02  Краткий ответ          │
│  03  Мои ответы (свой ввод) │
│  04  Как строить решение    │
│  ─── Код из интервью ─────  │
│  05  Пример ответа          │
│  06  Частые ошибки          │
│  07  Что могут спросить     │
├──────────┬──────────────────┤
│ Sidebar  │ Чек-лист ответа  │
│          │ Источники        │
└──────────┴──────────────────┘
```

## Быстрый старт

```bash
# Установка
npm install

# Разработка (только фронтенд)
npm run dev:web

# Dev (фронтенд + API)
npm run dev

# Деплой через Docker
docker compose build
docker compose up -d
```

## Переменные окружения

```env
# JSON/S3 база знаний
DATA_URL=https://s3.twcstorage.ru/<bucket>/data

# Опциональная БД для Яндекс OAuth, сессий, избранного и пользовательских ответов.
# Если DATABASE_URL пустой, API всё равно стартует и использует JSON RAG.
DATABASE_URL=
DB_PASSWORD=your_password

# Яндекс OAuth
YANDEX_CLIENT_ID=your_client_id
YANDEX_CLIENT_SECRET=your_client_secret
YANDEX_REDIRECT_URI=http://your-domain/api/auth/yandex/callback

# Фронтенд
FRONTEND_URL=http://your-domain

# Опционально: ключ для бота/закрытого RAG endpoint
RAG_API_KEY=optional_api_key
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev:web` | Dev-сервер (только фронтенд) |
| `npm run dev` | Dev-сервер + API |
| `npm run build` | Сборка для продакшена |
| `npm run db:migrate` | Миграции PostgreSQL, если включена опциональная БД |
| `npm run db:seed` | Заполнение PostgreSQL, если он нужен для пользовательских функций |

## Деплой

### Основной VPS: сайт + JSON RAG API

На основном сервере не нужно поднимать Telegram-бота. Он запускается отдельно на втором VPS.

1. Запушьте код на GitHub.
2. На VPS создайте `.env` с `FRONTEND_URL`, `YANDEX_*` при необходимости и `DATA_URL` при использовании S3.
3. Запустите мягкий деплой без остановки всего стека:

```bash
git pull origin main
./scripts/deploy.sh
```

Или вручную:

```bash
git pull
docker compose build api web
docker compose up -d api web
```

Сайт доступен на `http://<VPS_IP>`.

### Опциональная БД

RAG и вопросы не зависят от PostgreSQL. Если нужны Яндекс OAuth, сессии, избранное и пользовательские ответы:

```bash
docker compose --profile db up -d db
./deploy.sh db
```

### Второй VPS: Telegram-бот

Бот не запускается на основном сервере. Он ходит в JSON RAG API сайта:

```bash
cd bot
cp .env.example .env
# заполните BOT_TOKEN, API_URL и при необходимости RAG_API_KEY
# API_URL должен указывать на web/API основного сервера без /api в конце:
# API_URL=http://10.0.0.1 или API_URL=http://192.144.59.118
docker compose up -d --build
```

## Лицензия

MIT
