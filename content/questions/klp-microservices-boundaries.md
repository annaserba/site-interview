---
id: klp-microservices-boundaries
title: Как определить границы между microservices?
category: System Design
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Microservices", "Domain-Driven Design"]
duration: 10 мин
difficulty: 3
secondaryCategory: DevOps
---

## Короткий ответ

Границы microservices определяются business capabilities, data ownership, team structure. Domain-Driven Design: bounded contexts. Правила: single responsibility, loose coupling, high cohesion. Anti-patterns:  monolith.

## Контекст

Ключевой architectural decision. Проверяют понимание DDD и microservices boundaries.

## Как строить ответ

### Domain-Driven Design

Bounded contexts: границы бизнес-доменов. Each service = one bounded context.

### Критерии

Business capability: services aligned with business functions. Data ownership: each service owns  data. Team structure: Conway's law.

### Антипаттерны

Distributed monolith: services tightly coupled. Nano services: too many small services.

## Пример ответа

E-commerce: bounded contexts — Catalog, Orders, Payments, Shipping. Each service: own database, own business logic. Catalog: products, categories. Orders: order management. Payments: payment processing. Communication: async events (order-created → payment-service). Boundaries: не делить database между services, не делать synchronous calls между services.

## Частые ошибки

- Создавать слишком много services
- Делить database между services
- Использовать synchronous calls между services
- Не учитывать team structure

## Дополнительные вопросы

- Как работает Domain-Driven Design?
- Что такое bounded context?
- Как избежать distributed monolith?
