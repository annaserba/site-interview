---
id: okko-throttle-debounce
title: Реализуйте debounce и throttle
aliases: ["Реализуйте debounce и throttle", "Чем debounce отличается от throttle?"]
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Okko"]
level: Senior
stage: Live coding
tags: ["Debounce", "Throttle", "Timers", "Performance"]
duration: 25 мин
difficulty: 4
sourceCompany: Okko
sourceType: candidate-report
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

`debounce` откладывает вызов до паузы в событиях: подходит для поиска при вводе, resize после окончания жеста, autosave после остановки печати. `throttle` ограничивает частоту вызова: подходит для scroll/drag/mousemove, где нужны регулярные обновления не чаще заданного интервала. В реализации нужно сохранить `this`, аргументы, timer id, а для production-варианта явно определить leading/trailing поведение и метод cancel.

## Контекст

На live coding проверяют аккуратность с closures, timers, контекстом вызова и edge cases.

## Как строить ответ

### Сначала объяснить различие

Debounce ждёт тишины, throttle пропускает вызовы между разрешёнными окнами.

### Реализовать минимальную версию

Покажите сохранение последних аргументов и вызов через `fn.apply(this, args)`.

### Обсудить production-детали

Leading/trailing, cancel/flush, очистка таймера при unmount и тесты fake timers.

## Код из интервью

```ts
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function debounced(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, delay);
  };
}

export function throttle<T extends (...args: any[]) => void>(fn: T, interval: number) {
  let lastCall = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: ThisParameterType<T>;

  return function throttled(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = interval - (now - lastCall);
    lastArgs = args;
    lastThis = this;

    if (remaining <= 0) {
      if (timer) clearTimeout(timer);
      timer = null;
      lastCall = now;
      fn.apply(lastThis, lastArgs);
      lastArgs = null;
      return;
    }

    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        lastCall = Date.now();
        if (lastArgs) fn.apply(lastThis, lastArgs);
        lastArgs = null;
      }, remaining);
    }
  };
}
```

## Пример ответа

Я оптимизировал поиск товаров: на каждый символ в поле ввода уходил запрос к API, и при быстрой печати сервер захлёбывался. Я обернул обработчик ввода в debounce на 300 мс — теперь запрос уходит только после паузы в печати, и лишние запросы отменяются сами. Для бесконечного скролла ленты карточек я применил throttle на 200 мс — скролл срабатывает сотни раз в секунду, но проверка позиции и подгрузка выполняются не чаще заданного интервала. Я также добавил метод cancel в обе функции, чтобы безопасно очищать таймеры при размонтировании компонента через cleanup в useEffect.

## Частые ошибки

- Терять `this` и последние аргументы.
- Не определять leading/trailing поведение.
- Не очищать таймер при размонтировании компонента.

## Дополнительные вопросы

- Как добавить `cancel` и `flush`?
- Где использовать debounce, а где throttle?
- Как тестировать такую функцию?

