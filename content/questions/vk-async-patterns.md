---
id: vk-async-patterns
title: Какие есть способы работы с асинхронным кодом в JS?
category: JavaScript
scope: universal
languages: ["JavaScript"]
roles: ["Frontend", "Backend"]
companies: ["VK"]
level: Junior
stage: Техническое
tags: ["JavaScript", "Async", "Promises", "async/await"]
duration: 8 мин
difficulty: 2
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

Исторически: колбэки → промисы (then/catch/finally, Promise.all/race/allSettled/any) → async/await как синтаксис поверх промисов. Дополнительно: генераторы и async-итераторы (for await...of), EventEmitter/события, Observables (RxJS). Сегодня стандарт — async/await с try/catch и комбинаторами промисов для параллельности.

## Контекст

Обзорный вопрос: эволюция асинхронности и когда какой инструмент уместен.

## Как строить ответ

### Колбэки

Первая форма: fs.readFile(cb). Минусы — callback hell, инверсия контроля, сложная обработка ошибок.

### Промисы

Единый контракт результата: pending/fulfilled/rejected, цепочки then, единый catch. Комбинаторы: all — все или ошибка, allSettled — все любой ценой, race — первый, any — первый успешный.

### async/await

Синхронно выглядящий код поверх промисов, try/catch, циклы с await. Параллельность — по-прежнему через Promise.all с await.

### Потоки значений

Много событий во времени: EventEmitter, генераторы и for await...of для асинхронных итераций, Observables в Angular/реактивном стиле.

## Пример ответа

Способы эволюционировали. Начиналось с колбэков — функция принимает обработчик результата; при нескольких шагах получаем callback hell и размазанную обработку ошибок. Промисы дали единый контракт: объект с состояниями, цепочки then, централизованный catch и комбинаторы — Promise.all для параллельного запуска, allSettled когда нужны все результаты независимо от падений, race и any. Поверх появился async/await: тот же промисный механизм, но код читается как синхронный, ошибки ловятся через try/catch, а циклы пишутся естественно. Для потоковых сценариев — много значений во времени — есть EventEmitter и события, асинхронные итераторы с for await...of и Observables из RxJS. Сегодня дефолт — async/await плюс комбинаторы промисов для параллельности.

## Частые ошибки

- Последовательные await там, где нужен Promise.all
- Забыть catch у промиса — unhandledrejection
- await внутри forEach — он не ждёт
- Смешивать колбэки и промисы без promisify

## Дополнительные вопросы

- Чем Promise.allSettled отличается от all?
- Как отменить async-функцию?
- Что такое for await...of?
- Как устроен микротаск-очередь для промисов?
