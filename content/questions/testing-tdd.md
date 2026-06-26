---
id: testing-tdd
title: Что такое TDD и когда его использовать?
category: Delivery
scope: universal
languages: []
roles: ["Backend", "Frontend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Testing", "TDD", "Development"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

TDD (Test-Driven Development): Red → Green → Red. Сначала пишете failing test, затем минимум кода для прохождения, затем refactor. Преимущества: лучше design, confident refactoring, documentation.

## Контекст

Development methodology. Проверяют понимание TDD benefits и when to use.

## Как строить ответ

### Цикл TDD

1. Red: написать failing test. 2. Green: написать минимум кода. 3. Refactor: улучшить код.

### Преимущества

Better design: интерфейсы проектируются через использование. Confident refactoring: тесты покрывают. Documentation: тесты показывают intent.

### Когда использовать

Новый код, complex logic, bug fixes. Не для: prototype, UI, simple CRUD.

## Пример ответа

TDD: написать тест `calculateDiscount(user) → 10%`. Test fails (Red). Реализовать `calculateDiscount` (Green). Refactor: extract discount rules. Результат: 100% покрытия, confident refactoring.

## Частые ошибки

- Писать тесты после кода
- Тестить implementation details
- Не refactor после green
- Использовать TDD для всего

## Дополнительные вопросы

- Как TDD связан с BDD?
- Что такое mocking в TDD?
- Как тестировать legacy code без TDD?
