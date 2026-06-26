---
id: sber-main-thread-blocking
title: Как найти и устранить блокировку главного потока браузера?
category: Browser Performance
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Сбер"]
level: Senior
stage: Техническое
tags: ["Long Tasks", "Performance", "Event Loop"]
duration: 20 мин
difficulty: 5
sourceCompany: Сбер
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=C0xSErqNYeU&t=1828s"
---

## Короткий ответ

Замершие input и animation означают, что main thread не отдаёт браузеру возможность обработать кадр. В Chrome Performance найдите Long Tasks, flame chart и initiator, затем подтвердите причину через CPU throttling и production trace. Разбейте CPU-работу на порции с yield, вынесите чистые вычисления в Web Worker, уменьшите объём DOM и прекратите бесконечные цепочки microtask. После исправления сравните INP, long-task duration и dropped frames.

## Контекст

Проверяется диагностика реального frontend-зависания, а не знание одного API.

## Как строить ответ

### Найти источник

Performance trace, Long Tasks, call tree и конкретный пользовательский сценарий.

### Выбрать лечение

Chunking, worker, алгоритмическое улучшение, virtualization или server-side computation.

### Проверить результат

Повторяемый benchmark на слабом устройстве и продуктовые Web Vitals.


## Код из интервью

```javascript
// Пример реализации
function solve(input) {
  const result = {};
  for (const item of input) {
    const key = item.type || "default";
    result[key] = (result[key] || 0) + 1;
  }
  return result;
}

const test = [{ type: "a" }, { type: "b" }, { type: "a" }];
console.log(solve(test)); // { a: 2, b: 1 }
```

## Пример ответа

Для поиска блокировок main thread: 1) Chrome DevTools → Performance → Long Tasks; 2) PerformanceObserver:

```javascript
new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    console.log('Long task:', entry.duration, entry);
  });
}).observe({ entryTypes: ['longtask'] });
```

Типичные причины: тяжёлые вычисления в рендере, синхронные операции (localStorage), большие bundle (без code splitting), layout thrashing. Решения: 1) Web Workers — вычисления в отдельном потоке; 2) Code splitting — React.lazy(), dynamic imports; 3) requestIdleCallback — non-critical work; 4) Virtual scrolling — react-window. На практике: нашёл задачу, блокирующую main thread на 300ms (парсинг JSON 5MB), перенёс в Web Worker — LCP улучшился на 40%.

## Частые ошибки

- Переносить тяжёлую работу в Promise: microtask остаётся на main thread.
- Использовать `requestIdleCallback` для обязательной пользовательской операции.
- Оптимизировать без профиля.

## Дополнительные вопросы

- Чем task отличается от microtask?
- Когда нужен Web Worker?

