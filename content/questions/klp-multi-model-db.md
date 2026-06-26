---
id: klp-multi-model-db
title: Multi-model databases: когда и зачем использовать?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Multi-Model", "Database"]
duration: 10 мин
difficulty: 3
secondaryCategory: Data Engineering
---

## Короткий ответ

Multi-model databases поддерживают несколько data models (document, graph, key-value) в одном engine. Примеры: ArangoDB (document + graph + key-value), CosmosDB (multi-model), Couchbase (document + key-value). Преимущество: единый database для разных use cases.

## Контекст

Современный trend в database design. Проверяют понимание когда multi-model имеет смысл.

## Как строить ответ

### Multi-model

Один database engine, несколько data models. Единый query language для разных моделей.

### Примеры

ArangoDB: AQL для document, graph traversal. CosmosDB: multiple APIs (SQL, MongoDB, Gremlin). Couchbase: N1QL для document, FTS.

### Trade-offs

Преимущество: operational simplicity. Недостаток: jack of all trades, master of none.

## Пример ответа

ArangoDB: document storage + graph traversal в одном DB. Query: AQL для document queries + graph traversal. Преимущество: один cluster для document и graph use cases. CosmosDB: multi-model через different APIs. Trade-off: multi-model удобно для operational simplicity, но specialized DB (Neo4j для graph) может быть faster для specific use cases.

## Частые ошибки

- Использовать multi-model без need
- Не учитывать performance trade-offs
- Игнорировать complexity multi-model queries
- Не планировать scaling strategy

## Дополнительные вопросы

- Как работает ArangoDB multi-model?
- Когда использовать specialized vs multi-model DB?
- Как связаны multi-model и polyglot persistence?
