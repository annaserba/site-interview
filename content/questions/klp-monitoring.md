---
id: klp-monitoring
title: Как проектировать monitoring для распределённых систем?
category: System Design
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Monitoring", "Observability"]
duration: 10 мин
difficulty: 3
secondaryCategory: DevOps
---

## Короткий ответ

Monitoring включает: metrics (числа), logs (события), traces (запросы). Инструменты: Prometheus (metrics), Grafana (dashboards), ELK (logs), Jaeger (traces). Ключевые метрики: latency, traffic, errors, saturation (RED/USE).

## Контекст

Критически важный operational aspect. Проверяют понимание observability practices.

## Как строить ответ

### Три столпа

Metrics: числовые данные (CPU, latency, errors). Logs: structured events. Traces: distributed request path.

### Методологии

RED: Rate, Errors, Latency (для services). USE: Utilization, Saturation, Errors (для resources).

### Инструменты

Prometheus: TSDB для metrics. Grafana: dashboards. ELK: centralized logging. Jaeger: distributed tracing.

## Пример ответа

Metrics: Prometheus собирает RED метрики для каждого service. Grafana: dashboards с alerting. Alerts: latency > 500ms → page on-call. Logs: structured JSON в Elasticsearch. Kibana: search и analysis. Traces: Jaeger, correlation IDs. Пример: запрос проходит API → Service A → Service B. Trace: latency breakdown, identify bottleneck.

## Частые ошибки

- Игнорировать distributed tracing
- Не использовать structured logging
- Не планировать alerting strategy
- Не мониторить saturation

## Дополнительные вопросы

- Как работает distributed tracing?
- Что такое correlation ID?
- Как связать metrics и traces?
