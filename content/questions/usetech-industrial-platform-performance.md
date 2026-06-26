---
id: usetech-industrial-platform-performance
title: Как оптимизировать производительность тяжёлого промышленного UI с таблицами на 100K строк?
category: Browser Performance
scope: universal
languages: ["TypeScript"]
roles: ["Frontend"]
companies: ["Usetech"]
level: Middle
stage: Техническое
tags: ["Performance", "Virtual Scrolling", "DOM", "Optimization"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Виртуализация списков (react-window/react-virtualized) рендерит только видимые строки — вместо 100K DOM-элементов создаёт ~30-50. Lazy loading данных с сервера (пагинация, cursor-based), memo/useMemo для предотвращения лишних re-renders, Web Workers для тяжёлых вычислений (сортировка, фильтрация), debounce/throttle для resize и input обработчиков.

## Контекст

Интервьюер ожидает понимания browser performance, DOM manipulation, виртуализации, memoization, и способов оптимизации тяжёлых UI с большими таблицами.

## Как строить ответ

### Virtual scrolling principles

Вместо рендера 100K строк в DOM — рендерим только видимые (~30-50). `react-window` для простых списков, `react-virtualized` для сложных таблиц с фиксированными заголовками.

### Data loading strategies

Cursor-based pagination вместо offset (производительнее на больших данных). Infinite scroll вместо кнопки "Load more". Pre-fetching следующей страницы.

### Memoization

`React.memo` для компонентов, `useMemo` для вычислений, `useCallback` для обработчиков. Не забывать про dependency arrays.

### Web Workers

Сортировка, фильтрация, парсинг больших JSON — выносим в Worker, чтобы не блокировать main thread.

### Event optimization

Debounce для input/search (300ms), throttle для scroll/resize (16ms = 60fps). `requestAnimationFrame` для DOM updates.

## Код из интервью

```typescript
// Virtual table with react-window
import { FixedSizeList as List } from 'react-window';
import { useMemo, useCallback, memo } from 'react';

interface TableRowProps {
  index: number;
  style: React.CSSProperties;
  data: { rows: Row[] };
}

const TableRow = memo(({ index, style, data }: TableRowProps) => {
  const row = data.rows[index];
  return (
    <div style={style} className="table-row">
      <span>{row.id}</span>
      <span>{row.name}</span>
      <span>{row.value}</span>
    </div>
  );
});

function VirtualTable({ rows }: { rows: Row[] }) {
  const itemData = useMemo(() => ({ rows }), [rows]);

  return (
    <List
      height={600}
      itemCount={rows.length}
      itemSize={35}
      itemData={itemData}
      width="100%"
    >
      {TableRow}
    </List>
  );
}

// Debounced search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Web Worker for heavy computation
// worker.ts
self.onmessage = (e: MessageEvent) => {
  const { data, sortKey, filter } = e.data;
  let result = [...data];
  if (filter) result = result.filter(row => row[filter.key] === filter.value);
  result.sort((a, b) => a[sortKey] - b[sortKey]);
  self.postMessage(result);
};
```

## Пример ответа

Оптимизируя таблицу на 100K строк, я начинаю с виртуализации. React-window рендерит только видимые строки (~30-50 DOM-элементов вместо 100K). Для фиксированных заголовков использую `react-virtualized` с `Table` и `Column`.

Загрузка данных: вместо OFFSET-based пагинации (медленно на больших offset) — cursor-based: `GET /api/data?cursor=abc123&limit=100`. Бесконечный скролл с pre-fetching: когда пользователь доскроллил до 80% списка, загружаем следующую страницу.

Memoization критична: `React.memo` для строк таблицы (перерисовываются только изменённые), `useMemo` для вычисляемых данных (сортировка, фильтрация), `useCallback` для обработчиков кликов. Каждый re-render 100K строк — это ~500ms, memoization сводит к ~5ms.

Тяжёлые вычисления (сортировка по нескольким колонкам, фильтрация regex) выношу в Web Worker. Main thread остаётся отзывчивым, UI не фризит.

Event optimization: `debounce(300ms)` для поискового input, `throttle(16ms)` для scroll-обработчиков, `requestAnimationFrame` для batch DOM updates.

## Частые ошибки

- Рендерить все 100K строк в DOM без виртуализации.
- Не использовать memo/useMemo, вызывая полный re-render при каждом изменении state.
- Блокировать main thread синхронной сортировкой/фильтрацией больших массивов.
- Использовать OFFSET-based пагинацию на больших данных (медленно).
- Не debounce/throttle обработчики scroll и resize, вызывая thousands calls/sec.

## Дополнительные вопросы

- Как обрабатывать selection и keyboard navigation в виртуализированном списке?
- Как оптимизировать таблицу с фиксированными колонками и горизонтальным скроллом?
- Как измерить реальную производительность (Lighthouse, Performance API)?
- Как оптимизировать re-render таблицы с 20+ колонками?
