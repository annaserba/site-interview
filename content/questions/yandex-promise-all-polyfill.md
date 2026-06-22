---
id: yandex-promise-all-polyfill
title: Реализуйте Promise.all с нуля
aliases: []
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик"]
companies: ["Яндекс"]
level: Middle
stage: Live coding
tags: ["Promises", "Polyfill", "Async", "Implementation"]
duration: 15 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Promise.all принимает массив промисов и возвращает новый промис, который резолвится массивом результатов в том же порядке. При ошибке одного промиса — отклоняется сразу с этой ошибкой (early rejection). Ключевые моменты: подсчёт завершённых, сохранение порядка, обработка не-промисов, edge case пустого массива.

## Контекст

Интервьюер проверяет глубокое понимание промисов и умение писать polyfill. Ожидается не просто «обернуть в промис», а корректная обработка порядка результатов, контекста, ошибок и edge cases.

## Как строить ответ

### Базовая структура

Функция принимает iterable (массив), возвращает новый Promise. Используем счётчик для отслеживания завершённых промисов. Результаты сохраняем в массив того же размера.

### Подсчёт и сохранение порядка

Создаём массив results той же длины, что и входной. Каждый промис записывает результат по индексу (не push). Счётчик completed++ при каждом resolve. Когда completed === total — resolve главный промис.

### Обработка ошибок

При reject любого промиса — reject всего Promise.all сразу (early rejection). Другие промисы продолжают выполняться, но результат игнорируется. Важно не вызывать resolve повторно.

### Не-промисы в массиве

Если элемент массива не промис (например, число), оборачиваем его в Promise.resolve(). Это совместимость с оригинальным поведением.

### Edge cases

Пустой массив — resolve сразу с []. Один промис — normal behavior. Смешанные промисы и не-промисы. Множественные ошибки — отдаём первую.

## Код из интервью

```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const items = Array.from(promises);
    const results = new Array(items.length);
    let completed = 0;
    let rejected = false;

    if (items.length === 0) {
      resolve(results);
      return;
    }

    items.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (value) => {
          if (rejected) return;
          results[index] = value;
          completed++;
          if (completed === items.length) {
            resolve(results);
          }
        },
        (error) => {
          if (rejected) return;
          rejected = true;
          reject(error);
        }
      );
    });
  });
}
```

## Пример ответа

Мой подход: создаю массив results фиксированной длины и счётчик completed. Каждый элемент оборачиваю в Promise.resolve для совместимости с не-промисами. При resolve записываю результат по индексу и проверяю, все ли завершились. При reject — устанавливаю флаг rejected и отклоняю главный промис.

Ключевой момент: порядок результатов сохраняется за счёт записи по индексу, а не push. Это значит, что даже если промисы завершаются в разном порядке, результаты будут в правильном порядке.

Для early rejection: при ошибке одного промиса — reject сразу, другие продолжают работу, но их результаты игнорируются. Это поведение совпадает с нативным Promise.all.

## Частые ошибки

- Использовать push для результатов — порядок нарушается, если промисы завершаются вразнобой.
- Не обрабатывать не-промисы — если в массиве число или строка, нужно обернуть в Promise.resolve.
- Забывать про edge case пустого массива — Promise.all([]) должен resolve с [].
- Не проверять флаг rejected — возможен двойной resolve/reject при параллельных ошибках.

## Дополнительные вопросы

- В чём разница между Promise.all и Promise.allSettled?
- Как реализовать Promise.all с limit на параллелизм (concurrency control)?
- Что такое Promise.any и как он отличается от Promise.race?
- Как реализовать AbortController для отмены Promise.all?
