---
id: tbank-js-return-values
title: Что возвращают функция без return и setTimeout?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Node.js-разработчик"]
companies: ["Т-Банк"]
level: Senior
stage: Техническое
tags: ["Functions", "Timers", "Return value"]
duration: 7 мин
difficulty: 2
sourceCompany: Т-Банк
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

Обычная функция без выполненного `return value` возвращает `undefined`; пустой `return` делает то же самое. `setTimeout` возвращает handle для отмены таймера: в браузере это числовой id, в Node.js — объект `Timeout`, поэтому переносимый TypeScript-тип удобно получать как `ReturnType<typeof setTimeout>`. Handle не является результатом callback и не гарантирует точное время запуска: delay задаёт минимальную задержку до постановки задачи в очередь.

## Контекст

Проверяются базовые контракты функций и различия timer API между средами.

## Как строить ответ

### Разделить два результата

Return функции, return `setTimeout` и return callback — разные значения.

### Учесть runtime

Browser и Node возвращают разные виды handle.

### Объяснить назначение

Handle передают в `clearTimeout`; delay не является расписанием реального времени.


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

Функция без return возвращает undefined. setTimeout возвращает numeric ID (для clearTimeout). Примеры:

```javascript
function noReturn() { let x = 5; }
console.log(noReturn()); // undefined

const id = setTimeout(() => console.log('hi'), 1000);
console.log(id); // 42 (число)

async function fetchData() {
  return fetch('/api'); // возвращает Promise<Response>
}
```

return с объектом: function f() { return { a: 1 } } — скобки обязательны. Arrow: const f = () => ({ a: 1 }). Async функция всегда возвращает Promise. На практике: если функция ничего не возвращает — это не ошибка, но нужно быть явным.

## Частые ошибки

- Считать, что `setTimeout` возвращает Promise.
- Типизировать handle только как `number` в изоморфном коде.
- Ожидать точного запуска через заданное число миллисекунд.

## Дополнительные вопросы

- Что вернёт async-функция без return?
- Почему таймер может сработать заметно позже?

