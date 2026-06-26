---
id: http2-http3
title: Чем HTTP/2 и HTTP/3 отличаются от HTTP/1.1?
category: System Design
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["HTTP", "HTTP/2", "HTTP/3", "Performance"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

HTTP/2: multiplexing, header compression, server push, binary protocol. HTTP/3: QUIC protocol (UDP), 0-RTT connection, no head-of-line blocking. Преимущества: speed, performance, reliability.

## Контекст

Эволюция HTTP protocol. Проверяют понимание modern web protocols.

## Как строить ответ

### HTTP/2

Multiplexing: параллельные streams в одном connection. Header compression: HPACK. Server push: proactively send resources.

### HTTP/3

QUIC: UDP-based, eliminates TCP head-of-line blocking. 0-RTT: мгновенное подключение. Connection migration: network switching.

### Сравнение

HTTP/1.1: one request per connection. HTTP/2: multiplexing. HTTP/3: UDP + QUIC.

## Пример ответа

HTTP/2: 10 images → 1 connection, 10 parallel streams. HTTP/1.1: 10 connections. HTTP/3: QUIC → no TCP head-of-line blocking → faster page load.

## Частые ошибки

- Не использовать HTTP/2
- Игнорировать server push
- Не тестировать HTTP/3
- Забывать про fallback

## Дополнительные вопросы

- Как работает multiplexing в HTTP/2?
- Что такое QUIC protocol?
- Как связать HTTP/3 и CDN?
