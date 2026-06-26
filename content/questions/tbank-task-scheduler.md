---
id: tbank-task-scheduler
title: Реализуйте планировщик задач с ограничением параллельных выполнений
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Backend"]
companies: ["Т-Банк"]
level: Middle
stage: Live coding
tags: ["Promises", "Concurrency", "Scheduler", "Async"]
duration: 20 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Планировщик поддерживает очередь задач и пул активных воркеров. При добавлении задачи: если пул не полон — запускаем сразу, иначе добавляем в очередь. При завершении задачи — извлекаем следующую из очереди. Promise.race отслеживает завершение любого из активных промисов. Для ожидания завершения всех задач используется отдельный Promise с resolve-счётчиком.

## Контекст

Проверяется понимание управления асинхронными промисами, конкурентности и построения абстракций над Promise.

## Как строить ответ

### Определить интерфейс

Класс TaskScheduler с методом add(task) и параметром concurrency. Внутри — очередь (массив/очередь) и множество активных задач.

### Показать логику запуска

При add: если active < concurrency — вызываем run(task), иначе queue.push(task). При завершении — dequeue и запуск.

### Реализовать run

run возвращает промис, добавляет его в active, при resolve/reject удаляет из active и вызывает dequeue.

### Показать ожидание всех задач

Отдельный промис, который resolve-ается когда active.size === 0 и очередь пуста.


## Код из интервью

```typescript
class TaskScheduler {
  private queue: Array<() => Promise<any>> = [];
  private active: Set<Promise<any>> = new Set();
  private concurrency: number;

  constructor(concurrency: number) {
    this.concurrency = concurrency;
  }

  add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const wrapped = async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.active.delete(wrapped);
          this.dequeue();
        }
      };

      if (this.active.size < this.concurrency) {
        this.active.add(wrapped());
      } else {
        this.queue.push(wrapped);
      }
    });
  }

  private dequeue() {
    while (this.active.size < this.concurrency && this.queue.length > 0) {
      const next = this.queue.shift()!;
      this.active.add(next());
    }
  }

  async onIdle(): Promise<void> {
    if (this.active.size === 0 && this.queue.length === 0) return;
    await Promise.all([...this.active]);
    return this.onIdle();
  }
}
```

## Пример ответа

TaskScheduler с ограничением concurrency. Ключевые моменты: обёртка над task для отслеживания завершения, удаление из active в finally (гарантируется даже при ошибке), dequeue для запуска следующей задачи.

```javascript
const scheduler = new TaskScheduler(2);
scheduler.add(() => fetch("/api/1"));
scheduler.add(() => fetch("/api/2"));
scheduler.add(() => fetch("/api/3")); // Подождёт, пока не освободится слот
```

Паттерн с Set<Promise> для active задач — удобно для отслеживания и onIdle. Очередь через массив с shift() — достаточно для большинства случаев, для production можно использовать linked list.

## Частые ошибки

- Не удалять задачу из active в finally — при ошибке пул "застревает" и не принимает новые задачи.
- Использовать Promise.all для отслеживания active — при ошибке одной задачи Promise.all отклоняется сразу.
- Забывать про concurrency = 1 — edge case, который ломает многие реализации.
- Не обрабатывать случай, когда задача добавляется во время onIdle.


## Дополнительные вопросы

- Как добавить приоритизацию задач в планировщик?
- Что такое backpressure и как его реализовать?
- Как планировщик ведёт себя при ошибке — retry или drop?
- Чем TaskScheduler отличается от подхода с пулом воркеров (worker_threads)?
