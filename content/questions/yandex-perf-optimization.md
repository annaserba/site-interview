---
id: yandex-perf-optimization
title: Как Яндекс оптимизирует производительность поисковой выдачи?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Яндекс"]
level: Senior
stage: Архитектура
tags: ["Performance", "Search", "Architecture"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Поисковая выдача Яндекса: индексация (Crawler → inverted index), ranking (PageRank + ML), serving (кэширование, CDN, pre-computation). Ключевые: low latency (< 100ms), high throughput (millions QPS).

## Контекст

Ключевая problem domain Яндекса. Проверяют понимание search architecture.

## Как строить ответ

### Indexing

Crawler → parse → tokenize → inverted index. Real-time updates. Distributed index.

### Ranking

ML models: features = text relevance, freshness, popularity, user signals. Learning to rank.

### Serving

CDN: edge caching. Pre-computation: popular queries cached. Sharding: по document IDs.

## Пример ответа

Query "новости" → inverted index lookup (10ms) → ranking (50ms) → top 10 results → cache (1ms). ML ranking: 200+ features, gradient boosted trees. Latency budget: 100ms total.

## Частые ошибки

- Не кешировать popular queries
- Игнорировать ML ranking
- Не масштабировать index
- Не мониторить latency

## Дополнительные вопросы

- Как работает PageRank в Яндексе?
- Что такое learning to rank?
- Как масштабировать поисковый индекс?
