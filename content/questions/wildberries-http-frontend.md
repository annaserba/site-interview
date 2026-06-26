---
id: wildberries-http-frontend
title: Что важно знать frontend-разработчику про HTTP?
category: Web Platform
scope: multi-language
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Wildberries"]
level: Senior
stage: Техническое
tags: ["HTTP", "Caching", "Cache-Control", "ETag", "Semantics"]
duration: 20 мин
difficulty: 5
sourceCompany: Wildberries
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=HF7zkpSrByE&t=877s"
---

## Короткий ответ

HTTP — stateless request/response protocol с семантикой методов, status codes, headers, caching и content negotiation. Safe методы не меняют состояние, idempotent можно повторять без дополнительного эффекта. GET body формально не имеет общепринятой семантики и плохо поддерживается intermediaries; параметры передают в URI. Кеширование задают `Cache-Control`, validators `ETag`/`Last-Modified` и `Vary`; POST тоже может кешироваться при явных заголовках, хотя редко используется так.

## Контекст

Нужно показать не список методов, а влияние семантики на retries, proxies, CDN и браузерный cache.

## Как строить ответ

### Разделить методы

GET/HEAD safe и idempotent; PUT/DELETE idempotent по эффекту; POST обычно нет; PATCH зависит от операции.

### Разобрать кеш

Freshness и revalidation различаются; `no-cache` разрешает хранение с обязательной проверкой, `no-store` запрещает хранить.

### Сравнить версии

HTTP/2 мультиплексирует streams в одном TCP, HTTP/3 использует QUIC и снижает transport-level head-of-line blocking.


## Код из интервью

```typescript
// HTTP/2 multiplexing: multiple requests over single TCP connection
const fetchResources = async () => {
  const [css, js, data] = await Promise.all([
    fetch('/styles.css'),   // stream 1
    fetch('/app.js'),       // stream 2
    fetch('/api/data'),     // stream 3
  ]);
};

// Cache-Control strategies
const headers: Record<string, string> = {
  'Cache-Control': 'public, max-age=31536000, immutable', // static assets
  'Cache-Control': 'no-cache',                            // must revalidate
  'ETag': '"abc123"',                                     // validator
};

// Server-Sent Events for real-time updates
const eventSource = new EventSource('/events');
eventSource.onmessage = (e) => console.log(JSON.parse(e.data));
```

## Пример ответа

Frontend-разработчику важно знать: 1) HTTP methods — GET, POST, PUT, PATCH, DELETE и их семантику; 2) Status codes — 2xx (ok), 3xx (redirect), 4xx (client error), 5xx (server error); 3) Headers — Cache-Control, ETag, Content-Type, Authorization; 4) CORS — как работает preflight, credentials; 5) HTTP/2 — multiplexing, server push, header compression. На практике: я настраиваю кэширование (Cache-Control: max-age=31536000 для static assets), использую ETag для инкрементальных обновлений, оптимизирую через HTTP/2 multiplexing. Также важно понимать: HTTP/3 (QUIC) —未来的趋势, Service Workers для offline-first.

## Частые ошибки

- Считать HTTPS отдельной версией HTTP.
- Говорить, что POST невозможно кешировать.
- Путать `no-cache` и `no-store`.

## Дополнительные вопросы

- Зачем нужен `Vary`?
- Когда безопасно повторить запрос?
- Чем HTTP/2 отличается от HTTP/3?
