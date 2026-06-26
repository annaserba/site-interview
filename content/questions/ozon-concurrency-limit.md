---
id: ozon-concurrency-limit
title: Ограничьте количество одновременных запросов без потери данных
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Backend"]
companies: ["Ozon"]
level: Middle
stage: Live coding
tags: ["Promises", "Concurrency", "async/await", "Rate Limiting"]
duration: 20 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Реализация через Set.activePromises и Promise.race: добавляем промис в множество, удаляем при завершении, когда active.size >= limit — ждём завершения любого из активных. Все задачи гарантированно выполняются, ошибки обрабатываются per-task.

## Контекст

Live coding задание: написать функцию concurrencyLimit(tasks, limit), которая принимает массив функций, возвращающих промисы, и лимит одновременных запросов. Интервьюер проверяет понимание промисов и асинхронного кода.

## Как строить ответ

### Определить контракт функции

```typescript
function concurrencyLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]>
```

### Реализовать через Set и Promise.race

Храним активные промисы в Set. Для каждой задачи: ждём пока active.size < limit, запускаем, добавляем в Set, по завершении — удаляем.

### Обработать ошибки

Каждая задача должна завершаться независимо — используем .catch() или try/catch внутри, чтобы одна ошибка не остановила остальные.

### Оптимизировать

Можно использовать очередь или worker pool паттерн для переиспользования соединений.

## Код из интервью

```typescript
async function concurrencyLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = [];
  const active = new Set<Promise<void>>();

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const p = task()
      .then((result) => {
        results[i] = result;
      })
      .catch((err) => {
        results[i] = err as T;
      })
      .finally(() => {
        active.delete(p);
      });

    active.add(p);

    if (active.size >= limit) {
      await Promise.race(active);
    }
  }

  await Promise.allSettled(active);
  return results;
}
```

## Пример ответа

Функция использует Set для отслеживания активных промисов. На каждой итерации цикла: добавляем промис в Set, если размер >= limit — ждём завершения любого через Promise.race. При завершении промиса (успешном или нет) он удаляется из Set, освобождая слот.

Ключевой момент: Promise.race срабатывает при первом завершении, и цикл продолжается. Если задача упала — результат сохраняется как ошибка, остальные продолжают выполняться. Это гарантирует, что все задачи будут обработаны.

## Частые ошибки

- Использовать Promise.all вместо Promise.race — все задачи запустятся сразу без лимита.
- Не удалять промис из Set по завершении — лимит никогда не освободится.
- Использовать async/await внутри цикла без учёта лимита — запросы будут последовательными.
- Не сохранять индекс задачи — результаты могут перемешаться.

## Дополнительные вопросы

- Как модифицировать функцию для поддержки отмены задач?
- Как добавить retry с экспоненциальной задержкой?
- В чём разница между this concurrencyLimit и BoundedPromisePool?
- Как обрабатывать таймауты для каждой задачи отдельно?
