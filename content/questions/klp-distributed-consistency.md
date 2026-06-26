---
id: klp-distributed-consistency
title: Что такое согласованность (consistency) в распределённых системах?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Consistency", "CAP"]
duration: 10 мин
difficulty: 4
sourceType: book
sourceUrl: ""
---

## Короткий ответ

Согласованность — garantия, что все узлы видят одни и те же данные в одно и то же время. Существует сильная (linearizability) и слабая (causal, eventual) согласованность. Компромисс: сильная согласованность снижает доступность.

## Контекст

Вопрос из области распределённых систем. Проверяют понимание trade-offs между согласованностью и доступностью (CAP theorem).

## Как строить ответ

### Определения

Покажите понимание разных уровней согласованности: linearizable, sequential, causal, eventual.

### CAP theorem

Объясним, что в Partition Tolerance приходится выбирать между CP (согласованность) и AP (доступность).

### Практика

Приведите примеры систем: CP — ZooKeeper, etcd; AP — Cassandra, DynamoDB.

## Пример ответа

Согласованность гарантирует, что чтение возвращает самую свежую запись. Linearizable — strongest: операции выглядят как в однопоточной системе. Eventual — данные в конечном счёте синхронизируются, но短暂но могут быть устаревшими. В CAP при Partition Tolerance выбираем: CP (ZooKeeper — согласованность, но недоступен при split) или AP (Cassandra — доступна, но может вернуть устаревшие данные).

## Частые ошибки

- Путать consistency и coherence
- Думать, что eventual consistency — это «без согласованности»
- Игнорировать difference между strong и weak models
- Не учитывать model semantics при проектировании

## Дополнительные вопросы

- Что такое linearizability и чем она отличается от sequential consistency?
- Как работает consensus в Raft/Paxos?
- Что такое conflict resolution в CRDT?
