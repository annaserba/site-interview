---
id: sre-release-engineering
title: Как организовать safe releases в production?
category: Delivery
scope: universal
languages: []
roles: ["DevOps", "Backend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["SRE", "Release", "Deployment"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Canary: deploy для small percentage → monitor → full rollout. Blue/Green: два environment, swap. Feature flags: deploy без reveal. Rollback: автоматический при errors.

## Контекст

Ключевой practice для safe deployments. Проверяют понимание release strategies.

## Как строить ответ

### Canary

1% traffic → 10% → 50% → 100%. Monitor metrics на каждом шаге.

### Blue/Green

Two identical environments. Deploy to green → test → switch traffic. Instant rollback.

### Feature flags

Deploy code без enabling feature. Gradual rollout. Kill switch.

## Пример ответа

Canary: deploy v2 to 1% traffic → monitor latency, errors → no issues → 10% → 50% → 100%. Feature flag: `enableNewCheckout: true` → gradually enable for users. Rollback: if error rate > 1% → automatic rollback.

## Частые ошибки

- Big bang деплой
- Не мониторить после deploy
- Не иметь rollback strategy
- Не использовать feature flags

## Дополнительные вопросы

- Как настроить canary deployment?
- Что такое automated rollback?
- Как связать releases и error budget?
