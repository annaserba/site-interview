---
id: klp-cap-theorem
title: CAP theorem: зачем это важно знать?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "CAP", "Consistency"]
duration: 10 мин
difficulty: 3
secondaryCategory: Algorithms
---

## Короткий ответ

CAP theorem: в распределённой системе при network partitioning невозможно garantировать одновременно Consistency, Availability, Partition tolerance. Приходится выбирать: CP (согласованность) или AP (доступность). На практике: partition tolerance mandatory, выбор между C и A.

## Контекст

Фундаментальный theorem для distributed systems. Проверяют понимание theoretical foundations.

## Как строить ответ

### Формулировка

СProperty: любая операция завершается successfully. Consistency: все узлы видят одно и то же. Partition tolerance: система работает при partitions.

### Доказательство

При partition: если узлы не могут communication, они должны choose: fail operation (C) или continue with stale data (A).

### Практика

CP: ZooKeeper, etcd, HBase. AP: Cassandra, DynamoDB, CouchDB. CA: single-node database.

## Пример ответа

CAP: при network partition (узлы не видят друг друга) система должна choose: CP — fail writes, guarantee consistency (ZooKeeper: если majority недоступна — service unavailable). AP — continue writes, guarantee availability (Cassandra: пишем на любой available node, eventual consistency). CA: PostgreSQL в single node (нет partitions, но не distributed). PACELC: при partition — A or C;否则 latency vs consistency.

## Частые ошибки

- Думать, что можно выбрать CA
- Игнорировать partition tolerance
- Не учитывать PACELC
- Путать consistency levels

## Дополнительные вопросы

- Что такое PACELC theorem?
- Как выбрать между CP и AP?
- Как consistency levels связаны с CAP?
