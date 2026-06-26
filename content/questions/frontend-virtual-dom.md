---
id: frontend-virtual-dom
title: Что такое Virtual DOM?
category: React
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["React", "Reconciliation", "Rendering"]
duration: 12 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
sourceVideos: [{"company":"Гознак","url":"https://www.youtube.com/watch?v=Egvch4SA998&t=887s"}]
---

## Короткий ответ

Virtual DOM — разговорное название дерева React elements и текущего Fiber tree, используемых для вычисления следующего UI. При render React строит описание, reconciliation сопоставляет элементы по type и key, а commit применяет минимально необходимые изменения к DOM и запускает effects. Это модель декларативного обновления и scheduling, а не гарантия, что React всегда быстрее ручного DOM.

## Контекст

Senior-ответ должен разделять render, reconciliation и commit и объяснять сохранение состояния.

## Как строить ответ

### Описать фазы

Render вычисляет следующее дерево и может быть прерван; commit синхронно меняет host tree и выполняет layout effects.

### Объяснить identity

State сохраняется, когда element type и позиция или key совпадают. Нестабильный key приводит к remount и потере состояния.

### Обсудить производительность

Стоимость создают лишние renders, тяжёлые вычисления и большие commits; профилируйте до применения memoization.


## Код из интервью

```typescript
// React Virtual DOM: render → reconciliation → commit
import { useState } from 'react';

// Render phase: builds virtual tree (can be interrupted in Concurrent Mode)
function List({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={item}>{item}</li>  {/* key helps diffing algorithm */}
      ))}
    </ul>
  );
}

// State preserved when type and key match across renders
function App() {
  const [show, setShow] = useState(true);

  return (
    <>
      {show && <Counter />}       {/* remounts when toggled */}
      <button onClick={() => setShow(s => !s)}>Toggle</button>
    </>
  );
}

// Concurrency: React can interrupt this render for urgent updates
function HeavyList({ data }: { data: number[] }) {
  return data.map(n => <div key={n}>{n}</div>);
}
```

## Пример ответа

Virtual DOM (VDOM) — это lightweight-представление реального DOM в виде JavaScript-объектов. React создаёт VDOM-дерево, сравнивает (reconciliation) с предыдущим через алгоритм diffing, и применяет минимальные изменения к реальному DOM (commit phase). Преимущество: вместо перерисовки всего DOM, React обновляет только изменившиеся узлы. key в списках помогает алгоритму diffing идентифицировать элементы. Альтернативы: Svelte компилирует шаблоны в прямые DOM-обновления (без VDOM overhead), Vue использует реактивную систему с VDOM. В React 18 Concurrent Mode позволяет прерывать рендер для обработки более приоритетных обновлений.

## Частые ошибки

- Называть Virtual DOM полной копией DOM.
- Считать каждый render изменением DOM.
- Использовать индекс массива как key для изменяемого списка.

## Дополнительные вопросы

- Когда React сохраняет state компонента?
- Чем render отличается от commit?
- Когда `memo` не помогает?
