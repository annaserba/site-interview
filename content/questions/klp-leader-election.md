---
id: klp-leader-election
title: Как работает leader election в распределённых системах?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Leader Election", "Raft"]
duration: 10 мин
difficulty: 4
secondaryCategory: Algorithms
---

## Короткий ответ

Leader election: процесс выбора одного узла для coordination. Алгоритмы: Bully, Ring, Raft. Инструменты: ZooKeeper, etcd, Consul. Проблемы: split-brain, fencing, liveness.

## Контекст

Ключевой component для distributed coordination. Проверяют понимание algorithms и failure modes.

## Как строить ответ

### Алгоритмы

Bully: highest ID wins. Ring: token passing. Raft: term-based election.

### Инструменты

ZooKeeper: ephemeral nodes, watches. etcd: Raft consensus. Consul: Serf protocol.

### Проблемы

Split-brain: два leaders. Fencing: guarantee only one leader. Liveness: endless elections.

## Пример ответа

Raft election: candidate requests votes. Majority votes → leader. Term: logical clock, ensures progress. ZooKeeper: ephemeral znode,session expired — node removed. Leader: ephemeral znode holder. Split-brain prevention: fencing tokens, lease-based. Failure: new election.

## Частые ошибки

- Не планировать split-brain prevention
- Игнорировать fencing tokens
- Не учитывать liveness guarantees
- Не тестировать election scenarios

## Дополнительные вопросы

- Как работает Raft leader election?
- Что такое fencing token?
- Как связаны leader election и distributed lock?
