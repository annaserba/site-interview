---
id: security-csrf
title: Что такое CSRF и как защититься?
category: Frontend Architecture
scope: universal
languages: []
roles: ["Frontend", "Backend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Security", "CSRF", "Web"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

CSRF (Cross-Site Request Forgery): атакующий заставляет браузер выполнить запрос от имени пользователя. Защита: CSRF tokens, SameSite cookies, проверка Origin header.

## Контекст

Классическая web vulnerability. Проверяют понимание attack mechanism.

## Как строить ответ

### Механизм

User logged in → visits malicious site → malicious site sends request к bank → browser sends cookies → bank thinks это user.

### Защита

CSRF token: hidden form field, server validates. SameSite cookies: `SameSite=Strict`. Origin header: проверка来源.

## Пример ответа

Attack: `<img src="https://bank.com/transfer?to=attacker&amount=1000">` → browser sends cookies → bank executes transfer. Защита: CSRF token в form, сервер проверяет token. SameSite=Strict: cookies не отправляются с cross-site requests.

## Частые ошибки

- Не использовать CSRF tokens
- Не проверять Origin header
- Не использовать SameSite cookies
- Полагаться только на JavaScript

## Дополнительные вопросы

- Как генерировать CSRF tokens?
- Что такое SameSite cookie attribute?
- Как CSRF связан с CORS?
