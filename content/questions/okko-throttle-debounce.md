---
id: okko-throttle-debounce
title: Реализуйте debounce и throttle с leading и trailing вызовами
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик"]
companies: ["Okko"]
level: Senior
stage: Live coding
tags: ["Throttle", "Debounce", "Timers"]
duration: 30 мин
difficulty: 4
sourceCompany: Okko
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=6aIg-fGUOsY&t=1740s"
---

## Короткий ответ

Debounce переносит вызов до паузы, throttle ограничивает частоту в окне. Production-реализация сохраняет последние `this` и arguments, отдельно задаёт leading/trailing, предоставляет `cancel` и `flush`, очищает ссылки после выполнения. Для throttle учитывайте remaining time и планируйте trailing-вызов с последними аргументами; `Date.now()` устойчивее подсчёта числа событий.

## Контекст

Проверяются таймеры, closure и точная семантика крайних случаев.

## Код из интервью

```ts
type AnyFunction = (...args: any[]) => any

function throttle<T extends AnyFunction>(fn: T, delay: number): T {
  // Реализуйте leading-вызов и trailing-вызов
  // с последними аргументами.
}
```

## Как строить ответ

### Зафиксировать контракт

Leading, trailing, return value, cancel и flush.

### Хранить состояние

Timer, lastInvokeTime, lastArgs и lastThis.

### Проверить timeline

Один вызов, burst, вызов на границе и отмена.

## Пример ответа

Debounce: вызывает функцию после того, как прошло N ms с последнего вызова. Throttle: вызывает функцию не чаще чем раз в N ms. Реализация:

```javascript
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function throttle(fn, ms) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}
```

Применения: debounce — search input, resize handler. throttle — scroll handler, mousemove. В React: useCallback + useMemo для стабилизации функции, lodash.throttle/debounce для production.

## Частые ошибки

- Терять последний вызов throttle.
- Удерживать аргументы после завершения.
- Не определить поведение одного события.

## Дополнительные вопросы

- Когда нужен `requestAnimationFrame`?
- Чем debounce отличается от deferred value?
