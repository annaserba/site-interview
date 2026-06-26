---
id: avito-recommendations
title: Как Avito строит систему рекомендаций?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Avito"]
level: Senior
stage: Архитектура
tags: ["Recommendations", "ML", "E-commerce"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Avito recommendations: collaborative filtering (user-item interactions), content-based (item features), hybrid. Ключевые: real-time personalization, A/B testing, cold start problem.

## Контекст

Ключевой feature для маркетплейса. Проверяют понимание recommendation systems.

## Как строить ответ

### Collaborative filtering

User-item matrix. Similar users → similar items. Matrix factorization.

### Content-based

Item features: category, price, location, photos. User profile: viewing history.

### Hybrid

Combine both approaches. Weighted or switching.

## Пример ответа

User viewed iPhone 15 → collaborative: other iPhone viewers also bought cases. Content-based: similar price range, electronics category. Hybrid: combine scores → personalized feed.

## Частые ошибки

- Не решать cold start problem
- Игнорировать real-time signals
- Не A/B тестировать модели
- Не учитыватьitem freshness

## Дополнительные вопросы

- Как решить cold start problem?
- What is matrix factorization в рекомендациях?
- Как A/B тестировать recommendation models?
