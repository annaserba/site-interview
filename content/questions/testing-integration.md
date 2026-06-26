---
id: testing-integration
title: Как тестировать интеграции между сервисами?
category: Delivery
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Testing", "Integration", "Microservices"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Contract testing (Pact): consumer-driven contracts. Container testing: Testcontainers для DB/queues. E2E: limited, только critical paths. Mock external services.

## Контекст

Важный topic для микросервисов. Проверяют понимание testing strategies.

## Как строить ответ

### Contract testing

Consumer определяет expectations, provider.verifies. Pact, Spring Cloud Contract.

### Container testing

Testcontainers: запускает real DB/Redis/Kafka в Docker для тестов.

### Mock external

WireMock, MockServer: mock third-party APIs.

## Пример ответа

Contract testing: orderService (consumer) ожидает GET /users/{id} → {name, email}. userService (provider) верифицирует contract. Testcontainers: @Testcontainers PostgreSQL для integration tests. Mock: WireMock для payment API.

## Частые ошибки

- Тестировать всё через e2e
- Не использовать contract testing
- Игнорировать mock external services
- Не тестировать error scenarios

## Дополнительные вопросы

- Как работает Pact contract testing?
- Что такое Testcontainers и зачем они нужны?
- Как тестировать event-driven architecture?
