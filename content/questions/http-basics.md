---
id: http-basics
title: Что такое HTTP и как он работает?
category: JavaScript
scope: universal
languages: []
roles: ["Backend", "Frontend"]
companies: ["Несколько компаний"]
level: Junior
stage: Техническое
tags: ["HTTP", "Protocol", "Web"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

HTTP (HyperText Transfer Protocol): Stateless request-response protocol. Методы: GET, POST, PUT, DELETE, PATCH. Статус-коды: 2xx (success), 3xx (redirect), 4xx (client error), 5xx (server error).

## Контекст

Фундаментальный protocol для web. Проверяют базовые знания.

## Как строить ответ

### Методы

GET: retrieve resource. POST: create resource. PUT: update resource. DELETE: delete resource. PATCH: partial update.

### Статус-коды

200 OK. 201 Created. 301 Moved Permanently. 400 Bad Request. 401 Unauthorized. 403 Forbidden. 404 Not Found. 500 Internal Server Error.

### Headers

Content-Type, Authorization, Cache-Control, Accept, User-Agent.

## Пример ответа

GET /api/users → 200 OK, [{id: 1, name: "Анна"}]. POST /api/users → 201 Created. GET /api/users/999 → 404 Not Found. DELETE /api/users/1 → 204 No Content.

## Частые ошибки

- Использовать GET для создания данных
- Не обрабатывать ошибки
- Не использовать правильные статус-коды
- Игнорировать headers

## Дополнительные вопросы

- Чем GET отличается от POST?
- Что такое idempotency в HTTP?
- Как работает Content-Type negotiation?
