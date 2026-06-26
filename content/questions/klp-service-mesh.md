---
id: klp-service-mesh
title: Что такое service mesh и зачем он нужен?
category: System Design
scope: universal
languages: []
roles: ["Backend", "DevOps"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Service Mesh", "Microservices"]
duration: 10 мин
difficulty: 3
secondaryCategory: DevOps
---

## Короткий ответ

Service mesh — инфраструктурный слой для communication между microservices. Обеспечивает: service discovery, load balancing, encryption, observability. Инструменты: Istio, Linkerd, Consul Connect. Sidecar pattern: proxy рядом с каждым service.

## Контекст

Важный concept для microservices architectures. Проверяют понимание operational challenges.

## Как строить ответ

### Проблема

Microservices: много service-to-service communication. Каждый service должен реализовать: discovery, load balancing, security, observability.

### Решение

Service mesh: выносит networking logic в infrastructure layer. Sidecar proxy: envoy, linkerd2-proxy.

### Компоненты

Data plane: proxies handles traffic. Control plane: manages proxy configuration.

## Пример ответа

Istio: Envoy sidecar proxy в каждом pod. Traffic management: routing, retries, timeouts. Security: mTLS between services. Observability: distributed tracing, metrics. Control plane: istiod manages Envoy configuration. Преимущество: networking logic centralized, not duplicated. Недостаток: latency overhead, complexity.

## Частые ошибки

- Добавлять service mesh без необходимости
- Игнорировать latency overhead
- Не планировать observability
- Не учитывать operational complexity

## Дополнительные вопросы

- Как работает mTLS в service mesh?
- Что такое Istio vs Linkerd?
- Как service mesh связан с zero trust networking?
