---
id: frontend-map-set
title: В чём разница между Map и Set?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Node.js-разработчик"]
companies: ["Несколько компаний"]
level: Senior
stage: Техническое
tags: ["Map", "Set", "Collections"]
duration: 10 мин
difficulty: 3
sourceReports: [{"company":"Т-Банк"}]
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Map хранит пары key-value, Set — уникальные values. Оба сохраняют insertion order и используют SameValueZero для сравнения: `NaN` равен `NaN`, а объекты сравниваются по identity. Map подходит для произвольных ключей и частых add/delete; Set — для membership и дедупликации. WeakMap и WeakSet не перечисляются и не удерживают объектные ключи от garbage collection.

## Контекст

Проверяется выбор структуры по операциям, а не знание сигнатур методов.

## Как строить ответ

### Назвать модель данных

Map отвечает «ключ → значение», Set — «присутствует ли значение».

### Сравнить с Object и Array

Object удобен для record с известными строковыми ключами; Map избегает prototype keys и имеет `size`. Set лучше линейного `includes` при множественных проверках.

### Учесть память

Weak-коллекции полезны для метаданных объектов и кешей, но не дают перечисления или размера.

## Частые ошибки

- Ожидать дедупликацию разных объектов с одинаковыми полями.
- Использовать WeakMap со строковыми ключами.
- Обещать конкретную O(1) реализацию вместо спецификационного sublinear access.

## Дополнительные вопросы

- Когда Object лучше Map?
- Как дедуплицировать объекты по id?
- Для чего использовать WeakMap?
