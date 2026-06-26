---
id: klp-crdt
title: Что такое CRDT и как они работают?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "CRDT", "Conflict Resolution"]
duration: 10 мин
difficulty: 5
secondaryCategory: Algorithms
---

## Короткий ответ

CRDT (Conflict-free Replicated Data Types) — структуры данных, которые могут реплицироваться на несколько узлов и конвергироваться без конфликтов. Основаны на коммутативных, ассоциативных, идемпотентных операциях. Примеры: G-Counter, PN-Counter, OR-Set.

## Контекст

Продвинутый topic распределённых систем. Проверяют глубокое понимание conflict resolution.

## Как строить ответ

### Свойства

Commutativity: порядок операций не важен. Associativity: группировка не важна. Idempotence: повторные операции не меняют результат.

### Типы

G-Counter (increment only), PN-Counter (increment/decrement), OR-Set (add/remove), LWW-Register (last-write-wins).

### Применение

Redis CRDT, Riak, Apple CloudKit, collaborative editing (Yjs, Automerge).

## Пример ответа

G-Counter: каждый узел хранит  counter. Merge: max по каждому узлу. Пример: узел A = [1, 0], узел B = [0, 1]. Merge: [1, 1] = 2. PN-Counter: два G-Counter (increment + decrement). OR-Set: каждый add создаёт уникальный tag, remove удаляет конкретные tags. Преимущество: eventual consistency без central coordination. Недостаток: метаданные растут.

## Частые ошибки

- Думать, что CRDT решают все проблемы
- Не учитывать метаданные (tombstones)
- Использовать неправильный тип для сценария
- Не оптимизировать memory usage

## Дополнительные вопросы

- Как работает CRDT в Redis?
- Что такое delta CRDTs?
- Как CRDT связаны с event sourcing?
