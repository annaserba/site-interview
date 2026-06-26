---
id: klp-caching
title: Как проектировать кеширование в распределённых системах?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Caching", "Redis"]
duration: 10 мин
difficulty: 3
secondaryCategory: Data Engineering
---

## Короткий ответ

Кеширование: хранение frequently accessed данных в быстрой storage. Стратегии: cache-aside, write-through, write-behind. Инструменты: Redis (in-memory), Memcached. Проблемы: cache invalidation, thundering herd, cache stampede.

## Контекст

Фундаментальный component для performance. Проверяют понимание caching strategies и invalidation.

## Как строить ответ

### Стратегии

Cache-aside: application checks cache, then DB. Write-through: write to cache + DB. Write-behind: write to cache, async to DB.

### Инвалидация

Time-based (TTL), event-based (invalidation events), versioning.

### Проблемы

Cache stampede: many requests for expired key. Thundering herd: cache rebuild storm. Solutions: locking, early expiration.

## Пример ответа

Cache-aside с Redis: check Redis → if miss → read DB → set Redis с TTL. Write-through: write to DB → invalidate cache. TTL: 5 минут для hot data, 1 час для cold. Cache stampede: lock acquisition при rebuild. Thundering herd: jittered TTL. Monitoring: cache hit ratio (goal: >80%).

## Частые ошибки

- Не инвалидировать cache
- Использовать неправильную стратегию
- Не мониторить hit ratio
- Игнорировать cache stampede

## Дополнительные вопросы

- Как выбрать между Redis и Memcached?
- Что такое cache stampede и как его предотвратить?
- Как связать cache и CDN?
