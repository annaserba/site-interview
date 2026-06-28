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
│  server/api.mjs — REST API, OAuth, RAG               │
└──────────┬───────────────────────┬───────────────────┘
           │                       │
    ┌──────┴──────┐         ┌──────┴──────┐
    │ PostgreSQL  │         │  RAG Engine │
    │ questions,  │         │ rag-core.mjs│
    │ users,      │         │ local JSON  │
    │ sessions,   │         └─────────────┘
    │ favorites,  │
    │ user_answers│
    └─────────────┘
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
├── docker-compose.yml          # db + api + web
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
| БД | PostgreSQL 16 |
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
# База данных
DB_PASSWORD=your_password

# Яндекс OAuth
YANDEX_CLIENT_ID=your_client_id
YANDEX_CLIENT_SECRET=your_client_secret
YANDEX_REDIRECT_URI=http://your-domain/api/auth/yandex/callback

# Фронтенд
FRONTEND_URL=http://your-domain
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev:web` | Dev-сервер (только фронтенд) |
| `npm run dev` | Dev-сервер + API |
| `npm run build` | Сборка для продакшена |
| `npm run db:migrate` | Миграции PostgreSQL |
| `npm run db:seed` | Заполнение БД вопросами |

## Деплой

1. Запушьте код на GitHub
2. На VPS создайте `.env` с переменными окружения
3. Запустите:
```bash
git pull
docker compose build --no-cache
docker compose up -d
```
4. Сайт доступен на `http://<VPS_IP>`

## Лицензия

MIT
