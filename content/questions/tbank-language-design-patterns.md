---
id: tbank-language-design-patterns
title: Какие паттерны проектирования вы используете чаще всего?
category: JavaScript
scope: language-specific
languages: ["TypeScript", "JavaScript"]
roles: ["Frontend","Backend"]
companies: ["Т-Банк"]
level: Middle
stage: Язык
tags: ["Design Patterns", "Architecture", "OOP", "Language"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Singleton (конфиг, DI), Factory (создание объектов с вариантами), Observer (события), Strategy (алгоритмы), Adapter (интеграция с legacy). Не засоряйте код паттернами — используйте только когда решаете реальную проблему.

## Контекст

Проверяют знание классических паттернов и понимание, когда они действительно нужны.

## Как строить ответ

### Практические паттерны

Singleton, Factory, Observer, Strategy, Adapter, Decorator.

### Когда НЕ использовать

Over-engineering: паттерн ради паттерна — антипаттерн.

### Примеры из опыта

Покажите реальный case, не просто перечислите.

## Код из интервью

```typescript
// Strategy — разные алгоритмы сортировки
interface SortStrategy<T> {
  sort(items: T[]): T[];
}

class QuickSort<T> implements SortStrategy<T> {
  sort(items: T[]): T[] { /* ... */ }
}

class MergeSort<T> implements SortStrategy<T> {
  sort(items: T[]): T[] { /* ... */ }
}

class Sorter<T> {
  constructor(private strategy: SortStrategy<T>) {}
  sort(items: T[]) { return this.strategy.sort(items); }
}
```

## Пример ответа

Чаще использую: 1) Strategy — для разных алгоритмов (сортировка, валидация), 2) Observer — для событийной системы (WebSocket, UI events), 3) Factory — когда создание объекта зависит от входных данных. Singleton — для конфига, но с осторожностью (тестирование). Не использую паттерн, если он не решает конкретную проблему.

## Частые ошибки

- Использовать Singleton везде
- Factory с 100 подклассами
- Observer без отписки (утечка)
- Декоратор ради красоты

## Дополнительные вопросы

- Что такое Dependency Injection?
- Чем отличается Strategy от State?
- Как рефакторите legacy без паттернов?
