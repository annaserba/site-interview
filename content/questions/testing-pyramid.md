---
id: testing-pyramid
title: Что такое тестовая пирамида и как её применять?
category: Delivery
scope: universal
languages: []
roles: ["Backend", "Frontend", "DevOps"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Testing", "CI/CD", "Quality"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Тестовая пирамида: много unit тестов (быстрые, дешёвые), меньше интеграционных, минимум e2e (медленные, дорогие). Unit → Integration → E2E. Баланс скорости и покрытия.

## Контекст

Фундаментальный concept для testing strategy. Проверяют понимание how to structure tests.

## Как строить ответ

### Unit тесты

Тестируют одну функцию/class. Быстрые, изолированные, дешёвые. Цель: 70-80% покрытия.

### Интеграционные

Тестируют взаимодействие между компонентами. API, database, message queues.

### E2E

Тестируют entire flow через UI. Медленные, хрупкие, дорогие. Минимум.

## Пример ответа

Unit: UserService.create() — проверяем логику без БД. Интеграционный: UserService + PostgreSQL — проверяем SQL queries. E2E: Cypress — полный flow регистрации. Пирамида: 100 unit, 20 integration, 5 e2e. Скорость: unit ~1ms, integration ~100ms, e2e ~10s.

## Частые ошибки

- Писать только e2e тесты
- Игнорировать unit тесты
- Не тестировать edge cases
- Не поддерживать тесты

## Дополнительные вопросы

- Как выбрать что тестировать unit vs integration?
- Что такое testing anti-patterns?
- Как измерить покрытие кода?
