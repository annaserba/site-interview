---
id: klp-idempotency
title: Зачем нужна идемпотентность в распределённых системах?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Idempotency", "API Design"]
duration: 10 мин
difficulty: 3
secondaryCategory: Algorithms
---

## Короткий ответ

Идемпотентность — повторный вызов даёт тот же результат. Критически важна в distributed systems: network failures, retries, message duplicates. Реализация: idempotency keys, database constraints, conditional writes.

## Контекст

Фундаментальный concept для resilient APIs. Проверяют понимание как обрабатывать retries и duplicates.

## Как строить ответ

### Проблема

Network timeout → retry → duplicate operation. Payment twice, order twice.

### Решения

Idempotency keys: клиент генерирует уникальный key, сервер проверяет uniqueness. Database constraints: unique constraints prevent duplicates. Conditional writes: compare-and-swap.

## Пример ответа

Payment API: клиент генерирует idempotency_key, отправляет с запросом. Сервер: если key уже существует — возвращает cached result. Если нет — обрабатывает и сохраняет result с key. Database:唯一 constraint на idempotency_key. Или: version vector + compare-and-swap. Stripe API: idempotency keys для payment retries.

## Частые ошибки

- Не обеспечивать idempotency в APIs
- Не использовать idempotency keys
- Игнорировать retries в клиенте
- Не планировать deduplication

## Дополнительные вопросы

- Как реализовать idempotency keys?
- Что такое exactly-once semantics?
- Как связаны idempotency и event sourcing?
