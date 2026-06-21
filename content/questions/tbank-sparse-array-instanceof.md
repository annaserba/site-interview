---
id: tbank-sparse-array-instanceof
title: Как проверить массив, что делает instanceof и как работают разреженные массивы?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Node.js-разработчик"]
companies: ["Т-Банк"]
level: Senior
stage: Техническое
tags: ["Array", "instanceof", "Prototype"]
duration: 10 мин
difficulty: 3
sourceCompany: Т-Банк
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

Массив проверяют через `Array.isArray(value)`: это корректно и для значений из другого realm, где `value instanceof Array` может быть false. `instanceof` проверяет, встречается ли `Constructor.prototype` в prototype chain объекта; поведение можно переопределить через `Symbol.hasInstance`. Если у массива длины 3 записать значение по индексу 7, `length` станет 8, а позиции 3–6 будут holes, не значениями `undefined`: часть array-методов пропускает holes. В production разреженных массивов лучше избегать из-за неоднозначной семантики и возможной деоптимизации.

## Контекст

В скрининге эти вопросы проверяют массивы, realms и prototype chain.

## Как строить ответ

### Выбрать корректную проверку

`Array.isArray`, а не `typeof` и не только `instanceof`.

### Объяснить instanceof

Это проверка prototype chain, не номинального типа данных.

### Разобрать holes

Показать изменение `length` и отличие отсутствующего элемента от явного `undefined`.

## Частые ошибки

- Проверять массив через `typeof value === 'array'`.
- Считать holes обычными `undefined`-элементами.
- Полагаться на `instanceof` между iframe/realm.

## Дополнительные вопросы

- Чем `in` отличается от проверки значения по индексу?
- Как `map` и `for...of` ведут себя на sparse array?

