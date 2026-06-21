---
id: goznak-promise-from-scratch
title: Как реализовать Promise без встроенного Promise?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Гознак"]
level: Senior
stage: Техническое
tags: ["Promise", "Microtask", "Thenable"]
duration: 25 мин
difficulty: 5
sourceCompany: Гознак
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=Egvch4SA998&t=2422s"
---

## Короткий ответ

Минимальная модель хранит `pending/fulfilled/rejected`, неизменяемый settled result и очередь handlers. `then` всегда возвращает новый promise; обработчик выполняется асинхронно, его значение проходит resolution procedure: thenable нужно безопасно ассимилировать, исключение — превратить в rejection, self-resolution — запретить. Реализация Promises/A+ не равна нескольким callback: важны chaining и точное распространение ошибок.

## Контекст

Проверяется понимание контракта Promise изнутри.

## Код из интервью

```ts
class MyPromise<T> {
  constructor(
    executor: (
      resolve: (value: T) => void,
      reject: (reason: unknown) => void,
    ) => void,
  ) {}

  then<TResult>(
    onFulfilled: (value: T) => TResult | MyPromise<TResult>,
  ): MyPromise<TResult> {
    // Реализуйте state machine и chaining.
  }
}
```

## Как строить ответ

### State machine

Однократный переход из pending и очередь реакций.

### Chaining

Новый Promise для каждого `then` и propagation пропущенного handler.

### Resolution

Thenable assimilation, исключения и cycle detection.

## Частые ошибки

- Вызывать handlers синхронно.
- Возвращать текущий Promise из `then`.
- Не защищаться от thenable, вызывающего оба callback.

## Дополнительные вопросы

- Чем Promises/A+ отличается от native Promise?
- Как запланировать microtask без Promise?
