---
id: vk-iframe-detection-protection
title: "Как понять, что сайт открыт в iframe, и как запретить открытие во фрейме?"
category: Browser
scope: universal
languages: ["JavaScript"]
roles: ["Frontend", "Fullstack"]
companies: ["VK"]
level: Middle
stage: Техническое
tags: ["browser", "security", "iframe", "csp", "clickjacking"]
duration: 5
difficulty: 3
sourceType: candidate-report
sourceUrl: ""
---

## Короткий ответ

Определить: сравнить `window.self !== window.top` (внутри iframe `window.top` — ссылка на верхнее окно). Обернуть в try/catch: при кросс-доменном доступе к `window.top.location` браузер бросит SecurityError, что само по себе подтверждает встраивание. Запретить: HTTP-заголовок `Content-Security-Policy: frame-ancestors 'none'` (или список доменов) и устаревший, но всё ещё поддерживаемый `X-Frame-Options: DENY` / `SAMEORIGIN`. Это защита от clickjacking.

## Контекст

Clickjacking — атака, при которой сайт встраивают в невидимый iframe поверх вредоносной страницы и перехватывают клики пользователя. Современная защита реализуется на уровне HTTP-заголовков ответа, а не JS — JS-«framebusting» легко обходится (например, через sandbox-iframe).

## Как строить ответ

### Детект из JS

- `if (window.self !== window.top) { /* мы во фрейме */ }`.
- Кросс-домен: чтение `window.top.location.href` кинет исключение — оборачивать в try/catch.
- Узнать URL родителя нельзя (Same-Origin Policy), доступен только `document.referrer`.

### Запрет на сервере

- `Content-Security-Policy: frame-ancestors 'self https://trusted.com'` — современный стандарт.
- `X-Frame-Options: DENY` — полный запрет; `SAMEORIGIN` — только свой origin (нет белого списка доменов).
- Ставить оба заголовка: CSP для современных браузеров, X-Frame-Options для старых.

### Почему не JS-framebusting

- `if (top !== self) top.location = self.location` — обходится sandbox-атрибутом и отключённым JS.
- Надёжная защита только заголовками: браузер не отрендерит страницу до исполнения скриптов.

## Пример ответа

«Проверяю `window.self !== window.top` — если не равны, страница во фрейме. Доступ к top.location кросс-доменно запрещён, поэтому ловлю SecurityError. Запрещаю встраивание заголовками: основной — CSP `frame-ancestors`, он поддерживает список разрешённых origin; плюс X-Frame-Options для старых браузеров. JS-framebusting не использую как защиту — его тривиально обходят через sandbox.»

## Частые ошибки

- Полагаться на JS-проверку как на защиту.
- Не знать, что X-Frame-Options не умеет белый список доменов.
- Пытаться читать `window.top.location` без try/catch.
- Путать `frame-ancestors` (кто может встраивать нас) с директивой `frame-src` (кого можем встраивать мы).

## Дополнительные вопросы

- Что такое clickjacking?
- Чем CSP frame-ancestors лучше X-Frame-Options?
- Как разрешить встраивание только для конкретного партнёрского домена?
- Что такое Same-Origin Policy и какие исключения у неё есть?
