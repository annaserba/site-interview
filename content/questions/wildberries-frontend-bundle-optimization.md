---
id: wildberries-frontend-bundle-optimization
title: Как оптимизируете bundle size в React-приложении?
category: Frontend
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Wildberries"]
level: Senior
stage: Техническое
tags: ["React", "Performance", "Bundle"]
duration: 15 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Code splitting, tree shaking, lazy loading, compression. Важно: measure, не guess.

## Контекст

Интервьюер хочет понять ваш подход к оптимизации bundle.

## Как строить ответ

### Code Splitting

React.lazy, dynamic imports, route-based.

### Tree Shaking

ES modules, side effects, dead code elimination.

### Lazy Loading

Images, components, routes.

### Measurement

Bundle analyzer, lighthouse, source-map-explorer.

## Пример ответа

Code splitting: routes, heavy components. Tree shaking: ES modules, lodash-es. Lazy loading: images, below fold. Measurement: webpack-bundle-analyzer. Результат: bundle уменьшился с 500KB до 150KB (gzipped).

## Частые ошибки

- Not measuring
- Not using tree shaking
- Importing entire libraries
- Not code splitting

## Дополнительные вопросы

- Каканализируете bundle?
- Какtree shake-аете libraries?
- Какlazy load-ите images?
