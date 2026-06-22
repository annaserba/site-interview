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


## Код из интервью

```typescript
// Event bubbling + delegation
document.querySelector(".list").addEventListener("click", (e) => {
  const item = e.target.closest(".list-item");
  if (!item) return;
  console.log("Clicked:", item.dataset.id);
});

// Event phases
element.addEventListener("click", handler, true);  // capturing
element.addEventListener("click", handler, false); // bubbling
```

## Пример ответа

DOM-события работают через три фазы: capture (сверху вниз), target (на элементе), bubble (снизу вверх). Пример:

```javascript
document.addEventListener('click', () => console.log('capture'), true);
button.addEventListener('click', () => console.log('target'));
button.addEventListener('click', () => console.log('bubble'), false);
```

event.stopPropagation() останавливает всплытие/погружение. event.preventDefault() отменяет действие браузера. Удаление обработчиков: removeEventListener — нужна та же ссылка на функцию. Event delegation: один обработчик на родителе, event.target определяет дочерний элемент. AbortController для массового удаления: controller.abort() снимает все listener'ы.

## Частые ошибки

- Считать `preventDefault` остановкой bubbling.
- Удалять новую anonymous function.
- Делегировать non-bubbling событие без проверки.

## Дополнительные вопросы

- Как события проходят Shadow DOM?
- Для чего passive listener?

