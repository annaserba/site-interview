---
id: avito-interview-search
title: Как построить поисковую систему для миллиарда объявлений?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Avito"]
level: Senior
stage: Архитектура
tags: ["Search", "Scale", "Elasticsearch"]
duration: 15 мин
difficulty: 5
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Search architecture: inverted index (Elasticsearch), ranking (ML), sharding, replication. Ключевые: relevance, latency, availability, freshness.

## Контекст

Типичный system design вопрос. Проверяют ability проектировать search system.

## Как строить ответ

### Indexing

Inverted index: term → document IDs. Sharding: distribute index. Replication: fault tolerance.

### Ranking

ML models: text relevance, freshness, popularity, user signals. Learning to rank.

### Serving

Query parsing → index lookup → ranking → filtering → response. Caching: popular queries.

## Пример ответа

Query "iPhone" → parse → inverted index → 1M docs → ML ranking → top 100. Sharding: 10 shards, each 100M docs. Replication: 3 replicas per shard. Latency: < 100ms.

## Частые ошибки

- Не шардировать index
- Игнорировать ML ranking
- Не кешировать popular queries
- Не планировать replication

## Дополнительные вопросы

- How to shard Elasticsearch index?
- What is learning to rank?
- How to handle real-time indexing?
