---
id: react-performance-optimization
title: Как оптимизировать производительность в React?
category: React
scope: universal
languages: ["React"]
roles: ["Frontend"]
companies: []
level: Senior
stage: Техническое
tags: ["React", "Performance", "Memoization", "Optimization"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Инструменты: React.memo (мемоизация компонентов), useMemo (мемоизация значений), useCallback (мемоизация функций), lazy + Suspense (ленивая загрузка), виртуализация списков, избежание лишних рендеров, Profiler для анализа.

## Контекст

Интервьюер проверяет знание техник оптимизации React-приложений.

## Как строить ответ

### React.memo

HOC, который мемоизирует компонент. Сравнивает пропсы. Используйте когда компонент рендерится часто с одними и теми же пропсами.

### useMemo / useCallback

useMemo кеширует значение, useCallback — функцию. Не злоупотребляйте — у них есть стоимость.

### Lazy Loading

React.lazy() + Suspense для динамического импорта компонентов. Уменьшает начальный бандл.

### Virtualization

Рендерит только видимые элементы списка. Библиотеки: react-window, react-virtualized.

## Пример ответа

Оптимизация React: 1) React.memo — пропускает ре-рендер если пропсы не изменились. 2) useMemo — кеширует вычисления между рендерами. 3) useCallback — кеширует ссылку на функцию (важно для передачи в дочерние компоненты). 4) Lazy loading — React.lazy + Suspense для код-сплиттинга. 5) Virtualization — react-window для длинных списков. 6) Profiler для поиска узких мест.

## Частые ошибки

- Злоупотреблять useMemo/useCallback — они не бесплатны
- Использовать React.memo без useCallback для функций-пропсов
- Не использовать key в списках
- Рендерить большие списки без виртуализации

## Дополнительные вопросы

- Когда НЕ нужно использовать useMemo?
- Что такое React DevTools Profiler?
- Как работает shouldComponentUpdate?
- Что такое code splitting?