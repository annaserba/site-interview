---
id: frontend-when-nextjs
title: Когда проекту действительно нужен Next.js?
category: Frontend Architecture
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Tech Lead"]
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

## Частые ошибки

- Выбирать Next.js только ради React.
- Называть SSR автоматическим ускорением.
- Не учитывать эксплуатацию Node runtime.

## Дополнительные вопросы

- Когда SSG лучше SSR?
- Нужен ли Next.js для B2B SPA?

