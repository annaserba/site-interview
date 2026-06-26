---
id: usetech-angular-microfrontend
title: Как реализовать микрофронтенды в Angular с Single-SPA?
category: Frontend Architecture
scope: language-specific
languages: ["TypeScript"]
roles: ["Frontend"]
companies: ["Usetech"]
level: Senior
stage: Архитектура
tags: ["Angular", "Micro-frontends", "Single-SPA", "Module Federation"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Micro-frontends в Angular через Single-SPA: каждый микрофронтенд — отдельный Angular app с собственным роутером, деплоем и командой. Single-SPA orchestrator загружает и переключает apps по route. Module Federation (Webpack 5) позволяет шарить модули между apps. Проблемы: shared state между apps, изоляция стилей, версии RxJS (поддержка multiple versions), и маршрутизация без конфликтов.

## Контекст

Интервьюер ожидает понимания архитектурных компромиссов Single-SPA vs Module Federation, способов интеграции Angular apps, управления shared dependencies и изоляции.

## Как строить ответ

### Single-SPA vs Module Federation

Single-SPA: orchestration через JS API, загружает entire apps. Module Federation: runtime sharing модулей, более tight integration. Выбор зависит от степени изоляции.

### Routing integration

Каждый микрофронтенд регистрирует свою маршрутизацию. Single-SPA Router Redirect Rules направляют routes к нужному app.

### Shared state patterns

EventBus (CustomEvents) для меж-app коммуникации. Sharedlibs для общих сервисов (auth, API client). Redux/NgRx для локального состояния.

### Style isolation

Angular encapsulation (ViewEncapsulation.Native), CSS Modules, Shadow DOM, или BEM-convention. Single-SPA styles isolation через package naming.

### Dependency management

Дублирование зависимостей (RxJS, Angular core) — проблема. Решение: shared configs, peer dependencies, version pinning.

## Код из интервью

```typescript
// Single-SPA layout orchestrator
// src/main.ts

import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@myorg/navbar',
  app: () => System.import('@myorg/navbar'),
  activeWhen: '/',
});

registerApplication({
  name: '@myorg/dashboard',
  app: () => System.import('@myorg/dashboard'),
  activeWhen: '/dashboard',
});

registerApplication({
  name: '@myorg/settings',
  app: () => System.import('@myorg/settings'),
  activeWhen: '/settings',
});

start();

// Angular microfrontend - bootstrap for Single-SPA
// main.single-spa.ts

import { singleSpaAngular } from 'single-spa-angular';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

const lifecycles = singleSpaAngular({
  bootstrapModuleFactory: () =>
    platformBrowserDynamic().bootstrapModuleFactory(AppModule),
  ngModule: AppModule,
});

export const { bootstrap, mount, unmount } = lifecycles;

// EventBus for cross-app communication
// shared/event-bus.ts

export class EventBus {
  private static instance: EventBus;
  private listeners = new Map<string, Set<Function>>();

  static getInstance(): EventBus {
    if (!EventBus.instance) EventBus.instance = new EventBus();
    return EventBus.instance;
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(callback);
  }

  emit(event: string, data: unknown) {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
}
```

## Пример ответа

Реализуя микрофронтенды в Angular, я использую Single-SPA для orchestration. Каждый микрофронтенд — отдельный Angular app с собственным `package.json`, `angular.json` и маршрутизацией. Layout app (shell) загружает их через `registerApplication` и переключает по route.

Single-SPA vs Module Federation: Single-SPA даёт полную изоляцию (каждый app — отдельный bundle), но нет shared modules. Module Federation (Webpack 5) позволяет шарить модули (библиотеки, компоненты) в runtime, но создаёт tighter coupling. Для нашей команды выбрали Single-SPA — каждая команда деплоит независимо.

Маршрутизация: каждый app регистрирует свой `Router` с `basePath`. Single-SPA `Router Redirect Rules` направляют `/dashboard/*` к dashboard-app, `/settings/*` к settings-app.

Shared state: используем EventBus (CustomEvents) для меж-app коммуникации: navbar dispatches `user-logout`, dashboard ловит и очищает state. Auth service — shared module, импортируемый всеми apps через peer dependencies.

Проблема версий: Angular core и RxJS должны быть одинаковыми версиями во всех apps. Решение — shared `tsconfig` и `package.json` templates, которые синхронизируются через CI/CD.

## Частые ошибки

- Не изолировать стили — глобальные CSS конфликтуют между микрофронтендами.
- Дублировать Angular core и RxJS разных версий, вызывая runtime errors.
- Использовать localStorage для shared state вместо EventBus — теряется реактивность.
- Не предусматривать независимый деплой — один app ломает остальные.
- Игнорировать lazy loading микрофронтендов, загружая все apps сразу.

## Дополнительные вопросы

- Как déploiement независимых микрофронтендов влияет на CI/CD pipeline?
- Как тестировать интеграцию между микрофронтендами?
- Что делать, когда нужно шарить компонент между двумя Angular apps?
- Как мигрировать монолитный Angular app на микрофронтенды постепенно?
