---
id: promises-methods
title: Что такое промисы и какие методы они имеют?
category: JavaScript
scope: universal
languages: ["JavaScript"]
roles: ["Frontend", "Backend"]
companies: []
level: Middle
stage: Техническое
tags: ["JavaScript", "Promises", "Async", "Error Handling"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Promise — объект для работы с асинхронными операциями. Состояния: pending → fulfilled/rejected. Методы: then, catch, finally. Статические: Promise.all (все), Promise.allSettled (все с результатами), Promise.race (первый), Promise.any (первый успешный).

## Контекст

Интервьюер проверяет глубокое понимание промисов и их методов для работы с асинхронным кодом.

## Как строить ответ

### Состояния Promise

pending → fulfilled или rejected. Однократное изменение состояния, необратимое.

### then / catch / finally

then возвращает новый промис. catch — это сахар для then(null, fn). finally не принимает аргументов.

### Promise.all vs allSettled

all отклоняется при первом отклонении. allSettled всегда завершается, возвращая статус каждого.

### Promise.race vs any

race — первый завершившийся (успех или ошибка). any — первый успешный, ошибки игнорирует.

## Пример ответа

Promise представляет асинхронную операцию. У него три состояния: pending (ожидание), fulfilled (успех), rejected (ошибка). Методы экземпляра: then(onFulfilled, onRejected) — обработка результата, catch(onRejected) — обработка ошибки, finally() — выполнится всегда. Статические методы: Promise.all([p1, p2]) — ждёт все промисы, Promise.allSettled — ждёт все, включая отклонённые, Promise.race — первый завершившийся, Promise.any — первый успешный.

## Частые ошибки

- Не обрабатывать ошибки в .catch
- Не возвращать промисы в .then (цепочка ломается)
- Использовать Promise.all когда нужен allSettled
- Забывать про .finally для очистки ресурсов

## Дополнительные вопросы

- Что такое Promise chaining?
- Как обработать несколько промисов параллельно?
- Что такое unhandled promise rejection?
- Как реализовать Promise.all с нуля?