---
id: security-sql-injection
title: Что такое SQL injection и как защититься?
category: Backend
scope: universal
languages: []
roles: ["Backend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Security", "SQL", "Injection"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

SQL injection: внедрение SQL кода в user input. Защита: prepared statements, parameterized queries, ORM. Никогда не конкатенировать SQL строки.

## Контекст

Классическая vulnerability. Проверяют понимание attack и defense.

## Как строить ответ

### Атака

`" OR 1=1 --"` в login → bypass auth. `"'; DROP TABLE users;--"` → удаление таблицы.

### Защита

Prepared statements: `SELECT * FROM users WHERE id = $1`. ORM: автоматически parameterizes. Input validation: whitelist.

## Пример ответа

SQL injection: `" OR '1'='1' --"` в поле login → `SELECT * FROM users WHERE login = '' OR '1'='1' --'` → все users. Защита: `SELECT * FROM users WHERE id = $1` с параметром. Never: `query("SELECT * FROM users WHERE id = " + userId)`.

## Частые ошибки

- Конкатенировать SQL строки
- Не валидировать input
- Использовать raw SQL без parameterization
- Давать права DB admin приложению

## Дополнительные вопросы

- Как работает prepared statement?
- Что такое ORM и как он защищает?
- Как проверить SQL injection vulnerability?
