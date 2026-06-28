---
id: web-workers-service-workers
title: Что такое Web Workers и Service Workers?
category: Browser
scope: universal
languages: ["JavaScript"]
roles: ["Frontend"]
companies: []
level: Senior
stage: Техническое
tags: ["Web Workers", "Service Workers", "Concurrency", "PWA"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Web Workers — фоновый поток для тяжёлых вычислений, не блокирует UI. Общаются через postMessage. Service Workers — прокси между браузером и сетью. Позволяют кешировать ресурсы, работать оффлайн, отправлять push-уведомления.

## Контекст

Интервьюер проверяет знание возможностей браузера для многопоточности и оффлайн-работы.

## Как строить ответ

### Web Workers

Отдельный поток для CPU-bound задач. Не имеет доступа к DOM. Общение через postMessage.

### Service Workers

Прокси для сети. Живут отдельно от страницы. Могут перехватывать fetch-запросы.

### postMessage

Единственный способ общения с воркером. Данные копируются (Structured Clone).

### Жизненный цикл SW

install → activate → fetch. Регистрация через navigator.serviceWorker.register().

## Пример ответа

Web Workers позволяют выполнять код в отдельном потоке, не блокируя основной. Используются для тяжёлых вычислений (криптография, обработка данных). Общаются через postMessage/onmessage. Service Workers — это прокси, который перехватывает сетевые запросы. Позволяют реализовать: кеширование, оффлайн-работу, push-уведомления, background sync.

## Частые ошибки

- Пытаться получить доступ к DOM из Web Worker
- Не понимать, что postMessage копирует данные
- Забывать про жизненный цикл Service Worker
- Думать, что Web Workers блокируют UI

## Дополнительные вопросы

- Чем Web Worker отличается от Service Worker?
- Что такое SharedWorker?
- Как кешировать ресурсы через Service Worker?
- Что такое Cache API?