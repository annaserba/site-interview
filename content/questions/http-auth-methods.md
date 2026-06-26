---
id: http-auth-methods
title: Какие методы аутентификации существуют в HTTP?
category: Backend
scope: universal
languages: []
roles: ["Backend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["HTTP", "Authentication", "Security"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Basic Auth: base64(username:password) в заголовке. Bearer Token: JWT в Authorization header. API Keys: в header/query. OAuth2: delegated authorization. mTLS: certificate-based.

## Контекст

Фундаментальные auth mechanisms. Проверяют понимание HTTP auth.

## Как строить ответ

### Basic Auth

`Authorization: Basic base64(user:pass)`. Простой, но insecure (base64, не encryption). HTTPS обязателен.

### Bearer Token

`Authorization: Bearer <token>`. JWT, OAuth2 tokens. Stateless, scalable.

### API Keys

`X-API-Key: <key>` или `?api_key=<key>`. Простой для integration. Не для user auth.

## Пример ответа

Basic Auth: `Authorization: Basic YW5uYToxMjM0NTY=` (anna:123456). Bearer: `Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...`. API Key: `X-API-Key: abc123xyz`.

## Частые ошибки

- Использовать Basic Auth без HTTPS
- Хранить API keys в коде
- Не делать token expiry
- Использовать query params для敏感 data

## Дополнительные вопросы

- Как работает Bearer token flow?
- Что такое API key rotation?
- Как связать HTTP auth и CORS?
