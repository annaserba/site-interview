---
id: http-rest
title: Что такое REST API и как его проектировать?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Несколько компаний"]
level: Middle
stage: Архитектура
tags: ["HTTP", "REST", "API Design"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

REST (Representational State Transfer): архитектурный стиль для APIs. Принципы: stateless, uniform interface, resource-based URLs, HTTP methods semantics. Versioning: URL path, header, query param.

## Контекст

Ключевой API design style. Проверяют понимание REST principles.

## Как строить ответ

### Принципы

Stateless: no server state. Resource-based: /users, /users/1. Uniform interface: standard methods. HATEOAS: links в ответах.

### URL design

 nouns, не verbs: /users (не /getUsers). Плагиальное число: /users. Иерархия: /users/1/orders.

### Versioning

URL: /api/v1/users. Header: Accept: application/vnd.api.v1+json. Query: ?version=1.

## Пример ответа

GET /api/v1/users — list users. GET /api/v1/users/1 — get user. POST /api/v1/users — create user. PUT /api/v1/users/1 — update user. DELETE /api/v1/users/1 — delete user.

## Частые ошибки

- Использовать verbs в URLs
- Не делать versioning
- Нарушать statelessness
- Не документировать API

## Дополнительные вопросы

- Как выбрать between REST и GraphQL?
- Что такое HATEOAS?
- Как документировать REST API (OpenAPI)?
