---
id: security-xss
title: Что такое XSS и как защититься?
category: Frontend Architecture
scope: universal
languages: []
roles: ["Frontend", "Backend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Security", "XSS", "Frontend"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

XSS (Cross-Site Scripting): внедрение malicious scripts в страницы. Типы: Stored (в БД), Reflected (в URL), DOM-based (в клиентском коде). Защита: sanitization, CSP, escape output.

## Контекст

Одна из самых частых web vulnerabilities. Проверяют понимание attack vectors.

## Как строить ответ

### Типы XSS

Stored: скрипт сохранён в БД, показывается всем. Reflected: скрипт в URL, execute при открытии. DOM-based: скрипт через DOM manipulation.

### Защита

Sanitize: DOMPurify, bleach. Escape: HTML entities. CSP: Content-Security-Policy header. HttpOnly cookies.

## Пример ответа

Stored XSS: user вводит `<script>steal(cookies)</script>` в комментарий, другой user видит → cookies украдены. Защита: sanitize input (DOMPurify), escape output, CSP: `script-src 'self'`. DOM XSS: `element.innerHTML = location.hash.slice(1)` → защищаем через `textContent`.

## Частые ошибки

- Не sanitize user input
- Не escape output
- Не использовать CSP
- innerHTML с user data

## Дополнительные вопросы

- Как работает Content-Security-Policy?
- Что такое DOMPurify?
- Как связаны XSS и CSRF?
