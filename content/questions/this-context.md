---
id: this-context
title: Как работает контекст вызова (this) в JavaScript?
category: JavaScript
scope: universal
languages: ["JavaScript"]
roles: ["Frontend", "Backend"]
companies: []
level: Middle
stage: Техническое
tags: ["JavaScript", "This", "Context", "Binding"]
duration: 10 мин
difficulty: 2
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

This определяется тем, КАК вызывается функция, а не ГДЕ она объявлена. 1) Обычный вызов: this = window (strict mode — undefined). 2) Метод объекта: this = объект. 3) new: this = новый объект. 4) call/apply/bind: this = переданный объект. 5) Arrow function: this = из лексического окружения.

## Контекст

Интервьюер проверяет понимание одного из самых запутанных аспектов JavaScript.

## Как строить ответ

### Implicit binding

obj.method() — this = obj. Но при присваивании this теряется.

### Explicit binding

call, apply, bind позволяют задать this вручную.

### new binding

При вызове через new this — новый создаваемый объект.

### Arrow function

Наследует this из лексического окружения. Не имеет своего this.

## Пример ответа

This — это ссылка на объект, в контексте которого вызывается функция. Определяется способом вызова: 1) foo() — window (или undefined в strict). 2) obj.foo() — obj. 3) new Foo() — новый объект. 4) foo.call(ctx) — ctx. 5) Arrow function — наследует this из окружающего контекста. В React this в классовых компонентах — экземпляр класса, в стрелочных — нет своего this.

## Частые ошибки

- Потеря this при передаче метода как колбэка
- Забывать про strict mode
- Использовать стрелочные функции как методы объекта
- Не понимать разницу между call и apply

## Дополнительные вопросы

- Что такое bind и зачем он нужен?
- Как потерять this в React?
- Что такое implicit binding?
- Как работает this в классах?