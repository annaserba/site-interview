---
id: frontend-when-nextjs
title: Когда проекту действительно нужен Next.js?
category: Frontend Architecture
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Leadership"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Next.js", "SSR", "React"]
duration: 15 мин
difficulty: 4
sourceCompany: Frontend-интервью
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=ylVbg-ftFTQ&t=183s"
---

## Короткий ответ

Next.js оправдан, когда нужны server rendering/streaming, SEO и social previews, server components/actions, единый full-stack deployment или стандартизированный routing/data loading. Для закрытой B2B SPA эти преимущества могут не окупить server runtime, cache complexity, hydration и vendor-specific behavior. Выбор начинается с rendering matrix по маршрутам, требований к TTFB/LCP, инфраструктуры и ownership сервера.

## Контекст

Интервьюер спрашивает, зачем Next.js использовали во внутреннем приложении.

## Как строить ответ

### Требования

Индексируемость, персонализация, latency и backend-for-frontend.

### Цена

Runtime, caching, hydration, deployment и debugging.

### Альтернативы

Vite SPA, static generation или отдельный BFF.


## Код из интервью

```yaml
# Архитектурная конфигурация

# Docker Compose — базовая структура
version: "3.8"
services:
  api:
    build: ./api
    ports: ["3000:3000"]
    environment:
      - DATABASE_URL=postgres://db:5432/mydb
    depends_on: [db, redis]
  frontend:
    build: ./frontend
    ports: ["80:80"]
    depends_on: [api]
  db:
    image: postgres:16
    volumes: ["pgdata:/var/lib/postgresql/data"]
volumes:
  pgdata:
```

## Пример ответа

Next.js нужен, когда: 1) SEO критичен — SSR/SSG генерирует HTML на сервере; 2) Performance — автоматическое code splitting, оптимизация изображений; 3) Full-stack — API routes, не нужен отдельный backend для простых эндпоинтов; 4) Масштабируемость — ISR для обновления SSG без пересборки. Когда НЕ нужен: SPA с динамическим контентом (админ-панели), если нет SEO-требований. Пример: e-commerce — SSR для страниц товаров, ISR для каталога, API routes для корзины. В Next.js 13+ App Router с React Server Components — компоненты рендерятся на сервере, уменьшая JS bundle.

## Частые ошибки

- Выбирать Next.js только ради React.
- Называть SSR автоматическим ускорением.
- Не учитывать эксплуатацию Node runtime.

## Дополнительные вопросы

- Когда SSG лучше SSR?
- Нужен ли Next.js для B2B SPA?

