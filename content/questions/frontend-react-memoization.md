---
id: frontend-react-memoization
title: Когда использовать React.memo, useMemo и useCallback?
category: React
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["React.memo", "useMemo", "useCallback"]
duration: 15 мин
difficulty: 4
sourceCompany: Frontend-интервью
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=ylVbg-ftFTQ&t=2738s"
---

## Короткий ответ

`React.memo` позволяет пропустить render при равных props, `useMemo` кеширует результат вычисления, `useCallback` — identity функции. Это performance hints, не семантическая гарантия. Применяйте после профилирования, когда render или вычисление заметно дороги и dependencies стабильны. Мемоизация бесполезна, если каждый раз создаются новые object props, context часто меняется или сравнение дороже render.

## Контекст

Проверяется экономическая модель оптимизации React.

## Как строить ответ

### Найти bottleneck

React Profiler и измеримый interaction.

### Стабилизировать границу

Props, callbacks, context split и state colocation.

### Проверить цену

Сравнение, память, complexity и stale dependencies.


## Код из интервью

```typescript
// React.memo + useCallback для предотвращения ре-рендеров
const ExpensiveChild = React.memo(({ onClick, data }) => {
  console.log("Child render");
  return <button onClick={onClick}>{data.label}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // стабильная ссылка

  const data = useMemo(() => ({ label: "Count: " + count }), [count]);

  return <ExpensiveChild onClick={handleClick} data={data} />;
}
```

## Пример ответа

React.memo — HOC, предотвращает ререндер компонента, если props не изменились. useMemo — мемоизирует значение, useCallback — мемоизирует функцию. Когда использовать: 1) React.memo — для компонентов с дорогим рендером; 2) useMemo — для дорогих вычислений; 3) useCallback — для функций, передающихся как props в memo-компоненты. Пример:

```javascript
const MemoizedList = React.memo(({ items, onSelect }) => (
  <ul>{items.map(item => <li key={item.id} onClick={() => onSelect(item.id)}>{item.name}</li>)}</ul>
));

function Parent() {
  const [count, setCount] = useState(0);
  const handleSelect = useCallback((id) => console.log(id), []);
  return <MemoizedList items={items} onSelect={handleSelect} />;
}
```

Не мемоизируйте всё — memo тоже стоит CPU и памяти. Профилируйте через React Profiler перед оптимизацией.

## Частые ошибки

- Оборачивать все callbacks автоматически.
- Использовать useMemo для корректности.
- Игнорировать изменение context.

## Дополнительные вопросы

- Почему memoized component всё равно renderится?
- Что меняет React Compiler?

