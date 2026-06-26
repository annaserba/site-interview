---
id: sber-js-library-from-go
title: Как использовать JavaScript-библиотеку из Go-сервиса?
category: System Design
scope: multi-language
languages: ["Go", "JavaScript"]
roles: ["Frontend","Backend"]
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


## Код из интервью

```yaml
# Архитектурная конфигурация

# Docker Compose — базовая структура
version: "3.8"
services:
  api:
    build: ./api
    ports: ["3000:3000"]
    environment:
      - DATABASE_URL=postgres://db:5432/mydb
    depends_on: [db, redis]
  frontend:
    build: ./frontend
    ports: ["80:80"]
    depends_on: [api]
  db:
    image: postgres:16
    volumes: ["pgdata:/var/lib/postgresql/data"]
volumes:
  pgdata:
```

## Пример ответа

Есть несколько подходов: 1) WASM — компилируем JS-библиотеку в WebAssembly, Go вызывает через wasmtime или wazero; 2) Embed Node.js — Go запускает Node.js процесс, передаёт данные через stdin/stdout; 3) goja — pure Go JS engine, подмножество ES5.1; 4) V8Go — привязка к V8, полная поддержка JS. Пример: нам нужна библиотека валидации из npm. Использовали goja — достаточно для нашего кейса, zero dependencies. Если бы нужен был async/await — пошли бы в сторону Node.js embed. Важно: изолировать JS runtime, настроить timeout и memory limits.

## Частые ошибки

- Считать npm форматом исполняемого кода.
- Встраивать runtime без лимитов.
- Игнорировать несовместимость DOM и Node API.

## Дополнительные вопросы

- Когда выгоднее переписать алгоритм?
- Как масштабировать stateful runtime?

