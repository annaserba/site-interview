---
id: deployment-strategies
title: Какие стратегии деплоя существуют?
category: Delivery
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Deployment", "CI/CD", "Infrastructure"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Blue/Green: два окружения, swap. Canary: постепенный rollout. Rolling: обновление по одному instance. Feature flags: deploy без reveal.

## Контекст

Стратегии для безопасного деплоя. Проверяют понимание trade-offs.

## Как строить ответ

### Blue/Green

Два идентичных окружения. Deploy → test → switch traffic. Мгновенный rollback.

### Canary

一小部分 traffic → monitoring → full rollout. Медленно, но безопасно.

### Rolling

Обновление по одному instance. Zero downtime, но缓慢 rollback.

## Пример ответа

Blue/Green: v1 (blue) и v2 (green). Deploy v2 → smoke tests → switch load balancer. Rollback: switch back. Canary: 1% traffic → v2 → monitoring → 100%. Rolling: 3 instance, обновляем по одному.

## Частые ошибки

- Делать big bang деплой
- Не иметь rollback strategy
- Игнорировать monitoring после деплоя
- Не тестировать в staging

## Дополнительные вопросы

- Как сделать zero-downtime deployment?
- Что такое feature flags и как их использовать?
- Как связаны deployment strategies и SLO?
