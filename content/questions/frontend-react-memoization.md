---
id: frontend-react-memoization
title: Когда использовать React.memo, useMemo и useCallback?
category: React
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["React.memo", "useMemo", "useCallback"]
duration: 15 мин
difficulty: 4
sourceCompany: Frontend-интервью
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=ylVbg-ftFTQ&t=2738s"
---

## Короткий ответ

`React.memo` позволяет пропустить render при равных props, `useMemo` кеширует результат вычисления, `useCallback` — identity функции. Это performance hints, не семантическая гарантия. Применяйте после профилирования, когда render или вычисление заметно дороги и dependencies стабильны. Мемоизация бесполезна, если каждый раз создаются новые object props, context часто меняется или сравнение дороже render.

## Контекст

Проверяется экономическая модель оптимизации React.

## Как строить ответ

### Найти bottleneck

React Profiler и измеримый interaction.

### Стабилизировать границу

Props, callbacks, context split и state colocation.

### Проверить цену

Сравнение, память, complexity и stale dependencies.

## Частые ошибки

- Оборачивать все callbacks автоматически.
- Использовать useMemo для корректности.
- Игнорировать изменение context.

## Дополнительные вопросы

- Почему memoized component всё равно renderится?
- Что меняет React Compiler?

