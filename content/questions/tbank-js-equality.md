---
id: tbank-js-equality
title: В чём разница между == и === в JavaScript?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Node.js-разработчик"]
companies: ["Т-Банк"]
level: Senior
stage: Техническое
tags: ["Equality", "Coercion", "Object.is"]
duration: 8 мин
difficulty: 3
sourceCompany: Т-Банк
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

`===` сравнивает без приведения типов, поэтому это безопасный default. `==` выполняет Abstract Equality Comparison: например, `null == undefined`, строки могут преобразоваться в числа, а объекты — в primitive через `valueOf`/`toString`. Объекты в обоих случаях сравниваются по identity. Отдельные края: `NaN !== NaN`, а `0 === -0`; если это важно, используйте `Object.is`, где `Object.is(NaN, NaN)` истинно, а `Object.is(0, -0)` ложно.

## Контекст

Проверяется знание coercion, identity и числовых крайних случаев.

## Как строить ответ

### Дать правило по умолчанию

В прикладном коде использовать `===`, а coercion писать явно.

### Привести показательные примеры

`null == undefined`, `0 == false`, объектные ссылки и `NaN`.

### Упомянуть Object.is

Объяснить отличие на `NaN` и signed zero.


## Код из интервью

```typescript
// Пример использования
const example = () => {
  const state = { loading: false, data: null, error: null };

  return {
    async fetch(url) {
      state.loading = true;
      try {
        const res = await fetch(url);
        state.data = await res.json();
      } catch (err) {
        state.error = err.message;
      } finally {
        state.loading = false;
      }
      return state;
    },
  };
};
```

## Пример ответа

== (loose equality) делает type coercion: '1' == 1 → true (строка → число). === (strict equality) — без coercion: '1' === 1 → false. Примеры:

```javascript
0 == ''      // true (оба → 0)
0 == '0'     // true
false == '0' // true
null == undefined // true
NaN == NaN   // false (!)
```

=== всегда предпочтительнее. Единственное исключение: == null проверяет на null И undefined (value == null → true для null и undefined). Object.is отличается от === для NaN и -0. На практике: всегда ===, Object.is для edge cases.

## Частые ошибки

- Говорить, что `==` просто игнорирует тип.
- Ожидать структурного сравнения объектов.
- Использовать набор выученных примеров без общего алгоритма coercion.

## Дополнительные вопросы

- Почему `[] == false` возвращает true?
- Как корректно сравнивать объекты по значению?

