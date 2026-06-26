---
id: klp-saga-pattern
title: Saga pattern: как управлять distributed transactions?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Saga", "Transaction"]
duration: 10 мин
difficulty: 4
secondaryCategory: Algorithms
---

## Короткий ответ

Saga — паттерн для distributed transactions через sequence of local transactions с компенсирующими actions. Два типа: choreography (event-based) и orchestration (central coordinator). Каждый шаг имеет compensation action для отката.

## Контекст

Важный pattern для microservices transactions. Проверяют понимание alternatives to 2PC.

## Как строить ответ

### Проблема

Distributed transactions: 2PC blocking, poor availability. Saga: eventual consistency с compensation.

### Choreography

Event-driven: каждый service публикует events, следующий service реагирует. Decentralized, но сложно debug.

### Orchestration

Central coordinator: orchestrator управляет steps. Single point of control, но single point of failure.

## Пример ответа

Order saga: 1) Create order → 2) Reserve inventory → 3) Process payment → 4) Ship order. Compensation: если payment failed → release inventory, cancel order. Choreography: order-created → inventory-service reserve → payment-service charge → shipping-service ship. Orchestration: saga orchestrator вызывает каждый step. Если step fails → execute compensation actions.

## Частые ошибки

- Не планировать compensation actions
- Использовать choreography без need
- Игнорировать timeout и retry
- Не тестировать compensation scenarios

## Дополнительные вопросы

- Как выбрать между choreography и orchestration?
- Что такое compensation action?
- Как тестировать saga scenarios?
