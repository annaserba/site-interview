---
id: ms-service-communication
title: Как микросервисы общаются друг с другом?
category: System Design
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["Microservices", "Communication", "API"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Синхронное: REST (HTTP), gRPC. Асинхронное: message queues (Kafka, RabbitMQ), event streaming. REST — простой, gRPC — быстрый, Kafka — для event-driven архитектуры.

## Контекст

Ключевой выбор в микросервисах. Проверяют понимание trade-offs.

## Как строить ответ

### REST

HTTP + JSON. Преимущество: простота, стандарт. Недостаток: latency, blocking calls.

### gRPC

HTTP/2 + Protocol Buffers. Преимущество: скорость, streaming. Недостаток: сложнее debugging.

### Message queues

Kafka, RabbitMQ. Преимущество: decoupling, backpressure. Недостаток: eventual consistency.

## Пример ответа

REST: orderService → GET /users/{id} → userService. Простой, но blocking. gRPC: orderService → proto definition → userService. Быстрее, type-safe. Kafka: orderService → publish OrderCreated → paymentService, inventoryService. Decoupling, но eventual consistency.

## Частые ошибки

- Использовать REST для всего
- Не планировать timeout и retry
- Игнорировать backpressure в message queues
- Делать synchronous calls между всеми сервисами

## Дополнительные вопросы

- Когда использовать gRPC вместо REST?
- Как выбрать между Kafka и RabbitMQ?
- Что такое event-driven architecture?
