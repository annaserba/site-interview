---
id: http-caching
title: Как работает HTTP кеширование?
category: JavaScript
scope: universal
languages: []
roles: ["Backend", "Frontend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["HTTP", "Caching", "Performance"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

HTTP caching: браузер/proxy хранят responses. Headers: Cache-Control (policy), ETag (validation), Last-Modified, Expires. Типы: strong cache (no request),协商 cache (revalidate).

## Контекст

Ключевой concept для performance. Проверяют понимание caching mechanisms.

## Как строить ответ

### Strong cache

Cache-Control: max-age=3600 (1 hour). Expires: absolute date. Браузер не отправляет request.

### 协商 Cache

ETag: version identifier. Last-Modified: timestamp. Браузер отправляет request с `If-None-Match`/`If-Modified-Since`. 304 Not Modified: use cache.

### Инструкции

no-cache: revalidate always. no-store: never cache. public/private: who can cache.

## Пример ответа

`Cache-Control: max-age=3600` → browser caches 1 hour. After 1 hour: `If-None-Match: "abc123"` → server: 304 Not Modified → use cache. `Cache-Control: no-store` → never cache (sensitive data).

## Частые ошибки

- Не использовать Cache-Control
- Кешировать sensitive data
- Не делать cache invalidation
- Использовать expires вместо max-age

## Дополнительные вопросы

- Как сделать cache invalidation?
- Что такое ETag и как его генерировать?
- Как связаны CDN и HTTP caching?
