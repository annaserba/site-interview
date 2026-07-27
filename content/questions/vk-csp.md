---
id: vk-csp
title: "Что такое CSP (Content Security Policy) в браузере?"
category: Browser
scope: universal
languages: ["ru"]
roles: ["frontend", "fullstack"]
companies: ["VK"]
level: middle
stage: Техническое
tags: ["security", "csp", "xss", "http-headers"]
duration: 6
difficulty: 3
sourceType: candidate-report
sourceUrl: ""
aliases: ["Что такое CSP в браузере?"]
---

## Короткий ответ

CSP — HTTP-заголовок `Content-Security-Policy`, который говорит браузеру, из каких источников разрешено загружать ресурсы: скрипты, стили, картинки, шрифты, fetch/XHR, фреймы. Главная цель — смягчение XSS: даже если атакующий внедрил `<script>` в страницу, браузер не выполнит его, если origin не в белом списке. Пример: `script-src 'self' https://cdn.example.com; object-src 'none'; base-uri 'none'`.

## Контекст

XSS остаётся одной из самых частых веб-уязвимостей. Экранирование вывода — первая линия защиты, CSP — вторая (defense in depth): она ограничивает ущерб, когда первая линия пробита. Также CSP защищает от инъекций через скомпрометированные сторонние скрипты и mixed content.

## Как строить ответ

### Основные директивы

- `default-src` — fallback для остальных.
- `script-src`, `style-src`, `img-src`, `font-src`, `connect-src` — по типам ресурсов.
- `frame-ancestors` — кто может встраивать нас в iframe (анти-clickjacking).
- `object-src 'none'`, `base-uri 'none'`, `form-action` — закрытие отдельных векторов.

### Значения источников

- `'self'` — свой origin; явные домены; схемы `https:`.
- `'nonce-<random>'` и `'sha256-<hash>'` — разрешение конкретных inline-скриптов.
- `'unsafe-inline'` / `'unsafe-eval'` — открывают дыру, избегать.
- `report-uri` / `report-to` — сбор нарушений; `Content-Security-Policy-Report-Only` — режим наблюдения без блокировки.

### Практика внедрения

- Начать с Report-Only, собрать отчёты, постепенно ужесточать.
- Проблема inline-обработчиков (`onclick=`) и inline-стилей — решается nonce/hash или рефакторингом.

## Пример ответа

«CSP — белый список источников контента на уровне браузера. Если на странице появился чужой скрипт — через XSS или скомпрометированную библиотеку — браузер его заблокирует, потому что origin не разрешён в `script-src`. Настраиваю постепенно: сначала Report-Only и сбор отчётов, затем убираю unsafe-inline через nonce, закрываю object-src и base-uri. CSP не отменяет экранирование вывода — это вторая линия обороны.»

## Частые ошибки

- Считать CSP заменой экранированию HTML.
- Оставлять `'unsafe-inline'` в script-src — защита почти обнуляется.
- Не знать про Report-Only режим.
- Путать директивы: `frame-src` против `frame-ancestors`.

## Дополнительные вопросы

- Как CSP защищает от XSS, а от чего нет?
- Что такое nonce и как его генерировать?
- Чем Report-Only отличается от обычного заголовка?
- Какие ещё security-заголовки знаешь (HSTS, X-Content-Type-Options, Referrer-Policy)?
