---
id: tbank-effector-vs-redux
title: "В чём разница между Effector и Redux и когда что выбирать?"
category: React
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Т-Банк"]
level: Middle
stage: Техническое
tags: ["Effector", "Redux", "State Management", "Reactive"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
---

## Короткий ответ

Effector — реактивная библиотека с Stores, Events и Effects, где данные стримятся через pipe/operators; Redux — предсказуемый контейнер с reducers, actions и middleware. Effector проще для сложной бизнес-логики (derived stores, сплошной реактивный граф), Redux — зрелый экосистемой (DevTools, RTK Query). Выбирайте Effector, когда dozens виджетов, сложные зависимости и гонки; Redux — когда нужен стандартный подход и команда familiar с ним.

## Контекст

Проверяется понимание парадигм управления состоянием в SPA и умение обосновать выбор инструмента под конкретные требования проекта.

## Как строить ответ

### Описать парадигму Redux

Actions → Reducers → Store; иммутабельность, предсказуемость, DevTools time-travel. RTK убирает boilerplate, но граф зависимостей ментально ручной.

### Описать парадигму Effector

Events как основа, Stores как реактивные потоки, Effects для сайд-эффектов. Связи между ними автоматически вычисляются (derived stores, sample, guard).

### Сравнить ключевые аспекты

| Критерий | Redux (RTK) | Effector |
|----------|-------------|----------|
| Boilerplate | Средний (RTK снижает) | Минимальный |
| DevTools | Отличные | Хорошие (patronum/devtools) |
| Сложная логика | Много reducers/thunks | sample/guard/pipeline |
| Производительность | Хорошая | Отличная (ленивые вычисления) |
| Кривая обучения | Низкая | Средняя |

### Привести критерии выбора

Выбирайте Redux если: команда знает Redux, нужен time-travel debugging, стандартный подход. Выбирайте Effector если: сложная бизнес-логика, много производных данных, гонки асинхронных операций, dozens виджетов с общим состоянием.

### Показать код-ревью сравнение

```typescript
// Redux Toolkit
const selectTotal = createSelector(
  [selectItems],
  (items) => items.reduce((sum, i) => sum + i.amount, 0)
);

// Effector
const $total = $items.map(items => items.reduce((sum, i) => sum + i.amount, 0));
```

Effector: одна строка, автоматически мемоизирован. Redux: нужен createSelector для мемоизации.

## Код из интервью

```typescript
// Effector: эффект + derived store
const fetchUserFx = createEffect(async (id: number) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});

const $user = createStore(null)
  .on(fetchUserFx.doneData, (_, user) => user);

const $greeting = $user.map(user => user ? `Hello, ${user.name}` : '');

// Redux Toolkit slice
const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (_, action) => action.payload);
  },
});
```

## Пример ответа

Effector и Redux решают одну задачу — управление состоянием — но подходят разным сценариям.

Redux (с RTK) — это предсказуемый контейнер: dispatch action → reducer вычисляет новое состояние. DevTools показывают каждый action и состояние. RTK Query добавляет кэширование запросов. Подходит когда команда familiar с Redux и нужен стандарт.

Effector — реактивный подход: Stores как потоки, Events как триггеры, Effects как сайд-эффекты. Производные данные вычисляются автоматически через `map`, `sample`, `combine`. Нет reducers — нет ментальной нагрузки на иммутабельность. Подходит для сложных бизнес-сценариев когда десятки виджетов читают и модифицируют общее состояние.

Практический пример: приложение с 30 виджетами дашборда. В Redux каждый виджет хранит часть состояния, нужно carefully выбирать selector чтобы не ре-рендерить лишнее. В Effector каждый виджет берёт `$derivedStore = $baseStore.map(...)` — React перерендеривает только при реальном изменении.

Рекомендация: для нового проекта с нетривиальной логикой — Effector; для существующего Redux-проекта — мигрировать постепенно через bridge.

## Частые ошибки

- Считать Effector «просто заменой Redux» — это другая парадигма.
- Использовать Redux для сложной реактивной логики — будет много boilerplate.
- Не учитывать кривую обучения команды при выборе.

## Дополнительные вопросы

- Как Effector обрабатывает гонки асинхронных запросов?
- Как мигрировать постепенно с Redux на Effector?
- Чем отличается Zustand от Redux и Effector?
