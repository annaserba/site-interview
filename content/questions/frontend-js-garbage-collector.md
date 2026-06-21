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

## Частые ошибки

- Считать reference counting основной моделью JS.
- Полагаться на немедленный GC.
- Называть любой рост heap утечкой.

## Дополнительные вопросы

- Для чего WeakMap?
- Может ли цикл объектов утечь?

