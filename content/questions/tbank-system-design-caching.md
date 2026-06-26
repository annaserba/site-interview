---
id: tbank-system-design-caching
title: Спроектируйте кеш для продукта с высоким трафиком
category: System Design
scope: system-design
languages: ["Java", "Go"]
roles: ["Backend","Leadership"]
companies: ["Т-Банк"]
level: Senior
stage: Архитектура
tags: ["System Design", "Caching", "Redis", "CDN"]
duration: 20 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Многоуровневый кеш: CDN (статика) → Application Cache (in-memory LRU) → Redis (distributed) → Database. Стратегии: Cache-Aside (lazy loading), Write-Through (синхронная запись), Write-Behind (асинхронная). Инвалидация через events (TTL + pub/sub). Проблема: cache stampede — решаем через lock/cross-request deduplication.

## Контекст

Системный дизайн для финтех с высоким трафиком: производительность vs consistency.

## Как строить ответ

### Уровни кеша

CDN → In-Memory → Redis → DB. Чем выше — тем быстрее и менее свежие данные.

### Стратегии

Cache-Aside (простой), Write-Through (consistency), Write-Behind (performance).

### Инвалидация

TTL + pub/sub + версионирование.

## Код изинтервью

```java
// Cache-Aside с protection от stampede
public Data getCachedData(String key) {
    Data cached = redis.get(key);
    if (cached != null) return cached;
    
    // Lock для предотвращения stampede
    if (redis.setnx("lock:" + key, "1", 5, TimeUnit.SECONDS)) {
        Data dbData = db.query(key);
        redis.setex(key, 300, dbData);
        redis.del("lock:" + key);
        return dbData;
    }
    // Ждём и пробуем снова
    Thread.sleep(100);
    return getCachedData(key);
}
```

## Пример ответа

Многоуровневый кеш: CDN для статики, in-memory LRU для горячих данных (TTL 5мин), Redis для распределённого кеша (TTL 30мин), DB как fallback. Cache-Aside: сначала кеш, потом DB. Инвалидация: TTL + Redis pub/sub при записи. Cache stampede: lock через SETNX + exponential backoff.

## Частые ошибки

- Один уровень кеша
- Без инвалидации (stale data)
- Cache stampede без защиты
- Не учитывать vs availability

## Дополнительные вопросы

- Как тестируете кеш?
- Что если Redis недоступен?
- Как измеряете cache hit ratio?
