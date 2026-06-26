---
id: yandex-maps
title: Как Яндекс строит навигатор и карты?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Яндекс"]
level: Senior
stage: Архитектура
tags: ["Maps", "Navigation", "Real-time"]
duration: 10 мин
difficulty: 5
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Яндекс Карты: GPS tracking, route calculation (Dijkstra/A*), traffic prediction (ML), POI search. Ключевые: real-time traffic, route optimization, offline maps.

## Контекст

Ключевой product для навигации. Проверяют понимание maps architecture.

## Как строить ответ

### Route calculation

Graph algorithms: Dijkstra, A*. Multi-modal: car, transit, walking. Contraction hierarchies.

### Traffic prediction

ML models: historical data, real-time signals. Prediction: next 30-60 minutes.

### GPS tracking

User location streaming. Privacy: anonymization. Aggregation: traffic patterns.

## Пример ответа

Route: from A to B → graph search →考虑 traffic → optimal route. Traffic: GPS data от millions users → ML prediction → "пробки через 20 минут". Offline: vector tiles → compressed maps.

## Частые ошибки

- Не учитывать real-time traffic
- Игнорировать隐私 user location
- Не оптимизировать route calculation
- Не делать offline support

## Дополнительные вопросы

- How does traffic prediction work?
- What is contraction hierarchy algorithm?
- How to handle offline maps?
