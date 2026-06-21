---
id: frontend-cors
title: Что такое CORS?
category: Web Platform
scope: multi-language
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Wildberries"]
level: Senior
stage: Техническое
tags: ["CORS", "HTTP", "Security"]
duration: 12 мин
difficulty: 4
sourceReports: [{"company":"Т-Банк"}]
sourceCompany: Wildberries
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=HF7zkpSrByE&t=1451s"
---

## Короткий ответ

CORS — HTTP-механизм, через который сервер разрешает браузеру читать cross-origin response. Same-origin policy применяется браузером; сервер не «блокирует CORS». Для non-simple запроса браузер отправляет preflight `OPTIONS`, проверяя origin, method и headers. При credentials нельзя использовать wildcard origin: сервер должен вернуть конкретный Origin, `Access-Control-Allow-Credentials: true` и корректный `Vary: Origin`.

## Контекст

Нужно отличать CORS от CSRF, аутентификации и сетевого контроля доступа.

## Как строить ответ

### Определить origin

Origin образуют scheme, host и port. Разные subdomain или port уже являются cross-origin.

### Объяснить preflight

Браузер кеширует разрешение на ограниченное время; фактический запрос отправляется только после успешной проверки.

### Указать границы безопасности

CORS не мешает curl или серверу отправить запрос и не защищает от CSRF; для cookies нужны SameSite, CSRF token и проверка Origin.

## Частые ошибки

- Добавлять `Access-Control-Allow-Origin` в request.
- Использовать `*` вместе с credentials.
- Считать CORS механизмом авторизации API.

## Дополнительные вопросы

- Какие запросы считаются simple?
- Зачем нужен `Vary: Origin`?
- Чем CORS отличается от CSRF?
