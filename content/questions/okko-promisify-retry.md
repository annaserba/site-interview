---
id: okko-promisify-retry
title: Оберните callback API в Promise и добавьте ограниченные повторные попытки
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Okko"]
level: Senior
stage: Live coding
tags: ["Promise", "Retry", "Backoff"]
duration: 30 мин
difficulty: 4
sourceCompany: Okko
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=6aIg-fGUOsY&t=1180s"
---

## Короткий ответ

Создайте Promise, который завершается ровно один раз из callback, корректно ловит синхронный throw и сохраняет нужный `this`. Retry делайте циклом по попыткам, а не рекурсией без контроля; повторяйте только transient-ошибки, используйте exponential backoff с jitter и поддержите AbortSignal. Последняя ошибка должна сохранять причину и число попыток.

## Контекст

Задача проверяет Promise control flow и production-политику повторов.

## Код из интервью

```ts
declare function authenticate(
  callback: (error: Error | null, token?: string) => void,
): void

async function authenticateWithRetry(maxAttempts = 3): Promise<string> {
  // Оберните callback API в Promise и добавьте retry.
}
```

## Как строить ответ

### Адаптер

Нормализовать callback success/error в resolve/reject.

### Политика

Max attempts, retryable predicate, delay и jitter.

### Отмена

AbortSignal, cleanup timer и исходная ошибка.

## Частые ошибки

- Повторять 4xx и validation errors.
- Делать бесконечный retry.
- Не очищать таймер при отмене.

## Дополнительные вопросы

- Когда retry опасен для POST?
- Как избежать thundering herd?
