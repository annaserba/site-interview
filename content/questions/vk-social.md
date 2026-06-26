---
id: vk-social
title: Как VK масштабирует social features?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["VK"]
level: Senior
stage: Архитектура
tags: ["Social", "Scale", "Architecture"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

VK scaling: news feed (fan-out on write/read), notifications (push system), content delivery (CDN), social graph (relationships). Ключевые: millions users, real-time updates, high availability.

## Контекст

Ключевой domain для social network. Проверяют понимание social architecture.

## Как строить ответ

### News feed

Fan-out on write: pre-compute feeds. Fan-out on read: compute on demand. Hybrid approach.

### Notifications

Push notifications: mobile, web, email. Priority: urgent vs normal. Delivery guarantees.

### Social graph

User relationships. Friend recommendations. Graph traversal.

## Пример ответа

News feed: user posts → fan-out to followers' feeds. For celebrities: fan-out on read (too many followers). Notifications: push to 100M devices → priority queue → delivery tracking.

## Частые ошибки

- Не учитывать celebrity users
- Игнорировать notification delivery
- Не масштабировать social graph
- Не кешировать news feed

## Дополнительные вопросы

- Как работает fan-out на write vs read?
- What is push notification system?
- How to handle celebrity users в social network?
