---
id: frontend-cookie
title: Что такое cookie и как безопасно его использовать?
category: Web Platform
scope: multi-language
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Backend"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Cookies", "Sessions", "Security"]
duration: 12 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Cookie — небольшая пара name-value с областью действия и временем жизни, которую браузер хранит и автоматически отправляет подходящему origin. Для session id используйте `Secure`, `HttpOnly`, строгий Path и `SameSite=Lax` или `Strict` по сценарию; предпочтителен host-only cookie с префиксом `__Host-`. Значение подписывают или на сервере хранят только непрозрачный идентификатор, а сессию ротируют после входа.

## Контекст

Проверяется понимание жизненного цикла сессии, CSRF, XSS и области действия cookie.

## Как строить ответ

### Объяснить область

Domain определяет host matching, Path ограничивает отправку по URL, Expires или Max-Age делает cookie постоянным.

### Защитить сессию

HttpOnly закрывает чтение из JS, Secure требует HTTPS, SameSite снижает cross-site отправку. Ни один атрибут не заменяет общий контроль XSS и CSRF.

### Учесть эксплуатацию

Ограничьте размер и количество cookie, ротируйте session id, поддержите logout и серверное отозвание.


## Код из интервью

```typescript
// Cookie: small text sent with every request to matching origin
// Security flags for session cookies
document.cookie =
  "sessionId=abc123; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600";

// Read-only from JS (HttpOnly cookies are inaccessible)
document.cookie; // "sessionId=abc123" (non-HttpOnly ones)

// __Host- prefix enforces HTTPS, host-only, Path=/
document.cookie = "__Host-token=xyz; Secure; Path=/";

// Expiry strategies
// Session cookie (deleted when browser closes):
document.cookie = "theme=dark; Path=/";

// Persistent cookie (survives browser restart):
document.cookie = "lang=en; Max-Age=31536000; Path=/";

// SameSite controls cross-site sending:
// Lax (default) — sent on top-level GET from other site
// Strict — never sent cross-site
// None — sent everywhere (requires Secure)
document.cookie = "tracking=1; SameSite=None; Secure";
```

## Пример ответа

Cookie — это небольшой текстовый фрагмент (до 4KB), который браузер хранит и отправляет с каждым запросом к определённому домену. Используется для: авторизации (sessionId), персонализации (язык), аналитики (UTM-метки). Флаги безопасности: HttpOnly — недоступен из JavaScript (защита от XSS), Secure — только через HTTPS, SameSite — контроль CSRF. Пример:

```javascript
document.cookie = "sessionId=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600";
```

На практике: для JWT токена я использую HttpOnly cookie — это безопаснее, чем localStorage. Для analytics — обычные cookie с SameSite=Lax. Важно: cookie отправляются с каждым запросом, поэтому не стоит хранить в них много данных.

## Частые ошибки

- Хранить права пользователя в неподписанном cookie.
- Выставлять широкий Domain без необходимости.
- Считать, что удаление cookie на клиенте отзывает серверную сессию.

## Дополнительные вопросы

- Чем host-only cookie отличается от Domain cookie?
- Для чего нужен префикс `__Host-`?
- Как безопасно реализовать refresh token rotation?
