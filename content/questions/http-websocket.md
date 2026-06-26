---
id: http-websocket
title: Что такое WebSocket и когда его использовать?
category: JavaScript
scope: universal
languages: []
roles: ["Backend", "Frontend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["HTTP", "WebSocket", "Real-time"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

WebSocket: two-way communication protocol для real-time. Отличия от HTTP: persistent connection, server push, lower overhead. Use cases: chat, notifications, live data, gaming. Fallback: SSE, long polling.

## Контекст

Альтернатива HTTP для real-time. Проверяют понимание when to use WebSocket.

## Как строить ответ

### HTTP vs WebSocket

HTTP: request-response, stateless, overhead headers. WebSocket: persistent, bidirectional, frames.

### Установка

HTTP upgrade handshake → WebSocket connection → bidirectional messaging.

### Use cases

Chat: real-time messaging. Notifications: server push. Live data: stock prices, sports. Gaming: low-latency updates.

## Пример ответа

Chat app: HTTP для login, registration. WebSocket для messages. Flow: HTTP GET /token → WebSocket connection → send/receive messages. Server: broadcast to all connected clients.

## Частые ошибки

- Использовать WebSocket для всего
- Не обрабатывать disconnection
- Не делать fallback (SSE, long polling)
- Игнорировать scalability

## Дополнительные вопросы

- Как обрабатывать reconnection?
- Что такое Server-Sent Events?
- Как масштабировать WebSocket connections?
