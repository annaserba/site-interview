---
id: yandex-frontend-state-management
title: Как организовать state management в крупном React-приложении?
category: Frontend
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Яндекс"]
level: Senior
stage: Техническое
tags: ["React", "State Management", "Redux"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Redux Toolkit для глобального состояния, Context для настроек, локальный state для UI. Важно: нормализация, selectors,避免 unnecessary re-renders.

## Контекст

Проверяют понимание организации state в больших приложениях.

## Как строить ответ

### Глобальный state

Redux Toolkit: slices, thunks, selectors.

### Context

Для настроек: theme, locale, auth.

### Локальный state

Для UI: form state, modals.

### Нормализация

createEntityAdapter, normalizr.

## Пример ответа

Глобальный: Redux Toolkit (slices, thunks). Context: theme, locale, auth. Локальный: form state, UI state. Нормализация: createEntityAdapter. Selectors: reselect дляmemoized. Результат: predictable state, easier debugging.

## Частые ошибки

- Too much global state
- Not normalizing
- Not memoizing selectors
- Using Redux для UI state

## Дополнительные вопросы

- Как организуете Redux slices?
- Как используете selectors?
- Какобновляете normalized state?
