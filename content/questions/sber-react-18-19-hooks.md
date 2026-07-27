---
id: sber-react-18-19-hooks
title: Что нового появилось в React 18 и React 19? Назовите новые хуки.
category: React
scope: universal
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Сбер"]
level: Middle
stage: Техническое
tags: ["React", "Hooks", "React 18", "React 19"]
duration: 10 мин
difficulty: 3
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

React 18: concurrent rendering, automatic batching, createRoot; хуки useTransition, useDeferredValue, useId, useSyncExternalStore, useInsertionEffect. React 19: Actions и form-хуки useActionState, useFormStatus, useOptimistic, хук use(), ref как проп, Server Components, улучшенный Suspense.

## Контекст

Базовая проверка, следит ли кандидат за развитием основного фреймворка.

## Как строить ответ

### React 18 — конкурентность

Concurrent rendering: рендер можно прерывать. Automatic batching — батчинг setState везде, включая промисы и таймауты. createRoot вместо ReactDOM.render.

### Хуки React 18

useTransition — пометить обновление как неurgent; useDeferredValue — отложенное значение для тяжёлых рендеров; useId — стабильные id для SSR; useSyncExternalStore — подписка на внешние сторы; useInsertionEffect — для CSS-in-JS.

### React 19 — Actions

Actions: функции, управляющие pending/error/optimistic состоянием. useActionState — состояние формы по action; useFormStatus — статус формы из дочерних компонентов; useOptimistic — оптимистичные обновления.

### Прочее в React 19

Хук use() — чтение промисов и контекста в рендере, можно условно. ref как обычный проп без forwardRef. Server Components, метаданные документа из компонентов.

## Пример ответа

React 18 принёс конкурентный рендеринг и автоматический батчинг обновлений, плюс хуки: useTransition и useDeferredValue для неблокирующих обновлений UI, useId для стабильных id при SSR, useSyncExternalStore для внешних хранилищ. React 19 сфокусирован на формах и данных: Actions с хуками useActionState, useFormStatus, useOptimistic — они дают pending-состояние и оптимистичные обновления из коробки; хук use() читает промисы и контекст прямо в рендере, причём его можно вызывать условно. Также: ref как проп без forwardRef, Server Components и улучшенный Suspense.

## Частые ошибки

- Путать useTransition и useDeferredValue: первый оборачивает setState, второй — значение
- Называть хуки React 19 частью React 18
- Использовать useOptimistic без отката при ошибке
- Забыть, что concurrent-фичи включаются через createRoot

## Дополнительные вопросы

- Что такое automatic batching и где он работает?
- Чем useTransition отличается от debounce?
- Как use() меняет подход к data fetching?
- Что такое Server Components и чем они не являются?
