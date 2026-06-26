---
id: ozon-personalization
title: как Ozon персонализирует пользовательский опыт?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Ozon"]
level: Senior
stage: Архитектура
tags: ["Personalization", "ML", "E-commerce"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Персонализация: user behavior tracking, ML recommendations, dynamic pricing, personalized search. Ключевые: real-time processing, A/B testing, privacy compliance.

## Контекст

Ключевой growth driver для e-commerce. Проверяют понимание personalization system.

## Как строить ответ

### Tracking

User events: views, clicks, purchases. Session tracking. Identity resolution.

### ML models

Recommendations: collaborative filtering. Search ranking: personal signals. Pricing: demand-based.

### Implementation

Real-time pipeline: Kafka → ML → serving. A/B testing: measure impact.

## Пример ответа

User viewed shoes → ML: recommend similar shoes + accessories. Dynamic pricing: high demand → price adjustment. Personalized search: "phone" → show phones user's brand preference.

## Частые ошибки

- Не tracking user behavior
- Игнорировать privacy (GDPR)
- Не A/B тестировать
- Не обновлять ML models

## Дополнительные вопросы

- How to implement real-time personalization?
- What is dynamic pricing?
- Как балансировать персонализацию и privacy?
