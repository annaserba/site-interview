---
id: it-one-event-loop-queues
title: Какие дополнительные очереди существуют в Event Loop помимо микро- и макрозадач?
category: JavaScript
scope: language-specific
languages: ["JavaScript"]
roles: ["Frontend"]
companies: ["IT One"]
level: Middle
stage: Техническое
tags: ["Event Loop", "Microtasks", "Macrotasks", "Rendering", "Browser"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Помимо очередей микро- и макрозадач в Event Loop существуют: очередь рендеринга (rendering queue) для `requestAnimationFrame`, очередь микротасок для `queueMicrotask` и `Promise.then`, а также отдельные очереди для `requestIdleCallback`, `MessageChannel` и `scheduler.yield()`. Браузер также имеет внутренние очереди для обработки событий ввода, таймеров и сетевых ответов.

## Контекст

Интервьюер проверяет глубокое понимание планировщика задач браузера: знание не только базовых микро/макро задач, но и механизмов приоритизации, рендеринга и кооперативной планировки. Ожидается объяснение порядка выполнения и practical use-case для каждого типа очереди.

## Как строить ответ

### Перечислить все типы очередей

Назовите: microtasks (Promise, queueMicrotask), macrotasks (setTimeout, setInterval, I/O), rendering (requestAnimationFrame), idle (requestIdleCallback), MessageChannel, scheduler.yield().

### Объяснить приоритет执行

microtasks выполняются ПЕРЕД каждой макрозадачей и ПЕРЕД рендерингом. Рендеринг происходит ПОСЛЕ очереди микро- и макрозадач, но ДО следующей макрозадачи. scheduler.yield() даёт браузеру возможность отрисовать кадр.

### Показать practical сценарии

requestAnimationFrame для анимаций (синхронизация с частотой экрана), requestIdleCallback для фоновых задач (аналитика, prefetch), MessageChannel для bypass setTimeout(fn, 0).

### Разобрать edge cases

Microtask starvation: бесконечный цикл микро-тасок блокирует рендер. Приоритет scheduler.yield() vs setTimeout(0). Как React использует планировщик для batch updates.

## Код из интервью

```javascript
// Порядок выполнения всех типов очередей
console.log('1. Синхронный код');

setTimeout(() => console.log('2. Макрозадача (setTimeout)'), 0);

Promise.resolve().then(() => {
  console.log('3. Микрозадача (Promise)');
  queueMicrotask(() => console.log('4. Микрозадача (queueMicrotask)'));
});

requestAnimationFrame(() => console.log('5. Рендеринг (rAF)'));

requestIdleCallback(() => console.log('6. Idle (requestIdleCallback)'));

MessageChannel.port2.onmessage = () => console.log('7. MessageChannel');
MessageChannel.port1.postMessage('ping');

// Порядок вывода:
// 1 → 3 → 4 → 2 → 5 → 7 → 6
// Microtasks (3,4) ПЕРЕД macrotask (2)
// rAF (5) ПОСЛЕ macrotask, ПЕРЕД следующей итерацией
// MessageChannel (7) — macrotask, но быстрее setTimeout
// requestIdleCallback (6) — ПОСЛЕ рендеринга и idle time

// Microtask starvation — опасный паттерн
function starve() {
  Promise.resolve().then(starve); // бесконечные microtasks
  // Браузер НИКОГДА не дорендерит кадр!
}
```

## Пример ответа

Помимо базовых микро- и макрозадач, в Event Loop есть несколько дополнительных очередей. Во-первых, это очередь рендеринга — `requestAnimationFrame` выполняется между макрозадачами и перед тем, как браузер отрисует кадр. Это критично для анимаций: код в rAF синхронизирован с частотой обновления экрана (60/120 Hz).

Во-вторых, есть `requestIdleCallback` — выполняется только в idle-время после рендеринга. Подходит для фоновых задач: аналитика, prefetch данных, логирование. В-третьих, `MessageChannel` — позволяет создать макрозадачу быстрее, чем `setTimeout(0)`, потому что пропускает задержку таймера (минимум 4ms).

В-четвёртых, modern API: `scheduler.yield()` (W3C) — даёт кооперативную планировку, позволяя тяжёлым задачам yieldить контроль браузеру для рендеринга. React использует аналогичный механизм в Concurrent Mode через `startTransition`.

Важный edge case: microtask starvation — если бесконечно создавать микро-задачи, браузер никогда не дорендерит кадр и UI зависает.

## Частые ошибки

- Считать, что `setTimeout(fn, 0)` выполняется сразу — на самом деле минимум 4ms задержки.
- Забывать, что microtasks выполняются перед КАЖДОЙ макрозадачей, а не только перед следующей итерацией цикла.
- Не знать про `requestIdleCallback` и его отличие от `requestAnimationFrame`.
- Использовать `setTimeout(0)` для быстрой макрозадачи — `MessageChannel` или `scheduler.yield()` быстрее.
- Не учитывать microtask starvation при проектировании асинхронного кода.

## Дополнительные вопросы

- Чем `scheduler.yield()` отличается от `setTimeout(0)` и когда что использовать?
- Как React использует планировщик задач для приоритизации обновлений?
- Что произойдёт, если в `requestIdleCallback` запустить долгую синхронную операцию?
- Как работает batching обновлений в React 18+ в контексте Event Loop?
