---
id: klp-distributed-id
title: Как генерировать уникальные ID в распределённых системах?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "ID Generation", "Snowflake"]
duration: 10 мин
difficulty: 3
secondaryCategory: Algorithms
---

## Короткий ответ

UUID: 128-bit, random, no coordination. Snowflake: 64-bit, time-based, sortable. Database sequences: coordination required. ULID: time-based, sortable, URL-safe.

## Контекст

Фундаментальная проблема для distributed systems. Проверяют понимание trade-offs.

## Как строить ответ

### UUID

Random, 128-bit, no coordination. Преимущество: simple, no single point of failure. Недостаток: large, not sortable.

### Snowflake

64-bit: timestamp (41 bits) + machine ID (10 bits) + sequence (12 bits). Преимущество: sortable, compact.

### Database sequences

Auto-increment. Преимущество: simple. Недостаток: coordination, bottleneck.

## Пример ответа

Snowflake: timestamp (ms since epoch) + machine ID (unique per instance) + sequence (per ms). Преимущество: sortable, 64-bit, distributed. Twitter Snowflake, Instagram. UUID v4: random 128-bit. Преимущество: no coordination. Недостаток: large, not sortable, index fragmentation. ULID: time-based, sortable, URL-safe. Преимущество: compact, sortable.

## Частые ошибки

- Использовать database sequences в distributed systems
- Не учитывать sorting requirements
- Игнорировать collision probability
- Не планировать machine ID allocation

## Дополнительные вопросы

- Как работает Snowflake ID generation?
- Что такое UUID v7?
- Как избежать collision в distributed ID generation?
