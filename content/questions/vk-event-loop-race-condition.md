---
id: vk-event-loop-race-condition
title: Предскажите результат кода с гонкой микро- и макрозадач
category: JavaScript
scope: language-specific
languages: ["JavaScript"]
roles: ["Frontend-разработчик"]
companies: ["VK"]
level: Middle
stage: Техническое
tags: ["Event Loop", "Microtasks", "Macrotasks", "Race Condition"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Event loop обрабатывает микро- (Promise.then, queueMicrotask) и макро- (setTimeout, setInterval) задачи в определённом порядке: сначала все микро-затем макро. Между макрозадачами выполняются все накопившиеся микро. requestAnimationFrame выполняется перед рендером, а не как микро-задача.

## Контекст

Интервьюер проверяет понимание порядка выполнения асинхронного кода: микро-задачи (Promise, queueMicrotask) имеют приоритет над макро-задачами (setTimeout). Нужно уметь предсказать вывод кода и объяснить порядок.

## Как строить ответ

### Объяснить фазы event loop

Call stack → Microtask queue (Promise, queueMicrotask) → Rendering (requestAnimationFrame) → Task queue (setTimeout, setInterval).

### Разобрать порядок между микро и макро

После каждого макрособытия выполняются все накопившиеся микро-задачи. Между макро — тоже. Поэтому Promise.then после setTimeout может выполниться до следующего setTimeout.

### Показать microtask starvation

Бесконечный цикл микро-задач блокирует макро — UI зависает, setTimeout не срабатывает.

### Разобрать requestAnimationFrame

Выполняется перед рендером на каждом кадре (~16.6ms), но не является микро-задачей — его нельзя путать с queueMicrotask.

## Код из интервью

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

queueMicrotask(() => console.log('4'));

requestAnimationFrame(() => console.log('5'));

console.log('6');
```

## Пример ответа

Порядок: 1 → 6 → 3 → 4 → 2 → 5.

1 и 6 — синхронный код, выполняется сразу. Затем event loop проверяет microtask queue: Promise.then (3) и queueMicrotask (4) выполняются до макрозадач. setTimeout (2) — макрозадача, выполняется следующей. requestAnimationFrame (5) — перед рендером, после всех задач.

Ключевой момент: Promise.resolve().then и queueMicrotask — это микро-задачи, они выполняются до setTimeout даже если setTimeout был зарегистрирован первым. Это часто сбивает с толку.

## Частые ошибки

- Считать, что setTimeout(fn, 0) выполняется мгновенно — он ставится в очередь макро.
- Путать requestAnimationFrame с queueMicrotask — rAF перед рендером, а не микро-задача.
- Не учитывать, что console.log('6') выполняется синхронно и не ждёт промисов.
- Забывать про microtask starvation — бесконечный Promise.then цикл блокирует все остальное.

## Дополнительные вопросы

- Что такое microtask starvation и как его избежать?
- Как вложенные Promise.then влияют на порядок?
- В чём разница между process.nextTick и queueMicrotask?
- Как requestIdleCallback отличается от requestAnimationFrame по планированию?
