---
id: ozon-frontend-microfrontend
title: Как организовать микрофронтендную архитектуру?
category: Frontend
scope: universal
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Ozon"]
level: Senior
stage: Архитектура
tags: ["Microfrontends", "Architecture", "Module Federation"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Module Federation,iframe, Web Components. Важно: independent deployment, shared dependencies, routing.

## Контекст

Проверяют понимание микрофронтендов и их implementation.

## Как строить ответ

### Module Federation

Webpack 5, shared dependencies.

### Routing

Какorganize-аете routing: shared router, micro-frontends.

### Communication

Какcommunicate: events, shared state.

## Пример ответа

Module Federation: host + remotes, shared React, Redux. Routing: shared router, lazy load remotes. Communication: custom events, shared context. Результат: independent deployment, team autonomy.

## Частые ошибки

- Tight coupling
- Shared state everywhere
- Not sharing dependencies
- Complex routing

## Дополнительные вопросы

- Какdeplo-ите микрофронтенды?
- Кактестируете микрофронтенды?
- Какобновляете shared dependencies?
