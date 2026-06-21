---
id: sber-js-library-from-go
title: Как использовать JavaScript-библиотеку из Go-сервиса?
category: System Design
scope: multi-language
languages: ["Go", "JavaScript"]
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Сбер"]
level: Senior
stage: Архитектура
tags: ["Runtime", "WASM", "Isolation"]
duration: 20 мин
difficulty: 5
sourceCompany: Сбер
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=C0xSErqNYeU&t=3000s"
---

## Короткий ответ

Go не исполняет npm-пакет напрямую: нужен JavaScript runtime или перенос алгоритма. Практичные варианты — отдельный Node-сервис с версионированным контрактом, embedded runtime вроде QuickJS/V8 binding, либо WASM, если библиотека совместима и не зависит от DOM/Node API. Для production обычно выбирают sidecar/service: проще изоляция, лимиты CPU/RAM, обновления и observability. Обязательно оцените cold start, concurrency, sandbox и стоимость сериализации.

## Контекст

Вопрос проверяет границы языковых runtime и архитектурный выбор.

## Как строить ответ

### Проверить библиотеку

Используемые API, statefulness, лицензия и возможность портирования.

### Сравнить варианты

Service, embedded engine, WASM или переписывание.

### Защитить исполнение

Timeout, memory limit, sandbox, version pinning и tracing.

## Частые ошибки

- Считать npm форматом исполняемого кода.
- Встраивать runtime без лимитов.
- Игнорировать несовместимость DOM и Node API.

## Дополнительные вопросы

- Когда выгоднее переписать алгоритм?
- Как масштабировать stateful runtime?

