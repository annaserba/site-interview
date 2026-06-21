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

## Частые ошибки

- Называть Event Loop отдельным потоком JavaScript.
- Утверждать, что `setTimeout(0)` выполняется немедленно.
- Не различать browser loop и фазы Node.js.

## Дополнительные вопросы

- Когда браузер выполняет rendering?
- Может ли microtask starvation заблокировать интерфейс?
- Чем Worker отличается от асинхронного API?
