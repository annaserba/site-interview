---
id: yandex-debounce-throttle
title: Реализуйте debounce и throttle с нуля
aliases: []
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик"]
companies: ["Яндекс"]
level: Middle
stage: Live coding
tags: ["JavaScript", "Debounce", "Throttle", "Performance"]
duration: 15 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Debounce откладывает вызов функции до тех пор, пока не пройдёт заданная пауза после последнего вызова. Throttle ограничивает частоту вызова функции — она выполняется не чаще одного раза в указанный интервал. Обе функции используют closure для хранения timer ID и замыкают переданную функцию.

## Контекст

Интервьюер проверяет понимание работы с таймерами, closure в JavaScript и умение писать переиспользуемые утилиты. Ожидается чёткое различие между debounce и throttle, а также обработка edge cases (cancel, leading/trailing, this и arguments).

## Как строить ответ

### Разница между debounce и throttle

Debounce ждёт «паузы» в вызовах — если функция вызывается каждые 100мс с timeout 300мс, она выполнится только один раз через 300мс после последнего вызова. Throttle выполняет функцию регулярно — например, не чаще раза в 200мс, даже если вызовы идут каждые 10мс.

### Leading vs trailing edge

Leading — вызов происходит в начале интервала (первый вызов сразу, потом пауза). Trailing — вызов в конце интервала (последний вызов после паузы). Можно комбинировать: leading + trailing даёт вызов и в начале, и в конце.

### Реализация debounce

Используем closure для хранения timer ID. При каждом вызове очищаем предыдущий таймер и устанавливаем новый. Передаём this и arguments через.apply(). Добавляем методы cancel и flush.

### Реализация throttle

Через timeout — устанавливаем флаг и таймер. Через trailing — вызываем функцию по таймеру. Leading + trailing комбинируются: вызов сразу + отложенный вызов в конце интервала.

### Применение

Debounce: поиск (input), ресайз окна, валидация полей. Throttle: скролл, movimiento мыши, обработка событий на высокой частоте.

## Код из интервью

```javascript
// Debounce
function debounce(fn, delay, options = {}) {
  let timer = null;
  let lastArgs = null;
  const { leading = false, trailing = true } = options;

  function debounced(...args) {
    const isFirstCall = !timer && leading;
    lastArgs = args;

    if (timer) clearTimeout(timer);

    if (isFirstCall) {
      fn.apply(this, lastArgs);
    }

    timer = setTimeout(() => {
      if (trailing && lastArgs) {
        fn.apply(this, lastArgs);
      }
      timer = null;
      lastArgs = null;
    }, delay);
  }

  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
    lastArgs = null;
  };

  return debounced;
}

// Throttle
function throttle(fn, interval, options = {}) {
  let lastTime = 0;
  let timer = null;
  const { leading = true, trailing = true } = options;

  function throttled(...args) {
    const now = Date.now();
    const isLeading = leading && now - lastTime >= interval;

    if (isLeading) {
      lastTime = now;
      fn.apply(this, args);
    }

    if (!timer && trailing) {
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer = null;
        fn.apply(this, args);
      }, interval - (now - lastTime));
    }
  }

  throttled.cancel = () => {
    clearTimeout(timer);
    timer = null;
    lastTime = 0;
  };

  return throttled;
}
```

## Пример ответа

Давайте начнём с debounce. При каждом вызове мы очищаем предыдущий таймер и ставим новый. Функция выполнится только когда вызовы прекратятся на delay миллисекунд. Closure хранит timer ID и последние аргументы.

Для throttle используем подход с флагом и таймером. Если прошёл интервал с последнего вызова — вызываем сразу (leading). Если нет — ставим таймер на оставшееся время (trailing). Это гарантирует вызов и в начале, и в конце интервала.

Важно: оба метода сохраняют контекст вызова через .apply(this, args) и поддерживают отмену через .cancel(). В реальных проектах lodashrottle/lodash.debounce покрывают更多 edge cases, но понимание реализации с нуля — это must have.

## Частые ошибки

- Забывать про this и arguments — вызов fn() вместо fn.apply(this, args) ломает контекст.
- Не очищать предыдущий таймер в debounce — функция вызовется несколько раз.
- Путать debounce и throttle — debounce ждёт паузу, throttle ограничивает частоту.
- Не обрабатывать cancel — таймер продолжит работать даже после unmount компонента.

## Дополнительные вопросы

- В чём разница между requestAnimationFrame и throttle для обработки скролла?
- Как реализовать debounce с immediate (вызов в начале, а не в конце)?
- Что такое debounce с flush — когда это нужно?
- Как debounce/throttle влияют на React-компоненты и когда использовать useMemo/useCallback вместо них?
