---
id: frontend-event-loop-order
title: В каком порядке выполнятся Promise и setTimeout?
aliases: ["Порядок выполнения Promise и setTimeout", "Что выполнится раньше Promise или setTimeout?"]
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend", "Backend"]
companies: ["Несколько компаний"]
level: Senior
stage: Live coding
tags: ["Event Loop", "Promise", "Microtasks", "Timers"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Сначала выполняется весь синхронный код текущего call stack. После него runtime очищает очередь microtasks: `Promise.then`, `queueMicrotask`, mutation observer callbacks. Только потом берётся следующая macrotask/task: `setTimeout`, события, сетевые callbacks. Поэтому при `Promise.resolve().then(...)` и `setTimeout(..., 0)` сначала будет callback промиса, затем таймер. Важно: новый microtask, добавленный внутри microtask, тоже выполнится до перехода к таймеру.

## Контекст

Проверяют не запоминание конкретного вывода, а модель: stack → microtasks до исчерпания → task queue → rendering между задачами, если браузеру нужно перерисовать страницу.

## Как строить ответ

### Разделить sync и async

Отметьте все `console.log`, которые выполняются сразу, до любых очередей.

### Выписать microtasks

Все `then/catch/finally` и `queueMicrotask` идут раньше таймеров. Если microtask создаёт новый microtask, он добавляется в конец той же microtask queue.

### Выписать tasks

`setTimeout` попадает в task queue. Даже `0 ms` означает «не раньше следующего task turn», а не немедленно.

## Пример ответа

Я отлаживал баг с исчезающим лоадером на форме логина: пользователь нажимал «Войти», мы вешали `setTimeout(..., 0)` для показа спиннера, а затем выполняли `fetch`. Колбэк промиса от `fetch` попадал в microtask queue и отрабатывал раньше, чем macrotask таймера — спиннер включался уже после ответа сервера, создавая иллюзию мгновенного входа. Я перенёс код показа лоадера в синхронный блок до всех асинхронных операций, и проблема исчезла. Теперь при разборе подобных цепочек я всегда выписываю порядок: синхронный код → microtasks до опустошения → macrotasks.

## Частые ошибки

- Считать, что `setTimeout(..., 0)` выполняется сразу после текущей строки.
- Забывать, что microtask queue очищается полностью.
- Смешивать браузерный event loop и фазы Node.js без оговорки.

## Дополнительные вопросы

- Что поменяется, если `then` создаёт ещё один `then`?
- Чем `queueMicrotask` отличается от `setTimeout`?
- Где в этой модели происходит rendering?

