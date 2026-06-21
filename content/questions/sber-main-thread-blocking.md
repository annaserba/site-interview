---
id: sber-main-thread-blocking
title: Как найти и устранить блокировку главного потока браузера?
category: Browser Performance
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик"]
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

## Частые ошибки

- Переносить тяжёлую работу в Promise: microtask остаётся на main thread.
- Использовать `requestIdleCallback` для обязательной пользовательской операции.
- Оптимизировать без профиля.

## Дополнительные вопросы

- Чем task отличается от microtask?
- Когда нужен Web Worker?

