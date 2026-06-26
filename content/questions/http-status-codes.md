---
id: http-status-codes
title: Какие HTTP статус-коды и когда их использовать?
category: JavaScript
scope: universal
languages: []
roles: ["Backend", "Frontend"]
companies: ["Несколько компаний"]
level: Junior
stage: Техническое
tags: ["HTTP", "Status Codes", "API"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

1xx: informational. 2xx: success (200 OK, 201 Created, 204 No Content). 3xx: redirect (301, 302, 304). 4xx: client error (400, 401, 403, 404, 409, 422, 429). 5xx: server error (500, 502, 503).

## Контекст

Фундаментальные codes для API design. Проверяют понимание when to use each.

## Как строить ответ

### 2xx Success

200 OK: successful request. 201 Created: resource created. 204 No Content: success, no body (DELETE).

### 4xx Client Error

400 Bad Request: invalid input. 401 Unauthorized: not authenticated. 403 Forbidden: not authorized. 404 Not Found: resource doesn't exist. 409 Conflict: duplicate. 422 Unprocessable: validation error. 429 Too Many Requests: rate limit.

### 5xx Server Error

500 Internal Server Error: unexpected error. 502 Bad Gateway: upstream error. 503 Service Unavailable: temporarily unavailable.

## Пример ответа

POST /users с валидными данными → 201 Created. GET /users/999 → 404 Not Found. POST /users с невалидным email → 422 Unprocessable Entity. DELETE /users/1 → 204 No Content. Rate limit exceeded → 429 Too Many Requests.

## Частые ошибки

- Использовать 200 для всех ответов
- Возвращать 500 для client errors
- Не использовать 429 для rate limiting
- Не информативные error messages

## Дополнительные вопросы

- Как связать статус-коды и error handling?
- Что такое 304 Not Found и caching?
- Как документировать статус-коды в API?
