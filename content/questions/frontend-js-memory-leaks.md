---
id: frontend-js-memory-leaks
title: Почему возникают утечки памяти в JavaScript и как их искать?
category: Browser Performance
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Backend-разработчик"]
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

## Частые ошибки

- Искать утечку только по Task Manager.
- Обнулять переменные без поиска root.
- Забывать cleanup при error path.

## Дополнительные вопросы

- Что такое detached DOM tree?
- Как найти утечку React-компонента?

