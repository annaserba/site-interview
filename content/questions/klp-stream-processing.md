---
id: klp-stream-processing
title: Как работает stream processing в распределённых системах?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Stream Processing", "Kafka"]
duration: 10 мин
difficulty: 4
secondaryCategory: Data Engineering
---

## Короткий ответ

Stream processing — обработка данных в реальном времени по мере поступления. Ключевые concept: backpressure, windowing, exactly-once semantics. Инструменты: Kafka Streams, Flink, Spark Streaming.

## Контекст

Важный topic для проектирования real-time систем. Проверяют понимание differences между batch и stream processing.

## Как строить ответ

### Batch vs Stream

Batch: обработка завершённых datasets. Stream: обработка continuous data flow.

### Windowing

Tumbling, sliding, session windows для агрегации данных за период.

### Backpressure

Механизм контроля скорости: если consumer не успевает — producer замедляется.

## Пример ответа

Kafka Streams: обработка событий из Kafka topics. Windowing: сумма заказов за последние 5 минут (tumbling window). Exactly-once: транзакции между read и write. Backpressure:如果consumer lag растёт — broker apply背压. Flink: stateful processing, checkpointing для fault tolerance. Сравнение: Spark Streaming — micro-batch (latency ~100ms), Flink — true streaming (latency ~1ms).

## Частые ошибки

- Не обрабатывать backpressure
- Игнорировать exactly-once semantics
- Не планировать state management
- Путать micro-batch и true streaming

## Дополнительные вопросы

- Что такое windowing и какие типы существуют?
- Как обеспечить exactly-once в Kafka Streams?
- Что такое event time vs processing time?
