---
id: tbank-react-virtualization-table
title: "Оптимизируйте таблицу с 100 000 строк в React"
category: React
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик"]
companies: ["Т-Банк"]
level: Middle
stage: Live coding
tags: ["React", "Performance", "Virtual Scrolling", "Table"]
duration: 20 мин
difficulty: 4
sourceType: aggregated
---

## Короткий ответ

Используйте виртуализацию (react-window/react-virtuoso) для рендеринга только видимых строк. Фиксированные заголовки через отдельный контейнер. memo/useMemo для ячеек и вычислений. Сортировка и фильтрация на сервере. Web Workers для тяжёлых вычислений. Debounce для resize и поиска.

## Контекст

Проверяется понимание оптимизации React-приложений: виртуализация, мемоизация, серверная обработка данных. Таблица на 100K строк — типичный кейс для финтех-интерфейсов (история транзакций, отчёты).

## Как строить ответ

### Виртуализация (react-window)

Отрисовываем только видимые строки + overscan. Стандартная высота строки 48px, viewport 600px → рендерим ~15 строк вместо 100K.

```typescript
import { FixedSizeList as List } from 'react-window';

<List
  height={600}
  itemCount={100000}
  itemSize={48}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <TableRow data={data[index]} />
    </div>
  )}
</List>
```

### Фиксированные заголовки

Два отдельных контейнера: один для заголовков (overflow: hidden), другой для строк (overflow: auto). Синхронизация скролла через refs.

```typescript
const headerRef = useRef<HTMLDivElement>(null);
const bodyRef = useRef<HTMLDivElement>(null);

const onScroll = () => {
  if (headerRef.current && bodyRef.current) {
    headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
  }
};
```

### memo/useMemo для ячеек

Каждая ячейка — отдельный компонент с memo. Вычисления (форматирование, суммы) через useMemo.

```typescript
const TableCell = memo(({ value, format }: Props) => {
  const formatted = useMemo(() => format(value), [value, format]);
  return <td>{formatted}</td>;
});
```

### Серверная сортировка/фильтрация

Не загружайте все 100K клиент. Параметры пагинации, сортировки и фильтрации — в query string. Ответ: { data: rows[], total: number }.

### Web Workers для вычислений

Агрегации (sum, group by) на большом массиве — в Web Worker, чтобы не блокировать main thread.

## Код из интервью

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualTable({ data }: { data: Row[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: virtualRow.start,
              height: virtualRow.size,
              width: '100%',
            }}
          >
            <TableRow row={data[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Пример ответа

Для таблицы с 100K строк нужно решить три проблемы: рендеринг, производительность, данные.

**Рендеринг** — виртуализация через react-window или @tanstack/react-virtual. Рендерим только видимые 15-20 строк + overscan. Для фиксированных заголовков — два контейнера с синхронизацией scrollLeft.

**Производительность** — мемоизация: React.memo для строк и ячеек, useMemo для форматирования и вычислений. Для сортировки/фильтрации на клиенте — useCallback для обработчиков, виртуализированный список с `itemKey`.

**Данные** — серверная пагинация (keyset pagination предпочтительнее offset для производительности), сортировка и фильтрация на бэкенде. Клиент отправляет query params, получает страницу.

Дополнительно: debounce для resize (чтобы пересчитывать virtualizer), Web Workers для client-side агрегаций если они нужны, intersection observer для lazy loading изображений в ячейках.

## Частые ошибки

- Рендерить все строки без виртуализации — React не справится с 100K DOM-узлов.
- Не мемоизировать ячейки — каждый re-render перерисовывает всё.
- Загружать все данные на клиент — memory leak и медленная загрузка.
- Использовать index массива как key при сортировке — баги с состоянием.

## Дополнительные вопросы

- Как реализовать column resizing в виртуализированной таблице?
- Как обработать copy/paste из таблицы?
- Как добавить keyboard navigation по ячейкам?
