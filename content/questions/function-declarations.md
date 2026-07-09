---
id: function-declarations
title: Какие способы объявления функций существуют в JavaScript?
category: JavaScript
scope: universal
languages: ["JavaScript"]
roles: ["Frontend", "Backend"]
companies: []
level: Junior
stage: Техническое
tags: ["JavaScript", "Functions", "Hoisting", "Arrow Function"]
duration: 5 мин
difficulty: 1
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Function declaration, function expression, arrow function (ES6), метод объекта, IIFE, конструктор Function. Различия: hoisting (declaration поднимается), this (arrow не имеет своего this), arguments (отсутствует в arrow).

## Контекст

Интервьюер проверяет знание различных способов создания функций и их особенностей.

## Как строить ответ

### Function Declaration

Поднимается (hoisting) в начало области видимости. Можно вызвать до объявления.

### Function Expression

Не поднимается. Присваивается переменной. Можно передать как аргумент.

### Arrow Function

Нет своего this (берёт из окружающего контекста). Нет arguments. Короче для колбэков.

### IIFE

Immediately Invoked Function Expression — выполняется сразу при создании. Создаёт область видимости.

## Пример ответа

В JavaScript есть несколько способов создать функцию: 1) Function declaration — function foo() {} (с hoisting). 2) Function expression — const foo = function() {} (без hoisting). 3) Arrow function — const foo = () => {} (нет своего this, arguments). 4) IIFE — (function() {})() — вызывается сразу. 5) Метод объекта — obj.method = function() {}. 6) Конструктор Function — new Function().

## Частые ошибки

- Заявлять, что function declaration и function expression ведут себя одинаково, не упоминая hoisting.
- Использовать стрелочную функцию как метод объекта с обращением к this, не понимая лексического контекста.
- Приводить IIFE как способ объявления функции, но не объяснять, для чего создаётся изолированная область видимости.
- Путать отсутствие псевдомассива arguments в arrow-функциях с отсутствием rest-параметров.

## Дополнительные вопросы

- Что такое hoisting и как он работает?
- Почему arrow function не имеет своего this?
- Когда использовать IIFE?
- Что такое callback и как передавать функции?