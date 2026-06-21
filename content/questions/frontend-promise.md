---
id: frontend-promise
title: Что такое Promise?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Node.js-разработчик"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Promise", "Async", "Error handling"]
duration: 12 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Promise — объект eventual result с состоянием pending, fulfilled или rejected. Executor запускается синхронно, а reactions `then/catch/finally` ставятся в microtask queue. `then` всегда возвращает новый Promise и ассимилирует возвращённый thenable. Promise не отменяет операцию: отмена передаётся отдельно, например через AbortSignal.

## Контекст

Senior-кандидат должен понимать композицию, распространение ошибок, конкурентность и отсутствие встроенной отмены.

## Как строить ответ

### Объяснить цепочку

Возвращённое значение fulfillment-ит следующий Promise, throw или rejected Promise переводит цепочку в rejection.

### Выбрать combinator

`all` — fail-fast для всех результатов, `allSettled` — полный отчёт, `race` — первый settled, `any` — первый fulfilled.

### Контролировать ресурсы

Не запускайте тысячи операций одним `Promise.all`; используйте concurrency limit, timeout, AbortSignal и обработку unhandled rejection.

## Частые ошибки

- Считать Promise отдельным потоком.
- Забывать `return` внутри `then`.
- Полагать, что `Promise.race` отменяет проигравшие операции.

## Дополнительные вопросы

- Когда executor Promise выполняется?
- Чем `all` отличается от `allSettled`?
- Как реализовать ограничение конкурентности?
