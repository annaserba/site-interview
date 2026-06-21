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

## Частые ошибки

- Выполнять timer сразу после строки его регистрации.
- Считать, что microtask checkpoint обрабатывает только исходную очередь.
- Давать один порядок для браузера и Node.js.

## Дополнительные вопросы

- Что произойдёт при рекурсивном `queueMicrotask`?
- Где выполняется `requestAnimationFrame`?
- Чем `setImmediate` отличается от `setTimeout(0)` в Node.js?
