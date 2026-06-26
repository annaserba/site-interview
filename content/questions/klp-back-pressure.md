---
id: klp-back-pressure
title: Что такое backpressure и как его реализовать?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Backpressure", "Flow Control"]
duration: 10 мин
difficulty: 3
secondaryCategory: Algorithms
---

## Короткий ответ

Backpressure — механизм контроля скорости, когда consumer не успевает обрабатывать данные от producer. Реализуется через: bounded queues, reactive streams, TCP flow control, rate limiting.

## Контекст

Важный concept для resilient systems. Проверяют понимание как обрабатывать overload situations.

## Как строить ответ

### Проблема

Producer генерирует быстрее, чем consumer обрабатывает. Queue растёт, memory exhaustion, crash.

### Решения

Bounded queues: блокировка при заполнении. Reactive streams: subscriber управляет скоростью. Rate limiting: ограничение throughput.

### Инструменты

Reactive Streams (Project Reactor, RxJava), Kafka: consumer lag monitoring, TCP: flow control.

## Пример ответа

Bounded queue: ArrayBlockingQueue в Java. Producer: если queue full — block или drop. Consumer: берёт когда ready. Reactive: Flux.publishOn(scheduler). subscriber.request(n) — управляет скоростью. Kafka: consumer lag — разница между latest offset и consumer offset. Если lag растёт — scale consumers.

## Частые ошибки

- Использовать unbounded queues
- Игнорировать backpressure в design
- Не мониторить consumer lag
- Не планировать scaling strategy

## Дополнительные вопросы

- Как работает backpressure в Reactive Streams?
- Что такое consumer lag в Kafka?
- Как реализовать rate limiting?
