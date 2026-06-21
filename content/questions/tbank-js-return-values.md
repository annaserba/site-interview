---
id: tbank-js-return-values
title: Что возвращают функция без return и setTimeout?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Node.js-разработчик"]
companies: ["Т-Банк"]
level: Senior
stage: Техническое
tags: ["Functions", "Timers", "Return value"]
duration: 7 мин
difficulty: 2
sourceCompany: Т-Банк
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

Обычная функция без выполненного `return value` возвращает `undefined`; пустой `return` делает то же самое. `setTimeout` возвращает handle для отмены таймера: в браузере это числовой id, в Node.js — объект `Timeout`, поэтому переносимый TypeScript-тип удобно получать как `ReturnType<typeof setTimeout>`. Handle не является результатом callback и не гарантирует точное время запуска: delay задаёт минимальную задержку до постановки задачи в очередь.

## Контекст

Проверяются базовые контракты функций и различия timer API между средами.

## Как строить ответ

### Разделить два результата

Return функции, return `setTimeout` и return callback — разные значения.

### Учесть runtime

Browser и Node возвращают разные виды handle.

### Объяснить назначение

Handle передают в `clearTimeout`; delay не является расписанием реального времени.

## Частые ошибки

- Считать, что `setTimeout` возвращает Promise.
- Типизировать handle только как `number` в изоморфном коде.
- Ожидать точного запуска через заданное число миллисекунд.

## Дополнительные вопросы

- Что вернёт async-функция без return?
- Почему таймер может сработать заметно позже?

