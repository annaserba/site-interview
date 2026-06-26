---
id: security-hashing
title: Как хешировать пароли и зачем это нужно?
category: Backend
scope: universal
languages: []
roles: ["Backend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Security", "Hashing", "Passwords"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Хеширование паролей: односторонняя функция (password → hash, обратно нельзя). Используйте bcrypt, argon2, scrypt. Никогда: MD5, SHA-256, plain text. Salt: уникальный для каждого пароля.

## Контекст

Ключевой security practice. Проверяют понимание password storage.

## Как строить ответ

### Хеширование

Bcrypt: slow hash, built-in salt. Argon2: memory-hard, resistant to GPU. Scrypt: memory-hard.

### Salt

Уникальный random value для каждого пароля. Предотвращает rainbow table attacks.

### Практики

Never: plain text, MD5, SHA-256. Always: bcrypt/argon2, salt, pepper (optional).

## Пример ответа

Registration: password → bcrypt(password, salt) → hash в БД. Login: password → bcrypt(password, stored_hash) → comparison. Bcrypt: 12 rounds, ~100ms. Argon2: memory-hard, GPU attacks.

## Частые ошибки

- Хранить пароли в plain text
- Использовать MD5/SHA
- Не использовать salt
- Слишком быстрый hashing (менее 100ms)

## Дополнительные вопросы

- Как выбрать между bcrypt и argon2?
- Что такое pepper?
- Как защитить от rainbow table attacks?
