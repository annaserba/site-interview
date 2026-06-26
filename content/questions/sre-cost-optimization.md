---
id: sre-cost-optimization
title: Как оптимизировать infrastructure costs?
category: Delivery
scope: universal
languages: []
roles: ["DevOps"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["SRE", "Cost Optimization", "Cloud"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Cost optimization: right-sizing, reserved instances, spot instances, auto-scaling, resource cleanup. Инструменты: AWS Cost Explorer, Kubecost, CloudHealth. Метрики: cost per request, cost per user.

## Контекст

Важный business aspect. Проверяют понимание cost optimization strategies.

## Как строить ответ

### Стратегии

Right-sizing: match instance size to usage. Reserved: скидки за commitment. Spot: cheap, interruptible. Auto-scaling: scale based on load.

### Мониторинг

AWS Cost Explorer: cost breakdown. Kubecost: Kubernetes costs. Alerts: budget thresholds.

### Метрики

Cost per request. Cost per user. Cost per transaction. Infrastructure cost / revenue.

## Пример ответа

Current: m5.xlarge ($0.192/hr) → 30% CPU average → right-size to m5.large ($0.096/hr). Savings: 50%. Reserved: 1 year commitment → 40% discount. Spot: 70% cheaper for batch jobs.

## Частые ошибки

- Не мониторить costs
- Не right-size instances
- Игнорировать unused resources
- Не использовать reserved/spot

## Дополнительные вопросы

- Как провести cost audit?
- Что такое FinOps?
- Как связать cost optimization и SLO?
