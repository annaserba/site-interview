---
id: frontend-js-types
title: Какие типы данных есть в JavaScript?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Node.js-разработчик"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Types", "Coercion", "Runtime"]
duration: 10 мин
difficulty: 3
sourceReports: [{"company":"Т-Банк"}]
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Примитивы: `undefined`, `null`, boolean, number, bigint, string и symbol. Всё остальное — object, включая функции и массивы. Примитивы неизменяемы, а объектные значения сравниваются по identity. `typeof null === "object"` — историческая особенность; массив проверяют `Array.isArray`, а значение из другого realm нельзя надёжно классифицировать только через `instanceof`.

## Контекст

Проверяется понимание runtime-модели, сравнений, coercion и границ между JavaScript и TypeScript.

## Как строить ответ

### Перечислить группы

Отделите семь примитивов от object и поясните boxing при обращении к методам примитива.

### Объяснить числа

Number использует IEEE 754; `NaN` проверяют через `Number.isNaN`, `-0` и `NaN` точно различает `Object.is`, BigInt нельзя неявно смешивать с Number.

### Связать с TypeScript

Типы TypeScript стираются до runtime и не валидируют внешние данные; на границе API нужна runtime-проверка.

## Частые ошибки

- Называть массив отдельным runtime-типом.
- Использовать глобальный `isNaN` без понимания coercion.
- Считать TypeScript runtime-валидатором.

## Дополнительные вопросы

- Чем `Object.is` отличается от `===`?
- Почему `0.1 + 0.2 !== 0.3`?
- Как валидировать `unknown` из API?
