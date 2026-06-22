---
id: okko-js-execution-context
title: Что такое контекст выполнения функции в JavaScript?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Okko"]
level: Senior
stage: Техническое
tags: ["Execution Context", "this", "Scope"]
duration: 15 мин
difficulty: 4
sourceReports: [{"company":"Т-Банк"}]
sourceCompany: Okko
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=6aIg-fGUOsY&t=587s"
---

## Короткий ответ

Execution context содержит lexical/variable environment, ссылку на outer environment и binding `this`; контексты образуют call stack. Lexical scope определяется местом объявления, а `this` обычной функции — способом вызова. У стрелки собственного `this` и `arguments` нет. `call`, `apply` и `bind` задают `this` явно, `new` создаёт новый объект и связывает его с prototype.

## Контекст

Вопрос связывает scope, closure, call stack и правила `this`.

## Как строить ответ

### Создание

Что подготавливается до выполнения тела функции.

### Scope

Как идёт поиск идентификатора по lexical environments.

### This

Разобрать method call, plain call, constructor и arrow.


## Код из интервью

```typescript
// Пример использования
const example = () => {
  const state = { loading: false, data: null, error: null };

  return {
    async fetch(url) {
      state.loading = true;
      try {
        const res = await fetch(url);
        state.data = await res.json();
      } catch (err) {
        state.error = err.message;
      } finally {
        state.loading = false;
      }
      return state;
    },
  };
};
```

## Пример ответа

Execution context — это окружение, в котором выполняется JavaScript-код. Три типа: 1) Global — создаётся при запуске скрипта; 2) Function — создаётся при вызове функции; 3) Eval — создаётся при вызове eval(). Стек выполнения (Call Stack) хранит execution contexts: при вызове функции новый context пушится, при выходе — попится. Пример:

```javascript
let a = 1;          // Global context

function outer() {
  let b = 2;       // outer context
  function inner() {
    let c = 3;     // inner context
    console.log(a + b + c);
  }
  inner();
}
```

this определяется контекстом: в global — window, в функции — undefined (strict mode). Arrow function наследует this из окружающего контекста (lexical this).

## Частые ошибки

- Называть `this` частью closure.
- Определять `this` местом объявления обычной функции.
- Смешивать execution context и объект контекста React.

## Дополнительные вопросы

- Чем arrow отличается от обычной функции?
- Что хранит closure?
