---
id: testing-mocking
title: Как и зачем использовать mock в тестах?
category: Delivery
scope: universal
languages: []
roles: ["Backend", "Frontend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Testing", "Mocking", "Isolation"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Mock — подмена зависимостей для изоляции тестируемого кода. Зачем: скорость (нет реальных вызовов), изоляция (только логика), deterministic (нет side effects). Инструменты: Jest mocks, Mockito, WireMock.

## Контекст

Ключевой concept для unit тестов. Проверяют понимание when to mock.

## Как строить ответ

### Когда mock

Внешние сервисы, БД, файловая система, время. Не mock: простые объекты, value objects.

### Типы

Dummy: заглушка. Stub: возвращает данные. Mock: проверяет вызовы. Spy: записывает вызовы.

## Пример ответа

UserService.create(): mock UserRepository (verify save called), mock EmailService (verify send called). Не mock: User object. Jest: jest.mock('./ UserRepository'). Mockito: @Mock UserRepository.

## Частые ошибки

- Mock слишком много зависимостей
- Тестировать implementation details
- Не верифицировать interactions
- Использовать mock для integration тестов

## Дополнительные вопросы

- Как выбрать что mock а что нет?
- Что такое test doubles?
- Как тестировать код с time dependency?
