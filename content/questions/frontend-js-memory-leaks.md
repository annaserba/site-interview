---
id: frontend-js-memory-leaks
title: Почему возникают утечки памяти в JavaScript и как их искать?
category: Browser Performance
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Backend"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Memory Leak", "Heap Snapshot", "Cleanup"]
duration: 20 мин
difficulty: 5
sourceCompany: Frontend-интервью
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=ylVbg-ftFTQ&t=2571s"
---

## Короткий ответ

Утечка — объект больше не нужен приложению, но остаётся достижимым. Типичные retainers: listeners, timers, subscriptions, detached DOM, unbounded cache, closure и незавершённые async-операции. Воспроизведите цикл mount/use/unmount, принудительно снимите несколько heap snapshots, сравните retained objects и пройдите retaining path до root. Исправление должно закрывать lifecycle и ограничивать рост структуры.

## Контекст

Проверяется практическая диагностика памяти.

## Как строить ответ

### Воспроизвести

Стабильный пользовательский цикл и контрольная точка после GC.

### Найти retainer

Snapshot diff, dominator tree и retaining path.

### Исправить lifecycle

Cleanup, AbortSignal, bounded cache и удаление ссылок.


## Код из интервью

```typescript
// Типичные утечки памяти в React

// 1. Неочищенный listener
useEffect(() => {
  const handler = () => {};
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}, []);

// 2. Неотменённый таймер
useEffect(() => {
  const id = setInterval(() => {}, 1000);
  return () => clearInterval(id);
}, []);
```

## Пример ответа

Утечки памяти в JavaScript возникают, когда объекты больше не используются, но GC не может их удалить из-за ссылок. Типичные причины: забытые event listeners, забытые таймеры, замыкания, захватывающие ссылки на DOM-элементы, забытые подписки (WebSocket), глобальные массивы, которые растут. Поиск: Chrome DevTools → Memory → Allocation instrumentation. Пример:

```javascript
useEffect(() => {
  const handler = () => {...};
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

WeakRef и WeakMap позволяют GC удалять объекты, даже если на них есть ссылки в этих структурах.

## Частые ошибки

- Искать утечку только по Task Manager.
- Обнулять переменные без поиска root.
- Забывать cleanup при error path.

## Дополнительные вопросы

- Что такое detached DOM tree?
- Как найти утечку React-компонента?

