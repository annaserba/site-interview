---
id: tbank-js-equality
title: В чём разница между == и === в JavaScript?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Node.js-разработчик"]
companies: ["Т-Банк"]
level: Senior
stage: Техническое
tags: ["Equality", "Coercion", "Object.is"]
duration: 8 мин
difficulty: 3
sourceCompany: Т-Банк
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

`===` сравнивает без приведения типов, поэтому это безопасный default. `==` выполняет Abstract Equality Comparison: например, `null == undefined`, строки могут преобразоваться в числа, а объекты — в primitive через `valueOf`/`toString`. Объекты в обоих случаях сравниваются по identity. Отдельные края: `NaN !== NaN`, а `0 === -0`; если это важно, используйте `Object.is`, где `Object.is(NaN, NaN)` истинно, а `Object.is(0, -0)` ложно.

## Контекст

Проверяется знание coercion, identity и числовых крайних случаев.

## Как строить ответ

### Дать правило по умолчанию

В прикладном коде использовать `===`, а coercion писать явно.

### Привести показательные примеры

`null == undefined`, `0 == false`, объектные ссылки и `NaN`.

### Упомянуть Object.is

Объяснить отличие на `NaN` и signed zero.

## Частые ошибки

- Говорить, что `==` просто игнорирует тип.
- Ожидать структурного сравнения объектов.
- Использовать набор выученных примеров без общего алгоритма coercion.

## Дополнительные вопросы

- Почему `[] == false` возвращает true?
- Как корректно сравнивать объекты по значению?

