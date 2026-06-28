---
id: component-lifecycle-useeffect
title: Как работает жизненный цикл компонентов и useEffect в React?
category: React
scope: universal
languages: ["React"]
roles: ["Frontend"]
companies: []
level: Middle
stage: Техническое
tags: ["React", "useEffect", "Lifecycle", "Side Effects"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Фазы: Mount (появление), Update (обновление props/state), Unmount (удаление). useEffect объединяет все фазы: пустой deps — mount, deps — update, return function — unmount. Аналоги: componentDidMount, componentDidUpdate, componentWillUnmount.

## Контекст

Интервьюер проверяет понимание жизненного цикла React и как использовать useEffect.

## Как строить ответ

### Mount

Компонент появился в DOM. useEffect с [] выполняется один раз.

### Update

Изменились props или state. useEffect с зависимостями выполняется при изменении deps.

### Unmount

Компонент удалён из DOM. Return функция в useEffect — cleanup.

### Cleanup

Вызывается перед повторным выполнением эффекта и при unmount.

## Пример ответа

useEffect — хук для побочных эффектов. Пустой массив зависимостей [] — выполнится один раз при mount (аналог componentDidMount). С зависимостями [dep1, dep2] — выполнится при изменении зависимостей (аналог componentDidUpdate). Return функция — cleanup при unmount (аналог componentWillUnmount). Комбинируя, можно покрыть все фазы жизненного цикла.

## Частые ошибки

- Использовать useEffect для инициализации (лучше useState лениво)
- Забывать про cleanup (unsubscribe, abort)
- Ставить объект/массив в deps без useMemo
- Не понимать порядок выполнения эффектов

## Дополнительные вопросы

- Что такое cleanup в useEffect?
- Когда использовать useLayoutEffect?
- Как имитировать componentDidMount с useEffect?
- Что такое strict mode и как он влияет на useEffect?