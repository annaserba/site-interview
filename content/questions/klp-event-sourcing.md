---
id: klp-event-sourcing
title: Что такое Event Sourcing и когда его использовать?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Event Sourcing", "CQRS"]
duration: 10 мин
difficulty: 4
secondaryCategory: Algorithms
---

## Короткий ответ

Event Sourcing — хранение всех изменений как sequence of events (вместо текущего состояния). Состояние воспроизводится replay'ем events. Используется с CQRS: read/write separated. Преимущества: audit trail, time travel, debug. Недостатки: complexity, event versioning.

## Контекст

Архитектурный pattern для complex domains. Проверяют понимание когда использовать event-driven подход.

## Как строить ответ

### Принцип

Вместо "текущий баланс = $100" храним: "deposit $50", "withdraw $20", "deposit $70". Состояние: replay events.

### CQRS

Command Query Responsibility Segregation: write model (events) и read model (projections) separated.

### Trade-offs

Плюсы: audit, time travel, debug. Минусы: event versioning, eventual consistency, complexity.

## Пример ответа

Banking system: events — Deposit, Withdraw, Transfer. Current balance: replay all events. Time travel: показать баланс на любую дату. CQRS: write model — append events; read model — materialized views для fast queries. Event versioning: при изменении schema events — upcasting. Kafka как event store: topics = event streams, compaction = snapshot.

## Частые ошибки

- Использовать event sourcing без необходимости
- Не планировать event versioning
- Игнорировать snapshot strategy
- Не разделять read/write models

## Дополнительные вопросы

- Как связать Event Sourcing с CQRS?
- Что такое event versioning и upcasting?
- Как сделать snapshot для ускорения replay?
