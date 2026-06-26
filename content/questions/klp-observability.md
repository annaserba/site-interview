---
id: klp-observability
title: Как проектировать observability в распределённых системах?
category: System Design
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Observability", "Logging"]
duration: 10 мин
difficulty: 3
secondaryCategory: DevOps
---

## Короткий ответ

Observability: ability to understand system state from outputs. Три pillars: metrics (numbers), logs (events), traces (requests). Инструменты: Prometheus, Grafana, ELK, Jaeger. Ключевые практики: structured logging, correlation IDs, dashboards.

## Контекст

Критически важный operational concept. Проверяют понимание best practices.

## Как строить ответ

### Metrics

Numerical measurements: latency, error rate, throughput. RED: Rate, Errors, Latency. USE: Utilization, Saturation, Errors.

### Logs

Structured events: JSON format, correlation IDs. Centralized: ELK stack.

### Traces

Distributed request path: correlation ID across services. Latency breakdown.

## Пример ответа

Metrics: Prometheus — latency histogram, error counter. Grafana: dashboard, alerting. Logs: JSON format с timestamp, level, service, correlation_id. ELK: centralized logging, Kibana search. Traces: Jaeger, OpenTelemetry. Пример: request → API → Service A → Service B. Trace: show latency breakdown, identify bottleneck.

## Частые ошибки

- Не использовать structured logging
- Игнорировать correlation IDs
- Не планировать alerting strategy
- Не мониторить saturation

## Дополнительные вопросы

- Как работает distributed tracing?
- Что такое OpenTelemetry?
- Как связать metrics и traces?
