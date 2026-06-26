---
id: okko-streaming
title: Как Okko обеспечивает video streaming?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Okko"]
level: Senior
stage: Архитектура
tags: ["Streaming", "Video", "CDN"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Okko streaming: adaptive bitrate (HLS/DASH), CDN delivery, content encoding, DRM protection, recommendation engine. Ключевые: quality of experience, latency, content protection.

## Контекст

Ключевой domain для streaming service. Проверяют понимание video architecture.

## Как строить ответ

### Adaptive bitrate

Multiple quality levels. Client switches based on bandwidth. HLS/DASH protocols.

### CDN

Edge caching: video chunks geographically distributed. Origin: source storage.

### DRM

Content protection: Widevine, FairPlay. License server: authentication.

## Пример ответа

Video: 4K source → encode to 1080p, 720p, 480p → HLS segments → CDN → client player. Adaptive: bandwidth drops → switch to 720p. DRM: license key → decrypt playback.

## Частые ошибки

- Не использовать adaptive bitrate
- Игнорировать CDN costs
- Не защищать контент DRM
- Не оптимизировать encoding

## Дополнительные вопросы

- Как работает adaptive bitrate streaming?
- What is DRM и зачем он нужен?
- How to optimize video encoding costs?
