---
id: goznak-proxy-performance
title: Как Proxy влияет на производительность JavaScript?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Гознак"]
level: Senior
stage: Техническое
tags: ["Proxy", "Performance", "Reactivity"]
duration: 15 мин
difficulty: 4
sourceCompany: Гознак
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=Egvch4SA998&t=2532s"
---

## Короткий ответ

Proxy перехватывает внутренние операции объекта и вызывает traps, поэтому ухудшает возможности JIT для inline caches и specialization. Цена зависит от engine, trap и hot path; универсального множителя нет. В reactive-системе важнее не только стоимость `get`, но число обёрнутых объектов, dependency tracking и лишние updates. Измеряйте на целевом workload и избегайте Proxy в плотных вычислительных циклах.

## Контекст

Вопрос возник при обсуждении реактивности Vue.

## Как строить ответ

### Объяснить механизм

Trap вместо обычного optimized property access.

### Назвать системную цену

Allocation, identity, deep wrapping и tracking dependencies.

### Измерить

Профиль production-сценария на целевых браузерах.


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

Proxy перехватывает операции объекта (get, set, has, deleteProperty), что создаёт overhead. Простой get/set через Proxy медленнее в 2-5 раз. Пример:

```javascript
const target = { x: 1 };
const proxy = new Proxy(target, {
  get(obj, prop) { return obj[prop]; },
  set(obj, prop, value) { obj[prop] = value; return true; }
});

console.time('direct'); for (let i = 0; i < 1e6; i++) target.x; console.timeEnd('direct');
console.time('proxy');  for (let i = 0; i < 1e6; i++) proxy.x;  console.timeEnd('proxy');
// proxy в 3-4 раза медленнее
```

На практике: Proxy используют для реактивности (Vue 3), валидации данных, логирования. Не используют для frequently accessed objects в hot paths. В React: Proxy не используется.

## Частые ошибки

- Приводить устаревший benchmark как закон.
- Считать Proxy всегда недопустимым.
- Забывать про изменение identity.

## Дополнительные вопросы

- Чем Proxy отличается от getter/setter?
- Почему Vue использует Proxy?

