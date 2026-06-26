---
id: sre-disaster-recovery
title: Как спроектировать disaster recovery plan?
category: Delivery
scope: universal
languages: []
roles: ["DevOps"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["SRE", "Disaster Recovery", "Business Continuity"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

DR plan: backup → restore → failover. RPO (Recovery Point Objective): максимальная потеря данных. RTO (Recovery Time Objective): время восстановления. Стратегии: backup/restore, pilot light, warm standby, multi-site.

## Контекст

Критически важный business process. Проверяют понимание DR strategies.

## Как строить ответ

### RPO/RTO

RPO: сколько данных можно потерять (1 hour). RTO: сколько времени на восстановление (4 hours).

### Стратегии

Backup/restore: cheapest, highest RTO. Pilot light: minimal running. Warm standby: scaled down. Multi-site: active-active.

### Тестирование

Regular DR drills. Game days: simulated disasters.

## Пример ответа

RPO: 1 hour, RTO: 4 hours. Strategy: warm standby в second region. Backup: hourly snapshots. Failover: automated DNS switch. Test: quarterly DR drill. Cost: 30% more than single site.

## Частые ошибки

- Не иметь DR plan
- Не тестировать DR plan
- Игнорировать RPO/RTO
- Не документировать procedures

## Дополнительные вопросы

- Как выбрать между DR strategies?
- Что такое RPO и RTO?
- How to test disaster recovery plan?
