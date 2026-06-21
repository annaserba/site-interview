---
id: okko-js-execution-context
title: Что такое контекст выполнения функции в JavaScript?
category: JavaScript
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Okko"]
level: Senior
stage: Техническое
tags: ["Execution Context", "this", "Scope"]
duration: 15 мин
difficulty: 4
sourceReports: [{"company":"Т-Банк"}]
sourceCompany: Okko
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=6aIg-fGUOsY&t=587s"
---

## Короткий ответ

Execution context содержит lexical/variable environment, ссылку на outer environment и binding `this`; контексты образуют call stack. Lexical scope определяется местом объявления, а `this` обычной функции — способом вызова. У стрелки собственного `this` и `arguments` нет. `call`, `apply` и `bind` задают `this` явно, `new` создаёт новый объект и связывает его с prototype.

## Контекст

Вопрос связывает scope, closure, call stack и правила `this`.

## Как строить ответ

### Создание

Что подготавливается до выполнения тела функции.

### Scope

Как идёт поиск идентификатора по lexical environments.

### This

Разобрать method call, plain call, constructor и arrow.

## Частые ошибки

- Называть `this` частью closure.
- Определять `this` местом объявления обычной функции.
- Смешивать execution context и объект контекста React.

## Дополнительные вопросы

- Чем arrow отличается от обычной функции?
- Что хранит closure?
