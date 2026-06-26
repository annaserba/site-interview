---
id: klp-consistency-models
title: Какие модели согласованности существуют?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Consistency Models", "CAP"]
duration: 10 мин
difficulty: 4
secondaryCategory: Algorithms
---

## Короткий ответ

Модели согласованности: linearizable (strongest), sequential, causal, eventual (weakest). Stronger models: better guarantees, но lower availability/higher latency. Выбор зависит от requirements.

## Контекст

Продвинутый topic для понимания trade-offs. Проверяют глубокое knowledge.

## Как строить ответ

### Linearizable

Strongest: operation appears atomic. Reads return most recent write.

### Sequential

All operations appear in some sequential order. Weaker than linearizable, но stronger than causal.

### Causal

Preserves causality: if A caused B, then A appears before B. Weaker than sequential.

### Eventual

наиболее   consistent: all replicas converge. Weakest guarantee.

## Пример ответа

Linearizable: ZooKeeper, etcd. Reads seeнаиболее  . Sequential: many databases с snapshot isolation. Causal: causally consistent distributed systems. Eventual: Cassandra, DynamoDB. Выбор: financial transactions → linearizable. Social feed → eventual. Collaborative editing → causal.

## Частые ошибки

- Путать модели согласованности
- Думать, что eventual consistency — это «bad»
- Не учитывать latency trade-offs
- Не планировать consistency levels

## Дополнительные вопросы

- Как связаны consistency models с CAP?
- Что такое session consistency?
- Как выбрать правильную модель?
