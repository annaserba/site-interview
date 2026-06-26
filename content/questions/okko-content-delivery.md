---
id: okko-content-delivery
title: как Okko оптимизирует доставку контента пользователям?
category: System Design
scope: universal
languages: []
roles: ["Backend"]
companies: ["Okko"]
level: Senior
stage: Архитектура
tags: ["CDN", "Streaming", "Performance"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Content delivery: CDN (edge locations), adaptive streaming (HLS/DASH), prefetching, device optimization. Ключевые: minimize latency, maximize quality, reduce buffering.

## Контекст

Ключевой aspect для streaming quality. Проверяют понимание content delivery.

## Как строить ответ

### CDN

Edge locations: nearby servers. Caching: video segments. Origin: source storage.

### Adaptive streaming

Multiple quality levels. Client-side switching. Bandwidth estimation.

### Prefetching

Predict user behavior. Pre-load next episodes. Pre-buffer: reduce start time.

## Пример ответа

CDN: user in Moscow → edge server Moscow → 10ms latency. Adaptive: 100 Mbps → 4K, 10 Mbps → 720p. Prefetch: user watching episode 1 → preload episode 2.

## Частые ошибки

- Не использовать CDN
- Игнорировать adaptive bitrate
- Не prefetching popular content
- Не оптимизировать для devices

## Дополнительные вопросы

- How to optimize CDN caching strategy?
- What is prefetching для video?
- How to reduce buffering complaints?
