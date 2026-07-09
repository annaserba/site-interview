---
id: tbank-object-cloning
title: Как клонировать объект в JavaScript?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Backend"]
companies: ["Т-Банк"]
level: Senior
stage: Техническое
tags: ["Objects", "Cloning", "structuredClone"]
duration: 10 мин
difficulty: 3
sourceCompany: Т-Банк
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

Spread — поверхностная копия. Для deep clone data-only структур — `structuredClone`: циклы, `Map`, `Set`, `Date`, но не функции. JSON теряет `undefined`, `BigInt` и прототипы.

## Что ожидают в ответе

Проверяются ссылочная модель JavaScript и осознанный выбор глубины копирования. Ожидается, что кандидат уточнит, что такое «клон», сравнит инструменты (spread, structuredClone, JSON), назовёт цену глубокого копирования и упомянет альтернативы — structural sharing и immutable update.

## Контекст

Проверяются ссылочная модель JavaScript и осознанный выбор глубины копирования.

## Как строить ответ

### Уточнить глубину

Отделить копию контейнера от рекурсивной копии графа объектов.

### Сравнить инструменты

Spread для shallow copy, `structuredClone` для поддерживаемых данных, явное преобразование для доменных моделей.

### Назвать цену

Глубокое копирование расходует CPU и память; часто структурное разделение или immutable update дешевле.


## Код из интервью

```typescript
const original = { a: 1, b: { c: 2 }, d: [1, 2, 3] };

// Spread: shallow copy (nested objects still shared)
const shallow = { ...original };
shallow.b.c = 999;
console.log(original.b.c); // 999 — mutation leaked!

// structuredClone: deep copy (modern standard)
const deep = structuredClone(original);
deep.b.c = 888;
console.log(original.b.c); // 999 — original untouched

// structuredClone supports complex types
const withDate = { ts: new Date(), map: new Map([['key', 'val']]) };
const cloned = structuredClone(withDate);
console.log(cloned.ts instanceof Date); // true
console.log(cloned.map.get('key'));     // 'val'

// JSON round-trip: loses functions, undefined, BigInt, RegExp
const jsonClone = JSON.parse(JSON.stringify(original));

// Circular references work with structuredClone
const circular: any = { ref: null };
circular.ref = circular;
const clonedCircular = structuredClone(circular);
```

## Пример ответа

Способы клонирования: 1) {...obj} — shallow copy; 2) Object.assign({}, obj) — аналог spread; 3) structuredClone(obj) — deep copy, поддерживает Date, RegExp, Map, Set; 4) JSON.parse(JSON.stringify(obj)) — deep, но теряет функции, undefined. Пример:

```javascript
const original = { a: 1, b: { c: 2 } };

const shallow = { ...original };
shallow.b.c = 999;
console.log(original.b.c); // 999 —поверхностное  copy!

const deep = structuredClone(original);
deep.b.c = 888;
console.log(original.b.c); // 999 — original не изменился
```

На практике: structuredClone — современный стандарт для deep copy. Для production: lodash.cloneDeep. Для Immutable.js/Immer — immutable updates без полного клонирования.

## Частые ошибки

- Называть spread глубоким копированием.
- Использовать JSON round-trip для произвольных значений.
- Копировать большой state целиком без необходимости.

## Дополнительные вопросы

- Что произойдёт с циклической ссылкой?
- Когда лучше использовать structural sharing?

