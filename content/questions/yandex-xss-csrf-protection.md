---
id: yandex-xss-csrf-protection
title: Как защитить веб-приложение от XSS и CSRF атак?
aliases: []
category: Web Platform
scope: universal
languages: []
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Яндекс"]
level: Middle
stage: Техническое
tags: ["Security", "XSS", "CSRF", "CSP"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

XSS защищается санитизацией пользовательского ввода и вывода, установкой CSP policy и использованием Trusted Types API. CSRF защищается CSRF-токенами в формах, проверкой заголовка SameSite у cookies и заголовка Origin/Referer. HTTPOnly cookies не доступны из JavaScript, что предотвращает кражу токенов через XSS.

## Контекст

Интервьюер проверяет понимание моделей угроз в вебе. Ожидается знание типов XSS (stored, reflected, DOM-based), конкретных техник защиты и понимание, почему одного способа недостаточно — защита должна быть многоуровневой.

## Как строить ответ

### Типы XSS

Stored XSS — вредоносный скрипт сохранён на сервере (например, в комментариях). Reflected XSS — скрипт передаётся через URL-параметры и отражается в ответе. DOM-based XSS — скрипт вводится через client-side код (innerHTML, document.write).

### Защита от XSS

Санитизация ввода: валидация по white list, экранирование HTML-сущностей (< → &lt;). Sanitizers: DOMPurify для HTML, libraries для шаблонов. CSP (Content Security Policy) — ограничение источников скриптов, block inline scripts. Trusted Types API — принудительная обработка DOM-вставок.

### Модель CSRF

CSRF利用, что браузер автоматически подставляет cookies при запросах. Атакующий может отправить форму от имени пользователя, даже если он не на сайте. Уязвимы state-changing запросы (POST, PUT, DELETE).

### Защита от CSRF

CSRF-токен — уникальный токен в форме, проверяется сервером. SameSite cookie attribute (Strict/Lax) — cookie не отправляется в cross-site запросах. Проверка заголовков Origin/Referer. Double Submit Cookie pattern.

### HTTPOnly cookies и комбинированная защита

HTTPOnly — JavaScript не может прочитать cookie, что защищает от кражи токенов. Combined: CSP + HTTPOnly + SameSite + CSRF tokens — многоуровневая защита.

## Код из интервью

```javascript
// Пример CSP policy (HTTP-заголовок)
// Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc123'; style-src 'self' 'unsafe-inline'

// DOMPurify — санитизация HTML
import DOMPurify from 'dompurify';

function renderComment(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href'],
  });
}

// CSRF-токен в форме
function generateForm() {
  const token = getCsrfToken(); // из серверного рендера
  return `
    <form method="POST" action="/api/transfer">
      <input type="hidden" name="_csrf" value="${token}">
      <input name="amount">
      <button type="submit">Отправить</button>
    </form>
  `;
}

// Проверка SameSite cookie (серверная часть)
// Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax; Path=/

// Trusted Types API (browser)
// policy.createScriptURL(url) — валидация URL перед вставкой в script.src
```

## Пример ответа

XSS бывает трёх типов: stored (скрипт на сервере), reflected (в URL) и DOM-based (в клиентском коде). Защита — многоуровневая: санитизация ввода (DOMPurify), CSP policy с nonce для скриптов, Trusted Types API для контроля DOM-вставок.

CSRF利用, что браузер подставляет cookies автоматически. Защита: CSRF-токен в каждой форме (проверяется сервером), SameSite=Lax у cookies (не отправляются в cross-site POST), HTTPOnly флаг (JS не видит токены). На практике используют комбинацию: SameSite + CSRF tokens + проверка Origin.

Важно: XSS можно полностью предотвратить, но CSRF требует серверной поддержки. CSP — самый мощный инструмент, но его сложно настроить без поломок. Начинайте с strict policy и ослабляйте по мере необходимости.

## Частые ошибки

- Полагаться только на клиентскую валидацию — серверная проверка обязательна.
- Использовать innerHTML без санитизации — прямой путь к DOM XSS.
- Не устанавливать SameSite у cookies — по умолчанию сейчас Lax, но лучше указывать явно.
- Использовать eval() или dangerouslySetInnerHTML без крайней необходимости.

## Дополнительные вопросы

- Что такое JSONP и почему он небезопасен?
- Как настроить CSP policy, чтобы она не ломала существующий код?
- В чём разница между SameSite=Strict и SameSite=Lax?
- Что такое Subresource Integrity (SRI) и как оно защищает от атак на CDN?
