---
id: system-design-interview
title: "Как пройти System Design интервью"
description: "Полное руководство по подготовке к архитектурным собеседованиям: от базовых концепций до продвинутых паттернов."
tags: ["System Design", "Архитектура", "Senior"]
readTime: "15 мин"
---

## Что проверяют на System Design интервью

System Design интервью — это не про заучивание паттернов. Интервьюер проверяет вашу способность проектировать реальные системы под бизнес-требования. Ключевые навыки:

- **Requirements clarification** — уточнение Functional и Non-Functional требований
- **High-level design** — выбор архитектуры и компонентов
- **Deep dive** — детализация критичных частей
- **Trade-offs** — обоснование выбора между альтернативами

## Структура ответа (40-45 минут)

### 1. Requirements (5 мин)
Уточните:
- Какие функции должна выполнять система?
- Масштаб: сколько пользователей/запросов?
- Latency: real-time или batch?
- Consistency vs Availability?

### 2. High-Level Design (10 мин)
Нарисуйте основные компоненты:
- API Gateway / Load Balancer
- Application servers
- Database (SQL/NoSQL)
- Cache layer
- Message queues

### 3. Deep Dive (15 мин)
Детализируйте критичные компоненты:
- Database schema и sharding strategy
- Caching strategy (Redis, CDN)
- Message queues (Kafka, RabbitMQ)
- Consistency model

### 4. Trade-offs (5 мин)
Обоснуйте каждый выбор:
- Почему SQL, а не NoSQL?
- Почему cache-aside, а не write-through?
- Как обрабатываетеfailover?

## Частые вопросы

### «Спроектируйте Twitter/Instagram/WhatsApp»
Классический формат. Ключевые аспекты:
- **Feed**: fanout-on-write vs fanout-on-read
- **Media**: object storage + CDN
- **Notifications**: push via APNS/FCM
- **Search**: inverted index (Elasticsearch)

### «Спроектируйте URL shortener»
Простой старт для разминки:
- Hash/encode URL → короткий код
- Storage: key-value (Redis/DynamoDB)
- Analytics: click tracking через Kafka

### «Спроектируйте чат систему»
- WebSocket для real-time
- Message storage: append-only log
- Presence: heartbeat + Redis
- Group chat: fan-out

## Подготовка

1. **Практика**: 2-3 mock интервью в неделю
2. **Шаблоны**: выучите 5-7 базовых паттернов
3. **Масштаб**: всегда обсуждайте numbers (QPS, storage, bandwidth)
4. **Trade-offs**: никогда не говорите «это лучшее решение» — говорите «это подходит при X, потому что Y»
