---
id: frontend-promise
title: Что такое Promise?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Backend"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Promise", "Async", "Error handling"]
duration: 12 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Promise — объект eventual result с состоянием pending, fulfilled или rejected. Executor запускается синхронно, а reactions `then/catch/finally` ставятся в microtask queue. `then` всегда возвращает новый Promise и ассимилирует возвращённый thenable. Promise не отменяет операцию: отмена передаётся отдельно, например через AbortSignal.

## Контекст

Senior-кандидат должен понимать композицию, распространение ошибок, конкурентность и отсутствие встроенной отмены.

## Как строить ответ

### Объяснить цепочку

Возвращённое значение fulfillment-ит следующий Promise, throw или rejected Promise переводит цепочку в rejection.

### Выбрать combinator

`all` — fail-fast для всех результатов, `allSettled` — полный отчёт, `race` — первый settled, `any` — первый fulfilled.

### Контролировать ресурсы

Не запускайте тысячи операций одним `Promise.all`; используйте concurrency limit, timeout, AbortSignal и обработку unhandled rejection.


## Код из интервью

```typescript
// Promise.allSettled — все результаты
const urls = ["/api/users", "/api/posts", "/api/comments"];
const results = await Promise.allSettled(
  urls.map(url => fetch(url).then(r => r.json()))
);

results.forEach((result, i) => {
  if (result.status === "fulfilled") {
    console.log("URL " + i + ": OK", result.value);
  } else {
    console.error("URL " + i + ": FAILED", result.reason);
  }
});
```

## Пример ответа

Promise — это объект, представляющий результат асинхронной операции. Три состояния: pending, fulfilled, rejected. Пример:

```javascript
const fetchData = () => new Promise((resolve, reject) => {
  setTimeout(() => resolve({ data: 42 }), 1000);
});

fetchData()
  .then(result => console.log(result.data))
  .catch(error => console.error(error))
  .finally(() => console.log('done'));
```

Promise chaining: каждый .then() возвращает новый Promise. Promise.all — все промисы параллельно, Promise.race — первый завершившийся. На практике: async/await — синтаксический сахар:

```javascript
async function getData() {
  try {
    const result = await fetchData();
    return result;
  } catch (error) {
    console.error(error);
  }
}
```

Не забывайте .catch() — unhandled rejection может крашнуть приложение.

## Частые ошибки

- Считать Promise отдельным потоком.
- Забывать `return` внутри `then`.
- Полагать, что `Promise.race` отменяет проигравшие операции.

## Дополнительные вопросы

- Когда executor Promise выполняется?
- Чем `all` отличается от `allSettled`?
- Как реализовать ограничение конкурентности?
