---
id: tbank-react-rerenders
title: Что приводит к ререндеру React-компонента и как искать лишние рендеры?
category: React
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик"]
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

## Частые ошибки

- Говорить, что изменение любой переменной вызывает ререндер.
- Считать каждый ререндер проблемой.
- Оборачивать всё в memo и callback без измерений.

## Дополнительные вопросы

- Как `key` влияет на сохранение state?
- Почему StrictMode может вызывать повторный render в development?

