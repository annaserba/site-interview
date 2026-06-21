---
id: wildberries-websocket-sse
title: Когда выбирать WebSocket, SSE или polling?
category: Web Architecture
scope: multi-language
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "Backend-разработчик"]
companies: ["Wildberries"]
level: Senior
stage: Архитектура
tags: ["WebSocket", "SSE", "Realtime"]
duration: 18 мин
difficulty: 5
sourceCompany: Wildberries
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=HF7zkpSrByE&t=1276s"
---

## Короткий ответ

WebSocket даёт постоянный двунаправленный канал и подходит чатам, collaborative editing и частому обмену. SSE — однонаправленный server→client поток поверх HTTP с встроенным reconnect и event id, удобный для уведомлений и прогресса. Polling проще и устойчив к инфраструктуре, но добавляет задержку и пустой трафик. Выбор зависит от направления, частоты, ordering, delivery guarantees, proxy support и стоимости удержания соединений.

## Контекст

Нужно спроектировать не только клиентский API, но и reconnect, масштабирование и backpressure.

## Как строить ответ

### Уточнить поток

Нужны ли сообщения client→server, какая допустимая latency и частота событий.

### Спроектировать восстановление

Heartbeat, exponential backoff, last event id, sequence numbers, idempotency и resync snapshot.

### Масштабировать

Connection gateway отделяют от бизнес-сервисов; состояние и fan-out выносят в broker, а не полагаются на sticky sessions как единственный механизм.

## Частые ошибки

- Выбирать WebSocket только потому, что он realtime.
- Не проектировать reconnect и пропущенные события.
- Хранить всё connection state только в одном процессе.

## Дополнительные вопросы

- Как обеспечить ordering после reconnect?
- Что делать с медленным клиентом?
- Когда long polling остаётся лучшим выбором?
