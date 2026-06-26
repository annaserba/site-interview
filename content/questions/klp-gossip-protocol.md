---
id: klp-gossip-protocol
title: Как работает gossip protocol в распределённых системах?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Gossip Protocol", "Cluster Management"]
duration: 10 мин
difficulty: 3
secondaryCategory: Algorithms
---

## Короткий ответ

Gossip protocol: узлы обмениваются информацией с random peers. Каждый cycle: choose random peer, exchange state, update. Eventual consistency: информация распространяется на всех узлов. Используется в: Cassandra, Consul, Redis Cluster.

## Контекст

Fundamental protocol для cluster management. Проверяют понимание decentralized information dissemination.

## Как строить ответ

### Принцип

Каждый узел random peer, обменивается state. Сloopy convergence: информация reaches all nodes.

### Типы

Push: send  state. Pull: request peer's state. Push-pull: оба варианта.

### Применение

Cluster membership: who's alive. Failure detection: heartbeat-based. State dissemination: configuration changes.

## Пример ответа

Gossip: каждые 1 секунду choose random peer, exchange heartbeats. Failure detection: если peer не отвечает N cycles → suspect. Cassandra: gossip для cluster membership. Consul: Serf protocol для failure detection. Преимущество: no single point of failure, scalable. Недостаток: eventual consistency, message overhead.

## Частые ошибки

- Не настраивать gossip interval
- Игнорировать message overhead
- Не планировать failure detection
- Не мониторить convergence time

## Дополнительные вопросы

- Как работает failure detection через gossip?
- Что такое Serf protocol?
- Как связан gossip и eventual consistency?
