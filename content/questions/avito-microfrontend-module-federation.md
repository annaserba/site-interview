---
id: avito-microfrontend-module-federation
title: Как устроены микрофронтенды с Module Federation в large-scale приложении?
category: Frontend Architecture
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["Avito"]
level: Senior
stage: Архитектура
tags: ["Micro-frontends", "Module Federation", "Webpack", "Architecture"]
duration: 15 мин
difficulty: 5
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Module Federation позволяет загружать модули из других приложений в runtime без пересборки. Каждый микрофронтенд — отдельное приложение с независимым деплоем. Основные проблемы: SSR, shared state, изоляция стилей, конфликты версий зависимостей.

## Контекст

Интервьюер проверяет знание архитектуры микрофронтендов на Module Federation, понимание проблем масштабирования, SSR, sharing зависимостей и независимого деплоя.

## Как строить ответ

### Объяснить Module Federation

Webpack 5 позволяет приложению (host) загружать модули из другого приложения (remote) в runtime. Remote экспортирует компоненты, host импортирует и рендерит.

### Разобрать shared зависимости

React, React DOM и другие общие зависимости указываются в shared — загружается одна версия. Проблема: если версии несовместимы, возникают ошибки runtime.

### Описать SSR

SSR в микрофронтендах сложен: сервер host должен загружать remote-компоненты, что требует серверного fetch и обработки ошибок.

### Показать изоляцию стилей

CSS-in-JS, CSS Modules, Shadow DOM — каждый микрофронтенд должен изолировать стили, чтобы не конфликтовать.

## Код из интервью

```javascript
// webpack.config.js — Host (основное приложение)
new ModuleFederationPlugin({
  name: "host",
  remotes: {
    search: "search@https://search.avito.ru/remoteEntry.js",
    checkout: "checkout@https://checkout.avito.ru/remoteEntry.js",
  },
  shared: {
    react: { singleton: true, requiredVersion: "^18.0.0" },
    "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
  },
});

// webpack.config.js — Remote (микрофронтенд)
new ModuleFederationPlugin({
  name: "search",
  filename: "remoteEntry.js",
  exposes: {
    "./SearchWidget": "./src/components/SearchWidget",
    "./Filters": "./src/components/Filters",
  },
  shared: {
    react: { singleton: true, requiredVersion: "^18.0.0" },
  },
});

// Host — динамический импорт
const SearchWidget = React.lazy(
  () => import("search/SearchWidget")
);

function App() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <SearchWidget />
    </Suspense>
  );
}
```

## Пример ответа

Module Federation — это Webpack 5 фича, которая позволяет загружать компоненты из других приложений в runtime. Host приложение указывает remotes в конфиге, а remote экспортирует модули через exposes.

Shared зависимости (React, React DOM) загружаются один раз — это критично для производительности. Проблема: singleton: true требует совместимых версий, иначе — runtime ошибки.

SSR сложен: сервер host должен fetch'ить remoteEntry.js, загрузить модуль и отрендерить на сервере. Это добавляет latency и обработку ошибок.

Изоляция стилей решается через CSS-in-JS (каждый remote рендерит свои стили) или Shadow DOM. Независимый деплой — каждый микрофронтенд деплоится отдельно, host не пересобирается.

## Частые ошибки

- Не использовать singleton для React — загрузится две версии, хуки не будут работать.
- Игнорировать SSR — контент не индексируется поисковиками.
- Не изолировать стили — конфликты CSS между микрофронтендами.
- Забывать про error boundaries — падение remote не должно ломать host.

## Дополнительные вопросы

- Как обновить remote без пересборки host?
- Какие альтернативы Module Federation существуют?
- Как тестировать микрофронтенды изолированно?
- Как обрабатывать shared state между микрофронтендами?
