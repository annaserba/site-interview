---
id: goznak-dom-events
title: Как работают DOM-события и как безопасно удалять обработчики?
category: Browser
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик"]
companies: ["Гознак"]
level: Senior
stage: Техническое
tags: ["DOM Events", "AbortController", "Delegation"]
duration: 15 мин
difficulty: 4
sourceCompany: Гознак
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=Egvch4SA998&t=3191s"
---

## Короткий ответ

Событие проходит capture от window к target, target phase и bubble обратно, если оно bubbles. `stopPropagation` останавливает путь, `stopImmediatePropagation` — ещё и следующие listeners на узле, `preventDefault` отменяет default action у cancelable event. Для удаления нужен тот же callback и capture flag; современная альтернатива — передать `signal` из AbortController и вызвать `abort()` для группы listeners. Делегирование использует bubbling и `closest`.

## Контекст

Проверяется lifecycle обработчиков и модель распространения событий.

## Как строить ответ

### Путь

Capture, target, bubble и composed path.

### Управление

Default action отдельно от propagation.

### Cleanup

Stable callback, AbortSignal и lifecycle компонента.

## Частые ошибки

- Считать `preventDefault` остановкой bubbling.
- Удалять новую anonymous function.
- Делегировать non-bubbling событие без проверки.

## Дополнительные вопросы

- Как события проходят Shadow DOM?
- Для чего passive listener?

