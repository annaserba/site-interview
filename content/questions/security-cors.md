---
id: security-cors
title: Что такое CORS и как его настроить?
category: Backend
scope: universal
languages: []
roles: ["Backend", "Frontend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Security", "CORS", "Web"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

CORS (Cross-Origin Resource Sharing): механизм безопасности браузера, контролирующий доступ к ресурсам с другого origin. Заголовки: Access-Control-Allow-Origin, Access-Control-Allow-Methods. Preflight: OPTIONS запрос для complex requests.

## Контекст

Фундаментальный web security concept. Проверяют понимание browser security model.

## Как строить ответ

### Same-origin policy

Браузер блокирует requests между разными origins (protocol + host + port).

### CORS headers

Access-Control-Allow-Origin: какие origins могут доступиться. Access-Control-Allow-Methods: разрешённые HTTP methods.

### Preflight

Для complex requests (PUT, DELETE, custom headers) браузер сначала отправляет OPTIONS request.

## Пример ответа

Frontend (localhost:3000) → API (api.example.com). Без CORS: blocked. С CORS: `Access-Control-Allow-Origin: http://localhost:3000`. Preflight: OPTIONS → сервер отвечает methods allowed → actual request.

## Частые ошибки

- Использовать `Access-Control-Allow-Origin: *` в production
- Не об_PREFLIGHT OPTIONS requests
- Забывать про credentials (cookies)
- Не ограничивать methods

## Дополнительные вопросы

- Как настроить CORS в Express/Nginx?
- Что такое credentials в CORS?
- Как связаны CORS и CSRF?
