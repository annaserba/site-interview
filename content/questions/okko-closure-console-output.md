---
id: okko-closure-console-output
title: Что выведет код с замыканиями и затенением переменных?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Okko"]
level: Senior
stage: Live coding
tags: ["Closure", "Scope", "Shadowing"]
duration: 20 мин
difficulty: 4
sourceCompany: Okko
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=6aIg-fGUOsY&t=231s"
---

## Короткий ответ

Функция ищет идентификатор по lexical environment, созданному местом объявления, а не местом вызова. Внутренний `let value` затеняет внешний только внутри своего блока; closure хранит ссылку на environment, поэтому видит последующее изменение внешней переменной. Параметр функции создаёт отдельный binding и не меняет внешний `value`.

## Контекст

В интервью показывают несколько вариантов кода и просят назвать вывод и объяснить каждую строку.

## Код из интервью

```js
let value = 10

function outer() {
  let value = 20

  return function inner(step) {
    value += step
    console.log(value)
  }
}

const increment = outer()
increment(1)
increment(2)
console.log(value)

// Что будет выведено и почему?
```

## Как строить ответ

### Нарисовать environments

Global environment, environment `outer` и вызовы `inner`.

### Разделить bindings

Внешний global `value` и захваченный `value` — разные переменные.

### Пройти по строкам

Результат: `21`, `23`, `10`.

## Частые ошибки

- Считать, что `outer` создаётся заново при вызове `increment`.
- Ожидать изменение глобального `value`.
- Говорить, что closure копирует значение `20`.

## Дополнительные вопросы

- Что изменится с двумя вызовами `outer()`?
- Где хранится захваченный environment?
