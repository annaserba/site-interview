---
id: klp-sharding-strategies
title: Какие стратегии shard key существуют?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Sharding", "Database"]
duration: 10 мин
difficulty: 4
secondaryCategory: Data Engineering
---

## Короткий ответ

Shard key определяет, как данные распределяются между shards. Стратегии: hash-based (равномерное распределение), range-based (efficient range queries), directory-based (flexible routing). Выбор зависит от access patterns.

## Контекст

Критический decision для sharded systems. Проверяют понимание trade-offs.

## Как строить ответ

### Hash-based

`hash(key) % num_shards`. Преимущество: равномерное распределение. Недостаток: range queries на нескольких shards.

### Range-based

Данные разделены по диапазонам. Преимущество: efficient range queries. Недостаток: hot spots.

### Directory-based

Lookup table: key → shard. Преимущество: flexible routing. Недостаток: single point of failure.

## Пример ответа

Hash-based: MongoDB shard key { userId: "hashed" }. Преимущество: равномерное распределение, нет hot spots. Range-based: Cassandra token range. Преимущество: efficient range queries по времени. Directory-based: lookup table в ZooKeeper. Преимущество: можно менять распределение безresharding. Выбор: если нужны range queries → range-based, иначе → hash-based.

## Частые ошибки

- Выбирать shard key без учёта queries
- Не учитывать cardinality
- Игнорировать hot spots
- Не планировать resharding

## Дополнительные вопросы

- Как выбрать shard key для MongoDB?
- Что такое resharding и как его сделать?
- Как связаны shard key и indexing?
