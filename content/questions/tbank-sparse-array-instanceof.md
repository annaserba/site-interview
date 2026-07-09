---
id: tbank-sparse-array-instanceof
title: Как проверить массив, что делает instanceof и как работают разреженные массивы?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Backend"]
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

Array.isArray проверяет массив корректно между realm. instanceof проверяет цепочку прототипов. Sparse arrays: запись за пределами длины увеличивает length, отсутствующие индексы пропускаются.

## Что ожидают в ответе

Ожидается понимание различий `Array.isArray` и `instanceof`, включая cross-realm сценарии, устройство prototype chain и `Symbol.hasInstance`. По разреженным массивам важно различать holes и явный `undefined`, а также знать, что в production их лучше избегать из-за неоднозначной семантики и возможной деоптимизации.

## Контекст

В скрининге эти вопросы проверяют массивы, realms и prototype chain.

## Как строить ответ

### Выбрать корректную проверку

`Array.isArray`, а не `typeof` и не только `instanceof`.

### Объяснить instanceof

Это проверка prototype chain, не номинального типа данных.

### Разобрать holes

Показать изменение `length` и отличие отсутствующего элемента от явного `undefined`.


## Код из интервью

```typescript
// Sparse array: holes in indices
const sparse = [1, , 3];           // length 3, index 1 is a hole
console.log(sparse.length);       // 3
console.log(1 in sparse);         // false
console.log(sparse[1]);           // undefined

// instanceof vs Array.isArray
console.log(sparse instanceof Array);  // true
console.log(Array.isArray(sparse));    // true

// Cross-realm check
const iframe = document.createElement('iframe');
document.body.appendChild(iframe);
const iframeArray = iframe.contentWindow!.Array;
const arr = new iframeArray(1, 2, 3);

console.log(arr instanceof Array);     // false (different realm)
console.log(Array.isArray(arr));       // true

// Sparse array methods skip holes
sparse.forEach((v, i) => console.log(i, v)); // 0 1, 2 3 (skips index 1)
console.log([...sparse]);              // [1, empty, 3]
console.log(Array.from(sparse));       // [1, undefined, 3]
```

## Пример ответа

instanceof Array проверяет, является ли объект экземпляром Array. Разреженные массивы (sparse arrays) — с «дырами»: const arr = [1, , 3] — длина 3, но индекс 1 отсутствует. Пример:

```javascript
const sparse = [1, , 3];
console.log(sparse instanceof Array); // true
console.log(sparse.length);          // 3
console.log(1 in sparse);            // false
console.log(sparse[1]);              // undefined

console.log(Array.isArray(sparse));  // true
```

Array.isArray надёжнее instanceof: работает через iframe. Разреженные массивы: forEach, map пропускают отсутствующие индексы. Array.from и [...sparse] заполняют дыри undefined. На практике: всегда Array.isArray(), избегаю разреженных массивов.

## Частые ошибки

- Проверять массив через `typeof value === 'array'`.
- Считать holes обычными `undefined`-элементами.
- Полагаться на `instanceof` между iframe/realm.

## Дополнительные вопросы

- Чем `in` отличается от проверки значения по индексу?
- Как `map` и `for...of` ведут себя на sparse array?

