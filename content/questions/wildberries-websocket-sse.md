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


## Код из интервью

```yaml
// Сравнение: WebSocket vs SSE vs Polling

// === WebSocket ===
const ws = new WebSocket("wss://api.example.com");
ws.onmessage = (e) => handleEvent(JSON.parse(e.data));
ws.send(JSON.stringify({ type: "message", data: "hi" }));

// === SSE ===
const es = new EventSource("/api/events");
es.onmessage = (e) => handleEvent(JSON.parse(e.data));
es.onerror = () => es.close(); // auto-reconnect built-in

// === Polling ===
setInterval(async () => {
  const res = await fetch("/api/updates?since=" + lastId);
  const data = await res.json();
  handleEvent(data);
}, 5000);
```

## Пример ответа

WebSocket — двунаправленная связь (real-time chat, gaming, collaborative editing). SSE (Server-Sent Events) — сервер → клиент (live feeds, notifications, updates). Polling — клиент опрашивает сервер (просто, но неэффективно). Выбор: 1) WebSocket: нужен двусторонний обмен (чат, multiplayer game); 2) SSE: сервер отправляет обновления (новости, stock prices, progress); 3) Polling: если нет real-time требований или нужно простое решение. На практике: для уведомлений использую SSE (проще, auto-reconnect), для чата — WebSocket. HTTP/2 Server Push — альтернатива для кэширования ресурсов, но не для real-time.

## Частые ошибки

- Выбирать WebSocket только потому, что он realtime.
- Не проектировать reconnect и пропущенные события.
- Хранить всё connection state только в одном процессе.

## Дополнительные вопросы

- Как обеспечить ordering после reconnect?
- Что делать с медленным клиентом?
- Когда long polling остаётся лучшим выбором?
