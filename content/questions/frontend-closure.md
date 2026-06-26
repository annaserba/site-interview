---
id: frontend-closure
title: Что такое замыкание?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Backend"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Closures", "Scope", "Memory"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
sourceVideos: [{"company":"Okko","url":"https://www.youtube.com/watch?v=6aIg-fGUOsY&t=231s"}]
---

## Короткий ответ

Замыкание — функция вместе с доступом к lexical environment места создания. Она видит bindings, а не снимок их значений, поэтому последующие изменения переменной наблюдаемы. Замыкания дают инкапсуляцию, фабрики и callbacks, но продлевают жизнь достижимых объектов: listener или timer может удерживать большой граф памяти до удаления ссылки.

## Контекст

Senior-ответ должен связать lexical scope с поведением `let` в цикле, состоянием React и утечками памяти.

## Как строить ответ

### Объяснить binding

Функция разрешает имя по лексической цепочке окружений; захватывается переменная, а не сериализованное значение.

### Показать полезный сценарий

Фабрика обработчиков или модульное приватное состояние демонстрируют практическое применение без глобальных переменных.

### Разобрать жизненный цикл

Объект доступен GC, пока достижим через замыкание. Отписывайте listeners, отменяйте timers и не захватывайте лишние большие объекты.


## Код из интервью

```typescript
// Замыкание — инкапсуляция состояния
function createCounter(initial = 0) {
  let count = initial;
  return {
    increment: () => ++count,
    decrement: () => --count,
    get: () => count,
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11

// Stale closure в React
useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // устаревшее значение!
  }, 1000);
  return () => clearInterval(id);
}, []); // dependency array пуст!
```

## Пример ответа

Замыкание — это функция вместе с доступом к lexical environment места создания. Она видит bindings, а не снимок их значений. Пример:

```javascript
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

Внутренняя функция «замыкает» переменную count. Это полезно для инкапсуляции состояния без классов. В React я использую замыкания в хуках useState и useCallback. Старое замыкание (stale closure) — частая проблема: если useEffect захватил устаревшее значение state, нужно использовать ref или dependency array.

## Частые ошибки

- Называть замыканием любую вложенную функцию без объяснения окружения.
- Считать, что захватывается копия значения.
- Объяснять stale closure в React как баг React.

## Дополнительные вопросы

- Почему `var` и `let` по-разному ведут себя в цикле?
- Что такое stale closure в React?
- Как замыкание может вызвать утечку памяти?
