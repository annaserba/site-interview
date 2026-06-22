---
id: frontend-typescript-generics
title: Что такое Generics в TypeScript?
category: TypeScript
scope: language-specific
languages: ["TypeScript"]
roles: ["Frontend-разработчик", "Node.js-разработчик"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Generics", "Type inference", "API design"]
duration: 12 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Generics описывают связь между типами входа и выхода без потери конкретики. Полезный generic сохраняет информацию: `first<T>(items: T[]): T | undefined`; если type parameter встречается только один раз, часто достаточно конкретного типа или `unknown`. Ограничения `extends`, defaults, `keyof` и conditional types помогают строить API, но избыточная абстракция ухудшает inference и сообщения об ошибках.

## Контекст

Нужно показать проектирование типобезопасного API, а не только синтаксис `<T>`.

## Как строить ответ

### Показать связь типов

Generic нужен, когда вызывающая сторона определяет тип и этот выбор влияет на несколько позиций сигнатуры.

### Добавить constraint

`T extends { id: string }` разрешает безопасно использовать `id`, сохраняя остальные поля конкретного типа.

### Обсудить границы

Generics стираются в JavaScript, не валидируют API-ответ и не заменяют runtime schema.


## Код из интервью

```typescript
// TypeScript Generics — переиспользование типов

// 1. Обобщённая функция
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// 2. Generic с ограничением
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 3. Generic в интерфейсе
interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}
```

## Пример ответа

Generics позволяют создавать переиспользуемые компоненты с типизацией. Пример:

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const str = identity<string>('hello'); // тип: string
const num = identity(42);              // тип: number (выведен)

interface ApiResponse<T> {
  data: T;
  status: number;
}

const response: ApiResponse<User[]> = await fetch('/api/users');
```

Ограничения: <T extends { id: number }> — T должен иметь свойство id. Utility types: Partial<T>, Pick<T, K>, Omit<T, K>. На практике: generics — основа типизации API-ответов, state management, form libraries. В React: useState<T>, useRef<T>, forwardRef<T>.

## Частые ошибки

- Использовать `<T>` там, где достаточно `unknown`.
- Применять `any` внутри и создавать иллюзию безопасности.
- Строить сложный conditional type без пользы для пользователя API.

## Дополнительные вопросы

- Чем generic отличается от union?
- Когда использовать overload вместо conditional type?
- Как variance проявляется в TypeScript?
