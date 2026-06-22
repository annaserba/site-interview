---
id: frontend-event-loop-concept
title: Что такое Event Loop?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Node.js-разработчик"]
companies: ["Wildberries"]
level: Senior
stage: Техническое
tags: ["Event Loop", "Runtime", "Concurrency"]
duration: 10 мин
difficulty: 3
sourceCompany: Wildberries
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=HF7zkpSrByE&t=128s"
---

## Короткий ответ

Event Loop — механизм среды выполнения, который координирует JavaScript job queue с асинхронными подсистемами браузера или Node.js. Один вызов JavaScript выполняется до конца; между задачами runtime очищает очередь microtasks, затем может выполнить rendering и перейти к следующей task. Поэтому `Promise.then` обычно выполняется раньше `setTimeout(0)`, а длинный синхронный код блокирует ввод и отрисовку.

## Контекст

Нужно объяснить модель конкурентности JavaScript без мифа «Event Loop делает код асинхронным».

## Как строить ответ

### Разделить язык и среду

ECMAScript определяет jobs, а таймеры, сеть, DOM и фазы Node.js предоставляет host environment.

### Объяснить очереди

Task выполняется целиком, затем microtask checkpoint очищает Promise reactions и `queueMicrotask`; rendering получает шанс между tasks.

### Назвать практические риски

Длинные tasks, бесконечная цепочка microtasks и синхронный CPU-код ухудшают responsiveness; разбивайте работу или переносите её в Worker.


## Код из интервью

```typescript
// Event Loop — порядок выполнения
console.log("1: sync");

setTimeout(() => console.log("2: macrotask"), 0);

Promise.resolve().then(() => console.log("3: microtask"));

queueMicrotask(() => console.log("4: microtask explicit"));

console.log("5: sync");

// Вывод: 1 -> 5 -> 3 -> 4 -> 2
// Microtasks ВСЕГДА перед macrotasks
```

## Пример ответа

Event Loop — это механизм, позволяющий JavaScript выполнять асинхронные операции в однопоточном окружении. Он состоит из: Call Stack, Web APIs, Callback Queue (макротаски) и Microtask Queue (промисы). Алгоритм: 1) Выполняем синхронный код; 2) Проверяем Microtask Queue — выполняем все микротаски; 3) Проверяем Callback Queue — берём одну макротаску; 4) Повторяем. Приоритет: микротаски ВСЕГДА выполняются перед макротасками. Пример:

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Вывод: 1, 4, 3, 2
```

## Частые ошибки

- Называть Event Loop отдельным потоком JavaScript.
- Утверждать, что `setTimeout(0)` выполняется немедленно.
- Не различать browser loop и фазы Node.js.

## Дополнительные вопросы

- Когда браузер выполняет rendering?
- Может ли microtask starvation заблокировать интерфейс?
- Чем Worker отличается от асинхронного API?
