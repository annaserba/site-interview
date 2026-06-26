---
id: avito-fraud-detection
title: Как Avito борётся с мошенничеством на площадке?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Avito"]
level: Senior
stage: Архитектура
tags: ["Security", "Fraud", "Marketplace"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Fraud detection: ML models (anomaly detection), rules engine, user verification, content moderation. Ключевые: real-time scoring, false positive balancing, seller reputation.

## Контекст

Критически важно для доверия к площадке. Проверяют понимание fraud prevention.

## Как строить ответ

### ML models

Anomaly detection: unusual patterns. Classification: fraud vs legitimate. Features: listing patterns, user behavior.

### Rules engine

Business rules: price thresholds, category restrictions. Whitelists, blacklists.

### User verification

Identity verification. Phone/email verification. Seller reputation scoring.

## Пример ответа

Listing: iPhone за 1000₽ (anomaly: too cheap) → fraud score 0.9 → flag. User behavior: new account, bulk listings → risk score. Rules: electronics category → additional verification.

## Частые ошибки

- Слишком строгие правила (block legitimate)
- Игнорировать false positives
- Не обновлять ML models
- Не мониторить fraud patterns

## Дополнительные вопросы

- How to build fraud detection ML model?
- What is anomaly detection?
- Как балансировать fraud prevention и UX?
