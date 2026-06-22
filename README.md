# in.depth — Подготовка к IT-интервью

Мобильный сайт с **172 реальными вопросами** от ведущих российских IT-компаний: Яндекс, Т-Банк, Ozon, VK, Avito, Okko, Wildberries, Сбер, Гознак, IT One, Usetech, Rutube и др.

## Возможности

- **172 вопроса** с примерами ответов и кодом из интервью
- **Фильтрация** по компаниям, ролям, стадиям, уровням сложности
- **AI-помощник** (RAG) — задайте вопрос и получите ответ из базы знаний
- **Страница деталей** — краткий ответ, развёрнутый пример, код, ошибки, follow-up вопросы
- **Мобильный дизайн** — оптимизирован для смартфонов
- **Деплой через Docker** на любой VPS

## Архитектура

```
┌─────────────────────────────────────────────────────┐
│                    КЛИЕНТ                            │
│  ┌─────────┐  ┌──────────┐  ┌────────────────────┐  │
│  │  Vite    │  │  React   │  │  PrismJS           │  │
│  │  Dev /   │→ │  SPA     │→ │  (подсветка кода)  │  │
│  │  Build   │  │          │  │                    │  │
│  └─────────┘  └────┬─────┘  └────────────────────┘  │
│                     │                                │
│              ┌──────┴──────┐                         │
│              │  RAG (в     │                         │
│              │  браузере)  │                         │
│              └──────┬──────┘                         │
└─────────────────────┼───────────────────────────────┘
                      │ fetch
              ┌───────┴────────┐
              │   S3 Storage   │
              │  questions.json│
              │  index.json    │
              └───────┬────────┘
                      │ HTTP
┌─────────────────────┼───────────────────────────────┐
│                 Docker (VPS)                         │
│  ┌──────────┐  ┌────┴─────┐  ┌──────────────────┐  │
│  │  nginx   │  │  serve   │  │  Telegram Bot    │  │
│  │  :8080   │→ │  static  │  │  (long polling)  │  │
│  │  static  │  │  files   │  │  → S3 / local    │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Структура проекта

```
├── content/questions/          # Markdown-файлы вопросов (172 шт.)
│   ├── yandex-*.md
│   ├── tbank-*.md
│   ├── ozon-*.md
│   └── ...
├── scripts/
│   ├── build-content.mjs       # Markdown → questions.json
│   ├── build-index.mjs         # Embedding index (SHA-256)
│   └── upload-s3.sh            # Загрузка на S3
├── server/
│   ├── telegram-bot.mjs        # Telegram бот (long polling)
│   └── rag-core.mjs            # RAG: retrieval + answer
├── src/
│   ├── App.tsx                 # Главная: список вопросов, фильтры
│   ├── QuestionDetail.tsx      # Страница деталей вопроса
│   ├── ChatBot.tsx             # AI-помощник (inline RAG)
│   ├── FilterDropdown.tsx      # Выпадающий фильтр
│   ├── dataClient.ts           # Загрузка данных из S3/localStorage
│   └── types.ts                # TypeScript типы
├── public/data/                # Собранные JSON (questions.json)
├── Dockerfile                  # Multi-stage: node build → nginx serve
├── docker-compose.yml          # Docker сервис
└── nginx.conf                  # Конфигурация nginx
```

## Стек технологий

| Компонент | Технология |
|-----------|-----------|
| Frontend | React 19, TypeScript, Vite 6 |
| Подсветка кода | PrismJS |
| Стили | CSS Modules, Mobile-first |
| Данные | Markdown → JSON (scripts) |
| Хранение | S3 (TwcStorage) + localStorage cache |
| RAG | Browser-embedded (SHA-256 векторы) |
| Бот | Node.js, Telegram Bot API |
| Деплой | Docker, nginx |
| VPS | Selectel (~150-600₽/мес) |

## Страница вопроса

```
┌─────────────────────────────┐
│  [Hero: компания, заголовок]│
├─────────────────────────────┤
│  01  Что от вас хотят       │
│  02  Краткий ответ          │
│  03  Как строить решение    │
│      (3-5 шагов)            │
│  ─── Код из интервью ─────  │
│  04  Пример ответа          │
│  05  Частые ошибки          │
│  06  Что могут спросить     │
├──────────┬──────────────────┤
│ Sidebar  │ Чек-лист ответа  │
│          │ Источники        │
│          │ Подсказка        │
└──────────┴──────────────────┘
```

## Быстрый старт

```bash
# Установка
npm install

# Разработка
npm run dev

# Сборка вопросов
npm run build

# Деплой через Docker
docker compose build
docker compose up -d
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер на localhost:5173 |
| `npm run build` | Сборка вопросов + Vite build |
| `node scripts/build-content.mjs` | Markdown → questions.json |
| `node scripts/build-index.mjs` | Построение embedding index |
| `bash scripts/upload-s3.sh` | Загрузка на S3 |

## Компании в базе

| Компания | Вопросов |
|----------|----------|
| Т-Банк | 28 |
| Okko | 25 |
| Яндекс | 13 |
| Гознак | 11 |
| Wildberries | 10 |
| Ozon | 5 |
| Avito | 5 |
| Сбер | 5 |
| VK | 3 |
| IT One | 3 |
| Usetech | 2 |
| Rutube | 1 |
| Лига Ставок | 1 |
| Несколько компаний | 66 |

## Деплой

1. Запушьте код на GitHub
2. На VPS: `git pull && docker compose build --no-cache && docker compose up -d`
3. Сайт доступен на `http://<VPS_IP>:8080`

## Лицензия

MIT
