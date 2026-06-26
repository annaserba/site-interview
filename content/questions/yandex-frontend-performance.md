---
id: yandex-frontend-performance
title: Как оптимизировать производительность React-приложения?
category: Frontend
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Яндекс"]
level: Senior
stage: Техническое
tags: ["React", "Performance", "Optimization"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Memo, useMemo, useCallback, virtualization, code splitting, lazy loading. Важно: profiling, measurement, not premature optimization.

## Контекст

Интервьюер хочет понять ваш опыт оптимизации React-приложений.

## Как строить ответ

### Memoization

Когда использовать: React.memo, useMemo, useCallback.

### Virtualization

Для длинных списков: react-window, react-virtualized.

### Code Splitting

Lazy loading: React.lazy, Suspense, dynamic imports.

### Profiling

Инструменты: React DevTools, Chrome DevTools, Lighthouse.

## Пример ответа

Memo: обернуть expensive components. useMemo для expensive calculations. useCallback для event handlers. Virtualization для списков >1000 элементов. Code splitting для routes. Результат: FCP улучшился с 3.2с до 1.1с, LCP с 4.5с до 2.1с.

## Частые ошибки

- Premature optimization
- Не использовать memo
- Не virtualize-ить длинные списки
- Не профилировать перед оптимизацией

## Дополнительные вопросы

- Как profiling-аете React-приложения?
- Как оптимизируете re-renders?
- Как уменьшаете bundle size?
