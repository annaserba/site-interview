---
id: frontend-react
title: Что такое React?
category: React
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["React", "UI Architecture", "State"]
duration: 12 мин
difficulty: 3
sourceReports: [{"company":"Т-Банк"}]
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

React — библиотека декларативного построения UI из компонентов. Компонент вычисляет представление из props, state и context; React планирует render, сопоставляет элементы и выполняет commit в host environment. Главная ценность — композиция, однонаправленный поток данных и согласованная модель обновлений. React не определяет маршрутизацию, data fetching, серверную архитектуру или state management целиком.

## Контекст

Senior-кандидат должен объяснить модель React, границы библиотеки и цену абстракции.

## Как строить ответ

### Описать декларативность

Разработчик задаёт желаемый UI для состояния, а не последовательность DOM-операций.

### Разделить состояния

Локальное UI-state держите рядом с компонентом; server state требует кеша, дедупликации, revalidation и обработки гонок.

### Обсудить архитектуру

Границы компонентов выбирайте по ответственности и изменениям, а effects используйте только для синхронизации с внешней системой.


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

React — это JavaScript-библиотека для построения UI на основе компонентов. Ключевые концепции: 1) Компоненты — функции, возвращающие JSX; 2) State — реактивное состояние через useState; 3) Props — данные от родителя к дочернему компоненту; 4) Virtual DOM — абстракция для эффективного обновления DOM; 5) One-way data flow — данные текут сверху вниз. Пример:

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}
```

React использует fiber architecture для приоритизации обновлений. Hooks — способ использования state и side effects в функциональных компонентах. На практике: React — это только view layer, для state management использую Zustand или Redux Toolkit.

## Частые ошибки

- Называть React полноценным framework без оговорки о составе приложения.
- Хранить производные данные в state и синхронизировать effects.
- Оптимизировать каждый render через `memo` без профилирования.

## Дополнительные вопросы

- Что вызывает render компонента?
- Когда нужен effect?
- Чем server state отличается от client state?
