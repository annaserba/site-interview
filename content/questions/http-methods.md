---
id: http-methods
title: Какие HTTP методы существуют и когда их использовать?
category: JavaScript
scope: universal
languages: []
roles: ["Backend", "Frontend"]
companies: ["Несколько компаний"]
level: Junior
stage: Техническое
tags: ["HTTP", "Methods", "REST"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

GET (read), POST (create), PUT (replace), PATCH (update), DELETE (remove), HEAD (headers only), OPTIONS (CORS/preflight), TRACE (diagnostic). Safe: GET, HEAD, OPTIONS. Idempotent: GET, PUT, DELETE, HEAD.

## Контекст

Фундаментальные methods для REST API. Проверяют понимание semantics.

## Как строить ответ

### CRUD маппинг

GET → Read. POST → Create. PUT → Replace. PATCH → Update. DELETE → Remove.

### Properties

Safe: не изменяют state (GET). Idempotent: повторный вызов = тот же результат (GET, PUT, DELETE).

### Специальные

HEAD: same как GET, но без body (для headers). OPTIONS: для CORS preflight. TRACE: echo request.

## Пример ответа

GET /users — safe, idempotent. POST /users — unsafe, not idempotent (создаёт нового user). PUT /users/1 — idempotent (заменяет entire user). PATCH /users/1 — not idempotent (частичное обновление). DELETE /users/1 — idempotent.

## Частые ошибки

- Использовать POST для reads
- Использовать GET для mutations
- Не понимать idempotency
- Использовать PATCH как PUT

## Дополнительные вопросы

- Что такое safe и idempotent methods?
- Как связаны HTTP methods и REST?
- Когда использовать HEAD vs GET?
