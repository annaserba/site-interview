---
id: wildberries-jquery-clone
title: Реализуйте минимальный аналог jQuery с chaining
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик"]
companies: ["Wildberries"]
level: Senior
stage: Live coding
tags: ["DOM", "API Design", "Chaining"]
duration: 35 мин
difficulty: 4
sourceCompany: Wildberries
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=HF7zkpSrByE&t=2921s"
---

## Короткий ответ

Функция `$` принимает CSS selector или набор Elements и возвращает wrapper с собственной стабильной коллекцией. Методы `addClass`, `toggleClass`, `css` и `html` применяют операцию ко всем узлам и возвращают `this`, обеспечивая chaining. `css` меняет только переданные свойства через `Object.assign(element.style, styles)`. Setter для `html` должен явно считать строку trusted: для пользовательского ввода используйте `textContent` или sanitizer.

## Контекст

Нужно спроектировать fluent API поверх DOM-коллекции, не ограничившись одним элементом.

## Как строить ответ

### Нормализовать вход

Скопируйте `querySelectorAll` в Array, поддержите Element и iterable; определите поведение пустой коллекции.

### Централизовать обход

Приватный `each(callback)` убирает дублирование, а публичные mutating methods возвращают `this`.

### Защитить API

Проверьте типы аргументов, не перезаписывайте весь inline style и проговорите XSS-риск `innerHTML`.

## Частые ошибки

- Работать только с первой найденной нодой.
- Возвращать результат `forEach` вместо wrapper.
- Присваивать новый объект в `element.style`.
- Вставлять пользовательскую строку через `innerHTML`.

## Дополнительные вопросы

- Как добавить getter/setter overload?
- Как поддержать event delegation?
- Как типизировать chaining в TypeScript?
