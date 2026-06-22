---
id: tbank-typescript-type-guards
title: Что такое type guards и как narrowing работает в TypeScript?
category: TypeScript
scope: language-specific
languages: ["TypeScript"]
roles: ["Frontend-разработчик"]
companies: ["Т-Банк"]
level: Middle
stage: Техническое
tags: ["TypeScript", "Type Guards", "Narrowing", "Discriminated Unions"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Type guard — это выражение, которое TypeScript использует для узкого определения (narrowing) типа в определённом scope. Встроенные guards: typeof, instanceof, in, Array.isArray. Пользовательские type guard — это функции с возвращаемым типом `x is Type`, а assertion functions — `asserts x is Type`. Discriminated unions — паттерн с общим литеральным полем для автоматического narrowing.

## Контекст

Проверяется понимание системы типов TypeScript и способов безопасной работы с union типами в runtime.

## Как строить ответ

### Назвать встроенные guards

typeof для примитивов, instanceof для классов, in для проверки свойств, Array.isArray для массивов.

### Показать discriminated union

Общее поле с литеральным типом (tag, kind, type) позволяет TypeScript автоматически сужать тип в switch/case.

### Показать пользовательский type guard

Функция с `param is Type` — TypeScript доверяет этому утверждению, нужно确保 корректности в runtime.

### Разделить type guard и assertion

Type guard возвращает boolean и безопасен. Assertion (as) — это компиляторный каст, без runtime проверки.


## Код из интервью

```typescript
type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Shape = Circle | Rectangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // TypeScript knows it's string
  }
}
```

## Пример ответа

Type guard — это mechanism для сужения типа в runtime. TypeScript поддерживает 4 встроенных guard: typeof (для примитивов), instanceof (для классов), in (для проверки наличия ключа), Array.isArray. Пример:

```typescript
function handle(input: string | number) {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  return input.toFixed(2);
}
```

Пользовательский type guard — функция, которая возвращает `value is Type`:

```typescript
interface Cat { meow(): void }
interface Dog { bark(): void }

function isCat(animal: Cat | Dog): animal is Cat {
  return "meow" in animal;
}
```

Discriminated union — паттерн с общим полем-дискриминатором (обычно `kind`, `type`, `tag`). TypeScript автоматически сужает тип при проверке этого поля.

## Частые ошибки

- Использовать `as` (assertion) вместо type guard — unsafe cast без runtime проверки.
- Писать type guard, который не соответствует реальной проверке в runtime — TypeScript доверяет утверждению.
- Забывать обрабатывать все варианты union — noImplicitAny и strict mode выявят, но в loose коде это silent bug.
- Путать `in` operator с проверкой типа — `in` проверяет наличие ключа, а не тип значения.


## Дополнительные вопросы

- Чем assertion function (`asserts`) отличается от type guard (`is`)?
- Как работает narrowing с generics и conditional types?
- Зачем нужен discriminated union вместо optional полей?
- Как type guard связан с never типом в exhaustive switch?
