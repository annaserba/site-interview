---
id: http-cookies
title: Как работают cookies и зачем они нужны?
category: JavaScript
scope: universal
languages: []
roles: ["Backend", "Frontend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["HTTP", "Cookies", "Sessions"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Cookies: small text data, хранимые в браузере. Отправляются с каждым request к domain. Атрибуты: HttpOnly (no JS), Secure (HTTPS), SameSite (CSRF), Path, Expires/Max-Age. Использование: sessions, auth, preferences.

## Контекст

Фундаментальный mechanism для state management. Проверяют понимание cookie security.

## Как строить ответ

### Зачем

HTTP stateless: cookies хранят state между requests. Sessions: session ID в cookie.

### Атрибуты

HttpOnly: prevents XSS access. Secure: HTTPS only. SameSite: prevents CSRF. Path: scope. Expires: lifetime.

### Безопасность

HttpOnly + Secure + SameSite: minimum requirements. Never: sensitive data в cookies.

## Пример ответа

`Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`. Response: cookie stored. Next request: `Cookie: session=abc123`. Server: validates session.

## Частые ошибки

- Не использовать HttpOnly
- Не делать Secure
- Хранить sensitive data в cookies
- Не использовать SameSite

## Дополнительные вопросы

- Как работает SameSite cookie?
- Что такое session cookie vs persistent cookie?
- Как связаны cookies и JWT?
