---
id: klp-load-balancing
title: Как работает load balancing в распределённых системах?
category: System Design
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Load Balancing", "Networking"]
duration: 10 мин
difficulty: 2
secondaryCategory: DevOps
---

## Короткий ответ

Load balancing: распределение requests между instances. Алгоритмы: round-robin, least connections, consistent hashing. L4 (transport) vs L7 (application) load balancers. Health checks, failover, sticky sessions.

## Контекст

Фундаментальный component для scalability. Проверяют понимание algorithms и trade-offs.

## Как строить ответ

### Алгоритмы

Round-robin: поочерёдно. Least connections: fewest active connections. Consistent hashing: sticky sessions.

### Уровни

L4: TCP/UDP level, faster. L7: HTTP level, content-based routing.

### Инструменты

Nginx, HAProxy, AWS ALB/NLB, Envoy.

## Пример ответа

Round-robin: request1 → instance1, request2 → instance2. Least connections: если instance1 loaded — route to instance2. Consistent hashing: один и тот же client всегда идёт на один instance. L7: Nginx routing based on URL path. Health checks: каждые 5 секунд, если fail — remove из pool. Failover: автоматическое переключение при failure.

## Частые ошибки

- Не использовать health checks
- Игнорировать session affinity
- Не планировать failover
- Не мониторить load distribution

## Дополнительные вопросы

- Как работает consistent hashing в load balancer?
- Что такое health checks и как их настроить?
- Как выбрать между L4 и L7?
