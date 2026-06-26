---
id: it-one-react-redux-patterns
title: Как организовать 상태 в крупном React-приложении с Redux?
category: React
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["IT One"]
level: Middle
stage: Техническое
tags: ["React", "Redux", "State Management", "Architecture"]
duration: 15 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

ReduxReact feature-based architecture: каждый feature (например, `features/auth`, `features/dashboard`) имеет собственные slices, reducers и selectors. Нормализация данных через `createEntityAdapter` упрощает CRUD-операции. Middleware (thunk или saga) обрабатывают side effects, а TypeScript типизация action creators и reducers обеспечивает безопасность на этапе компиляции. Context подходит для глобальных настроек (тема, язык), но не для состояния.

## Контекст

Интервьюер ожидает понимания архитектурных паттернов для масштабируемых Redux-приложений: organization of code, separation of concerns, типизация, и когда Redux не нужен.

## Как строить ответ

### Feature-based structure

Покажите organization по фичам: `features/auth/`, `features/orders/` — каждый содержит slice, thunks, selectors, types.

### Normalization

Используйте `createEntityAdapter` для нормализации данных: `entities` + `ids` вместо вложенных массивов.

### Middleware patterns

Thunk для простых async (API calls), Saga для сложных workflow (retry, cancel, sequences).

### TypeScript типизация

Typed hooks (`useAppSelector`, `useAppDispatch`), типизированные action creators через `createAction<T>`.

### Context vs Redux

Context для статичных данных (theme, locale), Redux для динамичного состояния с частыми обновлениями.

## Код из интервью

```typescript
// Фича-ориентированная структура Redux store
// features/users/model/usersSlice.ts

import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

interface User {
  id: string;
  name: string;
  email: string;
}

const usersAdapter = createEntityAdapter<User>();

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  const response = await fetch('/api/users');
  return response.json();
});

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({ status: 'idle' }),
  reducers: {
    userAdded: usersAdapter.addOne,
    userUpdated: usersAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        usersAdapter.setAll(state, action.payload);
      });
  },
});

// Typed selectors
export const { selectAll: selectAllUsers } = usersAdapter.getSelectors(
  (state: RootState) => state.users
);

// Typed hooks
export const useAppSelector = useSelector as TypedUseSelectorHook<RootState>;
```

## Пример ответа

В крупном React-приложении я организую Redux состояние через feature-based architecture. Каждая бизнес-сущность (auth, orders, users) — отдельная папка со своим slice, thunks и selectors. Это упрощает навигацию по кодовой базе и уменьшает конфликты при параллельной разработке.

Для данных, которые приходят из API, я нормализую состояние через `createEntityAdapter` — это даёт O(1) доступ по ID и встроенные методы CRUD. Вместо `{ users: [{ id: 1, name: '...' }, ...] }` получаю `{ users: { ids: [1], entities: { 1: { id: 1, name: '...' } } } }`.

Side effects обрабатываю через thunks для простых запросов (fetch, create, update) и sagas для сложных workflow (retry с экспоненциальной задержкой, отмена запросов, последовательные вызовы API).

TypeScript типизирую через `createSlice` с дженериком и typed hooks (`useAppSelector`, `useAppDispatch`) — это исключает ошибки при обращении к store.

Для Context vs Redux: использую Context для глобальных настроек (тема, язык, текущий пользователь), но не для updates (списки, формы), так как Context вызывает re-render всех consumers.

## Частые ошибки

- Хранить всё состояние в одном большом slice вместо разделения по фичам.
- Использовать Redux для статичных данных, которые не меняются (константы, конфиги).
- Писать бизнес-логику в reducers вместо thunks/sagas.
- Не нормализовать вложенные данные, создавая сложные селекторы для обновления.
- Использовать `any` для типизации store, теряя безопасность TypeScript.

## Дополнительные вопросы

- Что такое RTK Query и когда использовать вместо thunks?
- Как оптимизировать перерисовки React-компонентов с Redux?
- Когда Redux Toolkit не нужен, и какие альтернативы существуют?
- Как тестировать Redux slices и async thunks?
