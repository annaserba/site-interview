---
id: klp-data-modeling
title: Как выбирать модель данных в распределённых системах?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Data Modeling", "Database"]
duration: 10 мин
difficulty: 3
secondaryCategory: Data Engineering
---

## Короткий ответ

Выбор модели данных зависит от access patterns. Document model (MongoDB): nested data, independent documents. Relational (PostgreSQL): joins, transactions. Column-family (Cassandra): wide rows, time series. Graph (Neo4j): relationships.

## Контекст

Фундаментальный decision для любого проекта. Проверяют понимание trade-offs между моделями.

## Как строить ответ

### Документный

Denormalized data, fast reads, horizontal scaling. Недостаток: data duplication, complex updates.

### Relational

ACID transactions, joins, schema. Недостаток: vertical scaling, complex sharding.

### Column-family

Wide rows, time series, high write throughput. Недостаток: limited queries, eventual consistency.

## Пример ответа

Документный: MongoDB — product catalog с nested reviews. Преимущество: fast reads, horizontal scaling. Relational: PostgreSQL — banking transactions. Преимущество: ACID, joins. Column-family: Cassandra — IoT sensor data. Преимущество: high write throughput, time-based partitioning. Гибрид: polyglot persistence — разные модели для разных частей.

## Частые ошибки

- Использовать одну модель для всего
- Не учитывать access patterns
- Игнорировать scaling requirements
- Не планировать data migration

## Дополнительные вопросы

- Как выбрать между SQL и NoSQL?
- Что такое polyglot persistence?
- Как спроектировать schema для Cassandra?
