---
id: avito-frontend-testing
title: Как организуете тестирование React-приложений?
category: Frontend
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Avito"]
level: Senior
stage: Техническое
tags: ["Testing", "React", "Jest"]
duration: 15 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Unit (Jest), Integration (React Testing Library), E2E (Cypress/Playwright). Важно: testing pyramid, не testing ice cream.

## Контекст

Интервьюер хочет понять ваш подход к тестированию.

## Как строить ответ

### Unit Tests

Jest, React Testing Library, mock dependencies.

### Integration Tests

Testing Library, user interactions.

### E2E Tests

Cypress, Playwright, critical paths.

### Strategy

Testing pyramid, coverage goals.

## Пример ответа

Unit: Jest, RTL для компонентов. Integration: user flows, API mocking. E2E: Cypress для critical paths. Coverage: 80% unit, 60% integration, 20% E2E. Результат: confidence в changes, fewer bugs.

## Частые ошибки

- Not testing enough
- Testing implementation details
- Flaky E2E tests
- No mocking strategy

## Дополнительные вопросы

- Какmock-аете API?
- Кактестируете hooks?
- Кактестируете edge cases?
