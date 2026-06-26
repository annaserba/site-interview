---
id: security-rate-limiting
title: Как реализовать rate limiting для защиты от атак?
category: Backend
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["Security", "Rate Limiting", "DDoS"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Rate limiting: ограничение количества requests за период. Алгоритмы: fixed window, sliding window, token bucket. Инструменты: nginx, Redis, API Gateway. Защита от: brute force, DDoS, scraping.

## Контекст

Важный security mechanism. Проверяют понимание rate limiting strategies.

## Как строить ответ

### Алгоритмы

Fixed window: counter per minute. Sliding window: более плавный. Token bucket: allow bursts.

### Реализация

Nginx: `limit_req_zone`. Redis: INCR + EXPIRE. API Gateway: built-in rate limiting.

### Стратегии

Per IP: anti-DDoS. Per user: anti-abuse. Per endpoint: protect expensive operations.

## Пример ответа

Nginx: `limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s`. Redis: `INCR key; EXPIRE key 60`. Response: 429 Too Many Requests. Headers: X-RateLimit-Limit, X-RateLimit-Remaining.

## Частые ошибки

- Не делать rate limiting
- Не возвращать 429 status code
- Не логировать превышения
- Не учитывать X-Forwarded-For

## Дополнительные вопросы

- Как выбрать алгоритм rate limiting?
- Что такое token bucket?
- Как связать rate limiting и DDoS protection?
