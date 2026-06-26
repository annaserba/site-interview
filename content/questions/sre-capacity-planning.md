---
id: sre-capacity-planning
title: Как проводить capacity planning для сервисов?
category: Delivery
scope: universal
languages: []
roles: ["DevOps", "Backend"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["SRE", "Capacity Planning", "Scaling"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Capacity planning: определение будущих resource requirements. Методы: usage forecasting, load testing, cost modeling. Метрики: requests/sec, storage growth, connections.

## Контекст

Важный strategic process. Проверяют понимание capacity planning.

## Как строить ответ

### Процесс

1. Measure current usage. 2. Forecast growth. 3. Identify bottlenecks. 4. Plan resources. 5. Cost analysis.

### Методы

Load testing: k6, Locust. Forecasting: linear regression, seasonality. Cost modeling: cloud pricing.

### Метрики

CPU, memory, storage, network, database connections, queue depth.

## Пример ответа

Current: 1000 req/s, 50% CPU. Growth: +20%/month. Forecast: 6 months → 3000 req/s → need 3x servers. Cost: $500/month → $1500/month. Action: scale horizontally.

## Частые ошибки

- Не прогнозировать growth
- Игнорировать peak loads
- Не учитывать cost
- Делать capacity planning только один раз

## Дополнительные вопросы

- Как провести load testing?
- Что такое auto-scaling?
- Как связать capacity planning и cost optimization?
