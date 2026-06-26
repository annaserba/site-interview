---
id: klp-transactions
title: Как работают транзакции в распределённых системах?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Transactions", "ACID"]
duration: 10 мин
difficulty: 4
secondaryCategory: Algorithms
---

## Короткий ответ

Транзакции гарантируют ACID в распределённых системах. Два-phase commit (2PC) — координатор и участники. Sagas — компенсирующие транзакции. Проблемы: deadlock, timeout, coordinator failure.

## Контекст

Фундаментальный topic для проектирования распределённых систем. Проверяют понимание guarantees и trade-offs.

## Как строить ответ

### ACID

Atomicity, Consistency, Isolation, Durability. В распределённых системах isolation — самый сложный.

### 2PC

Координатор запрашивает prepare у участников, затем commit/rollback. Проблема: blocking при failure coordinator.

### Sagas

Компенсирующие транзакции: если шаг N не удался, откатываем шаги N-1...1.

## Пример ответа

2PC: координатор → prepare (участники lock'ают ресурсы) → commit (применяют). Проблема: если координатор упал после prepare — участники блокированы. Sagas: каждый шаг имеет компенсирующую транзакцию. Пример: бронирование отеля → flight → payment. Если payment failed — откатываем отель и flight. Преимущество: non-blocking. Недостаток: eventual consistency.

## Частые ошибки

- Не обрабатывать failure coordinator в 2PC
- Не планировать компенсирующие транзакции
- Игнорировать isolation level
- Не учитывать network partitions

## Дополнительные вопросы

- Что такое exactly-once semantics?
- Как работает distributed transaction в Kafka?
- Что такое TCC (Try-Confirm-Cancel)?
