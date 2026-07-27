---
id: video-useeffect-vs-uselayouteffect
title: "Чем useEffect отличается от useLayoutEffect и когда нужен каждый?"
category: React
scope: universal
languages: ["JavaScript", "TypeScript"]
roles: ["frontend", "fullstack"]
companies: []
level: middle
stage: Техническое
tags: ["react", "hooks", "useeffect", "uselayouteffect", "rendering"]
duration: 6 мин
difficulty: 3
sourceType: candidate-report
sourceUrl: ""
sourceVideos: [{"company":"Frontend-интервью","url":"https://www.youtube.com/watch?v=a43a-SCCHLg&t=4380s","title":"useEffect vs useLayoutEffect"}]
---

## Короткий ответ

`useEffect` выполняется асинхронно, после того как браузер отрисовал изменения (paint), и не блокирует рендер. `useLayoutEffect` — синхронно после мутаций DOM, но до отрисовки: браузер ждёт его завершения, поэтому изменения DOM внутри него пользователь увидит уже в первом кадре. По умолчанию используют `useEffect`; `useLayoutEffect` — только когда нужно измерить DOM или синхронно поправить макет до paint (позиционирование тултипов, предотвращение мерцания).

## Контекст

Разница — в точке подключения к конвейеру рендера: commit → (useLayoutEffect синхронно) → paint → (useEffect асинхронно). Неправильный выбор виден как мерцание интерфейса или, наоборот, как лаги из-за блокировки отрисовки.

## Как строить ответ

### Хронология

- Render → commit (DOM обновлён) → useLayoutEffect (синхронно, блокирует paint) → браузер рисует кадр → useEffect (асинхронно).
- Оба получают cleanup-функцию и массив зависимостей — API идентичен.

### Когда useLayoutEffect

- Измерения DOM с немедленной корректировкой: `getBoundingClientRect` + перестановка элемента до первого кадра.
- Предотвращение визуального мерцания (FLIP-анимации, тултипы, поповеры).

### Почему по умолчанию useEffect

- Не блокирует отрисовку — лучше производительность.
- Не вызывает предупреждений при SSR (useLayoutEffect не работает на сервере; библиотеки подменяют его на useEffect через isomorphic-хук).

## Пример ответа

«Оба хука срабатывают после commit, но useLayoutEffect — синхронно до paint, а useEffect — после paint, не блокируя кадр. Поэтому стандарт — useEffect: подписки, запросы, таймеры. useLayoutEffect беру только для измерений и корректировки макета до отрисовки, например позиционирование тултипа: иначе пользователь увидит мерцание. Помню и про SSR: useLayoutEffect на сервере не выполняется и React ругается, поэтому в библиотеках пишут isomorphic-обёртку.»

## Частые ошибок

- Использовать useLayoutEffect «на всякий случай» — это блокирует рендер.
- Не знать про SSR-предупреждение.
- Думать, что useEffect гарантированно выполняется сразу после рендера.
- Путать порядок cleanup у двух хуков (он одинаковый).

## Дополнительные вопросы

- Что такое useInsertionEffect?
- Как избежать мерцания при позиционировании поповера?
- Почему useLayoutEffect опасен для производительности?
- Что происходит с эффектами при StrictMode?
