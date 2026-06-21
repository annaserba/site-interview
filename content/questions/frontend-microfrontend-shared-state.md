---
id: frontend-microfrontend-shared-state
title: Как организовать общее состояние между микрофронтендами?
category: Frontend Architecture
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Tech Lead"]
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

## Частые ошибки

- Делить глобальный mutable store.
- Передавать события без схемы и владельца.
- Дублировать server state без политики согласованности.

## Дополнительные вопросы

- Когда общий store допустим?
- Как тестировать совместимость релизов?

