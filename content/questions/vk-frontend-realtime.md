---
id: vk-frontend-realtime
title: Как реализуете real-time функционал в React-приложении?
category: Frontend
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["VK"]
level: Senior
stage: Техническое
tags: ["React", "WebSocket", "Real-time"]
duration: 15 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

WebSocket, Server-Sent Events, polling. Важно: reconnection, state synchronization, offline support.

## Контекст

Проверяют понимание real-time коммуникации.

## Как строить ответ

### WebSocket

Когда использовать: bidirectional communication.

### SSE

Когда использовать: server → client updates.

### State Sync

Какsync-аете state: optimistic updates, reconciliation.

## Пример ответа

WebSocket для чата: connection, reconnection, heartbeat. SSE для уведомлений. Optimistic updates для UI. State: normalized, сversioning. Результат: real-time UX, offline support.

## Частые ошибки

- Not handling reconnection
- Not syncing state
- Blocking UI
- No offline support

## Дополнительные вопросы

- Какhandling-аете disconnection?
- Какsync-аете state между tabs?
- Какoptimistic-ски updates делаете?
