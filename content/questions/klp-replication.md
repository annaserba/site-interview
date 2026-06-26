---
id: klp-replication
title: Как работает репликация данных в распределённых системах?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Replication", "Data"]
duration: 10 мин
difficulty: 4
sourceType: book
sourceUrl: ""
---

## Короткий ответ

Репликация — копирование данных на несколько узлов для fault tolerance и производительности. Два основных подхода: single-leader (записи через один узел) и multi-leader (записи через несколько). Пушкин-модель: leader replication, follower replication,ChangeEvent Data Capture (CDC).

## Контекст

Фундаментальный concept распределённых систем. Проверяют понимание trade-offs между consistency, availability и latency.

## Как строить ответ

### Single-leader

Leader принимает записи, followers реплицируют. Синхронная vs асинхронная репликация.

### Multi-leader

Несколько leader'ов, конфликты при записи. Conflict resolution: last-write-wins, CRDT.

### CDC

Log-based replication: Debezium, Kafka Connect. Преимущества: non-intrusive, real-time.

## Пример ответа

Single-leader: PostgreSQL streaming replication — leader записывает в WAL, follower применяет. Синхронная: follower подтверждает запись (strong consistency, но latency). Асинхронная: follower применяет позже (eventual consistency, но fast). Multi-leader: используется в multi-datacenter setups, но требует conflict resolution. CDC через Kafka: Debezium читает binlog, отправляет в Kafka, consumer'ы применяют на followers.

## Частые ошибки

- Не учитывать lag при асинхронной репликации
- Игнорировать conflict resolution в multi-leader
- Не мониторить replication lag
- Не планировать failover

## Дополнительные вопросы

- Что такое split-brain и как его избежать?
- Как работает semi-synchronous replication?
- Что такое chain replication?
