---
id: suspense-lazy-loading
title: Что такое Suspense и ленивая загрузка в React?
category: React
scope: universal
languages: ["React"]
roles: ["Frontend"]
companies: []
level: Middle
stage: Техническое
tags: ["React", "Suspense", "Lazy Loading", "Code Splitting"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Suspense — компонент для ожидания асинхронных операций. Lazy Loading — динамический импорт компонентов через React.lazy(). При загрузке отображается fallback. Suspense также поддерживает Data Fetching (React 18+).

## Контекст

Интервьюер проверяет знание современных возможностей React для ленивой загрузки.

## Как строить ответ

### React.lazy()

Создаёт динамический импорт компонента. Возвращает промис с модулем.

### Suspense

Оборачивает lazy-компонент и показывает fallback пока загружается.

### Data Fetching

React 18+ Suspense поддерживает асинхронные данные (через промисы).

### Error Boundary

Комбинируйте с Error Boundary для обработки ошибок загрузки.

## Пример ответа

Suspense позволяет показать fallback пока загружается компонент или данные. React.lazy() создаёт динамический импорт. Пример: const LazyComponent = React.lazy(() => import("./Heavy")); В рендере: <Suspense fallback={<Spinner />}> <LazyComponent /> </Suspense>. При навигации React загрузит Heavy.js только когда понадобится. Suspense также работает с Data Fetching через React 18 Suspense для асинхронных данных.

## Частые ошибки

- Не обрабатывать ошибки загрузки (нет Error Boundary)
- Использовать Suspense без fallback
- Думать, что lazy работает с серверным рендерингом
- Забывать про code splitting при навигации

## Дополнительные вопросы

- Что такое Error Boundary?
- Как работает Suspense с Data Fetching?
- Что такое route-based code splitting?
- Как лениво загрузить данные, а не компонент?