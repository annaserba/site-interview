---
id: testing-code-coverage
title: Что такое code coverage и как его использовать?
category: Delivery
scope: universal
languages: []
roles: ["Backend", "Frontend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Testing", "Coverage", "Quality"]
duration: 5 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Code coverage — процент кода, покрытый тестами. Инструменты: Istanbul (JS), JaCoCo (Java). Цель: 70-80%, не 100%. Coverage ≠ quality.

## Контекст

Метрика для testing. Проверяют понимание limitations.

## Как строить ответ

### Типы

Line coverage, branch coverage, function coverage. Branch coverage > line coverage.

### Ограничения

100% coverage ≠ нет bugs. Тесты могут быть плохими.

### Использование

CI gate: coverage не ниже порога. Identify untested code.

## Пример ответа

Istanbul: line coverage 85%, branch coverage 78%. CI: coverage < 80% → fail. Но: 100% coverage не guarantee quality — тесты могут не проверять edge cases.

## Частые ошибки

- Гнаться за 100% coverage
- Использовать coverage как единственную метрику
- Не тестировать edge cases
- Писать тесты ради coverage

## Дополнительные вопросы

- Как увеличить code coverage?
- Что такое mutation testing?
- Как связаны coverage и code quality?
