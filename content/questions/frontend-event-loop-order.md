---
id: frontend-event-loop-order
title: Как работает Event Loop и в каком порядке выполнится код?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Node.js-разработчик"]
companies: ["Wildberries"]
level: Senior
stage: Техническое
tags: ["Event Loop", "Microtasks", "Timers"]
duration: 15 мин
difficulty: 4
sourceReports: [{"company":"Т-Банк"}]
sourceCompany: Wildberries
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=HF7zkpSrByE&t=128s"
---

## Короткий ответ

Разбирайте пример по шагам: сначала весь синхронный stack, затем microtasks в порядке постановки до полного опустошения, после этого следующая task — например timer или событие. Новые microtasks, созданные microtask, выполняются в том же checkpoint. В Node.js порядок дополнительно зависит от фаз timers, poll, check и версии runtime; `process.nextTick` имеет отдельную приоритетную очередь.

## Контекст

Интервьюер ожидает точный вывод порядка логов и объяснение, почему он получился.

## Как строить ответ

### Выписать синхронную часть

Отмечайте момент регистрации callback, но не выполняйте его до освобождения stack.

### Построить очереди

Отдельно записывайте Promise reactions, `queueMicrotask`, timers и host events; после каждого callback учитывайте новые задачи.

### Зафиксировать среду

Не переносите правила браузера на Node.js. Для неоднозначного примера назовите runtime и версию.


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

Порядок выполнения: синхронный код → все микротаски → одна макротаска → все микротаски → следующая макротаска. Пример:

```javascript
console.log('start');
setTimeout(() => console.log('timeout1'), 0);
setTimeout(() => console.log('timeout2'), 0);
Promise.resolve().then(() => console.log('promise1'));
Promise.resolve().then(() => console.log('promise2'));
console.log('end');
// Вывод: start, end, promise1, promise2, timeout1, timeout2
```

Ключевые моменты: setTimeout(..., 0) не означает «немедленно» — это «после текущего стека и микротасок». Все промисы выполняются до любого setTimeout. В React: useEffect выполняется после paint (макротаска), useLayoutEffect — до paint (микротаска).

## Частые ошибки

- Выполнять timer сразу после строки его регистрации.
- Считать, что microtask checkpoint обрабатывает только исходную очередь.
- Давать один порядок для браузера и Node.js.

## Дополнительные вопросы

- Что произойдёт при рекурсивном `queueMicrotask`?
- Где выполняется `requestAnimationFrame`?
- Чем `setImmediate` отличается от `setTimeout(0)` в Node.js?
