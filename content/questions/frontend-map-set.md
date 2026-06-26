---
id: frontend-map-set
title: В чём разница между Map и Set?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Backend"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Map", "Set", "Collections"]
duration: 10 мин
difficulty: 3
sourceReports: [{"company":"Т-Банк"}]
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Map хранит пары key-value, Set — уникальные values. Оба сохраняют insertion order и используют SameValueZero для сравнения: `NaN` равен `NaN`, а объекты сравниваются по identity. Map подходит для произвольных ключей и частых add/delete; Set — для membership и дедупликации. WeakMap и WeakSet не перечисляются и не удерживают объектные ключи от garbage collection.

## Контекст

Проверяется выбор структуры по операциям, а не знание сигнатур методов.

## Как строить ответ

### Назвать модель данных

Map отвечает «ключ → значение», Set — «присутствует ли значение».

### Сравнить с Object и Array

Object удобен для record с известными строковыми ключами; Map избегает prototype keys и имеет `size`. Set лучше линейного `includes` при множественных проверках.

### Учесть память

Weak-коллекции полезны для метаданных объектов и кешей, но не дают перечисления или размера.


## Код из интервью

```typescript
// Map vs Object
const map = new Map();
map.set("key1", "value1");
map.set(42, "number key");
console.log(map.get(42)); // "number key"

// Set — уникальные значения
const unique = new Set([1, 2, 2, 3, 3]);
console.log([...unique]); // [1, 2, 3]

// WeakMap / WeakRef — GC-friendly
const weakMap = new WeakMap();
let obj = { heavy: "data" };
weakMap.set(obj, "metadata");
obj = null; // GC может собрать entry
```

## Пример ответа

Map — коллекция пар «ключ-значение», где ключи могут быть любого типа. Set — коллекция уникальных значений. Разница с Object/Array: 1) Map сохраняет порядок вставки; 2) Ключи Map не приводятся к строкам; 3) Map имеет размер через .size; 4) Set эффективно проверяет наличие элемента через .has() — O(1). Пример:

```javascript
const map = new Map();
map.set('name', 'Alice');
map.set(42, 'answer');
map.set(document.body, 'DOM element');

const set = new Set([1, 2, 2, 3]); // {1, 2, 3}
```

На практике: Map — когда ключи не строки или нужен порядок; Set — для дедупликации массива ([...new Set(arr)]). WeakMap/WeakSet — ключи могут быть только объектами.

## Частые ошибки

- Ожидать дедупликацию разных объектов с одинаковыми полями.
- Использовать WeakMap со строковыми ключами.
- Обещать конкретную O(1) реализацию вместо спецификационного sublinear access.

## Дополнительные вопросы

- Когда Object лучше Map?
- Как дедуплицировать объекты по id?
- Для чего использовать WeakMap?
