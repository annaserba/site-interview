---
id: klp-distributed-lock
title: Как реализовать distributed lock в распределённых системах?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Distributed Lock", "Redis"]
duration: 10 мин
difficulty: 4
secondaryCategory: Algorithms
---

## Короткий ответ

Distributed lock: механизм для mutual exclusion в distributed systems. Реализации: Redis (SET NX EX), ZooKeeper (ephemeral nodes), etcd (leases). Проблемы: clock skew, fencing, expiration. Безопасность: fencing tokens, Redlock algorithm.

## Контекст

Продвинутый topic для coordination. Проверяют понимание trade-offs и failure modes.

## Как строить ответ

### Redis

SET key value NX EX ttl. Преимущество: simple, fast. Недостаток: clock skew, no fencing.

### ZooKeeper

Ephemeral znodes: lock holder. Преимущество: strong guarantees. Недостаток: complexity.

### Проблемы

Clock skew: locks expire prematurely. Fencing: guarantee mutual exclusion即使 failure.

## Пример ответа

Redis: SET lock-key owner-id NX EX 30. Release: DEL lock-key (check owner). Problem: clock skew — lock expires early. Solution: fencing token. Redlock: N Redis instances, majority lock. ZooKeeper: ephemeral znode, owner check. Fencing: monotonically increasing token, storage validates token.

## Частые ошибки

- Использовать simple SET NX без fencing
- Не обрабатывать clock skew
- Игнорировать lock expiration
- Не планировать deadlock scenarios

## Дополнительные вопросы

- Как работает Redlock algorithm?
- Что такое fencing token?
- Как связаны distributed lock и consensus?
