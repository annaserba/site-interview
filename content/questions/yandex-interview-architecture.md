---
id: yandex-interview-architecture
title: Как спроектировать кэширование для высоконагруженного сервиса?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Яндекс"]
level: Senior
stage: Архитектура
tags: ["Caching", "High Load", "Architecture"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Многоуровневое кэширование: browser cache → CDN → application cache (Redis) → database cache. Invalidation strategies: TTL, event-based, versioning. Hot keys: replication, local cache.

## Контекст

Типичный system design вопрос на собеседовании в Яндексе. Проверяют ability проектировать scalable caching.

## Как строить ответ

### Уровни кэша

Browser: Cache-Control headers. CDN: edge caching. App: Redis/Memcached. DB: query cache, materialized views.

### Invalidation

TTL: time-based. Event-driven: invalidate on write. Versioning: cache key с version.

### Hot keys

Replication: multiple Redis instances. Local cache: in-process LRU. Pre-warming.

## Пример ответа

Levels: browser (1 hour) → CDN (5 min) → Redis (1 min) → DB. Hot key "popular_product": replicate across 5 Redis instances. Invalidation: product update → event → invalidate all caches. Cache stampede: lock + early expiration.

## Частые ошибки

- Кэшировать всё без стратегии
- Не планировать invalidation
- Игнорировать hot keys
- Не делать cache warming

## Дополнительные вопросы

- Как выбрать TTL для different data?
- Что такое cache stampede и как его предотвратить?
- Как масштабировать Redis кэш?
