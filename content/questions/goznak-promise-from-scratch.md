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

## Пример ответа

Минимальная реализация Promise:

```javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.handlers = [];

    const resolve = (value) => {
      if (this.state !== 'pending') return;
      this.state = 'fulfilled';
      this.value = value;
      this.handlers.forEach(h => h.onFulfilled(value));
    };

    const reject = (reason) => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.value = reason;
      this.handlers.forEach(h => h.onRejected(reason));
    };

    try { executor(resolve, reject); } catch (e) { reject(e); }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = (callback) => {
        try {
          const result = callback(this.value);
          result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
        } catch (e) { reject(e); }
      };

      if (this.state === 'fulfilled') handle(onFulfilled);
      else if (this.state === 'rejected') handle(onRejected);
      else this.handlers.push({ onFulfilled: () => handle(onFulfilled), onRejected: () => handle(onRejected) });
    });
  }

  catch(onRejected) { return this.then(null, onRejected); }
}
```

Ключевые моменты: state machine, microtask queue (resolve/reject queue handlers asynchronously), thenable chain.

## Частые ошибки

- Вызывать handlers синхронно.
- Возвращать текущий Promise из `then`.
- Не защищаться от thenable, вызывающего оба callback.

## Дополнительные вопросы

- Чем Promises/A+ отличается от native Promise?
- Как запланировать microtask без Promise?
