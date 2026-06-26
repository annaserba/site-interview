---
id: sre-chaos-engineering
title: Что такое chaos engineering и зачем он нужен?
category: Delivery
scope: universal
languages: []
roles: ["DevOps"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["SRE", "Chaos Engineering", "Resilience"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Chaos engineering: целенаправленное внесение failures для проверки resilience. Инструменты: Chaos Monkey, Litmus, Gremlin. Принципы: hypothesis → experiment → observe → improve.

## Контекст

Продвинутый topic для reliability. Проверяют понимание chaos engineering principles.

## Как строить ответ

### Принципы

1. Define steady state. 2. Hypothesize: system continues working. 3. Inject failure. 4. Observe. 5. Improve.

### Типы experiments

Network: latency, partition. CPU/Memory: stress. Service: kill instances. Database: failover.

### Инструменты

Chaos Monkey: Netflix. Litmus: Kubernetes. Gremlin: commercial.

## Пример ответа

Experiment: inject 200ms latency between services. Hypothesis: system responds within SLA. Result: p99 latency exceeded 500ms → action: add timeout and retry. Steady state: normal operation metrics.

## Частые ошибки

- Делать experiments в production без preparation
- Не иметь rollback plan
- Не измерять results
- Не улучшать после experiments

## Дополнительные вопросы

- Как провести первый chaos experiment?
- Что такое steady state в chaos engineering?
- Как связать chaos engineering и SLO?
