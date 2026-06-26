---
id: testing-e2e
title: Как эффективно тестировать E2E сценарии?
category: Delivery
scope: universal
languages: []
roles: ["Frontend", "Backend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Testing", "E2E", "Automation"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

E2E тесты: только critical paths, не всё. Инструменты: Cypress, Playwright, Selenium. Параллелизация: workers. Visual regression: Percy, Chromatic.

## Контекст

E2E — самый дорогой уровень тестов. Проверяют понимание how to use wisely.

## Как строить ответ

### Когда

Critical user flows: login, checkout, payment. Не для: edge cases, unit logic.

### Инструменты

Cypress: modern, fast. Playwright: multi-browser. Selenium: legacy.

### Оптимизация

Параллелизация: workers. Кеширование: снимки state. Page objects: переиспользование.

## Пример ответа

Cypress: critical paths only — login, add to cart, checkout. Параллелизация: 5 workers. Page object: LoginPage, CartPage. Время: 10 тестов, ~2 минуты.

## Частые ошибки

- Тестировать всё через e2e
- Не параллелизировать
- Использовать e2e для regression
- Игнорировать flaky tests

## Дополнительные вопросы

- Как выбрать между Cypress и Playwright?
- Что такое visual regression testing?
- Как уменьшить flaky tests?
