---
id: tbank-embed-web-app
title: Как встроить одно веб-приложение в другое?
category: Frontend Architecture
scope: multi-language
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Fullstack-разработчик"]
companies: ["Т-Банк"]
level: Senior
stage: Архитектура
tags: ["iframe", "Microfrontend", "Web Components"]
duration: 15 мин
difficulty: 4
sourceCompany: Т-Банк
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

Способ зависит от границы доверия и независимости релизов. Для изоляции стороннего или legacy-приложения используйте `iframe` с минимальным `sandbox`, строгим `allow` и версионированным `postMessage`-протоколом с проверкой `origin`. Для доверенных команд одного продукта подходят microfrontend runtime/build-time composition или Web Component: меньше изоляции, зато проще общие UX и маршрутизация. Заранее определите ownership, auth, observability, versioning контрактов, обработку ошибок и независимый rollback; не раздавайте общий mutable global state.

## Контекст

Проверяется выбор интеграционной границы, а не знание одного тега.

## Как строить ответ

### Уточнить доверие и автономность

Кто владеет приложениями, как часто они релизятся и нужна ли security-изоляция.

### Выбрать механизм

Iframe, Web Component или microfrontend composition с аргументированными компромиссами.

### Спроектировать контракт

Навигация, auth, события, ошибки, telemetry и совместимость версий.

## Частые ошибки

- Выбирать iframe без sandbox и проверки origin.
- Создавать общий глобальный store между независимыми приложениями.
- Не определять деградацию при недоступности дочернего приложения.

## Дополнительные вопросы

- Как синхронизировать маршрутизацию?
- Как передавать токен без утечки между origin?

