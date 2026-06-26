---
id: yandex-frontend-ssr
title: Как реализуете SSR в React-приложении?
category: Frontend
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Яндекс"]
level: Senior
stage: Техническое
tags: ["React", "SSR", "Next.js"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Next.js, server-side rendering, hydration, streaming. Важно: SEO, performance, data fetching.

## Контекст

Интервьюер хочет понять ваш опыт SSR.

## Как строить ответ

### Next.js

Pages, app router, data fetching.

### Hydration

CSR vs SSR, hydration mismatch.

### Streaming

Suspense, streaming SSR.

### Performance

TTFB, FCP, LCP.

## Пример ответа

Next.js: pages, getServerSideProps. Hydration: React.hydrate, hydration mismatch handling. Streaming: Suspense, streaming SSR. Performance: TTFB < 200ms, FCP < 1s. Результат: SEO, fast initial load.

## Частые ошибки

- Hydration mismatch
- Not streaming
- Slow data fetching
- Not caching

## Дополнительные вопросы

- Какhandling-аете data fetching?
- Какcaching-аете SSR pages?
- Какdebug-аете hydration issues?
