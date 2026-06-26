---
id: klp-batch-processing
title: Batch vs Stream processing: когда что использовать?
category: System Design
scope: universal
languages: []
roles: ["Backend", "Data Engineering"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["Distributed Systems", "Batch Processing", "MapReduce"]
duration: 10 мин
difficulty: 3
secondaryCategory: Data Engineering
---

## Короткий ответ

Batch: обработка завершённых datasets (MapReduce, Spark). Stream: continuous data flow (Kafka Streams, Flink). Batch проще, дешевле, но latency высокая. Stream — real-time, но сложнее в operational aspect.

## Контекст

Фундаментальное сравнение. Проверяют понимание trade-offs и выбор правильного инструмента.

## Как строить ответ

### Batch processing

MapReduce, Hadoop, Spark. Преимущества: fault tolerance через re-execution, простота, масштабируемость.

### Stream processing

Kafka Streams, Flink, Storm. Преимущества: low latency, real-time analytics.

### Гибрид

Lambda architecture: batch + stream. Kappa architecture: только stream.

## Пример ответа

Batch: ежедневный отчёт по продажам — Spark job обрабатывает данные за день. Преимущество: простота, fault tolerance. Stream: real-time дашборд — Kafka Streams обрабатывает события по мере поступления. Преимущество: latency ~1ms. Lambda: batch для historical, stream для real-time. Kappa: только stream, batch — это replay stream.

## Частые ошибки

- Использовать stream для batch задач
- Игнорировать operational complexity stream
- Не учитывать exactly-once semantics
- Не планировать state management

## Дополнительные вопросы

- Что такое MapReduce и как он работает?
- Как выбрать между Spark и Flink?
- Что такое Lambda vs Kappa architecture?
