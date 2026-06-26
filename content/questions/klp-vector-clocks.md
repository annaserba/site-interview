---
id: klp-vector-clocks
title: Что такое vector clocks и зачем они нужны?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Vector Clocks", "Causality"]
duration: 10 мин
difficulty: 4
secondaryCategory: Algorithms
---

## Короткий ответ

Vector clocks — mechanism для определения causality в distributed systems. Каждый узел хранит vector timestamps. При event: increment自己的 counter. Comparison: определяет happened-before relationship.

## Контекст

Продвинутый topic для conflict detection. Проверяют понимание causality tracking.

## Как строить ответ

### Принцип

Каждый узел хранит vector: [A:1, B:2, C:0]. При local event: increment自己的 counter. При message: merge vectors.

### Сравнение

A ≤ B: все элементы A ≤ B. Concurrent: neither A ≤ B nor B ≤ A.

### Применение

Conflict detection: concurrent writes → conflict. Amazon Dynamo: vector clocks для versioning.

## Пример ответа

Vector clocks: узел A: [A:1], B: [B:1]. A → B: B receives [A:1, B:1], increment: [A:1, B:2]. C → A: A receives [C:1], merge: [A:1, C:1]. Comparison: [A:1, B:2] vs [A:1, C:1] → concurrent (conflict). Amazon Dynamo: vector clocks для conflict detection. При conflict: application-level resolution.

## Частые ошибки

- Не использовать vector clocks для conflict detection
- Путать с physical timestamps
- Игнорировать overhead (vector size grows)
- Не планировать garbage collection

## Дополнительные вопросы

- Как работают vector clocks в Amazon Dynamo?
- Что такое hybrid logical clocks?
- Как связаны vector clocks и CRDT?
