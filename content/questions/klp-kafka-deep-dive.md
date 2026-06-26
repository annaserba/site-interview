---
id: klp-kafka-deep-dive
title: Как устроен Kafka broker и зачем это важно?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Kafka", "Message Broker"]
duration: 10 мин
difficulty: 4
secondaryCategory: Data Engineering
---

## Короткий ответ

Kafka broker: append-only log, partitioned by topic. Ключевые concept: offset-based addressing, consumer groups, ISR (in-sync replicas), retention policies. Преимущества: high throughput, durability, ordered within partition.

## Контекст

Глубокое понимание Kafka для проектирования event-driven systems. Проверяют operational knowledge.

## Как строить ответ

### Архитектура

Topic → partitions → segments. Offset: порядок events within partition. Replication: leader + followers, ISR.

### Consumer groups

Partitions: parallel consumption. Rebalancing: при добавлении consumer'ов.

### Durability

Replication factor: number of copies. Unclean leader election: availability vs durability trade-off.

## Пример ответа

Kafka broker: topic "orders" с 6 partitions. Partition 0: offset 0, 1, 2, ... Consumer group: 3 consumers, каждый обрабатывает 2 partitions. ISR: replicas in sync. Replication factor 3: выдерживает 2 failures. Retention: 7 days или size-based. Segments: log compaction для changelog topics.

## Частые ошибки

- Не настраивать ISR properly
- Игнорировать partition assignment
- Не планировать retention policy
- Не мониторить consumer lag

## Дополнительные вопросы

- Как работает consumer group rebalancing?
- Что такое ISR и unclean leader election?
- Как выбрать количество partitions?
