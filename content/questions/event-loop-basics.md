---
id: event-loop-basics
title: Как работает Event Loop и асинхронность в JavaScript?
category: JavaScript
scope: universal
languages: ["JavaScript"]
roles: ["Frontend", "Backend"]
companies: []
level: Middle
stage: Техническое
tags: ["JavaScript", "Event Loop", "Async", "Concurrency"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

JavaScript однопоточный. Event Loop координирует выполнение: Call Stack (синхронный код), Web APIs (браузерные функции), Callback Queue (макротаски), Microtask Queue (промисы). При пустом Call Stack сначала выполняются все микротаски, затем один макротаск.

## Контекст

Интервьюер проверяет понимание асинхронного выполнения кода — ключевой концепции JavaScript.

## Как строить ответ

### Call Stack

Стек вызовов. Синхронный код выполняется здесь. Если стек не пуст — микротаски и макротаски ждут.

### Microtask Queue

Промисы (.then, catch, finally), queueMicrotask, MutationObserver. Выполняются ПЕРЕД макротасками.

### Macrotask Queue

setTimeout, setInterval, I/O, UI rendering. Выполняются ПОСЛЕ микротасок.

### Однопоточность

JS не блокируется — асинхронные операции выполняются в Web APIs (в других потоках браузера).

## Пример ответа

Event Loop работает так: 1) Синхронный код выполняется в Call Stack. 2) Асинхронные операции (setTimeout, fetch) передаются в Web APIs. 3) По завершении колбэки попадают в Callback Queue (макротаски) или Microtask Queue (промисы). 4) Event Loop проверяет: если Call Stack пуст, сначала выполняет ВСЕ микротаски, затем ОДИН макротаск. Поэтому промисы (microtask) выполняются быстрее setTimeout (macrotask).

## Частые ошибки

- Полагать, что колбэк setTimeout с задержкой 0 выполнится сразу после синхронного кода, пропуская микротаски.
- Смешивать очередь микротаск и макротаск в единую «очередь колбэков», не объясняя разный приоритет.
- Объяснять однопоточность как отсутствие параллелизма, игнорируя роль Web APIs и Worker-потоков.
- Демонстрировать код с тяжёлыми вычислениями в синхронном блоке, не объясняя, как это блокирует рендеринг.

## Дополнительные вопросы

- Что блокирует рендеринг — микротаски или макротаски?
- Как yieldить выполнение из синхронного кода?
- Что такое requestAnimationFrame?
- Как работает async/await с точки зрения Event Loop?