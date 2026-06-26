---
id: klp-multi-leader
title: Multi-leader replication: зачем и как работает?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Multi-Leader", "Conflict Resolution"]
duration: 10 мин
difficulty: 4
secondaryCategory: Data Engineering
---

## Короткий ответ

Multi-leader replication — несколько узлов принимают записи одновременно. Используется в multi-datacenter setups, offline-first apps, collaborative editing. Главная проблема: conflict resolution (last-write-wins, CRDT, application-level).

## Контекст

Продвинутый topic репликации. Проверяют понимание trade-offs и conflict resolution strategies.

## Как строить ответ

### Зачем

Multi-datacenter: каждый DC имеет  leader, lower latency. Offline-first: мобильные клиенты работают без сети.

### Проблемы

Write-write conflicts: один и тот же record изменён в разных places. Conflict resolution required.

### Решения

LWW (last-write-wins), CRDT (mathematical convergence), custom application logic.

## Пример ответа

Multi-datacenter PostgreSQL: каждый DC имеет  leader с async replication. При split-brain: conflict detection через timestamps или vector clocks. Resolution: LWW (просто, но может терять данные) или CRDT (guarantee convergence, но сложнее). Offline-first: iOS app хранит changes locally, sync при network. CouchDB/PouchDB: automatic conflict resolution через revisions.

## Частые ошибки

- Игнорировать conflict resolution
- Не планировать split-brain scenarios
- Использовать multi-leader без необходимости
- Не мониторить replication lag между leaders

## Дополнительные вопросы

- Как работает conflict resolution в CouchDB?
- Что такое vector clocks и зачем они нужны?
- Как выбрать между single-leader и multi-leader?
