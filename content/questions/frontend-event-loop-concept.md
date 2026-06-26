---
id: frontend-event-loop-concept
title: Что такое Event Loop? Порядок выполнения кода
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Node.js-разработчик"]
companies: ["Wildberries"]
level: Senior
stage: Техническое
tags: ["Event Loop", "Runtime", "Concurrency", "Microtasks", "Timers"]
duration: 12 мин
difficulty: 3
sourceCompany: Wildberries
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=HF7zkpSrByE&t=128s"
---

## Короткий ответ

Event Loop — механизм среды выполнения, координирующий job queue с асинхронными подсистемами. Один вызов JavaScript выполняется до конца; между задачами runtime очищает microtask queue, затем может выполнить rendering. Порядок: sync code → все microtasks → одна macrotask → все microtasks → следующая macrotask. Promise.then выполняется раньше setTimeout(0). В Node.js порядок зависит от фаз timers/poll/check.

## Контекст

Нужно объяснить модель конкурентности JavaScript без мифа «Event Loop делает код асинхронным». Интервьюер ожидает точный вывод порядка логов.

## Как строить ответ

### Разделить язык и среду

ECMAScript определяет jobs, а таймеры, сеть, DOM — host environment.

### Объяснить очереди

Task выполняется целиком, затем microtask checkpoint очищает Promise reactions и queueMicrotask, rendering получает шанс между tasks.

### Назвать практические риски

Длинные tasks блокируют ввод и отрисовку. Разбивайте работу или переносите в Worker.

## Код из интервью

```typescript
console.log("1: sync");
setTimeout(() => console.log("2: macrotask"), 0);
Promise.resolve().then(() => console.log("3: microtask"));
queueMicrotask(() => console.log("4: microtask explicit"));
console.log("5: sync");
// Вывод: 1 -> 5 -> 3 -> 4 -> 2

// Сложный пример
console.log('start');
setTimeout(() => console.log('timeout1'), 0);
setTimeout(() => console.log('timeout2'), 0);
Promise.resolve().then(() => console.log('promise1'));
Promise.resolve().then(() => console.log('promise2'));
console.log('end');
// Вывод: start, end, promise1, promise2, timeout1, timeout2
```

## Пример ответа

Event Loop — это механизм, позволяющий JavaScript выполнять асинхронные операции в однопоточном окружении. Он состоит из: Call Stack, Web APIs, Callback Queue (макротаски) и Microtask Queue (промисы). Алгоритм: 1) Выполняем синхронный код; 2) Проверяем Microtask Queue — выполняем все микротаски; 3) Проверяем Callback Queue — берём одну макротаску; 4) Повторяем. Приоритет: микротаски ВСЕГДА выполняются перед макротасками.

setTimeout(..., 0) не означает «немедленно» — это «после текущего стека и микротасок». Все промисы выполняются до любого setTimeout. В React: useEffect выполняется после paint (макротаска), useLayoutEffect — до paint (микротаска). В Node.js: process.nextTick имеет отдельную приоритетную очередь, setImmediate — после poll phase.

## Частые ошибки

- Называть Event Loop отдельным потоком JavaScript.
- Утверждать, что setTimeout(0) выполняется немедленно.
- Не различать browser loop и фазы Node.js.
- Выполнять timer сразу после строки его регистрации.

## Дополнительные вопросы

- Может ли microtask starvation заблокировать интерфейс?
- Где выполняется requestAnimationFrame?
- Чем setImmediate отличается от setTimeout(0) в Node.js?
- Что произойдёт при рекурсивном queueMicrotask?
