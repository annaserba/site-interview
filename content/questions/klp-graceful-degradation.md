---
id: klp-graceful-degradation
title: Как обеспечить graceful degradation в системе?
category: System Design
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Degradation", "Resilience"]
duration: 10 мин
difficulty: 3
secondaryCategory: DevOps
---

## Короткий ответ

Graceful degradation — система продолжает работать в reduced functionality при failures. Стратегии: cached responses, default values, feature flags, partial functionality. Важно: определить critical vs non-critical paths.

## Контекст

Важный concept для availability. Проверяют понимание как поддерживать service при failures.

## Как строить ответ

### Принцип

Не падать полностью, а работать с reduced functionality. Определить critical paths (должны работать) vs nice-to-have (могут быть degraded).

### Стратегии

Cache: если service недоступен — serve cached data. Default: если данные недоступны — default values. Feature flags: отключать features при failures.

## Пример ответа

E-commerce: payment service down → alternative payment method. Recommendations service down → show popular items instead of personalized. Cache: Redis с TTL. Если backend down → serve from cache. Feature flags:search service slow → disable advanced filters. Monitoring: track degradation events, alert на critical failures.

## Частые ошибки

- Не определять critical paths
- Игнорировать cache strategy
- Не планировать feature flags
- Не мониторить degradation events

## Дополнительные вопросы

- Как определить critical paths?
- Что такое feature flags и как их использовать?
- Как связаны graceful degradation и SLO?
