---
id: klp-circuit-breaker
title: Что такое circuit breaker pattern?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Circuit Breaker", "Resilience"]
duration: 10 мин
difficulty: 2
secondaryCategory: Algorithms
---

## Короткий ответ

Circuit breaker — паттерн для предотвращения cascade failures. Три состояния: closed (пропускает), open (блокирует), half-open (тестирует). Реализация: failure threshold, timeout, fallback.

## Контекст

Фундаментальный pattern для resilient distributed systems. Проверяют понимание fault tolerance.

## Как строить ответ

### Состояния

Closed:正常工作, считает failures. Open: превышен threshold, блокирует requests. Half-open: пропускает probe request для проверки.

### Реализация

Failure threshold: N failures за M seconds → open. Timeout: через T seconds → half-open. Fallback: degraded response.

## Пример ответа

Circuit breaker для payment service: 5 failures за 30 секунд → open. Следующие requests immediately fail с fallback. Через 60 секунд → half-open: один probe request. Если success → closed. Если fail → open. Библиотеки: Resilience4j (Java), Polly (.NET), Hystrix (deprecated). Fallback: cached data, default response, graceful degradation.

## Частые ошибки

- Не использовать circuit breaker
- Неправильно настраивать thresholds
- Игнорировать fallback strategy
- Не мониторить circuit state

## Дополнительные вопросы

- Как настроить failure threshold?
- Что такое fallback strategy?
- Как circuit breaker связан с bulkhead pattern?
