---
id: klp-partitioning
title: Что такое partitioning (шардирование) данных?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Partitioning", "Sharding"]
duration: 10 мин
difficulty: 4
secondaryCategory: Algorithms
---

## Короткий ответ

Partitioning — разделение данных на части (shards) для распределения нагрузки. Два подхода: key-range (диапазоны ключей) и hash-based (хеш ключа). Проблемы: hot spots, rebalancing, cross-shard queries.

## Контекст

Ключевой concept для масштабирования. Проверяют понимание trade-offs между распределением данных и запросами.

## Как строить ответ

### Key-range partitioning

Данные разделены по диапазонам ключей. Преимущество: range queries. Недостаток: hot spots на границах.

### Hash-based partitioning

Хеш ключа определяет shard. Преимущество: равномерное распределение. Недостаток: range queries требуют scatter-gather.

### Rebalancing

Автоматическое перемещение данных при добавлении/удалении узлов. Проблема: network load, consistency.

## Пример ответа

Key-range: Cassandra token ring, где каждый узел отвечает за диапазон токенов. Преимущество: efficient range queries. Недостаток: если данные неравномерны — hot spots. Hash-based: MongoDB shard key — хеш определяет shard. Преимущество: равномерное распределение. Недостаток: range queries на нескольких shards. Rebalancing: Kafka partition rebalancing при добавлении consumer'ов.

## Частые ошибки

- Выбирать shard key без учёта access patterns
- Не учитывать hot spots
- Игнорировать cross-shard transactions
- Не планировать rebalancing заранее

## Дополнительные вопросы

- Как выбрать shard key?
- Что такое consistent hashing?
- Как работать с cross-shard queries?
