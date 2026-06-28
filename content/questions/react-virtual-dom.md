---
id: react-virtual-dom
title: Какие преимущества React и как работает Virtual DOM?
category: React
scope: universal
languages: ["React"]
roles: ["Frontend"]
companies: []
level: Middle
stage: Техническое
tags: ["React", "Virtual DOM", "Diffing", "Reconciliation"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Virtual DOM — это JS-представление реального DOM. При изменении state React создаёт новый Virtual DOM, сравнивает с предыдущим (diffing) и обновляет реальный DOM минимальными изменениями (reconciliation). Преимущества: декларативный подход, переносимость, производительность (минимальные обновления DOM).

## Контекст

Интервьюер проверяет понимание основ работы React и его ключевой концепции.

## Как строить ответ

### Декларативность

Вы описываете UI для каждого состояния, React сам обновляет DOM.

### Diffing Algorithm

O(n) сравнение двух деревьев. Эвристики: разные типы → полная замена, key для списков.

### Batching

React группирует обновления DOM для производительности.

### Переносимость

Virtual DOM позволяет рендерить в другие платформы (React Native, React Three Fiber).

## Пример ответа

Virtual DOM работает так: 1) При изменении state создаётся новое виртуальное дерево. 2) React сравнивает новое с предыдущим (diffing). 3) Вычисляет минимальные изменения (reconciliation). 4) Обновляет реальный DOM только там, где нужно. Преимущества: декларативный код (описывает что, а не как), переносимость (React Native), производительность (пакетное обновление DOM).

## Частые ошибки

- Думать, что Virtual DOM быстрее vanilla JS
- Не использовать key в списках
- Мутировать state напрямую
- Забывать про batching обновлений

## Дополнительные вопросы

- Что такое reconciliation?
- Как работают ключи (key) в React?
- Чем Virtual DOM отличается от реального DOM?
- Что такое React Fiber?