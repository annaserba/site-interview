---
id: vk-interview-scale
title: Как масштабировать chat system на миллионы пользователей?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["VK"]
level: Senior
stage: Архитектура
tags: ["Chat", "Scale", "Real-time"]
duration: 15 мин
difficulty: 5
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Chat system: WebSocket connections, message storage, presence, delivery guarantees. Ключевые: horizontal scaling, message ordering, offline support.

## Контекст

Типичный system design вопрос для соцсети. Проверяют ability проектировать chat.

## Как строить ответ

### Connections

WebSocket: persistent connections. Connection pooling. Load balancing: consistent hashing.

### Message storage

Write: append to chat log. Read: last N messages. Sharding: по chat ID.

### Delivery

Online: push via WebSocket. Offline: push notifications. Read receipts.

## Пример ответа

1M concurrent connections: 100 servers, 10K connections each. Message: append to Kafka → consumers → storage. Order: sequence numbers per chat. Delivery: online → WebSocket, offline → push.

## Частые ошибки

- Не масштабировать WebSocket connections
- Игнорировать message ordering
- Не делать offline support
- Не планировать delivery guarantees

## Дополнительные вопросы

- How to handle message ordering?
- What is presence system?
- How to implement read receipts?
