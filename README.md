# sobes-it — Подготовка к IT-интервью

Сайт с **372 реальными вопросами** от ведущих российских IT-компаний: Яндекс, Т-Банк, Ozon, VK, Avito, Okko, Wildberries, Сбер и др.

## Возможности

- **372 вопроса** с примерами ответов, кодом и чек-листами
- **SSG (Astro)** — все страницы генерируются статически на этапе билда, мгновенная загрузка
- **Фильтрация** по компаниям, ролям, темам, типам вопросов
- **Мок-интервью** — тренировка на случайных вопросах
- **Личный кабинет** — сохраняйте ответы, загружайте резюме
- **Экспорт** — PDF и Markdown для вопросов и ответов
- **AI-помощник** (RAG) — задайте вопрос и получите ответ из базы знаний
- **Блог** — статьи с разборами методологий собеседований
- **Видео-разборы** — реальные записи интервью с YouTube
- **Авторизация** через Яндекс OAuth
- **Офлайн-режим** — Service Worker + кеширование
- **Cookie consent** и **Политика конфиденциальности** (152-ФЗ)

## Архитектура

```
┌──────────────────────────────────────────────────────┐
│                Astro SSG (статичные HTML)             │
│  index.astro → questions.astro → blog/[id].astro     │
│  React-островки: MockInterview, Profile, ChatBot     │
└──────────────────────┬───────────────────────────────┘
                       │ fetch /api/*
┌──────────────────────┴───────────────────────────────┐
│                  API Server (Node.js)                 │
│  server/api.mjs — REST API + JSON RAG                │
└──────────┬───────────────────────┬───────────────────┘
           │                       │
    ┌──────┴──────┐         ┌──────┴──────┐
    │ PostgreSQL  │         │  RAG Engine  │
    │ users,      │         │ rag-core.mjs │
    │ sessions,   │         │ JSON data    │
    │ favorites   │         └──────────────┘
    └─────────────┘
```

## Стек

| Компонент | Технология |
|-----------|-----------|
| Фреймворк | Astro 7 (SSG) |
| Интерактив | React 19 (островки) |
| Стили | CSS Modules, Mobile-first |
| API | Node.js (vanilla HTTP) |
| БД | PostgreSQL 16 |
| Авторизация | Yandex OAuth 2.0 |
| RAG | SHA-256 vectors, cosine similarity |
| Деплой | Docker Compose, nginx |

## Структура

```
├── src/
│   ├── pages/                 # Astro-страницы (SSG)
│   │   ├── index.astro        # Главная
│   │   ├── questions.astro    # Все вопросы
│   │   ├── mock.astro         # Мок-интервью
│   │   ├── profile.astro      # Профиль
│   │   ├── privacy.astro      # Политика конфиденциальности
│   │   ├── blog/              # Блог
│   │   └── question/[id].astro # Страница вопроса
│   ├── components/            # React-островки + Astro-компоненты
│   │   ├── Header.astro       # Шапка (SSG)
│   │   ├── UserMenu.tsx       # Яндекс-авторизация (React)
│   │   ├── ProfileLoader.tsx  # Загрузка профиля (React)
│   │   └── ...
│   ├── layouts/Base.astro     # Базовый layout
│   ├── data/questions.json    # Вопросы (пре-бейк)
│   └── *.tsx                  # Остальные React-компоненты
├── server/                    # API сервер
│   ├── api.mjs
│   ├── rag-core.mjs
│   └── db/
├── scripts/                   # Сборка данных
│   ├── build-content.mjs      # Генерация questions.json из Markdown
│   ├── build-index.mjs        # Генерация поискового индекса
│   └── gen-stats.mjs          # Статистика
├── content/questions/         # Markdown-файлы вопросов
├── public/                    # Статика (SW, манифест, данные)
├── docker-compose.yml
├── Dockerfile                 # Frontend (nginx + Astro build)
├── Dockerfile.api             # API (Node.js)
├── nginx.conf
└── deploy.sh
```

## Быстрый старт

```bash
npm install
npm run build:ci   # полная сборка: данные → astro build
npm run dev        # dev-сервер
```

## Деплой

```bash
git pull && ./deploy.sh web    # только фронтенд
git pull && ./deploy.sh api    # только API
git pull && ./deploy.sh all    # полный стек
```

## Переменные окружения

```env
DB_PASSWORD=your_password
YANDEX_CLIENT_ID=your_client_id
YANDEX_CLIENT_SECRET=your_client_secret
YANDEX_REDIRECT_URI=http://sobes-it.ru/api/auth/yandex/callback
FRONTEND_URL=http://sobes-it.ru
```

## Лицензия

MIT
