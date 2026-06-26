---
id: ms-api-gateway
title: Зачем нужен API Gateway в микросервисной архитектуре?
category: System Design
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["Microservices", "API Gateway", "Architecture"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

API Gateway — един точка входа для клиентов. Функции: routing, authentication, rate limiting, request aggregation, protocol translation. Инструменты: Kong, AWS API Gateway, Nginx.

## Контекст

Важный component микросервисной архитектуры. Проверяют понимание why gateway needed.

## Как строить ответ

### Проблема

Клиент должен знать адреса всех сервисов. Каждый сервис реализует auth, rate limiting.

### Решение

API Gateway: един entry point, централизованные concerns.

### Функции

Routing: /api/users → userService. Auth: JWT validation. Rate limiting: throttle. Aggregation: combine responses.

## Пример ответа

Клиент → API Gateway → userService, orderService. Gateway: routing (/api/users → userService), auth (JWT), rate limiting (100 req/s), aggregation (get user + orders). Преимущество: клиент не знает внутреннюю архитектуру. Недостаток: single point of failure, latency overhead.

## Частые ошибки

- Делать gateway слишком толстым (business logic)
- Не планировать high availability gateway
- Игнорировать rate limiting
- Не использовать circuit breaker на gateway

## Дополнительные вопросы

- Как сделать API Gateway highly available?
- Что такое BFF (Backend for Frontend)?
- Как связаны API Gateway и service mesh?
