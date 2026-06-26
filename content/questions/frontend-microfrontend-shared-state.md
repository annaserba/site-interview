---
id: frontend-microfrontend-shared-state
title: Как организовать общее состояние между микрофронтендами?
category: Frontend Architecture
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend","Leadership"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Microfrontends", "State management", "Contracts"]
duration: 20 мин
difficulty: 5
sourceCompany: Frontend-интервью
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=ylVbg-ftFTQ&t=104s"
---

## Короткий ответ

Сначала минимизируйте shared state: каждый микрофронтенд владеет своим доменом, а между ними передаются versioned events или маленький shell contract. Authentication/session можно предоставлять через shell API; server state лучше разделять через согласованный cache/query client только при едином runtime. Не экспортируйте внутренний Redux store: это связывает релизы и схемы. Зафиксируйте event schema, ownership, replay/idempotency и совместимость версий.

## Контекст

Проверяется независимость микрофронтендов, а не выбор одной библиотеки.

## Как строить ответ

### Найти владельца данных

Один bounded context изменяет состояние, остальные получают контракт.

### Выбрать канал

Props/shell API, events, URL или backend.

### Обеспечить эволюцию

Schema version, backward compatibility и observability.


## Код из интервью

```yaml
# Module Federation — webpack config

# host webpack.config.js
new ModuleFederationPlugin({
  name: "host",
  remotes: {
    dashboard: "dashboard@http://localhost:3001/remoteEntry.js",
  },
  shared: { react: { singleton: true }, "react-dom": { singleton: true } },
});

# remote webpack.config.js
new ModuleFederationPlugin({
  name: "dashboard",
  filename: "remoteEntry.js",
  exposes: { "./Widget": "./src/Widget" },
  shared: { react: { singleton: true }, "react-dom": { singleton: true } },
});
```

## Пример ответа

Для общего состояния между микрофронтендами использую: 1) Custom Events — window.dispatchEvent(new CustomEvent('state-change', {detail})); 2) Shared Module Federation (Webpack 5) — общий модуль state management; 3) Server-side state — Redis/Kafka как единый источник истины; 4) URL — состояние в query params. На прошлом проекте мы использовали комбинацию: критичные данные (корзина) — через shared module, UI state (тема) — через custom events. Важно: контракты между микрофронтендами — TypeScript interface для shared state. Избегайте: общего Redux store (tight coupling), localStorage (race conditions).

## Частые ошибки

- Делить глобальный mutable store.
- Передавать события без схемы и владельца.
- Дублировать server state без политики согласованности.

## Дополнительные вопросы

- Когда общий store допустим?
- Как тестировать совместимость релизов?

