---
id: ozon-interview-scale
title: Как спроектировать system для обработки миллионов заказов в день?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Ozon"]
level: Senior
stage: Архитектура
tags: ["Scale", "E-commerce", "Architecture"]
duration: 15 мин
difficulty: 5
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Order processing: event-driven architecture, saga pattern, CQRS, eventual consistency. Ключевые: fault tolerance, idempotency, horizontal scaling.

## Контекст

Типичный system design вопрос. Проверяют ability проектировать highly available order system.

## Как строить ответ

### Архитектура

Microservices: order, inventory, payment, shipping. Event-driven: Kafka. Saga: distributed transactions.

### Scaling

Horizontal: stateless services. Database: sharding. Queue: partitioning.

### Reliability

Idempotency: double processing. Retry: exponential backoff. Circuit breaker: cascade failures.

## Пример ответа

Order flow: create order → reserve inventory → process payment → ship. Saga: compensation если payment failed. Kafka: order events → multiple consumers. Sharding: orders по user ID.

## Частые ошибки

- Делать synchronous calls
- Не планировать fault tolerance
- Игнорировать idempotency
- Не масштабировать database

## Дополнительные вопросы

- Как реализовать saga pattern?
- Что такое CQRS и зачем он нужен?
- How to handle idempotency в order system?
