---
id: frontend-js-types
title: Какие типы данных есть в JavaScript?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Backend"]
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


## Код из интервью

```typescript
// 8 types in JavaScript: 7 primitives + object
typeof undefined;   // 'undefined'
typeof null;        // 'object' (historical bug)
typeof true;        // 'boolean'
typeof 42;          // 'number'
typeof 42n;         // 'bigint'
typeof 'hello';     // 'string'
typeof Symbol('s'); // 'symbol'

typeof {};          // 'object'
typeof [];          // 'object' (arrays are objects)
typeof function(){} // 'function' (special object)

// Primitive comparison (by value)
1 === 1;              // true
'str' === 'str';      // true

// Object comparison (by reference)
const obj1 = { a: 1 };
const obj2 = { a: 1 };
obj1 === obj2;         // false — different references
obj1 === obj1;         // true  — same reference

// Type coercion examples
console.log(1 == '1');   // true  (string → number)
console.log(1 === '1');  // false (no coercion)
console.log(null == undefined);  // true
console.log(null === undefined); // false

// Number edge cases
console.log(0.1 + 0.2 === 0.3);  // false (IEEE 754)
console.log(Object.is(NaN, NaN)); // true
console.log(Object.is(0, -0));    // false
```

## Пример ответа

JavaScript имеет 8 типов данных: 7 примитивов — undefined, null, boolean, number, bigint, string, symbol — и object (включает массивы, функции). Примитивы сравниваются по значению, объекты — по ссылке. Важные нюансы: typeof null === 'object' (историческая ошибка). Примеры:

```javascript
typeof 42          // 'number'
typeof 'hello'     // 'string'
typeof true        // 'boolean'
typeof undefined   // 'undefined'
typeof null        // 'object' (!)
typeof {}          // 'object'
typeof []          // 'object'
```

== делает type coercion (1 == '1' → true), === — строгое сравнение. На практике я всегда использую ===. TypeScript добавляет статическую типизацию поверх динамических типов.

## Частые ошибки

- Называть массив отдельным runtime-типом.
- Использовать глобальный `isNaN` без понимания coercion.
- Считать TypeScript runtime-валидатором.

## Дополнительные вопросы

- Чем `Object.is` отличается от `===`?
- Почему `0.1 + 0.2 !== 0.3`?
- Как валидировать `unknown` из API?
