---
id: http-headers
title: Какие HTTP заголовки важны и зачем они нужны?
category: JavaScript
scope: universal
languages: []
roles: ["Backend", "Frontend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["HTTP", "Headers", "Security"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Ключевые headers: Content-Type, Authorization, Cache-Control, Accept, CORS headers (Access-Control-*), Security headers (CSP, HSTS, X-Frame-Options). Каждый решает конкретную проблему.

## Контекст

Важный topic для web security и performance. Проверяют понимание headers usage.

## Как строить ответ

### Request headers

Content-Type: формат body. Authorization: credentials. Accept: ожидаемый формат. User-Agent: client info.

### Response headers

Cache-Control: caching policy. Content-Type: формат response. CORS: cross-origin access.

### Security headers

Content-Security-Policy: XSS prevention. Strict-Transport-Security: HTTPS only. X-Frame-Options: clickjacking prevention.

## Пример ответа

Request: `Authorization: Bearer abc123`, `Content-Type: application/json`, `Accept: application/json`. Response: `Cache-Control: max-age=3600`, `Content-Type: application/json`. Security: `Content-Security-Policy: default-src 'self'`, `Strict-Transport-Security: max-age=31536000`.

## Частые ошибки

- Не устанавливать Content-Type
- Не использовать security headers
- Игнорировать Cache-Control
- Не проверять Authorization header

## Дополнительные вопросы

- Как настроить Content-Security-Policy?
- Что такое Cache-Control directives?
- Как связаны headers и CORS?
