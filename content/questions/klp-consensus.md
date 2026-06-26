---
id: klp-consensus
title: Что такое consensus в распределённых системах?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Consensus", "Paxos", "Raft"]
duration: 10 мин
difficulty: 5
secondaryCategory: Algorithms
---

## Короткий ответ

Consensus — процесс достижения agreement между узлами. Алгоритмы: Paxos, Raft, ZAB. Проблема: impossibilityCAP — при partition tolerance невозможно garantировать agreement.

## Контекст

Продвинутый topic распределённых систем. Проверяют глубокое понимание agreement protocols.

## Как строить ответ

### Проблема

Как достичь agreement при failures? FLP impossibility: при async network невозможно garantировать termination.

### Paxos

Leader election, prepare/promise, accept/accepted. Сложный, но fundamental.

### Raft

Упрощённый Paxos: leader election, log replication, safety. Используется в etcd, TiKV.

## Пример ответа

Raft: узлы elect leader (term-based). Leader replicate log entries на followers. Majority must agree для commit. При failure:新的leader elected, incomplete entries откатываются. Paxos: prepare → promise → accept → accepted. Сложнее в implementation, но более flexible. Consensus используется в: ZooKeeper (ZAB), etcd (Raft), CockroachDB (Raft).

## Частые ошибки

- Думать, что consensus решает все проблемы
- Не учитывать network partitions
- Игнорировать performance overhead
- Не планировать leader election

## Дополнительные вопросы

- Как работает Raft leader election?
- Что такое FLP impossibility?
- Как consensus связан с distributed transactions?
