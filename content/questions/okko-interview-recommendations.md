---
id: okko-interview-recommendations
title: как построить system рекомендаций для контента?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Okko"]
level: Senior
stage: Архитектура
tags: ["Recommendations", "Streaming", "ML"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Content recommendations: collaborative filtering, content-based, hybrid. Ключевые: personalization, cold start, diversity, freshness.

## Контекст

Типичный system design вопрос для streaming. Проверяют ability проектировать recommendations.

## Как строить ответ

### Collaborative filtering

User-item interactions. Similar users → similar items. Matrix factorization.

### Content-based

Item features: genre, actors, director. User profile: viewing history.

### Hybrid

Combine both. Weighted average. Switching based on context.

## Пример ответа

User watched "Interstellar" → collaborative: sci-fi fans also watched "The Martian". Content-based: space, physics, same director. Hybrid: combine scores → personalized feed.

## Частые ошибки

- Не решать cold start
- Игнорировать diversity
- Не обновлять recommendations
- Не A/B тестировать

## Дополнительные вопросы

- How to handle cold start для new users?
- What is diversity в рекомендациях?
- How to A/B test recommendation algorithms?
