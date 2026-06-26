---
id: security-session
title: Как безопасно управлять сессиями?
category: Backend
scope: universal
languages: []
roles: ["Backend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Security", "Sessions", "Cookies"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Сессии: server-side storage, session ID в cookie. Настройки: HttpOnly (no JS access), Secure (HTTPS only), SameSite (no CSRF), expires/max-age. Ротация: session invalidation при logout.

## Контекст

Альтернатива JWT. Проверяют понимание session security.

## Как строить ответ

### Cookie настройки

HttpOnly: prevents XSS access. Secure: HTTPS only. SameSite: prevents CSRF. Path: ограничивает scope.

### Безопасность

Ротация: new session ID after login. Timeout: idle и absolute. Invalidation: logout → delete.

### Хранение

Express: express-session. Store: Redis (production), Memory (development).

## Пример ответа

Cookie: `Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`. Redis: `sessions:abc123 → {userId: 1, expires: ...}`. Logout: `DELETE sessions:abc123`.

## Частые ошибки

- Не использовать HttpOnly
- Не делать Secure
- Не инвалидировать при logout
- Не делать timeout

## Дополнительные вопросы

- Как выбрать между sessions и JWT?
- Что такое session fixation?
- Как связать sessions и Redis?
