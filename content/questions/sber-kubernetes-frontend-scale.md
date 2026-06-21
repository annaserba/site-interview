---
id: sber-kubernetes-frontend-scale
title: Как горизонтально масштабировать frontend-приложение в Kubernetes?
category: System Design
scope: multi-language
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend-разработчик", "DevOps", "Tech Lead"]
companies: ["Сбер"]
level: Senior
stage: Архитектура
tags: ["Kubernetes", "Scaling", "CDN"]
duration: 20 мин
difficulty: 5
sourceCompany: Сбер
sourceType: youtube
sourceUrl: "https://www.youtube.com/watch?v=C0xSErqNYeU&t=4663s"
---

## Короткий ответ

Статическую SPA рациональнее раздавать через object storage и CDN; Kubernetes нужен, если есть SSR/BFF или инфраструктурное ограничение. Для контейнерной раздачи: immutable image с Nginx, несколько stateless replicas, Deployment, Service и Ingress, readiness/liveness probes, resource requests/limits и HPA по подходящей метрике. Assets должны иметь content hash и долгий cache, HTML — короткий cache. WebSocket требует отдельной стратегии соединений и shared state.

## Контекст

Проверяется понимание всей цепочки доставки, а не только количества pod.

## Как строить ответ

### Выбрать слой раздачи

CDN для assets; cluster — для динамического runtime.

### Настроить отказоустойчивость

Replicas, probes, rolling update, PDB и rollback.

### Масштабировать по сигналу

CPU недостаточно для всех сценариев: учитывайте RPS, latency и active connections.

## Частые ошибки

- Хранить пользовательскую сессию в pod.
- Масштабировать статику без CDN.
- Забывать readiness при rolling update.

## Дополнительные вопросы

- Как масштабировать WebSocket?
- Где завершать TLS?

