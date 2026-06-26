---
id: klp-message-queues
title: Message queues: зачем нужны и как выбрать?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Message Queues", "Kafka"]
duration: 10 мин
difficulty: 3
secondaryCategory: Data Engineering
---

## Короткий ответ

Message queues — асинхронная доставка сообщений между producer и consumer. Преимущества: decoupling, backpressure, fault tolerance. Типы: message broker (RabbitMQ), distributed log (Kafka), task queue (Celery).

## Контекст

Фундаментальный component распределённых систем. Проверяют понимание когда и как использовать queues.

## Как строить ответ

### Типы

Message broker (RabbitMQ): push-based, complex routing. Distributed log (Kafka): pull-based, durable, ordered. Task queue (Celery): background tasks.

### Свойства

At-least-once, at-most-once, exactly-once delivery. Ordering guarantees.

### Выбор

Kafka: high throughput, event sourcing, stream processing. RabbitMQ: complex routing, task queues. Redis: simple, fast, pub/sub.

## Пример ответа

Kafka: append-only log, topics = streams of events. Consumer groups: partitioned consumption. Exactly-once: transactions + idempotent producers. RabbitMQ: exchanges, bindings, queues. Push-based: broker pushes to consumers. Выбор: Kafka для event streaming, RabbitMQ для task distribution.

## Частые ошибки

- Использовать queue без考虑 delivery semantics
- Не планировать consumer failures
- Игнорировать ordering requirements
- Не мониторить queue depth

## Дополнительные вопросы

- Как обеспечить exactly-once delivery?
- Что такое consumer groups в Kafka?
- Как обрабатывать poison messages?
