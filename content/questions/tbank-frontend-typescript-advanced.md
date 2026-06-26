---
id: tbank-frontend-typescript-advanced
title: Как используете продвинутые возможности TypeScript в React?
category: Frontend
scope: language-specific
languages: ["TypeScript"]
roles: ["Frontend"]
companies: ["Т-Банк"]
level: Senior
stage: Техническое
tags: ["TypeScript", "React", "Advanced"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Generics, utility types, discriminated unions, type guards, template literals. Важно: type safety, не escape hatches.

## Контекст

Интервьюер хочет понять глубокое знание TypeScript.

## Как строить ответ

### Generics

Когда использовать: reusable components, hooks.

### Utility Types

Partial, Required, Pick, Omit, Record.

### Discriminated Unions

Для state machines: actions, events.

### Type Guards

is, typeof, instanceof.

## Пример ответа

Generics: `useState<T>`, `useReducer<S, A>`. Utility: `Partial<User>`, `Pick<User, 'name'>`. Discriminated unions: `type Action = Add | Remove`. Type guards: `if (isUser(data))`. Результат: type safety, better DX.

## Частые ошибки

- Using `any`
- Not using generics
- Overcomplicating types
- Not using type guards

## Дополнительные вопросы

- Как типизируете Redux?
- Как типизируете event handlers?
- Как типизируете API responses?
