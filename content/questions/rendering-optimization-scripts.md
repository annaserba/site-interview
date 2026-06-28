---
id: rendering-optimization-scripts
title: Как оптимизировать рендеринг и обрабатывать скрипты?
category: Browser
scope: universal
languages: []
roles: ["Frontend"]
companies: []
level: Middle
stage: Техническое
tags: ["Performance", "Optimization", "Lazy Loading", "Critical Path"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Оптимизация: async/defer для скриптов, предзагрузка критических ресурсов, lazy loading для изображений, code splitting, минификация CSS/JS, критический CSS inline, Service Worker для кеширования, DNS prefetch, preconnect.

## Контекст

Интервьюер проверяет знание техник оптимизации производительности веб-страниц.

## Как строить ответ

### Async vs Defer

Async загружает и выполняет скрипт немедленно. Defer загружает параллельно, но выполняет после парсинга HTML.

### Lazy Loading

Отложенная загрузка некритичных ресурсов: изображения (loading="lazy"), компоненты (React.lazy), маршруты.

### Critical CSS

Inline критических стилей для быстрого первого рендера, остальные стили загружайте асинхронно.

### Preload и Prefetch

Preload для критичных ресурсов текущей страницы. Prefetch для ресурсов следующих страниц.

## Пример ответа

Для оптимизации рендеринга: 1) Используйте defer для некритичных скриптов — они загрузятся параллельно, но выполнятся после парсинга. 2) Async для критичных скриптов — выполняются сразу после загрузки. 3) Lazy loading для изображений и iframe. 4) Code splitting для уменьшения размера бандла. 5) Critical CSS inline для быстрого первого рендера.

## Частые ошибки

- Использовать async для всех скриптов без разбора
- Не использовать lazy loading для тяжёлых изображений
- Забывать про code splitting
- Не кешировать статические ресурсы

## Дополнительные вопросы

- Что такое Intersection Observer и как он работает с lazy loading?
- Как работает Service Worker для кеширования?
- Что такое code splitting и как его реализовать в React?
- Как измерить производительность загрузки страницы?