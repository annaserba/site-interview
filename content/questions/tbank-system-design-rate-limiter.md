---
id: tbank-system-design-rate-limiter
title: Спроектируйте rate limiter для API банка
category: System Design
scope: system-design
languages: ["Go", "Java"]
roles: ["Backend"]
companies: ["Т-Банк"]
level: Senior
stage: Архитектура
tags: ["System Design", "Rate Limiting", "API", "Distributed"]
duration: 20 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Token Bucket для client-side, Sliding Window для server-side. Хранение: Redis с Lua-скриптом для атомарности. Ключи: user_id + endpoint. Лимиты: per-user, per-endpoint, global. При превышении — 429 Retry-After.

## Контекст

Системный дизайн для финтех-API: защита от abuse, fair usage, DDoS.

## Как строить ответ

### Алгоритмы

Token Bucket (популярный, гибкий), Sliding Window (точный), Fixed Window (простой).

### Хранение

Redis + Lua для атомарных операций.

### Лимиты

Per-user, per-IP, per-endpoint, global.

## Код из интервью

```go
// Token Bucket в Redis (Lua)
local tokens = redis.call('GET', KEYS[1]) or ARGV[1]
if tonumber(tokens) > 0 then
    redis.call('DECR', KEYS[1])
    return 1
else
    return 0
end
```

## Пример ответа

Token Bucket: каждый пользователь получает N токенов в секунду. Токены хранятся в Redis, декремент атомарный через Lua. Если токенов нет — 429 + Retry-After. Для глобального лимита — отдельный ключ. Для распределённых систем — consistent hashing по user_id на один Redis-шард.

## Частые ошибки

- Race condition без Lua
- Один лимит на всех
- Без Retry-After заголовка
- Не учитывать распределённость

## Дополнительные вопросы

- Как масштабируете Redis?
- Как тестируете rate limiter?
- Что если Redis упал?
