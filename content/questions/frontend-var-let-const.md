---
id: frontend-var-let-const
title: В чём разница между var, let и const?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Node.js-разработчик"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Scope", "Hoisting", "Bindings"]
duration: 10 мин
difficulty: 3
sourceReports: [{"company":"Т-Банк"}]
sourceType: aggregated
sourceUrl: ""
sourceVideos: [{"company":"Гознак","url":"https://www.youtube.com/watch?v=Egvch4SA998&t=2040s"}]
---

## Короткий ответ

`var` имеет function/global scope, допускает повторное объявление и инициализируется `undefined` при создании окружения. `let` и `const` имеют block scope и находятся в temporal dead zone до выполнения декларации. `const` запрещает переназначить binding, но не делает объект неизменяемым. В цикле `let` создаёт отдельный binding для каждой итерации, что важно для closures.

## Контекст

Нужно объяснить модель окружений, а не ограничиться правилом «всегда используйте const».

## Как строить ответ

### Сравнить scope

Покажите различие function scope и block scope на условии или цикле.

### Объяснить hoisting точно

Все декларации регистрируются заранее, но `let` и `const` недоступны до initialization; это и есть TDZ.

### Обсудить практику

Используйте `const` по умолчанию, `let` для переназначения, `var` — только при работе с legacy-семантикой.


## Код из интервью

```typescript
// var vs let vs const
var globalVar = "function-scoped, hoisted";
let blockLet = "block-scoped, no hoist";
const blockConst = "block-scoped, no reassign";

// Классическая проблема с var в цикле
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)); // 3, 3, 3
}
// Исправление с let
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j)); // 0, 1, 2
}
```

## Пример ответа

var — function-scoped, hoisted (доступна до объявления как undefined), можно переобъявить. let — block-scoped, не hoisted (TDZ — ReferenceError), нельзя переобъявить. const — block-scoped, не hoisted, нельзя переприсвоить (но объект/массив можно мутировать). Пример:

```javascript
var x = 1; var x = 2;    // OK
let y = 1; // let y = 2;  // SyntaxError
const z = 1; // z = 2;    // TypeError

for (var i = 0; i < 3; i++) {}
console.log(i); // 3 — var видна за пределами цикла

for (let j = 0; j < 3; j++) {}
console.log(j); // ReferenceError — let блочная
```

На практике: const по умолчанию, let когда нужно переприсвоение, var не использую. Важно: const для массивов не запрещает push — const arr = []; arr.push(1) OK.

## Частые ошибки

- Говорить, что `let` и `const` не hoistятся.
- Считать объект в `const` immutable.
- Не учитывать глобальные свойства, создаваемые `var` в classic script.

## Дополнительные вопросы

- Почему closure в цикле с `var` видит последнее значение?
- Чем declaration отличается от initialization?
- Что меняется в ES modules?
