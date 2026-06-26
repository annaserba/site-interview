---
id: yandex-autocomplete
title: Как Яндекс реализует автодополнение запросов?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Яндекс"]
level: Senior
stage: Архитектура
tags: ["Search", "Autocomplete", "Performance"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Autocomplete: prefix search + ranking + caching. Индекс: trie/ prefix tree + frequency data. Serving: edge caching, CDN. ML: personalization, query reformulation.

## Контекст

Ключевая feature для поисковика. Проверяют понимание autocomplete architecture.

## Как строить ответ

### Indexing

Trie structure для prefix lookup. Frequency data: popular queries. Real-time updates.

### Ranking

Personalization: user history. Popularity: global frequency. Freshness: trending queries.

### Serving

Edge caching: CDN. Pre-computation: popular prefixes. Latency: < 50ms.

## Пример ответа

Query "как" → trie lookup → top suggestions: "как сварить кофе" (100K), "как настроить WiFi" (80K). Personalization: user searched "Python" → "как выучить Python" higher.

## Частые ошибки

- Не кешировать popular prefixes
- Игнорировать personalization
- Не обновлятьfrequency data
- Не учитывать latency

## Дополнительные вопросы

- Как построить trie для autocomplete?
- What is personalization в autocomplete?
- How to handle real-time trending queries?
