---
id: security-auth
title: Что такое аутентификация и авторизация? Как их реализовать?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Frontend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Security", "Auth", "JWT"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Аутентификация: кто вы (login + password, token). Авторизация: что вам можно (roles, permissions). JWT: stateless token с payload. OAuth2: delegated authorization. Session: server-side storage.

## Контекст

Фундаментальный security concept. Проверяют понимание auth flows.

## Как строить ответ

### Аутентификация

JWT: token в header, payload с user info, signature для verification. Session: cookie с session ID, server-side storage.

### Авторизация

RBAC: roles (admin, user). ABAC: attributes (department, level). ACL: access control lists.

### Практики

Never store passwords в plain text. Use bcrypt/argon2. Implement rate limiting. Use HTTPS.

## Пример ответа

JWT flow: login → server creates JWT (userId, role, exp) → client stores в localStorage/cookie →每个 request в Authorization header → server verifies signature. RBAC: admin can edit, user can read. OAuth2: "Login with Google" → Google authenticates, gives token.

## Частые ошибки

- Хранить JWT в localStorage (XSS)
- Не валидировать JWT на сервере
- Использовать MD5 для паролей
- Не делать logout (invalidate token)

## Дополнительные вопросы

- Как сделать refresh token flow?
- Что такое OAuth2 PKCE?
- Как защитить от JWT theft?
