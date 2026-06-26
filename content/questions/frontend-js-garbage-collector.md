---
id: frontend-js-garbage-collector
title: Как работает сборщик мусора в JavaScript?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Garbage Collection", "Memory", "Mark and sweep"]
duration: 15 мин
difficulty: 4
sourceCompany: Frontend-интервью
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=ylVbg-ftFTQ&t=2515s"
---

## Короткий ответ

Современные движки определяют достижимость от roots и освобождают недостижимые объекты; базовая модель — tracing mark-and-sweep, а реализация обычно generational и incremental/concurrent. Циклические ссылки не проблема, если цикл недостижим. Разработчик не управляет моментом GC и не должен полагаться на финализацию. Для диагностики используйте heap snapshot, allocation timeline и сравнение retainers.

## Контекст

Проверяется модель памяти, достаточная для анализа утечек.

## Как строить ответ

### Reachability

Roots, object graph и сильные ссылки.

### Оптимизации

Young/old generations, incremental и concurrent phases.

### Инструменты

Heap snapshot, dominators и retaining path.


## Код из интервью

```typescript
// Mark-and-sweep: GC traces from roots, marks reachable, sweeps rest
// Roots: window, global variables, active call stack

// Typical memory leak: forgotten reference
let leak: string[] = [];
function addItem(item: string) {
  leak.push(item); // never released — grows forever
}

// Closure capturing large object
function process() {
  const hugeData = new Array(1_000_000).fill('x');
  return function summarise() {
    // hugeData is retained as long as summarise exists
    return hugeData.length;
  };
}

// Event listener leak
function setup() {
  const handler = () => console.log('clicked');
  button.addEventListener('click', handler);
  // forgot: button.removeEventListener('click', handler)
}

// WeakMap: keys are weakly held, GC can collect them
const cache = new WeakMap<object, string>();
const key = {};
cache.set(key, 'computed');
// when key is unreachable, the entry is GC'd automatically

// Cleanup pattern in React
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  return () => controller.abort(); // cleanup prevents leak
}, []);
```

## Пример ответа

Сборщик мусора в JavaScript использует алгоритм «mark and sweep»: 1) Mark phase — GC проходит от корней (window, global variables) и помечает все достижимые объекты; 2) Sweep phase — удаляет все непомеченные объекты. GC не может удалить объект, пока на него есть ссылка из достижимого места. Типичные утечки: забытые event listeners, забытые таймеры, замыкания, захватывающие большие объекты. На практике я использую Chrome DevTools → Memory → Heap Snapshot для поиска утечек. В React: cleanup в useEffect отписывает listeners и отменяет подписки.

## Частые ошибки

- Считать reference counting основной моделью JS.
- Полагаться на немедленный GC.
- Называть любой рост heap утечкой.

## Дополнительные вопросы

- Для чего WeakMap?
- Может ли цикл объектов утечь?

