---
id: klp-resilience
title: Как проектировать resilient distributed systems?
category: System Design
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Resilience", "Fault Tolerance"]
duration: 10 мин
difficulty: 3
secondaryCategory: DevOps
---

## Короткий ответ

Resilience: система продолжает работать при failures. Паттерны: retry, circuit breaker, bulkhead, timeout, fallback. Ключевые практики: chaos engineering, failure injection, graceful degradation.

## Контекст

Фундаментальный design principle для distributed systems. Проверяют понимание resilience patterns.

## Как строить ответ

### Retry

Automatic retry с exponential backoff. Jitter для предотвращения thundering herd.

### Circuit Breaker

Предотвращает cascade failures. Three states: closed, open, half-open.

### Bulkhead

Isolation: если один component failed, другие продолжают work. Thread pool isolation, connection pool isolation.

## Пример ответа

Retry: exponential backoff — 100ms, 200ms, 400ms. Jitter: add random delay. Circuit breaker: 5 failures → open → after 60s → half-open. Bulkhead: separate thread pools для different services. Timeout: connection timeout 5s, read timeout 10s. Fallback: cached data, default response.

## Частые ошибки

- Не использовать retry с backoff
- Игнорировать circuit breaker
- Не планировать bulkhead isolation
- Не тестировать failure scenarios

## Дополнительные вопросы

- Как работает chaos engineering?
- Что такое failure injection testing?
- Как связаны resilience и SLO?
