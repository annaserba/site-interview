---
id: sre-monitoring
title: Как проектировать monitoring для production систем?
category: Delivery
scope: universal
languages: []
roles: ["DevOps", "Backend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["SRE", "Monitoring", "Observability"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Три pillars: metrics (Prometheus), logs (ELK), traces (Jaeger). Методологии: RED (Rate, Errors, Latency), USE (Utilization, Saturation, Errors). Dashboards: Grafana. Alerting: PagerDuty.

## Контекст

Критически важный operational aspect. Проверяют понимание monitoring practices.

## Как строить ответ

### Metrics

Prometheus: TSDB, time series. RED: для services. USE: для resources.

### Logs

Structured JSON. ELK: Elasticsearch, Logstash, Kibana. Centralized logging.

### Traces

Distributed tracing: Jaeger, OpenTelemetry. Correlation ID: track request across services.

## Пример ответа

Metrics: Prometheus собирает RED метрики. Grafana: dashboards, alerting. Logs: structured JSON в ELK. Traces: Jaeger, correlation ID. Alerting: latency > 500ms → PagerDuty.

## Частые ошибки

- Не использовать structured logging
- Игнорировать distributed tracing
- Не планировать alerting strategy
- Не мониторить saturation

## Дополнительные вопросы

- Как работает distributed tracing?
- Что такое correlation ID?
- Как связать metrics и SLO?
