---
id: sre-slo-sla
title: Что такое SLO, SLA, SLI и как их применять?
category: Delivery
scope: universal
languages: []
roles: ["DevOps", "Backend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["SRE", "SLO", "SLA", "Reliability"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

SLI (Service Level Indicator): метрика (latency, error rate). SLO (Objective): целевое значение SLI (99.9% availability). SLA (Agreement): контракт с consequences (compensation). Error budget: допустимое количество ошибок.

## Контекст

Фундаментальные concepts для reliability. Проверяют понимание SRE practices.

## Как строить ответ

### SLI

Что измеряем: latency (p99 < 200ms), availability (99.9%), error rate (< 0.1%).

### SLO

Цель: 99.9% availability за 30 дней. Error budget: 0.1% = 43 минуты downtime.

### SLA

Контракт: если SLO не выполнено → compensation. Юридические последствия.

## Пример ответа

SLI: latency p99 = 150ms. SLO: p99 < 200ms за месяц. SLA: если availability < 99.9% → credit 10%. Error budget: 43 минуты/месяц. If exceeded → freeze deployments.

## Частые ошибки

- Не иметь SLO
- Использовать SLO как SLA
- Не отслеживать error budget
- Игнорировать SLI в мониторинге

## Дополнительные вопросы

- Как определить SLI для своего сервиса?
- Что такое error budget policy?
- Как связать SLO и incident management?
