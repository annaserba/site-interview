---
id: tbank-typescript-generics-api
title: "Спроектируйте типизированный API-клиент с автоматическим выводом типов ответов"
category: TypeScript
scope: language-specific
languages: ["TypeScript"]
roles: ["Frontend"]
companies: ["Т-Банк"]
level: Senior
stage: Live coding
tags: ["TypeScript", "Generics", "API", "Type Inference"]
duration: 20 мин
difficulty: 4
sourceType: aggregated
---

## Короткий ответ

Используйте Template Literal Types для URL, Conditional Types для методов, `infer` для вывода return type и Generic constraints для параметров. Variadic Tuple Types позволяют типизировать произвольные query/path параметры. Результат: вызов `client.get("/users/:id")` автоматически возвращает `User`.

## Контекст

Проверяется глубокое знание TypeScript: generic-и, conditional types, template literals, type inference. Задача — спроектировать API-клиент, где тип ответа выводится из URL и метода.

## Как строить ответ

### Определить структуру API-карты

Создайте тип, маппящий URL + метод на request/response типы:

```typescript
interface ApiMap {
  "GET /users/:id": { response: User };
  "POST /users": { body: CreateUserDto; response: User };
  "GET /payments": { query: PaymentQuery; response: Payment[] };
}
```

### Template Literal Types для URL

Template literals разбирают URL и извлекают path параметры:

```typescript
type ExtractParams<T extends string> =
  T extends `${infer _}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractParams<Rest>]: string }
    : T extends `${infer _}:${infer Param}`
    ? { [K in Param]: string }
    : {};
```

### Conditional Types для методов

Conditional type определяет, есть ли body у запроса:

```typescript
type HasBody<T> = T extends { body: infer B } ? B : never;
type GetResponse<T> = T extends { response: infer R } ? R : never;
```

### Infer для return type

`infer` в return type клиента автоматически выводит тип ответа:

```typescript
type ApiResponse<T extends keyof ApiMap> = GetResponse<ApiMap[T]>;
```

### Variadic Tuple Types для параметров

Для query параметров и path params используем spread tuple types:

```typescript
type QueryParams<T> = T extends { query: infer Q } ? Q : Record<string, string>;
```

## Код из интервью

```typescript
type ApiMap = {
  "GET /users/:id": { response: User };
  "POST /users": { body: CreateUserDto; response: User };
  "GET /payments": { query: PaymentQuery; response: Payment[] };
};

type ExtractParams<S extends string> =
  S extends `${string}:${infer Param}/${infer Rest}`
    ? Record<Param | keyof ExtractParams<Rest>, string>
    : S extends `${string}:${infer Param}`
    ? Record<Param, string>
    : {};

class ApiClient {
  async get<K extends keyof ApiMap>(
    url: K,
    ...args: ExtractParams<K> extends Record<string, never>
      ? []
      : [params: ExtractParams<K>]
  ): Promise<GetResponse<ApiMap[K]>> {
    const [params] = args;
    let path = url as string;
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        path = path.replace(`:${key}`, val);
      }
    }
    const res = await fetch(path);
    return res.json();
  }
}

const client = new ApiClient();
const user = await client.get("/users/:id", { id: "123" });
// user: User — автоматически
```

## Пример ответа

Для типизированного API-клиента нужно связать URL, HTTP-метод и тип ответа в единую систему типов.

Шаг 1 — определяем контракт API:

```typescript
interface ApiMap {
  "GET /users/:id": { response: User };
  "POST /users": { body: CreateUserDto; response: User };
  "GET /payments": { query: PaymentQuery; response: Payment[] };
}
```

Шаг 2 — типизируем метод клиента:

```typescript
class TypedApiClient {
  async get<
    K extends keyof ApiMap,
    P = ExtractParams<K>
  >(
    url: K,
    ...args: P extends Record<string, never> ? [] : [params: P]
  ): Promise<GetResponse<ApiMap[K]>> {
    // ... реализация
  }
}
```

Шаг 3 — клиент автоматически выводит типы:

```typescript
const client = new TypedApiClient();
const user = await client.get("/users/:id", { id: "123" });
// TS знает: user: User

const payments = await client.get("/payments", {
  query: { status: "active", limit: "10" }
});
// TS знает: payments: Payment[]
```

Ключевые механизмы: Template Literal Types парсят URL, `infer` извлекает параметры, Conditional Types опционализируют аргументы.

## Частые ошибки

- Путать `infer` с `extends` — `infer` создаёт новый тип, `extends` проверяет.
- Забывать про optional params — path params обязательны, query может быть пустым.
- Делать клиент слишком абстрактным — сложные типы затрудняют дебаг.

## Дополнительные вопросы

- Как добавить типизацию для headers и interceptors?
- Как типизировать пагинацию в ответе?
- Как обработать ошибки API на уровне типов?
