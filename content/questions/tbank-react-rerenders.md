---
id: tbank-react-rerenders
title: Что приводит к ререндеру React-компонента и как искать лишние рендеры?
category: React
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Т-Банк"]
level: Senior
stage: Техническое
tags: ["Render", "Reconciliation", "Profiler"]
duration: 15 мин
difficulty: 4
sourceCompany: Т-Банк
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

Компонент планируется к рендеру при обновлении собственного state, изменении context, рендере родителя или обновлении внешнего store через подписку. Render не равен изменению DOM: после вычисления дерева React делает reconciliation и commit только необходимых host-изменений. Оптимизируйте после измерений React Profiler: локализуйте state, стабилизируйте действительно дорогие границы через `memo`, устраняйте широкие context updates и тяжёлые вычисления. `useMemo`/`useCallback` сами стоят памяти и сравнений и не должны применяться механически.

## Контекст

Проверяются модель render/commit и умение профилировать, а не коллекция memo-хаков.

## Как строить ответ

### Назвать триггеры

State, parent render, context и external store subscription.

### Отделить render от commit

Функция может выполниться без изменения DOM.

### Измерить до оптимизации

Profiler, flamegraph, причина commit и стоимость конкретного subtree.


## Код из интервью

```typescript
// Re-render triggers: state, parent render, context change
import { useState, useContext, memo, useMemo, useCallback } from 'react';

// Parent re-renders → child re-renders (no memo)
function Child({ data }: { data: string }) {
  console.log('Child rendered');
  return <div>{data}</div>;
}

// Prevent unnecessary re-renders with memo
const MemoizedChild = memo(({ data }: { data: string }) => {
  console.log('MemoizedChild rendered');
  return <div>{data}</div>;
});

// Stabilize callback props
function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => console.log('clicked'), []);

  // useMemo prevents recomputation on every render
  const sorted = useMemo(() => data.sort(), [data]);

  return (
    <>
      <MemoizedChild data="static" />           {/* won't re-render */}
      <MemoizedChild data={String(count)} />     {/* re-renders on change */}
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </>
  );
}
```

## Пример ответа

Компонент ререндерится при: 1) Обновлении собственного state; 2) Рендере родителя (без React.memo); 3) Изменении context; 4) Обновлении external store. Render ≠ DOM commit: React может вызвать функцию, но reconciliation покажет, что DOM не изменился. Поиск лишних рендеров: 1) React DevTools → Profiler → flamegraph; 2) why-did-you-render библиотека. Оптимизация (после измерений!): 1) React.memo для дорогих компонентов; 2) useMemo для вычислений; 3) useCallback для функций-props; 4) Выносить state ближе к потреблению. Не мемоизируйте всё — memo тоже стоит CPU и памяти.

## Частые ошибки

- Говорить, что изменение любой переменной вызывает ререндер.
- Считать каждый ререндер проблемой.
- Оборачивать всё в memo и callback без измерений.

## Дополнительные вопросы

- Как `key` влияет на сохранение state?
- Почему StrictMode может вызывать повторный render в development?

