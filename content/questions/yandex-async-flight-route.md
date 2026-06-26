---
id: yandex-async-flight-route
title: Найдите маршрут между городами через асинхронный API
category: Algorithms
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Backend"]
companies: ["Яндекс"]
level: Senior
stage: Live coding
tags: ["Async", "Promises", "Graph", "BFS"]
duration: 40 мин
difficulty: 5
sourceCompany: Яндекс
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=8pRGuvkzK7Y&t=2745s"
---

## Короткий ответ

Рассматривайте города как вершины, а доступные перелёты — как рёбра, получаемые через `await getFlights(city)`. Выполните BFS с массивом-очередью и индексом головы, храните `visited` и только одного предка для каждой вершины. После нахождения цели восстановите путь от конца к началу и разверните его. Получаем O(V + E) по времени и O(V) по памяти без копирования полного маршрута для каждой вершины.

## Контекст

Дана асинхронная функция, возвращающая города, доступные из указанного города. Нужно вернуть Promise с маршрутом от `from` до `to` либо отклонить его, если пути нет. В исходном условии маршрут единственный и циклов нет, но Senior-кандидат не должен строить хрупкое решение вокруг этих упрощений.

## Как строить ответ

### Зафиксировать семантику API

Уточните, как сигнализируется отсутствие перелётов, может ли `getFlights` завершиться ошибкой, нужен ли кратчайший маршрут, разрешены ли циклы и как отменить поиск. Отдельно договоритесь: ошибка транспорта и корректное отсутствие пути — разные результаты.

### Обойти граф без дорогих операций

Положите `from` в массив queue и увеличивайте числовой head вместо `shift()`. Для каждого города дождитесь соседей, пропустите уже посещённые вершины, сразу отметьте новые как visited и запишите `parent.set(next, current)`. Пометка при постановке в очередь предотвращает дубликаты.

### Хранить предков, а не полные пути

Копирование `[...path, next]` для каждой вершины превращает цепочку из V городов в O(V²) памяти и времени. Карта предков хранит O(V) ссылок. Найдя `to`, двигайтесь по parent до `from`, добавляйте города в конец массива и один раз вызовите reverse.

### Управлять асинхронностью осознанно

Последовательный `await` проще, детерминирован и ограничивает нагрузку, но увеличивает latency. Параллельный обход уровня сокращает задержку ценой всплеска запросов; в production используйте ограниченный пул, дедупликацию in-flight запросов, AbortSignal, timeout и общий budget поиска.

### Описать гарантии и сложность

BFS возвращает путь с минимальным числом перелётов в невзвешенном графе. Время — O(V + E) плюс задержки API, память — O(V). Если нужен маршрут с минимальной ценой или временем, BFS недостаточно: потребуется Dijkstra или другая модель весов.


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

Для поиска маршрута между городами через асинхронный API использую BFS с Promise.all:

```javascript
async function findRoute(start, end, api) {
  const queue = [[start]];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const level = queue.length;
    const promises = [];

    for (let i = 0; i < level; i++) {
      const path = queue.shift();
      const current = path[path.length - 1];

      promises.push(
        api.getFlights(current).then(destinations =>
          destinations.filter(d => !visited.has(d)).map(dest => {
            visited.add(dest);
            const newPath = [...path, dest];
            if (dest === end) return newPath;
            queue.push(newPath);
            return null;
          })
        )
      );
    }

    const results = await Promise.all(promises);
    const found = results.flat().find(r => r !== null);
    if (found) return found;
  }

  return null;
}
```

Ключевые моменты: BFS для кратчайшего маршрута, Promise.all для параллельных запросов, Set для посещённых вершин. Важно: обрабатывать ошибки API через .catch(), добавлять timeout через Promise.race.

## Частые ошибки

- Хранить полный маршрут у каждой вершины и получить O(V²) на длинной цепочке.
- Использовать `shift()` как dequeue в большом массиве.
- Отмечать вершину посещённой только при извлечении и многократно ставить её в очередь.
- Запускать неограниченный `Promise.all` по всему фронту графа.
- Смешивать «маршрута нет», сетевую ошибку, timeout и отмену.

## Дополнительные вопросы

- Как ограничить число одновременных вызовов `getFlights`?
- Как найти самый дешёвый, а не самый короткий маршрут?
- Что изменится, если граф содержит циклы и несколько маршрутов?
- Как продолжить поиск после частичного сбоя API?
- Как тестировать решение с контролируемым порядком завершения Promise?
