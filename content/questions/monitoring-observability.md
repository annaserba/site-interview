---
id: monitoring-observability
title: Как настроить monitoring и observability для приложения?
category: Delivery
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Monitoring", "Observability", "DevOps"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Observability: metrics (Prometheus), logs (ELK), traces (Jaeger). Key metrics: RED (Rate, Errors, Latency), USE (Utilization, Saturation, Errors). Dashboards: Grafana.

## Контекст

Критически важный operational concept. Проверяют понимание three pillars.

## Как строить ответ

### Metrics

Числовые данные: latency, error rate, throughput. Prometheus + Grafana.

### Logs

Structured events: JSON. ELK stack: Elasticsearch, Logstash, Kibana.

### Traces

Distributed request path. Jaeger, OpenTelemetry.

## Пример ответа

Metrics: Prometheus собирает RED метрики. Grafana: dashboard, alerting. Logs: structured JSON в ELK. Traces: Jaeger, correlation ID. Alerting: latency > 500ms → page on-call.

## Частые ошибки

- Не использовать structured logging
- Игнорировать distributed tracing
- Не планировать alerting strategy
- Не мониторить saturation

## Дополнительные вопросы

- Как работает distributed tracing?
- Что такое correlation ID?
- Как связать metrics и traces?
